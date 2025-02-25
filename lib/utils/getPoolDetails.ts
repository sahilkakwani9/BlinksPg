export const getPoolDetails = async (poolAddress: string) => {
    try {
      // Fetch pool details from an API (or other source)
      const response = await fetch("https://amm-v2.meteora.ag/farms");
  
      if (!response.ok) {
        throw new Error("Failed to fetch pool details");
      }
  
      const pools = await response.json();
  
      // Find the pool based on the provided pool address
      const poolDetails = pools.find((pool: any) => pool.pool_address === poolAddress);
  
      if (!poolDetails) {
        return null; // If no matching pool is found
      }
  
      // Return the pool details object
      return {
        poolName: poolDetails.pool_name,
        poolTvl: poolDetails.pool_tvl,
        farmingApy: poolDetails.farming_apy,
        tradeApy: poolDetails.trade_apy,
        poolAddress: poolDetails.pool_address,
      };
    } catch (error) {
      console.error("Error fetching pool details:", error);
      return null; // Return null in case of error
    }
  };
  