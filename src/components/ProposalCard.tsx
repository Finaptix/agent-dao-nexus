
import React from 'react';
import { Proposal } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle, Clock, Vote } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAppContext } from '@/contexts/AppContext';

interface ProposalCardProps {
  proposal: Proposal;
}

const ProposalCard: React.FC<ProposalCardProps> = ({ proposal }) => {
  const { selectProposal } = useAppContext();
  
  const statusIcons = {
    pending: <Clock size={16} className="text-inject-cyan" />,
    reviewing: <AlertCircle size={16} className="text-yellow-500" />,
    debating: <Vote size={16} className="text-inject-pink" />,
    voting: <Vote size={16} className="text-inject-pink" />,
    approved: <CheckCircle size={16} className="text-green-500" />,
    rejected: <XCircle size={16} className="text-red-500" />,
    executed: <CheckCircle size={16} className="text-inject-green" />,
  };

  const statusColors = {
    pending: 'border-inject-cyan bg-inject-cyan/10 text-inject-cyan',
    reviewing: 'border-yellow-500 bg-yellow-500/10 text-yellow-500',
    debating: 'border-inject-pink bg-inject-pink/10 text-inject-pink',
    voting: 'border-inject-pink bg-inject-pink/10 text-inject-pink',
    approved: 'border-green-500 bg-green-500/10 text-green-500',
    rejected: 'border-red-500 bg-red-500/10 text-red-500',
    executed: 'border-inject-green bg-inject-green/10 text-inject-green',
  };

  const typeColors = {
    funding: 'bg-inject-cyan/10 text-inject-cyan',
    governance: 'bg-inject-purple/10 text-inject-purple',
    development: 'bg-inject-green/10 text-inject-green',
    community: 'bg-inject-pink/10 text-inject-pink',
    other: 'bg-gray-500/10 text-gray-500',
  };

  return (
    <Card className="h-full overflow-hidden border border-sidebar-border transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <Badge 
            variant="outline" 
            className={typeColors[proposal.type]}
          >
            {proposal.type.charAt(0).toUpperCase() + proposal.type.slice(1)}
          </Badge>
          <Badge 
            variant="outline"
            className={statusColors[proposal.status]}
          >
            <div className="flex items-center gap-1">
              {statusIcons[proposal.status]}
              <span>{proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}</span>
            </div>
          </Badge>
        </div>
        <CardTitle className="text-lg">{proposal.title}</CardTitle>
        <CardDescription>
          <div className="flex items-center justify-between">
            <span>by {proposal.author}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(proposal.createdAt, { addSuffix: true })}
            </span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{proposal.description}</p>
        
        {proposal.budget && (
          <div className="mt-2 flex items-center text-xs">
            <span className="font-medium text-muted-foreground">Budget:</span>
            <span className="ml-1">{proposal.budget}</span>
          </div>
        )}
        
        {proposal.votes.length > 0 && (
          <div className="mt-2">
            <span className="text-xs font-medium text-muted-foreground">Votes:</span>
            <div className="mt-1 flex gap-1">
              {proposal.votes.map((vote, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className={
                    vote.vote === 'approve' 
                      ? 'bg-green-500/10 text-green-500 border-green-500/30' 
                      : vote.vote === 'reject'
                        ? 'bg-red-500/10 text-red-500 border-red-500/30'
                        : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
                  }
                >
                  Agent {vote.agentId.split('-')[1]}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => selectProposal(proposal.id)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProposalCard;
