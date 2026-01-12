// Multi-provider Stock API - Complete metrics coverage

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
      return null;
    }
  }

  // Run all fetches in parallel for speed
  const [
    finnhubQuote,
    finnhubProfile,
    finnhubMetrics,
    finnhubRec,
    finnhubTarget,
    fmpProfile,
    fmpRatios,
    fmpKeyMetrics,
    fmpIncome,
    fmpCashFlow,
    fmpGrowth,
    yahooChart
  ] = await Promise.all([
    safeFetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`),
    safeFetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_KEY}`),
    safeFetch(`https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_KEY}`),
    safeFetch(`https://finnhub.io/api/v1/stock/recommendation?symbol=${symbol}&token=${FINNHUB_KEY}`),
    safeFetch(`https://finnhub.io/api/v1/stock/price-target?symbol=${symbol}&token=${FINNHUB_KEY}`),
    safeFetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${FMP_KEY}`),
    safeFetch(`https://financialmodelingprep.com/api/v3/ratios-ttm/${symbol}?apikey=${FMP_KEY}`),
    safeFetch(`https://financialmodelingprep.com/api/v3/key-metrics-ttm/${symbol}?apikey=${FMP_KEY}`),
    safeFetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?period=annual&limit=2&apikey=${FMP_KEY}`),
    safeFetch(`https://financialmodelingprep.com/api/v3/cash-flow-statement/${symbol}?period=annual&limit=1&apikey=${FMP_KEY}`),
    safeFetch(`https://financialmodelingprep.com/api/v3/financial-growth/${symbol}?period=annual&limit=1&apikey=${FMP_KEY}`),
    safeFetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=${range}`)
  ]);

  // 1. FINNHUB Quote
  if (finnhubQuote && finnhubQuote.c) {
    result.price.current = finnhubQuote.c;
    result.price.change = finnhubQuote.d;
    result.price.changePercent = finnhubQuote.dp ? finnhubQuote.dp / 100 : null;
    result.price.dayHigh = finnhubQuote.h;
    result.price.dayLow = finnhubQuote.l;
    result.price.open = finnhubQuote.o;
    result.price.previousClose = finnhubQuote.pc;
  }

  // 2. FINNHUB Profile
  if (finnhubProfile && finnhubProfile.name) {
    result.company.name = finnhubProfile.name;
    result.company.sector = finnhubProfile.finnhubIndustry;
    result.company.industry = finnhubProfile.finnhubIndustry;
    result.company.headquarters = finnhubProfile.country;
    result.company.website = finnhubProfile.weburl;
    result.fundamentals.marketCap = finnhubProfile.marketCapitalization ? finnhubProfile.marketCapitalization * 1e6 : null;
    result.fundamentals.sharesOutstanding = finnhubProfile.shareOutstanding ? finnhubProfile.shareOutstanding * 1e6 : null;
  }

  // 3. FINNHUB Metrics
  if (finnhubMetrics && finnhubMetrics.metric) {
    const m = finnhubMetrics.metric;
    result.fundamentals.peRatio = m.peBasicExclExtraTTM || m.peTTM || null;
    result.fundamentals.beta = m.beta || null;
    result.fundamentals.priceToBook = m.pbQuarterly || m.pbAnnual || null;
    result.fundamentals.priceToSales = m.psQuarterly || m.psAnnual || null;
    result.fundamentals.dividendYield = m.dividendYieldIndicatedAnnual ? m.dividendYieldIndicatedAnnual / 100 : null;
    result.price.high52w = m['52WeekHigh'] || null;
    result.price.low52w = m['52WeekLow'] || null;
    result.financials.grossMargin = m.grossMarginTTM ? m.grossMarginTTM / 100 : null;
    result.financials.operatingMargin = m.operatingMarginTTM ? m.operatingMarginTTM / 100 : null;
    result.financials.profitMargin = m.netProfitMarginTTM ? m.netProfitMarginTTM / 100 : null;
    result.financials.currentRatio = m.currentRatioQuarterly || null;
    result.financials.debtToEquity = m.totalDebtToEquityQuarterly || null;
    result.financials.revenueGrowth = m.revenueGrowthTTMYoy ? m.revenueGrowthTTMYoy / 100 : null;
  }

  // 4. FINNHUB Recommendations
  if (finnhubRec && finnhubRec.length > 0) {
    const latest = finnhubRec[0];
    result.analysts.numBuy = (latest.strongBuy || 0) + (latest.buy || 0);
    result.analysts.numHold = latest.hold || 0;
    result.analysts.numSell = (latest.sell || 0) + (latest.strongSell || 0);
    const total = result.analysts.numBuy + result.analysts.numHold + result.analysts.numSell;
    if (total > 0) {
      result.analysts.recommendationScore = ((latest.strongBuy || 0) * 1 + (latest.buy || 0) * 2 + (latest.hold || 0) * 3 + (latest.sell || 0) * 4 + (latest.strongSell || 0) * 5) / total;
      result.analysts.numberOfAnalysts = total;
    }
  }

  // 5. FINNHUB Price Target
  if (finnhubTarget && finnhubTarget.targetMean) {
    result.analysts.targetPrice = finnhubTarget.targetMean;
    result.analysts.targetHigh = finnhubTarget.targetHigh;
    result.analysts.targetLow = finnhubTarget.targetLow;
  }

  // 6. FMP Profile (IMPORTANT - has description)
  if (fmpProfile && fmpProfile[0]) {
    const p = fmpProfile[0];
    result.company.description = p.description || null;
    result.company.name = result.company.name || p.companyName;
    result.company.sector = result.company.sector || p.sector;
    result.company.industry = p.industry || result.company.industry;
    result.company.headquarters = p.city && p.country ? `${p.city}, ${p.country}` : result.company.headquarters;
    result.company.website = result.company.website || p.website;
    result.company.employees = p.fullTimeEmployees || null;
    result.fundamentals.marketCap = result.fundamentals.marketCap || p.mktCap;
    result.fundamentals.beta = result.fundamentals.beta || p.beta;
    result.fundamentals.avgVolume = p.volAvg || null;
    // FMP has live price too
    if (!result.price.current) {
      result.price.current = p.price;
      result.price.change = p.changes;
    }
  }

  // 7. FMP Ratios TTM (Forward P/E, more ratios)
  if (fmpRatios && fmpRatios[0]) {
    const r = fmpRatios[0];
    result.fundamentals.peRatio = result.fundamentals.peRatio || r.peRatioTTM;
    result.fundamentals.forwardPe = r.priceEarningsToGrowthRatioTTM ? result.fundamentals.peRatio / r.priceEarningsToGrowthRatioTTM : null; // Approximate
    result.fundamentals.pegRatio = r.priceEarningsToGrowthRatioTTM || null;
    result.fundamentals.priceToBook = result.fundamentals.priceToBook || r.priceToBookRatioTTM;
    result.fundamentals.priceToSales = result.fundamentals.priceToSales || r.priceToSalesRatioTTM;
    result.fundamentals.dividendYield = result.fundamentals.dividendYield || r.dividendYieldTTM;
    result.financials.returnOnEquity = r.returnOnEquityTTM || null;
    result.financials.returnOnAssets = r.returnOnAssetsTTM || null;
    result.financials.grossMargin = result.financials.grossMargin || r.grossProfitMarginTTM;
    result.financials.operatingMargin = result.financials.operatingMargin || r.operatingProfitMarginTTM;
    result.financials.profitMargin = result.financials.profitMargin || r.netProfitMarginTTM;
    result.financials.currentRatio = result.financials.currentRatio || r.currentRatioTTM;
    result.financials.debtToEquity = result.financials.debtToEquity || r.debtEquityRatioTTM;
    result.financials.quickRatio = r.quickRatioTTM || null;
  }

  // 8. FMP Key Metrics TTM (EV metrics)
  if (fmpKeyMetrics && fmpKeyMetrics[0]) {
    const k = fmpKeyMetrics[0];
    result.fundamentals.evRevenue = k.enterpriseValueOverRevenueTTM || null;
    result.fundamentals.evEbitda = k.evToOperatingCashFlowTTM || k.evToFreeCashFlowTTM || null;
    result.fundamentals.pegRatio = result.fundamentals.pegRatio || k.pegRatioTTM;
    result.financials.freeCashFlow = k.freeCashFlowPerShareTTM && result.fundamentals.sharesOutstanding 
      ? k.freeCashFlowPerShareTTM * result.fundamentals.sharesOutstanding 
      : null;
  }

  // 9. FMP Income Statement (Revenue)
  if (fmpIncome && fmpIncome[0]) {
    const inc = fmpIncome[0];
    result.financials.revenue = inc.revenue || null;
    
    // Calculate revenue growth if we have 2 years
    if (fmpIncome[1] && fmpIncome[1].revenue && inc.revenue) {
      result.financials.revenueGrowth = result.financials.revenueGrowth || ((inc.revenue - fmpIncome[1].revenue) / fmpIncome[1].revenue);
    }
    
    // Calculate margins from income statement if not already set
    if (inc.revenue) {
      result.financials.grossMargin = result.financials.grossMargin || (inc.grossProfit ? inc.grossProfit / inc.revenue : null);
      result.financials.operatingMargin = result.financials.operatingMargin || (inc.operatingIncome ? inc.operatingIncome / inc.revenue : null);
      result.financials.profitMargin = result.financials.profitMargin || (inc.netIncome ? inc.netIncome / inc.revenue : null);
    }
  }

  // 10. FMP Cash Flow (Free Cash Flow, Operating Cash Flow)
  if (fmpCashFlow && fmpCashFlow[0]) {
    const cf = fmpCashFlow[0];
    result.financials.freeCashFlow = result.financials.freeCashFlow || cf.freeCashFlow || null;
    result.financials.operatingCashFlow = cf.operatingCashFlow || null;
  }

  // 11. FMP Growth (for accurate revenue growth)
  if (fmpGrowth && fmpGrowth[0]) {
    const g = fmpGrowth[0];
    result.financials.revenueGrowth = result.financials.revenueGrowth || g.revenueGrowth;
  }

  // 12. Yahoo Chart - Price History
  if (yahooChart && yahooChart.chart?.result?.[0]) {
    const chartResult = yahooChart.chart.result[0];
    const timestamps = chartResult.timestamp || [];
    const closes = chartResult.indicators?.quote?.[0]?.close || [];
    
    result.priceHistory = timestamps.map((ts, i) => ({
      timestamp: ts,
      price: closes[i]
    })).filter(d => d.price != null);
    
    // Fallback price data from Yahoo
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
