interface JupTokens {
  address: string;
  chainId: number;
  decimals: number;
  name: string;
  symbol: string;
  logoURI: string;
  extensions: Extensions;
  tags: string[];
}

interface Extensions {
  coingeckoId: string;
}
