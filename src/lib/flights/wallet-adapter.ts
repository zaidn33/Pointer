import { WalletCardFlightInput } from "./card-match-types";
import { type Card } from "@prisma/client";
import { CARD_BENEFITS_CATALOG } from "./card-benefits-catalog";
import { FLIGHT_WALLET_FALLBACK_CONFIG } from "./config";

export type FlightWalletCardRecord = Pick<
  Card,
  "id" | "name" | "issuer" | "network" | "annualFee"
>;

const NORMALIZED_CARD_BENEFITS_CATALOG = Object.values(CARD_BENEFITS_CATALOG).map(
  (entry) => ({
    ...entry,
    normalizedKnownNames: entry.knownNames.map((knownName) =>
      knownName.toLowerCase(),
    ),
  }),
);

export function adaptWalletCardToFlightInput(card: FlightWalletCardRecord): WalletCardFlightInput {
  
  const nameLowercase = card.name.toLowerCase();
  
  // 1. Exact or normalized matching from canonical catalog
  for (const entry of NORMALIZED_CARD_BENEFITS_CATALOG) {
    if (entry.normalizedKnownNames.some((knownName) => nameLowercase.includes(knownName))) {
      return {
        id: card.id,
        name: card.name,
        issuer: card.issuer,
        network: card.network,
        hasNoForeignTransactionFee: entry.hasNoForeignTransactionFee,
        airlineTransferPartners: [...entry.airlineTransferPartners],
        loungeBenefits: [...entry.loungeBenefits],
        premiumTravelTags: [...entry.premiumTravelTags],
        travelInsuranceMarkers: [...entry.travelInsuranceMarkers]
      };
    }
  }

  // 2. Deterministic Fallback Heuristics
  const hasNoForeignTransactionFee =
    FLIGHT_WALLET_FALLBACK_CONFIG.noForeignTransactionFeeNameMarkers.some(
      (marker) => nameLowercase.includes(marker),
    );

  const airlineTransferPartners: string[] = [];
  if (nameLowercase.includes(FLIGHT_WALLET_FALLBACK_CONFIG.aeroplanNameMarker)) {
    airlineTransferPartners.push(...FLIGHT_WALLET_FALLBACK_CONFIG.aeroplanPartners);
  }
  if (nameLowercase.includes(FLIGHT_WALLET_FALLBACK_CONFIG.avionNameMarker)) {
    airlineTransferPartners.push(...FLIGHT_WALLET_FALLBACK_CONFIG.avionPartners);
  }

  const loungeBenefits: string[] = [];
  if (
    FLIGHT_WALLET_FALLBACK_CONFIG.loungeNameMarkers.some((marker) =>
      nameLowercase.includes(marker),
    )
  ) {
    loungeBenefits.push("Priority Pass");
  }

  const premiumTravelTags: string[] = [];
  if (
    FLIGHT_WALLET_FALLBACK_CONFIG.premiumTravelNameMarkers.some((marker) =>
      nameLowercase.includes(marker),
    )
  ) {
    premiumTravelTags.push("premium_travel_benefits");
  }

  const travelInsuranceMarkers: string[] = [];
  if (card.annualFee > FLIGHT_WALLET_FALLBACK_CONFIG.travelInsuranceAnnualFeeThreshold) {
    travelInsuranceMarkers.push("comprehensive_travel_insurance");
  }

  return {
    id: card.id,
    name: card.name,
    issuer: card.issuer,
    network: card.network,
    airlineTransferPartners,
    loungeBenefits,
    hasNoForeignTransactionFee,
    travelInsuranceMarkers,
    premiumTravelTags,
  };
}
