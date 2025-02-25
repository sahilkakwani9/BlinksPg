import { AmmImpl } from "@mercurial-finance/dynamic-amm-sdk";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

export const fetchQoute = async (
  connection: any,
  amount: BN,
  poolAddress: string
) => {
  try {
    // Initialize the pool instance with the given connection and dynamic pool address
    const constantProductPool = await AmmImpl.create(
      connection,
      new PublicKey(poolAddress) // Use the dynamic pool address
    );

    // Create the deposit transaction using the pool instance
    const { poolTokenAmountOut, tokenAInAmount, tokenBInAmount } =
      constantProductPool!.getDepositQuote(amount, new BN(0), true, 1);

    return { poolTokenAmountOut, tokenAInAmount, tokenBInAmount };
  } catch (error) {
    console.log("Error creating deposit transaction:", error);
    throw error; // Throw the error if anything fails
  }
};

export const createDepositTransaction = async (
  connection: any,
  publicKey: PublicKey,
  tokenAInAmount: BN,
  tokenBInAmount: BN,
  poolTokenAmountOut: BN,
  poolAddress: string // Accept poolAddress as a dynamic parameter
) => {
  try {
    // Initialize the pool instance with the given connection and dynamic pool address
    const constantProductPool = await AmmImpl.create(
      connection,
      new PublicKey(poolAddress) // Use the dynamic pool address
    );

    // Create the deposit transaction using the pool instance
    const depositTx = await constantProductPool!.deposit(
      publicKey,
      tokenAInAmount,
      tokenBInAmount,
      poolTokenAmountOut
    );

    return depositTx; // Return the deposit transaction
  } catch (error) {
    console.log("Error creating deposit transaction:", error);
    throw error; // Throw the error if anything fails
  }
};
