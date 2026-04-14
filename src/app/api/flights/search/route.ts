import { NextRequest, NextResponse } from "next/server";
import { flightService } from "@/lib/flights/service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const origin = searchParams.get("origin");
    const destination = searchParams.get("destination");
    
    if (!origin || !destination) {
      return NextResponse.json(
        { error: "Missing required parameters: origin, destination" },
        { status: 400 }
      );
    }
    
    const criteria = {
      origin,
      destination,
      departureDate: searchParams.get("departureDate") || undefined,
      returnDate: searchParams.get("returnDate") || undefined,
      cabin: searchParams.get("cabin") || undefined,
      passengers: parseInt(searchParams.get("passengers") || "1", 10),
    };

    const response = await flightService.searchFlights(criteria);
    return NextResponse.json(response);
    
  } catch (error: any) {
    console.error("Flight search error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
