export function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  let dot = 0,
    normA = 0,
    normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function cosineToPercentage(cosine: number): number {
  return Math.min(100, Math.round(((cosine + 1) / 2) * 100 * 100) / 100 + 10);
}

