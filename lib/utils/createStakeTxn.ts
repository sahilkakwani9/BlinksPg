import {
  Connection,
  PublicKey,
  StakeProgram,
  Keypair,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

async function createStakeTransaction(
  connection: Connection,
  userPublicKey: string,
  validatorVoteAccount: string,
  amountInSOL: number
): Promise<string> {
  try {
    console.log("got the call here");

    const stakeAccount = Keypair.generate();
    console.log("stake account", stakeAccount);

    const minimumRent = await connection.getMinimumBalanceForRentExemption(
      StakeProgram.space
    );
    const amountInLamports = amountInSOL * LAMPORTS_PER_SOL;
    const userPubKey = new PublicKey(userPublicKey);

    const createStakeAccountTx = StakeProgram.createAccount({
      fromPubkey: userPubKey,
      stakePubkey: stakeAccount.publicKey,
      authorized: {
        staker: userPubKey,
        withdrawer: userPubKey,
      },
      lamports: amountInLamports + minimumRent,
    });

    console.log("here", createStakeAccountTx);

    const delegateTx = StakeProgram.delegate({
      stakePubkey: stakeAccount.publicKey,
      authorizedPubkey: userPubKey,
      votePubkey: new PublicKey(validatorVoteAccount),
    });

    console.log("here delegate", delegateTx);

    const transaction = new Transaction()
      .add(createStakeAccountTx)
      .add(delegateTx);

    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    transaction.feePayer = userPubKey;

    // Sign with stake account only
    transaction.partialSign(stakeAccount);

    return transaction
      .serialize({ requireAllSignatures: false })
      .toString("base64");
  } catch (error) {
    console.log("error creating stake txn", error);
  }
}

export default createStakeTransaction;
