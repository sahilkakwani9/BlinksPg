import axios, { AxiosResponse } from "axios";
import { Connection, Transaction } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";

interface NFTListType {
  mint: string;
  owner: string;
  price: number;
  makerBroker?: string;
  payer?: string;
  feePayer?: string;
  rentPayer?: string;
  currency?: string;
  expireIn?: number;
  privateTaker?: string;
  delegateSigner?: boolean;
  compute?: number;
  priorityMicroLamports?: number;
}

interface getNFTListType {
  txs: Array<{
    tx: {
      type: string;
      data: Uint8Array;
    };
    txV0: {
      type: string;
      data: Uint8Array;
    };
    lastValidBlockHeight: number | null;
    metadata: object | null;
  }>;
  totalCost: number | null;
}

export async function NFTList({
  mint,
  owner,
  price,
  makerBroker,
  payer,
  feePayer,
  rentPayer,
  currency,
  expireIn,
  privateTaker,
  delegateSigner,
  compute,
  priorityMicroLamports,
}: NFTListType): Promise<Transaction> {
  const connection = new Connection(
    process.env.NEXT_PUBLIC_HELIUS_RPC_URL!,
    "confirmed"
  );

  try {
    // Get the latest blockhash
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    // Construct parameters
    const params = new URLSearchParams({
      mint,
      owner,
      price: price.toString(),
      blockhash,
      ...(makerBroker && { makerBroker }),
      ...(payer && { payer }),
      ...(feePayer && { feePayer }),
      ...(rentPayer && { rentPayer }),
      ...(currency && { currency }),
      ...(expireIn && { expireIn: expireIn.toString() }),
      ...(privateTaker && { privateTaker }),
      ...(delegateSigner !== undefined && {
        delegateSigner: delegateSigner.toString(),
      }),
      ...(compute && { compute: compute.toString() }),
      ...(priorityMicroLamports && {
        priorityMicroLamports: priorityMicroLamports.toString(),
      }),
    });

    // Make request to our API endpoint
    const response: AxiosResponse<getNFTListType> = await axios.get(
      `https://blinks-studio.vercel.app/api/nft/list?${params.toString()}`
    );

    if (!response.data?.txs?.length) {
      throw new Error("No transactions returned from API");
    }

    // Get the first transaction
    const txData = response.data.txs[0].tx.data;

    // Convert transaction data to Buffer and create Transaction object
    const transactionBuffer = Buffer.from(txData);
    const transaction = Transaction.from(transactionBuffer);

    // Set recent blockhash
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;

    return transaction;
  } catch (error: any) {
    console.error("NFT Listing Error:", error);
    throw new Error(
      error.response?.data?.error || error.message || "Failed to create listing"
    );
  }
}
