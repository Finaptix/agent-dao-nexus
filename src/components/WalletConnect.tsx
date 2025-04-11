
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, Info } from 'lucide-react';
import { toast } from 'sonner';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletConnectProps {
  onConnect: (address: string, provider: ethers.providers.Web3Provider) => void;
  onDisconnect: () => void;
  connected: boolean;
  address: string | null;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ 
  onConnect, 
  onDisconnect, 
  connected, 
  address 
}) => {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState<boolean>(false);
  
  useEffect(() => {
    const checkMetaMask = async () => {
      setIsMetaMaskInstalled(!!window.ethereum);
    };
    
    checkMetaMask();
  }, []);
  
  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('MetaMask not detected', {
        description: 'Please install MetaMask to connect your wallet',
        action: {
          label: 'Install',
          onClick: () => window.open('https://metamask.io/download.html', '_blank')
        }
      });
      return;
    }
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      
      // Check if connected to the correct network (Minato Testnet)
      const network = await provider.getNetwork();
      if (network.chainId !== 1946) {
        const switched = await switchToMinatoNetwork();
        if (!switched) return;
      }
      
      onConnect(address, provider);
      toast.success('Wallet Connected', {
        description: `Connected to ${shortenAddress(address)}`
      });
    } catch (error: any) {
      toast.error('Connection Failed', {
        description: error.message || 'Failed to connect wallet'
      });
    }
  };
  
  const switchToMinatoNetwork = async (): Promise<boolean> => {
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
        } catch (addError: any) {
          toast.error('Network Configuration Failed', {
            description: addError.message || 'Failed to add Minato network to MetaMask'
          });
          return false;
        }
      } else {
        toast.error('Network Switch Failed', {
          description: switchError.message || 'Failed to switch to Minato network'
        });
        return false;
      }
    }
  };
  
  const disconnectWallet = () => {
    onDisconnect();
    toast.info('Wallet Disconnected');
  };
  
  const shortenAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  if (!isMetaMaskInstalled) {
    return (
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => window.open('https://metamask.io/download.html', '_blank')}
      >
        <Wallet size={16} />
        <span>Install MetaMask</span>
      </Button>
    );
  }
  
  if (connected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="rounded-md border border-sidebar-border bg-sidebar-accent/30 px-3 py-1 text-sm">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-inject-green"></span>
          {shortenAddress(address)}
        </div>
        <Button variant="ghost" size="sm" onClick={disconnectWallet}>
          Disconnect
        </Button>
      </div>
    );
  }
  
  return (
    <Button
      variant="outline"
      className="gap-2"
      onClick={connectWallet}
    >
      <Wallet size={16} />
      <span>Connect Wallet</span>
    </Button>
  );
};

export default WalletConnect;
