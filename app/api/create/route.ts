import { Cluster, getTokenInfo } from "@/lib/utils/getTokenInfo";
import { ACTIONS_CORS_HEADERS, ActionGetResponse } from "@solana/actions";

import { PublicKey, clusterApiUrl } from "@solana/web3.js";
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
      getTokenInfo(
        new PublicKey(sellTokenAddress),
        Cluster.MainnetBeta,
        clusterApiUrl("mainnet-beta"),
      ),
      getTokenInfo(
        new PublicKey(buyTokenAddress),
        Cluster.MainnetBeta,
        clusterApiUrl("mainnet-beta"),
      ),
    ]);

    console.log(sellTokenInfo, buyTokenInfo);
    const payload: ActionGetResponse = {
      title: `Sell ${sellTokenInfo?.symbol} & Buy ${buyTokenInfo?.symbol}`,
      icon: "https://ucarecdn.com/7aa46c85-08a4-4bc7-9376-88ec48bb1f43/-/preview/880x864/-/quality/smart/-/format/auto/",
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
                type: "number",
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
