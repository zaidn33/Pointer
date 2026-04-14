export interface CardCatalogEntry {
  knownNames: string[]; // Variations of exact/substring names
  hasNoForeignTransactionFee: boolean;
  airlineTransferPartners: string[];
  loungeBenefits: string[];
  premiumTravelTags: string[];
  travelInsuranceMarkers: string[];
}

export const CARD_BENEFITS_CATALOG: Record<string, CardCatalogEntry> = {
  "amex_cobalt": {
    knownNames: ["amex cobalt", "american express cobalt", "cobalt"],
    hasNoForeignTransactionFee: false, // Cobalt has 2.5% FX
    airlineTransferPartners: ["Air Canada", "Star Alliance", "British Airways", "Oneworld"], // Transfer points directly
    loungeBenefits: [],
    premiumTravelTags: [],
    travelInsuranceMarkers: ["comprehensive_travel_insurance"], // Cobalt has okay insurance
  },
  "aeroplan_reserve": {
    knownNames: ["aeroplan reserve", "air canada reserve"],
    hasNoForeignTransactionFee: false,
    airlineTransferPartners: ["Air Canada", "Star Alliance"],
    loungeBenefits: ["Maple Leaf Lounge", "Priority Pass"],
    premiumTravelTags: ["premium_travel_benefits"],
    travelInsuranceMarkers: ["comprehensive_travel_insurance"],
  },
  "scotia_passport": {
    knownNames: ["scotia passport", "scotiabank passport", "passport visa infinite"],
    hasNoForeignTransactionFee: true,
    airlineTransferPartners: [], // Scene+ can't transfer generically like Aeroplan
    loungeBenefits: ["Priority Pass"],
    premiumTravelTags: [],
    travelInsuranceMarkers: ["comprehensive_travel_insurance"],
  },
  "visa_infinite_privilege": {
    knownNames: ["visa infinite privilege", "vip"],
    hasNoForeignTransactionFee: false, // Baseline TD/CIBC VIP usually has FX unless strictly specified
    airlineTransferPartners: [],
    loungeBenefits: ["DragonPass", "Priority Pass"],
    premiumTravelTags: ["premium_travel_benefits"],
    travelInsuranceMarkers: ["comprehensive_travel_insurance"],
  },
  "wealthsimple_cash": {
    knownNames: ["wealthsimple cash", "ws cash", "wealthsimple mastercard"],
    hasNoForeignTransactionFee: true,
    airlineTransferPartners: [],
    loungeBenefits: [],
    premiumTravelTags: [],
    travelInsuranceMarkers: [],
  }
};
