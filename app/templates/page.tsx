import { TemplateCard } from "@/components/TemplateCard";
import React from "react";

function page() {
  return (
    <div className="p-16 flex justify-start gap-8">
      <TemplateCard
        title="Swap Tokens"
        desc="Build a blink that swaps a specific token to another token using
          Jupiter"
        posterUri="/images/covers/Swap.png"
        navigateTo="/jup-swap"
      />
      <TemplateCard
        title="Send me TIP"
        desc="Build a blink that sends TIP(USDC) to any adddress"
        posterUri="/images/covers/Tip.png"
         navigateTo="/tip"
      />
    </div>
  );
}

export default page;
