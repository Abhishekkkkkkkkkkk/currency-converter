export default function RateCard({
  amount,
  from,
  to,
  rate,
  inverseRate,
  updatedAt,
  loading,
  error,
}) {
  if (error) {
    return (
      <div className="rate-card error">
        <p>Couldn’t fetch the rate. Please try again.</p>
        <code>{String(error)}</code>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rate-card skeleton">
        <div className="shimmer" />
      </div>
    );
  }

  if (!rate) {
    return <div className="rate-card">Select currencies to see the rate.</div>;
  }

  const converted = (amount || 0) * rate;

  return (
    <div className="rate-card">
      <div className="rate-line">
        <strong>1 {from}</strong> ={" "}
        <strong>
          {rate.toLocaleString(undefined, { maximumFractionDigits: 6 })} {to}
        </strong>
      </div>

      <div className="muted">
        1 {to} ={" "}
        {inverseRate.toLocaleString(undefined, { maximumFractionDigits: 6 })}{" "}
        {from}
      </div>

      <hr />

      <div className="converted">
        <span>
          {(amount || 0).toLocaleString()} {from}
        </span>
        <span className="arrow">→</span>
        <span className="emph">
          {converted.toLocaleString(undefined, { maximumFractionDigits: 6 })}{" "}
          {to}
        </span>
      </div>

      {updatedAt && <div className="timestamp">Updated: {updatedAt}</div>}
    </div>
  );
}
