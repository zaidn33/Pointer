import { Flight, FlightSegment, RawMockFlight, RawMockFlightSegment, RawMockResponse } from "./types";

export function normalizeFlightSegment(raw: RawMockFlightSegment): FlightSegment {
  return {
    id: raw.seg_id || `seg_${Math.random().toString(36).substring(7)}`,
    airline: raw.carrier || "Unknown",
    flightNumber: raw.flight_no || "Unknown",
    departureTime: raw.dep_time || new Date().toISOString(),
    arrivalTime: raw.arr_time || new Date().toISOString(),
    origin: raw.orig || "UNK",
    destination: raw.dest || "UNK",
    durationMinutes: raw.duration || 0,
  };
}

export function normalizeFlight(raw: RawMockFlight, providerId: string): Flight {
  return {
    id: raw.flight_id || `fl_${Math.random().toString(36).substring(7)}`,
    providerId,
    price: raw.cash_price || 0,
    currency: raw.currency_code || "USD",
    pointsCost: raw.points_req ?? undefined,
    pointsProgram: raw.program ?? undefined,
    totalDurationMinutes: raw.total_time || 0,
    segments: Array.isArray(raw.legs) ? raw.legs.map(normalizeFlightSegment) : [],
  };
}

export function normalizeResponse(raw: RawMockResponse, providerName: string): Flight[] {
  if (!raw || !Array.isArray(raw.flights)) {
    return [];
  }
  return raw.flights.map((flight) => normalizeFlight(flight, providerName));
}
