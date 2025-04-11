
import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Wallet, AlertTriangle, ArrowDownUp } from 'lucide-react';
import { toast } from 'sonner';
import { ethers } from 'ethers';

interface NetworkEnforcerProps {
  children: React.ReactNode;
}

const NetworkEnforcer: React.FC<NetworkEnforcerProps> = ({ children }) => {
  const { 
    walletConnected, 
    isCorrectNetwork, 
    connectWallet, 
    checkAndSwitchNetwork 
  } = useAppContext();
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState<boolean>(false);
  
  useEffect(() => {
    setIsMetaMaskInstalled(!!window.ethereum);
  }, []);
  
  const handleConnectWallet = async () => {
    if (!window.ethereum) {
      toast.error('MetaMask not detected', {
        description: 'Please install MetaMask to use this application',
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
        if (!switched) {
          toast.error('Incorrect Network', {
            description: 'This application requires connection to Minato Testnet'
          });
          return;
        }
      }
      
      connectWallet(address, provider);
    } catch (error: any) {
      toast.error('Connection Failed', {
        description: error.message || 'Failed to connect wallet'
      });
    }
  };
  
  const handleSwitchNetwork = async () => {
    const switched = await checkAndSwitchNetwork();
    if (switched) {
      toast.success('Connected to Minato Testnet', {
        description: 'Your wallet is now connected to the correct network'
      });
    }
  };
  
  if (!isMetaMaskInstalled) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background p-6">
        <div className="flex max-w-md flex-col items-center rounded-lg border border-sidebar-border bg-sidebar p-8 shadow-lg">
          <AlertTriangle className="mb-4 h-16 w-16 text-inject-cyan" />
          <h1 className="mb-2 text-2xl font-bold">MetaMask Required</h1>
          <p className="mb-6 text-center text-muted-foreground">
            This application requires MetaMask to interact with the Minato blockchain network.
          </p>
          <Button 
            className="gap-2"
            onClick={() => window.open('https://metamask.io/download.html', '_blank')}
          >
            <Wallet size={16} />
            <span>Install MetaMask</span>
          </Button>
        </div>
      </div>
    );
  }
  
  if (!walletConnected) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background p-6">
        <div className="flex max-w-md flex-col items-center rounded-lg border border-sidebar-border bg-sidebar p-8 shadow-lg">
          <Wallet className="mb-4 h-16 w-16 text-inject-cyan" />
          <h1 className="mb-2 text-2xl font-bold">Connect Your Wallet</h1>
          <p className="mb-6 text-center text-muted-foreground">
            Please connect your MetaMask wallet to access the Inject AI governance platform.
          </p>
          <Button 
            className="gap-2" 
            onClick={handleConnectWallet}
          >
            <Wallet size={16} />
            <span>Connect MetaMask</span>
          </Button>
        </div>
      </div>
    );
  }
  
  if (!isCorrectNetwork) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background p-6">
        <div className="flex max-w-md flex-col items-center rounded-lg border border-sidebar-border bg-sidebar p-8 shadow-lg">
          <AlertTriangle className="mb-4 h-16 w-16 text-yellow-500" />
          <h1 className="mb-2 text-2xl font-bold">Wrong Network</h1>
          <p className="mb-6 text-center text-muted-foreground">
            Please switch to the Minato Testnet (Chain ID: 1946) to use this application.
          </p>
          <Button 
            className="gap-2" 
            onClick={handleSwitchNetwork}
          >
            <ArrowDownUp size={16} />
            <span>Switch to Minato Testnet</span>
          </Button>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default NetworkEnforcer;
