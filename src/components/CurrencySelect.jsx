import { useMemo } from "react";
import { currencyCodes } from "../utils/currencyList.js";


// Accessible dropdown with a clean list of common ISO 4217 codes
export default function CurrencySelect({ id, value, onChange }) {
  const labels = useMemo(() => {
    let dn;
    try {
      dn = new Intl.DisplayNames([navigator.language || "en"], { type: "currency" });
    } catch {
      dn = null;
    }
    return currencyCodes.map((code) => ({
      code,
      name: dn ? dn.of(code) : code,
    }));
  }, []);

  return (
    <select
      id={id}
      className="select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {labels.map(({ code, name }) => (
        <option key={code} value={code}>
          {code} — {name || code}
        </option>
      ))}
    </select>
  );
}
