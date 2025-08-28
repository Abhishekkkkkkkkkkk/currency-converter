import { useEffect, useMemo, useState } from "react";
import CurrencySelect from "./components/CurrencySelect.jsx";
import RateCard from "./components/RateCard.jsx";
import useRates from "./hooks/useRates.js";

// Deep-link URL helpers — mimic OANDA’s shareable pattern (?from=EUR&to=USD&amount=1)
function readQuery() {
  const p = new URLSearchParams(window.location.search);
  return {
    from: p.get("from") || "USD",
    to: p.get("to") || "INR",
    amount: Number(p.get("amount") || 1),
  };
}
function writeQuery({ from, to, amount }) {
  const p = new URLSearchParams();
  p.set("from", from);
  p.set("to", to);
  p.set("amount", String(amount));
  const url = `${window.location.pathname}?${p.toString()}`;
  window.history.replaceState({}, "", url);
}

export default function App() {
  const initial = useMemo(readQuery, []);
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const [amount, setAmount] = useState(initial.amount);

  // Fetch rates for the base "from" currency
  const { rate, inverseRate, updatedAt, loading, error } = useRates(from, to);

  // Keep URL in sync with UI
  useEffect(() => {
    writeQuery({ from, to, amount });
  }, [from, to, amount]);

  // Quick “swap” control
  const onSwap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Currency Converter</h1>
        <p className="subtitle">Select currencies → See the exchange rate</p>
      </header>

      <section className="card">
        <div className="row">
          <label className="label" htmlFor="amount">
            Amount
          </label>
          <input
            id="amount"
            className="input"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
          />
        </div>

        <div className="row">
          <label className="label" htmlFor="from">
            From
          </label>
          <CurrencySelect id="from" value={from} onChange={setFrom} />
        </div>

        <div className="swap-wrap">
          <button
            className="swap"
            onClick={onSwap}
            aria-label="Swap currencies"
          >
            <img src="/reverse.png" alt="Swap currencies" className="swap-icon" />
          </button>
        </div>

        <div className="row">
          <label className="label" htmlFor="to">
            To
          </label>
          <CurrencySelect id="to" value={to} onChange={setTo} />
        </div>

        <RateCard
          amount={amount}
          from={from}
          to={to}
          rate={rate}
          inverseRate={inverseRate}
          updatedAt={updatedAt}
          loading={loading}
          error={error}
        />
      </section>

      <footer className="footer">
        <small>
          Built with <span className="heart">❤️</span> by{" "}
          <strong>Abhishek Kumar</strong> <br />
          Exchange rates powered by{" "}
          <a
            href="https://www.frankfurter.app/"
            target="_blank"
            rel="noreferrer"
          >
            Frankfurter API
          </a>
        </small>
      </footer>
    </div>
  );
}