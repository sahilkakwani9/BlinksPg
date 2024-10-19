"use client";
import '@dialectlabs/blinks/index.css';
import { Blink } from "@dialectlabs/blinks";
import { useAction, } from '@dialectlabs/blinks';
import { useActionSolanaWalletAdapter } from '@dialectlabs/blinks/hooks/solana';
import {
  clusterApiUrl,
} from "@solana/web3.js";

type BlinkPreviewProps = {
  url: string;
}
const BlinkPreview = ({ url }: BlinkPreviewProps) => {

  const { adapter } = useActionSolanaWalletAdapter(clusterApiUrl("mainnet-beta"));
  const { action, isLoading } = useAction({
    url: url ?? 'solana-action:https://dial.to/api/donate',
    adapter,
  });
  console.log(action)
  return action ? <Blink stylePreset="x-light" action={action} websiteText={action.url} /> : null;
}

export default BlinkPreview
