type createOrderParams = {
  owner: string;
  inputMint: string;
  outputMint: string;
  amount: string;
};

export default async function createSwapOrder(params: createOrderParams) {
  try {
    console.log(params, "params");

    const quoteResponse = await (
      await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${params.inputMint}&outputMint=${params.outputMint}&amount=${params.amount}&slippageBps=100`
      )
    ).json();

    // get serialized transactions for the swap
    const { swapTransaction } = await (
      await fetch("https://quote-api.jup.ag/v6/swap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // quoteResponse from /quote api
          quoteResponse,
          // user public key to be used for the swap
          userPublicKey: params.owner,
          // auto wrap and unwrap SOL. default is true
          wrapAndUnwrapSol: true,
          // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
          // feeAccount: "fee_account_public_key"
        }),
      })
    ).json();

    return swapTransaction;
  } catch (error) {
    console.log("error creating swap order", error);
  }
}
