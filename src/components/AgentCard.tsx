
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Agent } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, ArrowRight, Code, Database, Network, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AgentCardProps {
  agent: Agent;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const statusColors = {
    idle: 'bg-muted-foreground',
    analyzing: 'bg-yellow-500 animate-pulse',
    voting: 'bg-inject-cyan animate-pulse',
    debating: 'bg-inject-pink animate-pulse',
  };

  const agentIcons = {
    strategist: <Shield className="h-5 w-5 text-inject-cyan" />,
    ethicist: <Network className="h-5 w-5 text-inject-pink" />,
    optimizer: <Database className="h-5 w-5 text-inject-green" />
  };

  const viewAgentDetails = () => {
    navigate(`/agent/${agent.id}`);
  };

  const getBlockchainCapability = (type: string) => {
    switch (type) {
      case 'strategist':
        return (
          <div className="mt-4 space-y-2 text-sm">
            <h4 className="font-medium">Blockchain Capabilities:</h4>
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-inject-cyan" />
              <span>Smart contract verification</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-inject-cyan" />
              <span>Treasury management</span>
            </div>
          </div>
        );
      case 'ethicist':
        return (
          <div className="mt-4 space-y-2 text-sm">
            <h4 className="font-medium">Blockchain Capabilities:</h4>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-inject-pink" />
              <span>Governance alignment</span>
            </div>
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4 text-inject-pink" />
              <span>Community representation</span>
            </div>
          </div>
        );
      case 'optimizer':
        return (
          <div className="mt-4 space-y-2 text-sm">
            <h4 className="font-medium">Blockchain Capabilities:</h4>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-inject-green" />
              <span>Gas optimization</span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-inject-green" />
              <span>Contract efficiency analysis</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className={cn(
      "h-full transition-all duration-300 hover:shadow-md overflow-hidden border border-sidebar-border",
      `${agent.type}-card`
    )}>
      <CardHeader className="relative pb-2">
        <div className="absolute right-4 top-4 flex items-center gap-2">
          <span className={cn(
            "h-2.5 w-2.5 rounded-full",
            statusColors[agent.status]
          )}></span>
          <span className="text-xs text-muted-foreground">
            {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent">
            {agentIcons[agent.type] || <div className="text-2xl">{agent.avatar}</div>}
          </div>
          <div>
            <CardTitle className="text-xl font-semibold">{agent.name}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              <Badge variant="outline" className="mr-1">
                {agent.type.charAt(0).toUpperCase() + agent.type.slice(1)}
              </Badge>
              <Badge variant="secondary" className="bg-sidebar-accent">
                On-chain
              </Badge>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{agent.description}</p>
        
        <div className="mt-4">
          <h4 className="mb-2 text-xs font-medium text-muted-foreground">Core Values</h4>
          <div className="flex flex-wrap gap-2">
            {agent.values.map((value, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {value}
              </Badge>
            ))}
          </div>
        </div>
        
        {isExpanded && (
          <>
            <div className="mt-4">
              <h4 className="mb-2 text-xs font-medium text-muted-foreground">Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {agent.expertise.map((exp, index) => (
                  <Badge key={index} variant="outline" className="bg-muted text-xs">
                    {exp}
                  </Badge>
                ))}
              </div>
            </div>
            
            {getBlockchainCapability(agent.type)}
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show Less" : "Show More"}
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="gap-1" 
          onClick={viewAgentDetails}
        >
          <span>Details</span>
          <ArrowRight className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AgentCard;
