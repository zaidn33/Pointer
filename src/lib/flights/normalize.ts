import { Flight, FlightSegment, RawMockFlight, RawMockFlightSegment, RawMockResponse } from "./types";

const FALLBACK_TIMESTAMP = "1970-01-01T00:00:00.000Z";

function buildFallbackId(prefix: string, providerName: string, index: number) {
  return `${prefix}_${providerName}_${index}`;
}

export function normalizeFlightSegment(
  raw: RawMockFlightSegment,
  providerName = "unknown",
  index = 0,
): FlightSegment {
  return {
    id: raw.seg_id || buildFallbackId("seg", providerName, index),
    airline: raw.carrier || "Unknown",
    flightNumber: raw.flight_no || "Unknown",
    departureTime: raw.dep_time || FALLBACK_TIMESTAMP,
    arrivalTime: raw.arr_time || FALLBACK_TIMESTAMP,
    origin: raw.orig || "UNK",
    destination: raw.dest || "UNK",
    durationMinutes: raw.duration || 0,
  };
}

export function normalizeFlight(
  raw: RawMockFlight,
  providerId: string,
  index = 0,
): Flight {
  return {
    id: raw.flight_id || buildFallbackId("fl", providerId, index),
    providerId,
    price: raw.cash_price || 0,
    currency: raw.currency_code || "USD",
    pointsCost: raw.points_req ?? undefined,
    pointsProgram: raw.program ?? undefined,
    totalDurationMinutes: raw.total_time || 0,
    segments: Array.isArray(raw.legs)
      ? raw.legs.map((segment, segmentIndex) =>
          normalizeFlightSegment(segment, providerId, segmentIndex),
        )
      : [],
  };
}

export function normalizeResponse(raw: RawMockResponse, providerName: string): Flight[] {
  if (!raw || !Array.isArray(raw.flights)) {
    return [];
  }
  return raw.flights.map((flight, index) =>
    normalizeFlight(flight, providerName, index),
  );
}
