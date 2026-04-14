import { Flight } from "./types";
import { FlightRecommendationSignal } from "./match-types";

// Known alliance mappings (hardcoded simplistic matching for now)
const ALLIANCES: Record<string, string[]> = {
  "Air Canada": ["Star Alliance"],
  "United Airlines": ["Star Alliance"],
  "Delta": ["SkyTeam"],
  "WestJet": [], // Not in major alliance
};

// Known domestic airports (to deduce international or not)
const CANADIAN_AIRPORTS = ["YYZ", "YYC", "YVR", "YUL", "YOW"];

export function generateFlightSignals(flight: Flight, cabinParam?: string): FlightRecommendationSignal {
  // Extract all distinct airlines
  const airlinesSet = new Set<string>();
  flight.segments.forEach(s => airlinesSet.add(s.airline));
  const airlines = Array.from(airlinesSet);

  // Extract alliances
  const alliancesSet = new Set<string>();
  airlines.forEach(airline => {
    const al = ALLIANCES[airline];
    if (al) al.forEach(a => alliancesSet.add(a));
  });

  // Calculate domestic vs international
  // For simplicity, if Origin and Destination are both Canadian, it's domestic.
  let isInternational = false;
  if (flight.segments.length > 0) {
    const firstOrig = flight.segments[0].origin;
    const lastDest = flight.segments[flight.segments.length - 1].destination;
    if (!CANADIAN_AIRPORTS.includes(firstOrig) || !CANADIAN_AIRPORTS.includes(lastDest)) {
      isInternational = true;
    }
  }

  // Calculate long-haul
  // Heuristic: Total duration > 360 mins (6 hours)
  const isLongHaul = flight.totalDurationMinutes >= 360;

  // Stops
  const stopCount = Math.max(0, flight.segments.length - 1);

  // Cabin
  const cabinClass = cabinParam || "economy";

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
