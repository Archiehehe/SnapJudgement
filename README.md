# SnapJudgement

SnapJudgement is a **decision-compression tool for retail investors**.

It transforms a single stock ticker into a **clear, structured investment brief**, designed to help users quickly understand a company and decide whether it’s worth deeper research.

Rather than maximizing data volume, SnapJudgement optimizes for **clarity, sequencing, and interpretability**.

🌐 Live app: https://snapjudgement.vercel.app/  
📦 Repository: https://github.com/Archiehehe/SnapJudgement

---

## Why SnapJudgement Exists

Retail investors face three persistent problems:

### Fragmentation
Company descriptions, valuation metrics, analyst opinions, financials, and price history live across disconnected platforms.

### Cognitive overload
Most tools expose raw financial data optimized for analysts, not for fast human judgment.

### Poor sequencing
Information is rarely presented in the order people naturally reason about investments.

As a result, users either:
- over-index on price charts and surface-level signals, or  
- abandon research entirely due to complexity.

SnapJudgement addresses this gap by **structuring information the way humans actually evaluate ideas**.

---

## The Core Question

SnapJudgement is built to answer one focused question:

> **“Given a few minutes and no formal finance training, is this stock worth exploring further?”**

It does **not** attempt to answer:
- Should I buy or sell this stock?
- What will the price do next?
- What is the optimal trade?

This is a **learning and exploration tool**, not financial advice.

---

## Who It’s For

**Primary users**
- Early-stage retail investors  
- Finance-curious but not technically trained  
- Time-constrained and intuition-driven  

**Secondary users**
- Students (finance, economics, business)
- Builders learning markets through exploration
- Power users who want fast first-pass screening

---

## How It Works

### 1. Enter a Ticker
Users input a single stock ticker (e.g. `AAPL`, `DDOG`, `NVDA`).

### 2. Receive a Structured Brief
SnapJudgement generates a vertically ordered brief with clearly separated sections:

#### What Is This Company?
- Plain-English business description  
- Sector and industry  
- Market capitalization  

#### Sanity Check
- Current price  
- 52-week range  
- Average volume  
- Beta
- 52Week Range & Day Range

#### Valuation Snapshot
- P/E (TTM and forward, when available)  
- EV / Revenue  
- Price/Sales
- PEG Ratio
- Price/Book
- EV/EBITDA
- EV/Revenue
- Div. Yield
- One-sentence interpretive summary  

#### Street Sentiment
- Analyst consensus (Buy / Hold / Sell)  
- Median target vs current price  
- Number of Analyst Ratings with exact number of (Buy / Hold / Sell) ratings.

#### Business Momentum
- Revenue growth trends  
- Margin trends  
- R&D intensity (where applicable)  
- High-level directional indicators  

#### Price Behavior
- Interactive time horizons (1D → 5Y)  
- Simple return summaries  

### 3. Make a Judgement
Users leave with:
- a clearer mental model of the business  
- an understanding of expectations embedded in the price  
- a sense of whether deeper research is warranted  

---

## Design Philosophy

### Opinionated Minimalism
- Show less, but show it better  
- Summaries over dense tables   

### Sequence Over Quantity
- Information order matters  
- Earlier sections frame the interpretation of later ones  

SnapJudgement is intentionally opinionated. Taste and structure are part of the product.

---

## Data & Interpretation

### Data Principles
- Uses publicly available market data  
- Prioritizes clarity over completeness    
- Does not attempt to predict prices  

### Interpretation
Lightweight AI is used to **compress and contextualize information**, not to generate recommendations or trading signals.

---

## Technical Overview

- **Frontend**: React (JavaScript)  
- **Language**: JavaScript / HTML / CSS  
- **Data**: Public financial APIs, fetched client-side or via serverless endpoints  
- **Hosting & Deployment**: Vercel  

### Architecture Goals
- Clear, opinionated UI focused on readability  
- Minimal backend complexity  
- Fast iteration and deployment  
- Easy end-to-end understanding for a single developer  

The system is intentionally simple and transparent, favoring clarity over abstraction.

## What SnapJudgement Is — and Is Not

### It Is
- A decision-structuring tool  
- A learning aid for retail investors  
- A fast first-pass research interface  

### It Is Not
- A trading platform  
- A signal generator  
- A portfolio manager  
- A financial advisor  

---

## Disclaimer

SnapJudgement is for **educational and informational purposes only**.  
Nothing on this platform constitutes investment advice. Always do your own research.

---

## Positioning

SnapJudgement sits between:

> “I saw this ticker somewhere”  
and  
> “I should read a 10-K or an analyst report”

It reduces the cost of curiosity.

Not for Commercial Use. Read the License for more details.
