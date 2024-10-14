import {
  ACTIONS_CORS_HEADERS,
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
  createPostResponse,
} from "@solana/actions";

import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
} from "@solana/web3.js";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tipAmount = url.searchParams.get("amount") || 0.1;
  const payload: ActionGetResponse = {
    title: `Tip Me ${tipAmount} SOl`,
    icon: "https://ucarecdn.com/7aa46c85-08a4-4bc7-9376-88ec48bb1f43/-/preview/880x864/-/quality/smart/-/format/auto/",
    description: "Support me by sending SOL",
    label: "Tip me",
    links: {
      actions: [
        {
          label: `Tip Me ${tipAmount} SOL`,
          href: `${url.href}&amount={amount}`,
          parameters: [
            {
              name: "amount",
              label: "Enter the amount",
              min: tipAmount,
              required: false,
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
}

export const OPTIONS = GET;

export async function POST(request: Request) {
  const body: ActionPostRequest = await request.json();
  const url = new URL(request.url);
  const amount = Number(url.searchParams.get("amount")) || 0.1;
  const address = url.searchParams.get("address");
  let sender;

  try {
    sender = new PublicKey(body.account);
  } catch (error) {
    return Response.json(
      {
        error: {
          message: "Invalid account",
        },
      },
      {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      },
    );
  }

  const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: sender,
      toPubkey: new PublicKey(address),
      lamports: amount * LAMPORTS_PER_SOL,
    }),
  );
  transaction.feePayer = sender;
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;
  transaction.lastValidBlockHeight = (
    await connection.getLatestBlockhash()
  ).lastValidBlockHeight;

  const payload: ActionPostResponse = await createPostResponse({
    fields: {
      type: "transaction",
      transaction,
      message: "Transaction created",
    },
  });
  return new Response(JSON.stringify(payload), {
    headers: ACTIONS_CORS_HEADERS,
  });
}
