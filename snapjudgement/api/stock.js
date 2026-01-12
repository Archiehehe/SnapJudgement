// Vercel Serverless Function - Stock Data API
// Combines chart data with detailed quote data for full metrics

export default async function handler(req, res) {
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
  
  try {
    // Fetch both endpoints in parallel
    const [chartData, quoteData] = await Promise.all([
      fetchChart(symbol, range),
      fetchQuoteSummary(symbol)
    ]);
    
    // Merge the data, preferring quoteSummary for detailed metrics
    const result = mergeData(chartData, quoteData, symbol);
    
    return res.status(200).json(result);
    
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ 
      error: 'Failed to fetch stock data',
      message: error.message,
      ticker: symbol
    });
  }
}

// Fetch chart data (price history + basic info)
async function fetchChart(symbol, range) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=${range}&includePrePost=false`;
  
  try {
    const response = await fetchWithHeaders(url);
    const data = await response.json();
    
    if (data.chart?.error) {
      throw new Error(data.chart.error.description);
    }
    
    return data.chart?.result?.[0] || null;
  } catch (e) {
    console.error('Chart fetch failed:', e.message);
    return null;
  }
}

// Fetch detailed quote summary (fundamentals, financials, analysts)
async function fetchQuoteSummary(symbol) {
  const modules = 'price,summaryProfile,summaryDetail,financialData,recommendationTrend,defaultKeyStatistics,earningsTrend';
  const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=${modules}`;
  
  try {
    const response = await fetchWithHeaders(url);
    const data = await response.json();
    
    if (data.quoteSummary?.error) {
      throw new Error(data.quoteSummary.error.description);
    }
    
    return data.quoteSummary?.result?.[0] || null;
  } catch (e) {
    console.error('QuoteSummary fetch failed:', e.message);
    return null;
  }
}

// Merge chart and quote data
function mergeData(chart, quote, symbol) {
  const meta = chart?.meta || {};
  const timestamps = chart?.timestamp || [];
  const closes = chart?.indicators?.quote?.[0]?.close || [];
  
  const price = quote?.price || {};
  const profile = quote?.summaryProfile || {};
  const detail = quote?.summaryDetail || {};
  const financial = quote?.financialData || {};
  const keyStats = quote?.defaultKeyStatistics || {};
  const recommendations = quote?.recommendationTrend?.trend?.[0] || {};
  
  // Build price history from chart
  const priceHistory = timestamps.map((ts, i) => ({
    timestamp: ts,
    price: closes[i]
  })).filter(d => d.price != null);
  
  // Get current price - prefer quote data, fallback to chart
  const currentPrice = price.regularMarketPrice?.raw ?? meta.regularMarketPrice ?? closes[closes.length - 1];
  const previousClose = price.regularMarketPreviousClose?.raw ?? meta.previousClose ?? meta.chartPreviousClose;
  const change = price.regularMarketChange?.raw ?? (currentPrice - previousClose);
  const changePercent = price.regularMarketChangePercent?.raw ?? (previousClose ? change / previousClose : 0);
  
  return {
    company: {
      name: price.longName || price.shortName || meta.longName || meta.shortName || symbol,
      ticker: symbol,
      description: profile.longBusinessSummary || null,
      sector: profile.sector || null,
      industry: profile.industry || null,
      headquarters: profile.city && profile.country ? `${profile.city}, ${profile.country}` : null,
      website: profile.website || null,
      employees: profile.fullTimeEmployees || null
    },
    price: {
      current: currentPrice,
      change: change,
      changePercent: changePercent,
      high52w: detail.fiftyTwoWeekHigh?.raw ?? meta.fiftyTwoWeekHigh,
      low52w: detail.fiftyTwoWeekLow?.raw ?? meta.fiftyTwoWeekLow,
      dayHigh: price.regularMarketDayHigh?.raw ?? meta.regularMarketDayHigh,
      dayLow: price.regularMarketDayLow?.raw ?? meta.regularMarketDayLow,
      open: price.regularMarketOpen?.raw ?? meta.regularMarketOpen,
      previousClose: previousClose
    },
    fundamentals: {
      marketCap: price.marketCap?.raw ?? meta.marketCap ?? null,
      beta: detail.beta?.raw ?? null,
      avgVolume: detail.averageVolume?.raw ?? meta.averageDailyVolume10Day ?? null,
      peRatio: detail.trailingPE?.raw ?? null,
      forwardPe: detail.forwardPE?.raw ?? null,
      pegRatio: keyStats.pegRatio?.raw ?? null,
      priceToSales: detail.priceToSalesTrailing12Months?.raw ?? null,
      priceToBook: keyStats.priceToBook?.raw ?? null,
      evRevenue: keyStats.enterpriseToRevenue?.raw ?? null,
      evEbitda: keyStats.enterpriseToEbitda?.raw ?? null,
      dividendYield: detail.dividendYield?.raw ?? null,
      sharesOutstanding: keyStats.sharesOutstanding?.raw ?? meta.sharesOutstanding ?? null
    },
    analysts: {
      targetPrice: financial.targetMeanPrice?.raw ?? null,
      targetHigh: financial.targetHighPrice?.raw ?? null,
      targetLow: financial.targetLowPrice?.raw ?? null,
      recommendationScore: financial.recommendationMean?.raw ?? null,
      recommendationKey: financial.recommendationKey ?? null,
      numBuy: (recommendations.strongBuy || 0) + (recommendations.buy || 0),
      numHold: recommendations.hold || 0,
      numSell: (recommendations.sell || 0) + (recommendations.strongSell || 0),
      numberOfAnalysts: financial.numberOfAnalystOpinions?.raw ?? null
    },
    financials: {
      revenue: financial.totalRevenue?.raw ?? null,
      revenueGrowth: financial.revenueGrowth?.raw ?? null,
      grossMargin: financial.grossMargins?.raw ?? null,
      operatingMargin: financial.operatingMargins?.raw ?? null,
      profitMargin: financial.profitMargins?.raw ?? null,
      returnOnEquity: financial.returnOnEquity?.raw ?? null,
      returnOnAssets: financial.returnOnAssets?.raw ?? null,
      freeCashFlow: financial.freeCashflow?.raw ?? null,
      operatingCashFlow: financial.operatingCashflow?.raw ?? null,
      debtToEquity: financial.debtToEquity?.raw ?? null,
      currentRatio: financial.currentRatio?.raw ?? null,
      quickRatio: financial.quickRatio?.raw ?? null
    },
    priceHistory
  };
}

// Fetch with browser-like headers
async function fetchWithHeaders(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json,text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache'
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  return response;
}
