import test from "node:test";
import assert from "node:assert";
import { generateFlightSignals } from "../signals";
import { Flight } from "../types";

const baseFlight: Flight = {
  id: "fl_1",
  providerId: "mock",
  price: 100,
  currency: "CAD",
  totalDurationMinutes: 120,
  segments: [
    {
      id: "seg_1",
      airline: "Air Canada",
      flightNumber: "AC1",
      departureTime: "2024-01-01T10:00:00Z",
      arrivalTime: "2024-01-01T12:00:00Z",
      origin: "YYZ",
      destination: "YUL",
      durationMinutes: 120,
    }
  ]
};

test("generateFlightSignals: simple domestic flight", () => {
  const result = generateFlightSignals(baseFlight, "economy");
  assert.deepStrictEqual(result.airlines, ["Air Canada"]);
  assert.deepStrictEqual(result.alliances, ["Star Alliance"]);
  assert.strictEqual(result.stopCount, 0);
  assert.strictEqual(result.isInternational, false);
  assert.strictEqual(result.isLongHaul, false);
  assert.strictEqual(result.tripType, "domestic");
  assert.deepStrictEqual(result.premiumTravelTags, []);
  assert.deepStrictEqual(result.pointsFriendlyTags, []);
});

test("generateFlightSignals: international long haul with points", () => {
  const flight: Flight = {
    ...baseFlight,
    pointsCost: 50000,
    totalDurationMinutes: 500,
    segments: [
      {
        ...baseFlight.segments[0],
        origin: "YYZ",
        destination: "LHR", // London
      }
    ]
  };

  const result = generateFlightSignals(flight, "business");
  assert.strictEqual(result.isInternational, true);
  assert.strictEqual(result.isLongHaul, true);
  assert.strictEqual(result.tripType, "international_long_haul");
  assert.deepStrictEqual(result.premiumTravelTags, ["premium_cabin"]);
  assert.deepStrictEqual(result.pointsFriendlyTags, ["points_redeemable"]);
});

test("generateFlightSignals: multi-segment stops", () => {
  const flight: Flight = {
    ...baseFlight,
    segments: [
      { ...baseFlight.segments[0], destination: "YYC" },
      { ...baseFlight.segments[0], origin: "YYC", destination: "YVR" }
    ]
  };
  const result = generateFlightSignals(flight, "economy");
  assert.strictEqual(result.stopCount, 1);
});
