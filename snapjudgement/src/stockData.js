// S&P 1500+ Stock Database - Complete coverage
// The API can fetch ANY ticker - this list is for browsing convenience

const STOCK_DATABASE = {
  "AAPL": {
    "name": "Apple Inc.",
    "sector": "Technology",
    "industry": "Consumer Electronics"
  },
  "MSFT": {
    "name": "Microsoft",
    "sector": "Technology",
    "industry": "Software"
  },
  "GOOGL": {
    "name": "Alphabet Class A",
    "sector": "Technology",
    "industry": "Internet"
  },
  "GOOG": {
    "name": "Alphabet Class C",
    "sector": "Technology",
    "industry": "Internet"
  },
  "NVDA": {
    "name": "NVIDIA",
    "sector": "Technology",
    "industry": "Semiconductors"
  },
  "META": {
    "name": "Meta Platforms",
    "sector": "Technology",
    "industry": "Social Media"
  },
  "AVGO": {
    "name": "Broadcom",
    "sector": "Technology",
    "industry": "Semiconductors"
  },
  "ORCL": {
    "name": "Oracle",
    "sector": "Technology",
    "industry": "Software"
  },
  "CRM": {
    "name": "Salesforce",
    "sector": "Technology",
    "industry": "Cloud Software"
  },
  "ADBE": {
    "name": "Adobe",
    "sector": "Technology",
    "industry": "Software"
  },
  "AMD": {
    "name": "AMD",
    "sector": "Technology",
    "industry": "Semiconductors"
  },
  "CSCO": {
    "name": "Cisco Systems",
    "sector": "Technology",
    "industry": "Networking"
  },
  "ACN": {
    "name": "Accenture",
    "sector": "Technology",
    "industry": "IT Services"
  },
  "IBM": {
    "name": "IBM",
    "sector": "Technology",
    "industry": "IT Services"
  },
  "INTC": {
    "name": "Intel",
    "sector": "Technology",
    "industry": "Semiconductors"
  },
  "QCOM": {
    "name": "Qualcomm",
    "sector": "Technology",
    "industry": "Semiconductors"
  },
  "TXN": {
    "name": "Texas Instruments",
    "sector": "Technology",
    "industry": "Semiconductors"
  },
  "NOW": {
    "name": "ServiceNow",
    "sector": "Technology",
    "industry": "Cloud Software"
  },
  "INTU": {
    "name": "Intuit",
    "sector": "Technology",
    "industry": "Software"
  },
  "AMAT": {
    "name": "Applied Materials",
    "sector": "Technology",
    "industry": "Semiconductor Equipment"
  },
  "MU": {
    "name": "Micron",
    "sector": "Technology",
    "industry": "Memory"
  },
  "LRCX": {
    "name": "Lam Research",
    "sector": "Technology",
    "industry": "Semiconductor Equipment"
  },
  "ADI": {
    "name": "Analog Devices",
    "sector": "Technology",
    "industry": "Semiconductors"
  },
  "KLAC": {
    "name": "KLA Corp",
    "sector": "Technology",
    "industry": "Semiconductor Equipment"
  },
  "SNPS": {
    "name": "Synopsys",
    "sector": "Technology",
    "industry": "EDA Software"
  },
  "CDNS": {
    "name": "Cadence Design",
    "sector": "Technology",
    "industry": "EDA Software"
  },
  "PANW": {
    "name": "Palo Alto Networks",
    "sector": "Technology",
    "industry": "Cybersecurity"
  },
  "CRWD": {
    "name": "CrowdStrike",
    "sector": "Technology",
    "industry": "Cybersecurity"
  },
  "FTNT": {
    "name": "Fortinet",
    "sector": "Technology",
    "industry": "Cybersecurity"
  },
  "WDAY": {
    "name": "Workday",
    "sector": "Technology",
    "industry": "Cloud Software"
  },
  "ADSK": {
    "name": "Autodesk",
    "sector": "Technology",
    "industry": "Software"
  },
  "MRVL": {
    "name": "Marvell Technology",
    "sector": "Technology",
    "industry": "Semiconductors"
  },
  "NXPI": {
    "name": "NXP Semiconductors",
    "sector": "Technology",
    "industry": "Semiconductors"
  },
  "ON": {
    "name": "ON Semiconductor",
    "sector": "Technology",
    "industry": "Semiconductors"
  },
  "MPWR": {
    "name": "Monolithic Power",
    "sector": "Technology",
    "industry": "Semiconductors"
  },
  "MCHP": {
    "name": "Microchip Technology",
    "sector": "Technology",
    "industry": "Semiconductors"
  },
  "APH": {
    "name": "Amphenol",
    "sector": "Technology",
    "industry": "Electronics"
  },
  "TEL": {
    "name": "TE Connectivity",
    "sector": "Technology",
    "industry": "Electronics"
  },
  "MSI": {
    "name": "Motorola Solutions",
    "sector": "Technology",
    "industry": "Communications"
  },
  "KEYS": {
    "name": "Keysight",
    "sector": "Technology",
    "industry": "Test Equipment"
  },
  "ANSS": {
    "name": "ANSYS",
    "sector": "Technology",
    "industry": "Simulation"
  },
  "CTSH": {
    "name": "Cognizant",
    "sector": "Technology",
    "industry": "IT Services"
  },
  "IT": {
    "name": "Gartner",
    "sector": "Technology",
    "industry": "IT Services"
  },
  "CDW": {
    "name": "CDW Corp",
    "sector": "Technology",
    "industry": "IT Distribution"
  },
  "EPAM": {
    "name": "EPAM Systems",
    "sector": "Technology",
    "industry": "IT Services"
  },
  "GDDY": {
    "name": "GoDaddy",
    "sector": "Technology",
    "industry": "Internet"
  },
  "GEN": {
    "name": "Gen Digital",
    "sector": "Technology",
    "industry": "Cybersecurity"
  },
  "AKAM": {
    "name": "Akamai",
    "sector": "Technology",
    "industry": "Cloud"
  },
  "FFIV": {
    "name": "F5 Inc",
    "sector": "Technology",
    "industry": "Networking"
  },
  "JNPR": {
    "name": "Juniper Networks",
    "sector": "Technology",
    "industry": "Networking"
  },
  "TYL": {
    "name": "Tyler Technologies",
    "sector": "Technology",
    "industry": "Software"
  },
  "PAYC": {
    "name": "Paycom",
    "sector": "Technology",
    "industry": "HR Software"
  },
  "PTC": {
    "name": "PTC Inc",
    "sector": "Technology",
    "industry": "Software"
  },
  "SWKS": {
    "name": "Skyworks",
    "sector": "Technology",
    "industry": "Semiconductors"
  },
  "QRVO": {
    "name": "Qorvo",
    "sector": "Technology",
    "industry": "Semiconductors"
  },
  "TER": {
    "name": "Teradyne",
    "sector": "Technology",
    "industry": "Test Equipment"
  },
  "ENTG": {
    "name": "Entegris",
    "sector": "Technology",
    "industry": "Semiconductor Materials"
  },
  "TEAM": {
    "name": "Atlassian",
    "sector": "Technology",
    "industry": "Software"
  },
  "DDOG": {
    "name": "Datadog",
    "sector": "Technology",
    "industry": "Monitoring"
  },
  "ZS": {
    "name": "Zscaler",
    "sector": "Technology",
    "industry": "Cybersecurity"
  },
  "NET": {
    "name": "Cloudflare",
    "sector": "Technology",
    "industry": "Cloud"
  },
  "SNOW": {
    "name": "Snowflake",
    "sector": "Technology",
    "industry": "Cloud Data"
  },
  "MDB": {
    "name": "MongoDB",
    "sector": "Technology",
    "industry": "Database"
  },
  "PLTR": {
    "name": "Palantir",
    "sector": "Technology",
    "industry": "Data Analytics"
  },
  "HUBS": {
    "name": "HubSpot",
    "sector": "Technology",
    "industry": "Marketing Software"
  },
  "VEEV": {
    "name": "Veeva Systems",
    "sector": "Technology",
    "industry": "Life Sciences Software"
  },
  "OKTA": {
    "name": "Okta",
    "sector": "Technology",
    "industry": "Identity"
  },
  "DOCU": {
    "name": "DocuSign",
    "sector": "Technology",
    "industry": "E-Signature"
  },
  "ZM": {
    "name": "Zoom Video",
    "sector": "Technology",
    "industry": "Video"
  },
  "TWLO": {
    "name": "Twilio",
    "sector": "Technology",
    "industry": "Communications"
  },
  "S": {
    "name": "SentinelOne",
    "sector": "Technology",
    "industry": "Cybersecurity"
  },
  "PATH": {
    "name": "UiPath",
    "sector": "Technology",
    "industry": "Automation"
  },
  "BILL": {
    "name": "BILL Holdings",
    "sector": "Technology",
    "industry": "Fintech"
  },
  "DT": {
    "name": "Dynatrace",
    "sector": "Technology",
    "industry": "Observability"
  },
  "CYBR": {
    "name": "CyberArk",
    "sector": "Technology",
    "industry": "Security"
  },
  "AMZN": {
    "name": "Amazon",
    "sector": "Technology",
    "industry": "E-Commerce"
  },
  "UBER": {
    "name": "Uber",
    "sector": "Technology",
    "industry": "Ride-Sharing"
  },
  "ABNB": {
    "name": "Airbnb",
    "sector": "Technology",
    "industry": "Travel Tech"
  },
  "BKNG": {
    "name": "Booking Holdings",
    "sector": "Technology",
    "industry": "Online Travel"
  },
  "EXPE": {
    "name": "Expedia",
    "sector": "Technology",
    "industry": "Online Travel"
  },
  "SQ": {
    "name": "Block Inc",
    "sector": "Technology",
    "industry": "Fintech"
  },
  "SHOP": {
    "name": "Shopify",
    "sector": "Technology",
    "industry": "E-Commerce"
  },
  "COIN": {
    "name": "Coinbase",
    "sector": "Technology",
    "industry": "Crypto"
  },
  "DASH": {
    "name": "DoorDash",
    "sector": "Technology",
    "industry": "Delivery"
  },
  "LYFT": {
    "name": "Lyft",
    "sector": "Technology",
    "industry": "Ride-Sharing"
  },
  "PINS": {
    "name": "Pinterest",
    "sector": "Technology",
    "industry": "Social Media"
  },
  "SNAP": {
    "name": "Snap Inc",
    "sector": "Technology",
    "industry": "Social Media"
  },
  "ETSY": {
    "name": "Etsy",
    "sector": "Technology",
    "industry": "E-Commerce"
  },
  "EBAY": {
    "name": "eBay",
    "sector": "Technology",
    "industry": "E-Commerce"
  },
  "W": {
    "name": "Wayfair",
    "sector": "Technology",
    "industry": "E-Commerce"
  },
  "CHWY": {
    "name": "Chewy",
    "sector": "Technology",
    "industry": "E-Commerce"
  },
  "CVNA": {
    "name": "Carvana",
    "sector": "Technology",
    "industry": "Auto E-Commerce"
  },
  "ZG": {
    "name": "Zillow",
    "sector": "Technology",
    "industry": "Real Estate Tech"
  },
  "MTCH": {
    "name": "Match Group",
    "sector": "Technology",
    "industry": "Dating"
  },
  "DELL": {
    "name": "Dell Technologies",
    "sector": "Technology",
    "industry": "Hardware"
  },
  "HPQ": {
    "name": "HP Inc",
    "sector": "Technology",
    "industry": "Hardware"
  },
  "HPE": {
    "name": "HPE",
    "sector": "Technology",
    "industry": "IT Infrastructure"
  },
  "NTAP": {
    "name": "NetApp",
    "sector": "Technology",
    "industry": "Storage"
  },
  "PSTG": {
    "name": "Pure Storage",
    "sector": "Technology",
    "industry": "Storage"
  },
  "WDC": {
    "name": "Western Digital",
    "sector": "Technology",
    "industry": "Storage"
  },
  "STX": {
    "name": "Seagate",
    "sector": "Technology",
    "industry": "Storage"
  },
  "SMCI": {
    "name": "Super Micro",
    "sector": "Technology",
    "industry": "Servers"
  },
  "ANET": {
    "name": "Arista Networks",
    "sector": "Technology",
    "industry": "Networking"
  },
  "GLW": {
    "name": "Corning",
    "sector": "Technology",
    "industry": "Specialty Glass"
  },
  "FLEX": {
    "name": "Flex Ltd",
    "sector": "Technology",
    "industry": "Manufacturing"
  },
  "JBL": {
    "name": "Jabil",
    "sector": "Technology",
    "industry": "Manufacturing"
  },
  "JPM": {
    "name": "JPMorgan Chase",
    "sector": "Financials",
    "industry": "Banks"
  },
  "BAC": {
    "name": "Bank of America",
    "sector": "Financials",
    "industry": "Banks"
  },
  "WFC": {
    "name": "Wells Fargo",
    "sector": "Financials",
    "industry": "Banks"
  },
  "C": {
    "name": "Citigroup",
    "sector": "Financials",
    "industry": "Banks"
  },
  "GS": {
    "name": "Goldman Sachs",
    "sector": "Financials",
    "industry": "Investment Banking"
  },
  "MS": {
    "name": "Morgan Stanley",
    "sector": "Financials",
    "industry": "Investment Banking"
  },
  "USB": {
    "name": "U.S. Bancorp",
    "sector": "Financials",
    "industry": "Banks"
  },
  "PNC": {
    "name": "PNC Financial",
    "sector": "Financials",
    "industry": "Banks"
  },
  "TFC": {
    "name": "Truist",
    "sector": "Financials",
    "industry": "Banks"
  },
  "COF": {
    "name": "Capital One",
    "sector": "Financials",
    "industry": "Banks"
  },
  "BK": {
    "name": "BNY Mellon",
    "sector": "Financials",
    "industry": "Custody Banks"
  },
  "STT": {
    "name": "State Street",
    "sector": "Financials",
    "industry": "Custody Banks"
  },
  "SCHW": {
    "name": "Charles Schwab",
    "sector": "Financials",
    "industry": "Brokerage"
  },
  "NTRS": {
    "name": "Northern Trust",
    "sector": "Financials",
    "industry": "Wealth Management"
  },
  "FITB": {
    "name": "Fifth Third",
    "sector": "Financials",
    "industry": "Banks"
  },
  "KEY": {
    "name": "KeyCorp",
    "sector": "Financials",
    "industry": "Banks"
  },
  "MTB": {
    "name": "M&T Bank",
    "sector": "Financials",
    "industry": "Banks"
  },
  "RF": {
    "name": "Regions Financial",
    "sector": "Financials",
    "industry": "Banks"
  },
  "HBAN": {
    "name": "Huntington Bancshares",
    "sector": "Financials",
    "industry": "Banks"
  },
  "CFG": {
    "name": "Citizens Financial",
    "sector": "Financials",
    "industry": "Banks"
  },
  "ZION": {
    "name": "Zions Bancorp",
    "sector": "Financials",
    "industry": "Banks"
  },
  "CMA": {
    "name": "Comerica",
    "sector": "Financials",
    "industry": "Banks"
  },
  "FHN": {
    "name": "First Horizon",
    "sector": "Financials",
    "industry": "Banks"
  },
  "ALLY": {
    "name": "Ally Financial",
    "sector": "Financials",
    "industry": "Auto Finance"
  },
  "SYF": {
    "name": "Synchrony",
    "sector": "Financials",
    "industry": "Consumer Finance"
  },
  "DFS": {
    "name": "Discover Financial",
    "sector": "Financials",
    "industry": "Credit Cards"
  },
  "WAL": {
    "name": "Western Alliance",
    "sector": "Financials",
    "industry": "Regional Banks"
  },
  "EWBC": {
    "name": "East West Bancorp",
    "sector": "Financials",
    "industry": "Regional Banks"
  },
  "PNFP": {
    "name": "Pinnacle Financial",
    "sector": "Financials",
    "industry": "Regional Banks"
  },
  "WTFC": {
    "name": "Wintrust",
    "sector": "Financials",
    "industry": "Regional Banks"
  },
  "ONB": {
    "name": "Old National",
    "sector": "Financials",
    "industry": "Regional Banks"
  },
  "UMBF": {
    "name": "UMB Financial",
    "sector": "Financials",
    "industry": "Regional Banks"
  },
  "SNV": {
    "name": "Synovus",
    "sector": "Financials",
    "industry": "Regional Banks"
  },
  "FNB": {
    "name": "F.N.B. Corp",
    "sector": "Financials",
    "industry": "Regional Banks"
  },
  "CBSH": {
    "name": "Commerce Bancshares",
    "sector": "Financials",
    "industry": "Regional Banks"
  },
  "V": {
    "name": "Visa",
    "sector": "Financials",
    "industry": "Payments"
  },
  "MA": {
    "name": "Mastercard",
    "sector": "Financials",
    "industry": "Payments"
  },
  "AXP": {
    "name": "American Express",
    "sector": "Financials",
    "industry": "Credit Cards"
  },
  "PYPL": {
    "name": "PayPal",
    "sector": "Financials",
    "industry": "Digital Payments"
  },
  "FIS": {
    "name": "FIS",
    "sector": "Financials",
    "industry": "Payment Processing"
  },
  "FISV": {
    "name": "Fiserv",
    "sector": "Financials",
    "industry": "Payment Processing"
  },
  "GPN": {
    "name": "Global Payments",
    "sector": "Financials",
    "industry": "Payment Processing"
  },
  "FLT": {
    "name": "FleetCor",
    "sector": "Financials",
    "industry": "Payment Processing"
  },
  "WU": {
    "name": "Western Union",
    "sector": "Financials",
    "industry": "Money Transfer"
  },
  "AFRM": {
    "name": "Affirm",
    "sector": "Financials",
    "industry": "BNPL"
  },
  "SOFI": {
    "name": "SoFi",
    "sector": "Financials",
    "industry": "Digital Banking"
  },
  "TOST": {
    "name": "Toast",
    "sector": "Financials",
    "industry": "Restaurant Tech"
  },
  "FOUR": {
    "name": "Shift4",
    "sector": "Financials",
    "industry": "Payment Processing"
  },
  "BLK": {
    "name": "BlackRock",
    "sector": "Financials",
    "industry": "Asset Management"
  },
  "BX": {
    "name": "Blackstone",
    "sector": "Financials",
    "industry": "Alternative Assets"
  },
  "KKR": {
    "name": "KKR",
    "sector": "Financials",
    "industry": "Alternative Assets"
  },
  "APO": {
    "name": "Apollo Global",
    "sector": "Financials",
    "industry": "Alternative Assets"
  },
  "CG": {
    "name": "Carlyle Group",
    "sector": "Financials",
    "industry": "Alternative Assets"
  },
  "ARES": {
    "name": "Ares Management",
    "sector": "Financials",
    "industry": "Alternative Assets"
  },
  "TROW": {
    "name": "T. Rowe Price",
    "sector": "Financials",
    "industry": "Asset Management"
  },
  "IVZ": {
    "name": "Invesco",
    "sector": "Financials",
    "industry": "Asset Management"
  },
  "BEN": {
    "name": "Franklin Resources",
    "sector": "Financials",
    "industry": "Asset Management"
  },
  "LPLA": {
    "name": "LPL Financial",
    "sector": "Financials",
    "industry": "Brokerage"
  },
  "RJF": {
    "name": "Raymond James",
    "sector": "Financials",
    "industry": "Brokerage"
  },
  "IBKR": {
    "name": "Interactive Brokers",
    "sector": "Financials",
    "industry": "Brokerage"
  },
  "HOOD": {
    "name": "Robinhood",
    "sector": "Financials",
    "industry": "Brokerage"
  },
  "SPGI": {
    "name": "S&P Global",
    "sector": "Financials",
    "industry": "Financial Data"
  },
  "MCO": {
    "name": "Moody's",
    "sector": "Financials",
    "industry": "Credit Ratings"
  },
  "MSCI": {
    "name": "MSCI",
    "sector": "Financials",
    "industry": "Index Provider"
  },
  "ICE": {
    "name": "ICE",
    "sector": "Financials",
    "industry": "Exchanges"
  },
  "CME": {
    "name": "CME Group",
    "sector": "Financials",
    "industry": "Exchanges"
  },
  "NDAQ": {
    "name": "Nasdaq",
    "sector": "Financials",
    "industry": "Exchanges"
  },
  "CBOE": {
    "name": "Cboe",
    "sector": "Financials",
    "industry": "Exchanges"
  },
  "FDS": {
    "name": "FactSet",
    "sector": "Financials",
    "industry": "Financial Data"
  },
  "MORN": {
    "name": "Morningstar",
    "sector": "Financials",
    "industry": "Financial Data"
  },
  "BRK.B": {
    "name": "Berkshire B",
    "sector": "Financials",
    "industry": "Insurance"
  },
  "PGR": {
    "name": "Progressive",
    "sector": "Financials",
    "industry": "Auto Insurance"
  },
  "ALL": {
    "name": "Allstate",
    "sector": "Financials",
    "industry": "Insurance"
  },
  "TRV": {
    "name": "Travelers",
    "sector": "Financials",
    "industry": "Insurance"
  },
  "CB": {
    "name": "Chubb",
    "sector": "Financials",
    "industry": "Insurance"
  },
  "MET": {
    "name": "MetLife",
    "sector": "Financials",
    "industry": "Life Insurance"
  },
  "PRU": {
    "name": "Prudential",
    "sector": "Financials",
    "industry": "Life Insurance"
  },
  "AIG": {
    "name": "AIG",
    "sector": "Financials",
    "industry": "Insurance"
  },
  "AFL": {
    "name": "Aflac",
    "sector": "Financials",
    "industry": "Insurance"
  },
  "MMC": {
    "name": "Marsh & McLennan",
    "sector": "Financials",
    "industry": "Insurance Brokers"
  },
  "AON": {
    "name": "Aon",
    "sector": "Financials",
    "industry": "Insurance Brokers"
  },
  "WTW": {
    "name": "Willis Towers Watson",
    "sector": "Financials",
    "industry": "Insurance Brokers"
  },
  "AJG": {
    "name": "Arthur J Gallagher",
    "sector": "Financials",
    "industry": "Insurance Brokers"
  },
  "BRO": {
    "name": "Brown & Brown",
    "sector": "Financials",
    "industry": "Insurance Brokers"
  },
  "L": {
    "name": "Loews",
    "sector": "Financials",
    "industry": "Insurance"
  },
  "HIG": {
    "name": "Hartford Financial",
    "sector": "Financials",
    "industry": "Insurance"
  },
  "WRB": {
    "name": "W.R. Berkley",
    "sector": "Financials",
    "industry": "Insurance"
  },
  "CINF": {
    "name": "Cincinnati Financial",
    "sector": "Financials",
    "industry": "Insurance"
  },
  "ACGL": {
    "name": "Arch Capital",
    "sector": "Financials",
    "industry": "Insurance"
  },
  "GL": {
    "name": "Globe Life",
    "sector": "Financials",
    "industry": "Life Insurance"
  },
  "LNC": {
    "name": "Lincoln National",
    "sector": "Financials",
    "industry": "Life Insurance"
  },
  "VOYA": {
    "name": "Voya",
    "sector": "Financials",
    "industry": "Retirement"
  },
  "PFG": {
    "name": "Principal Financial",
    "sector": "Financials",
    "industry": "Retirement"
  },
  "UNH": {
    "name": "UnitedHealth",
    "sector": "Healthcare",
    "industry": "Health Insurance"
  },
  "JNJ": {
    "name": "Johnson & Johnson",
    "sector": "Healthcare",
    "industry": "Pharma"
  },
  "LLY": {
    "name": "Eli Lilly",
    "sector": "Healthcare",
    "industry": "Pharma"
  },
  "PFE": {
    "name": "Pfizer",
    "sector": "Healthcare",
    "industry": "Pharma"
  },
  "ABBV": {
    "name": "AbbVie",
    "sector": "Healthcare",
    "industry": "Pharma"
  },
  "MRK": {
    "name": "Merck",
    "sector": "Healthcare",
    "industry": "Pharma"
  },
  "NVO": {
    "name": "Novo Nordisk A/S",
    "sector": "Healthcare",
    "industry": "Major Diversified Pharmaceuticals"
  },
  "AZN": {
    "name": "AstraZeneca PLC",
    "sector": "Healthcare",
    "industry": "Major Diversified Pharmaceuticals"
  },
  "NVS": {
    "name": "Novartis AG",
    "sector": "Healthcare",
    "industry": "Major Diversified Pharmaceuticals"
  },
  "BMY": {
    "name": "Bristol-Myers",
    "sector": "Healthcare",
    "industry": "Pharma"
  },
  "ZTS": {
    "name": "Zoetis",
    "sector": "Healthcare",
    "industry": "Animal Health"
  },
  "AMGN": {
    "name": "Amgen",
    "sector": "Healthcare",
    "industry": "Biotech"
  },
  "GILD": {
    "name": "Gilead",
    "sector": "Healthcare",
    "industry": "Biotech"
  },
  "VRTX": {
    "name": "Vertex",
    "sector": "Healthcare",
    "industry": "Biotech"
  },
  "REGN": {
    "name": "Regeneron",
    "sector": "Healthcare",
    "industry": "Biotech"
  },
  "BIIB": {
    "name": "Biogen",
    "sector": "Healthcare",
    "industry": "Biotech"
  },
  "MRNA": {
    "name": "Moderna",
    "sector": "Healthcare",
    "industry": "Biotech"
  },
  "ILMN": {
    "name": "Illumina",
    "sector": "Healthcare",
    "industry": "Life Sciences"
  },
  "ALNY": {
    "name": "Alnylam",
    "sector": "Healthcare",
    "industry": "Biotech"
  },
  "BNTX": {
    "name": "BioNTech",
    "sector": "Healthcare",
    "industry": "Biotech"
  },
  "INCY": {
    "name": "Incyte",
    "sector": "Healthcare",
    "industry": "Biotech"
  },
  "BMRN": {
    "name": "BioMarin",
    "sector": "Healthcare",
    "industry": "Biotech"
  },
  "EXEL": {
    "name": "Exelixis",
    "sector": "Healthcare",
    "industry": "Biotech"
  },
  "SRPT": {
    "name": "Sarepta",
    "sector": "Healthcare",
    "industry": "Biotech"
  },
  "UTHR": {
    "name": "United Therapeutics",
    "sector": "Healthcare",
    "industry": "Biotech"
  },
  "NBIX": {
    "name": "Neurocrine",
    "sector": "Healthcare",
    "industry": "Biotech"
  },
  "IONS": {
    "name": "Ionis",
    "sector": "Healthcare",
    "industry": "Biotech"
  },
  "NTRA": {
    "name": "Natera",
    "sector": "Healthcare",
    "industry": "Diagnostics"
  },
  "HALO": {
    "name": "Halozyme",
    "sector": "Healthcare",
    "industry": "Biotech"
  },
  "ARGX": {
    "name": "argenx SE",
    "sector": "Healthcare",
    "industry": "Established & Profitable Biotechnology"
  },
  "INSM": {
    "name": "Insmed",
    "sector": "Healthcare",
    "industry": "Biotech"
  },
  "LEGN": {
    "name": "Legend Biotech",
    "sector": "Healthcare",
    "industry": "Biotech"
  },
  "CRSP": {
    "name": "CRISPR",
    "sector": "Healthcare",
    "industry": "Gene Editing"
  },
  "TMO": {
    "name": "Thermo Fisher",
    "sector": "Healthcare",
    "industry": "Life Sciences"
  },
  "ABT": {
    "name": "Abbott",
    "sector": "Healthcare",
    "industry": "Medical Devices"
  },
  "DHR": {
    "name": "Danaher",
    "sector": "Healthcare",
    "industry": "Life Sciences"
  },
  "MDT": {
    "name": "Medtronic",
    "sector": "Healthcare",
    "industry": "Medical Devices"
  },
  "ISRG": {
    "name": "Intuitive Surgical",
    "sector": "Healthcare",
    "industry": "Robotic Surgery"
  },
  "SYK": {
    "name": "Stryker",
    "sector": "Healthcare",
    "industry": "Medical Devices"
  },
  "BSX": {
    "name": "Boston Scientific",
    "sector": "Healthcare",
    "industry": "Medical Devices"
  },
  "BDX": {
    "name": "Becton Dickinson",
    "sector": "Healthcare",
    "industry": "Medical Devices"
  },
  "EW": {
    "name": "Edwards Lifesciences",
    "sector": "Healthcare",
    "industry": "Medical Devices"
  },
  "ZBH": {
    "name": "Zimmer Biomet",
    "sector": "Healthcare",
    "industry": "Orthopedics"
  },
  "BAX": {
    "name": "Baxter",
    "sector": "Healthcare",
    "industry": "Medical Devices"
  },
  "A": {
    "name": "Agilent",
    "sector": "Healthcare",
    "industry": "Life Sciences"
  },
  "MTD": {
    "name": "Mettler-Toledo",
    "sector": "Healthcare",
    "industry": "Lab Equipment"
  },
  "WAT": {
    "name": "Waters",
    "sector": "Healthcare",
    "industry": "Lab Equipment"
  },
  "IQV": {
    "name": "IQVIA",
    "sector": "Healthcare",
    "industry": "CRO"
  },
  "RMD": {
    "name": "ResMed",
    "sector": "Healthcare",
    "industry": "Medical Devices"
  },
  "IDXX": {
    "name": "IDEXX",
    "sector": "Healthcare",
    "industry": "Veterinary"
  },
  "DXCM": {
    "name": "Dexcom",
    "sector": "Healthcare",
    "industry": "Glucose Monitoring"
  },
  "PODD": {
    "name": "Insulet",
    "sector": "Healthcare",
    "industry": "Diabetes"
  },
  "HOLX": {
    "name": "Hologic",
    "sector": "Healthcare",
    "industry": "Women's Health"
  },
  "TFX": {
    "name": "Teleflex",
    "sector": "Healthcare",
    "industry": "Medical Devices"
  },
  "ALGN": {
    "name": "Align Technology",
    "sector": "Healthcare",
    "industry": "Dental"
  },
  "COO": {
    "name": "Cooper Companies",
    "sector": "Healthcare",
    "industry": "Contact Lenses"
  },
  "STE": {
    "name": "STERIS",
    "sector": "Healthcare",
    "industry": "Sterilization"
  },
  "TECH": {
    "name": "Bio-Techne",
    "sector": "Healthcare",
    "industry": "Life Sciences"
  },
  "BIO": {
    "name": "Bio-Rad",
    "sector": "Healthcare",
    "industry": "Life Sciences"
  },
  "WST": {
    "name": "West Pharmaceutical",
    "sector": "Healthcare",
    "industry": "Drug Delivery"
  },
  "PEN": {
    "name": "Penumbra",
    "sector": "Healthcare",
    "industry": "Medical Devices"
  },
  "ELV": {
    "name": "Elevance Health",
    "sector": "Healthcare",
    "industry": "Health Insurance"
  },
  "CI": {
    "name": "Cigna",
    "sector": "Healthcare",
    "industry": "Health Insurance"
  },
  "HUM": {
    "name": "Humana",
    "sector": "Healthcare",
    "industry": "Health Insurance"
  },
  "CNC": {
    "name": "Centene",
    "sector": "Healthcare",
    "industry": "Medicaid"
  },
  "MOH": {
    "name": "Molina",
    "sector": "Healthcare",
    "industry": "Medicaid"
  },
  "CVS": {
    "name": "CVS Health",
    "sector": "Healthcare",
    "industry": "Pharmacy"
  },
  "MCK": {
    "name": "McKesson",
    "sector": "Healthcare",
    "industry": "Distribution"
  },
  "ABC": {
    "name": "Cencora",
    "sector": "Healthcare",
    "industry": "Distribution"
  },
  "CAH": {
    "name": "Cardinal Health",
    "sector": "Healthcare",
    "industry": "Distribution"
  },
  "WBA": {
    "name": "Walgreens",
    "sector": "Healthcare",
    "industry": "Pharmacy"
  },
  "HCA": {
    "name": "HCA Healthcare",
    "sector": "Healthcare",
    "industry": "Hospitals"
  },
  "UHS": {
    "name": "Universal Health",
    "sector": "Healthcare",
    "industry": "Hospitals"
  },
  "THC": {
    "name": "Tenet Healthcare",
    "sector": "Healthcare",
    "industry": "Hospitals"
  },
  "DVA": {
    "name": "DaVita",
    "sector": "Healthcare",
    "industry": "Dialysis"
  },
  "EHC": {
    "name": "Encompass Health",
    "sector": "Healthcare",
    "industry": "Rehab"
  },
  "TSLA": {
    "name": "Tesla",
    "sector": "Consumer",
    "industry": "Electric Vehicles"
  },
  "TM": {
    "name": "Toyota Motor Corp",
    "sector": "Consumer Cyclical",
    "industry": "Traditional & Diversified Automakers"
  },
  "GM": {
    "name": "General Motors",
    "sector": "Consumer",
    "industry": "Auto"
  },
  "F": {
    "name": "Ford",
    "sector": "Consumer",
    "industry": "Auto"
  },
  "RIVN": {
    "name": "Rivian",
    "sector": "Consumer",
    "industry": "Electric Vehicles"
  },
  "LCID": {
    "name": "Lucid",
    "sector": "Consumer",
    "industry": "Electric Vehicles"
  },
  "APTV": {
    "name": "Aptiv",
    "sector": "Consumer",
    "industry": "Auto Parts"
  },
  "BWA": {
    "name": "BorgWarner",
    "sector": "Consumer",
    "industry": "Auto Parts"
  },
  "LEA": {
    "name": "Lear",
    "sector": "Consumer",
    "industry": "Auto Parts"
  },
  "MGA": {
    "name": "Magna",
    "sector": "Consumer",
    "industry": "Auto Parts"
  },
  "GNTX": {
    "name": "Gentex",
    "sector": "Consumer",
    "industry": "Auto Parts"
  },
  "ORLY": {
    "name": "O'Reilly Auto",
    "sector": "Consumer",
    "industry": "Auto Parts Retail"
  },
  "AZO": {
    "name": "AutoZone",
    "sector": "Consumer",
    "industry": "Auto Parts Retail"
  },
  "AAP": {
    "name": "Advance Auto Parts",
    "sector": "Consumer",
    "industry": "Auto Parts Retail"
  },
  "GPC": {
    "name": "Genuine Parts",
    "sector": "Consumer",
    "industry": "Auto Parts Retail"
  },
  "LKQ": {
    "name": "LKQ",
    "sector": "Consumer",
    "industry": "Auto Parts"
  },
  "AN": {
    "name": "AutoNation",
    "sector": "Consumer",
    "industry": "Auto Dealers"
  },
  "PAG": {
    "name": "Penske Auto",
    "sector": "Consumer",
    "industry": "Auto Dealers"
  },
  "LAD": {
    "name": "Lithia Motors",
    "sector": "Consumer",
    "industry": "Auto Dealers"
  },
  "HD": {
    "name": "Home Depot",
    "sector": "Consumer",
    "industry": "Home Improvement"
  },
  "LOW": {
    "name": "Lowe's",
    "sector": "Consumer",
    "industry": "Home Improvement"
  },
  "TJX": {
    "name": "TJX Companies",
    "sector": "Consumer",
    "industry": "Off-Price Retail"
  },
  "ROST": {
    "name": "Ross Stores",
    "sector": "Consumer",
    "industry": "Off-Price Retail"
  },
  "BURL": {
    "name": "Burlington",
    "sector": "Consumer",
    "industry": "Off-Price Retail"
  },
  "BBY": {
    "name": "Best Buy",
    "sector": "Consumer",
    "industry": "Electronics Retail"
  },
  "ULTA": {
    "name": "Ulta Beauty",
    "sector": "Consumer",
    "industry": "Beauty Retail"
  },
  "TSCO": {
    "name": "Tractor Supply",
    "sector": "Consumer",
    "industry": "Farm & Ranch"
  },
  "WSM": {
    "name": "Williams-Sonoma",
    "sector": "Consumer",
    "industry": "Home Furnishings"
  },
  "RH": {
    "name": "RH",
    "sector": "Consumer",
    "industry": "Home Furnishings"
  },
  "BBWI": {
    "name": "Bath & Body Works",
    "sector": "Consumer",
    "industry": "Specialty Retail"
  },
  "GPS": {
    "name": "Gap",
    "sector": "Consumer",
    "industry": "Apparel Retail"
  },
  "ANF": {
    "name": "Abercrombie",
    "sector": "Consumer",
    "industry": "Apparel Retail"
  },
  "AEO": {
    "name": "American Eagle",
    "sector": "Consumer",
    "industry": "Apparel Retail"
  },
  "DKS": {
    "name": "Dick's Sporting",
    "sector": "Consumer",
    "industry": "Sporting Goods"
  },
  "FL": {
    "name": "Foot Locker",
    "sector": "Consumer",
    "industry": "Footwear Retail"
  },
  "PLNT": {
    "name": "Planet Fitness",
    "sector": "Consumer",
    "industry": "Fitness"
  },
  "MCD": {
    "name": "McDonald's",
    "sector": "Consumer",
    "industry": "Restaurants"
  },
  "SBUX": {
    "name": "Starbucks",
    "sector": "Consumer",
    "industry": "Coffee"
  },
  "CMG": {
    "name": "Chipotle",
    "sector": "Consumer",
    "industry": "Restaurants"
  },
  "YUM": {
    "name": "Yum! Brands",
    "sector": "Consumer",
    "industry": "Restaurants"
  },
  "DRI": {
    "name": "Darden",
    "sector": "Consumer",
    "industry": "Restaurants"
  },
  "DPZ": {
    "name": "Domino's",
    "sector": "Consumer",
    "industry": "Restaurants"
  },
  "QSR": {
    "name": "Restaurant Brands",
    "sector": "Consumer",
    "industry": "Restaurants"
  },
  "WING": {
    "name": "Wingstop",
    "sector": "Consumer",
    "industry": "Restaurants"
  },
  "CAVA": {
    "name": "Cava",
    "sector": "Consumer",
    "industry": "Restaurants"
  },
  "SHAK": {
    "name": "Shake Shack",
    "sector": "Consumer",
    "industry": "Restaurants"
  },
  "TXRH": {
    "name": "Texas Roadhouse",
    "sector": "Consumer",
    "industry": "Restaurants"
  },
  "EAT": {
    "name": "Brinker",
    "sector": "Consumer",
    "industry": "Restaurants"
  },
  "WEN": {
    "name": "Wendy's",
    "sector": "Consumer",
    "industry": "Restaurants"
  },
  "BROS": {
    "name": "Dutch Bros",
    "sector": "Consumer",
    "industry": "Coffee"
  },
  "NKE": {
    "name": "Nike",
    "sector": "Consumer",
    "industry": "Apparel"
  },
  "LULU": {
    "name": "Lululemon",
    "sector": "Consumer",
    "industry": "Athletic Apparel"
  },
  "VFC": {
    "name": "VF Corp",
    "sector": "Consumer",
    "industry": "Apparel"
  },
  "PVH": {
    "name": "PVH",
    "sector": "Consumer",
    "industry": "Apparel"
  },
  "RL": {
    "name": "Ralph Lauren",
    "sector": "Consumer",
    "industry": "Apparel"
  },
  "TPR": {
    "name": "Tapestry",
    "sector": "Consumer",
    "industry": "Luxury"
  },
  "CPRI": {
    "name": "Capri",
    "sector": "Consumer",
    "industry": "Luxury"
  },
  "UAA": {
    "name": "Under Armour",
    "sector": "Consumer",
    "industry": "Athletic Apparel"
  },
  "SKX": {
    "name": "Skechers",
    "sector": "Consumer",
    "industry": "Footwear"
  },
  "DECK": {
    "name": "Deckers",
    "sector": "Consumer",
    "industry": "Footwear"
  },
  "CROX": {
    "name": "Crocs",
    "sector": "Consumer",
    "industry": "Footwear"
  },
  "HBI": {
    "name": "Hanesbrands",
    "sector": "Consumer",
    "industry": "Apparel"
  },
  "CRI": {
    "name": "Carter's",
    "sector": "Consumer",
    "industry": "Children's Apparel"
  },
  "COLM": {
    "name": "Columbia",
    "sector": "Consumer",
    "industry": "Outdoor Apparel"
  },
  "PG": {
    "name": "Procter & Gamble",
    "sector": "Staples",
    "industry": "Consumer Products"
  },
  "KO": {
    "name": "Coca-Cola",
    "sector": "Staples",
    "industry": "Beverages"
  },
  "PEP": {
    "name": "PepsiCo",
    "sector": "Staples",
    "industry": "Beverages"
  },
  "WMT": {
    "name": "Walmart",
    "sector": "Staples",
    "industry": "Retail"
  },
  "COST": {
    "name": "Costco",
    "sector": "Staples",
    "industry": "Warehouse Clubs"
  },
  "TGT": {
    "name": "Target",
    "sector": "Staples",
    "industry": "Retail"
  },
  "PM": {
    "name": "Philip Morris",
    "sector": "Staples",
    "industry": "Tobacco"
  },
  "MO": {
    "name": "Altria",
    "sector": "Staples",
    "industry": "Tobacco"
  },
  "MDLZ": {
    "name": "Mondelez",
    "sector": "Staples",
    "industry": "Snacks"
  },
  "CL": {
    "name": "Colgate-Palmolive",
    "sector": "Staples",
    "industry": "Consumer Products"
  },
  "EL": {
    "name": "Estée Lauder",
    "sector": "Staples",
    "industry": "Cosmetics"
  },
  "KMB": {
    "name": "Kimberly-Clark",
    "sector": "Staples",
    "industry": "Consumer Products"
  },
  "GIS": {
    "name": "General Mills",
    "sector": "Staples",
    "industry": "Packaged Foods"
  },
  "K": {
    "name": "Kellanova",
    "sector": "Staples",
    "industry": "Packaged Foods"
  },
  "HSY": {
    "name": "Hershey",
    "sector": "Staples",
    "industry": "Confectionery"
  },
  "SJM": {
    "name": "J.M. Smucker",
    "sector": "Staples",
    "industry": "Packaged Foods"
  },
  "CPB": {
    "name": "Campbell Soup",
    "sector": "Staples",
    "industry": "Packaged Foods"
  },
  "CAG": {
    "name": "Conagra",
    "sector": "Staples",
    "industry": "Packaged Foods"
  },
  "HRL": {
    "name": "Hormel",
    "sector": "Staples",
    "industry": "Packaged Foods"
  },
  "TSN": {
    "name": "Tyson Foods",
    "sector": "Staples",
    "industry": "Meat Products"
  },
  "KHC": {
    "name": "Kraft Heinz",
    "sector": "Staples",
    "industry": "Packaged Foods"
  },
  "MKC": {
    "name": "McCormick",
    "sector": "Staples",
    "industry": "Spices"
  },
  "CHD": {
    "name": "Church & Dwight",
    "sector": "Staples",
    "industry": "Consumer Products"
  },
  "CLX": {
    "name": "Clorox",
    "sector": "Staples",
    "industry": "Household Products"
  },
  "SYY": {
    "name": "Sysco",
    "sector": "Staples",
    "industry": "Food Distribution"
  },
  "ADM": {
    "name": "ADM",
    "sector": "Staples",
    "industry": "Agribusiness"
  },
  "BG": {
    "name": "Bunge",
    "sector": "Staples",
    "industry": "Agribusiness"
  },
  "DG": {
    "name": "Dollar General",
    "sector": "Staples",
    "industry": "Discount Retail"
  },
  "DLTR": {
    "name": "Dollar Tree",
    "sector": "Staples",
    "industry": "Discount Retail"
  },
  "KR": {
    "name": "Kroger",
    "sector": "Staples",
    "industry": "Grocery"
  },
  "ACI": {
    "name": "Albertsons",
    "sector": "Staples",
    "industry": "Grocery"
  },
  "STZ": {
    "name": "Constellation Brands",
    "sector": "Staples",
    "industry": "Alcohol"
  },
  "BF.B": {
    "name": "Brown-Forman",
    "sector": "Staples",
    "industry": "Spirits"
  },
  "SAM": {
    "name": "Boston Beer",
    "sector": "Staples",
    "industry": "Beer"
  },
  "TAP": {
    "name": "Molson Coors",
    "sector": "Staples",
    "industry": "Beer"
  },
  "MNST": {
    "name": "Monster Beverage",
    "sector": "Staples",
    "industry": "Energy Drinks"
  },
  "CELH": {
    "name": "Celsius",
    "sector": "Staples",
    "industry": "Energy Drinks"
  },
  "KDP": {
    "name": "Keurig Dr Pepper",
    "sector": "Staples",
    "industry": "Beverages"
  },
  "XOM": {
    "name": "Exxon Mobil",
    "sector": "Energy",
    "industry": "Integrated Oil"
  },
  "CVX": {
    "name": "Chevron",
    "sector": "Energy",
    "industry": "Integrated Oil"
  },
  "COP": {
    "name": "ConocoPhillips",
    "sector": "Energy",
    "industry": "E&P"
  },
  "OXY": {
    "name": "Occidental",
    "sector": "Energy",
    "industry": "E&P"
  },
  "EOG": {
    "name": "EOG Resources",
    "sector": "Energy",
    "industry": "E&P"
  },
  "PXD": {
    "name": "Pioneer Natural",
    "sector": "Energy",
    "industry": "E&P"
  },
  "DVN": {
    "name": "Devon Energy",
    "sector": "Energy",
    "industry": "E&P"
  },
  "FANG": {
    "name": "Diamondback",
    "sector": "Energy",
    "industry": "E&P"
  },
  "HES": {
    "name": "Hess",
    "sector": "Energy",
    "industry": "E&P"
  },
  "MRO": {
    "name": "Marathon Oil",
    "sector": "Energy",
    "industry": "E&P"
  },
  "APA": {
    "name": "APA Corp",
    "sector": "Energy",
    "industry": "E&P"
  },
  "CTRA": {
    "name": "Coterra",
    "sector": "Energy",
    "industry": "E&P"
  },
  "EQT": {
    "name": "EQT",
    "sector": "Energy",
    "industry": "Natural Gas"
  },
  "AR": {
    "name": "Antero Resources",
    "sector": "Energy",
    "industry": "Natural Gas"
  },
  "RRC": {
    "name": "Range Resources",
    "sector": "Energy",
    "industry": "Natural Gas"
  },
  "SWN": {
    "name": "Southwestern Energy",
    "sector": "Energy",
    "industry": "Natural Gas"
  },
  "MPC": {
    "name": "Marathon Petroleum",
    "sector": "Energy",
    "industry": "Refining"
  },
  "VLO": {
    "name": "Valero",
    "sector": "Energy",
    "industry": "Refining"
  },
  "PSX": {
    "name": "Phillips 66",
    "sector": "Energy",
    "industry": "Refining"
  },
  "DINO": {
    "name": "HF Sinclair",
    "sector": "Energy",
    "industry": "Refining"
  },
  "PBF": {
    "name": "PBF Energy",
    "sector": "Energy",
    "industry": "Refining"
  },
  "SLB": {
    "name": "Schlumberger",
    "sector": "Energy",
    "industry": "Oil Services"
  },
  "HAL": {
    "name": "Halliburton",
    "sector": "Energy",
    "industry": "Oil Services"
  },
  "BKR": {
    "name": "Baker Hughes",
    "sector": "Energy",
    "industry": "Oil Services"
  },
  "NOV": {
    "name": "NOV Inc",
    "sector": "Energy",
    "industry": "Oil Equipment"
  },
  "FTI": {
    "name": "TechnipFMC",
    "sector": "Energy",
    "industry": "Oil Services"
  },
  "CHX": {
    "name": "ChampionX",
    "sector": "Energy",
    "industry": "Oil Services"
  },
  "HP": {
    "name": "Helmerich & Payne",
    "sector": "Energy",
    "industry": "Drilling"
  },
  "WMB": {
    "name": "Williams",
    "sector": "Energy",
    "industry": "Pipelines"
  },
  "KMI": {
    "name": "Kinder Morgan",
    "sector": "Energy",
    "industry": "Pipelines"
  },
  "OKE": {
    "name": "ONEOK",
    "sector": "Energy",
    "industry": "Pipelines"
  },
  "TRGP": {
    "name": "Targa Resources",
    "sector": "Energy",
    "industry": "Pipelines"
  },
  "LNG": {
    "name": "Cheniere",
    "sector": "Energy",
    "industry": "LNG"
  },
  "ET": {
    "name": "Energy Transfer",
    "sector": "Energy",
    "industry": "Pipelines"
  },
  "EPD": {
    "name": "Enterprise Products",
    "sector": "Energy",
    "industry": "Pipelines"
  },
  "MPLX": {
    "name": "MPLX",
    "sector": "Energy",
    "industry": "Pipelines"
  },
  "BA": {
    "name": "Boeing",
    "sector": "Industrials",
    "industry": "Aerospace"
  },
  "RTX": {
    "name": "RTX",
    "sector": "Industrials",
    "industry": "Aerospace & Defense"
  },
  "LMT": {
    "name": "Lockheed Martin",
    "sector": "Industrials",
    "industry": "Defense"
  },
  "NOC": {
    "name": "Northrop Grumman",
    "sector": "Industrials",
    "industry": "Defense"
  },
  "GD": {
    "name": "General Dynamics",
    "sector": "Industrials",
    "industry": "Defense"
  },
  "GE": {
    "name": "GE Aerospace",
    "sector": "Industrials",
    "industry": "Aerospace"
  },
  "LHX": {
    "name": "L3Harris",
    "sector": "Industrials",
    "industry": "Defense"
  },
  "TDG": {
    "name": "TransDigm",
    "sector": "Industrials",
    "industry": "Aerospace Parts"
  },
  "HWM": {
    "name": "Howmet",
    "sector": "Industrials",
    "industry": "Aerospace Parts"
  },
  "HEI": {
    "name": "HEICO",
    "sector": "Industrials",
    "industry": "Aerospace Parts"
  },
  "TXT": {
    "name": "Textron",
    "sector": "Industrials",
    "industry": "Aerospace"
  },
  "SPR": {
    "name": "Spirit Aero",
    "sector": "Industrials",
    "industry": "Aerospace Parts"
  },
  "CW": {
    "name": "Curtiss-Wright",
    "sector": "Industrials",
    "industry": "Aerospace Parts"
  },
  "AXON": {
    "name": "Axon",
    "sector": "Industrials",
    "industry": "Defense"
  },
  "LDOS": {
    "name": "Leidos",
    "sector": "Industrials",
    "industry": "Defense IT"
  },
  "SAIC": {
    "name": "SAIC",
    "sector": "Industrials",
    "industry": "Defense IT"
  },
  "BAH": {
    "name": "Booz Allen",
    "sector": "Industrials",
    "industry": "Defense IT"
  },
  "CAT": {
    "name": "Caterpillar",
    "sector": "Industrials",
    "industry": "Machinery"
  },
  "DE": {
    "name": "Deere",
    "sector": "Industrials",
    "industry": "Farm Equipment"
  },
  "HON": {
    "name": "Honeywell",
    "sector": "Industrials",
    "industry": "Conglomerate"
  },
  "MMM": {
    "name": "3M",
    "sector": "Industrials",
    "industry": "Conglomerate"
  },
  "EMR": {
    "name": "Emerson",
    "sector": "Industrials",
    "industry": "Industrial Tech"
  },
  "ETN": {
    "name": "Eaton",
    "sector": "Industrials",
    "industry": "Electrical"
  },
  "ITW": {
    "name": "Illinois Tool Works",
    "sector": "Industrials",
    "industry": "Machinery"
  },
  "PH": {
    "name": "Parker-Hannifin",
    "sector": "Industrials",
    "industry": "Hydraulics"
  },
  "ROK": {
    "name": "Rockwell",
    "sector": "Industrials",
    "industry": "Automation"
  },
  "DOV": {
    "name": "Dover",
    "sector": "Industrials",
    "industry": "Diversified"
  },
  "AME": {
    "name": "AMETEK",
    "sector": "Industrials",
    "industry": "Electronics"
  },
  "IR": {
    "name": "Ingersoll Rand",
    "sector": "Industrials",
    "industry": "Machinery"
  },
  "XYL": {
    "name": "Xylem",
    "sector": "Industrials",
    "industry": "Water"
  },
  "IEX": {
    "name": "IDEX",
    "sector": "Industrials",
    "industry": "Pumps"
  },
  "GGG": {
    "name": "Graco",
    "sector": "Industrials",
    "industry": "Fluid Handling"
  },
  "NDSN": {
    "name": "Nordson",
    "sector": "Industrials",
    "industry": "Dispensing"
  },
  "ROP": {
    "name": "Roper",
    "sector": "Industrials",
    "industry": "Diversified"
  },
  "SWK": {
    "name": "Stanley Black & Decker",
    "sector": "Industrials",
    "industry": "Tools"
  },
  "GNRC": {
    "name": "Generac",
    "sector": "Industrials",
    "industry": "Generators"
  },
  "TT": {
    "name": "Trane",
    "sector": "Industrials",
    "industry": "HVAC"
  },
  "LII": {
    "name": "Lennox",
    "sector": "Industrials",
    "industry": "HVAC"
  },
  "CARR": {
    "name": "Carrier",
    "sector": "Industrials",
    "industry": "HVAC"
  },
  "JCI": {
    "name": "Johnson Controls",
    "sector": "Industrials",
    "industry": "Building Tech"
  },
  "AOS": {
    "name": "A.O. Smith",
    "sector": "Industrials",
    "industry": "Water Heaters"
  },
  "MAS": {
    "name": "Masco",
    "sector": "Industrials",
    "industry": "Building Products"
  },
  "FAST": {
    "name": "Fastenal",
    "sector": "Industrials",
    "industry": "Distribution"
  },
  "GWW": {
    "name": "Grainger",
    "sector": "Industrials",
    "industry": "Distribution"
  },
  "AGCO": {
    "name": "AGCO",
    "sector": "Industrials",
    "industry": "Farm Equipment"
  },
  "CNHI": {
    "name": "CNH Industrial",
    "sector": "Industrials",
    "industry": "Farm Equipment"
  },
  "OSK": {
    "name": "Oshkosh",
    "sector": "Industrials",
    "industry": "Trucks"
  },
  "PCAR": {
    "name": "PACCAR",
    "sector": "Industrials",
    "industry": "Trucks"
  },
  "CMI": {
    "name": "Cummins",
    "sector": "Industrials",
    "industry": "Engines"
  },
  "UNP": {
    "name": "Union Pacific",
    "sector": "Industrials",
    "industry": "Railroads"
  },
  "CSX": {
    "name": "CSX",
    "sector": "Industrials",
    "industry": "Railroads"
  },
  "NSC": {
    "name": "Norfolk Southern",
    "sector": "Industrials",
    "industry": "Railroads"
  },
  "UPS": {
    "name": "UPS",
    "sector": "Industrials",
    "industry": "Logistics"
  },
  "FDX": {
    "name": "FedEx",
    "sector": "Industrials",
    "industry": "Logistics"
  },
  "CHRW": {
    "name": "C.H. Robinson",
    "sector": "Industrials",
    "industry": "Freight"
  },
  "EXPD": {
    "name": "Expeditors",
    "sector": "Industrials",
    "industry": "Freight"
  },
  "XPO": {
    "name": "XPO",
    "sector": "Industrials",
    "industry": "Trucking"
  },
  "JBHT": {
    "name": "J.B. Hunt",
    "sector": "Industrials",
    "industry": "Trucking"
  },
  "ODFL": {
    "name": "Old Dominion",
    "sector": "Industrials",
    "industry": "Trucking"
  },
  "SAIA": {
    "name": "Saia",
    "sector": "Industrials",
    "industry": "Trucking"
  },
  "DAL": {
    "name": "Delta",
    "sector": "Industrials",
    "industry": "Airlines"
  },
  "UAL": {
    "name": "United Airlines",
    "sector": "Industrials",
    "industry": "Airlines"
  },
  "AAL": {
    "name": "American Airlines",
    "sector": "Industrials",
    "industry": "Airlines"
  },
  "LUV": {
    "name": "Southwest",
    "sector": "Industrials",
    "industry": "Airlines"
  },
  "ALK": {
    "name": "Alaska Air",
    "sector": "Industrials",
    "industry": "Airlines"
  },
  "WM": {
    "name": "Waste Management",
    "sector": "Industrials",
    "industry": "Waste"
  },
  "RSG": {
    "name": "Republic Services",
    "sector": "Industrials",
    "industry": "Waste"
  },
  "WCN": {
    "name": "Waste Connections",
    "sector": "Industrials",
    "industry": "Waste"
  },
  "VRSK": {
    "name": "Verisk",
    "sector": "Industrials",
    "industry": "Data Analytics"
  },
  "BR": {
    "name": "Broadridge",
    "sector": "Industrials",
    "industry": "Financial Tech"
  },
  "CSGP": {
    "name": "CoStar",
    "sector": "Industrials",
    "industry": "Real Estate Data"
  },
  "DIS": {
    "name": "Disney",
    "sector": "Communications",
    "industry": "Entertainment"
  },
  "NFLX": {
    "name": "Netflix",
    "sector": "Communications",
    "industry": "Streaming"
  },
  "CMCSA": {
    "name": "Comcast",
    "sector": "Communications",
    "industry": "Cable"
  },
  "T": {
    "name": "AT&T",
    "sector": "Communications",
    "industry": "Telecom"
  },
  "VZ": {
    "name": "Verizon",
    "sector": "Communications",
    "industry": "Telecom"
  },
  "TMUS": {
    "name": "T-Mobile",
    "sector": "Communications",
    "industry": "Telecom"
  },
  "CHTR": {
    "name": "Charter",
    "sector": "Communications",
    "industry": "Cable"
  },
  "WBD": {
    "name": "Warner Bros",
    "sector": "Communications",
    "industry": "Entertainment"
  },
  "PARA": {
    "name": "Paramount",
    "sector": "Communications",
    "industry": "Entertainment"
  },
  "FOX": {
    "name": "Fox Corp",
    "sector": "Communications",
    "industry": "Media"
  },
  "FOXA": {
    "name": "Fox Corp A",
    "sector": "Communications",
    "industry": "Media"
  },
  "OMC": {
    "name": "Omnicom",
    "sector": "Communications",
    "industry": "Advertising"
  },
  "IPG": {
    "name": "Interpublic",
    "sector": "Communications",
    "industry": "Advertising"
  },
  "EA": {
    "name": "EA",
    "sector": "Communications",
    "industry": "Gaming"
  },
  "TTWO": {
    "name": "Take-Two",
    "sector": "Communications",
    "industry": "Gaming"
  },
  "RBLX": {
    "name": "Roblox",
    "sector": "Communications",
    "industry": "Gaming"
  },
  "LYV": {
    "name": "Live Nation",
    "sector": "Communications",
    "industry": "Entertainment"
  },
  "NWSA": {
    "name": "News Corp",
    "sector": "Communications",
    "industry": "Media"
  },
  "NYT": {
    "name": "NY Times",
    "sector": "Communications",
    "industry": "Publishing"
  },
  "NEE": {
    "name": "NextEra",
    "sector": "Utilities",
    "industry": "Utilities"
  },
  "DUK": {
    "name": "Duke Energy",
    "sector": "Utilities",
    "industry": "Utilities"
  },
  "SO": {
    "name": "Southern Co",
    "sector": "Utilities",
    "industry": "Utilities"
  },
  "D": {
    "name": "Dominion",
    "sector": "Utilities",
    "industry": "Utilities"
  },
  "AEP": {
    "name": "AEP",
    "sector": "Utilities",
    "industry": "Utilities"
  },
  "SRE": {
    "name": "Sempra",
    "sector": "Utilities",
    "industry": "Utilities"
  },
  "EXC": {
    "name": "Exelon",
    "sector": "Utilities",
    "industry": "Utilities"
  },
  "XEL": {
    "name": "Xcel",
    "sector": "Utilities",
    "industry": "Utilities"
  },
  "ED": {
    "name": "Con Edison",
    "sector": "Utilities",
    "industry": "Utilities"
  },
  "PCG": {
    "name": "PG&E",
    "sector": "Utilities",
    "industry": "Utilities"
  },
  "WEC": {
    "name": "WEC Energy",
    "sector": "Utilities",
    "industry": "Utilities"
  },
  "ES": {
    "name": "Eversource",
    "sector": "Utilities",
    "industry": "Utilities"
  },
  "AWK": {
    "name": "American Water",
    "sector": "Utilities",
    "industry": "Water"
  },
  "DTE": {
    "name": "DTE Energy",
    "sector": "Utilities",
    "industry": "Utilities"
  },
  "ETR": {
    "name": "Entergy",
    "sector": "Utilities",
    "industry": "Utilities"
  },
  "PPL": {
    "name": "PPL",
    "sector": "Utilities",
    "industry": "Utilities"
  },
  "FE": {
    "name": "FirstEnergy",
    "sector": "Utilities",
    "industry": "Utilities"
  },
  "AEE": {
    "name": "Ameren",
    "sector": "Utilities",
    "industry": "Utilities"
  },
  "CMS": {
    "name": "CMS Energy",
    "sector": "Utilities",
    "industry": "Utilities"
  },
  "CNP": {
    "name": "CenterPoint",
    "sector": "Utilities",
    "industry": "Utilities"
  },
  "EVRG": {
    "name": "Evergy",
    "sector": "Utilities",
    "industry": "Utilities"
  },
  "NI": {
    "name": "NiSource",
    "sector": "Utilities",
    "industry": "Utilities"
  },
  "ATO": {
    "name": "Atmos",
    "sector": "Utilities",
    "industry": "Gas Utilities"
  },
  "NRG": {
    "name": "NRG",
    "sector": "Utilities",
    "industry": "Utilities"
  },
  "VST": {
    "name": "Vistra",
    "sector": "Utilities",
    "industry": "Utilities"
  },
  "PLD": {
    "name": "Prologis",
    "sector": "Real Estate",
    "industry": "Industrial REITs"
  },
  "AMT": {
    "name": "American Tower",
    "sector": "Real Estate",
    "industry": "Tower REITs"
  },
  "CCI": {
    "name": "Crown Castle",
    "sector": "Real Estate",
    "industry": "Tower REITs"
  },
  "EQIX": {
    "name": "Equinix",
    "sector": "Real Estate",
    "industry": "Data Center REITs"
  },
  "PSA": {
    "name": "Public Storage",
    "sector": "Real Estate",
    "industry": "Storage REITs"
  },
  "SPG": {
    "name": "Simon Property",
    "sector": "Real Estate",
    "industry": "Retail REITs"
  },
  "O": {
    "name": "Realty Income",
    "sector": "Real Estate",
    "industry": "Retail REITs"
  },
  "WELL": {
    "name": "Welltower",
    "sector": "Real Estate",
    "industry": "Healthcare REITs"
  },
  "DLR": {
    "name": "Digital Realty",
    "sector": "Real Estate",
    "industry": "Data Center REITs"
  },
  "VICI": {
    "name": "VICI Properties",
    "sector": "Real Estate",
    "industry": "Gaming REITs"
  },
  "AVB": {
    "name": "AvalonBay",
    "sector": "Real Estate",
    "industry": "Residential REITs"
  },
  "EQR": {
    "name": "Equity Residential",
    "sector": "Real Estate",
    "industry": "Residential REITs"
  },
  "VTR": {
    "name": "Ventas",
    "sector": "Real Estate",
    "industry": "Healthcare REITs"
  },
  "ARE": {
    "name": "Alexandria",
    "sector": "Real Estate",
    "industry": "Life Science REITs"
  },
  "SBAC": {
    "name": "SBA Communications",
    "sector": "Real Estate",
    "industry": "Tower REITs"
  },
  "EXR": {
    "name": "Extra Space",
    "sector": "Real Estate",
    "industry": "Storage REITs"
  },
  "WY": {
    "name": "Weyerhaeuser",
    "sector": "Real Estate",
    "industry": "Timber REITs"
  },
  "MAA": {
    "name": "Mid-America",
    "sector": "Real Estate",
    "industry": "Residential REITs"
  },
  "UDR": {
    "name": "UDR",
    "sector": "Real Estate",
    "industry": "Residential REITs"
  },
  "ESS": {
    "name": "Essex Property",
    "sector": "Real Estate",
    "industry": "Residential REITs"
  },
  "INVH": {
    "name": "Invitation Homes",
    "sector": "Real Estate",
    "industry": "SFR REITs"
  },
  "SUI": {
    "name": "Sun Communities",
    "sector": "Real Estate",
    "industry": "MH REITs"
  },
  "CPT": {
    "name": "Camden",
    "sector": "Real Estate",
    "industry": "Residential REITs"
  },
  "REG": {
    "name": "Regency Centers",
    "sector": "Real Estate",
    "industry": "Retail REITs"
  },
  "KIM": {
    "name": "Kimco",
    "sector": "Real Estate",
    "industry": "Retail REITs"
  },
  "HST": {
    "name": "Host Hotels",
    "sector": "Real Estate",
    "industry": "Hotel REITs"
  },
  "BXP": {
    "name": "Boston Properties",
    "sector": "Real Estate",
    "industry": "Office REITs"
  },
  "VNO": {
    "name": "Vornado",
    "sector": "Real Estate",
    "industry": "Office REITs"
  },
  "SLG": {
    "name": "SL Green",
    "sector": "Real Estate",
    "industry": "Office REITs"
  },
  "LIN": {
    "name": "Linde",
    "sector": "Materials",
    "industry": "Industrial Gases"
  },
  "APD": {
    "name": "Air Products",
    "sector": "Materials",
    "industry": "Industrial Gases"
  },
  "SHW": {
    "name": "Sherwin-Williams",
    "sector": "Materials",
    "industry": "Paints"
  },
  "ECL": {
    "name": "Ecolab",
    "sector": "Materials",
    "industry": "Chemicals"
  },
  "FCX": {
    "name": "Freeport-McMoRan",
    "sector": "Materials",
    "industry": "Copper Mining"
  },
  "NEM": {
    "name": "Newmont",
    "sector": "Materials",
    "industry": "Gold Mining"
  },
  "NUE": {
    "name": "Nucor",
    "sector": "Materials",
    "industry": "Steel"
  },
  "DOW": {
    "name": "Dow",
    "sector": "Materials",
    "industry": "Chemicals"
  },
  "DD": {
    "name": "DuPont",
    "sector": "Materials",
    "industry": "Specialty Chemicals"
  },
  "PPG": {
    "name": "PPG",
    "sector": "Materials",
    "industry": "Paints"
  },
  "VMC": {
    "name": "Vulcan Materials",
    "sector": "Materials",
    "industry": "Aggregates"
  },
  "MLM": {
    "name": "Martin Marietta",
    "sector": "Materials",
    "industry": "Aggregates"
  },
  "CTVA": {
    "name": "Corteva",
    "sector": "Materials",
    "industry": "Agriculture"
  },
  "CF": {
    "name": "CF Industries",
    "sector": "Materials",
    "industry": "Fertilizers"
  },
  "MOS": {
    "name": "Mosaic",
    "sector": "Materials",
    "industry": "Fertilizers"
  },
  "FMC": {
    "name": "FMC",
    "sector": "Materials",
    "industry": "Ag Chemicals"
  },
  "ALB": {
    "name": "Albemarle",
    "sector": "Materials",
    "industry": "Lithium"
  },
  "LYB": {
    "name": "LyondellBasell",
    "sector": "Materials",
    "industry": "Chemicals"
  },
  "IFF": {
    "name": "IFF",
    "sector": "Materials",
    "industry": "Specialty Chemicals"
  },
  "CE": {
    "name": "Celanese",
    "sector": "Materials",
    "industry": "Chemicals"
  },
  "EMN": {
    "name": "Eastman",
    "sector": "Materials",
    "industry": "Chemicals"
  },
  "IP": {
    "name": "International Paper",
    "sector": "Materials",
    "industry": "Paper"
  },
  "PKG": {
    "name": "Packaging Corp",
    "sector": "Materials",
    "industry": "Packaging"
  },
  "BALL": {
    "name": "Ball Corp",
    "sector": "Materials",
    "industry": "Packaging"
  },
  "AMCR": {
    "name": "Amcor",
    "sector": "Materials",
    "industry": "Packaging"
  },
  "AVY": {
    "name": "Avery Dennison",
    "sector": "Materials",
    "industry": "Labels"
  },
  "SEE": {
    "name": "Sealed Air",
    "sector": "Materials",
    "industry": "Packaging"
  },
  "STLD": {
    "name": "Steel Dynamics",
    "sector": "Materials",
    "industry": "Steel"
  },
  "RS": {
    "name": "Reliance Steel",
    "sector": "Materials",
    "industry": "Steel"
  },
  "CLF": {
    "name": "Cleveland-Cliffs",
    "sector": "Materials",
    "industry": "Steel"
  },
  "TSM": {
    "name": "Taiwan Semiconductor Manufacturing Co Ltd",
    "sector": "Technology",
    "industry": "Semiconductors"
  },
  "ASML": {
    "name": "ASML Holding NV",
    "sector": "Technology",
    "industry": "Semiconductor Equipment & Testing"
  },
  "SAP": {
    "name": "SAP SE",
    "sector": "Technology",
    "industry": "Enterprise Management & Business Applications"
  },
  "HSBC": {
    "name": "HSBC Holdings PLC",
    "sector": "Financial Services",
    "industry": "Global Systemically Important Banks (G-SIBs)"
  },
  "SHEL": {
    "name": "Shell PLC",
    "sector": "Energy",
    "industry": "Integrated Oil & Gas"
  },
  "MUFG": {
    "name": "Mitsubishi UFJ Financial Group Inc",
    "sector": "Financial Services",
    "industry": "Global Systemically Important Banks (G-SIBs)"
  },
  "SAN": {
    "name": "Banco Santander SA",
    "sector": "Financial Services",
    "industry": "Global Systemically Important Banks (G-SIBs)"
  },
  "HDB": {
    "name": "HDFC Bank Ltd",
    "sector": "Financial Services",
    "industry": "Major Regional & National Banks"
  },
  "BHP": {
    "name": "BHP Group Ltd",
    "sector": "Basic Materials",
    "industry": "Diversified Miners"
  },
  "SONY": {
    "name": "Sony Group Corp",
    "sector": "Communication Services",
    "industry": "Interactive Entertainment (Gaming)"
  },
  "UL": {
    "name": "Unilever PLC",
    "sector": "Consumer Defensive",
    "industry": "Personal Products"
  },
  "TTE": {
    "name": "TotalEnergies SE",
    "sector": "Energy",
    "industry": "Integrated Oil & Gas"
  },
  "BBVA": {
    "name": "Banco Bilbao Vizcaya Argentaria SA",
    "sector": "Financial Services",
    "industry": "Global Systemically Important Banks (G-SIBs)"
  },
  "RIO": {
    "name": "Rio Tinto PLC",
    "sector": "Basic Materials",
    "industry": "Diversified Miners"
  },
  "BUD": {
    "name": "Anheuser-Busch Inbev SA",
    "sector": "Consumer Defensive",
    "industry": "Beer"
  },
  "SMFG": {
    "name": "Sumitomo Mitsui Financial Group Inc",
    "sector": "Financial Services",
    "industry": "Global Systemically Important Banks (G-SIBs)"
  },
  "SNY": {
    "name": "Sanofi SA",
    "sector": "Healthcare",
    "industry": "Major Diversified Pharmaceuticals"
  },
  "ARM": {
    "name": "Arm Holdings PLC",
    "sector": "Technology",
    "industry": "Semiconductors"
  },
  "BTI": {
    "name": "British American Tobacco PLC",
    "sector": "Consumer Defensive",
    "industry": "Tobacco"
  },
  "GSK": {
    "name": "GSK plc",
    "sector": "Healthcare",
    "industry": "Major Diversified Pharmaceuticals"
  },
  "MFG": {
    "name": "Mizuho Financial Group Inc",
    "sector": "Financial Services",
    "industry": "Global Systemically Important Banks (G-SIBs)"
  },
  "BCS": {
    "name": "Barclays PLC",
    "sector": "Financial Services",
    "industry": "Global Systemically Important Banks (G-SIBs)"
  },
  "NTES": {
    "name": "NetEase",
    "sector": "Communication Services",
    "industry": "Interactive Entertainment (Gaming)"
  },
  "BP": {
    "name": "BP PLC",
    "sector": "Energy",
    "industry": "Integrated Oil & Gas"
  },
  "ING": {
    "name": "ING Groep NV",
    "sector": "Financial Services",
    "industry": "Global Systemically Important Banks (G-SIBs)"
  },
  "SE": {
    "name": "Sea Ltd",
    "sector": "Consumer Cyclical",
    "industry": "E-Commerce (Direct & Marketplace)"
  },
  "LYG": {
    "name": "Lloyds Banking Group PLC",
    "sector": "Financial Services",
    "industry": "Major Regional & National Banks"
  },
  "RELX": {
    "name": "Relx PLC",
    "sector": "Financial Services",
    "industry": "Credit Bureaus & Risk Scoring"
  },
  "PBR": {
    "name": "Petroleo Brasileiro SA Petrobras",
    "sector": "Energy",
    "industry": "Integrated Oil & Gas"
  },
  "PBR.A": {
    "name": "Petroleo Brasileiro SA Petrobras",
    "sector": "Energy",
    "industry": "Integrated Oil & Gas"
  },
  "INFY": {
    "name": "Infosys Ltd",
    "sector": "Technology",
    "industry": "Technology Consulting & Systems Integration"
  },
  "PKX": {
    "name": "Posco Holdings Inc",
    "sector": "Basic Materials",
    "industry": "Iron & Steel"
  },
  "VALE": {
    "name": "Vale SA",
    "sector": "Basic Materials",
    "industry": "Diversified Miners"
  },
  "EQNR": {
    "name": "Equinor ASA",
    "sector": "Energy",
    "industry": "Integrated Oil & Gas"
  },
  "IBN": {
    "name": "ICICI Bank Ltd",
    "sector": "Financial Services",
    "industry": "Major Regional & National Banks"
  },
  "BIDU": {
    "name": "Baidu Inc",
    "sector": "Communication Services",
    "industry": "Search Engines & Portals"
  },
  "TAK": {
    "name": "Takeda Pharmaceutical Co Ltd",
    "sector": "Healthcare",
    "industry": "Major Diversified Pharmaceuticals"
  },
  "TCOM": {
    "name": "Trip.com Group Ltd",
    "sector": "Consumer Cyclical",
    "industry": "Online Travel Agencies & Booking Platforms"
  },
  "DEO": {
    "name": "Diageo PLC",
    "sector": "Consumer Defensive",
    "industry": "Distillers & Wineries"
  },
  "VIPS": {
    "name": "Vipshop Holdings Ltd",
    "sector": "Consumer Cyclical",
    "industry": "E-Commerce (Direct & Marketplace)"
  },
  "HLN": {
    "name": "HALEON PLC",
    "sector": "Consumer Defensive",
    "industry": "Personal Products"
  },
  "BABA": {
    "name": "Alibaba Group Holding Ltd",
    "sector": "Consumer Cyclical",
    "industry": "E-Commerce (Direct & Marketplace)"
  },
  "PDD": {
    "name": "PDD Holdings Inc",
    "sector": "Consumer Cyclical",
    "industry": "E-Commerce (Direct & Marketplace)"
  },
  "CUK": {
    "name": "Carnival PLC",
    "sector": "Consumer Cyclical",
    "industry": "Hotels & Cruise Lines"
  },
  "GFI": {
    "name": "Gold Fields Ltd",
    "sector": "Basic Materials",
    "industry": "Gold - Majors"
  },
  "TCEHY": {
    "name": "Tencent Holdings Limited",
    "sector": "",
    "industry": ""
  },
  "TCTZF": {
    "name": "Tencent Holdings Limited",
    "sector": "",
    "industry": ""
  },
  "SSNLF": {
    "name": "Samsung Electronics Co., Ltd.",
    "sector": "",
    "industry": ""
  },
  "ASMLF": {
    "name": "ASML Holding N.V.",
    "sector": "",
    "industry": ""
  },
  "LVMHF": {
    "name": "LVMH Moët Hennessy - Louis Vuitton, Société Européenne",
    "sector": "",
    "industry": ""
  },
  "LVMUY": {
    "name": "LVMH Moët Hennessy - Louis Vuitton, Société Européenne",
    "sector": "",
    "industry": ""
  },
  "IDCBF": {
    "name": "Industrial and Commercial Bank of China Limited",
    "sector": "",
    "industry": ""
  },
  "IDCBY": {
    "name": "Industrial and Commercial Bank of China Limited",
    "sector": "",
    "industry": ""
  },
  "RHHBF": {
    "name": "Roche Holding AG",
    "sector": "",
    "industry": ""
  },
  "RHHBY": {
    "name": "Roche Holding AG",
    "sector": "",
    "industry": ""
  },
  "RHHVF": {
    "name": "Roche Holding AG",
    "sector": "",
    "industry": ""
  },
  "ACGBF": {
    "name": "Agricultural Bank of China Limited",
    "sector": "",
    "industry": ""
  },
  "ACGBY": {
    "name": "Agricultural Bank of China Limited",
    "sector": "",
    "industry": ""
  },
  "BABAF": {
    "name": "Alibaba Group Holding Limited",
    "sector": "",
    "industry": ""
  },
  "AZNCF": {
    "name": "AstraZeneca PLC",
    "sector": "",
    "industry": ""
  },
  "SAPGF": {
    "name": "SAP SE",
    "sector": "",
    "industry": ""
  },
  "TOYOF": {
    "name": "Toyota Motor Corporation",
    "sector": "",
    "industry": ""
  },
  "HBCYF": {
    "name": "HSBC Holdings plc",
    "sector": "",
    "industry": ""
  },
  "NVSEF": {
    "name": "Novartis AG",
    "sector": "",
    "industry": ""
  },
  "HESAF": {
    "name": "Hermès International Société en commandite par actions",
    "sector": "",
    "industry": ""
  },
  "HESAY": {
    "name": "Hermès International Société en commandite par actions",
    "sector": "",
    "industry": ""
  },
  "NONOF": {
    "name": "Novo Nordisk A/S",
    "sector": "",
    "industry": ""
  },
  "CICHF": {
    "name": "China Construction Bank Corporation",
    "sector": "",
    "industry": ""
  },
  "CICHY": {
    "name": "China Construction Bank Corporation",
    "sector": "",
    "industry": ""
  },
  "PCCYF": {
    "name": "PetroChina Company Limited",
    "sector": "",
    "industry": ""
  },
  "NSRGF": {
    "name": "Nestlé S.A.",
    "sector": "",
    "industry": ""
  },
  "NSRGY": {
    "name": "Nestlé S.A.",
    "sector": "",
    "industry": ""
  },
  "CTATF": {
    "name": "Contemporary Amperex Technology Co., Limited",
    "sector": "",
    "industry": ""
  },
  "CYATY": {
    "name": "Contemporary Amperex Technology Co., Limited",
    "sector": "",
    "industry": ""
  },
  "LRLCF": {
    "name": "L'Oréal S.A.",
    "sector": "",
    "industry": ""
  },
  "LRLCY": {
    "name": "L'Oréal S.A.",
    "sector": "",
    "industry": ""
  },
  "BACHF": {
    "name": "Bank of China Limited",
    "sector": "",
    "industry": ""
  },
  "BACHY": {
    "name": "Bank of China Limited",
    "sector": "",
    "industry": ""
  },
  "SIEGY": {
    "name": "Siemens Aktiengesellschaft",
    "sector": "",
    "industry": ""
  },
  "SMAWF": {
    "name": "Siemens Aktiengesellschaft",
    "sector": "",
    "industry": ""
  },
  "IDEXF": {
    "name": "Industria de Diseño Textil, S.A.",
    "sector": "",
    "industry": ""
  },
  "IDEXY": {
    "name": "Industria de Diseño Textil, S.A.",
    "sector": "",
    "industry": ""
  },
  "RYDAF": {
    "name": "Shell plc",
    "sector": "",
    "industry": ""
  },
  "EADSF": {
    "name": "Airbus SE",
    "sector": "",
    "industry": ""
  },
  "EADSY": {
    "name": "Airbus SE",
    "sector": "",
    "industry": ""
  },
  "MBFJF": {
    "name": "Mitsubishi UFJ Financial Group, Inc.",
    "sector": "",
    "industry": ""
  },
  "CILJF": {
    "name": "China Life Insurance Company Limited",
    "sector": "",
    "industry": ""
  },
  "BCDRF": {
    "name": "Banco Santander, S.A.",
    "sector": "",
    "industry": ""
  },
  "PIAIF": {
    "name": "Ping An Insurance (Group) Company of China, Ltd.",
    "sector": "",
    "industry": ""
  },
  "PNGAY": {
    "name": "Ping An Insurance (Group) Company of China, Ltd.",
    "sector": "",
    "industry": ""
  },
  "CBAUF": {
    "name": "Commonwealth Bank of Australia",
    "sector": "",
    "industry": ""
  },
  "CMWAY": {
    "name": "Commonwealth Bank of Australia",
    "sector": "",
    "industry": ""
  },
  "ALIZF": {
    "name": "Allianz SE",
    "sector": "",
    "industry": ""
  },
  "ALIZY": {
    "name": "Allianz SE",
    "sector": "",
    "industry": ""
  },
  "BHPLF": {
    "name": "BHP Group Limited",
    "sector": "",
    "industry": ""
  },
  "DTEGF": {
    "name": "Deutsche Telekom AG",
    "sector": "",
    "industry": ""
  },
  "DTEGY": {
    "name": "Deutsche Telekom AG",
    "sector": "",
    "industry": ""
  },
  "SAFRF": {
    "name": "Safran SA",
    "sector": "",
    "industry": ""
  },
  "SAFRY": {
    "name": "Safran SA",
    "sector": "",
    "industry": ""
  },
  "SBGSF": {
    "name": "Schneider Electric S.E.",
    "sector": "",
    "industry": ""
  },
  "SBGSY": {
    "name": "Schneider Electric S.E.",
    "sector": "",
    "industry": ""
  },
  "SFTBF": {
    "name": "SoftBank Group Corp.",
    "sector": "",
    "industry": ""
  },
  "SFTBY": {
    "name": "SoftBank Group Corp.",
    "sector": "",
    "industry": ""
  },
  "CIHHF": {
    "name": "China Merchants Bank Co., Ltd.",
    "sector": "",
    "industry": ""
  },
  "CIHKY": {
    "name": "China Merchants Bank Co., Ltd.",
    "sector": "",
    "industry": ""
  },
  "ESLOF": {
    "name": "EssilorLuxottica Société anonyme",
    "sector": "",
    "industry": ""
  },
  "ESLOY": {
    "name": "EssilorLuxottica Société anonyme",
    "sector": "",
    "industry": ""
  },
  "HTHIF": {
    "name": "Hitachi, Ltd.",
    "sector": "",
    "industry": ""
  },
  "HTHIY": {
    "name": "Hitachi, Ltd.",
    "sector": "",
    "industry": ""
  },
  "SNEJF": {
    "name": "Sony Group Corporation",
    "sector": "",
    "industry": ""
  },
  "RYCEF": {
    "name": "Rolls-Royce Holdings plc",
    "sector": "",
    "industry": ""
  },
  "RYCEY": {
    "name": "Rolls-Royce Holdings plc",
    "sector": "",
    "industry": ""
  },
  "IBDRY": {
    "name": "Iberdrola, S.A.",
    "sector": "",
    "industry": ""
  },
  "IBDSF": {
    "name": "Iberdrola, S.A.",
    "sector": "",
    "industry": ""
  },
  "ZIJMF": {
    "name": "Zijin Mining Group Company Limited",
    "sector": "",
    "industry": ""
  },
  "ZIJMY": {
    "name": "Zijin Mining Group Company Limited",
    "sector": "",
    "industry": ""
  },
  "PROSF": {
    "name": "Prosus N.V.",
    "sector": "",
    "industry": ""
  },
  "PROSY": {
    "name": "Prosus N.V.",
    "sector": "",
    "industry": ""
  },
  "ABBNY": {
    "name": "ABB Ltd",
    "sector": "",
    "industry": ""
  },
  "ABLZF": {
    "name": "ABB Ltd",
    "sector": "",
    "industry": ""
  },
  "RTNTF": {
    "name": "Rio Tinto Group",
    "sector": "",
    "industry": ""
  },
  "RTPPF": {
    "name": "Rio Tinto Group",
    "sector": "",
    "industry": ""
  },
  "BBVXF": {
    "name": "Banco Bilbao Vizcaya Argentaria, S.A.",
    "sector": "",
    "industry": ""
  },
  "CFRHF": {
    "name": "Compagnie Financière Richemont SA",
    "sector": "",
    "industry": ""
  },
  "CFRUY": {
    "name": "Compagnie Financière Richemont SA",
    "sector": "",
    "industry": ""
  },
  "BUDFF": {
    "name": "Anheuser-Busch InBev SA/NV",
    "sector": "",
    "industry": ""
  },
  "UNCFF": {
    "name": "UniCredit S.p.A.",
    "sector": "",
    "industry": ""
  },
  "UNCRY": {
    "name": "UniCredit S.p.A.",
    "sector": "",
    "industry": ""
  },
  "CHDRF": {
    "name": "Christian Dior SE",
    "sector": "",
    "industry": ""
  },
  "CHDRY": {
    "name": "Christian Dior SE",
    "sector": "",
    "industry": ""
  }
};

export default STOCK_DATABASE;