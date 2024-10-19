import {
  ACTIONS_CORS_HEADERS,
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
  createPostResponse,
} from "@solana/actions";
import prisma from "../../../lib/db/index";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
} from "@solana/web3.js";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const pollId = url.searchParams.get("pollId");
  console.log("pollId", pollId);

  const poll = await prisma.polls.findUnique({
    where: { id: pollId! },
    include: { options: true },
  });
  if (!poll) {
    return Response.json(
      {
        error: {
          message: "Invalid account",
        },
      },
      {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      }
    );
  }
  const payload: ActionGetResponse = {
    title: poll?.title,
    icon: "https://blinks-pg-five.vercel.app/_next/image?url=%2Fimages%2Fcovers%2FPoll.png&w=2048&q=75",
    description: poll.description,
    label: "Vote",
    links: {
      actions: poll?.options.map(
        (option: { optionText: string; id: string }) => {
          return {
            label: option.optionText,
            href: `${url.href}&option={option}`,
            type: "transaction",
          };
        }
      ),
    },
  };
  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  });
}

export const OPTIONS = GET;

export async function POST(request: Request) {
  const body: ActionPostRequest = await request.json();

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
      }
    );
  }
  const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: sender,
      toPubkey: sender,
      lamports: 0,
    })
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
      message: "Vote Txn Created",
    },
  });
  return new Response(JSON.stringify(payload), {
    headers: ACTIONS_CORS_HEADERS,
  });
}
