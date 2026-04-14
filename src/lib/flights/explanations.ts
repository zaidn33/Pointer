import { FlightRecommendationSignal, FlightExplanationInput } from "./match-types";

export function generateExplanationInput(signals: FlightRecommendationSignal): FlightExplanationInput {
  const airlineLoyaltyRelevance = signals.airlines.length > 0
    ? `Flies ${signals.airlines.join(" & ")}, favors specific airline benefits`
    : null;

  const premiumCabinRelevance = signals.premiumTravelTags.length > 0
    ? `Premium cabin detected, favors luxury perks and high-tier lounge access`
    : null;

  const internationalTravelRelevance = signals.isInternational
    ? (signals.isLongHaul ? `Long-haul international, favors no-FX fees and comprehensive travel insurance` : `Short-haul international, favors basic travel coverage`)
    : null;

  const stopMinimizationRelevance = signals.stopCount === 0
    ? `Direct flight`
    : (signals.stopCount === 1 ? `1 stop, may benefit from transit lounge access` : `Multiple stops, high relevance for lounge access`);

  return {
    airlineLoyaltyRelevance,
    premiumCabinRelevance,
    internationalTravelRelevance,
    stopMinimizationRelevance,
  };
}
