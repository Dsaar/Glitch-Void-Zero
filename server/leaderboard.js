import { getScoresCollection } from './mongodb.js';

function reply(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

async function readBody(req) {
  if (req.body !== undefined) {
    const text = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    if (Buffer.byteLength(text) > 1024) throw new Error('Body too large');
    return JSON.parse(text);
  }
  let text = '';
  for await (const chunk of req) {
    text += chunk;
    if (Buffer.byteLength(text) > 1024) throw new Error('Body too large');
  }
  return JSON.parse(text);
}

export function createLeaderboardHandler(getCollection = getScoresCollection) {
  return async function handler(req, res) {
    if (!['GET', 'POST'].includes(req.method)) {
      res.setHeader('Allow', 'GET, POST');
      return reply(res, 405, { error: 'Method not allowed.' });
    }
    let entry;
    if (req.method === 'POST') {
      if (req.headers['content-type']?.split(';')[0] !== 'application/json') {
        return reply(res, 415, { error: 'Use application/json.' });
      }
      try {
        const body = await readBody(req);
        const name = typeof body?.name === 'string' ? body.name.trim().toUpperCase() : '';
        if (!/^[A-Z0-9]{1,3}$/.test(name) || !Number.isSafeInteger(body?.score) || body.score < 0) {
          return reply(res, 400, { error: 'Provide a 1–3 character callsign and a nonnegative integer score.' });
        }
        entry = { name, score: body.score, createdAt: new Date() };
      } catch {
        return reply(res, 400, { error: 'Invalid JSON or request exceeds 1 KB.' });
      }
    }
    try {
      const collection = await getCollection();
      if (entry) {
        await collection.insertOne(entry);
        return reply(res, 201, { saved: true });
      }
      const entries = await collection.find({}, { projection: { name: 1, score: 1, createdAt: 1 } })
        .sort({ score: -1, createdAt: 1, _id: 1 }).limit(10).toArray();
      return reply(res, 200, entries.map(({ _id, ...score }) => ({ id: _id.toString(), ...score })));
    } catch {
      return reply(res, 503, { error: 'Leaderboard unavailable. Please try again later.' });
    }
  };
}
