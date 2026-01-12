// Vercel Serverless Function - Stock Data API using yahoo-finance2
import yahooFinance from 'yahoo-finance2';

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
    // Suppress yahoo-finance2 validation notices
    yahooFinance.suppressNotices(['yahooSurvey', 'rippiArchitecture']);
    
    // Fetch quote summary with all modules
    const quoteSummary = await yahooFinance.quoteSummary(symbol, {
      modules: [
        'price',
        'summaryProfile', 
        'summaryDetail',
        'financialData',
        'recommendationTrend',
        'defaultKeyStatistics'
      ]
    });
    
    // Fetch historical data for chart
    const period1 = getRangeStartDate(range);
    const historical = await yahooFinance.chart(symbol, {
      period1: period1,
      interval: '1d'
    });
    
    // Extract data from quoteSummary
    const price = quoteSummary.price || {};
    const profile = quoteSummary.summaryProfile || {};
    const detail = quoteSummary.summaryDetail || {};
    const financial = quoteSummary.financialData || {};
    const keyStats = quoteSummary.defaultKeyStatistics || {};
    const recommendations = quoteSummary.recommendationTrend?.trend?.[0] || {};
    
    // Build price history from chart data
    const quotes = historical.quotes || [];
    const priceHistory = quotes
      .filter(q => q.close != null)
      .map(q => ({
        timestamp: Math.floor(new Date(q.date).getTime() / 1000),
        price: q.close
      }));
    
    // Build response
    const result = {
      company: {
        name: price.longName || price.shortName || symbol,
        ticker: symbol,
        description: profile.longBusinessSummary || null,
        sector: profile.sector || null,
        industry: profile.industry || null,
        headquarters: profile.city && profile.country ? `${profile.city}, ${profile.country}` : null,
        website: profile.website || null,
        employees: profile.fullTimeEmployees || null
      },
      price: {
        current: price.regularMarketPrice || null,
        change: price.regularMarketChange || null,
        changePercent: price.regularMarketChangePercent || null,
        high52w: detail.fiftyTwoWeekHigh || null,
        low52w: detail.fiftyTwoWeekLow || null,
        dayHigh: price.regularMarketDayHigh || null,
        dayLow: price.regularMarketDayLow || null,
        open: price.regularMarketOpen || null,
        previousClose: price.regularMarketPreviousClose || null
      },
      fundamentals: {
        marketCap: price.marketCap || null,
        beta: detail.beta || null,
        avgVolume: detail.averageVolume || null,
        peRatio: detail.trailingPE || null,
        forwardPe: detail.forwardPE || null,
        pegRatio: keyStats.pegRatio || null,
        priceToSales: detail.priceToSalesTrailing12Months || null,
        priceToBook: keyStats.priceToBook || null,
        evRevenue: keyStats.enterpriseToRevenue || null,
        evEbitda: keyStats.enterpriseToEbitda || null,
        dividendYield: detail.dividendYield || null,
        sharesOutstanding: keyStats.sharesOutstanding || null
      },
      analysts: {
        targetPrice: financial.targetMeanPrice || null,
        targetHigh: financial.targetHighPrice || null,
        targetLow: financial.targetLowPrice || null,
        recommendationScore: financial.recommendationMean || null,
        recommendationKey: financial.recommendationKey || null,
        numBuy: (recommendations.strongBuy || 0) + (recommendations.buy || 0),
        numHold: recommendations.hold || 0,
        numSell: (recommendations.sell || 0) + (recommendations.strongSell || 0),
        numberOfAnalysts: financial.numberOfAnalystOpinions || null
      },
      financials: {
        revenue: financial.totalRevenue || null,
        revenueGrowth: financial.revenueGrowth || null,
        grossMargin: financial.grossMargins || null,
        operatingMargin: financial.operatingMargins || null,
        profitMargin: financial.profitMargins || null,
        returnOnEquity: financial.returnOnEquity || null,
        returnOnAssets: financial.returnOnAssets || null,
        freeCashFlow: financial.freeCashflow || null,
        operatingCashFlow: financial.operatingCashflow || null,
        debtToEquity: financial.debtToEquity || null,
        currentRatio: financial.currentRatio || null,
        quickRatio: financial.quickRatio || null
      },
      priceHistory
    };
    
    return res.status(200).json(result);
    
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch stock data',
      message: error.message,
      ticker: symbol
    });
  }
}

// Calculate start date based on range
function getRangeStartDate(range) {
  const now = new Date();
  switch (range) {
    case '1d':
      return new Date(now.setDate(now.getDate() - 1));
    case '5d':
      return new Date(now.setDate(now.getDate() - 5));
    case '1mo':
      return new Date(now.setMonth(now.getMonth() - 1));
    case '6mo':
      return new Date(now.setMonth(now.getMonth() - 6));
    case 'ytd':
      return new Date(now.getFullYear(), 0, 1);
    case '1y':
      return new Date(now.setFullYear(now.getFullYear() - 1));
    case '5y':
      return new Date(now.setFullYear(now.getFullYear() - 5));
    default:
      return new Date(now.setFullYear(now.getFullYear() - 1));
  }
}
