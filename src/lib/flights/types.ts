export interface FlightSearchCriteria {
  origin: string;
  destination: string;
  departureDate?: string;
  returnDate?: string;
  cabin?: string;
  passengers?: number;
}

export interface FlightSegment {
  id: string;
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  destination: string;
  durationMinutes: number;
}

export interface Flight {
  id: string;
  providerId: string;
  price: number;
  currency: string;
  pointsCost?: number;
  pointsProgram?: string;
  segments: FlightSegment[];
  totalDurationMinutes: number;
}

// Forward declaration since EnrichedFlightResult is mapped outside
export interface FlightSearchResponse<T = Flight> {
  criteria: FlightSearchCriteria;
  results: T[];
  meta: {
    provider: string;
    resultCount: number;
    mock?: boolean;
    walletCardCount?: number;
  };
}

// Raw provider types (Mock)
export interface RawMockFlightSegment {
  seg_id: string;
  carrier: string;
  flight_no: string;
  dep_time: string;
  arr_time: string;
  orig: string;
  dest: string;
  duration: number;
}

export interface RawMockFlight {
  flight_id: string;
  cash_price: number;
  points_req: number | null;
  program: string | null;
  currency_code: string;
  legs: RawMockFlightSegment[];
  total_time: number;
}

export interface RawMockResponse {
  search_params: Record<string, string>;
  flights: RawMockFlight[];
  count: number;
}
