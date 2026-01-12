// Multi-provider Stock API with Yahoo quoteSummary for full coverage

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
  async function safeFetch(url, timeout = 6000) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      const response = await fetch(url, { 
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (response.ok) return await response.json();
      return null;
    } catch (e) {
      return null;
    }
  }

  // Yahoo quoteSummary modules - this has EVERYTHING
  const yahooModules = 'assetProfile,summaryDetail,financialData,recommendationTrend,defaultKeyStatistics,price';
  
  // Parallel fetch
  const [
    finnhubQuote,
    finnhubProfile,
    finnhubMetrics,
    finnhubRec,
    finnhubTarget,
    yahooSummary,
    yahooChart
  ] = await Promise.all([
    safeFetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`),
    safeFetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_KEY}`),
    safeFetch(`https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_KEY}`),
    safeFetch(`https://finnhub.io/api/v1/stock/recommendation?symbol=${symbol}&token=${FINNHUB_KEY}`),
    safeFetch(`https://finnhub.io/api/v1/stock/price-target?symbol=${symbol}&token=${FINNHUB_KEY}`),
    safeFetch(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=${yahooModules}`),
    safeFetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=${range}`)
  ]);

  // === YAHOO QUOTE SUMMARY (Primary source for detailed data) ===
  const ySummary = yahooSummary?.quoteSummary?.result?.[0];
  
  if (ySummary) {
    const profile = ySummary.assetProfile || {};
    const detail = ySummary.summaryDetail || {};
    const financial = ySummary.financialData || {};
    const keyStats = ySummary.defaultKeyStatistics || {};
    const price = ySummary.price || {};
    const recTrend = ySummary.recommendationTrend?.trend?.[0] || {};
    
    // Company info
    result.company.description = profile.longBusinessSummary || null;
    result.company.sector = profile.sector || null;
    result.company.industry = profile.industry || null;
    result.company.headquarters = (profile.city && profile.country) ? `${profile.city}, ${profile.country}` : (profile.country || null);
    result.company.website = profile.website || null;
    result.company.employees = profile.fullTimeEmployees || null;
    result.company.name = price.longName || price.shortName || symbol;
    
    // Price info
    result.price.current = price.regularMarketPrice?.raw || null;
    result.price.change = price.regularMarketChange?.raw || null;
    result.price.changePercent = price.regularMarketChangePercent?.raw || null;
    result.price.dayHigh = price.regularMarketDayHigh?.raw || detail.dayHigh?.raw || null;
    result.price.dayLow = price.regularMarketDayLow?.raw || detail.dayLow?.raw || null;
    result.price.open = price.regularMarketOpen?.raw || detail.open?.raw || null;
    result.price.previousClose = price.regularMarketPreviousClose?.raw || detail.previousClose?.raw || null;
    result.price.high52w = detail.fiftyTwoWeekHigh?.raw || null;
    result.price.low52w = detail.fiftyTwoWeekLow?.raw || null;
    
    // Fundamentals
    result.fundamentals.marketCap = price.marketCap?.raw || detail.marketCap?.raw || null;
    result.fundamentals.beta = detail.beta?.raw || null;
    result.fundamentals.avgVolume = detail.averageVolume?.raw || price.averageDailyVolume10Day?.raw || null;
    result.fundamentals.peRatio = detail.trailingPE?.raw || null;
    result.fundamentals.forwardPe = detail.forwardPE?.raw || keyStats.forwardPE?.raw || null;
    result.fundamentals.pegRatio = keyStats.pegRatio?.raw || null;
    result.fundamentals.priceToSales = detail.priceToSalesTrailing12Months?.raw || null;
    result.fundamentals.priceToBook = keyStats.priceToBook?.raw || detail.priceToBook?.raw || null;
    result.fundamentals.evRevenue = keyStats.enterpriseToRevenue?.raw || null;
    result.fundamentals.evEbitda = keyStats.enterpriseToEbitda?.raw || null;
    result.fundamentals.dividendYield = detail.dividendYield?.raw || null;
    result.fundamentals.sharesOutstanding = keyStats.sharesOutstanding?.raw || null;
    
    // Analyst data
    result.analysts.targetPrice = financial.targetMeanPrice?.raw || null;
    result.analysts.targetHigh = financial.targetHighPrice?.raw || null;
    result.analysts.targetLow = financial.targetLowPrice?.raw || null;
    result.analysts.recommendationScore = financial.recommendationMean?.raw || null;
    result.analysts.recommendationKey = financial.recommendationKey || null;
    result.analysts.numberOfAnalysts = financial.numberOfAnalystOpinions?.raw || null;
    
    // Analyst breakdown from recommendationTrend
    if (recTrend.strongBuy !== undefined) {
      result.analysts.numBuy = (recTrend.strongBuy || 0) + (recTrend.buy || 0);
      result.analysts.numHold = recTrend.hold || 0;
      result.analysts.numSell = (recTrend.sell || 0) + (recTrend.strongSell || 0);
    }
    
    // Financials
    result.financials.revenue = financial.totalRevenue?.raw || null;
    result.financials.revenueGrowth = financial.revenueGrowth?.raw || null;
    result.financials.grossMargin = financial.grossMargins?.raw || null;
    result.financials.operatingMargin = financial.operatingMargins?.raw || null;
    result.financials.profitMargin = financial.profitMargins?.raw || null;
    result.financials.returnOnEquity = financial.returnOnEquity?.raw || null;
    result.financials.returnOnAssets = financial.returnOnAssets?.raw || null;
    result.financials.freeCashFlow = financial.freeCashflow?.raw || null;
    result.financials.operatingCashFlow = financial.operatingCashflow?.raw || null;
    result.financials.debtToEquity = financial.debtToEquity?.raw || null;
    result.financials.currentRatio = financial.currentRatio?.raw || null;
    result.financials.quickRatio = financial.quickRatio?.raw || null;
  }

  // === FINNHUB (Fallback + Analyst breakdown) ===
  
  if (finnhubQuote?.c > 0) {
    result.price.current = result.price.current || finnhubQuote.c;
    result.price.change = result.price.change ?? finnhubQuote.d;
    result.price.changePercent = result.price.changePercent ?? (finnhubQuote.dp ? finnhubQuote.dp / 100 : null);
    result.price.dayHigh = result.price.dayHigh || finnhubQuote.h;
    result.price.dayLow = result.price.dayLow || finnhubQuote.l;
    result.price.open = result.price.open || finnhubQuote.o;
    result.price.previousClose = result.price.previousClose || finnhubQuote.pc;
  }

  if (finnhubProfile?.name) {
    result.company.name = result.company.name || finnhubProfile.name;
    result.company.sector = result.company.sector || finnhubProfile.finnhubIndustry;
    result.company.industry = result.company.industry || finnhubProfile.finnhubIndustry;
    result.company.headquarters = result.company.headquarters || finnhubProfile.country;
    result.company.website = result.company.website || finnhubProfile.weburl;
    result.fundamentals.marketCap = result.fundamentals.marketCap || (finnhubProfile.marketCapitalization ? finnhubProfile.marketCapitalization * 1e6 : null);
    result.fundamentals.sharesOutstanding = result.fundamentals.sharesOutstanding || (finnhubProfile.shareOutstanding ? finnhubProfile.shareOutstanding * 1e6 : null);
  }

  if (finnhubMetrics?.metric) {
    const m = finnhubMetrics.metric;
    result.fundamentals.peRatio = result.fundamentals.peRatio || m.peBasicExclExtraTTM || m.peTTM;
    result.fundamentals.beta = result.fundamentals.beta || m.beta;
    result.fundamentals.priceToBook = result.fundamentals.priceToBook || m.pbQuarterly || m.pbAnnual;
    result.fundamentals.priceToSales = result.fundamentals.priceToSales || m.psQuarterly || m.psAnnual;
    result.fundamentals.pegRatio = result.fundamentals.pegRatio || m.pegTTM;
    result.fundamentals.evEbitda = result.fundamentals.evEbitda || m.evToEbitdaTTM;
    result.fundamentals.evRevenue = result.fundamentals.evRevenue || m.evToRevenueTTM;
    result.fundamentals.dividendYield = result.fundamentals.dividendYield || (m.dividendYieldIndicatedAnnual ? m.dividendYieldIndicatedAnnual / 100 : null);
    result.price.high52w = result.price.high52w || m['52WeekHigh'];
    result.price.low52w = result.price.low52w || m['52WeekLow'];
    result.financials.grossMargin = result.financials.grossMargin || (m.grossMarginTTM ? m.grossMarginTTM / 100 : null);
    result.financials.operatingMargin = result.financials.operatingMargin || (m.operatingMarginTTM ? m.operatingMarginTTM / 100 : null);
    result.financials.profitMargin = result.financials.profitMargin || (m.netProfitMarginTTM ? m.netProfitMarginTTM / 100 : null);
    result.financials.returnOnEquity = result.financials.returnOnEquity || (m.roeTTM ? m.roeTTM / 100 : null);
    result.financials.returnOnAssets = result.financials.returnOnAssets || (m.roaTTM ? m.roaTTM / 100 : null);
    result.financials.currentRatio = result.financials.currentRatio || m.currentRatioQuarterly;
    result.financials.quickRatio = result.financials.quickRatio || m.quickRatioQuarterly;
    result.financials.debtToEquity = result.financials.debtToEquity || m.totalDebtToEquityQuarterly;
    result.financials.revenueGrowth = result.financials.revenueGrowth || (m.revenueGrowthTTMYoy ? m.revenueGrowthTTMYoy / 100 : null);
    result.financials.freeCashFlow = result.financials.freeCashFlow || m.freeCashFlowTTM;
    result.financials.revenue = result.financials.revenue || m.revenueTTM;
  }

  // Finnhub recommendations (often more detailed than Yahoo)
  if (finnhubRec?.length > 0) {
    const latest = finnhubRec[0];
    const fhBuy = (latest.strongBuy || 0) + (latest.buy || 0);
    const fhHold = latest.hold || 0;
    const fhSell = (latest.sell || 0) + (latest.strongSell || 0);
    const fhTotal = fhBuy + fhHold + fhSell;
    
    // Use Finnhub if it has more analysts or if Yahoo didn't return data
    if (fhTotal > (result.analysts.numBuy + result.analysts.numHold + result.analysts.numSell)) {
      result.analysts.numBuy = fhBuy;
      result.analysts.numHold = fhHold;
      result.analysts.numSell = fhSell;
      result.analysts.numberOfAnalysts = result.analysts.numberOfAnalysts || fhTotal;
      
      if (fhTotal > 0) {
        result.analysts.recommendationScore = result.analysts.recommendationScore || 
          ((latest.strongBuy || 0) * 1 + (latest.buy || 0) * 2 + (latest.hold || 0) * 3 + (latest.sell || 0) * 4 + (latest.strongSell || 0) * 5) / fhTotal;
      }
    }
  }

  // Finnhub price target
  if (finnhubTarget?.targetMean) {
    result.analysts.targetPrice = result.analysts.targetPrice || finnhubTarget.targetMean;
    result.analysts.targetHigh = result.analysts.targetHigh || finnhubTarget.targetHigh;
    result.analysts.targetLow = result.analysts.targetLow || finnhubTarget.targetLow;
  }

  // === YAHOO CHART (Price history) ===
  if (yahooChart?.chart?.result?.[0]) {
    const chartResult = yahooChart.chart.result[0];
    const timestamps = chartResult.timestamp || [];
    const closes = chartResult.indicators?.quote?.[0]?.close || [];
    
    result.priceHistory = timestamps.map((ts, i) => ({
      timestamp: ts,
      price: closes[i]
    })).filter(d => d.price != null);
    
    // Fallback price from chart meta
    if (!result.price.current && chartResult.meta) {
      const meta = chartResult.meta;
      result.price.current = meta.regularMarketPrice;
      result.price.previousClose = meta.previousClose || meta.chartPreviousClose;
      result.company.name = result.company.name || meta.longName || meta.shortName;
      if (result.price.current && result.price.previousClose) {
        result.price.change = result.price.current - result.price.previousClose;
        result.price.changePercent = result.price.change / result.price.previousClose;
      }
    }
  }

  // === Set recommendation key from score ===
  if (result.analysts.recommendationScore && !result.analysts.recommendationKey) {
    const score = result.analysts.recommendationScore;
    if (score <= 1.5) result.analysts.recommendationKey = 'strongBuy';
    else if (score <= 2.2) result.analysts.recommendationKey = 'buy';
    else if (score <= 2.8) result.analysts.recommendationKey = 'hold';
    else if (score <= 3.5) result.analysts.recommendationKey = 'sell';
    else result.analysts.recommendationKey = 'strongSell';
  }

  return res.status(200).json(result);
};
