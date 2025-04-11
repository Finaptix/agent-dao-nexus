
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { useAppContext } from '@/contexts/AppContext';
import AgentCard from '@/components/AgentCard';
import ProposalCard from '@/components/ProposalCard';
import TransactionsList from '@/components/TransactionsList';
import NetworkGraph from '@/components/NetworkGraph';
import DashboardStats from '@/components/DashboardStats';
import CreateProposalForm from '@/components/CreateProposalForm';
import ProposalDetails from '@/components/ProposalDetails';
import { Activity, Zap } from 'lucide-react';

const Index = () => {
  const { agents, proposals, transactions, network, loading, simulateAgentActivity } = useAppContext();
  
  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-3xl font-bold text-inject-cyan">Inject AI</h1>
            <p className="mb-8 text-muted-foreground">Connecting to Minato Testnet...</p>
            <div className="h-1 w-48 overflow-hidden rounded-full bg-muted">
              <div className="h-full animate-pulse bg-inject-cyan"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <ProposalDetails />
      
      <div className="container py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Inject AI Dashboard</h1>
            <p className="text-sm text-muted-foreground">Multi-Agent Governance Framework on Minato Testnet</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="gap-2" 
              onClick={simulateAgentActivity}
            >
              <Activity size={16} />
              <span>Simulate Activity</span>
            </Button>
            <CreateProposalForm />
          </div>
        </div>
        
        <div className="mb-6">
          <DashboardStats proposals={proposals} />
        </div>
        
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="col-span-1 lg:col-span-2">
            <NetworkGraph network={network} />
          </div>
          <div className="col-span-1">
            <TransactionsList transactions={transactions} limit={3} />
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-semibold">Governance Agents</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Active Proposals</h2>
            <Button variant="link" className="gap-1" asChild>
              <a href="/proposals">
                <span>View All</span>
              </a>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {proposals.slice(0, 3).map(proposal => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
          </div>
        </div>
        
        <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Zap size={18} className="text-inject-cyan" />
                <span>Minato Testnet Connected</span>
              </h2>
              <p className="text-sm text-muted-foreground">Chain ID: 1946 | RPC: https://rpc.minato.soneium.org/</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a 
                href="https://explorer-testnet.soneium.org/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Open Explorer
              </a>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
