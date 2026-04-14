export type CardMatchReason =
  | "airline_partner_match"
  | "alliance_relevance"
  | "no_fx_fee_relevance"
  | "lounge_access_relevance"
  | "travel_redemption_relevance"
  | "premium_travel_relevance"
  | "travel_insurance_relevance";

export type CardBenefitTag = string;

export interface FlightCardRuleResult {
  score: number;
  reasons: CardMatchReason[];
  matchedTags: CardBenefitTag[];
}

export interface WalletCardFlightInput {
  id: string;
  name: string;
  issuer: string;
  network: string;
  airlineTransferPartners: string[];
  loungeBenefits: string[];
  hasNoForeignTransactionFee: boolean;
  travelInsuranceMarkers: string[];
  premiumTravelTags: string[];
}

export interface WalletFlightCardMatch {
  card: {
    id: string;
    name: string;
    issuer: string;
    network: string;
  };
  score: number;
  reasons: CardMatchReason[];
  matchedTags: CardBenefitTag[];
}
