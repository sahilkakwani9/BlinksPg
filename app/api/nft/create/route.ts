import {
  ACTIONS_CORS_HEADERS,
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
} from "@solana/actions";
import { uploadToPinata } from "@/lib/utils/uploadToPinata";
import { initializeUmi } from "@/lib/utils/metaplex";
import { getMintNFTTxn } from "@/lib/utils/mintNFT";
import { publicKey } from "@metaplex-foundation/umi";

export async function GET(request: Request) {
  const url = new URL(request.url);

  const payload: ActionGetResponse = {
    title: "Create NFT",
    description: "Create a new NFT using Metaplex",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptNSAxMWgtNHY0aC0ydi00SDd2LTJoNFY3aDJ2NEgxN3YyeiIgZmlsbD0iY3VycmVudENvbG9yIi8+PC9zdmc+",
    label: "Create NFT",
    links: {
      actions: [
        {
          href: `${url.href}?nftName=Name&nftDesc=Description&imgUrl=ImgUrl`,
          label: "Create",
          type: "transaction",
          parameters: [
            {
              name: "Name",
              label: "Enter the name of your nft",
            },
            {
              name: "Description",
              label: "Enter the description of your nft",
            },
            {
              name: "ImgUrl",
              label: "Paste the image url of your nft",
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
    const name = url.searchParams.get("nftName");
    const description = url.searchParams.get("nftDesc");
    const image = url.searchParams.get("imgUrl");
    const body: ActionPostRequest = await request.json();
    // const { name, description, image, attributes, symbol } = body.inputs || {};

    if (!name || !description || !image) {
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

    let creator;
    try {
      creator = publicKey(body.account);
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

    const uploadAndMint = async () => {
      const metadataUri = await uploadToPinata({
        name,
        description,
        imageUri: image,
      });
      const umi = initializeUmi(creator);

      const mintTxn = await getMintNFTTxn(umi, metadataUri, creator, name);
      return mintTxn;
    };

    const mintTxn = await uploadAndMint();

    // Prepare message for signing
    const payload: ActionPostResponse = {
      transaction: mintTxn,
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
