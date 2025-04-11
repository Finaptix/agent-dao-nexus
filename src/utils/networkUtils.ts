
import { ethers } from 'ethers';

export const MINATO_CHAIN_ID = 1946;

export const isManatoNetwork = async (provider: ethers.providers.Web3Provider): Promise<boolean> => {
  try {
    const network = await provider.getNetwork();
    return network.chainId === MINATO_CHAIN_ID;
  } catch (error) {
    console.error("Error checking network:", error);
    return false;
  }
};

export const switchToMinatoNetwork = async (): Promise<boolean> => {
  if (!window.ethereum) return false;
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x79A' }], // 1946 in hex
    });
    return true;
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x79A', // 1946 in hex
              chainName: 'Minato Testnet',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://rpc.minato.soneium.org/'],
              blockExplorerUrls: ['https://explorer-testnet.soneium.org/'],
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error("Failed to add network:", addError);
        return false;
      }
    }
    console.error("Failed to switch network:", switchError);
    return false;
  }
};

export const getEtherscanLink = (txHash: string): string => {
  return `https://explorer-testnet.soneium.org/tx/${txHash}`;
};

export const getAddressLink = (address: string): string => {
  return `https://explorer-testnet.soneium.org/address/${address}`;
};

export const formatAddress = (address: string, startLength: number = 6, endLength: number = 4): string => {
  if (!address) return '';
  return `${address.substring(0, startLength)}...${address.substring(address.length - endLength)}`;
};
