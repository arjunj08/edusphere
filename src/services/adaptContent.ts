/**
 * "Explain It My Way" content adaptation. Returns the SAME concept regenerated
 * in several forms. Mocked with hand-written variants for one Problem Bank item
 * so the flow is demoable; a real LLM call swaps in behind this signature later.
 */

export type AdaptMode = "plain" | "analogy" | "map" | "worked" | "audio";

export interface MindNode {
  label: string;
  children?: string[];
}

export interface Adaptation {
  plain: string;
  analogy: string;
  map: { root: string; nodes: MindNode[] };
  worked: { steps: string[] };
  audioScript: string;
}

const DEFAULT: Adaptation = {
  plain:
    "Binary search finds a value in a sorted list. Look at the middle item. If it matches, you're done. If your target is smaller, repeat on the left half; if larger, the right half. Each look throws away half of what's left.",
  analogy:
    "It's like finding a word in a dictionary. You don't read every page — you flip to the middle, see whether your word comes before or after, and ignore the other half. A few flips and you're there.",
  map: {
    root: "Binary search",
    nodes: [
      { label: "Precondition", children: ["List is sorted"] },
      { label: "Step", children: ["Check middle", "Smaller → go left", "Larger → go right"] },
      { label: "Cost", children: ["Half removed each step", "O(log n) time"] },
    ],
  },
  worked: {
    steps: [
      "List = [2, 4, 6, 8, 10, 12], target = 10.",
      "Middle is 6 (index 2). 10 > 6, so search the right half [8, 10, 12].",
      "Middle is 10 (index 4). Match — return index 4.",
      "Two comparisons for six items: that's the log n speedup.",
    ],
  },
  audioScript:
    "Binary search on a sorted list. Look at the middle. If it matches your target, you are done. If your target is smaller, search the left half. If larger, search the right half. Each step removes half of the remaining items, so the work is logarithmic.",
};

const LIBRARY: Record<string, Adaptation> = {
  "p-2sum": DEFAULT,
  "p-bst": DEFAULT,
  default: DEFAULT,
};

export async function getAdaptation(itemId: string): Promise<Adaptation> {
  // Simulate a regeneration round-trip so the UI can show a brief pending state.
  await new Promise((r) => setTimeout(r, 180));
  return LIBRARY[itemId] ?? LIBRARY.default;
}
