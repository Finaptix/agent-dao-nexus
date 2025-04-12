
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Activity, Code, Database, Network, Shield, FileText, History, Vote } from 'lucide-react';
import { ProposalStatus } from '@/types';

const AgentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { agents, proposals, transactions } = useAppContext();
  const [activeAction, setActiveAction] = useState<string | null>(null);
  
  const agent = agents.find(a => a.id === id);
  
  if (!agent) {
    return (
      <Layout>
        <div className="container py-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/agents')}>
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Agents
            </Button>
          </div>
          <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold">Agent not found</h2>
            <p className="mt-2 text-muted-foreground">The agent you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  const agentVotes = proposals.flatMap(p => 
    p.votes.filter(v => v.agentId === agent.id)
      .map(vote => ({
        proposalId: p.id,
        proposalTitle: p.title,
        vote: vote.vote,
        reason: vote.reason,
        timestamp: vote.timestamp
      }))
  ).sort((a, b) => b.timestamp - a.timestamp);
  
  const agentTransactions = transactions.filter(t => t.from === agent.id);
  
  const agentIcons = {
    strategist: <Shield className="h-6 w-6 text-inject-cyan" />,
    ethicist: <Network className="h-6 w-6 text-inject-pink" />,
    optimizer: <Database className="h-6 w-6 text-inject-green" />
  };
  
  const statusColors = {
    idle: 'bg-muted-foreground',
    analyzing: 'bg-yellow-500 animate-pulse',
    voting: 'bg-inject-cyan animate-pulse',
    debating: 'bg-inject-pink animate-pulse',
  };
  
  const handleSimulateAction = (action: string) => {
    setActiveAction(action);
    setTimeout(() => {
      setActiveAction(null);
    }, 2000);
  };

  return (
    <Layout>
      <div className="container py-6">
        <div className="mb-6 flex items-center gap-2">
          <Button variant="ghost" onClick={() => navigate('/agents')}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Agents
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card className="border border-sidebar-border">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sidebar-accent text-3xl">
                    {agentIcons[agent.type] || agent.avatar}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{agent.name}</CardTitle>
                    <CardDescription>
                      <Badge className="mr-2">
                        {agent.type.charAt(0).toUpperCase() + agent.type.slice(1)}
                      </Badge>
                      <span className="inline-flex items-center gap-1 text-sm">
                        <span className={cn(
                          "h-2 w-2 rounded-full",
                          statusColors[agent.status]
                        )}></span>
                        {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="mb-1 text-sm font-medium">About</h3>
                  <p className="text-sm text-muted-foreground">{agent.description}</p>
                </div>
                
                <div>
                  <h3 className="mb-1 text-sm font-medium">Core Values</h3>
                  <div className="flex flex-wrap gap-2">
                    {agent.values.map((value, index) => (
                      <Badge key={index} variant="outline">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="mb-1 text-sm font-medium">Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {agent.expertise.map((exp, index) => (
                      <Badge key={index} variant="secondary">
                        {exp}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="mb-1 text-sm font-medium">Blockchain Address</h3>
                  <div className="flex items-center gap-2 rounded-md bg-sidebar-accent/30 p-2 font-mono text-xs">
                    {`0x${agent.id.split('-')[1]}...${Math.random().toString(16).substring(2, 6)}`}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full space-y-2">
                  <h3 className="text-sm font-medium">Agent Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleSimulateAction('analyze')}
                      disabled={activeAction !== null}
                    >
                      <Activity className="mr-1 h-4 w-4" />
                      <span>{activeAction === 'analyze' ? 'Analyzing...' : 'Analyze'}</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleSimulateAction('vote')}
                      disabled={activeAction !== null}
                    >
                      <Vote className="mr-1 h-4 w-4" />
                      <span>{activeAction === 'vote' ? 'Voting...' : 'Vote'}</span>
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Tabs defaultValue="votes">
              <TabsList className="mb-4 grid w-full grid-cols-3">
                <TabsTrigger value="votes" className="flex items-center gap-1">
                  <Vote className="h-4 w-4" />
                  <span>Votes</span>
                </TabsTrigger>
                <TabsTrigger value="blockchain" className="flex items-center gap-1">
                  <Code className="h-4 w-4" />
                  <span>Blockchain</span>
                </TabsTrigger>
                <TabsTrigger value="transactions" className="flex items-center gap-1">
                  <History className="h-4 w-4" />
                  <span>Transactions</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="votes">
                <Card className="border border-sidebar-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Voting History</CardTitle>
                    <CardDescription>
                      Past votes cast by this agent on proposals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {agentVotes.length === 0 ? (
                      <div className="text-center py-6">
                        <FileText className="mx-auto h-12 w-12 text-muted-foreground/30" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          This agent hasn't voted on any proposals yet
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {agentVotes.map((vote, index) => (
                          <div 
                            key={index} 
                            className="rounded-lg border border-muted p-4"
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <h4 className="font-medium">
                                {vote.proposalTitle}
                              </h4>
                              <Badge
                                variant={
                                  vote.vote === 'approve' 
                                    ? 'default' 
                                    : vote.vote === 'reject' 
                                      ? 'destructive' 
                                      : 'outline'
                                }
                              >
                                {vote.vote.charAt(0).toUpperCase() + vote.vote.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{vote.reason}</p>
                            <div className="mt-2 text-xs text-muted-foreground">
                              {new Date(vote.timestamp).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="blockchain">
                <Card className="border border-sidebar-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Blockchain Integration</CardTitle>
                    <CardDescription>
                      Agent's on-chain activity and capabilities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="mb-2 text-sm font-medium">Blockchain Capabilities</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {agent.type === 'strategist' && (
                            <>
                              <div className="rounded-lg border border-muted p-4">
                                <h4 className="mb-2 font-medium">Smart Contract Verification</h4>
                                <p className="text-sm text-muted-foreground">
                                  Analyzes smart contract code to identify security vulnerabilities, logic flaws, and alignment with DAO objectives.
                                </p>
                              </div>
                              <div className="rounded-lg border border-muted p-4">
                                <h4 className="mb-2 font-medium">Treasury Management</h4>
                                <p className="text-sm text-muted-foreground">
                                  Monitors treasury allocations, evaluates financial proposals, and recommends diversification strategies.
                                </p>
                              </div>
                            </>
                          )}
                          
                          {agent.type === 'ethicist' && (
                            <>
                              <div className="rounded-lg border border-muted p-4">
                                <h4 className="mb-2 font-medium">Governance Alignment</h4>
                                <p className="text-sm text-muted-foreground">
                                  Ensures proposals align with community values and evaluates impact on different stakeholder groups.
                                </p>
                              </div>
                              <div className="rounded-lg border border-muted p-4">
                                <h4 className="mb-2 font-medium">Community Representation</h4>
                                <p className="text-sm text-muted-foreground">
                                  Analyzes on-chain voting patterns to ensure fair representation of minority token holders.
                                </p>
                              </div>
                            </>
                          )}
                          
                          {agent.type === 'optimizer' && (
                            <>
                              <div className="rounded-lg border border-muted p-4">
                                <h4 className="mb-2 font-medium">Gas Optimization</h4>
                                <p className="text-sm text-muted-foreground">
                                  Analyzes contract deployments and protocol updates for gas efficiency and blockchain resource usage.
                                </p>
                              </div>
                              <div className="rounded-lg border border-muted p-4">
                                <h4 className="mb-2 font-medium">Contract Efficiency</h4>
                                <p className="text-sm text-muted-foreground">
                                  Evaluates technical implementations for code quality, testing coverage, and optimization.
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="mb-2 text-sm font-medium">On-Chain Integration</h3>
                        <div className="rounded-lg border border-muted p-4">
                          <div className="space-y-2 font-mono text-xs">
                            <div className="flex justify-between">
                              <span>Smart Contract Address:</span>
                              <span className="text-inject-green">0x7B31...dE45</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Controller:</span>
                              <span className="text-inject-cyan">DAO Governance</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Network:</span>
                              <span>Minato Testnet</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Last On-Chain Update:</span>
                              <span>{new Date().toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="transactions">
                <Card className="border border-sidebar-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Transaction History</CardTitle>
                    <CardDescription>
                      On-chain transactions initiated by this agent
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {agentTransactions.length === 0 ? (
                      <div className="text-center py-6">
                        <History className="mx-auto h-12 w-12 text-muted-foreground/30" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          No transactions found for this agent
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {agentTransactions.map((tx, index) => (
                          <div 
                            key={index} 
                            className="flex items-center justify-between rounded-lg border border-muted p-3"
                          >
                            <div>
                              <div className="font-medium">
                                {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(tx.timestamp).toLocaleString()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono text-xs">
                                {tx.hash}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AgentDetail;
