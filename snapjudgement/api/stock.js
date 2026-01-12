// Multi-provider Stock API with Finnhub + FMP + Yahoo fallbacks

const FINNHUB_KEY = 'd54rt91r01qojbih3rd0d54rt91r01qojbih3rdg';
const FMP_KEY = 'kovea7vfsxUQRXVPdnMOXHHDy92S0TJm';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { ticker, range = '1y' } = req.query;
  
  if (!ticker) {
    return res.status(400).json({ error: 'Ticker symbol required' });
  }
  
  const symbol = ticker.toUpperCase();
  
  // Initialize result
  const result = {
    company: { name: symbol, ticker: symbol, description: null, sector: null, industry: null, headquarters: null, website: null, employees: null },
    price: { current: null, change: null, changePercent: null, high52w: null, low52w: null, dayHigh: null, dayLow: null, open: null, previousClose: null },
    fundamentals: { marketCap: null, beta: null, avgVolume: null, peRatio: null, forwardPe: null, pegRatio: null, priceToSales: null, priceToBook: null, evRevenue: null, evEbitda: null, dividendYield: null, sharesOutstanding: null },
    analysts: { targetPrice: null, targetHigh: null, targetLow: null, recommendationScore: null, recommendationKey: null, numBuy: 0, numHold: 0, numSell: 0, numberOfAnalysts: null },
    financials: { revenue: null, revenueGrowth: null, grossMargin: null, operatingMargin: null, profitMargin: null, returnOnEquity: null, returnOnAssets: null, freeCashFlow: null, operatingCashFlow: null, debtToEquity: null, currentRatio: null, quickRatio: null },
    priceHistory: []
  };

  // Helper to safely fetch
  async function safeFetch(url) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (res.ok) return await res.json();
      return null;
    } catch (e) {
      console.error('Fetch error:', url, e.message);
      return null;
    }
  }

  // 1. FINNHUB - Quote (real-time price)
  const finnhubQuote = await safeFetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`);
  if (finnhubQuote && finnhubQuote.c) {
    result.price.current = finnhubQuote.c;
    result.price.change = finnhubQuote.d;
    result.price.changePercent = finnhubQuote.dp ? finnhubQuote.dp / 100 : null;
    result.price.dayHigh = finnhubQuote.h;
    result.price.dayLow = finnhubQuote.l;
    result.price.open = finnhubQuote.o;
    result.price.previousClose = finnhubQuote.pc;
  }

  // 2. FINNHUB - Company Profile
  const finnhubProfile = await safeFetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_KEY}`);
  if (finnhubProfile && finnhubProfile.name) {
    result.company.name = finnhubProfile.name;
    result.company.sector = finnhubProfile.finnhubIndustry;
    result.company.industry = finnhubProfile.finnhubIndustry;
    result.company.headquarters = finnhubProfile.country;
    result.company.website = finnhubProfile.weburl;
    result.fundamentals.marketCap = finnhubProfile.marketCapitalization ? finnhubProfile.marketCapitalization * 1e6 : null;
    result.fundamentals.sharesOutstanding = finnhubProfile.shareOutstanding ? finnhubProfile.shareOutstanding * 1e6 : null;
  }

  // 3. FINNHUB - Basic Financials/Metrics
  const finnhubMetrics = await safeFetch(`https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_KEY}`);
  if (finnhubMetrics && finnhubMetrics.metric) {
    const m = finnhubMetrics.metric;
    result.fundamentals.peRatio = m.peBasicExclExtraTTM || m.peTTM || null;
    result.fundamentals.beta = m.beta || null;
    result.fundamentals.priceToBook = m.pbQuarterly || m.pbAnnual || null;
    result.fundamentals.priceToSales = m.psQuarterly || m.psAnnual || null;
    result.fundamentals.dividendYield = m.dividendYieldIndicatedAnnual ? m.dividendYieldIndicatedAnnual / 100 : null;
    result.price.high52w = m['52WeekHigh'] || null;
    result.price.low52w = m['52WeekLow'] || null;
    result.financials.returnOnEquity = m.roeTTM ? m.roeTTM / 100 : null;
    result.financials.returnOnAssets = m.roaTTM ? m.roaTTM / 100 : null;
    result.financials.grossMargin = m.grossMarginTTM ? m.grossMarginTTM / 100 : null;
    result.financials.operatingMargin = m.operatingMarginTTM ? m.operatingMarginTTM / 100 : null;
    result.financials.profitMargin = m.netProfitMarginTTM ? m.netProfitMarginTTM / 100 : null;
    result.financials.currentRatio = m.currentRatioQuarterly || null;
    result.financials.debtToEquity = m.totalDebtToEquityQuarterly || null;
    result.financials.revenueGrowth = m.revenueGrowthTTMYoy ? m.revenueGrowthTTMYoy / 100 : null;
  }

  // 4. FINNHUB - Analyst Recommendations
  const finnhubRec = await safeFetch(`https://finnhub.io/api/v1/stock/recommendation?symbol=${symbol}&token=${FINNHUB_KEY}`);
  if (finnhubRec && finnhubRec.length > 0) {
    const latest = finnhubRec[0];
    result.analysts.numBuy = (latest.strongBuy || 0) + (latest.buy || 0);
    result.analysts.numHold = latest.hold || 0;
    result.analysts.numSell = (latest.sell || 0) + (latest.strongSell || 0);
    const total = result.analysts.numBuy + result.analysts.numHold + result.analysts.numSell;
    if (total > 0) {
      // Calculate score 1-5 (1=strong buy, 5=strong sell)
      result.analysts.recommendationScore = ((latest.strongBuy || 0) * 1 + (latest.buy || 0) * 2 + (latest.hold || 0) * 3 + (latest.sell || 0) * 4 + (latest.strongSell || 0) * 5) / total;
      result.analysts.numberOfAnalysts = total;
    }
  }

  // 5. FINNHUB - Price Target
  const finnhubTarget = await safeFetch(`https://finnhub.io/api/v1/stock/price-target?symbol=${symbol}&token=${FINNHUB_KEY}`);
  if (finnhubTarget && finnhubTarget.targetMean) {
    result.analysts.targetPrice = finnhubTarget.targetMean;
    result.analysts.targetHigh = finnhubTarget.targetHigh;
    result.analysts.targetLow = finnhubTarget.targetLow;
  }

  // 6. FMP - Company Profile (for description and more details)
  const fmpProfile = await safeFetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${FMP_KEY}`);
  if (fmpProfile && fmpProfile[0]) {
    const p = fmpProfile[0];
    result.company.description = p.description || null;
    result.company.name = result.company.name || p.companyName;
    result.company.sector = result.company.sector || p.sector;
    result.company.industry = result.company.industry || p.industry;
    result.company.headquarters = p.city && p.country ? `${p.city}, ${p.country}` : result.company.headquarters;
    result.company.website = result.company.website || p.website;
    result.company.employees = p.fullTimeEmployees || null;
    result.fundamentals.marketCap = result.fundamentals.marketCap || p.mktCap;
    result.fundamentals.beta = result.fundamentals.beta || p.beta;
    result.fundamentals.avgVolume = p.volAvg || null;
  }

  // 7. FMP - Key Metrics (fill any gaps)
  const fmpMetrics = await safeFetch(`https://financialmodelingprep.com/api/v3/key-metrics-ttm/${symbol}?apikey=${FMP_KEY}`);
  if (fmpMetrics && fmpMetrics[0]) {
    const m = fmpMetrics[0];
    result.fundamentals.peRatio = result.fundamentals.peRatio || m.peRatioTTM;
    result.fundamentals.priceToBook = result.fundamentals.priceToBook || m.pbRatioTTM;
    result.fundamentals.priceToSales = result.fundamentals.priceToSales || m.priceToSalesRatioTTM;
    result.fundamentals.evRevenue = m.enterpriseValueOverRevenueTTM || null;
    result.fundamentals.evEbitda = m.evToEbitdaTTM || null;
    result.fundamentals.pegRatio = m.pegRatioTTM || null;
    result.fundamentals.dividendYield = result.fundamentals.dividendYield || m.dividendYieldTTM;
    result.financials.returnOnEquity = result.financials.returnOnEquity || m.roeTTM;
    result.financials.returnOnAssets = result.financials.returnOnAssets || m.roaTTM;
    result.financials.debtToEquity = result.financials.debtToEquity || m.debtToEquityTTM;
    result.financials.currentRatio = result.financials.currentRatio || m.currentRatioTTM;
  }

  // 8. FMP - Income Statement for revenue
  const fmpIncome = await safeFetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?period=annual&limit=1&apikey=${FMP_KEY}`);
  if (fmpIncome && fmpIncome[0]) {
    result.financials.revenue = fmpIncome[0].revenue || null;
    result.financials.grossMargin = result.financials.grossMargin || (fmpIncome[0].grossProfit && fmpIncome[0].revenue ? fmpIncome[0].grossProfit / fmpIncome[0].revenue : null);
    result.financials.operatingMargin = result.financials.operatingMargin || (fmpIncome[0].operatingIncome && fmpIncome[0].revenue ? fmpIncome[0].operatingIncome / fmpIncome[0].revenue : null);
    result.financials.profitMargin = result.financials.profitMargin || (fmpIncome[0].netIncome && fmpIncome[0].revenue ? fmpIncome[0].netIncome / fmpIncome[0].revenue : null);
  }

  // 9. FMP - Cash Flow Statement
  const fmpCashFlow = await safeFetch(`https://financialmodelingprep.com/api/v3/cash-flow-statement/${symbol}?period=annual&limit=1&apikey=${FMP_KEY}`);
  if (fmpCashFlow && fmpCashFlow[0]) {
    result.financials.freeCashFlow = fmpCashFlow[0].freeCashFlow || null;
    result.financials.operatingCashFlow = fmpCashFlow[0].operatingCashFlow || null;
  }

  // 10. Yahoo Finance Chart - Price History
  const yahooChart = await safeFetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=${range}`);
  if (yahooChart && yahooChart.chart?.result?.[0]) {
    const chartResult = yahooChart.chart.result[0];
    const timestamps = chartResult.timestamp || [];
    const closes = chartResult.indicators?.quote?.[0]?.close || [];
    
    result.priceHistory = timestamps.map((ts, i) => ({
      timestamp: ts,
      price: closes[i]
    })).filter(d => d.price != null);
    
    // Fallback price data from Yahoo if Finnhub failed
    if (!result.price.current && chartResult.meta) {
      const meta = chartResult.meta;
      result.price.current = meta.regularMarketPrice;
      result.price.previousClose = meta.previousClose || meta.chartPreviousClose;
      result.price.high52w = result.price.high52w || meta.fiftyTwoWeekHigh;
      result.price.low52w = result.price.low52w || meta.fiftyTwoWeekLow;
      result.company.name = result.company.name || meta.longName || meta.shortName;
      if (result.price.current && result.price.previousClose) {
        result.price.change = result.price.current - result.price.previousClose;
        result.price.changePercent = result.price.change / result.price.previousClose;
      }
    }
  }

  // Set recommendation key based on score
  if (result.analysts.recommendationScore) {
    const score = result.analysts.recommendationScore;
    if (score <= 1.5) result.analysts.recommendationKey = 'strongBuy';
    else if (score <= 2.2) result.analysts.recommendationKey = 'buy';
    else if (score <= 2.8) result.analysts.recommendationKey = 'hold';
    else if (score <= 3.5) result.analysts.recommendationKey = 'sell';
    else result.analysts.recommendationKey = 'strongSell';
  }

  return res.status(200).json(result);
};
