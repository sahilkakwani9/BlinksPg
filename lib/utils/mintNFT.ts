import {
  generateSigner,
  percentAmount,
  PublicKey,
  Signer,
  Transaction,
  TransactionBuilder,
  Umi,
} from "@metaplex-foundation/umi";
import { createNft } from "@metaplex-foundation/mpl-token-metadata";
import {
  Transaction as Web3Transaction,
  VersionedMessage,
  VersionedTransaction,
} from "@solana/web3.js";

export const mintNFT = async (umi: any, metadataUri: string) => {
  // Generate a new mint address
  const mint = generateSigner(umi);

  // Mint the NFT
  const { signature } = await createNft(umi, {
    mint,
    name: "My NFT",
    uri: metadataUri,
    sellerFeeBasisPoints: percentAmount(0), // 0% royalty
  }).sendAndConfirm(umi);

  console.log("NFT minted:", signature);
  return mint.publicKey;
};

export const getMintNFTTxn = async (
  umi: Umi,
  metadataUri: string,
  payer: PublicKey,
  name: string
) => {
  // Generate a new mint address
  const mint = generateSigner(umi);

  const Ixs = createNft(umi, {
    mint,
    name,
    uri: metadataUri,
    sellerFeeBasisPoints: percentAmount(0), // 0% royalty
  }).getInstructions();

  const transaction = umi.transactions.create({
    version: 0,
    blockhash: (await umi.rpc.getLatestBlockhash()).blockhash,
    instructions: Ixs,
    payer: payer,
  });

  console.log(transaction.signatures, "signatures");

  const mySerializedTransaction = umi.transactions.serializeMessage(
    transaction.message
  );

  const base64Serialized = Buffer.from(mySerializedTransaction).toString(
    "base64"
  );

  return base64Serialized;
};
