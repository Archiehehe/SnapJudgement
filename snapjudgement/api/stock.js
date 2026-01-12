const yahooFinance = require('yahoo-finance2').default;

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
  
  // Initialize result with defaults
  const result = {
    company: { name: symbol, ticker: symbol, description: null, sector: null, industry: null, headquarters: null, website: null, employees: null },
    price: { current: null, change: null, changePercent: null, high52w: null, low52w: null, dayHigh: null, dayLow: null, open: null, previousClose: null },
    fundamentals: { marketCap: null, beta: null, avgVolume: null, peRatio: null, forwardPe: null, pegRatio: null, priceToSales: null, priceToBook: null, evRevenue: null, evEbitda: null, dividendYield: null, sharesOutstanding: null },
    analysts: { targetPrice: null, targetHigh: null, targetLow: null, recommendationScore: null, recommendationKey: null, numBuy: 0, numHold: 0, numSell: 0, numberOfAnalysts: null },
    financials: { revenue: null, revenueGrowth: null, grossMargin: null, operatingMargin: null, profitMargin: null, returnOnEquity: null, returnOnAssets: null, freeCashFlow: null, operatingCashFlow: null, debtToEquity: null, currentRatio: null, quickRatio: null },
    priceHistory: []
  };

  try {
    // Fetch quoteSummary for all the detailed data
    const quoteSummary = await yahooFinance.quoteSummary(symbol, {
      modules: ['price', 'summaryProfile', 'summaryDetail', 'financialData', 'recommendationTrend', 'defaultKeyStatistics']
    });
    
    const price = quoteSummary.price || {};
    const profile = quoteSummary.summaryProfile || {};
    const detail = quoteSummary.summaryDetail || {};
    const financial = quoteSummary.financialData || {};
    const keyStats = quoteSummary.defaultKeyStatistics || {};
    const recTrend = quoteSummary.recommendationTrend?.trend?.[0] || {};
    
    // Company info
    result.company.name = price.longName || price.shortName || symbol;
    result.company.description = profile.longBusinessSummary || null;
    result.company.sector = profile.sector || null;
    result.company.industry = profile.industry || null;
    result.company.headquarters = (profile.city && profile.country) ? `${profile.city}, ${profile.country}` : null;
    result.company.website = profile.website || null;
    result.company.employees = profile.fullTimeEmployees || null;
    
    // Price info
    result.price.current = price.regularMarketPrice || null;
    result.price.change = price.regularMarketChange || null;
    result.price.changePercent = price.regularMarketChangePercent || null;
    result.price.high52w = detail.fiftyTwoWeekHigh || null;
    result.price.low52w = detail.fiftyTwoWeekLow || null;
    result.price.dayHigh = price.regularMarketDayHigh || null;
    result.price.dayLow = price.regularMarketDayLow || null;
    result.price.open = price.regularMarketOpen || null;
    result.price.previousClose = price.regularMarketPreviousClose || null;
    
    // Fundamentals
    result.fundamentals.marketCap = price.marketCap || null;
    result.fundamentals.beta = detail.beta || null;
    result.fundamentals.avgVolume = detail.averageVolume || null;
    result.fundamentals.peRatio = detail.trailingPE || null;
    result.fundamentals.forwardPe = detail.forwardPE || null;
    result.fundamentals.pegRatio = keyStats.pegRatio || null;
    result.fundamentals.priceToSales = detail.priceToSalesTrailing12Months || null;
    result.fundamentals.priceToBook = keyStats.priceToBook || null;
    result.fundamentals.evRevenue = keyStats.enterpriseToRevenue || null;
    result.fundamentals.evEbitda = keyStats.enterpriseToEbitda || null;
    result.fundamentals.dividendYield = detail.dividendYield || null;
    result.fundamentals.sharesOutstanding = keyStats.sharesOutstanding || null;
    
    // Analysts
    result.analysts.targetPrice = financial.targetMeanPrice || null;
    result.analysts.targetHigh = financial.targetHighPrice || null;
    result.analysts.targetLow = financial.targetLowPrice || null;
    result.analysts.recommendationScore = financial.recommendationMean || null;
    result.analysts.recommendationKey = financial.recommendationKey || null;
    result.analysts.numBuy = (recTrend.strongBuy || 0) + (recTrend.buy || 0);
    result.analysts.numHold = recTrend.hold || 0;
    result.analysts.numSell = (recTrend.sell || 0) + (recTrend.strongSell || 0);
    result.analysts.numberOfAnalysts = financial.numberOfAnalystOpinions || null;
    
    // Financials
    result.financials.revenue = financial.totalRevenue || null;
    result.financials.revenueGrowth = financial.revenueGrowth || null;
    result.financials.grossMargin = financial.grossMargins || null;
    result.financials.operatingMargin = financial.operatingMargins || null;
    result.financials.profitMargin = financial.profitMargins || null;
    result.financials.returnOnEquity = financial.returnOnEquity || null;
    result.financials.returnOnAssets = financial.returnOnAssets || null;
    result.financials.freeCashFlow = financial.freeCashflow || null;
    result.financials.operatingCashFlow = financial.operatingCashflow || null;
    result.financials.debtToEquity = financial.debtToEquity || null;
    result.financials.currentRatio = financial.currentRatio || null;
    result.financials.quickRatio = financial.quickRatio || null;

  } catch (err) {
    console.error('quoteSummary error:', err.message);
  }

  // Get historical data for chart
  try {
    const period1 = getRangeDate(range);
    const chartData = await yahooFinance.chart(symbol, {
      period1: period1,
      period2: new Date(),
      interval: '1d'
    });
    
    if (chartData.quotes && chartData.quotes.length > 0) {
      result.priceHistory = chartData.quotes
        .filter(q => q.close != null)
        .map(q => ({
          timestamp: Math.floor(new Date(q.date).getTime() / 1000),
          price: q.close
        }));
      
      // Fallback price data from chart if quoteSummary failed
      if (!result.price.current && chartData.meta) {
        result.price.current = chartData.meta.regularMarketPrice;
        result.price.previousClose = chartData.meta.previousClose;
        result.company.name = chartData.meta.longName || chartData.meta.shortName || symbol;
        if (result.price.current && result.price.previousClose) {
          result.price.change = result.price.current - result.price.previousClose;
          result.price.changePercent = result.price.change / result.price.previousClose;
        }
      }
    }
  } catch (err) {
    console.error('chart error:', err.message);
  }

  return res.status(200).json(result);
};

function getRangeDate(range) {
  const now = new Date();
  switch (range) {
    case '1d': return new Date(now.getTime() - 86400000);
    case '5d': return new Date(now.getTime() - 5 * 86400000);
    case '1mo': now.setMonth(now.getMonth() - 1); return now;
    case '6mo': now.setMonth(now.getMonth() - 6); return now;
    case 'ytd': return new Date(now.getFullYear(), 0, 1);
    case '1y': now.setFullYear(now.getFullYear() - 1); return now;
    case '5y': now.setFullYear(now.getFullYear() - 5); return now;
    default: now.setFullYear(now.getFullYear() - 1); return now;
  }
}
