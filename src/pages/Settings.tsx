
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner'; // Import directly from sonner package, not from our UI component

const Settings = () => {
  const saveSettings = () => {
    toast.success('Settings saved', {
      description: 'Your settings have been successfully saved',
    });
  };

  return (
    <Layout>
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Configure your Inject AI governance framework
          </p>
        </div>
        
        <Tabs defaultValue="network">
          <TabsList className="mb-4">
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="interface">Interface</TabsTrigger>
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
                  <Input id="contract-address" placeholder="0x..." />
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
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
