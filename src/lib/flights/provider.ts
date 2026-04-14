import { FlightSearchCriteria, RawMockResponse } from "./types";

export interface FlightProvider {
  name: string;
  searchFlights(criteria: FlightSearchCriteria): Promise<RawMockResponse>;
}

export class MockFlightProvider implements FlightProvider {
  name = "mock";

  async searchFlights(criteria: FlightSearchCriteria): Promise<RawMockResponse> {
    // In a real provider, this would be an HTTP fetch.
    // Here we'll return some static fixture data matching the query.
    return {
      search_params: {
        orig: criteria.origin,
        dest: criteria.destination,
        dep_date: criteria.departureDate || "2024-01-01",
      },
      count: 2,
      flights: [
        {
          flight_id: "AC123",
          cash_price: 350.50,
          points_req: 25000,
          program: "Aeroplan",
          currency_code: "CAD",
          total_time: 300,
          legs: [
            {
              seg_id: "seg_1",
              carrier: "Air Canada",
              flight_no: "AC 123",
              dep_time: "2024-01-01T08:00:00Z",
              arr_time: "2024-01-01T13:00:00Z",
              orig: criteria.origin,
              dest: criteria.destination,
              duration: 300
            }
          ]
        },
        {
          flight_id: "WS456",
          cash_price: 299.00,
          points_req: null,
          program: null,
          currency_code: "CAD",
          total_time: 320,
          legs: [
            {
              seg_id: "seg_2",
              carrier: "WestJet",
              flight_no: "WS 456",
              dep_time: "2024-01-01T09:00:00Z",
              arr_time: "2024-01-01T14:20:00Z",
              orig: criteria.origin,
              dest: "YYC",
              duration: 120
            },
            {
              seg_id: "seg_3",
              carrier: "WestJet",
              flight_no: "WS 457",
              dep_time: "2024-01-01T15:00:00Z",
              arr_time: "2024-01-01T18:20:00Z",
              orig: "YYC",
              dest: criteria.destination,
              duration: 200
            }
          ]
        }
      ]
    };
  }
}
