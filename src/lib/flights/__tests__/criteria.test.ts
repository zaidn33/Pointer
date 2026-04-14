import test from "node:test";
import assert from "node:assert";
import { parseFlightSearchCriteria } from "../criteria";

test("parseFlightSearchCriteria returns null for missing required params", () => {
  assert.strictEqual(
    parseFlightSearchCriteria(new URLSearchParams("origin=YYZ")),
    null,
  );
  assert.strictEqual(
    parseFlightSearchCriteria(new URLSearchParams("destination=YVR")),
    null,
  );
});

test("parseFlightSearchCriteria preserves existing query contract", () => {
  const criteria = parseFlightSearchCriteria(
    new URLSearchParams(
      "origin=YYZ&destination=YVR&departureDate=2026-05-01&cabin=business&passengers=2",
    ),
  );

  assert.deepStrictEqual(criteria, {
    origin: "YYZ",
    destination: "YVR",
    departureDate: "2026-05-01",
    returnDate: undefined,
    cabin: "business",
    passengers: 2,
  });
});

test("parseFlightSearchCriteria defaults invalid passenger values", () => {
  const criteria = parseFlightSearchCriteria(
    new URLSearchParams("origin=YYZ&destination=YVR&passengers=bogus"),
  );

  assert.strictEqual(criteria?.passengers, 1);
});
