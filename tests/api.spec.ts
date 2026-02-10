import { test, expect } from '@playwright/test';

test('Get User', async ({ request }) => {
  const res = await request.get('https://reqres.in/api/users/2');
  expect(res.status()).toBeGreaterThanOrEqual(200);
  expect(res.status()).toBeLessThan(500);
});
