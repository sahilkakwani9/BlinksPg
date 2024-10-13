"use client";
import BuyTokenModal from "@/components/modals/BuyTokenModal";
import SellTokenModal from "@/components/modals/SellTokenModal";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/use-toast";
import React from "react";

function Page() {
  const { toast } = useToast();

  return (
    <main className="min-h-screen w-full flex flex-col justify-center items-center">
      <CardSpotlight className="w-[380px] p-6 bg-gray-600 border-gray-600">
        <div className="relative z-20">
          <h2 className="text-2xl font-bold text-white mb-2">
            Create your blink
          </h2>
          <p className="text-neutral-200 mb-6">
            Create your limit order blink with single click
          </p>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name" className="mb-1 text-sm text-neutral-200">
                  You&apos;re Selling
                </Label>
                <SellTokenModal />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label
                  htmlFor="framework"
                  className="mb-1 text-sm text-neutral-200"
                >
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
                `https://${window.location.hostname}/tipme?amount=0.1&address=He7qYfzFh8ve5szBUGGcHc9fU25g9p45NVa29ezHLBjy`
              );
              toast({
                title: "Link copied",
              });
            }}
          >
            Copy Link
          </Button>
        </div>
      </CardSpotlight>
    </main>
  );
}

export default Page;
