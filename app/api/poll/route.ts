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
import satori from "satori";
import { renderPollImage } from "@/lib/utils/renderPollImage";
import { readFile } from "fs/promises";
import path from "path";
import { castVote } from "@/lib/utils/castVote";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const pollId = url.searchParams.get("pollId");
  console.log("pollId", pollId);

  const interArrayBuffer = await readFile(
    `${path.join(process.cwd(), "/public/Inter.ttf")}`
  );

  console.log("buffer", interArrayBuffer);

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

  const svg = await satori(
    renderPollImage({
      title: poll.title,
      options: poll.options,
    }),
    {
      width: 600,
      height: 500,
      fonts: [
        {
          name: "Inter",
          data: interArrayBuffer,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );

  const svgDataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString(
    "base64"
  )}`;

  const payload: ActionGetResponse = {
    title: poll?.title,
    icon: svgDataUri,
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
  try {
    const body: ActionPostRequest = await request.json();
    const url = new URL(request.url);

    const optionId = url.searchParams.get("option");
    const pollId = url.searchParams.get("pollId");
    if (!optionId || !pollId) {
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
    const connection = new Connection(
      clusterApiUrl("mainnet-beta"),
      "confirmed"
    );

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

    await castVote({
      optionId: optionId,
      pollId: pollId,
      voterId: sender.toString(),
    });

    return new Response(JSON.stringify(payload), {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (error) {
    console.log(typeof error);

    return new Response("Already Voted", {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
}
