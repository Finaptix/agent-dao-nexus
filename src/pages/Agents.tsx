
import React from 'react';
import Layout from '@/components/Layout';
import { useAppContext } from '@/contexts/AppContext';
import AgentCard from '@/components/AgentCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Agents = () => {
  const { agents } = useAppContext();

  return (
    <Layout>
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Governance Agents</h1>
          <p className="text-sm text-muted-foreground">
            Autonomous agents that analyze, debate, and vote on DAO proposals
          </p>
        </div>
        
        <Card className="mb-6 border border-sidebar-border">
          <CardHeader>
            <CardTitle>Multi-Agent Governance Framework</CardTitle>
            <CardDescription>
              Inject AI deploys a team of specialized agents, each with unique governance perspectives, that work together to evaluate proposals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Each agent is designed with distinct values, expertise, and decision-making criteria. They autonomously analyze proposals, debate with each other, and vote based on their specialized perspectives. This creates a balanced governance system that considers strategic, ethical, and technical aspects of each proposal.
            </p>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {agents.map(agent => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
        
        <Card className="mt-6 border border-sidebar-border">
          <CardHeader>
            <CardTitle>Agent Technical Implementation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="mb-1 text-sm font-medium">On-Chain Functionality</h3>
                <p className="text-sm text-muted-foreground">
                  Agents run autonomously with rules and logic encoded in smart contracts deployed on the Minato Testnet. Each agent decision and vote is recorded on-chain for full transparency and auditability.
                </p>
              </div>
              
              <div>
                <h3 className="mb-1 text-sm font-medium">Decision Making Process</h3>
                <p className="text-sm text-muted-foreground">
                  1. Proposal Ingestion - New proposals are routed to the appropriate agents<br />
                  2. Analysis Phase - Each agent evaluates the proposal based on its unique criteria<br />
                  3. Deliberation - Agents can debate and request information from each other<br />
                  4. Voting - Agents cast their votes with detailed reasoning<br />
                  5. Execution - If approved, the proposal is automatically executed by the DAO
                </p>
              </div>
              
              <div>
                <h3 className="mb-1 text-sm font-medium">Future Enhancements</h3>
                <p className="text-sm text-muted-foreground">
                  - Integration with large language models for more sophisticated analysis<br />
                  - Adaptive learning from past decisions to improve future governance<br />
                  - Implementation of specialized agent roles for different proposal types
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Agents;
