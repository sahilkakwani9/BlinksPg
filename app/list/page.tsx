"use client";
import { toast } from "@/lib/hooks/use-toast";
import React, { useState } from "react";

export default function ListNFTPage() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const link = `${window.location.origin}/api/nft/listBlink`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopied(true);
        toast({
          title: "Link copied to clipboard!",
          description: `You can now share the link: ${link}`,
        });
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Failed to copy the link",
        });
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full border border-gray-100 hover:shadow-xl transition-shadow duration-300 hover:scale-[1.02] transition-transform">
        <div className="text-center mb-8">
          <div className="mb-6 flex justify-center">
            <div className="p-4 bg-blue-100 rounded-2xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <path d="M12 8v8M8 12h8" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
            List Your NFT
          </h1>
          <p className="text-gray-500 text-md font-medium">
            Create your listing through Tensor
          </p>
        </div>

        <button
          onClick={handleCopyLink}
          className={`w-full py-4 flex items-center justify-center gap-3 font-semibold rounded-xl transition-all duration-300 ${
            copied
              ? "bg-green-500 hover:bg-green-600 text-white shadow-lg"
              : "bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white hover:shadow-xl"
          }`}
        >
          {copied ? (
            <>
              <svg
                className="animate-check"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 6L9 17L4 12" />
              </svg>
              Link Copied!
            </>
          ) : (
            <>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="mr-1"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Generate Share Link
            </>
          )}
        </button>
      </div>
    </div>
  );
}
