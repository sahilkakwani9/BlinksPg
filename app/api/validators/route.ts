// route.ts
import createStakeTransaction from "@/lib/utils/createStakeTxn";
import { getValidators } from "@/lib/utils/getValidators";
import {
  ACTIONS_CORS_HEADERS,
  ActionGetResponse,
  ActionPostResponse,
} from "@solana/actions";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

export const GET = async (req: Request) => {
  try {
    const { searchParams, href } = new URL(req.url);
    const validatorAccount = searchParams.get("account");
    if (!validatorAccount) {
      return new Response("Account parameter is required", {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    // Fetch data with error handling
    let data;
    try {
      data = await getValidators(validatorAccount);
    } catch (err) {
      console.error("getValidators failed:", err);
      return Response.json(
        { error: "Validator service unavailable" },
        { status: 502, headers: ACTIONS_CORS_HEADERS }
      );
    }

    const selectedValidator = Array.isArray(data) ? data[0] : data;

    if (!selectedValidator || !selectedValidator.account) {
      return new Response("Validator not found", {
        status: 404,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    console.log("selected validator", selectedValidator);
    if (!selectedValidator?.account) {
      return Response.json(
        { error: "Validator not found" },
        { status: 404, headers: ACTIONS_CORS_HEADERS }
      );
    }

    const actionUrl = new URL(req.url);
    actionUrl.pathname = `/api/validators/${encodeURIComponent(
      selectedValidator.account
    )}`;
    actionUrl.search = "";

    const payload: ActionGetResponse = {
      title: `Validator: ${selectedValidator.name}`,
      icon: selectedValidator.avatar_url || "/default-validator.png",
      description: `Commission: ${selectedValidator.commission}%`,
      label: "View Validator",
      links: {
        actions: [
          {
            type: "post",
            label: "Stake",
            href: `${href}&amount={amount}&validatorVote=${selectedValidator.vote_account}`,
            parameters: [
              {
                name: "amount",
                label: "SOL",
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
    console.error("API Error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return Response.json(
      { error: `Server Error: ${errorMessage}` },
      { status: 500, headers: ACTIONS_CORS_HEADERS }
    );
  }
};

export const POST = async (req: Request) => {
  try {
    console.log("got the req");

    const requestUrl = new URL(req.url);

    const body = await req.json();
    console.log("body", body);

    let userAccount: PublicKey;
    try {
      userAccount = new PublicKey(body.account);
    } catch (err) {
      return new Response('Invalid "account" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const validatorVote = requestUrl.searchParams.get("validatorVote");
    const amount = requestUrl.searchParams.get("amount");

    console.log("params", validatorVote, amount);

    if (!validatorVote || !amount) {
      return Response.json("Validator vote account or amount not provided", {
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const connection = new Connection(clusterApiUrl("mainnet-beta"));

    const encodedTx = await createStakeTransaction(
      connection,
      userAccount.toString(),
      validatorVote,
      parseFloat(amount)
    );
    console.log("encoded tx", encodedTx);

    const payload: ActionPostResponse = {
      transaction: encodedTx,
      message: "Stake transaction created",
      type: "transaction",
    };

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    const message = typeof err === "string" ? err : "An unknown error occurred";
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
};
