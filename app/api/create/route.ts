import getTokenInfo from "@/lib/utils/getTokenInfo";
import { ACTIONS_CORS_HEADERS, ActionGetResponse } from "@solana/actions";

export const GET = async (req: Request) => {
  try {
    console.log("got hit");
    const requestUrl = new URL(req.url);
    const sellTokenAddress = requestUrl.searchParams.get("sell");
    const buyTokenAddress = requestUrl.searchParams.get("buy");

    console.log(sellTokenAddress, buyTokenAddress);

    if (!sellTokenAddress || !buyTokenAddress) {
      return Response.json("Data not provided", {
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const [sellTokenInfo, buyTokenInfo] = await Promise.all([
      getTokenInfo(sellTokenAddress),
      getTokenInfo(buyTokenAddress),
    ]);

    const payload: ActionGetResponse = {
      title: `Sell ${sellTokenInfo.result.symbol} & Buy ${buyTokenInfo.result.symbol}`,
      icon: "https://cryptonary.com/cdn-cgi/image/width=1920/https://cryptonary.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/05/HOW-TO-PLACE-LIMIT-ORDERS-ON-JUPITER.jpg",
      description: `Enter details and swap tokens within seconds.`,
      label: "Swap Tokens",
      links: {
        actions: [
          {
            label: "Swap Tokens",
            href: `${requestUrl.href}&amount={amount}`,
            parameters: [
              {
                name: "amount",
                label: "Enter the amount",
                required: true,
              },
            ],
          },
        ],
      },
    };

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log(err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};
