"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { toast } from "@/lib/hooks/use-toast";
import { getValidators, Validator } from "@/lib/utils/getValidators";

// page.tsx

const ITEMS_PER_PAGE = 10;

const ValidatorsList: React.FC = () => {
  const [validators, setValidators] = useState<Validator[]>([]);
  const [selectedValidator, setSelectedValidator] = useState<Validator | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getValidators();
        setValidators(Array.isArray(data) ? data.reverse() : [data]);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleValidatorClick = (validator: Validator) => {
    setSelectedValidator(validator);
  };

  const handleCopyLink = () => {
    const link = selectedValidator
      ? `${window.location.origin}/api/validators/?account=${selectedValidator.account}`
      : `${window.location.origin}/api/validators`;

    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast({
          title: "Link copied",
          description: `You can now share the link: ${link}`,
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Failed to copy the link.",
        });
      });
  };

  const filteredValidators = validators.filter((validator) =>
    validator?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredValidators.length / ITEMS_PER_PAGE);
  const paginatedValidators = filteredValidators.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <main className="min-h-screen w-full pt-24 pb-8 px-4">
      <div className="max-w-[380px] mx-auto p-6 bg-gray-200 border border-gray-300 rounded-lg shadow-lg">
        <div className="relative z-20">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Validators List
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Browse and select validators with ease.
          </p>

          {!loading && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search validators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-black w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {loading ? (
            <p className="text-blue-500 text-center">Loading validators...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <div className="overflow-y-auto h-[400px]">
              {paginatedValidators.length > 0 ? (
                <ul className="space-y-4">
                  {paginatedValidators.map((validator) => (
                    <motion.li
                      key={validator.account}
                      onClick={() => handleValidatorClick(validator)}
                      className={`cursor-pointer p-4 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-300 transition-colors ${
                        selectedValidator?.account === validator.account
                          ? "border-blue-500 bg-blue-100 shadow-md"
                          : ""
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center space-x-4">
                        <Image
                          src={validator.avatar_url || "/default-avatar.png"}
                          alt={validator.name}
                          width={50}
                          height={50}
                          className="rounded-full"
                        />
                        <div>
                          <p className="text-lg font-bold text-gray-800">
                            {validator.name}
                          </p>
                          <p className="text-gray-600">
                            Commission: {validator.commission}%
                          </p>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center">
                  No validators found.
                </p>
              )}
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 px-4 rounded-lg text-white ${
                  currentPage === 1
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                Prev
              </button>
              <span className="text-gray-800 font-semibold">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`p-2 px-4 rounded-lg text-white ${
                  currentPage === totalPages
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                Next
              </button>
            </div>
          )}

          {!loading && selectedValidator && (
            <div className="mt-4 p-3 text-center bg-blue-50 border border-blue-300 rounded-lg">
              <p className="text-gray-800 font-semibold">
                Selected Validator: {selectedValidator.name}
              </p>
            </div>
          )}

          {!loading && (
            <button
              onClick={handleCopyLink}
              className="w-full p-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors mt-4"
            >
              Copy Link
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default ValidatorsList;
