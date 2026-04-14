import { FlightSearchCriteria, FlightSearchResponse } from "./types";
import { MockFlightProvider } from "./provider";
import { normalizeResponse } from "./normalize";
import { enrichFlight } from "./enrich";
import { EnrichedFlightResult } from "./match-types";

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
}

// Export a singleton instance for simple usage
export const flightService = new FlightService();
