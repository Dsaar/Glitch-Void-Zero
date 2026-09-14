async function requestLeaderboard(options = {}) {
  const response = await fetch('/api/leaderboard', {
    ...options,
    signal: options.signal ?? AbortSignal.timeout(10000),
  });
  if (!response.ok) {
    throw new Error('Leaderboard unavailable. Please try again.');
  }
  return response.json();
}

export function getLeaderboard(signal) {
  return requestLeaderboard({ signal });
}

export function saveScore(name, score) {
  return requestLeaderboard({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name.trim().toUpperCase(), score }),
  });
}
