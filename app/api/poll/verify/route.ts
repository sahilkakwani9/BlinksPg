import {
  ActionError,
  ACTIONS_CORS_HEADERS,
  createActionHeaders,
  NextActionPostRequest,
} from "@solana/actions";

import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import bs58 from "bs58";
import prisma from "../../../../lib/db/index";
import { castVote } from "@/lib/utils/castVote";
import { readFile } from "fs/promises";
import path from "path";
import { renderPollImage } from "@/lib/utils/renderPollImage";
import satori from "satori";

function verifySignature(message: string, signature: string, account: string) {
  const messageBytes = new TextEncoder().encode(message);
  const signatureBytes = Uint8Array.from(bs58.decode(signature));
  return nacl.sign.detached.verify(
    messageBytes,
    signatureBytes,
    Uint8Array.from(new PublicKey(account).toBuffer())
  );
}
const message = "You are voting for ";

const signMessageAction = {
  type: "action",
  label: "Thanks",
  icon: "https://img.step.finance/unsafe/s-1500/plain/https%3A%2F%2Fsf-cms.step.finance%2Fassets%2Fcaa40cff-c1b2-4494-bc55-5ed721a62e56",
  title: "",
  description: "This is sign statement demo",
};
const headers = createActionHeaders({
  chainId: "mainnet",
  actionVersion: "2.2.1",
});
export const OPTIONS = async () => {
  return new Response(null, { headers });
};
export async function POST(request: Request) {
  try {
    const { account, signature }: NextActionPostRequest = await request.json();
    const interArrayBuffer = await readFile(
      `${path.join(process.cwd(), "/public/Inter.ttf")}`
    );
    const url = new URL(request.url);
    const pollId = url.searchParams.get("pollId");
    const voterId = url.searchParams.get("voterId");
    const optionId = url.searchParams.get("optionId");
    const optionText = url.searchParams.get("optionText");

    if (!signature) {
      return Response.json({
        message: "Signature is required",
      } satisfies ActionError);
    }

    const isSignatureValid = verifySignature(
      message + optionText,
      signature,
      account
    );
    if (!isSignatureValid) {
      return Response.json({
        title: "Signature invalid",
        description: `Invalid message signature!
    account = ${account}
    message = ${message}
    signature = ${signature}`,
      });
    }

    await castVote({
      optionId: optionId!,
      pollId: pollId!,
      voterId: voterId!,
    });

    const poll = await prisma.polls.findUnique({
      where: { id: pollId! },
      include: { options: true },
    });

    const svg = await satori(
      renderPollImage({
        title: poll!.title,
        options: poll!.options,
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

    return Response.json(
      {
        ...signMessageAction,
        type: "action",
        title: "Your vote has been registered",
        description: "Thanks for Voting",
        icon: svgDataUri,
      },
      {
        headers: ACTIONS_CORS_HEADERS,
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      if (error?.message && error.message.includes("Already Voted")) {
        return Response.json(
          {
            ...signMessageAction,
            type: "action",
            title: "You already voted on this poll",
            description: "One wallet can vote only once on a poll",
          },
          {
            headers: ACTIONS_CORS_HEADERS,
            status: 200,
          }
        );
      }
    }
    return new Response("Something went wrong", {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
}
