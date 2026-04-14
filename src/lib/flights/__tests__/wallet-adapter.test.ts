import test from "node:test";
import assert from "node:assert";
import { adaptWalletCardToFlightInput } from "../wallet-adapter";

test("adaptWalletCardToFlightInput: catalog match for Amex Cobalt", () => {
  const mockDbCard: any = {
    id: "card_cobalt",
    name: "Amex Cobalt",
    issuer: "American Express",
    network: "Amex",
    annualFee: 156
  };

  const adapted = adaptWalletCardToFlightInput(mockDbCard);
  
  // Cobalt in catalog has hasNoForeignTransactionFee: false
  assert.strictEqual(adapted.hasNoForeignTransactionFee, false);
  assert.ok(adapted.airlineTransferPartners.includes("Air Canada"));
  assert.ok(adapted.airlineTransferPartners.includes("British Airways"));
});

test("adaptWalletCardToFlightInput: catalog match for Scotia Passport", () => {
  const mockDbCard: any = {
    id: "card_passport",
    name: "Scotiabank Passport Visa Infinite",
    issuer: "Scotiabank",
    network: "Visa",
    annualFee: 150
  };

  const adapted = adaptWalletCardToFlightInput(mockDbCard);
  
  // Passport in catalog has hasNoForeignTransactionFee: true
  assert.strictEqual(adapted.hasNoForeignTransactionFee, true);
  assert.ok(adapted.loungeBenefits.includes("Priority Pass"));
});

test("adaptWalletCardToFlightInput: fallback heuristic for unknown card", () => {
  const mockDbCard: any = {
    id: "unknown_1",
    name: "Generic Travel Card",
    issuer: "RandomBank",
    network: "Visa",
    annualFee: 120
  };

  const adapted = adaptWalletCardToFlightInput(mockDbCard);
  
  // Heuristic based on annualFee > 100
  assert.ok(adapted.travelInsuranceMarkers.includes("comprehensive_travel_insurance"));
  // No specific partners or lounge in generic fallback for unknown name
  assert.strictEqual(adapted.airlineTransferPartners.length, 0);
  assert.strictEqual(adapted.hasNoForeignTransactionFee, false);
});
