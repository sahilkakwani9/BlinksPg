// route.ts
import { NextResponse } from "next/server";


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(
      req.url,
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    );
    const account = searchParams.get("account");

    const baseUrl = "https://www.validators.app/api/v1/validators/mainnet";
    const url = account ? `${baseUrl}/${account}.json` : `${baseUrl}.json`;

    const response = await fetch(url, {
      headers: {
        Token: "DczfPVfouXJ5uUjkfXsfAnm1",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `HTTP error! Status: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching validators:", error?.message || error);
    return NextResponse.json(
      { error: "Failed to load validators. Please try again later." },
      { status: 500 }
    );
  }
}
