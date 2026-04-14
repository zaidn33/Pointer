import { Flight } from "./types";
import { FlightRecommendationSignal } from "./match-types";
import { FLIGHT_SIGNALS_CONFIG } from "./config";

export function generateFlightSignals(flight: Flight, cabinParam?: string): FlightRecommendationSignal {
  // Extract all distinct airlines
  const airlinesSet = new Set<string>();
  flight.segments.forEach(s => airlinesSet.add(s.airline));
  const airlines = Array.from(airlinesSet);

  // Extract alliances
  const alliancesSet = new Set<string>();
  airlines.forEach(airline => {
    const al =
      FLIGHT_SIGNALS_CONFIG.alliancesByAirline[
        airline as keyof typeof FLIGHT_SIGNALS_CONFIG.alliancesByAirline
      ];
    if (al) al.forEach(a => alliancesSet.add(a));
  });

  // Calculate domestic vs international
  // For simplicity, if Origin and Destination are both Canadian, it's domestic.
  let isInternational = false;
  if (flight.segments.length > 0) {
    const firstOrig = flight.segments[0].origin;
    const lastDest = flight.segments[flight.segments.length - 1].destination;
    if (
      !FLIGHT_SIGNALS_CONFIG.canadianAirports.includes(
        firstOrig as (typeof FLIGHT_SIGNALS_CONFIG.canadianAirports)[number],
      ) ||
      !FLIGHT_SIGNALS_CONFIG.canadianAirports.includes(
        lastDest as (typeof FLIGHT_SIGNALS_CONFIG.canadianAirports)[number],
      )
    ) {
      isInternational = true;
    }
  }

  const isLongHaul = flight.totalDurationMinutes >= FLIGHT_SIGNALS_CONFIG.longHaulMinutes;

  // Stops
  const stopCount = Math.max(0, flight.segments.length - 1);

  // Cabin
  const cabinClass = cabinParam || FLIGHT_SIGNALS_CONFIG.defaultCabin;

  const premiumTravelTags = cabinClass !== "economy" ? ["premium_cabin"] : [];
  
  const pointsFriendlyTags = flight.pointsCost && flight.pointsCost > 0 ? ["points_redeemable"] : [];

  const tripType = isInternational ? (isLongHaul ? "international_long_haul" : "international_short_haul") : "domestic";

  return {
    airlines,
    alliances: Array.from(alliancesSet),
    cabinClass,
    stopCount,
    isInternational,
    isLongHaul,
    tripType,
    premiumTravelTags,
    pointsFriendlyTags,
  };
}
