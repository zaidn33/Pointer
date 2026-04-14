import type { CardBenefitTag, CardMatchReason } from "./card-match-types";

export const FLIGHT_MATCH_TOP_N_LIMIT = 3;

export const FLIGHT_MATCH_SCORE_WEIGHTS = {
  airlinePartner: 4,
  noForeignTransactionFee: 3,
  loungeAccess: 3,
  travelRedemption: 2,
  premiumTravel: 2,
  travelInsurance: 1,
} as const;

export const FLIGHT_MATCH_REASONS = {
  airlinePartner: "airline_partner_match",
  noForeignTransactionFee: "no_fx_fee_relevance",
  loungeAccess: "lounge_access_relevance",
  travelRedemption: "travel_redemption_relevance",
  premiumTravel: "premium_travel_relevance",
  travelInsurance: "travel_insurance_relevance",
} as const satisfies Record<string, CardMatchReason>;

export const FLIGHT_MATCH_TAGS = {
  noForeignTransactionFee: "no_fx_fees",
  loungeAccess: "lounge_access",
  travelRedemption: "redemption_points_redeemable",
  premiumTravel: "premium_travel_benefits",
  travelInsurance: "comprehensive_travel_insurance",
} as const satisfies Record<string, CardBenefitTag>;

export const FLIGHT_SIGNALS_CONFIG = {
  alliancesByAirline: {
    "Air Canada": ["Star Alliance"],
    "United Airlines": ["Star Alliance"],
    Delta: ["SkyTeam"],
    WestJet: [],
  },
  canadianAirports: ["YYZ", "YYC", "YVR", "YUL", "YOW"],
  longHaulMinutes: 360,
  defaultCabin: "economy",
} as const;

export const FLIGHT_WALLET_FALLBACK_CONFIG = {
  noForeignTransactionFeeNameMarkers: ["scotia", "wealthsimple"],
  aeroplanNameMarker: "aeroplan",
  aeroplanPartners: ["Air Canada", "Star Alliance"],
  avionNameMarker: "avion",
  avionPartners: ["Oneworld", "British Airways"],
  loungeNameMarkers: ["visa infinite privilege", "platinum", "reserve"],
  premiumTravelNameMarkers: ["reserve", "platinum", "privilege"],
  travelInsuranceAnnualFeeThreshold: 100,
} as const;
