import { SOLANA_LOGO } from "@/lib/utils/constants";
import createSwapOrder from "@/lib/utils/createSwapOrder";
import { generateSvg } from "@/lib/utils/generateSvg";
import { Cluster, getTokenInfo } from "@/lib/utils/getTokenInfo";
import {
  ACTIONS_CORS_HEADERS,
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
} from "@solana/actions";
import { clusterApiUrl, PublicKey } from "@solana/web3.js";

export const GET = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const sellTokenAddress = requestUrl.searchParams.get("sell");
    const buyTokenAddress = requestUrl.searchParams.get("buy");

    if (!sellTokenAddress || !buyTokenAddress) {
      return Response.json("Data not provided", {
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const [sellTokenInfo, buyTokenInfo] = await Promise.all([
      getTokenInfo(
        new PublicKey(sellTokenAddress),
        Cluster.MainnetBeta,
        clusterApiUrl("mainnet-beta")
      ),
      getTokenInfo(
        new PublicKey(buyTokenAddress),
        Cluster.MainnetBeta,
        clusterApiUrl("mainnet-beta")
      ),
    ]);

    const svgContent = generateSvg(
      buyTokenInfo?.logoURI || SOLANA_LOGO,
      sellTokenInfo?.logoURI || SOLANA_LOGO
    );
    const svgDataUri = `data:image/svg+xml;base64,${Buffer.from(
      svgContent
    ).toString("base64")}`;

    const payload: ActionGetResponse = {
      title: `Sell ${sellTokenInfo?.symbol} & Buy ${buyTokenInfo?.symbol}`,
      icon: svgDataUri,
      description: `Enter details and swap tokens within seconds.`,
      label: "Swap Tokens",
      links: {
        actions: [
          {
            type: "post",
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

export const POST = async (req: Request) => {
  try {
    console.log("got post req");

    const requestUrl = new URL(req.url);

    const body: ActionPostRequest = await req.json();
    console.log("body", body);

    const sellTokenAddress = requestUrl.searchParams.get("sell");
    const buyTokenAddress = requestUrl.searchParams.get("buy");
    const amount = requestUrl.searchParams.get("amount");

    let account: PublicKey;

    try {
      account = new PublicKey(body.account);
    } catch (err) {
      return new Response('Invalid "account" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    if (!sellTokenAddress || !buyTokenAddress || !amount) {
      return Response.json("Data not provided", {
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const sellTokenInfo = await getTokenInfo(
      new PublicKey(sellTokenAddress),
      Cluster.MainnetBeta,
      clusterApiUrl("mainnet-beta")
    );

    const inAmount =
      parseInt(amount) * Math.pow(10, sellTokenInfo?.decimals || 9);

    const data = await createSwapOrder({
      amount: inAmount.toString(),
      inputMint: sellTokenAddress,
      outputMint: buyTokenAddress,
      owner: account.toString(),
    });

    console.log(data);

    const payload: ActionPostResponse = {
      transaction: data,
      message: `Swap executed`,
      type: "transaction",
    };

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};
