import { NFTList } from "@/lib/utils/tensorList";
import {
  ACTIONS_CORS_HEADERS,
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
} from "@solana/actions";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export async function GET(request: Request) {
  const url = new URL(request.url);

  const payload: ActionGetResponse = {
    title: "List NFT",
    description: "List your NFT on Tensor",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptNSAxMWgtNHY0aC0ydi00SDd2LTJoNFY3aDJ2NEgxN3YyeiIgZmlsbD0iY3VycmVudENvbG9yIi8+PC9zdmc+",
    label: "List",
    links: {
      actions: [
        {
          href: `${url.href}?mint=mint?price=price`,
          label: "List",
          type: "transaction",
          parameters: [
            {
              name: "mint",
              label: "Enter the mint address of your nft",
            },
            {
              name: "price",
              label: "Enter the price at which you want to list your nft",
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
  try {
    const url = new URL(request.url);
    const mint = url.searchParams.get("mint");
    const price = url.searchParams.get("price");
    const body: ActionPostRequest = await request.json();
    // const { name, description, image, attributes, symbol } = body.inputs || {};

    if (!mint) {
      return Response.json(
        {
          error: {
            message: "Missing required fields",
          },
        },
        {
          status: 400,
          headers: ACTIONS_CORS_HEADERS,
        }
      );
    }

    let owner;
    try {
      owner = new PublicKey(body.account);
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

    const handleListNFT = async () => {
      if (!price || !mint || !owner) return;

      try {
        const priceList = parseFloat(price);

        const signedTransaction = await NFTList({
          mint, // mintedNft.mintAddress
          owner: owner.toBase58(),
          price: priceList * LAMPORTS_PER_SOL,
        });
        return signedTransaction
          .serialize({
            requireAllSignatures: false,
            verifySignatures: false,
          })
          .toString("base64");
      } catch (error) {
        console.error("Listing error:", error);
      }
    };

    const ListTxn = await handleListNFT();
    // Prepare message for signing
    const payload: ActionPostResponse = {
      transaction: ListTxn!,
      message: `Successfully created Mint NFT transaction}`,
      type: "transaction",
    };

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (error) {
    console.error(error);
    return new Response("Error creating NFT", {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
}
