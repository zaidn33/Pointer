import { Flight } from "./types";
import { EnrichedFlightResult, FlightCardMatchContext } from "./match-types";
import { generateFlightSignals } from "./signals";
import { generateExplanationInput } from "./explanations";

export function getMatchContext(signals: ReturnType<typeof generateFlightSignals>): FlightCardMatchContext {
  const airlineBenefitTags = signals.airlines.map(a => `airline_${a.toLowerCase().replace(/\s+/g, "_")}`);
  
  const travelRedemptionRelevance = signals.pointsFriendlyTags.map(tag => `redemption_${tag}`);

  const loungePerkRelevance = [];
  if (signals.stopCount > 0 || signals.isLongHaul) {
    loungePerkRelevance.push("lounge_access_valuable");
  }

  const foreignTransactionRelevance = signals.isInternational ? "no_fx_fees_preferred" : null;

  return {
    airlineBenefitTags,
    travelRedemptionRelevance,
    loungePerkRelevance,
    foreignTransactionRelevance,
  };
}

export function enrichFlight(flight: Flight, cabinParam?: string): EnrichedFlightResult {
  const signals = generateFlightSignals(flight, cabinParam);
  const explanationInput = generateExplanationInput(signals);
  const matchContext = getMatchContext(signals);

  return {
    flight,
    signals,
    explanationInput,
    matchContext,
  };
}
