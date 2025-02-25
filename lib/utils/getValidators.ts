export interface Validator {
    account: string;
    name: string;
    avatar_url: string;
    commission: number;
    vote_account: string;
  }
  
  export const getValidators = async (
    account?: string,
    isLiquidStaking: boolean = false
  ): Promise<Validator | Validator[]> => {
    try {
      const baseUrl = `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/${isLiquidStaking ? "liquid/fetch" : "validators/fetch"}`;
  
      const url = account ? `${baseUrl}?account=${account}` : baseUrl;
      console.log("control here before uri");
      console.log("final url", url);
  
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error: any) {
      console.error("Error fetching validators:", error?.message || error);
      throw new Error("Failed to load validators. Please try again later.");
    }
  };
  