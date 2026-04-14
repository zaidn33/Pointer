import { EnrichedFlightResult } from "./match-types";
import { WalletCardFlightInput, FlightCardRuleResult, CardMatchReason, CardBenefitTag } from "./card-match-types";
import {
  FLIGHT_MATCH_REASONS,
  FLIGHT_MATCH_SCORE_WEIGHTS,
  FLIGHT_MATCH_TAGS,
} from "./config";

export function evaluateCardRules(card: WalletCardFlightInput, flight: EnrichedFlightResult): FlightCardRuleResult {
  let score = 0;
  const reasons: CardMatchReason[] = [];
  const matchedTags: CardBenefitTag[] = [];

  const { signals } = flight;

  // Rule 1: Airline / Alliance relevance
  let airlineMatched = false;
  for (const p of card.airlineTransferPartners) {
    if (signals.airlines.includes(p) || signals.alliances.includes(p)) {
      airlineMatched = true;
      matchedTags.push(`airline_partner_${p.toLowerCase().replace(/\s+/g, "_")}`);
      break; // Added break to avoid duplicate adding if multiple partners match
    }
  }
  if (airlineMatched) {
    score += FLIGHT_MATCH_SCORE_WEIGHTS.airlinePartner;
    reasons.push(FLIGHT_MATCH_REASONS.airlinePartner);
  }

  // Rule 2: No-FX Relevance for International Travel
  if (signals.isInternational && card.hasNoForeignTransactionFee) {
    score += FLIGHT_MATCH_SCORE_WEIGHTS.noForeignTransactionFee;
    reasons.push(FLIGHT_MATCH_REASONS.noForeignTransactionFee);
    matchedTags.push(FLIGHT_MATCH_TAGS.noForeignTransactionFee);
  }

  // Rule 3: Lounge relevance for long-haul or multi-stop
  if ((signals.isLongHaul || signals.stopCount > 0) && card.loungeBenefits.length > 0) {
    score += FLIGHT_MATCH_SCORE_WEIGHTS.loungeAccess;
    reasons.push(FLIGHT_MATCH_REASONS.loungeAccess);
    matchedTags.push(FLIGHT_MATCH_TAGS.loungeAccess);
  }

  // Rule 4: Travel Redemption Relevance
  if (signals.pointsFriendlyTags.length > 0 && card.airlineTransferPartners.length > 0) {
    score += FLIGHT_MATCH_SCORE_WEIGHTS.travelRedemption;
    reasons.push(FLIGHT_MATCH_REASONS.travelRedemption);
    matchedTags.push(FLIGHT_MATCH_TAGS.travelRedemption);
  }

  // Rule 5: Premium Travel Relevance
  if (signals.premiumTravelTags.length > 0 && card.premiumTravelTags.length > 0) {
    score += FLIGHT_MATCH_SCORE_WEIGHTS.premiumTravel;
    reasons.push(FLIGHT_MATCH_REASONS.premiumTravel);
    matchedTags.push(FLIGHT_MATCH_TAGS.premiumTravel);
  }

  // Rule 6: Travel Insurance Relevance
  if (card.travelInsuranceMarkers.length > 0 && (signals.isInternational || signals.isLongHaul)) {
    score += FLIGHT_MATCH_SCORE_WEIGHTS.travelInsurance;
    reasons.push(FLIGHT_MATCH_REASONS.travelInsurance);
    matchedTags.push(FLIGHT_MATCH_TAGS.travelInsurance);
  }

  return {
    score,
    reasons,
    matchedTags
  };
}
