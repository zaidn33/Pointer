import { NextRequest } from "next/server";
import {
  getErrorMessage,
  jsonError,
  REQUIRED_FLIGHT_SEARCH_PARAMS_MESSAGE,
} from "@/lib/api";
import { parseFlightSearchCriteria } from "@/lib/flights/criteria";
import { flightService } from "@/lib/flights/service";

export async function GET(request: NextRequest) {
  try {
    const criteria = parseFlightSearchCriteria(request.nextUrl.searchParams);

    if (!criteria) {
      return jsonError(400, "bad_request", REQUIRED_FLIGHT_SEARCH_PARAMS_MESSAGE);
    }

    const response = await flightService.searchFlights(criteria);
    return Response.json(response);
  } catch (error: unknown) {
    console.error("Flight search error:", error);
    return jsonError(500, "internal_error", getErrorMessage(error));
  }
}
