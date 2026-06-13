/**
 * Heuristic submission evaluator for the demo. It reads the submitted code and
 * scores it on real, observable signals — function/return structure, control
 * flow, edge-case handling, complexity awareness, and readability — plus any
 * problem-specific keywords. Different input produces different, explainable
 * output, so the "Run & evaluate" flow feels real without a sandboxed runtime.
 *
 * In production this is where a real judge (containerized test runner) plugs in
 * behind the same EvalResult shape.
 */

export interface EvalDimension {
  label: string;
  pct: number;
}

export interface EvalResult {
  score: number; // 0–100
  passed: number;
  total: number;
  dimensions: EvalDimension[];
  feedback: string[];
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export function evaluateCode(
  code: string,
  hints: string[] = [],
  totalTests = 6
): EvalResult {
  const trimmed = code.trim();
  if (trimmed.length < 8) {
    return {
      score: 0,
      passed: 0,
      total: totalTests,
      dimensions: [
        { label: "Correctness", pct: 0 },
        { label: "Structure", pct: 0 },
        { label: "Edge cases", pct: 0 },
        { label: "Readability", pct: 0 },
      ],
      feedback: ["No solution yet — write your approach and run it again."],
    };
  }

  const lower = trimmed.toLowerCase();
  const lines = trimmed.split("\n").filter((l) => l.trim().length > 0);

  const hasFunction = /\b(def|function|class|public|private|int|void|const\s+\w+\s*=\s*\()/.test(trimmed) || /=>/.test(trimmed);
  const hasReturn = /\breturn\b|\byield\b/.test(lower);
  const hasLoop = /\b(for|while|foreach)\b|\.map\(|\.reduce\(|\.foreach\(/.test(lower);
  const hasRecursion = (() => {
    const def = trimmed.match(/(?:def|function)\s+(\w+)/);
    if (!def) return false;
    const name = def[1];
    const calls = (trimmed.match(new RegExp(`\\b${name}\\s*\\(`, "g")) || []).length;
    return calls > 1;
  })();
  const hasEdge = /(null|none|empty|undefined|\.length\s*===?\s*0|len\(|<\s*1|<=\s*0|return\s+0|return\s+\[\])/.test(lower);
  const mentionsComplexity = /o\(|log\s*n|n\^2|nlogn|time complexity|space complexity|big-?o/.test(lower);
  const hasComment = /\/\/|#\s|\/\*|\*\s/.test(trimmed);

  const hintHits = hints.filter((h) => lower.includes(h.toLowerCase())).length;
  const hintScore = hints.length ? (hintHits / hints.length) * 100 : 60;

  // Dimension scores.
  const correctness = clamp(
    (hasFunction ? 26 : 0) +
      (hasReturn ? 22 : 0) +
      (hasLoop || hasRecursion ? 20 : 0) +
      hintScore * 0.32
  );
  const structure = clamp(
    (hasFunction ? 40 : 10) +
      Math.min(lines.length, 8) * 5 +
      (hasReturn ? 12 : 0)
  );
  const edge = clamp((hasEdge ? 70 : 25) + (mentionsComplexity ? 25 : 0));
  const readability = clamp(
    45 +
      (hasComment ? 25 : 0) +
      (lines.length >= 3 && lines.length <= 40 ? 20 : 0) -
      (lines.some((l) => l.length > 120) ? 15 : 0)
  );

  const score = clamp(correctness * 0.45 + structure * 0.2 + edge * 0.2 + readability * 0.15);
  const passed = Math.max(0, Math.min(totalTests, Math.round((score / 100) * totalTests)));

  const feedback: string[] = [];
  if (!hasFunction) feedback.push("Wrap your solution in a function or method so it can be tested.");
  if (!hasReturn) feedback.push("Make sure you return (or print) a result — the judge couldn't find one.");
  if (!hasLoop && !hasRecursion) feedback.push("Most solutions here need iteration or recursion; add the core logic.");
  if (!hasEdge) feedback.push("Handle edge cases — empty input, nulls, or single-element inputs.");
  if (hints.length && hintHits < hints.length)
    feedback.push(`Consider the intended approach — keywords like “${hints.slice(0, 3).join(", ")}” are usually involved.`);
  if (!mentionsComplexity) feedback.push("Note the time/space complexity in a comment — interviewers always ask.");
  if (!hasComment) feedback.push("A one-line comment on your approach makes the solution easier to follow.");
  if (feedback.length === 0)
    feedback.push("Clean, complete solution — strong structure, edge cases covered, and clear intent.");

  return {
    score,
    passed,
    total: totalTests,
    dimensions: [
      { label: "Correctness", pct: correctness },
      { label: "Structure", pct: structure },
      { label: "Edge cases", pct: edge },
      { label: "Readability", pct: readability },
    ],
    feedback: feedback.slice(0, 4),
  };
}

/** Points awarded for a submission, scaled by score and difficulty. */
export function pointsForScore(score: number, difficulty = "Medium"): number {
  const base = difficulty === "Hard" ? 120 : difficulty === "Easy" ? 50 : 80;
  return Math.round((score / 100) * base);
}
