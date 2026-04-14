import { FlightSearchCriteria } from "./types";

type SearchParamsLike = Pick<URLSearchParams, "get">;

function parsePassengerCount(value: string | null) {
  const passengers = Number.parseInt(value || "1", 10);
  return Number.isFinite(passengers) && passengers > 0 ? passengers : 1;
}

export function parseFlightSearchCriteria(
  searchParams: SearchParamsLike,
): FlightSearchCriteria | null {
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");

  if (!origin || !destination) {
    return null;
  }

  return {
    origin,
    destination,
    departureDate: searchParams.get("departureDate") || undefined,
    returnDate: searchParams.get("returnDate") || undefined,
    cabin: searchParams.get("cabin") || undefined,
    passengers: parsePassengerCount(searchParams.get("passengers")),
  };
}
