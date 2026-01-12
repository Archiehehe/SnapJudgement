// Multi-provider Stock API - Uses Yahoo Finance, Finnhub, and FMP with fallbacks
// Environment variables (set in Vercel dashboard):
// - FINNHUB_API_KEY (free from finnhub.io)
// - FMP_API_KEY (free from financialmodelingprep.com)

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
  const FINNHUB_KEY = process.env.FINNHUB_API_KEY || '';
  const FMP_KEY = process.env.FMP_API_KEY || '';
  
  // Initialize result
  const result = {
    company: { name: symbol, ticker: symbol, description: null, sector: null, industry: null, headquarters: null, website: null, employees: null },
    price: { current: null, change: null, changePercent: null, high52w: null, low52w: null, dayHigh: null, dayLow: null, open: null, previousClose: null },
    fundamentals: { marketCap: null, beta: null, avgVolume: null, peRatio: null, forwardPe: null, pegRatio: null, priceToSales: null, priceToBook: null, evRevenue: null, evEbitda: null, dividendYield: null, sharesOutstanding: null },
    analysts: { targetPrice: null, targetHigh: null, targetLow: null, recommendationScore: null, recommendationKey: null, numBuy: 0, numHold: 0, numSell: 0, numberOfAnalysts: null },
    financials: { revenue: null, revenueGrowth: null, grossMargin: null, operatingMargin: null, profitMargin: null, returnOnEquity: null, returnOnAssets: null, freeCashFlow: null, operatingCashFlow: null, debtToEquity: null, currentRatio: null, quickRatio: null },
    priceHistory: [],
    _source: []
  };

  // 1. Yahoo Finance Chart (most reliable for price history)
  try {
    const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=${range}`;
    const chartRes = await fetch(chartUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    
    if (chartRes.ok) {
      const chartData = await chartRes.json();
      const chartResult = chartData.chart?.result?.[0];
      
      if (chartResult) {
        const meta = chartResult.meta || {};
        const timestamps = chartResult.timestamp || [];
        const closes = chartResult.indicators?.quote?.[0]?.close || [];
        
        // Price history
        result.priceHistory = timestamps.map((ts, i) => ({
          timestamp: ts,
          price: closes[i]
        })).filter(d => d.price != null);
        
        // Basic price data from chart meta
        result.company.name = meta.longName || meta.shortName || symbol;
        result.price.current = meta.regularMarketPrice || null;
        result.price.previousClose = meta.previousClose || meta.chartPreviousClose || null;
        result.price.high52w = meta.fiftyTwoWeekHigh || null;
        result.price.low52w = meta.fiftyTwoWeekLow || null;
        result.price.dayHigh = meta.regularMarketDayHigh || null;
        result.price.dayLow = meta.regularMarketDayLow || null;
        
        if (result.price.current && result.price.previousClose) {
          result.price.change = result.price.current - result.price.previousClose;
          result.price.changePercent = result.price.change / result.price.previousClose;
        }
        
        result._source.push('yahoo-chart');
      }
    }
  } catch (e) {
    console.error('Yahoo chart error:', e.message);
  }

  // 2. Finnhub for quote and company data (if API key available)
  if (FINNHUB_KEY) {
    try {
      // Quote data
      const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`;
      const quoteRes = await fetch(quoteUrl);
      
      if (quoteRes.ok) {
        const quote = await quoteRes.json();
        if (quote.c) {
          result.price.current = quote.c || result.price.current;
          result.price.change = quote.d || result.price.change;
          result.price.changePercent = quote.dp ? quote.dp / 100 : result.price.changePercent;
          result.price.dayHigh = quote.h || result.price.dayHigh;
          result.price.dayLow = quote.l || result.price.dayLow;
          result.price.open = quote.o || result.price.open;
          result.price.previousClose = quote.pc || result.price.previousClose;
          result._source.push('finnhub-quote');
        }
      }
      
      // Company profile
      const profileUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_KEY}`;
      const profileRes = await fetch(profileUrl);
      
      if (profileRes.ok) {
        const profile = await profileRes.json();
        if (profile.name) {
          result.company.name = profile.name || result.company.name;
          result.company.sector = profile.finnhubIndustry || null;
          result.company.industry = profile.finnhubIndustry || null;
          result.company.headquarters = profile.country || null;
          result.company.website = profile.weburl || null;
          result.fundamentals.marketCap = profile.marketCapitalization ? profile.marketCapitalization * 1e6 : null;
          result.fundamentals.sharesOutstanding = profile.shareOutstanding ? profile.shareOutstanding * 1e6 : null;
          result._source.push('finnhub-profile');
        }
      }
      
      // Basic financials
      const metricsUrl = `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${FINNHUB_KEY}`;
      const metricsRes = await fetch(metricsUrl);
      
      if (metricsRes.ok) {
        const metrics = await metricsRes.json();
        const m = metrics.metric || {};
        
        result.fundamentals.peRatio = m.peBasicExclExtraTTM || m.peTTM || result.fundamentals.peRatio;
        result.fundamentals.beta = m.beta || result.fundamentals.beta;
        result.fundamentals.priceToBook = m.pbQuarterly || m.pbAnnual || result.fundamentals.priceToBook;
        result.fundamentals.priceToSales = m.psQuarterly || m.psAnnual || result.fundamentals.priceToSales;
        result.fundamentals.dividendYield = m.dividendYieldIndicatedAnnual ? m.dividendYieldIndicatedAnnual / 100 : result.fundamentals.dividendYield;
        result.price.high52w = m['52WeekHigh'] || result.price.high52w;
        result.price.low52w = m['52WeekLow'] || result.price.low52w;
        result.financials.returnOnEquity = m.roeTTM ? m.roeTTM / 100 : result.financials.returnOnEquity;
        result.financials.returnOnAssets = m.roaTTM ? m.roaTTM / 100 : result.financials.returnOnAssets;
        result.financials.grossMargin = m.grossMarginTTM ? m.grossMarginTTM / 100 : result.financials.grossMargin;
        result.financials.operatingMargin = m.operatingMarginTTM ? m.operatingMarginTTM / 100 : result.financials.operatingMargin;
        result.financials.profitMargin = m.netProfitMarginTTM ? m.netProfitMarginTTM / 100 : result.financials.profitMargin;
        result.financials.currentRatio = m.currentRatioQuarterly || result.financials.currentRatio;
        result.financials.debtToEquity = m.totalDebtToEquityQuarterly || result.financials.debtToEquity;
        result.financials.revenueGrowth = m.revenueGrowthTTMYoy ? m.revenueGrowthTTMYoy / 100 : result.financials.revenueGrowth;
        result._source.push('finnhub-metrics');
      }
      
      // Analyst recommendations
      const recUrl = `https://finnhub.io/api/v1/stock/recommendation?symbol=${symbol}&token=${FINNHUB_KEY}`;
      const recRes = await fetch(recUrl);
      
      if (recRes.ok) {
        const recs = await recRes.json();
        if (recs && recs.length > 0) {
          const latest = recs[0];
          result.analysts.numBuy = (latest.strongBuy || 0) + (latest.buy || 0);
          result.analysts.numHold = latest.hold || 0;
          result.analysts.numSell = (latest.sell || 0) + (latest.strongSell || 0);
          result._source.push('finnhub-rec');
        }
      }
      
      // Price target
      const targetUrl = `https://finnhub.io/api/v1/stock/price-target?symbol=${symbol}&token=${FINNHUB_KEY}`;
      const targetRes = await fetch(targetUrl);
      
      if (targetRes.ok) {
        const target = await targetRes.json();
        if (target.targetMean) {
          result.analysts.targetPrice = target.targetMean || null;
          result.analysts.targetHigh = target.targetHigh || null;
          result.analysts.targetLow = target.targetLow || null;
          result.analysts.numberOfAnalysts = target.lastUpdated ? 1 : null;
          result._source.push('finnhub-target');
        }
      }
    } catch (e) {
      console.error('Finnhub error:', e.message);
    }
  }

  // 3. FMP fallback for fundamentals (if API key available)
  if (FMP_KEY && (!result.fundamentals.peRatio || !result.company.description)) {
    try {
      const fmpUrl = `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${FMP_KEY}`;
      const fmpRes = await fetch(fmpUrl);
      
      if (fmpRes.ok) {
        const fmpData = await fmpRes.json();
        if (fmpData && fmpData[0]) {
          const p = fmpData[0];
          result.company.name = p.companyName || result.company.name;
          result.company.description = p.description || result.company.description;
          result.company.sector = p.sector || result.company.sector;
          result.company.industry = p.industry || result.company.industry;
          result.company.headquarters = p.city && p.country ? `${p.city}, ${p.country}` : result.company.headquarters;
          result.company.website = p.website || result.company.website;
          result.company.employees = p.fullTimeEmployees || result.company.employees;
          result.fundamentals.marketCap = p.mktCap || result.fundamentals.marketCap;
          result.fundamentals.beta = p.beta || result.fundamentals.beta;
          result.fundamentals.avgVolume = p.volAvg || result.fundamentals.avgVolume;
          result.price.current = p.price || result.price.current;
          result._source.push('fmp-profile');
        }
      }
      
      // FMP key metrics
      const metricsUrl = `https://financialmodelingprep.com/api/v3/key-metrics-ttm/${symbol}?apikey=${FMP_KEY}`;
      const metricsRes = await fetch(metricsUrl);
      
      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        if (metricsData && metricsData[0]) {
          const m = metricsData[0];
          result.fundamentals.peRatio = m.peRatioTTM || result.fundamentals.peRatio;
          result.fundamentals.priceToBook = m.pbRatioTTM || result.fundamentals.priceToBook;
          result.fundamentals.priceToSales = m.priceToSalesRatioTTM || result.fundamentals.priceToSales;
          result.fundamentals.evRevenue = m.enterpriseValueOverRevenueTTM || result.fundamentals.evRevenue;
          result.fundamentals.evEbitda = m.evToEbitdaTTM || result.fundamentals.evEbitda;
          result.fundamentals.dividendYield = m.dividendYieldTTM || result.fundamentals.dividendYield;
          result.financials.returnOnEquity = m.roeTTM || result.financials.returnOnEquity;
          result.financials.returnOnAssets = m.roaTTM || result.financials.returnOnAssets;
          result.financials.debtToEquity = m.debtToEquityTTM || result.financials.debtToEquity;
          result.financials.currentRatio = m.currentRatioTTM || result.financials.currentRatio;
          result._source.push('fmp-metrics');
        }
      }
    } catch (e) {
      console.error('FMP error:', e.message);
    }
  }

  // 4. Yahoo v7 quote as final fallback for basic price
  if (!result.price.current) {
    try {
      const quoteUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`;
      const quoteRes = await fetch(quoteUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      
      if (quoteRes.ok) {
        const quoteData = await quoteRes.json();
        const quote = quoteData.quoteResponse?.result?.[0];
        
        if (quote) {
          result.company.name = quote.longName || quote.shortName || result.company.name;
          result.price.current = quote.regularMarketPrice || null;
          result.price.change = quote.regularMarketChange || null;
          result.price.changePercent = quote.regularMarketChangePercent ? quote.regularMarketChangePercent / 100 : null;
          result.price.dayHigh = quote.regularMarketDayHigh || result.price.dayHigh;
          result.price.dayLow = quote.regularMarketDayLow || result.price.dayLow;
          result.price.open = quote.regularMarketOpen || result.price.open;
          result.price.previousClose = quote.regularMarketPreviousClose || result.price.previousClose;
          result.price.high52w = quote.fiftyTwoWeekHigh || result.price.high52w;
          result.price.low52w = quote.fiftyTwoWeekLow || result.price.low52w;
          result.fundamentals.marketCap = quote.marketCap || result.fundamentals.marketCap;
          result.fundamentals.peRatio = quote.trailingPE || result.fundamentals.peRatio;
          result.fundamentals.forwardPe = quote.forwardPE || result.fundamentals.forwardPe;
          result._source.push('yahoo-quote');
        }
      }
    } catch (e) {
      console.error('Yahoo quote error:', e.message);
    }
  }

  // Remove debug info in production
  delete result._source;
  
  return res.status(200).json(result);
};
