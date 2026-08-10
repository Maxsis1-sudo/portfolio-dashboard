import json, time, urllib.request, urllib.parse
from datetime import datetime, timezone
from pathlib import Path

POSITIONS = [{"xtbTicker": "VWCE.DE", "yahooSymbol": "VWCE.DE", "fallbackCurrency": "EUR"}, {"xtbTicker": "TSLA.US", "yahooSymbol": "TSLA", "fallbackCurrency": "USD"}, {"xtbTicker": "AAPL.US", "yahooSymbol": "AAPL", "fallbackCurrency": "USD"}, {"xtbTicker": "IMMR.US", "yahooSymbol": "IMMR", "fallbackCurrency": "USD"}, {"xtbTicker": "AMD.US", "yahooSymbol": "AMD", "fallbackCurrency": "USD"}, {"xtbTicker": "TSM.US", "yahooSymbol": "TSM", "fallbackCurrency": "USD"}, {"xtbTicker": "BABA.US", "yahooSymbol": "BABA", "fallbackCurrency": "USD"}, {"xtbTicker": "AMZN.US", "yahooSymbol": "AMZN", "fallbackCurrency": "USD"}, {"xtbTicker": "CZG.CZ", "yahooSymbol": "COLT.PR", "fallbackCurrency": "CZK"}, {"xtbTicker": "MSFT.US", "yahooSymbol": "MSFT", "fallbackCurrency": "USD"}, {"xtbTicker": "NIO.US", "yahooSymbol": "NIO", "fallbackCurrency": "USD"}, {"xtbTicker": "NVDA.US", "yahooSymbol": "NVDA", "fallbackCurrency": "USD"}, {"xtbTicker": "IUFS.UK", "yahooSymbol": "IUFS.L", "fallbackCurrency": "USD"}, {"xtbTicker": "GOOGC.US", "yahooSymbol": "GOOG", "fallbackCurrency": "USD"}, {"xtbTicker": "SPCX.US", "yahooSymbol": "SPCX", "fallbackCurrency": "USD"}, {"xtbTicker": "TWLO.US", "yahooSymbol": "TWLO", "fallbackCurrency": "USD"}, {"xtbTicker": "INTC.US", "yahooSymbol": "INTC", "fallbackCurrency": "USD"}, {"xtbTicker": "XDW0.DE", "yahooSymbol": "XDW0.DE", "fallbackCurrency": "EUR"}, {"xtbTicker": "PLTR.US", "yahooSymbol": "PLTR", "fallbackCurrency": "USD"}, {"xtbTicker": "LI.US", "yahooSymbol": "LI", "fallbackCurrency": "USD"}, {"xtbTicker": "NEL.NO", "yahooSymbol": "NEL.OL", "fallbackCurrency": "NOK"}, {"xtbTicker": "CSG.NL", "yahooSymbol": "CSG.AS", "fallbackCurrency": "EUR"}, {"xtbTicker": "NVAX.US", "yahooSymbol": "NVAX", "fallbackCurrency": "USD"}, {"xtbTicker": "SOUN.US", "yahooSymbol": "SOUN", "fallbackCurrency": "USD"}, {"xtbTicker": "META.US", "yahooSymbol": "META", "fallbackCurrency": "USD"}, {"xtbTicker": "MBLY.US", "yahooSymbol": "MBLY", "fallbackCurrency": "USD"}, {"xtbTicker": "ASML.NL", "yahooSymbol": "ASML.AS", "fallbackCurrency": "EUR"}, {"xtbTicker": "TTWO.US", "yahooSymbol": "TTWO", "fallbackCurrency": "USD"}, {"xtbTicker": "PLUG.US", "yahooSymbol": "PLUG", "fallbackCurrency": "USD"}, {"xtbTicker": "KOA.NO", "yahooSymbol": "KOA.OL", "fallbackCurrency": "NOK"}, {"xtbTicker": "PFE.US", "yahooSymbol": "PFE", "fallbackCurrency": "USD"}, {"xtbTicker": "ACB.US", "yahooSymbol": "ACB", "fallbackCurrency": "USD"}, {"xtbTicker": "AYRO.US", "yahooSymbol": "AYRO", "fallbackCurrency": "USD"}, {"xtbTicker": "IUIT.UK", "yahooSymbol": "IUIT.L", "fallbackCurrency": "USD"}, {"xtbTicker": "TLRY.US", "yahooSymbol": "TLRY", "fallbackCurrency": "USD"}]
FX_SYMBOLS = {"USD":"CZK=X","EUR":"EURCZK=X","NOK":"NOKCZK=X"}
OUT = Path("prices.json")

def load_old():
    try:
        return json.loads(OUT.read_text(encoding="utf-8"))
    except Exception:
        return {"quotes": {}, "fx": {"CZK": 1}}

def chart(symbol):
    url = "https://query1.finance.yahoo.com/v8/finance/chart/" + urllib.parse.quote(symbol, safe="") + "?interval=1m&range=1d"
    req = urllib.request.Request(url, headers={
        "User-Agent":"Mozilla/5.0 (compatible; PortfolioDashboard/1.0)",
        "Accept":"application/json"
    })
    last_error = None
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.load(resp)
            result = data.get("chart",{}).get("result") or []
            if not result:
                raise RuntimeError("empty result")
            meta = result[0].get("meta",{})
            price = meta.get("regularMarketPrice")
            if price is None:
                closes = (((result[0].get("indicators") or {}).get("quote") or [{}])[0].get("close") or [])
                closes = [x for x in closes if x is not None]
                price = closes[-1] if closes else None
            if price is None:
                raise RuntimeError("no price")
            return {
                "price": float(price),
                "currency": meta.get("currency"),
                "marketState": meta.get("marketState") or "UNKNOWN",
                "marketTime": meta.get("regularMarketTime"),
                "symbol": symbol,
            }
        except Exception as e:
            last_error = e
            time.sleep(1.2 * (attempt + 1))
    raise last_error

old = load_old()
quotes = dict(old.get("quotes") or {})
fx = dict(old.get("fx") or {})
fx["CZK"] = 1
success = 0
errors = []

for p in POSITIONS:
    try:
        q = chart(p["yahooSymbol"])
        q["currency"] = q.get("currency") or p["fallbackCurrency"]
        quotes[p["xtbTicker"]] = q
        success += 1
    except Exception as e:
        errors.append(f'{p["xtbTicker"]}: {e}')
    time.sleep(0.15)

for currency, symbol in FX_SYMBOLS.items():
    try:
        q = chart(symbol)
        fx[currency] = q["price"]
    except Exception as e:
        errors.append(f'FX {currency}: {e}')
    time.sleep(0.15)

payload = {
    "updated": datetime.now(timezone.utc).isoformat(),
    "source": "Yahoo Finance server refresh",
    "successCount": success,
    "totalCount": len(POSITIONS),
    "quotes": quotes,
    "fx": fx,
    "errors": errors[:10],
}
OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
print(f"Updated {success}/{len(POSITIONS)} quotes; FX={fx}; errors={len(errors)}")
