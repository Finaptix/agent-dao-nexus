
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAppContext } from '@/contexts/AppContext';
import AIAgentTest from '@/components/AIAgentTest';

const Settings = () => {
  const { 
    walletConnected, 
    walletAddress, 
    isCorrectNetwork, 
    setDAOContractAddress, 
    checkAndSwitchNetwork
  } = useAppContext();
  const [contractAddress, setContractAddress] = useState<string>('');
  
  useEffect(() => {
    // Load saved contract address from localStorage
    const savedAddress = localStorage.getItem('daoContractAddress');
    if (savedAddress) {
      setContractAddress(savedAddress);
    }
  }, []);
  
  const saveSettings = () => {
    toast.success('Settings saved', {
      description: 'Your settings have been successfully saved',
    });
  };

  const saveContractAddress = async () => {
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
      toast.error('Invalid contract address', {
        description: 'Please enter a valid Ethereum contract address'
      });
      return;
    }
    
    if (!walletConnected) {
      toast.error('Wallet not connected', {
        description: 'Please connect your wallet to set the contract address'
      });
      return;
    }
    
    if (!isCorrectNetwork) {
      toast.warning('Wrong network', {
        description: 'Please connect to Minato Testnet before setting the contract address'
      });
      const switched = await checkAndSwitchNetwork();
      if (!switched) return;
    }
    
    setDAOContractAddress(contractAddress);
  };

  return (
    <Layout>
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Configure your Inject AI governance framework
          </p>
          {!walletConnected && (
            <div className="mt-4 rounded-md bg-orange-100 p-4 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200">
              <p className="text-sm font-medium">
                ⚠️ Wallet not connected
              </p>
              <p className="text-xs">
                Some features are limited until you connect your wallet to the Minato network
              </p>
            </div>
          )}
          {walletConnected && !isCorrectNetwork && (
            <div className="mt-4 rounded-md bg-orange-100 p-4 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200">
              <p className="text-sm font-medium">
                ⚠️ Wrong network
              </p>
              <p className="text-xs mb-2">
                Please connect to the Minato Testnet (Chain ID: 1946)
              </p>
              <Button size="sm" variant="outline" onClick={checkAndSwitchNetwork}>
                Switch Network
              </Button>
            </div>
          )}
        </div>
        
        <Tabs defaultValue="network">
          <TabsList className="mb-4">
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="ai-agents">AI Agents</TabsTrigger>
            <TabsTrigger value="interface">Interface</TabsTrigger>
            <TabsTrigger value="contracts">Smart Contracts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="network">
            <Card className="border border-sidebar-border">
              <CardHeader>
                <CardTitle>Network Settings</CardTitle>
                <CardDescription>
                  Configure connection to Minato Testnet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rpc-url">RPC URL</Label>
                  <Input id="rpc-url" value="https://rpc.minato.soneium.org/" readOnly />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="chain-id">Chain ID</Label>
                  <Input id="chain-id" value="1946" readOnly />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="explorer">Block Explorer URL</Label>
                  <Input id="explorer" value="https://explorer-testnet.soneium.org/" readOnly />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contract-address">DAO Contract Address</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="contract-address" 
                      placeholder="0x..." 
                      value={contractAddress}
                      onChange={(e) => setContractAddress(e.target.value)}
                      disabled={!walletConnected}
                    />
                    <Button 
                      onClick={saveContractAddress}
                      disabled={!walletConnected}
                    >
                      Save
                    </Button>
                  </div>
                  {!walletConnected && (
                    <p className="text-xs text-destructive">
                      Please connect your wallet to set contract address
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="auto-connect" />
                  <Label htmlFor="auto-connect">Auto-connect on startup</Label>
                </div>
                
                <Button onClick={saveSettings}>Save Network Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="agents">
            <Card className="border border-sidebar-border">
              <CardHeader>
                <CardTitle>Agent Settings</CardTitle>
                <CardDescription>
                  Configure agent behavior and voting parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="voting-threshold">Voting Threshold</Label>
                  <div className="flex items-center gap-2">
                    <Input id="voting-threshold" type="number" min="1" max="3" value="2" />
                    <span className="text-sm text-muted-foreground">of 3 agents</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Number of agents required to approve a proposal
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="review-time">Review Time</Label>
                  <div className="flex items-center gap-2">
                    <Input id="review-time" type="number" min="1" value="24" />
                    <span className="text-sm text-muted-foreground">hours</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Time allotted for agents to review a proposal
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Agent Permissions</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-md border border-sidebar-border p-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-agent-strategist/20 border border-agent-strategist/40 flex items-center justify-center">
                          👨‍💼
                        </div>
                        <span>The Strategist</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch id="a1-vote" defaultChecked />
                          <Label htmlFor="a1-vote" className="text-xs">Vote</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="a1-execute" defaultChecked />
                          <Label htmlFor="a1-execute" className="text-xs">Execute</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between rounded-md border border-sidebar-border p-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-agent-ethicist/20 border border-agent-ethicist/40 flex items-center justify-center">
                          👩‍⚖️
                        </div>
                        <span>The Ethicist</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch id="a2-vote" defaultChecked />
                          <Label htmlFor="a2-vote" className="text-xs">Vote</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="a2-execute" defaultChecked />
                          <Label htmlFor="a2-execute" className="text-xs">Execute</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between rounded-md border border-sidebar-border p-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-agent-optimizer/20 border border-agent-optimizer/40 flex items-center justify-center">
                          🧠
                        </div>
                        <span>The Optimizer</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch id="a3-vote" defaultChecked />
                          <Label htmlFor="a3-vote" className="text-xs">Vote</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="a3-execute" defaultChecked />
                          <Label htmlFor="a3-execute" className="text-xs">Execute</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button onClick={saveSettings}>Save Agent Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ai-agents">
            <div className="grid gap-6 md:grid-cols-2">
              <AIAgentTest />
              
              <Card className="border border-sidebar-border">
                <CardHeader>
                  <CardTitle>Mistral AI Configuration</CardTitle>
                  <CardDescription>
                    Configure how AI agents analyze and respond to proposals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="system-prompt">Default System Prompt</Label>
                    <Textarea 
                      id="system-prompt" 
                      className="min-h-[120px]"
                      defaultValue="You are an intelligent AI agent in a decentralized autonomous organization (DAO). Analyze proposals objectively, provide insights, and give clear, concise recommendations."
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      The system prompt can be customized by editing the Edge Function directly.
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between rounded-md border border-sidebar-border p-3">
                    <div>
                      <h3 className="text-sm font-medium">Enable AI Governance</h3>
                      <p className="text-xs text-muted-foreground">Allow AI agents to participate in governance</p>
                    </div>
                    <Switch id="enable-ai" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between rounded-md border border-sidebar-border p-3">
                    <div>
                      <h3 className="text-sm font-medium">Automatic Analysis</h3>
                      <p className="text-xs text-muted-foreground">Analyze new proposals automatically</p>
                    </div>
                    <Switch id="auto-analysis" defaultChecked />
                  </div>
                  
                  <Button onClick={saveSettings}>Save AI Settings</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="interface">
            <Card className="border border-sidebar-border">
              <CardHeader>
                <CardTitle>Interface Settings</CardTitle>
                <CardDescription>
                  Customize your dashboard experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-md border border-sidebar-border p-3">
                  <span>Simulate Agent Activities</span>
                  <Switch id="simulate-agents" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between rounded-md border border-sidebar-border p-3">
                  <span>Show Network Visualization</span>
                  <Switch id="show-network" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between rounded-md border border-sidebar-border p-3">
                  <span>Real-time Updates</span>
                  <Switch id="real-time" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between rounded-md border border-sidebar-border p-3">
                  <span>Display Transaction Details</span>
                  <Switch id="show-tx" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="refresh-rate">Dashboard Refresh Rate</Label>
                  <div className="flex items-center gap-2">
                    <Input id="refresh-rate" type="number" min="5" value="30" />
                    <span className="text-sm text-muted-foreground">seconds</span>
                  </div>
                </div>
                
                <Button onClick={saveSettings}>Save Interface Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contracts">
            <Card className="border border-sidebar-border">
              <CardHeader>
                <CardTitle>Smart Contract Settings</CardTitle>
                <CardDescription>
                  Configure DAO smart contract interaction
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contract-address">DAO Contract Address</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="contract-address" 
                      placeholder="0x..." 
                      value={contractAddress}
                      onChange={(e) => setContractAddress(e.target.value)}
                      disabled={!walletConnected}
                    />
                    <Button 
                      onClick={saveContractAddress}
                      disabled={!walletConnected}
                    >
                      Save
                    </Button>
                  </div>
                  {!walletConnected && (
                    <p className="text-xs text-destructive">
                      Please connect your wallet to set contract address
                    </p>
                  )}
                  {walletConnected && !isCorrectNetwork && (
                    <p className="text-xs text-destructive">
                      Please connect to Minato Testnet (Chain ID: 1946)
                    </p>
                  )}
                </div>
                
                <div className="rounded-md border border-sidebar-border bg-sidebar-accent/20 p-4 text-sm">
                  <h3 className="font-medium mb-2">Smart Contract Information</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    The Inject AI DAO Contract enables:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-muted-foreground">
                    <li>Proposal submission and management</li>
                    <li>Multi-agent voting and deliberation</li>
                    <li>Autonomous execution of approved proposals</li>
                    <li>On-chain governance record keeping</li>
                  </ul>
                  
                  <p className="mt-4 text-xs text-muted-foreground">
                    <strong>Note:</strong> You must deploy the contract to the Minato Testnet and paste its address above.
                    See deployment instructions in src/contracts/deploy.js
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
