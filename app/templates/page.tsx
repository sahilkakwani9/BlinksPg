import { TemplateCard } from "@/components/TemplateCard";
import BlurFade from "@/components/ui/blur-fade";
import React from "react";

function page() {
  return (
    <BlurFade delay={0.25} inView>
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
        <TemplateCard
          title="Create Polls"
          desc="Build a blink that lets users interact with a poll"
          posterUri="/images/covers/Poll.png"
          navigateTo="/poll"
        />
      </div>
    </BlurFade>
  );
}

export default page;
