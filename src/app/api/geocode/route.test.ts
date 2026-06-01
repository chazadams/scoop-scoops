import { GET } from './route';
import { NextRequest } from 'next/server';

test('resolves zip 03801 to Portsmouth NH coordinates', async () => {
  const req = new NextRequest('http://localhost/api/geocode?zip=03801');
  const res = await GET(req);
  expect(res.status).toBe(200);
  const { lat, lng } = await res.json();
  // Portsmouth NH is ~43.07°N, 70.78°W
  expect(lat).toBeGreaterThan(42.5);
  expect(lat).toBeLessThan(43.5);
  expect(lng).toBeGreaterThan(-71.5);
  expect(lng).toBeLessThan(-70.0);
});
