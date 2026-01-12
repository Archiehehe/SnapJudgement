// Vercel Serverless Function - Stock Data API with Multiple Fallbacks

export default async function handler(req, res) {
  // CORS headers
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
  
  // Try multiple fetch strategies
  const strategies = [
    () => fetchYahooV8(symbol, range),
    () => fetchYahooV7(symbol, range),
    () => fetchYahooChart(symbol, range),
  ];
  
  let lastError = null;
  
  for (const strategy of strategies) {
    try {
      const data = await strategy();
      if (data && data.price?.current) {
        return res.status(200).json(data);
      }
    } catch (err) {
      console.error('Strategy failed:', err.message);
      lastError = err;
    }
  }
  
  return res.status(500).json({ 
    error: 'Failed to fetch stock data from all sources',
    message: lastError?.message || 'Unknown error',
    ticker: symbol
  });
}

// Strategy 1: Yahoo Finance v8 chart endpoint (most reliable)
async function fetchYahooV8(symbol, range) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=${range}&includePrePost=false&events=div,split`;
  
  const response = await fetchWithRetry(url);
  const data = await response.json();
  
  if (data.chart?.error) {
    throw new Error(data.chart.error.description || 'Chart error');
  }
  
  const result = data.chart?.result?.[0];
  if (!result) {
    throw new Error('No chart data');
  }
  
  const meta = result.meta || {};
  const quote = result.indicators?.quote?.[0] || {};
  const timestamps = result.timestamp || [];
  const closes = quote.close || [];
  
  // Build price history
  const priceHistory = timestamps.map((ts, i) => ({
    timestamp: ts,
    price: closes[i]
  })).filter(d => d.price != null);
  
  // Get current price from meta or last close
  const currentPrice = meta.regularMarketPrice || closes[closes.length - 1];
  const previousClose = meta.previousClose || meta.chartPreviousClose;
  const change = currentPrice - previousClose;
  const changePercent = previousClose ? (change / previousClose) : 0;
  
  return {
    company: {
      name: meta.longName || meta.shortName || symbol,
      ticker: symbol,
      description: null,
      sector: null,
      industry: null,
      headquarters: null,
      website: null,
      employees: null
    },
    price: {
      current: currentPrice,
      change: change,
      changePercent: changePercent,
      high52w: meta.fiftyTwoWeekHigh,
      low52w: meta.fiftyTwoWeekLow,
      dayHigh: meta.regularMarketDayHigh,
      dayLow: meta.regularMarketDayLow,
      open: meta.regularMarketOpen,
      previousClose: previousClose
    },
    fundamentals: {
      marketCap: meta.marketCap || null,
      beta: null,
      avgVolume: meta.averageDailyVolume10Day || null,
      peRatio: null,
      forwardPe: null,
      pegRatio: null,
      priceToSales: null,
      priceToBook: null,
      evRevenue: null,
      evEbitda: null,
      dividendYield: null,
      sharesOutstanding: meta.sharesOutstanding || null
    },
    analysts: {
      targetPrice: null,
      targetHigh: null,
      targetLow: null,
      recommendationScore: null,
      recommendationKey: null,
      numBuy: 0,
      numHold: 0,
      numSell: 0,
      numberOfAnalysts: null
    },
    financials: {
      revenue: null,
      revenueGrowth: null,
      grossMargin: null,
      operatingMargin: null,
      profitMargin: null,
      returnOnEquity: null,
      returnOnAssets: null,
      freeCashFlow: null,
      operatingCashFlow: null,
      debtToEquity: null,
      currentRatio: null,
      quickRatio: null
    },
    priceHistory
  };
}

// Strategy 2: Yahoo Finance v7 quote endpoint
async function fetchYahooV7(symbol, range) {
  const quoteUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`;
  const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=${range}`;
  
  const [quoteRes, chartRes] = await Promise.all([
    fetchWithRetry(quoteUrl),
    fetchWithRetry(chartUrl).catch(() => null)
  ]);
  
  const quoteData = await quoteRes.json();
  const quote = quoteData.quoteResponse?.result?.[0];
  
  if (!quote) {
    throw new Error('No quote data from v7');
  }
  
  // Get chart data if available
  let priceHistory = [];
  if (chartRes) {
    try {
      const chartData = await chartRes.json();
      const result = chartData.chart?.result?.[0];
      const timestamps = result?.timestamp || [];
      const closes = result?.indicators?.quote?.[0]?.close || [];
      priceHistory = timestamps.map((ts, i) => ({
        timestamp: ts,
        price: closes[i]
      })).filter(d => d.price != null);
    } catch (e) {
      console.error('Chart fetch failed:', e);
    }
  }
  
  return {
    company: {
      name: quote.longName || quote.shortName || symbol,
      ticker: symbol,
      description: null,
      sector: quote.sector || null,
      industry: quote.industry || null,
      headquarters: null,
      website: null,
      employees: null
    },
    price: {
      current: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent / 100,
      high52w: quote.fiftyTwoWeekHigh,
      low52w: quote.fiftyTwoWeekLow,
      dayHigh: quote.regularMarketDayHigh,
      dayLow: quote.regularMarketDayLow,
      open: quote.regularMarketOpen,
      previousClose: quote.regularMarketPreviousClose
    },
    fundamentals: {
      marketCap: quote.marketCap || null,
      beta: quote.beta || null,
      avgVolume: quote.averageDailyVolume10Day || null,
      peRatio: quote.trailingPE || null,
      forwardPe: quote.forwardPE || null,
      pegRatio: quote.pegRatio || null,
      priceToSales: quote.priceToSalesTrailing12Months || null,
      priceToBook: quote.priceToBook || null,
      evRevenue: null,
      evEbitda: null,
      dividendYield: quote.dividendYield ? quote.dividendYield / 100 : null,
      sharesOutstanding: quote.sharesOutstanding || null
    },
    analysts: {
      targetPrice: quote.targetMeanPrice || null,
      targetHigh: quote.targetHighPrice || null,
      targetLow: quote.targetLowPrice || null,
      recommendationScore: quote.recommendationMean || null,
      recommendationKey: quote.recommendationKey || null,
      numBuy: 0,
      numHold: 0,
      numSell: 0,
      numberOfAnalysts: quote.numberOfAnalystOpinions || null
    },
    financials: {
      revenue: quote.totalRevenue || null,
      revenueGrowth: quote.revenueGrowth || null,
      grossMargin: null,
      operatingMargin: null,
      profitMargin: quote.profitMargins || null,
      returnOnEquity: quote.returnOnEquity || null,
      returnOnAssets: null,
      freeCashFlow: null,
      operatingCashFlow: null,
      debtToEquity: quote.debtToEquity || null,
      currentRatio: null,
      quickRatio: null
    },
    priceHistory
  };
}

// Strategy 3: Yahoo Finance spark endpoint (lightweight)
async function fetchYahooChart(symbol, range) {
  const url = `https://query2.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=1d`;
  
  const response = await fetchWithRetry(url);
  const data = await response.json();
  
  const result = data.chart?.result?.[0];
  if (!result) {
    throw new Error('No spark data');
  }
  
  const meta = result.meta || {};
  const timestamps = result.timestamp || [];
  const closes = result.indicators?.quote?.[0]?.close || [];
  
  const priceHistory = timestamps.map((ts, i) => ({
    timestamp: ts,
    price: closes[i]
  })).filter(d => d.price != null);
  
  const currentPrice = meta.regularMarketPrice || closes[closes.length - 1];
  const previousClose = meta.previousClose || meta.chartPreviousClose || closes[closes.length - 2];
  
  return {
    company: {
      name: meta.longName || meta.shortName || symbol,
      ticker: symbol,
      description: null,
      sector: null,
      industry: null,
      headquarters: null,
      website: null,
      employees: null
    },
    price: {
      current: currentPrice,
      change: currentPrice - previousClose,
      changePercent: previousClose ? ((currentPrice - previousClose) / previousClose) : 0,
      high52w: meta.fiftyTwoWeekHigh || null,
      low52w: meta.fiftyTwoWeekLow || null,
      dayHigh: meta.regularMarketDayHigh || null,
      dayLow: meta.regularMarketDayLow || null,
      open: meta.regularMarketOpen || null,
      previousClose: previousClose
    },
    fundamentals: {
      marketCap: null,
      beta: null,
      avgVolume: null,
      peRatio: null,
      forwardPe: null,
      pegRatio: null,
      priceToSales: null,
      priceToBook: null,
      evRevenue: null,
      evEbitda: null,
      dividendYield: null,
      sharesOutstanding: null
    },
    analysts: {
      targetPrice: null,
      targetHigh: null,
      targetLow: null,
      recommendationScore: null,
      recommendationKey: null,
      numBuy: 0,
      numHold: 0,
      numSell: 0,
      numberOfAnalysts: null
    },
    financials: {
      revenue: null,
      revenueGrowth: null,
      grossMargin: null,
      operatingMargin: null,
      profitMargin: null,
      returnOnEquity: null,
      returnOnAssets: null,
      freeCashFlow: null,
      operatingCashFlow: null,
      debtToEquity: null,
      currentRatio: null,
      quickRatio: null
    },
    priceHistory
  };
}

// Fetch with retry and rotating user agents
async function fetchWithRetry(url, retries = 3) {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  ];
  
  let lastError;
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': userAgents[i % userAgents.length],
          'Accept': 'application/json,text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Cache-Control': 'max-age=0'
        }
      });
      
      if (response.ok) {
        return response;
      }
      
      // If rate limited, wait and retry
      if (response.status === 429) {
        await new Promise(r => setTimeout(r, 1000 * (i + 1)));
        continue;
      }
      
      throw new Error(`HTTP ${response.status}`);
    } catch (err) {
      lastError = err;
      // Wait before retry
      if (i < retries - 1) {
        await new Promise(r => setTimeout(r, 500 * (i + 1)));
      }
    }
  }
  
  throw lastError || new Error('Fetch failed after retries');
}
