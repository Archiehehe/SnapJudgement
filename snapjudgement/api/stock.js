// Multi-provider Stock API - Maximum coverage with free tier APIs

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

  // Helper to safely fetch with timeout
  async function safeFetch(url, timeout = 5000) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      const response = await fetch(url, { 
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  // Parallel fetch all data sources
  const [
    finnhubQuote,
    finnhubProfile,
    finnhubMetrics,
    finnhubRec,
    finnhubTarget,
    fmpQuote,
    fmpProfile,
    yahooQuote,
    yahooChart
  ] = await Promise.all([
    safeFetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`),
    safeFetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_KEY}`),
    safeFetch(`https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_KEY}`),
    safeFetch(`https://finnhub.io/api/v1/stock/recommendation?symbol=${symbol}&token=${FINNHUB_KEY}`),
    safeFetch(`https://finnhub.io/api/v1/stock/price-target?symbol=${symbol}&token=${FINNHUB_KEY}`),
    safeFetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${FMP_KEY}`),
    safeFetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${FMP_KEY}`),
    safeFetch(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`),
    safeFetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=${range}`)
  ]);

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
    result.financials.freeCashFlow = m.freeCashFlowTTM;
    result.financials.revenue = m.revenueTTM;
    // EV metrics
    result.fundamentals.evEbitda = m.evToEbitdaTTM || m['ev/ebitdaTTM'];
    result.fundamentals.evRevenue = m.evToRevenueTTM || m['ev/salesTTM'];
    // Forward P/E calculation from earnings estimates
    if (m.epsGrowth5Y && result.fundamentals.peRatio) {
      result.fundamentals.forwardPe = result.fundamentals.peRatio / (1 + (m.epsGrowth5Y / 100));
    }
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

  // === FMP (Free tier endpoints) ===
  
  // FMP Quote - has lots of useful data
  if (fmpQuote?.[0]) {
    const q = fmpQuote[0];
    result.price.current = result.price.current || q.price;
    result.price.change = result.price.change ?? q.change;
    result.price.changePercent = result.price.changePercent ?? (q.changesPercentage ? q.changesPercentage / 100 : null);
    result.price.dayHigh = result.price.dayHigh || q.dayHigh;
    result.price.dayLow = result.price.dayLow || q.dayLow;
    result.price.open = result.price.open || q.open;
    result.price.previousClose = result.price.previousClose || q.previousClose;
    result.price.high52w = result.price.high52w || q.yearHigh;
    result.price.low52w = result.price.low52w || q.yearLow;
    result.fundamentals.peRatio = result.fundamentals.peRatio || q.pe;
    result.fundamentals.marketCap = result.fundamentals.marketCap || q.marketCap;
    result.fundamentals.avgVolume = result.fundamentals.avgVolume || q.avgVolume;
    result.fundamentals.sharesOutstanding = result.fundamentals.sharesOutstanding || q.sharesOutstanding;
    // FMP has EPS - calculate forward P/E if we have earnings growth
    if (q.eps && result.price.current && result.financials.revenueGrowth) {
      // Estimate forward EPS using revenue growth as proxy for earnings growth
      const growthRate = Math.min(result.financials.revenueGrowth, 0.5); // Cap at 50%
      const forwardEps = q.eps * (1 + growthRate);
      if (forwardEps > 0) {
        result.fundamentals.forwardPe = result.fundamentals.forwardPe || (result.price.current / forwardEps);
      }
    }
    // PEG calculation
    if (result.fundamentals.peRatio && result.financials.revenueGrowth && result.financials.revenueGrowth > 0) {
      result.fundamentals.pegRatio = result.fundamentals.pegRatio || (result.fundamentals.peRatio / (result.financials.revenueGrowth * 100));
    }
  }

  // FMP Profile - description, employees
  if (fmpProfile?.[0]) {
    const p = fmpProfile[0];
    result.company.description = p.description;
    result.company.name = result.company.name || p.companyName;
    result.company.sector = result.company.sector || p.sector;
    result.company.industry = p.industry || result.company.industry;
    result.company.headquarters = (p.city && p.country) ? `${p.city}, ${p.country}` : result.company.headquarters;
    result.company.website = result.company.website || p.website;
    result.company.employees = p.fullTimeEmployees;
    result.fundamentals.marketCap = result.fundamentals.marketCap || p.mktCap;
    result.fundamentals.beta = result.fundamentals.beta || p.beta;
    result.fundamentals.avgVolume = result.fundamentals.avgVolume || p.volAvg;
  }

  // === YAHOO FINANCE ===
  
  // Yahoo Quote - lots of detailed metrics
  const yQuote = yahooQuote?.quoteResponse?.result?.[0];
  if (yQuote) {
    result.price.current = result.price.current || yQuote.regularMarketPrice;
    result.price.change = result.price.change ?? yQuote.regularMarketChange;
    result.price.changePercent = result.price.changePercent ?? (yQuote.regularMarketChangePercent ? yQuote.regularMarketChangePercent / 100 : null);
    result.price.dayHigh = result.price.dayHigh || yQuote.regularMarketDayHigh;
    result.price.dayLow = result.price.dayLow || yQuote.regularMarketDayLow;
    result.price.open = result.price.open || yQuote.regularMarketOpen;
    result.price.previousClose = result.price.previousClose || yQuote.regularMarketPreviousClose;
    result.price.high52w = result.price.high52w || yQuote.fiftyTwoWeekHigh;
    result.price.low52w = result.price.low52w || yQuote.fiftyTwoWeekLow;
    result.fundamentals.marketCap = result.fundamentals.marketCap || yQuote.marketCap;
    result.fundamentals.peRatio = result.fundamentals.peRatio || yQuote.trailingPE;
    result.fundamentals.forwardPe = result.fundamentals.forwardPe || yQuote.forwardPE;
    result.fundamentals.priceToBook = result.fundamentals.priceToBook || yQuote.priceToBook;
    result.fundamentals.avgVolume = result.fundamentals.avgVolume || yQuote.averageDailyVolume10Day;
    result.fundamentals.sharesOutstanding = result.fundamentals.sharesOutstanding || yQuote.sharesOutstanding;
    result.fundamentals.dividendYield = result.fundamentals.dividendYield || (yQuote.dividendYield ? yQuote.dividendYield / 100 : null);
    result.company.name = result.company.name || yQuote.longName || yQuote.shortName;
    // Yahoo has analyst targets!
    result.analysts.targetPrice = result.analysts.targetPrice || yQuote.targetMeanPrice;
    result.analysts.targetHigh = result.analysts.targetHigh || yQuote.targetHighPrice;
    result.analysts.targetLow = result.analysts.targetLow || yQuote.targetLowPrice;
    result.analysts.numberOfAnalysts = result.analysts.numberOfAnalysts || yQuote.numberOfAnalystOpinions;
    // Yahoo has EPS and earnings dates
    if (yQuote.epsTrailingTwelveMonths && yQuote.epsForward && result.price.current) {
      result.fundamentals.forwardPe = result.fundamentals.forwardPe || (result.price.current / yQuote.epsForward);
    }
  }

  // Yahoo Chart - price history
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

  // === CALCULATED FIELDS ===
  
  // Calculate EV/Revenue and EV/EBITDA if we have the components
  if (!result.fundamentals.evRevenue && result.fundamentals.marketCap && result.financials.revenue) {
    // EV ≈ Market Cap (simplified, ignoring debt/cash)
    result.fundamentals.evRevenue = result.fundamentals.marketCap / result.financials.revenue;
  }
  
  // Calculate PEG if missing
  if (!result.fundamentals.pegRatio && result.fundamentals.peRatio && result.financials.revenueGrowth > 0) {
    // Using revenue growth as proxy for earnings growth
    result.fundamentals.pegRatio = result.fundamentals.peRatio / (result.financials.revenueGrowth * 100);
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
