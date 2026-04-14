import { EnrichedFlightResult } from "./match-types";
import { WalletCardFlightInput, WalletFlightCardMatch } from "./card-match-types";
import { evaluateCardRules } from "./card-rules";
import { FLIGHT_MATCH_TOP_N_LIMIT } from "./config";

export function matchWalletToFlight(flight: EnrichedFlightResult, wallet: WalletCardFlightInput[]): WalletFlightCardMatch[] {
  const matches: WalletFlightCardMatch[] = [];

  for (const card of wallet) {
    const result = evaluateCardRules(card, flight);
    
    matches.push({
      card: {
        id: card.id,
        name: card.name,
        issuer: card.issuer,
        network: card.network
      },
      score: result.score,
      reasons: result.reasons,
      matchedTags: result.matchedTags
    });
  }

  // Stable deterministic ranking:
  // 1. score desc
  // 2. card name asc
  // 3. card id asc
  matches.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const nameCompare = a.card.name.localeCompare(b.card.name);
    if (nameCompare !== 0) return nameCompare;
    return a.card.id.localeCompare(b.card.id);
  });

  return matches.slice(0, FLIGHT_MATCH_TOP_N_LIMIT);
}
