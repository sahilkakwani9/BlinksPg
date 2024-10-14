"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/use-toast";
import React, { useState } from "react";

function Page() {
  const { toast } = useToast();
  const [amount, setAmount] = useState("0.1");
  const [address, setAddress] = useState("");

  const handleCopyLink = () => {

    if (!address) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Please enter a valid Solana address.",
      });
      return;
    }

    const tipAmount = parseFloat(amount) > 0 ? amount : "0.1";
    const tipLink = `http://localhost:3000/tipme?amount=${tipAmount}&address=${address}`;

    navigator.clipboard.writeText(tipLink);

    toast({
      title: "Link copied",
      description: `Tip link with ${tipAmount} SOL for address ${address} has been copied.`,
    });
  };

  return (
    <main className="min-h-screen w-full flex flex-col justify-center items-center">
      <div className="w-[380px] p-6 bg-gray-600 border-gray-600 rounded-md">
        <h2 className="text-2xl font-bold text-white mb-2">
          Receive Tips at your Address
        </h2>
        <p className="text-neutral-200 mb-6">
          Generate your unique tip Blink with a custom amount and your address
        </p>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="amount" className="mb-1 text-sm text-neutral-200">
                Amount (SOL)
              </Label>
              <input
                type="number"
                min="0.1"
                step="0.01"
                id="amount"
                className="p-2 border rounded-md text-black"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount (min 0.1)"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="address" className="mb-1 text-sm text-neutral-200">
                Solana Address
              </Label>
              <input
                type="text"
                id="address"
                className="p-2 border rounded-md text-black"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your Solana address"
              />
            </div>
          </div>
        </form>
        <Button
          className="w-full rounded-3xl h-11 text-md mt-6 bg-blue-600"
          onClick={handleCopyLink}
        >
          Copy Link
        </Button>
      </div>
    </main>
  );
}

export default Page;
