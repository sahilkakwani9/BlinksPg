import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/ui/Header";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import SolanaProvider from "@/components/SolanaProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blink Studio - No-Code Solana Actions Builder",
  description:
    "Create and deploy Solana Actions (blinks) with our intuitive drag-and-drop interface. Build DeFi integrations, token swaps, and more without coding knowledge.",
  authors: [
    {
      url: "https://github.com/sahilkakwani9",
      name: "Sahil Kakwani",
    },
    {
      url: "https://devvivek.tech",
      name: "Vivek Suthar",
    },
  ],
  openGraph: {
    images: process.env.NEXT_PUBLIC_APP_URL + "/og.png",
    description:
      "Build and deploy Solana Actions without code. Create token swaps, tips, fundraising, and more using our drag-and-drop interface.",
    title: "Blink Studio - Visual Solana Actions Builder",
    type: "website",
    siteName: "Blink Studio",
  },
  keywords: [
    "solana",
    "no-code platform",
    "blinks",
    "solana actions",
    "drag and drop",
    "defi integration",
    "jupiter swap",
    "token creation",
    "blockchain development",
    "visual editor",
    "web3 tools",
    "solana development",
    "dapp builder",
    "blockchain automation",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      follow: true,
      index: true,
    },
  },
  twitter: {
    title: "Blink Studio - Build Solana Actions Visually",
    description:
      "Create powerful Solana Actions without code. Drag-and-drop interface for building token swaps, tips, fundraising features, and more.",
    images: [process.env.NEXT_PUBLIC_APP_URL + "/og.png"],
    card: "summary_large_image",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gray-50 font-inter `}>
        <SolanaProvider>
          <Header />
          {children}
          <Toaster />
        </SolanaProvider>
      </body>
    </html>
  );
}
