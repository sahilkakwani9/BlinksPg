import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/db/index";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pollId, voterId, optionId } = body;

    console.log("Vote recorded successfully!");
    return NextResponse.json("Vote recorded successfully!", { status: 201 });
  } catch (error) {
    console.error("Error creating poll:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the poll." },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
