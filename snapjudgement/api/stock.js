// Multi-provider Stock API with Alpha Vantage + manual calculations

const FINNHUB_KEY = 'd54rt91r01qojbih3rd0d54rt91r01qojbih3rdg';
const ALPHA_VANTAGE_KEY = 'demo'; // Free tier - will try multiple keys

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

  // Parallel fetch from all sources
  const [
    finnhubQuote,
    finnhubProfile,
    finnhubMetrics,
    finnhubRec,
    finnhubTarget,
    yahooQuote,
    yahooChart
  ] = await Promise.all([
    safeFetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`),
    safeFetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_KEY}`),
    safeFetch(`https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_KEY}`),
    safeFetch(`https://finnhub.io/api/v1/stock/recommendation?symbol=${symbol}&token=${FINNHUB_KEY}`),
    safeFetch(`https://finnhub.io/api/v1/stock/price-target?symbol=${symbol}&token=${FINNHUB_KEY}`),
    safeFetch(`https://query2.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`),
    safeFetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=${range}`)
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
    // Revenue from Finnhub
    result.financials.revenue = m.revenueTTM || null;
    // Free cash flow from Finnhub
    result.financials.freeCashFlow = m.freeCashFlowTTM || null;
    // Operating cash flow
    result.financials.operatingCashFlow = m.cashFlowFromOperationsTTM || null;
    // EV metrics from Finnhub
    result.fundamentals.evEbitda = m.evToEbitdaTTM || m['ev/ebitdaTTM'] || null;
    result.fundamentals.evRevenue = m.evToRevenueTTM || m['ev/salesTTM'] || null;
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
    result.fundamentals.avgVolume = yQuote.averageDailyVolume10Day || yQuote.averageDailyVolume3Month;
    result.fundamentals.sharesOutstanding = result.fundamentals.sharesOutstanding || yQuote.sharesOutstanding;
    result.fundamentals.dividendYield = result.fundamentals.dividendYield || yQuote.trailingAnnualDividendYield;
    result.analysts.targetPrice = result.analysts.targetPrice || yQuote.targetMeanPrice;
    result.analysts.numberOfAnalysts = result.analysts.numberOfAnalysts || yQuote.numberOfAnalystOpinions;
    // EPS forward for forward P/E calculation
    if (!result.fundamentals.forwardPe && yQuote.epsForward && result.price.current) {
      result.fundamentals.forwardPe = result.price.current / yQuote.epsForward;
    }
  }

  // === YAHOO CHART (Price history + Volume) ===
  if (yahooChart?.chart?.result?.[0]) {
    const chartResult = yahooChart.chart.result[0];
    const timestamps = chartResult.timestamp || [];
    const closes = chartResult.indicators?.quote?.[0]?.close || [];
    const volumes = chartResult.indicators?.quote?.[0]?.volume || [];
    
    result.priceHistory = timestamps.map((ts, i) => ({
      timestamp: ts,
      price: closes[i]
    })).filter(d => d.price != null);
    
    // Calculate average volume from chart data if not available
    if (!result.fundamentals.avgVolume && volumes.length > 0) {
      const recentVolumes = volumes.slice(-20).filter(v => v != null);
      if (recentVolumes.length > 0) {
        result.fundamentals.avgVolume = Math.round(recentVolumes.reduce((a, b) => a + b, 0) / recentVolumes.length);
      }
    }
    
    // Fallback price from chart meta
    if (!result.price.current && chartResult.meta) {
      const meta = chartResult.meta;
      result.price.current = meta.regularMarketPrice;
      result.price.previousClose = meta.previousClose;
    }
  }

  // === ALPHA VANTAGE (for EV ratios, revenue, FCF, price target) ===
  // Try Alpha Vantage OVERVIEW endpoint - it has comprehensive data
  const avKeys = ['32JOWMPNZ85IC27K', 'RIBXT3XYLI69PC0Q']; // Multiple keys for fallback
  
  for (const avKey of avKeys) {
    if (result.fundamentals.evEbitda && result.financials.freeCashFlow && result.analysts.targetPrice) {
      break; // Already have what we need
    }
    
    try {
      const avData = await safeFetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${avKey}`, 4000);
      
      if (avData && avData.Symbol && !avData.Note) { // Note indicates rate limit
        // EV metrics
        result.fundamentals.evRevenue = result.fundamentals.evRevenue || (avData.EVToRevenue ? parseFloat(avData.EVToRevenue) : null);
        result.fundamentals.evEbitda = result.fundamentals.evEbitda || (avData.EVToEBITDA ? parseFloat(avData.EVToEBITDA) : null);
        
        // Revenue
        result.financials.revenue = result.financials.revenue || (avData.RevenueTTM ? parseFloat(avData.RevenueTTM) : null);
        
        // Price target
        result.analysts.targetPrice = result.analysts.targetPrice || (avData.AnalystTargetPrice ? parseFloat(avData.AnalystTargetPrice) : null);
        
        // Other metrics
        result.fundamentals.forwardPe = result.fundamentals.forwardPe || (avData.ForwardPE ? parseFloat(avData.ForwardPE) : null);
        result.fundamentals.pegRatio = result.fundamentals.pegRatio || (avData.PEGRatio ? parseFloat(avData.PEGRatio) : null);
        result.fundamentals.priceToBook = result.fundamentals.priceToBook || (avData.PriceToBookRatio ? parseFloat(avData.PriceToBookRatio) : null);
        result.fundamentals.priceToSales = result.fundamentals.priceToSales || (avData.PriceToSalesRatioTTM ? parseFloat(avData.PriceToSalesRatioTTM) : null);
        result.fundamentals.beta = result.fundamentals.beta || (avData.Beta ? parseFloat(avData.Beta) : null);
        result.fundamentals.dividendYield = result.fundamentals.dividendYield || (avData.DividendYield ? parseFloat(avData.DividendYield) : null);
        
        // Financials
        result.financials.profitMargin = result.financials.profitMargin || (avData.ProfitMargin ? parseFloat(avData.ProfitMargin) : null);
        result.financials.operatingMargin = result.financials.operatingMargin || (avData.OperatingMarginTTM ? parseFloat(avData.OperatingMarginTTM) : null);
        result.financials.returnOnEquity = result.financials.returnOnEquity || (avData.ReturnOnEquityTTM ? parseFloat(avData.ReturnOnEquityTTM) : null);
        result.financials.returnOnAssets = result.financials.returnOnAssets || (avData.ReturnOnAssetsTTM ? parseFloat(avData.ReturnOnAssetsTTM) : null);
        result.financials.revenueGrowth = result.financials.revenueGrowth || (avData.QuarterlyRevenueGrowthYOY ? parseFloat(avData.QuarterlyRevenueGrowthYOY) : null);
        
        // Company info
        result.company.description = result.company.description || avData.Description;
        result.company.sector = result.company.sector || avData.Sector;
        result.company.industry = result.company.industry || avData.Industry;
        result.company.headquarters = result.company.headquarters || avData.Country;
        result.company.employees = result.company.employees || (avData.FullTimeEmployees ? parseInt(avData.FullTimeEmployees) : null);
        
        break; // Success, don't try other keys
      }
    } catch (e) {
      // Continue to next key
    }
  }

  // === WIKIPEDIA for description (fallback) ===
  if (!result.company.description && companyName && companyName !== symbol) {
    try {
      const searchName = companyName.replace(/,?\s*(Inc\.?|Corp\.?|Corporation|Ltd\.?|LLC|Company|Co\.?)$/i, '').trim();
      const wikiData = await safeFetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchName)}`, 3000);
      if (wikiData?.extract && wikiData.extract.length > 50) {
        result.company.description = wikiData.extract.substring(0, 500) + (wikiData.extract.length > 500 ? '...' : '');
      }
    } catch (e) {}
    
    // Fallback with (company)
    if (!result.company.description) {
      try {
        const searchName = companyName.replace(/,?\s*(Inc\.?|Corp\.?|Corporation|Ltd\.?|LLC|Company|Co\.?)$/i, '').trim();
        const wikiData = await safeFetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchName + ' (company)')}`, 3000);
        if (wikiData?.extract && wikiData.extract.length > 50) {
          result.company.description = wikiData.extract.substring(0, 500) + (wikiData.extract.length > 500 ? '...' : '');
        }
      } catch (e) {}
    }
  }

  // === MANUAL CALCULATIONS (Last resort fallbacks) ===
  
  // Forward P/E from trailing P/E and growth
  if (!result.fundamentals.forwardPe && result.fundamentals.peRatio && result.financials.revenueGrowth > 0) {
    result.fundamentals.forwardPe = result.fundamentals.peRatio / (1 + result.financials.revenueGrowth);
  }
  
  // PEG ratio
  if (!result.fundamentals.pegRatio && result.fundamentals.peRatio && result.financials.revenueGrowth > 0) {
    result.fundamentals.pegRatio = result.fundamentals.peRatio / (result.financials.revenueGrowth * 100);
  }
  
  // EV/Revenue calculation: EV ≈ Market Cap (simplified)
  if (!result.fundamentals.evRevenue && result.fundamentals.marketCap && result.financials.revenue) {
    result.fundamentals.evRevenue = result.fundamentals.marketCap / result.financials.revenue;
  }
  
  // Price/Sales as proxy for EV/Revenue if still missing
  if (!result.fundamentals.evRevenue && result.fundamentals.priceToSales) {
    result.fundamentals.evRevenue = result.fundamentals.priceToSales;
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
