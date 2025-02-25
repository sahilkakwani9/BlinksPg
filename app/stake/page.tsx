"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import usePools from "@/lib/hooks/usePools";

const MeteoraPools: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query
  const { pools, filteredPools, loading, error, filterPools } = usePools(); // Use custom hook
  const router = useRouter();

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    filterPools(query); // Use the filter function from the hook
  };

  const handlePoolClick = (pool: any) => {
    router.push(`/stake/${pool.pool_address}`);
  };

  const formatNumber = (num: number | string) => {
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(
      Number(num)
    );
  };

  return (
    <main className="min-h-screen w-full flex justify-center items-center bg-gray-100">
      <div className="w-[380px] p-6 bg-gray-200 border border-gray-300 rounded-lg shadow-lg mt-16">
        <div className="relative z-20">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Meteora Liquidity Pools
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Browse and manage liquidity pools with ease.
          </p>
          {/* Search bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search pools..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="text-black w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {loading ? (
            <p className="text-blue-500 text-center">Loading...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p> // Display error if any
          ) : (
            <div className="overflow-y-auto h-[400px]">
              {filteredPools.length > 0 ? (
                <ul className="space-y-4">
                  {filteredPools.map((pool) => (
                    <motion.li
                      key={pool.pool_address}
                      onClick={() => handlePoolClick(pool)}
                      className="cursor-pointer p-4 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-300 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="text-lg font-bold text-gray-800">
                        {pool.pool_name}
                      </p>
                      <p className="text-gray-600">
                        TVL: ${formatNumber(pool.pool_tvl)}
                      </p>
                      <p className="text-gray-600">
                        Farming APY: {pool.farming_apy}%
                      </p>
                      <p className="text-gray-600">
                        Trade APY: {pool.trade_apy}%
                      </p>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center">No pools found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default MeteoraPools;
