export async function createPoll(pollData: CreatePollData): Promise<Poll> {
  try {
    const response = await fetch("/api/poll/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pollData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data: Poll = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create poll: ${error.message}`);
    } else {
      throw new Error("An unexpected error occurred while creating the poll.");
    }
  }
}
