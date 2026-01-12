// Multi-provider Stock API - Wikipedia for description, multiple Yahoo endpoints

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
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json,text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache'
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (response.ok) return await response.json();
      return null;
    } catch (e) {
      return null;
    }
  }

  // Parallel fetch from multiple sources
  const [
    finnhubQuote,
    finnhubProfile,
    finnhubMetrics,
    finnhubRec,
    finnhubTarget,
    yahooQuote,
    yahooChart,
    fmpQuote
  ] = await Promise.all([
    safeFetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`),
    safeFetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_KEY}`),
    safeFetch(`https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_KEY}`),
    safeFetch(`https://finnhub.io/api/v1/stock/recommendation?symbol=${symbol}&token=${FINNHUB_KEY}`),
    safeFetch(`https://finnhub.io/api/v1/stock/price-target?symbol=${symbol}&token=${FINNHUB_KEY}`),
    safeFetch(`https://query2.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`),
    safeFetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=${range}`),
    safeFetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${FMP_KEY}`)
  ]);

  // Get company name first for Wikipedia search
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
    result.fundamentals.peRatio = m.peBasicExclExtraTTM || m.peTTM || result.fundamentals.peRatio;
    result.fundamentals.beta = m.beta || result.fundamentals.beta;
    result.fundamentals.priceToBook = m.pbQuarterly || m.pbAnnual || result.fundamentals.priceToBook;
    result.fundamentals.priceToSales = m.psQuarterly || m.psAnnual || result.fundamentals.priceToSales;
    result.fundamentals.pegRatio = m.pegTTM || result.fundamentals.pegRatio;
    result.fundamentals.evEbitda = m.evToEbitdaTTM || m['ev/ebitdaTTM'] || result.fundamentals.evEbitda;
    result.fundamentals.evRevenue = m.evToRevenueTTM || m['ev/salesTTM'] || result.fundamentals.evRevenue;
    result.fundamentals.dividendYield = m.dividendYieldIndicatedAnnual ? m.dividendYieldIndicatedAnnual / 100 : result.fundamentals.dividendYield;
    result.price.high52w = m['52WeekHigh'] || result.price.high52w;
    result.price.low52w = m['52WeekLow'] || result.price.low52w;
    result.financials.grossMargin = m.grossMarginTTM ? m.grossMarginTTM / 100 : result.financials.grossMargin;
    result.financials.operatingMargin = m.operatingMarginTTM ? m.operatingMarginTTM / 100 : result.financials.operatingMargin;
    result.financials.profitMargin = m.netProfitMarginTTM ? m.netProfitMarginTTM / 100 : result.financials.profitMargin;
    result.financials.returnOnEquity = m.roeTTM ? m.roeTTM / 100 : result.financials.returnOnEquity;
    result.financials.returnOnAssets = m.roaTTM ? m.roaTTM / 100 : result.financials.returnOnAssets;
    result.financials.currentRatio = m.currentRatioQuarterly || result.financials.currentRatio;
    result.financials.quickRatio = m.quickRatioQuarterly || result.financials.quickRatio;
    result.financials.debtToEquity = m.totalDebtToEquityQuarterly || result.financials.debtToEquity;
    result.financials.revenueGrowth = m.revenueGrowthTTMYoy ? m.revenueGrowthTTMYoy / 100 : result.financials.revenueGrowth;
    result.financials.freeCashFlow = m.freeCashFlowTTM || result.financials.freeCashFlow;
    result.financials.revenue = m.revenueTTM || result.financials.revenue;
    result.financials.operatingCashFlow = m.operatingCashFlowTTM || result.financials.operatingCashFlow;
    result.fundamentals.avgVolume = m.averageVolume10D || result.fundamentals.avgVolume;
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

  // === YAHOO QUOTE (v7) ===
  const yQuote = yahooQuote?.quoteResponse?.result?.[0];
  if (yQuote) {
    companyName = yQuote.longName || yQuote.shortName || companyName;
    result.company.name = result.company.name || companyName;
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
    result.fundamentals.dividendYield = result.fundamentals.dividendYield || (yQuote.trailingAnnualDividendYield || null);
    // Yahoo has analyst data
    result.analysts.targetPrice = result.analysts.targetPrice || yQuote.targetMeanPrice;
    result.analysts.numberOfAnalysts = result.analysts.numberOfAnalysts || yQuote.numberOfAnalystOpinions;
    // EPS data for forward P/E
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
    result.fundamentals.marketCap = result.fundamentals.marketCap || q.marketCap;
    result.price.high52w = result.price.high52w || q.yearHigh;
    result.price.low52w = result.price.low52w || q.yearLow;
    // FMP has EPS
    if (q.eps && result.price.current && result.financials.revenueGrowth > 0) {
      const growthRate = Math.min(result.financials.revenueGrowth, 0.5);
      const forwardEps = q.eps * (1 + growthRate);
      if (forwardEps > 0 && !result.fundamentals.forwardPe) {
        result.fundamentals.forwardPe = result.price.current / forwardEps;
      }
    }
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
      result.price.previousClose = meta.previousClose || meta.chartPreviousClose;
      result.company.name = result.company.name || meta.longName || meta.shortName;
    }
  }

  // === WIKIPEDIA for company description ===
  if (companyName && companyName !== symbol) {
    try {
      // Clean company name for Wikipedia search
      const searchName = companyName.replace(/,?\s*(Inc\.?|Corp\.?|Corporation|Ltd\.?|LLC|Company|Co\.?)$/i, '').trim();
      const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchName)}`;
      const wikiData = await safeFetch(wikiUrl, 4000);
      
      if (wikiData?.extract && wikiData.extract.length > 50) {
        // Take first 500 chars of description
        result.company.description = wikiData.extract.substring(0, 500) + (wikiData.extract.length > 500 ? '...' : '');
      }
    } catch (e) {
      // Wikipedia fetch failed, try alternative search
    }
    
    // Fallback: Try with "company" suffix
    if (!result.company.description) {
      try {
        const searchName = companyName.replace(/,?\s*(Inc\.?|Corp\.?|Corporation|Ltd\.?|LLC|Company|Co\.?)$/i, '').trim();
        const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchName + ' (company)')}`;
        const wikiData = await safeFetch(wikiUrl, 3000);
        
        if (wikiData?.extract && wikiData.extract.length > 50) {
          result.company.description = wikiData.extract.substring(0, 500) + (wikiData.extract.length > 500 ? '...' : '');
        }
      } catch (e) {}
    }
  }

  // === CALCULATED FIELDS ===
  
  // PEG ratio
  if (!result.fundamentals.pegRatio && result.fundamentals.peRatio && result.financials.revenueGrowth > 0) {
    result.fundamentals.pegRatio = result.fundamentals.peRatio / (result.financials.revenueGrowth * 100);
  }
  
  // Forward P/E from trailing P/E and growth
  if (!result.fundamentals.forwardPe && result.fundamentals.peRatio && result.financials.revenueGrowth > 0) {
    result.fundamentals.forwardPe = result.fundamentals.peRatio / (1 + result.financials.revenueGrowth);
  }

  // EV metrics if we have components
  if (!result.fundamentals.evRevenue && result.fundamentals.marketCap && result.financials.revenue) {
    result.fundamentals.evRevenue = result.fundamentals.marketCap / result.financials.revenue;
  }

  // Recommendation key from score
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
