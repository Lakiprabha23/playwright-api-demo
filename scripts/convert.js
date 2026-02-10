const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'postman', 'reqres.postman_collection.json');
const outputPath = path.join(__dirname, '..', 'tests', 'api.spec.ts');

const collection = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

let out = `
import { test, expect } from '@playwright/test';
`;

// Postman collections can have folders (items inside items). This handles both.
function collectRequests(items, acc = []) {
  for (const it of items || []) {
    if (it.request) acc.push(it);
    if (it.item) collectRequests(it.item, acc);
  }
  return acc;
}

const requests = collectRequests(collection.item);

requests.forEach((it) => {
  const name = (it.name || 'API Test').replace(/'/g, "\\'");
  const method = (it.request.method || 'GET').toLowerCase();

  // url can be string or object
  const rawUrl =
    typeof it.request.url === 'string'
      ? it.request.url
      : (it.request.url && it.request.url.raw) || '';

  out += `
test('${name}', async ({ request }) => {
  const res = await request.${method}('${rawUrl}');
  expect(res.status()).toBeGreaterThanOrEqual(200);
  expect(res.status()).toBeLessThan(500);
});
`;
});

fs.writeFileSync(outputPath, out.trimStart());
console.log(`Generated: ${outputPath}`);