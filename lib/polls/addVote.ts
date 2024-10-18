import prisma from "../db/index";

export default async function voteForOption(
  pollId: string,
  optionId: string,
  voterId: string,
) {
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
}
