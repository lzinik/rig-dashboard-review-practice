export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString();
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString();
}

export function minutesAgo(timestamp: number): number {
  return Math.round((Date.now() / 1000 - timestamp) / 60);
}
