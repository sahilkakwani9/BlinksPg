declare interface PollOption {
  id: string;
  optionText: string;
  votes: number;
}

declare interface Poll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
}

declare interface CreatePollData {
  title: string;
  description: string;
  options: string[];
}
