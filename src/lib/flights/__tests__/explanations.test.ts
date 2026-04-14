import test from "node:test";
import assert from "node:assert";
import { generateExplanationInput } from "../explanations";
import { FlightRecommendationSignal } from "../match-types";

test("generateExplanationInput handles standard signals", () => {
  const signals: FlightRecommendationSignal = {
    airlines: ["Air Canada"],
    alliances: ["Star Alliance"],
    cabinClass: "economy",
    stopCount: 0,
    isInternational: false,
    isLongHaul: false,
    tripType: "domestic",
    premiumTravelTags: [],
    pointsFriendlyTags: []
  };

  const explanation = generateExplanationInput(signals);
  
  assert.strictEqual(explanation.premiumCabinRelevance, null);
  assert.strictEqual(explanation.internationalTravelRelevance, null);
  assert.strictEqual(explanation.stopMinimizationRelevance, "Direct flight");
  assert.ok(explanation.airlineLoyaltyRelevance?.includes("Air Canada"));
});

test("generateExplanationInput handles high-relevance signals", () => {
  const signals: FlightRecommendationSignal = {
    airlines: ["British Airways"],
    alliances: ["Oneworld"],
    cabinClass: "first",
    stopCount: 2,
    isInternational: true,
    isLongHaul: true,
    tripType: "international_long_haul",
    premiumTravelTags: ["premium_cabin"],
    pointsFriendlyTags: ["points_redeemable"]
  };

  const explanation = generateExplanationInput(signals);
  
  assert.ok(explanation.premiumCabinRelevance?.includes("Premium cabin detected"));
  assert.ok(explanation.internationalTravelRelevance?.includes("Long-haul international"));
  assert.ok(explanation.stopMinimizationRelevance?.includes("Multiple stops"));
});
