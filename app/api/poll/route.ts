import {
  ACTIONS_CORS_HEADERS,
  ActionGetResponse,
  ActionPostRequest,
} from "@solana/actions";
import prisma from "../../../lib/db/index";
import { PublicKey } from "@solana/web3.js";
import satori from "satori";
import { renderPollImage } from "@/lib/utils/renderPollImage";
import { readFile } from "fs/promises";
import path from "path";
import { SignMessageResponse } from "@dialectlabs/blinks";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const pollId = url.searchParams.get("pollId");
  const interArrayBuffer = await readFile(
    `${path.join(process.cwd(), "/public/Inter.ttf")}`,
  );
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
      },
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
    },
  );

  const svgDataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString(
    "base64",
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
            href: `${url.href}&option=${option.id}&optionText=${option.optionText}`,
            type: "message",
          };
        },
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
    console.log(url);
    const optionId = url.searchParams.get("option");
    const optionText = url.searchParams.get("optionText");
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
        },
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
        },
      );
    }
    const payload: SignMessageResponse = {
      data: `You are voting for ${optionText}`,
      type: "message",
      links: {
        next: {
          type: "post",
          href: `/api/poll/verify?pollId=${pollId}&voterId=${sender}&optionId=${optionId}&optionText=${optionText}`,
        },
      },
    };
    return new Response(JSON.stringify(payload), {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (error) {
    console.log(error);

    return new Response("Already Voted", {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
}
