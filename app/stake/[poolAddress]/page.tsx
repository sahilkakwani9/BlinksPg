"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { toast } from "@/lib/hooks/use-toast";
import useMeteora from "@/lib/hooks/useMeteora";
import { BN } from "bn.js";
import debounce from "lodash/debounce";

const PoolDetailsPage: React.FC = () => {
  const params = useParams();
  const pooladdress = params?.poolAddress;
  const { fetchQoute } = useMeteora(pooladdress as string);
  const [poolDetails, setPoolDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [amount1, setAmount1] = useState<number>(0);
  const [amount2, setAmount2] = useState<number>(0);
  const [quote, setQuote] = useState<any>(null);

  // Fetch pool details
  useEffect(() => {
    const fetchPoolDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://amm-v2.meteora.ag/farms");
        const pools = await response.json();

        const selectedPool = pools.find(
          (pool: any) => pool.pool_address === pooladdress
        );
        console.log(selectedPool);

        setPoolDetails(selectedPool);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pool details:", error);
        setLoading(false);
      }
    };

    fetchPoolDetails();
  }, [pooladdress]);

  // Separate fetch functions for token1 and token2
  const fetchToken1Quote = useCallback(
    async (amount: number) => {
      try {
        const amountBN = new BN(Number(amount) * 1000000);
        const quoteData = await fetchQoute(amountBN, false);
        setAmount2(quoteData?.tokenBInAmount.toNumber()! / 1000000);
        setQuote(quoteData);
      } catch (error) {
        console.error("Error fetching quote for token1:", error);
      }
    },
    [fetchQoute]
  );

  const fetchToken2Quote = useCallback(
    async (amount: number) => {
      try {
        const amountBN = new BN(Number(amount) * 1000000);
        const quoteData = await fetchQoute(amountBN, true);
        setAmount1(quoteData?.tokenAInAmount.toNumber()! / 1000000);
        setQuote(quoteData);
      } catch (error) {
        console.error("Error fetching quote for token2:", error);
      }
    },
    [fetchQoute]
  );

  // Debounced quote fetching
  const debouncedFetchToken1Quote = useCallback(
    debounce(fetchToken1Quote, 500),
    [fetchToken1Quote]
  );

  const debouncedFetchToken2Quote = useCallback(
    debounce(fetchToken2Quote, 500),
    [fetchToken2Quote]
  );

  const handleToken1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setAmount1(value);
    if (value) {
      debouncedFetchToken1Quote(value);
    } else {
      setAmount2(0);
      setQuote(null);
    }
  };

  const handleToken2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setAmount2(value);
    if (value) {
      debouncedFetchToken2Quote(value);
    } else {
      setAmount1(0);
      setQuote(null);
    }
  };

  const handleCopyLink = () => {
    if (amount1 <= 0 || amount2 <= 0) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Please enter valid amounts for both inputs.",
      });
      return;
    }

    const link = `${window.location.origin}/api/meteora?poolAddress=${pooladdress}&amount1=${amount1}&amount2=${amount2}&tokenMint1=${poolDetails.pool_token_mints[0]}&tokenMint2=${poolDetails.pool_token_mints[1]}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast({
          title: "Link copied",
          description: `You can now share the link: ${link}`,
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Failed to copy the link.",
        });
      });
  };

  return (
    <main className="min-h-screen w-full flex justify-center items-center bg-gray-100">
      <div className="w-[380px] p-6 bg-gray-200 border border-gray-300 rounded-lg shadow-lg mt-16">
        {loading ? (
          <p className="text-blue-500 text-center">Loading pool details...</p>
        ) : poolDetails ? (
          <div className="relative z-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              {poolDetails.pool_name}
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Manage your funds for this pool.
            </p>
            <div className="mb-4">
              <p className="text-gray-800 font-semibold">Pool Details:</p>
              <ul className="text-gray-600 mb-6 space-y-1">
                <li>TVL: ${poolDetails.pool_tvl}</li>
                <li>Farming APY: {poolDetails.farming_apy}%</li>
                <li>Trade APY: {poolDetails.trade_apy}%</li>
              </ul>
            </div>
            {/* Input Boxes */}
            <div className="mb-4">
              <label className="block text-gray-800 font-medium mb-1">
                {`Amount in ${poolDetails.pool_name.split("-")[0]}`}
              </label>
              <input
                type="number"
                value={amount1}
                onChange={handleToken1Change}
                placeholder="Enter amount"
                className="text-black w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-800 font-medium mb-1">
                {`Amount in ${poolDetails.pool_name.split("-")[1]}`}
              </label>
              <input
                type="number"
                value={amount2}
                onChange={handleToken2Change}
                placeholder="Enter amount"
                className="text-black w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <button
              onClick={handleCopyLink}
              className="w-full p-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              Copy Link
            </button>
          </div>
        ) : (
          <p className="text-gray-500 text-center">Pool not found.</p>
        )}
      </div>
    </main>
  );
};

export default PoolDetailsPage;
