
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, Info } from 'lucide-react';
import { toast } from 'sonner';
import { ethers } from 'ethers';
import { useAppContext } from '@/contexts/AppContext';

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
  const { isCorrectNetwork, checkAndSwitchNetwork } = useAppContext();
  
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
        const switched = await checkAndSwitchNetwork();
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
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <div className="rounded-md border border-sidebar-border bg-sidebar-accent/30 px-3 py-1 text-sm">
            <span className={`mr-2 inline-block h-2 w-2 rounded-full ${isCorrectNetwork ? 'bg-inject-green' : 'bg-orange-500'}`}></span>
            {shortenAddress(address)}
          </div>
          <Button variant="ghost" size="sm" onClick={disconnectWallet}>
            Disconnect
          </Button>
        </div>
        {!isCorrectNetwork && (
          <p className="text-xs text-orange-500">
            Wrong network. Switch to Minato Testnet
          </p>
        )}
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
