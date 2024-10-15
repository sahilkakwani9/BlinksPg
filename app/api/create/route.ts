import createSwapOrder from "@/lib/utils/createSwapOrder";
import { Cluster, getTokenInfo } from "@/lib/utils/getTokenInfo";
import {
  ACTIONS_CORS_HEADERS,
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
} from "@solana/actions";
import {
  clusterApiUrl,
  PublicKey,
  VersionedTransaction,
} from "@solana/web3.js";
import cluster from "cluster";

export const GET = async (req: Request) => {
  try {
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
        clusterApiUrl("mainnet-beta")
      ),
      getTokenInfo(
        new PublicKey(buyTokenAddress),
        Cluster.MainnetBeta,
        clusterApiUrl("mainnet-beta")
      ),
    ]);

    const payload: ActionGetResponse = {
      title: `Sell ${sellTokenInfo?.symbol} & Buy ${buyTokenInfo?.symbol}`,
      icon: "http://blinks-pg-five.vercel.app/_next/image?url=%2Fimages%2Fcovers%2FSwap.png&w=2048&q=75",
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

    const swapTransactionBuf = Buffer.from(data, "base64");
    var transaction = VersionedTransaction.deserialize(swapTransactionBuf);

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
