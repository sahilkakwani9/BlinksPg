import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/db/index";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, options } = body;

    // Validate input
    if (
      !title ||
      !description ||
      !options ||
      !Array.isArray(options) ||
      options.length < 2
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid input. Please provide title, description, and at least two options.",
        },
        { status: 400 }
      );
    }

    // Create poll with options
    const poll = await prisma.polls.create({
      data: {
        title,
        description,
        options: {
          create: options.map((optionText: string) => ({
            optionText,
            votes: 0,
          })),
        },
      },
      include: {
        options: true,
      },
    });

    return NextResponse.json(poll, { status: 201 });
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
