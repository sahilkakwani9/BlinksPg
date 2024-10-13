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
  console.log("TIP URL", url);
  const amount = Number(url.searchParams.get("amount")) || 0.1;
  const address = Number(url.searchParams.get("address"));

  const payload: ActionGetResponse = {
    icon: "someimage",
    title: "Tip to Me",
    description: "Support rahul by donating SOL.",
    label: "Tip",
    links: {
      actions: [
        {
          type: "external-link",
          label: "Tip 0.1 SOL",
          href: `${url.href}?amount=${amount}&address=${address}`,
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
  const address = Number(url.searchParams.get("address"));
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
