export async function castVote(voteData: CastVoteData): Promise<void> {
  try {
    const response = await fetch("/api/poll/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(voteData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data: Poll = await response.json();
    console.log("vote data", data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create poll: ${error.message}`);
    } else {
      throw new Error("An unexpected error occurred while creating the poll.");
    }
  }
}
