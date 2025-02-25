import {
  ACTIONS_CORS_HEADERS,
  ActionGetResponse,
  ActionPostResponse,
} from "@solana/actions";
import { clusterApiUrl, PublicKey } from "@solana/web3.js";

import { BN } from "bn.js";
import { Cluster, getTokenInfo } from "@/lib/utils/getTokenInfo";
import { generateSvg } from "@/lib/utils/generateSvg";
import { SOLANA_LOGO } from "@/lib/utils/constants";
import { getBase64Image } from "@/lib/utils/getBase64Image";
import { getPoolDetails } from "@/lib/utils/getPoolDetails";
import {
  createDepositTransaction,
  fetchQoute,
} from "@/lib/utils/createDepositTransaction";

export const GET = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const poolAddress = requestUrl.searchParams.get("poolAddress");

    const token1Address = requestUrl.searchParams.get("tokenMint1");
    const token2Address = requestUrl.searchParams.get("tokenMint2");

    const token1Amount = requestUrl.searchParams.get("amount1");
    const token2Amount = requestUrl.searchParams.get("amount2");

    if (
      !token1Address ||
      !token2Address ||
      !poolAddress ||
      !token1Amount ||
      !token2Amount
    ) {
      return Response.json("Data not provided", {
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const [token1Info, token2Info, poolDetails] = await Promise.all([
      getTokenInfo(
        new PublicKey(token1Address),
        Cluster.MainnetBeta,
        clusterApiUrl("mainnet-beta")
      ),
      getTokenInfo(
        new PublicKey(token2Address),
        Cluster.MainnetBeta,
        clusterApiUrl("mainnet-beta")
      ),
      await getPoolDetails(poolAddress),
    ]);

    if (!poolDetails || !token1Info || !token2Info) {
      return Response.json("Token or Pool Details not found", {
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const token1Uri = await getBase64Image(token1Info?.logoURI || SOLANA_LOGO);
    const token2Uri = await getBase64Image(token2Info?.logoURI || SOLANA_LOGO);

    const svgContent = generateSvg(
      token1Uri || SOLANA_LOGO,
      token2Uri || SOLANA_LOGO
    );
    const svgDataUri = `data:image/svg+xml;base64,${Buffer.from(
      svgContent
    ).toString("base64")}`;

    const payload: ActionGetResponse = {
      title: `Add Funds to ${poolDetails.poolName}`,
      icon: svgDataUri,
      description: `Add liquidity to ${poolDetails.poolName} and earn rewards!`,
      label: "Add Funds",
      links: {
        actions: [
          {
            type: "post",
            label: "Deposit Funds",
            href: `${requestUrl.href}&amount1=${token1Amount}&amount2=${token2Amount}&poolAddress=${poolAddress}&token1Dec=${token1Info.decimals}&token2Dec=${token2Info.decimals}`,
          },
        ],
      },
    };

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.error(err);
    let message = "An unknown error occurred";
    if (typeof err === "string") message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};

export const POST = async (req: Request) => {
  try {
    console.log("Received POST request");

    const requestUrl = new URL(req.url);
    const body = await req.json();

    const poolAddress = requestUrl.searchParams.get("poolAddress");
    const amount1 = requestUrl.searchParams.get("amount1");
    const amount2 = requestUrl.searchParams.get("amount2");
    const token1Dec = requestUrl.searchParams.get("token1Dec");
    const token2Dec = requestUrl.searchParams.get("token2Dec");

    // Validate required parameters
    if (!poolAddress || !amount1 || !amount2 || !token1Dec || !token2Dec) {
      return Response.json(
        {
          error:
            "Missing required parameters: poolAddress, amount1, amount2, token1Dec, token2De",
        },
        { status: 400, headers: ACTIONS_CORS_HEADERS }
      );
    }

    const fetchToken1Quote = async () => {
      try {
        const amountBN = new BN(Number(amount1) * 1000000);
        const quoteData = await fetchQoute(connection, amountBN, poolAddress);

        return {
          tokenAmount1: quoteData?.tokenAInAmount,
          tokenAmount2: quoteData?.tokenBInAmount,
          poolTokenOut: quoteData?.poolTokenAmountOut,
        };
      } catch (error) {
        console.error("Error fetching quote for token1:", error);
      }
    };

    const tokenQoute = await fetchToken1Quote();

    // Validate account
    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      return Response.json(
        { error: "Invalid 'account' provided" },
        { status: 400, headers: ACTIONS_CORS_HEADERS }
      );
    }

    // Validate connection
    let connection: PublicKey;
    try {
      connection = body.connection;
    } catch (err) {
      return Response.json(
        { error: "Invalid 'connection' provided" },
        { status: 400, headers: ACTIONS_CORS_HEADERS }
      );
    }

    const transaction = await createDepositTransaction(
      connection,
      account,
      tokenQoute?.tokenAmount1!,
      tokenQoute?.tokenAmount2!,
      tokenQoute?.poolTokenOut!,
      poolAddress
    );

    // Serialize and return transaction
    const payload: ActionPostResponse = {
      transaction: transaction.serialize().toString("base64"),
      message: `Successfully created deposit transaction for ${amount1} and ${amount2} to pool ${poolAddress}`,
      type: "transaction",
    };

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.error("Error in POST request:", err);
    const message = typeof err === "string" ? err : "An unknown error occurred";

    return Response.json(
      { error: message }, // Wrap error in a JSON object
      { status: 400, headers: ACTIONS_CORS_HEADERS }
    );
  }
};
