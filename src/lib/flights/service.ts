import { FlightSearchCriteria, FlightSearchResponse } from "./types";
import { MockFlightProvider } from "./provider";
import { normalizeResponse } from "./normalize";
import { enrichFlight } from "./enrich";
import { EnrichedFlightResult, MatchedFlightResult } from "./match-types";
import { listWalletCardsForFlights } from "../wallet";
import { adaptWalletCardToFlightInput } from "./wallet-adapter";
import { matchWalletToFlight } from "./card-match";

export class FlightService {
  private provider: MockFlightProvider;

  constructor() {
    this.provider = new MockFlightProvider();
  }

  async searchFlights(criteria: FlightSearchCriteria): Promise<FlightSearchResponse<EnrichedFlightResult>> {
    // Validate required inputs
    if (!criteria.origin || !criteria.destination) {
      throw new Error("Parameters 'origin' and 'destination' are required.");
    }

    // Call provider
    const rawResponse = await this.provider.searchFlights(criteria);

    // Normalize
    const normalizedFlights = normalizeResponse(rawResponse, this.provider.name);

    // Enrich
    const enrichedFlights = normalizedFlights.map(flight => enrichFlight(flight, criteria.cabin));

    return {
      criteria,
      results: enrichedFlights,
      meta: {
        provider: this.provider.name,
        resultCount: enrichedFlights.length,
        mock: true,
      },
    };
  }

  async matchFlightsToWallet(userId: string, criteria: FlightSearchCriteria): Promise<FlightSearchResponse<MatchedFlightResult>> {
    const enrichedResponse = await this.searchFlights(criteria);

    const userCards = await listWalletCardsForFlights(userId);
    const walletInputs = userCards.map(({ card }) => adaptWalletCardToFlightInput(card));

    const matchedResults =
      walletInputs.length === 0
        ? enrichedResponse.results.map((er) => ({
            ...er,
            cardMatches: [],
          }))
        : enrichedResponse.results.map((er) => ({
            ...er,
            cardMatches: matchWalletToFlight(er, walletInputs),
          }));

    return {
      criteria: enrichedResponse.criteria,
      results: matchedResults,
      meta: {
        ...enrichedResponse.meta,
        walletCardCount: walletInputs.length,
      }
    };
  }
}

// Export a singleton instance for simple usage
export const flightService = new FlightService();
