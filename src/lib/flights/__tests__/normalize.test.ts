import assert from "node:assert";
import test from "node:test";
import { normalizeResponse, normalizeFlight } from "../normalize";
import { RawMockFlight, RawMockResponse } from "../types";

test("normalizeFlight correctly maps standard valid data", () => {
  const mockData = {
    flight_id: "AC1",
    cash_price: 100,
    points_req: 15000,
    program: "Aeroplan",
    currency_code: "CAD",
    total_time: 150,
    legs: [
      {
        seg_id: "seg_1",
        carrier: "Air Canada",
        flight_no: "AC 1",
        dep_time: "2024-01-01T08:00:00Z",
        arr_time: "2024-01-01T10:30:00Z",
        orig: "YYZ",
        dest: "JFK",
        duration: 150,
      },
    ],
  };

  const result = normalizeFlight(mockData, "mock");
  assert.strictEqual(result.id, "AC1");
  assert.strictEqual(result.providerId, "mock");
  assert.strictEqual(result.price, 100);
  assert.strictEqual(result.pointsCost, 15000);
  assert.strictEqual(result.pointsProgram, "Aeroplan");
  assert.strictEqual(result.currency, "CAD");
  assert.strictEqual(result.totalDurationMinutes, 150);
  assert.strictEqual(result.segments.length, 1);
  assert.strictEqual(result.segments[0].airline, "Air Canada");
});

test("normalizeFlight handles missing/null values safely", () => {
  const mockData = {
    // Missing flight_id
    cash_price: 0,
    points_req: null,
    // Missing program
    // Missing currency_code
    total_time: 0,
    legs: null, // should handle null legs gracefully
  } as unknown as RawMockFlight;

  const result = normalizeFlight(mockData, "mock");
  assert.strictEqual(result.id, "fl_mock_0");
  assert.strictEqual(result.providerId, "mock");
  assert.strictEqual(result.price, 0);
  assert.strictEqual(result.pointsCost, undefined);
  assert.strictEqual(result.pointsProgram, undefined);
  assert.strictEqual(result.currency, "USD"); // Fallback
  assert.strictEqual(result.totalDurationMinutes, 0);
  assert.deepStrictEqual(result.segments, []);
});

test("normalizeResponse uses deterministic fallback IDs for malformed provider rows", () => {
  const rawInput = {
    search_params: {},
    count: 2,
    flights: [
      { cash_price: 50, legs: [{ carrier: "Air Canada" }] },
      { cash_price: 75, legs: [{ carrier: "WestJet" }] },
    ],
  } as unknown as RawMockResponse;

  const result = normalizeResponse(rawInput, "mock");

  assert.strictEqual(result[0].id, "fl_mock_0");
  assert.strictEqual(result[1].id, "fl_mock_1");
  assert.strictEqual(result[0].segments[0].id, "seg_mock_0");
  assert.strictEqual(
    result[0].segments[0].departureTime,
    "1970-01-01T00:00:00.000Z",
  );
});

test("normalizeResponse maps arrays properly", () => {
  const rawInput = {
    search_params: {},
    count: 1,
    flights: [
      { flight_id: "1", cash_price: 50 },
      { flight_id: "2", cash_price: 75 },
    ]
  } as RawMockResponse;

  const result = normalizeResponse(rawInput, "mock");
  assert.strictEqual(result.length, 2);
  assert.strictEqual(result[0].id, "1");
  assert.strictEqual(result[1].id, "2");
});

test("normalizeResponse handles malformed root correctly", () => {
  const result1 = normalizeResponse(null as unknown as RawMockResponse, "mock");
  assert.deepStrictEqual(result1, []);

  const result2 = normalizeResponse(
    { flights: null } as unknown as RawMockResponse,
    "mock",
  );
  assert.deepStrictEqual(result2, []);
});
