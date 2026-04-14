import { Flight } from "./types";

export interface FlightRecommendationSignal {
  airlines: string[];
  alliances: string[];
  cabinClass: string;
  stopCount: number;
  isInternational: boolean;
  isLongHaul: boolean;
  tripType: string;
  premiumTravelTags: string[];
  pointsFriendlyTags: string[];
}

export interface FlightExplanationInput {
  airlineLoyaltyRelevance: string | null;
  premiumCabinRelevance: string | null;
  internationalTravelRelevance: string | null;
  stopMinimizationRelevance: string | null;
}

export interface FlightCardMatchContext {
  airlineBenefitTags: string[];
  travelRedemptionRelevance: string[];
  loungePerkRelevance: string[];
  foreignTransactionRelevance: string | null;
}

export interface EnrichedFlightResult {
  flight: Flight;
  signals: FlightRecommendationSignal;
  explanationInput: FlightExplanationInput;
  matchContext: FlightCardMatchContext;
}

// Add forward declaration for wallet flight match
// using any to avoid circular imports if needed, or import WalletFlightCardMatch
import type { WalletFlightCardMatch } from "./card-match-types";

export interface MatchedFlightResult extends EnrichedFlightResult {
  cardMatches: WalletFlightCardMatch[];
}
