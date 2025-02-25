"use client";
import BuyTokenModal from "@/components/modals/BuyTokenModal";
import SellTokenModal from "@/components/modals/SellTokenModal";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/use-toast";
import useTokenStore from "@/lib/store/store";
import getJupTokens from "@/lib/utils/getJupTokens";
import React, { useEffect } from "react";

function Page() {
  const { setTokens, sellToken, buyToken } = useTokenStore();
  const { toast } = useToast();

  async function storeTokens() {
    try {
      const data = await getJupTokens();
      setTokens(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    storeTokens();
  }, []);

  return (
    <main className="min-h-screen w-full flex flex-col justify-center items-center">
      <div className="w-[380px] p-6 bg-gray-200 border-gray-300 rounded-lg">
        <div className="relative z-20">
          <h2 className="text-2xl font-bold text-black mb-2">
            Create your blink
          </h2>
          <p className="text-black mb-6">
            Create your limit order blink with single click
          </p>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name" className="mb-1 text-sm text-black">
                  You&apos;re Selling
                </Label>
                <SellTokenModal />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework" className="mb-1 text-sm text-black">
                  You&apos;re Buying
                </Label>
                <BuyTokenModal />
              </div>
            </div>
          </form>
          <Button
            className="w-full rounded-3xl h-11 text-md mt-6 bg-blue-600"
            onClick={() => {
              navigator.clipboard.writeText(
                `https://${window.location.hostname}/api/create?sell=${sellToken?.address}&buy=${buyToken?.address}`
              );
              toast({
                title: "Link copied",
              });
            }}
          >
            Copy Link
          </Button>
        </div>
      </div>
    </main>
  );
}

export default Page;
