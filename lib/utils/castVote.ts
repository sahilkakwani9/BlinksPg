import prisma from "../db/index";
export async function castVote({
  voterId,
  pollId,
  optionId,
}: CastVoteData): Promise<void> {
  try {
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
    const hasVoted = await prisma.vote.findMany({
      where: {
        pollId: pollId,
        voterId: voterId,
      },
    });
    if (hasVoted && hasVoted.length > 0) {
      throw new Error(`Already Voted`);
    }

    await prisma.vote.create({
      data: {
        pollId: pollId,
        voterId: voterId,
      },
    });

    const data = await prisma.option.update({
      where: { id: optionId },
      data: { votes: option.votes + 1 },
    });
    console.log("vote data", data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create poll: ${error.message}`);
    } else {
      throw new Error("An unexpected error occurred while creating the poll.");
    }
  }
}
