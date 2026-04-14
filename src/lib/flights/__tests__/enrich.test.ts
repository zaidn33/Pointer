import test from "node:test";
import assert from "node:assert";
import { enrichFlight } from "../enrich";
import { Flight } from "../types";

test("enrichFlight wraps everything correctly", () => {
  const flight: Flight = {
    id: "fl_1",
    providerId: "mock",
    price: 100,
    currency: "CAD",
    totalDurationMinutes: 120,
    segments: [
      {
        id: "seg_1",
        airline: "WestJet",
        flightNumber: "WS1",
        departureTime: "2024-01-01T10:00:00Z",
        arrivalTime: "2024-01-01T12:00:00Z",
        origin: "YYZ",
        destination: "YUL",
        durationMinutes: 120,
      }
    ]
  };

  const enriched = enrichFlight(flight, "economy");
  
  assert.strictEqual(enriched.flight.id, "fl_1");
  assert.ok(enriched.signals);
  assert.ok(enriched.explanationInput);
  assert.ok(enriched.matchContext);

  assert.deepStrictEqual(enriched.matchContext.airlineBenefitTags, ["airline_westjet"]);
  assert.deepStrictEqual(enriched.signals.airlines, ["WestJet"]);
  assert.strictEqual(enriched.explanationInput.premiumCabinRelevance, null);
});
