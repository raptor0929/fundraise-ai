import { Chain } from 'wagmi';

export function getChainByName(chains: any, chainName: string): Chain {
  const chain = chains[chainName];
  if (!chain) {
    throw new Error(`Chain ${chainName} not found`);
  }
  return chain;
}
