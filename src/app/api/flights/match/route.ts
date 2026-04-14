import { NextRequest, NextResponse } from "next/server";
import { flightService } from "@/lib/flights/service";
import { requireUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // 401 unauthenticated handled by requireUser throwing AppAuthError
    const user = await requireUser();
    
    const searchParams = request.nextUrl.searchParams;
    const origin = searchParams.get("origin");
    const destination = searchParams.get("destination");
    
    // 400 invalid search criteria
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

    const response = await flightService.matchFlightsToWallet(user.id, criteria);
    
    // Standardized behavior: 
    // 200 with empty results if no flights match
    // 200 with empty cardMatches if user has no wallet cards
    // The service layer already ensures results is an array (possibly empty)
    // and each result has a cardMatches array (possibly empty).
    
    return NextResponse.json(response);
    
  } catch (error: any) {
    if (error.name === "AppAuthError") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Flight match error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
