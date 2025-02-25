import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import {
  generateSigner,
  PublicKey,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { clusterApiUrl } from "@solana/web3.js";

export const initializeUmi = (publicKey: PublicKey) => {
  // Create Umi instance
  const umi = createUmi(clusterApiUrl("mainnet-beta")); // Use "mainnet" for production
  const signer = generateSigner(umi);
  // Register Wallet Adapter to Umi
  umi.use(
    signerIdentity({
      publicKey,
      signAllTransactions: async (tx) => {
        return tx;
      },
      signMessage: async (msg) => {
        return Buffer.from("");
      },
      signTransaction: async (txn) => {
        return txn;
      },
    })
  );

  // Add plugins
  umi.use(mplTokenMetadata());

  return umi;
};
