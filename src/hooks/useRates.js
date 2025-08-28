import { useEffect, useState } from "react";

/*

  Fetches a single pair rate (from -> to) using Frankfurter (free, no key)
  API: https://api.frankfurter.app/latest?from=USD&to=INR

*/
export default function useRates(from, to) {
  const [rate, setRate] = useState(null);
  const [inverseRate, setInverseRate] = useState(null);
  const [updatedAt, setUpdatedAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function fetchRate() {
      if (!from || !to || from === to) {
        setRate(1);
        setInverseRate(1);
        setUpdatedAt("");
        return;
      }
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `https://api.frankfurter.app/latest?from=${encodeURIComponent(
            from
          )}&to=${encodeURIComponent(to)}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const r = data?.rates?.[to];
        if (r == null) throw new Error("Rate not found");
        if (!cancelled) {
          setRate(r);
          setInverseRate(1 / r);
          setUpdatedAt(data?.date || "");
        }
      } catch (e) {
        if (!cancelled) setError(e.message || String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchRate();
    return () => {
      cancelled = true;
    };
  }, [from, to]);

  return { rate, inverseRate, updatedAt, loading, error };
}
