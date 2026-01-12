// Multi-provider Stock API - Maximum coverage with dedicated endpoints

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
  async function safeFetch(url, timeout = 5000) {
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

  // Parallel fetch - all data sources
  const [
    finnhubQuote,
    finnhubProfile,
    finnhubMetrics,
    finnhubRec,
    finnhubTarget,
    yahooQuote,
    yahooChart,
    fmpQuote,
    fmpProfile,
    fmpKeyMetrics,
    fmpRatios,
    fmpIncome,
    fmpCashFlow,
    fmpGrowth
  ] = await Promise.all([
    safeFetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`),
    safeFetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_KEY}`),
    safeFetch(`https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_KEY}`),
    safeFetch(`https://finnhub.io/api/v1/stock/recommendation?symbol=${symbol}&token=${FINNHUB_KEY}`),
    safeFetch(`https://finnhub.io/api/v1/stock/price-target?symbol=${symbol}&token=${FINNHUB_KEY}`),
    safeFetch(`https://query2.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`),
    safeFetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=${range}`),
    safeFetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${FMP_KEY}`),
    safeFetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${FMP_KEY}`),
    safeFetch(`https://financialmodelingprep.com/api/v3/key-metrics-ttm/${symbol}?apikey=${FMP_KEY}`),
    safeFetch(`https://financialmodelingprep.com/api/v3/ratios-ttm/${symbol}?apikey=${FMP_KEY}`),
    safeFetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?period=annual&limit=2&apikey=${FMP_KEY}`),
    safeFetch(`https://financialmodelingprep.com/api/v3/cash-flow-statement/${symbol}?period=annual&limit=1&apikey=${FMP_KEY}`),
    safeFetch(`https://financialmodelingprep.com/api/v3/financial-growth/${symbol}?period=annual&limit=1&apikey=${FMP_KEY}`)
  ]);

  let companyName = symbol;

  // === FINNHUB ===
  if (finnhubQuote?.c > 0) {
    result.price.current = finnhubQuote.c;
    result.price.change = finnhubQuote.d;
    result.price.changePercent = finnhubQuote.dp ? finnhubQuote.dp / 100 : null;
    result.price.dayHigh = finnhubQuote.h;
    result.price.dayLow = finnhubQuote.l;
    result.price.open = finnhubQuote.o;
    result.price.previousClose = finnhubQuote.pc;
  }

  if (finnhubProfile?.name) {
    companyName = finnhubProfile.name;
    result.company.name = finnhubProfile.name;
    result.company.sector = finnhubProfile.finnhubIndustry;
    result.company.industry = finnhubProfile.finnhubIndustry;
    result.company.headquarters = finnhubProfile.country;
    result.company.website = finnhubProfile.weburl;
    result.fundamentals.marketCap = finnhubProfile.marketCapitalization ? finnhubProfile.marketCapitalization * 1e6 : null;
    result.fundamentals.sharesOutstanding = finnhubProfile.shareOutstanding ? finnhubProfile.shareOutstanding * 1e6 : null;
  }

  if (finnhubMetrics?.metric) {
    const m = finnhubMetrics.metric;
    result.fundamentals.peRatio = m.peBasicExclExtraTTM || m.peTTM;
    result.fundamentals.beta = m.beta;
    result.fundamentals.priceToBook = m.pbQuarterly || m.pbAnnual;
    result.fundamentals.priceToSales = m.psQuarterly || m.psAnnual;
    result.fundamentals.pegRatio = m.pegTTM;
    result.fundamentals.dividendYield = m.dividendYieldIndicatedAnnual ? m.dividendYieldIndicatedAnnual / 100 : null;
    result.price.high52w = m['52WeekHigh'];
    result.price.low52w = m['52WeekLow'];
    result.financials.grossMargin = m.grossMarginTTM ? m.grossMarginTTM / 100 : null;
    result.financials.operatingMargin = m.operatingMarginTTM ? m.operatingMarginTTM / 100 : null;
    result.financials.profitMargin = m.netProfitMarginTTM ? m.netProfitMarginTTM / 100 : null;
    result.financials.returnOnEquity = m.roeTTM ? m.roeTTM / 100 : null;
    result.financials.returnOnAssets = m.roaTTM ? m.roaTTM / 100 : null;
    result.financials.currentRatio = m.currentRatioQuarterly;
    result.financials.quickRatio = m.quickRatioQuarterly;
    result.financials.debtToEquity = m.totalDebtToEquityQuarterly;
    result.financials.revenueGrowth = m.revenueGrowthTTMYoy ? m.revenueGrowthTTMYoy / 100 : null;
  }

  if (finnhubRec?.length > 0) {
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

  if (finnhubTarget?.targetMean) {
    result.analysts.targetPrice = finnhubTarget.targetMean;
    result.analysts.targetHigh = finnhubTarget.targetHigh;
    result.analysts.targetLow = finnhubTarget.targetLow;
  }

  // === YAHOO QUOTE ===
  const yQuote = yahooQuote?.quoteResponse?.result?.[0];
  if (yQuote) {
    companyName = yQuote.longName || yQuote.shortName || companyName;
    result.company.name = result.company.name || companyName;
    result.price.current = result.price.current || yQuote.regularMarketPrice;
    result.fundamentals.avgVolume = yQuote.averageDailyVolume10Day || yQuote.averageDailyVolume3Month;
    result.fundamentals.forwardPe = yQuote.forwardPE;
    result.fundamentals.peRatio = result.fundamentals.peRatio || yQuote.trailingPE;
    result.fundamentals.priceToBook = result.fundamentals.priceToBook || yQuote.priceToBook;
    result.fundamentals.marketCap = result.fundamentals.marketCap || yQuote.marketCap;
    result.fundamentals.dividendYield = result.fundamentals.dividendYield || yQuote.trailingAnnualDividendYield;
    result.analysts.targetPrice = result.analysts.targetPrice || yQuote.targetMeanPrice;
    result.analysts.numberOfAnalysts = result.analysts.numberOfAnalysts || yQuote.numberOfAnalystOpinions;
    // Forward P/E from EPS forward
    if (!result.fundamentals.forwardPe && yQuote.epsForward && result.price.current) {
      result.fundamentals.forwardPe = result.price.current / yQuote.epsForward;
    }
  }

  // === FMP QUOTE ===
  if (fmpQuote?.[0]) {
    const q = fmpQuote[0];
    result.price.current = result.price.current || q.price;
    result.fundamentals.avgVolume = result.fundamentals.avgVolume || q.avgVolume;
    result.fundamentals.peRatio = result.fundamentals.peRatio || q.pe;
    result.price.high52w = result.price.high52w || q.yearHigh;
    result.price.low52w = result.price.low52w || q.yearLow;
    result.fundamentals.sharesOutstanding = result.fundamentals.sharesOutstanding || q.sharesOutstanding;
  }

  // === FMP PROFILE ===
  if (fmpProfile?.[0]) {
    const p = fmpProfile[0];
    companyName = p.companyName || companyName;
    result.company.name = result.company.name || p.companyName;
    result.company.sector = result.company.sector || p.sector;
    result.company.industry = result.company.industry || p.industry;
    result.company.headquarters = (p.city && p.country) ? `${p.city}, ${p.country}` : result.company.headquarters;
    result.company.website = result.company.website || p.website;
    result.company.employees = p.fullTimeEmployees;
    result.fundamentals.avgVolume = result.fundamentals.avgVolume || p.volAvg;
    result.fundamentals.beta = result.fundamentals.beta || p.beta;
  }

  // === FMP KEY METRICS TTM (EV ratios!) ===
  if (fmpKeyMetrics?.[0]) {
    const k = fmpKeyMetrics[0];
    result.fundamentals.evRevenue = k.enterpriseValueOverRevenueTTM;
    result.fundamentals.evEbitda = k.evToOperatingCashFlowTTM; // Close proxy
    result.fundamentals.pegRatio = result.fundamentals.pegRatio || k.pegRatioTTM;
    result.fundamentals.priceToBook = result.fundamentals.priceToBook || k.pbRatioTTM;
    result.fundamentals.priceToSales = result.fundamentals.priceToSales || k.priceToSalesRatioTTM;
    result.financials.debtToEquity = result.financials.debtToEquity || k.debtToEquityTTM;
    result.financials.currentRatio = result.financials.currentRatio || k.currentRatioTTM;
  }

  // === FMP RATIOS TTM ===
  if (fmpRatios?.[0]) {
    const r = fmpRatios[0];
    result.fundamentals.peRatio = result.fundamentals.peRatio || r.peRatioTTM;
    result.fundamentals.pegRatio = result.fundamentals.pegRatio || r.priceEarningsToGrowthRatioTTM;
    result.fundamentals.dividendYield = result.fundamentals.dividendYield || r.dividendYieldTTM;
    result.financials.returnOnEquity = result.financials.returnOnEquity || r.returnOnEquityTTM;
    result.financials.returnOnAssets = result.financials.returnOnAssets || r.returnOnAssetsTTM;
    result.financials.grossMargin = result.financials.grossMargin || r.grossProfitMarginTTM;
    result.financials.operatingMargin = result.financials.operatingMargin || r.operatingProfitMarginTTM;
    result.financials.profitMargin = result.financials.profitMargin || r.netProfitMarginTTM;
    result.financials.currentRatio = result.financials.currentRatio || r.currentRatioTTM;
    result.financials.quickRatio = result.financials.quickRatio || r.quickRatioTTM;
    result.financials.debtToEquity = result.financials.debtToEquity || r.debtEquityRatioTTM;
  }

  // === FMP INCOME STATEMENT (Revenue!) ===
  if (fmpIncome?.[0]) {
    const inc = fmpIncome[0];
    result.financials.revenue = inc.revenue;
    
    // Calculate margins if not set
    if (inc.revenue > 0) {
      result.financials.grossMargin = result.financials.grossMargin || (inc.grossProfit / inc.revenue);
      result.financials.operatingMargin = result.financials.operatingMargin || (inc.operatingIncome / inc.revenue);
      result.financials.profitMargin = result.financials.profitMargin || (inc.netIncome / inc.revenue);
    }
    
    // Revenue growth YoY
    if (fmpIncome[1]?.revenue && inc.revenue) {
      result.financials.revenueGrowth = result.financials.revenueGrowth || ((inc.revenue - fmpIncome[1].revenue) / fmpIncome[1].revenue);
    }
  }

  // === FMP CASH FLOW (FCF, Operating CF!) ===
  if (fmpCashFlow?.[0]) {
    const cf = fmpCashFlow[0];
    result.financials.freeCashFlow = cf.freeCashFlow;
    result.financials.operatingCashFlow = cf.operatingCashFlow;
  }

  // === FMP GROWTH ===
  if (fmpGrowth?.[0]) {
    const g = fmpGrowth[0];
    result.financials.revenueGrowth = result.financials.revenueGrowth || g.revenueGrowth;
  }

  // === YAHOO CHART ===
  if (yahooChart?.chart?.result?.[0]) {
    const chartResult = yahooChart.chart.result[0];
    const timestamps = chartResult.timestamp || [];
    const closes = chartResult.indicators?.quote?.[0]?.close || [];
    
    result.priceHistory = timestamps.map((ts, i) => ({
      timestamp: ts,
      price: closes[i]
    })).filter(d => d.price != null);
    
    if (!result.price.current && chartResult.meta) {
      const meta = chartResult.meta;
      result.price.current = meta.regularMarketPrice;
      result.price.previousClose = meta.previousClose;
    }
  }

 // === WIKIPEDIA for description (FIXED for Apple) ===
  if (companyName && companyName !== symbol && !result.company.description) {
    try {
      const searchName = companyName.replace(/,?\s*(Inc\.?|Corp\.?|Corporation|Ltd\.?|LLC|Company|Co\.?)$/i, '').trim();
      
      // 1. Try "Name (company)" FIRST (Fixes Apple fruit issue)
      let wikiData = await safeFetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchName + ' (company)')}`, 3000);
      
      // 2. Fallback to generic name if that failed
      if (!wikiData?.extract) {
         wikiData = await safeFetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchName)}`, 3000);
      }

      if (wikiData?.extract && wikiData.extract.length > 50) {
        result.company.description = wikiData.extract.substring(0, 500) + (wikiData.extract.length > 500 ? '...' : '');
      }
    } catch (e) {}
  }

  // === CALCULATED FIELDS ===
  
  // Forward P/E from trailing P/E and growth
  if (!result.fundamentals.forwardPe && result.fundamentals.peRatio && result.financials.revenueGrowth > 0) {
    result.fundamentals.forwardPe = result.fundamentals.peRatio / (1 + result.financials.revenueGrowth);
  }
  
  // PEG ratio
  if (!result.fundamentals.pegRatio && result.fundamentals.peRatio && result.financials.revenueGrowth > 0) {
    result.fundamentals.pegRatio = result.fundamentals.peRatio / (result.financials.revenueGrowth * 100);
  }
  
  // EV/Revenue if we have market cap and revenue
  if (!result.fundamentals.evRevenue && result.fundamentals.marketCap && result.financials.revenue) {
    result.fundamentals.evRevenue = result.fundamentals.marketCap / result.financials.revenue;
  }

  // Recommendation key
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
