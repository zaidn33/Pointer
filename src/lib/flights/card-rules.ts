import { EnrichedFlightResult } from "./match-types";
import { WalletCardFlightInput, FlightCardRuleResult, CardMatchReason, CardBenefitTag } from "./card-match-types";

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
    score += 4;
    reasons.push("airline_partner_match"); // strongly typed now!
  }

  // Rule 2: No-FX Relevance for International Travel
  if (signals.isInternational && card.hasNoForeignTransactionFee) {
    score += 3;
    reasons.push("no_fx_fee_relevance");
    matchedTags.push("no_fx_fees");
  }

  // Rule 3: Lounge relevance for long-haul or multi-stop
  if ((signals.isLongHaul || signals.stopCount > 0) && card.loungeBenefits.length > 0) {
    score += 3;
    reasons.push("lounge_access_relevance");
    matchedTags.push("lounge_access");
  }

  // Rule 4: Travel Redemption Relevance
  if (signals.pointsFriendlyTags.length > 0 && card.airlineTransferPartners.length > 0) {
    score += 2;
    reasons.push("travel_redemption_relevance");
    matchedTags.push("redemption_points_redeemable");
  }

  // Rule 5: Premium Travel Relevance
  if (signals.premiumTravelTags.length > 0 && card.premiumTravelTags.length > 0) {
    score += 2;
    reasons.push("premium_travel_relevance");
    matchedTags.push("premium_travel_benefits");
  }

  // Rule 6: Travel Insurance Relevance
  if (card.travelInsuranceMarkers.length > 0 && (signals.isInternational || signals.isLongHaul)) {
    score += 1;
    reasons.push("travel_insurance_relevance");
    matchedTags.push("comprehensive_travel_insurance");
  }

  return {
    score,
    reasons,
    matchedTags
  };
}
