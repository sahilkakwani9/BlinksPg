import { TemplateCard } from "@/components/TemplateCard";
import BlurFade from "@/components/ui/blur-fade";
import React from "react";

function page() {
  return (
    <BlurFade delay={0.25} inView>
      <div className="px-16 py-32 flex justify-start gap-8 flex-wrap items-center">
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
        <TemplateCard
          title="Create Polls"
          desc="Build a blink that lets users interact with a poll"
          posterUri="/images/covers/Poll.png"
          navigateTo="/poll"
        />
        <TemplateCard
          title="Create NFT Bids"
          desc="Build a blink that lets users bid your NFT"
          posterUri="/images/covers/NFT-Bid.png"
          navigateTo="/poll"
        />
      </div>
    </BlurFade>
  );
}

export default page;
