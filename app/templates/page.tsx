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
          posterUri="/images/covers/Swap.webp"
          navigateTo="/jup-swap"
        />
        <TemplateCard
          title="Send me TIP"
          desc="Build a blink that sends TIP(USDC) to any adddress"
          posterUri="/images/covers/Tip.webp"
          navigateTo="/tip"
        />
        <TemplateCard
          title="Create Polls"
          desc="Build a blink that lets users interact with a poll"
          posterUri="/images/covers/Poll.webp"
          navigateTo="/poll"
        />
        <TemplateCard
          title="Create NFT through Metaplex"
          desc="Build a blink that lets users create NFTs through Metaplex"
          posterUri="/images/covers/NFT-Bid.webp"
          navigateTo="/nft"
        />
        <TemplateCard
          title="List NFT's through Tensor"
          desc="Build a blink that lets users list their NFT on Tensor"
          posterUri="/images/covers/List.webp"
          navigateTo="/list"
        />
        <TemplateCard
          title="Sell NFT's on Tensor"
          desc="Build a blink that lets users sell their NFT's on Tensor"
          posterUri="/images/covers/Sell.webp"
          navigateTo="/sell"
        />
        <TemplateCard
          title="Stake in Meteora Pools"
          desc="Stake your Money in Meteora Liquidity Pools"
          posterUri="/images/covers/Meteora.webp"
          navigateTo="/stake"
        />
        <TemplateCard
          title="Stake your Sol"
          desc="Stake your Sol through Native Staking"
          posterUri="/images/covers/Stake.webp"
          navigateTo="/validator"
        />
      </div>
    </BlurFade>
  );
}

export default page;
