import { useMemo, useState } from "react";

const API_URL = "http://localhost:4000/api/calculate";

const scientificRows = [
  ["sin(", "cos(", "tan(", "log(", "ln("],
  ["asin(", "acos(", "atan(", "sqrt(", "^"],
  ["(", ")", "π", "e", "!"],
  ["7", "8", "9", "/", "AC"],
  ["4", "5", "6", "*", "⌫"],
  ["1", "2", "3", "-", "ans"],
  ["0", ".", "%", "+", "="],
];

const formatButton = (value) => {
  if (value === "*") return "×";
  if (value === "/") return "÷";
  return value;
};

function App() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");
  const [history, setHistory] = useState([]);
  const [angleMode, setAngleMode] = useState("RAD");

  const ans = useMemo(() => Number(result) || 0, [result]);

  const append = (value) => {
    if (value === "AC") {
      setExpression("");
      setResult("0");
      return;
    }

    if (value === "⌫") {
      setExpression((prev) => prev.slice(0, -1));
      return;
    }

    if (value === "=") {
      calculate();
      return;
    }

    if (value === "%") {
      setExpression((prev) => `${prev}/100`);
      return;
    }

    if (value === "!") {
      setExpression((prev) => `${prev}!`);
      return;
    }

    setExpression((prev) => `${prev}${value}`);
  };

  const calculate = async () => {
    if (!expression.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expression, angleMode, ans }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.details || data?.error || "Error desconocido");
      }

      const value = String(data.result);
      setResult(value);
      setHistory((prev) => [{ expression, result: value }, ...prev].slice(0, 8));
    } catch (error) {
      setResult("Error");
      console.error(error.message);
    }
  };

  return (
    <main className="app">
      <section className="calculator">
        <header>
          <h1>Calculadora Científica</h1>
          <button
            className="mode"
            onClick={() => setAngleMode((prev) => (prev === "RAD" ? "DEG" : "RAD"))}
          >
            {angleMode}
          </button>
        </header>

        <div className="screen">
          <p className="expression">{expression || "0"}</p>
          <p className="result">{result}</p>
        </div>

        <div className="grid">
          {scientificRows.flat().map((key) => (
            <button key={key} onClick={() => append(key)}>
              {formatButton(key)}
            </button>
          ))}
        </div>
      </section>

      <aside className="history">
        <h2>Historial</h2>
        {!history.length && <p>Sin operaciones aún.</p>}
        {history.map((item, idx) => (
          <button
            key={`${item.expression}-${idx}`}
            className="history-item"
            onClick={() => setExpression(item.expression)}
          >
            <span>{item.expression}</span>
            <strong>{item.result}</strong>
          </button>
        ))}
      </aside>
    </main>
  );
}

export default App;
