/**
 * Multimodal Notes Generator. One action yields four synced outputs from the
 * same source. Mocked for one sample; real generation swaps in behind this.
 */

export interface Flashcard {
  front: string;
  back: string;
}

export interface GeneratedNotes {
  summary: string;
  narration: string;
  mindmap: { root: string; branches: { label: string; leaves: string[] }[] };
  flashcards: Flashcard[];
}

const SAMPLE: GeneratedNotes = {
  summary:
    "Binary search trees keep left subtrees smaller and right subtrees larger than each node. That ordering makes search, insert, and delete O(log n) on a balanced tree, because every comparison eliminates half the remaining nodes.",
  narration:
    "A binary search tree orders data as it stores it. Left child smaller, right child larger. To search, start at the root and go left or right until you find the value. Each step halves the remaining tree, so search is logarithmic.",
  mindmap: {
    root: "Binary Search Tree",
    branches: [
      { label: "Property", leaves: ["Left < node", "Right > node", "Holds for every subtree"] },
      { label: "Operations", leaves: ["Search O(log n)", "Insert O(log n)", "Delete O(log n)"] },
      { label: "Risk", leaves: ["Unbalanced → O(n)", "Fix: AVL / Red-Black"] },
    ],
  },
  flashcards: [
    { front: "What invariant defines a BST?", back: "Left subtree < node < right subtree, recursively." },
    { front: "Why is balanced BST search O(log n)?", back: "Each comparison removes half the remaining nodes." },
    { front: "What breaks BST performance?", back: "An unbalanced tree degrades to O(n); balancing schemes fix it." },
  ],
};

export async function generateNotes(_sourceId: string): Promise<GeneratedNotes> {
  await new Promise((r) => setTimeout(r, 220));
  return SAMPLE;
}
