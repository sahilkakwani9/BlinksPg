import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/db/index";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pollId, voterId, optionId } = body;
    const poll = await prisma.polls.findUnique({
      where: { id: pollId },
      include: { options: true },
    });

    if (!poll) {
      throw new Error("Poll not found");
    }

    const option = poll.options.find((opt) => opt.id === optionId);
    if (!option) {
      throw new Error("Option not found");
    }

    await prisma.vote.create({
      data: {
        pollId: pollId,
        voterId: voterId,
      },
    });

    await prisma.option.update({
      where: { id: optionId },
      data: { votes: option.votes + 1 },
    });

    console.log("Vote recorded successfully!");
    return NextResponse.json("Vote recorded successfully!", { status: 201 });
  } catch (error) {
    console.error("Error creating poll:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the poll." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
