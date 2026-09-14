import test from 'node:test';
import assert from 'node:assert/strict';
import { createLeaderboardHandler } from './leaderboard.js';

async function call(handler, method = 'GET', body) {
  const headers = {};
  const res = {
    setHeader(key, value) { headers[key] = value; },
    end(value) { this.body = JSON.parse(value); },
  };
  await handler({ method, body, headers: { 'content-type': 'application/json' } }, res);
  return { status: res.statusCode, body: res.body, headers };
}

test('rejects invalid submissions before accessing MongoDB', async () => {
  const handler = createLeaderboardHandler(() => assert.fail('Database must not be accessed'));
  for (const body of [null, {}, { name: 'TOOLONG', score: 1 }, { name: 'A', score: -1 },
    { name: 'A', score: 1.5 }, { name: 'A', score: '100' }, { name: { $ne: '' }, score: 1 }, '{', ' '.repeat(1025)]) {
    assert.equal((await call(handler, 'POST', body)).status, 400);
  }
  assert.equal((await call(handler, 'DELETE')).status, 405);
});

test('normalizes callsign and stores a server timestamp', async () => {
  let stored;
  const handler = createLeaderboardHandler(async () => ({ insertOne: async (entry) => { stored = entry; } }));
  const result = await call(handler, 'POST', { name: ' ab ', score: 200, createdAt: 'fake' });
  assert.equal(result.status, 201);
  assert.deepEqual(result.body, { saved: true });
  assert.equal(stored.name, 'AB');
  assert.equal(stored.score, 200);
  assert.ok(stored.createdAt instanceof Date);
});

test('returns ten highest scores with stable ordering and public ids', async () => {
  const entries = Array.from({ length: 12 }, (_, i) => ({ _id: i, name: 'AAA', score: i * 100 }));
  const handler = createLeaderboardHandler(async () => ({ find: () => ({
    sort(order) {
      assert.deepEqual(order, { score: -1, createdAt: 1, _id: 1 });
      return { limit(count) { return { toArray: async () => entries.sort((a, b) => b.score - a.score).slice(0, count) }; } };
    },
  }) }));
  const result = await call(handler);
  assert.equal(result.status, 200);
  assert.equal(result.body.length, 10);
  assert.equal(result.body[0].score, 1100);
  assert.equal(result.body[0].id, '11');
  assert.equal(result.body[0]._id, undefined);
  assert.equal(result.headers['Cache-Control'], 'no-store');
});

test('database failures return a retryable response without leaking credentials', async () => {
  const handler = createLeaderboardHandler(async () => { throw new Error('secret database URI'); });
  for (const method of ['GET', 'POST']) {
    const result = await call(handler, method, { name: 'AAA', score: 100 });
    assert.equal(result.status, 503);
    assert.doesNotMatch(JSON.stringify(result.body), /secret/);
  }
});
