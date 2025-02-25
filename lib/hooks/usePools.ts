import { useState, useEffect } from "react";
import axios from "axios";

// Custom hook to fetch pool details
const usePools = () => {
  const [pools, setPools] = useState<any[]>([]);
  const [filteredPools, setFilteredPools] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchPools = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error on each fetch attempt
        const response = await axios.get("https://amm-v2.meteora.ag/farms");
        setPools(response.data);
        setFilteredPools(response.data); // Initially set filtered pools to all pools
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pools:", error);
        setLoading(false);
        setError("Failed to fetch pools. Please try again later.");
      }
    };

    fetchPools();
  }, []); // Empty dependency array ensures the fetch is done only once on mount

  // Function to filter pools based on the search query
  const filterPools = (query: string) => {
    const filtered = pools.filter((pool) =>
      pool.pool_name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPools(filtered);
  };

  return {
    pools,
    filteredPools,
    loading,
    error,
    filterPools,
  };
};

export default usePools;
