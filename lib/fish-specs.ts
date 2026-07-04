export function parseProSpecs(text) {
  if (!text) return [];
  return text.split("·").map((chunk) => chunk.trim()).filter(Boolean).map((chunk) => {
    if (/^pH/i.test(chunk)) return { icon: "🧪", label: "pH", value: chunk.replace(/^pH\s*/i, "") };
    if (/^dGH/i.test(chunk)) return { icon: "💧", label: "Жёсткость, dGH", value: chunk.replace(/^dGH\s*/i, "") };
    if (/^NH/i.test(chunk)) return { icon: "⚠️", label: "Аммиак, NH₃", value: chunk.replace(/^NH₃?3?\s*/i, "") };
    if (/объём/i.test(chunk)) return { icon: "🪣", label: "Мин. объём", value: chunk.replace(/^мин\.?\s*объём\s*/i, "") };
    if (/^t°|температур/i.test(chunk)) return { icon: "🌡️", label: "Температура", value: chunk.replace(/^t°\s*/i, "") };
    return { icon: "📋", label: "", value: chunk };
  });
}
