import React, { useState, useCallback } from 'react';
import { Search, TrendingUp, TrendingDown, DollarSign, Users, BarChart3, Activity, AlertCircle, Loader2, Zap, ExternalLink, ChevronDown } from 'lucide-react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import STOCK_DATABASE from './stockData';

// Group stocks by sector for the dropdown
const SECTORS = {};
Object.entries(STOCK_DATABASE).forEach(([ticker, info]) => {
  const sector = info.sector || 'Other';
  if (!SECTORS[sector]) SECTORS[sector] = [];
  SECTORS[sector].push({ ticker, ...info });
});

// Sort sectors and stocks within
Object.keys(SECTORS).forEach(sector => {
  SECTORS[sector].sort((a, b) => a.ticker.localeCompare(b.ticker));
});

// Popular/Featured tickers for quick access
const FEATURED_TICKERS = ['AAPL', 'NVDA', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'JPM', 'V', 'UNH', 'LLY', 'XOM'];

// Utility functions
const formatNumber = (num, decimals = 2) => {
  if (num === null || num === undefined || isNaN(num)) return '—';
  if (Math.abs(num) >= 1e12) return (num / 1e12).toFixed(decimals) + 'T';
  if (Math.abs(num) >= 1e9) return (num / 1e9).toFixed(decimals) + 'B';
  if (Math.abs(num) >= 1e6) return (num / 1e6).toFixed(decimals) + 'M';
  if (Math.abs(num) >= 1e3) return (num / 1e3).toFixed(decimals) + 'K';
  return num.toFixed(decimals);
};

const formatPercent = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '—';
  const val = typeof num === 'number' && Math.abs(num) < 1 ? num * 100 : num;
  const sign = val >= 0 ? '+' : '';
  return sign + val.toFixed(2) + '%';
};

const formatPrice = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '—';
  return '$' + num.toFixed(2);
};

// Components
const Section = ({ title, icon: Icon, children, delay = 0 }) => (
  <div className="mb-6 animate-fadeIn" style={{ animationDelay: `${delay}ms` }}>
    <div className="flex items-center gap-2 mb-3 border-b border-gray-700/50 pb-2">
      <Icon size={16} className="text-amber-500" />
      <h2 className="text-xs uppercase tracking-widest text-gray-400 font-mono">{title}</h2>
    </div>
    {children}
  </div>
);

const Metric = ({ label, value, subValue, isPositive, highlight }) => (
  <div className="flex justify-between items-baseline py-1.5 border-b border-gray-800/50 last:border-0">
    <span className="text-gray-500 text-sm font-mono">{label}</span>
    <div className="text-right">
      <span className={`font-mono text-sm ${highlight ? 'text-amber-400' : 'text-gray-200'}`}>{value}</span>
      {subValue && (
        <span className={`ml-2 text-xs ${isPositive ? 'text-emerald-400' : isPositive === false ? 'text-red-400' : 'text-gray-500'}`}>
          {subValue}
        </span>
      )}
    </div>
  </div>
);

