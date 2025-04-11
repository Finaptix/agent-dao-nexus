
import React from 'react';
import Layout from '@/components/Layout';
import { useAppContext } from '@/contexts/AppContext';
import NetworkGraph from '@/components/NetworkGraph';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Network = () => {
  const { network, agents, proposals } = useAppContext();

  return (
    <Layout>
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Network Visualization</h1>
          <p className="text-sm text-muted-foreground">
            Explore agent interactions and governance activities
          </p>
        </div>
        
        <Tabs defaultValue="visualization">
          <TabsList className="mb-4">
            <TabsTrigger value="visualization">Visualization</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visualization" className="space-y-6">
            <Card className="border border-sidebar-border">
              <CardHeader>
                <CardTitle>Agent Interaction Network</CardTitle>
                <CardDescription>
                  Visual representation of agent-to-agent and agent-to-proposal interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="min-h-[600px]">
                  <NetworkGraph network={network} />
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card className="border border-sidebar-border">
                <CardHeader>
                  <CardTitle>Agent Connections</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {agents.map((agent, index) => (
                    <div key={index} className="flex items-center gap-3 rounded-md border border-sidebar-border p-3">
                      <div className={`h-8 w-8 flex items-center justify-center text-lg rounded-full bg-agent-${agent.type}/20 border border-agent-${agent.type}/40`}>
                        {agent.avatar}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{agent.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {network.links.filter(link => 
                            (link.source === `node-${index + 1}` || link.target === `node-${index + 1}`) && 
                            link.type !== 'routing'
                          ).length} connections
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card className="border border-sidebar-border">
                <CardHeader>
                  <CardTitle>Network Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="mb-1 text-sm font-medium">Active Proposals</h4>
                      <p className="text-2xl font-bold">{proposals.filter(p => 
                        p.status !== 'approved' && p.status !== 'rejected' && p.status !== 'executed'
                      ).length}</p>
                    </div>
                    
                    <div>
                      <h4 className="mb-1 text-sm font-medium">Total Connections</h4>
                      <p className="text-2xl font-bold">{network.links.length}</p>
                    </div>
                    
                    <div>
                      <h4 className="mb-1 text-sm font-medium">Connection Types</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Votes</span>
                          <span className="font-medium">{network.links.filter(link => link.type === 'vote').length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Debates</span>
                          <span className="font-medium">{network.links.filter(link => link.type === 'debate').length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Routings</span>
                          <span className="font-medium">{network.links.filter(link => link.type === 'routing').length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="about">
            <Card className="border border-sidebar-border">
              <CardHeader>
                <CardTitle>About Network Visualization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="mb-1 text-sm font-medium">Network Overview</h3>
                  <p className="text-sm text-muted-foreground">
                    The network visualization displays the relationships between agents and proposals in the Inject AI governance system. Each node represents either an agent or a proposal, and the connections between them represent different types of interactions.
                  </p>
                </div>
                
                <div>
                  <h3 className="mb-1 text-sm font-medium">Node Types</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border border-agent-strategist/40 bg-agent-strategist/20"></div>
                      <span className="text-sm text-muted-foreground">Strategist Agent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border border-agent-ethicist/40 bg-agent-ethicist/20"></div>
                      <span className="text-sm text-muted-foreground">Ethicist Agent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border border-agent-optimizer/40 bg-agent-optimizer/20"></div>
                      <span className="text-sm text-muted-foreground">Optimizer Agent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border border-gray-500/40 bg-gray-500/20"></div>
                      <span className="text-sm text-muted-foreground">Proposal</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="mb-1 text-sm font-medium">Connection Types</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-8 rounded-full bg-inject-pink/30"></div>
                      <span className="text-sm text-muted-foreground">Vote - An agent has voted on a proposal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-8 rounded-full bg-inject-green/30"></div>
                      <span className="text-sm text-muted-foreground">Debate - Agents are debating with each other</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-8 rounded-full bg-inject-cyan/30"></div>
                      <span className="text-sm text-muted-foreground">Routing - A proposal has been routed to an agent</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="mb-1 text-sm font-medium">Technical Implementation</h3>
                  <p className="text-sm text-muted-foreground">
                    The network graph is rendered using a simple force-directed layout algorithm. In a production environment, this would be implemented using a more sophisticated visualization library like D3.js or React Flow for better interactivity and performance.
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

export default Network;
