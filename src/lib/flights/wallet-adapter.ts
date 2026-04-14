import { WalletCardFlightInput } from "./card-match-types";
import { type Card } from "@prisma/client";
import { CARD_BENEFITS_CATALOG } from "./card-benefits-catalog";

export function adaptWalletCardToFlightInput(card: Card & { categoryRules?: any[], merchantBenefits?: any[] }): WalletCardFlightInput {
  
  const nameLowercase = card.name.toLowerCase();
  
  // 1. Exact or normalized matching from canonical catalog
  for (const [key, entry] of Object.entries(CARD_BENEFITS_CATALOG)) {
    if (entry.knownNames.some(kn => nameLowercase.includes(kn.toLowerCase()))) {
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
  let hasNoForeignTransactionFee = false;
  if (nameLowercase.includes("scotia") || nameLowercase.includes("wealthsimple")) {
    hasNoForeignTransactionFee = true;
  }

  const airlineTransferPartners: string[] = [];
  if (nameLowercase.includes("aeroplan")) {
    airlineTransferPartners.push("Air Canada");
    airlineTransferPartners.push("Star Alliance");
  }
  if (nameLowercase.includes("avion")) {
    airlineTransferPartners.push("Oneworld");
    airlineTransferPartners.push("British Airways");
  }

  const loungeBenefits: string[] = [];
  if (nameLowercase.includes("visa infinite privilege") || nameLowercase.includes("platinum") || nameLowercase.includes("reserve")) {
    loungeBenefits.push("Priority Pass");
  }

  const premiumTravelTags: string[] = [];
  if (nameLowercase.includes("reserve") || nameLowercase.includes("platinum") || nameLowercase.includes("privilege")) {
    premiumTravelTags.push("premium_travel_benefits");
  }

  const travelInsuranceMarkers: string[] = [];
  if (card.annualFee > 100) {
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
