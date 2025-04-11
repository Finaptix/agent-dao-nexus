
import React from 'react';
import { cn } from '@/lib/utils';
import { Agent } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AgentCardProps {
  agent: Agent;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const statusColors = {
    idle: 'bg-muted-foreground',
    analyzing: 'bg-yellow-500 animate-pulse',
    voting: 'bg-inject-cyan animate-pulse',
    debating: 'bg-inject-pink animate-pulse',
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
          <div className="text-3xl">{agent.avatar}</div>
          <div>
            <CardTitle className="text-xl font-semibold">{agent.name}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Type: {agent.type.charAt(0).toUpperCase() + agent.type.slice(1)}
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
      </CardContent>
    </Card>
  );
};

export default AgentCard;
