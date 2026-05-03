// Lightweight fuzzy / synonym-aware search for products
// No external API. Handles typos, partial matches, related terms.

const SYNONYMS: Record<string, string[]> = {
  mobile: ["phone", "smartphone", "cell", "cellphone", "iphone", "android"],
  phone: ["mobile", "smartphone", "cell", "cellphone"],
  case: ["cover", "casing", "shell", "protector"],
  cover: ["case", "casing", "shell"],
  earphone: ["headphone", "earbud", "earbuds", "airpods", "handsfree", "buds"],
  headphone: ["earphone", "earbud", "earbuds", "airpods", "handsfree"],
  watch: ["smartwatch", "wristwatch", "timepiece"],
  laptop: ["notebook", "macbook", "ultrabook"],
  tv: ["television", "led", "lcd"],
  charger: ["adapter", "cable", "wire"],
  bag: ["backpack", "handbag", "purse"],
  shoe: ["sneaker", "footwear", "shoes"],
  shoes: ["sneakers", "footwear", "shoe"],
  shirt: ["tshirt", "t-shirt", "tee", "top"],
  speaker: ["bluetooth", "soundbox", "audio"],
  light: ["lamp", "bulb", "led"],
  fan: ["cooler"],
  ac: ["air conditioner", "airconditioner"],
  fridge: ["refrigerator"],
  perfume: ["fragrance", "scent", "cologne"],
  cream: ["lotion", "moisturizer"],
  kid: ["child", "children", "kids"],
  women: ["woman", "ladies", "female"],
  men: ["man", "male", "gents"],
};

function normalize(s: string) {
  return (s || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function expand(token: string): string[] {
  const out = new Set<string>([token]);
  if (SYNONYMS[token]) SYNONYMS[token].forEach((w) => out.add(w));
  // also reverse lookup
  for (const [k, vs] of Object.entries(SYNONYMS)) {
    if (vs.includes(token)) {
      out.add(k);
      vs.forEach((v) => out.add(v));
    }
  }
  return Array.from(out);
}

// Damerau-Levenshtein-ish distance (small)
function distance(a: string, b: string): number {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (!m || !n) return Math.max(m, n);
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function tokenScore(qTok: string, hayTokens: string[]): number {
  let best = 0;
  for (const t of hayTokens) {
    if (!t) continue;
    if (t === qTok) { best = Math.max(best, 1); continue; }
    if (t.startsWith(qTok) || qTok.startsWith(t)) { best = Math.max(best, 0.85); continue; }
    if (t.includes(qTok) || qTok.includes(t)) { best = Math.max(best, 0.7); continue; }
    const d = distance(qTok, t);
    const ml = Math.max(qTok.length, t.length);
    const sim = 1 - d / ml;
    if (ml >= 4 && sim >= 0.7) best = Math.max(best, sim * 0.65);
  }
  return best;
}

export interface Searchable {
  name: string;
  category?: string;
  description?: string;
  badge?: string;
}

export function fuzzyScore(query: string, item: Searchable): number {
  const q = normalize(query);
  if (!q) return 1;
  const hay = normalize(`${item.name} ${item.category || ""} ${item.description || ""} ${item.badge || ""}`);
  const hayTokens = hay.split(" ");
  const qTokens = q.split(" ");

  let total = 0;
  let matched = 0;
  for (const qt of qTokens) {
    if (qt.length < 2) continue;
    const variants = expand(qt);
    let bestVar = 0;
    for (const v of variants) {
      bestVar = Math.max(bestVar, tokenScore(v, hayTokens));
    }
    total += bestVar;
    if (bestVar > 0.3) matched++;
  }
  const meaningful = qTokens.filter((t) => t.length >= 2).length || 1;
  const coverage = matched / meaningful;
  return (total / meaningful) * (0.5 + 0.5 * coverage);
}

export function fuzzyFilter<T extends Searchable>(query: string, items: T[], threshold = 0.35): T[] {
  if (!query.trim()) return items;
  const scored = items
    .map((item) => ({ item, score: fuzzyScore(query, item) }))
    .filter((x) => x.score >= threshold)
    .sort((a, b) => b.score - a.score);
  return scored.map((x) => x.item);
}
