import test from "node:test";
import assert from "node:assert";
import { matchWalletToFlight } from "../card-match";
import { EnrichedFlightResult } from "../match-types";
import { WalletCardFlightInput } from "../card-match-types";

const mockFlight: EnrichedFlightResult = {
  flight: {
    id: "test",
    providerId: "mock",
    price: 100,
    currency: "CAD",
    totalDurationMinutes: 500,
    segments: []
  },
  signals: {
    airlines: ["Air Canada"],
    alliances: ["Star Alliance"],
    cabinClass: "economy",
    stopCount: 1,
    isInternational: true,
    isLongHaul: true,
    premiumTravelTags: [],
    tripType: "international_long_haul",
    pointsFriendlyTags: ["points_redeemable"]
  },
  explanationInput: {} as any,
  matchContext: {} as any
};

test("matchWalletToFlight: top-3 limit and stable sorting", () => {
  const cards: WalletCardFlightInput[] = [
    {
      id: "card_d_low",
      name: "D Low Score",
      issuer: "Bank",
      network: "Visa",
      airlineTransferPartners: [],
      loungeBenefits: [],
      hasNoForeignTransactionFee: false,
      travelInsuranceMarkers: [],
      premiumTravelTags: []
    },
    {
      id: "card_a_high",
      name: "A High Score",
      issuer: "Bank",
      network: "Visa",
      airlineTransferPartners: ["Air Canada"],
      loungeBenefits: ["Priority Pass"],
      hasNoForeignTransactionFee: true,
      travelInsuranceMarkers: [],
      premiumTravelTags: []
    },
    {
      id: "card_b_high",
      name: "B High Score",
      issuer: "Bank",
      network: "Visa",
      airlineTransferPartners: ["Air Canada"],
      loungeBenefits: ["Priority Pass"],
      hasNoForeignTransactionFee: true,
      travelInsuranceMarkers: [],
      premiumTravelTags: []
    },
    {
      id: "card_c_high",
      name: "C High Score",
      issuer: "Bank",
      network: "Visa",
      airlineTransferPartners: ["Air Canada"],
      loungeBenefits: ["Priority Pass"],
      hasNoForeignTransactionFee: true,
      travelInsuranceMarkers: [],
      premiumTravelTags: []
    }
  ];

  const results = matchWalletToFlight(mockFlight, cards);
  
  // Should only return top 3
  assert.strictEqual(results.length, 3);
  
  // Stable sort: score desc, then name asc
  assert.strictEqual(results[0].card.name, "A High Score");
  assert.strictEqual(results[1].card.name, "B High Score");
  assert.strictEqual(results[2].card.name, "C High Score");
  
  // D Low Score should be excluded
  assert.ok(!results.find(r => r.card.name === "D Low Score"));
});

test("matchWalletToFlight: tie-breaking with ID", () => {
  const cards: WalletCardFlightInput[] = [
    {
      id: "id_2",
      name: "Same Name",
      issuer: "Bank",
      network: "Visa",
      airlineTransferPartners: [],
      loungeBenefits: [],
      hasNoForeignTransactionFee: false,
      travelInsuranceMarkers: [],
      premiumTravelTags: []
    },
    {
      id: "id_1",
      name: "Same Name",
      issuer: "Bank",
      network: "Visa",
      airlineTransferPartners: [],
      loungeBenefits: [],
      hasNoForeignTransactionFee: false,
      travelInsuranceMarkers: [],
      premiumTravelTags: []
    }
  ];

  const results = matchWalletToFlight(mockFlight, cards);
  
  assert.strictEqual(results[0].card.id, "id_1");
  assert.strictEqual(results[1].card.id, "id_2");
});
