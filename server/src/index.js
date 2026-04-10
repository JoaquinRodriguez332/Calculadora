import express from "express";
import cors from "cors";
import { create, all } from "mathjs";

const app = express();
const PORT = process.env.PORT || 4000;
const math = create(all, {});

app.use(cors());
app.use(express.json());

const maxExpressionLength = 200;

const normalizeExpression = (expression = "") =>
  expression
    .replace(/π/g, "pi")
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/\^/g, "^");

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "Scientific calculator API running" });
});

app.post("/api/calculate", (req, res) => {
  try {
    const { expression, angleMode = "RAD", ans = 0 } = req.body ?? {};

    if (!expression || typeof expression !== "string") {
      return res.status(400).json({ error: "La expresión es obligatoria." });
    }

    if (expression.length > maxExpressionLength) {
      return res.status(400).json({ error: "La expresión es demasiado larga." });
    }

    const cleanExpression = normalizeExpression(expression.trim());
    const scope = {
      ans,
      pi: Math.PI,
      e: Math.E
    };

    if (String(angleMode).toUpperCase() === "DEG") {
      scope.sin = (x) => Math.sin((x * Math.PI) / 180);
      scope.cos = (x) => Math.cos((x * Math.PI) / 180);
      scope.tan = (x) => Math.tan((x * Math.PI) / 180);
      scope.asin = (x) => (Math.asin(x) * 180) / Math.PI;
      scope.acos = (x) => (Math.acos(x) * 180) / Math.PI;
      scope.atan = (x) => (Math.atan(x) * 180) / Math.PI;
    }

    const result = math.evaluate(cleanExpression, scope);

    if (typeof result === "number" && Number.isFinite(result)) {
      return res.json({
        expression,
        normalized: cleanExpression,
        result
      });
    }

    return res.status(400).json({ error: "Resultado inválido." });
  } catch (error) {
    return res.status(400).json({
      error: "No se pudo resolver la expresión.",
      details: error?.message ?? "Error desconocido"
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ API ejecutándose en http://localhost:${PORT}`);
});
