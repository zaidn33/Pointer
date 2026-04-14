import test from "node:test";
import assert from "node:assert";
import {
  FLIGHT_MATCH_REASONS,
  FLIGHT_MATCH_SCORE_WEIGHTS,
  FLIGHT_MATCH_TAGS,
  FLIGHT_MATCH_TOP_N_LIMIT,
} from "../config";

test("flight match config preserves scoring and reason contract", () => {
  assert.strictEqual(FLIGHT_MATCH_TOP_N_LIMIT, 3);
  assert.strictEqual(FLIGHT_MATCH_SCORE_WEIGHTS.airlinePartner, 4);
  assert.strictEqual(FLIGHT_MATCH_SCORE_WEIGHTS.noForeignTransactionFee, 3);
  assert.strictEqual(FLIGHT_MATCH_SCORE_WEIGHTS.loungeAccess, 3);
  assert.strictEqual(FLIGHT_MATCH_SCORE_WEIGHTS.travelRedemption, 2);
  assert.strictEqual(FLIGHT_MATCH_SCORE_WEIGHTS.premiumTravel, 2);
  assert.strictEqual(FLIGHT_MATCH_SCORE_WEIGHTS.travelInsurance, 1);

  assert.strictEqual(FLIGHT_MATCH_REASONS.airlinePartner, "airline_partner_match");
  assert.strictEqual(FLIGHT_MATCH_REASONS.noForeignTransactionFee, "no_fx_fee_relevance");
  assert.strictEqual(FLIGHT_MATCH_TAGS.travelRedemption, "redemption_points_redeemable");
});
