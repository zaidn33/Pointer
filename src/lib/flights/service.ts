import { FlightSearchCriteria, FlightSearchResponse } from "./types";
import { MockFlightProvider } from "./provider";
import { normalizeResponse } from "./normalize";
import { enrichFlight } from "./enrich";
import { EnrichedFlightResult, MatchedFlightResult } from "./match-types";

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
    // 1. Get enriched flights
    const enrichedResponse = await this.searchFlights(criteria);

    // 2. Load wallet (mocking for safety out of tightly coupled DB logic in testing but ordinarily Prisma fetch)
    const { getWalletForUser } = require("../wallet"); // Dynamically import to avoid top level coupling if needed
    // In actual implementation, we might do:
    // const userWallet = await getWalletForUser(userId);
    // Since this is deterministic without changing DB wrappers, let's assume getWalletForUser fetches UserCards.
    
    // For now we'll do real DB fetch for UserCard including Card
    const { prisma } = require("../prisma");
    const userCards = await prisma.userCard.findMany({
      where: { userId },
      include: { card: true }
    });

    const rawCards = userCards.map((uc: any) => uc.card);
    
    // 3. Adapt wallet
    const { adaptWalletCardToFlightInput } = require("./wallet-adapter");
    const walletInputs = rawCards.map((c: any) => adaptWalletCardToFlightInput(c));

    // 4. Match
    const { matchWalletToFlight } = require("./card-match");
    
    const matchedResults = enrichedResponse.results.map((er: any) => {
      const matches = matchWalletToFlight(er, walletInputs);
      return {
        ...er,
        cardMatches: matches
      };
    });

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