const RatingBadge = ({ score }) => {
  let displayRating = 'Hold';
  let colors = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  
  if (score) {
    if (score <= 1.5) { displayRating = 'Strong Buy'; colors = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'; }
    else if (score <= 2.2) { displayRating = 'Buy'; colors = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'; }
    else if (score <= 2.8) { displayRating = 'Hold'; colors = 'bg-amber-500/10 text-amber-400 border-amber-500/20'; }
    else if (score <= 3.5) { displayRating = 'Sell'; colors = 'bg-red-500/10 text-red-400 border-red-500/20'; }
    else { displayRating = 'Strong Sell'; colors = 'bg-red-500/20 text-red-400 border-red-500/30'; }
  }
  
  return (
    <span className={`px-3 py-1 rounded text-xs font-mono uppercase tracking-wider border ${colors}`}>
      {displayRating}
    </span>
  );
};

const PriceChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="h-48 flex items-center justify-center text-gray-600">No chart data available</div>;
  }
  
  const isPositive = data.length > 1 && data[data.length - 1].price >= data[0].price;
  
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={{ stroke: '#374151' }} tickLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={{ stroke: '#374151' }} tickLine={false} domain={['auto', 'auto']} tickFormatter={(val) => '$' + val.toFixed(0)} width={50} />
          <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace' }} labelStyle={{ color: '#9ca3af' }} formatter={(value) => ['$' + value.toFixed(2), 'Price']} />
          <Area type="monotone" dataKey="price" stroke={isPositive ? "#10b981" : "#ef4444"} strokeWidth={2} fill="url(#colorPrice)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const StockBrowser = ({ onSelect, currentTicker }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  
  const sortedSectors = Object.keys(SECTORS).filter(s => s && s !== 'Other').sort();
  if (SECTORS['Other']) sortedSectors.push('Other');
  
  const filteredStocks = selectedSector 
    ? SECTORS[selectedSector].filter(s => 
        searchFilter === '' || 
        s.ticker.toLowerCase().includes(searchFilter.toLowerCase()) ||
        s.name.toLowerCase().includes(searchFilter.toLowerCase())
      )
    : [];
  
  return (
    <div className="relative mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-900/50 border border-gray-800/50 rounded-lg text-gray-400 hover:border-gray-700 transition-colors"
      >
        <span className="text-sm">Browse {Object.keys(STOCK_DATABASE).length}+ stocks by sector</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-gray-900 border border-gray-800 rounded-lg shadow-xl max-h-96 overflow-hidden">
          <div className="flex h-full max-h-96">
            {/* Sector List */}
            <div className="w-1/3 border-r border-gray-800 overflow-y-auto">
              {sortedSectors.map(sector => (
                <button
                  key={sector}
                  onClick={() => { setSelectedSector(sector); setSearchFilter(''); }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-800 transition-colors ${selectedSector === sector ? 'bg-gray-800 text-amber-400' : 'text-gray-400'}`}
                >
                  {sector || 'Other'}
                  <span className="text-gray-600 ml-1">({SECTORS[sector]?.length || 0})</span>
                </button>
              ))}
            </div>
            
            {/* Stock List */}
            <div className="w-2/3 flex flex-col overflow-hidden">
              {selectedSector && (
                <div className="p-2 border-b border-gray-800">
                  <input
                    type="text"
                    placeholder="Filter..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              )}
              <div className="overflow-y-auto flex-1">
                {selectedSector ? (
                  filteredStocks.length > 0 ? (
                    filteredStocks.map(stock => (
                      <button
                        key={stock.ticker}
                        onClick={() => { onSelect(stock.ticker); setIsOpen(false); }}
                        className={`w-full px-3 py-2 text-left hover:bg-gray-800 transition-colors ${currentTicker === stock.ticker ? 'bg-amber-500/10' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-amber-400 font-mono text-sm">{stock.ticker}</span>
                          <span className="text-gray-600 text-xs truncate ml-2">{stock.industry}</span>
                        </div>
                        <div className="text-gray-400 text-xs truncate">{stock.name}</div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-gray-600 text-sm text-center">No matches found</div>
                  )
                ) : (
                  <div className="p-4 text-gray-600 text-sm text-center">Select a sector to browse stocks</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const getValuationInterpretation = (data) => {
  if (!data) return null;
  
  const pe = data.fundamentals?.peRatio;
  const forwardPe = data.fundamentals?.forwardPe;
  const growth = data.financials?.revenueGrowth;
  
  let interpretation = '';
  
  if (pe && forwardPe && forwardPe < pe * 0.8) {
    interpretation += `Forward P/E (${forwardPe?.toFixed(1)}) is notably lower than trailing (${pe?.toFixed(1)}), suggesting expected earnings growth. `;
  }
  
  if (pe > 50) {
    interpretation += `At ${pe?.toFixed(1)}x earnings, investors are pricing in significant future growth. `;
  } else if (pe && pe < 15) {
    interpretation += `At ${pe?.toFixed(1)}x earnings, valuation appears modest. `;
  }
  
  if (growth && growth > 0.2) {
    interpretation += `Strong revenue growth of ${(growth * 100).toFixed(1)}% supports premium valuation.`;
  } else if (growth && growth < 0.05 && growth > 0) {
    interpretation += `Slower growth (${(growth * 100).toFixed(1)}%) suggests a mature business profile.`;
  }
  
  return interpretation || 'Review metrics relative to industry peers for context.';
};

// Main App Component
export default function SnapJudgement() {
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('1y');

  const fetchStockData = useCallback(async (tickerSymbol, range = '1y') => {
    const searchTicker = (tickerSymbol || ticker).toUpperCase().trim();
    if (!searchTicker) return;
    
    setLoading(true);
    setError(null);
    setStockData(null);
    setTicker(searchTicker);
    
    try {
      const response = await fetch(`/api/stock?ticker=${searchTicker}&range=${range}`);
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Failed to fetch ${searchTicker}`);
      }
      
      const data = await response.json();
      
      // Process price history for chart
      const priceHistory = (data.priceHistory || []).map(p => ({
        date: new Date(p.timestamp * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: p.price
      }));
      
      // Process percentages
      const processedData = {
        ...data,
        price: {
          ...data.price,
          changePercent: (data.price?.changePercent || 0) * 100
        },
        fundamentals: {
          ...data.fundamentals,
          dividendYield: data.fundamentals?.dividendYield ? data.fundamentals.dividendYield * 100 : null
        },
        priceHistory,
        interpretation: getValuationInterpretation(data)
      };
      
      setStockData(processedData);
      
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to fetch stock data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [ticker]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchStockData(ticker, timeRange);
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    if (stockData?.company?.ticker) {
      fetchStockData(stockData.company.ticker, range);
    }
  };

  // Get stock info from database or use fetched data
  const getStockInfo = (ticker) => STOCK_DATABASE[ticker] || {};

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
      <div className="fixed inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />
      
      <div className="relative max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="text-amber-500" size={24} />
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="text-amber-500">Snap</span>
              <span className="text-gray-300">Judgement</span>
            </h1>
          </div>
          <p className="text-gray-500 text-sm font-mono">
            Five-minute investment briefs • {Object.keys(STOCK_DATABASE).length}+ stocks
          </p>
        </header>

        {/* Search */}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex items-center w-full bg-gray-900/80 border border-gray-700/50 rounded-lg overflow-hidden focus-within:border-amber-500/50 transition-colors">
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder="Enter any ticker symbol..."
              className="flex-1 bg-transparent px-4 py-4 text-lg font-mono placeholder-gray-600 focus:outline-none"
              disabled={loading}
            />
            <button type="submit" disabled={loading || !ticker.trim()} className="px-6 py-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 transition-all disabled:opacity-50 border-l border-gray-700/50">
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
            </button>
          </div>
        </form>

        {/* Stock Browser */}
        <StockBrowser onSelect={(t) => fetchStockData(t, timeRange)} currentTicker={stockData?.company?.ticker} />

        {/* Featured Tickers */}
        {!stockData && !loading && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {FEATURED_TICKERS.map(t => (
              <button
                key={t}
                onClick={() => fetchStockData(t, timeRange)}
                className="px-3 py-1.5 text-xs font-mono text-gray-500 hover:text-amber-400 bg-gray-900/50 hover:bg-gray-900 border border-gray-800/50 hover:border-amber-500/30 rounded transition-all"
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 size={40} className="animate-spin text-amber-500 mx-auto mb-4" />
            <p className="text-gray-500 font-mono text-sm">Fetching {ticker} data...</p>
          </div>
        )}

        {/* Stock Data */}
        {stockData && !loading && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="bg-gray-900/50 border border-gray-800/50 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-amber-500 font-mono text-sm">{stockData.company?.ticker}</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-500 text-sm">{stockData.company?.sector || getStockInfo(stockData.company?.ticker).sector}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-100">{stockData.company?.name}</h2>
                  <p className="text-gray-500 text-sm mt-1">{stockData.company?.industry || getStockInfo(stockData.company?.ticker).industry}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold font-mono text-gray-100">{formatPrice(stockData.price?.current)}</div>
                  <div className={`text-sm font-mono flex items-center justify-end gap-1 ${stockData.price?.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stockData.price?.changePercent >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {formatPrice(stockData.price?.change)} ({formatPercent(stockData.price?.changePercent / 100)})
                  </div>
                </div>
              </div>
              {stockData.company?.description && (
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{stockData.company.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-600">
                {stockData.company?.headquarters && <span className="font-mono">📍 {stockData.company.headquarters}</span>}
                {stockData.company?.employees && <span className="font-mono">👥 {formatNumber(stockData.company.employees, 0)} employees</span>}
                {stockData.company?.website && (
                  <a href={stockData.company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-amber-500 transition-colors">
                    <ExternalLink size={12} /> Website
                  </a>
                )}
              </div>
            </div>

            {/* Sanity Check */}
            <Section title="Sanity Check" icon={Activity} delay={100}>
              <div className="bg-gray-900/30 border border-gray-800/30 rounded-lg p-4">
                <Metric label="Current Price" value={formatPrice(stockData.price?.current)} />
                <Metric label="Day Range" value={`${formatPrice(stockData.price?.dayLow)} — ${formatPrice(stockData.price?.dayHigh)}`} />
                <Metric label="52-Week Range" value={`${formatPrice(stockData.price?.low52w)} — ${formatPrice(stockData.price?.high52w)}`} />
                <Metric label="Market Cap" value={formatNumber(stockData.fundamentals?.marketCap)} highlight />
                <Metric label="Avg Volume" value={formatNumber(stockData.fundamentals?.avgVolume, 0)} />
                <Metric label="Beta" value={stockData.fundamentals?.beta?.toFixed(2) || '—'} />
              </div>
            </Section>

            {/* Valuation */}
            <Section title="Valuation Snapshot" icon={DollarSign} delay={200}>
              <div className="bg-gray-900/30 border border-gray-800/30 rounded-lg p-4">
                <Metric label="P/E (TTM)" value={stockData.fundamentals?.peRatio?.toFixed(1) || '—'} highlight />
                <Metric label="Forward P/E" value={stockData.fundamentals?.forwardPe?.toFixed(1) || '—'} />
                <Metric label="PEG Ratio" value={stockData.fundamentals?.pegRatio?.toFixed(2) || '—'} />
                <Metric label="Price/Sales" value={stockData.fundamentals?.priceToSales?.toFixed(2) || '—'} />
                <Metric label="Price/Book" value={stockData.fundamentals?.priceToBook?.toFixed(2) || '—'} />
                <Metric label="EV/Revenue" value={stockData.fundamentals?.evRevenue?.toFixed(2) || '—'} />
                <Metric label="EV/EBITDA" value={stockData.fundamentals?.evEbitda?.toFixed(2) || '—'} />
                {stockData.fundamentals?.dividendYield > 0 && (
                  <Metric label="Dividend Yield" value={formatPercent(stockData.fundamentals.dividendYield / 100)} />
                )}
              </div>
              {stockData.interpretation && (
                <div className="mt-3 p-3 bg-amber-500/5 border border-amber-500/10 rounded text-sm text-gray-400 italic">
                  💡 {stockData.interpretation}
                </div>
              )}
            </Section>

            {/* Analysts */}
            <Section title="Street Sentiment" icon={Users} delay={300}>
              <div className="bg-gray-900/30 border border-gray-800/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-500 text-sm font-mono">Analyst Consensus</span>
                  <RatingBadge score={stockData.analysts?.recommendationScore} />
                </div>
                <Metric 
                  label="Price Target" 
                  value={formatPrice(stockData.analysts?.targetPrice)}
                  subValue={stockData.analysts?.targetPrice && stockData.price?.current 
                    ? formatPercent((stockData.analysts.targetPrice - stockData.price.current) / stockData.price.current) + ' upside'
                    : null}
                  isPositive={stockData.analysts?.targetPrice > stockData.price?.current}
                  highlight
                />
                <Metric label="Target Range" value={`${formatPrice(stockData.analysts?.targetLow)} — ${formatPrice(stockData.analysts?.targetHigh)}`} />
                <Metric label="# of Analysts" value={stockData.analysts?.numberOfAnalysts || '—'} />
                
                {(stockData.analysts?.numBuy > 0 || stockData.analysts?.numHold > 0 || stockData.analysts?.numSell > 0) && (
                  <div className="flex gap-4 mt-3 pt-3 border-t border-gray-800/50">
                    <div className="flex-1 text-center">
                      <div className="text-emerald-400 font-mono text-lg">{stockData.analysts?.numBuy || 0}</div>
                      <div className="text-gray-600 text-xs uppercase tracking-wider">Buy</div>
                    </div>
                    <div className="flex-1 text-center border-x border-gray-800/50">
                      <div className="text-amber-400 font-mono text-lg">{stockData.analysts?.numHold || 0}</div>
                      <div className="text-gray-600 text-xs uppercase tracking-wider">Hold</div>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="text-red-400 font-mono text-lg">{stockData.analysts?.numSell || 0}</div>
                      <div className="text-gray-600 text-xs uppercase tracking-wider">Sell</div>
                    </div>
                  </div>
                )}
              </div>
            </Section>

            {/* Financials */}
            <Section title="Business Momentum" icon={BarChart3} delay={400}>
              <div className="bg-gray-900/30 border border-gray-800/30 rounded-lg p-4">
                <Metric 
                  label="Revenue (TTM)" 
                  value={formatNumber(stockData.financials?.revenue)}
                  subValue={stockData.financials?.revenueGrowth ? formatPercent(stockData.financials.revenueGrowth) + ' growth' : null}
                  isPositive={stockData.financials?.revenueGrowth > 0}
                  highlight
                />
                <Metric label="Gross Margin" value={stockData.financials?.grossMargin ? formatPercent(stockData.financials.grossMargin) : '—'} />
                <Metric label="Operating Margin" value={stockData.financials?.operatingMargin ? formatPercent(stockData.financials.operatingMargin) : '—'} isPositive={stockData.financials?.operatingMargin > 0} />
                <Metric label="Profit Margin" value={stockData.financials?.profitMargin ? formatPercent(stockData.financials.profitMargin) : '—'} isPositive={stockData.financials?.profitMargin > 0} />
                <Metric label="Return on Equity" value={stockData.financials?.returnOnEquity ? formatPercent(stockData.financials.returnOnEquity) : '—'} isPositive={stockData.financials?.returnOnEquity > 0} />
                <Metric label="Free Cash Flow" value={formatNumber(stockData.financials?.freeCashFlow)} isPositive={stockData.financials?.freeCashFlow > 0} />
                {stockData.financials?.debtToEquity && <Metric label="Debt/Equity" value={stockData.financials.debtToEquity.toFixed(1)} />}
              </div>
            </Section>

            {/* Chart */}
            <Section title="Price Behavior" icon={TrendingUp} delay={500}>
              <div className="bg-gray-900/30 border border-gray-800/30 rounded-lg p-4">
                <div className="flex gap-1 mb-4 flex-wrap">
                  {['1d', '5d', '1mo', '6mo', 'ytd', '1y', '5y'].map(range => (
                    <button
                      key={range}
                      onClick={() => handleTimeRangeChange(range)}
                      className={`px-3 py-1 text-xs font-mono rounded transition-all ${
                        timeRange === range 
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                          : 'text-gray-500 hover:text-gray-300 border border-transparent hover:border-gray-700'
                      }`}
                    >
                      {range.toUpperCase()}
                    </button>
                  ))}
                </div>
                <PriceChart data={stockData.priceHistory} />
              </div>
            </Section>

            {/* Disclaimer */}
            <div className="mt-8 pt-6 border-t border-gray-800/30 text-center">
              <p className="text-gray-600 text-xs">
                SnapJudgement is a research tool, not financial advice. Data from Yahoo Finance. Always do your own due diligence.
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!stockData && !loading && !error && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-900/50 border border-gray-800/50 mb-6">
              <Search className="text-gray-600" size={24} />
            </div>
            <h3 className="text-gray-400 text-lg mb-2">Enter any ticker or browse by sector</h3>
            <p className="text-gray-600 text-sm max-w-md mx-auto">
              Get a structured investment brief in seconds. Supports {Object.keys(STOCK_DATABASE).length}+ stocks and can fetch any valid ticker.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}
