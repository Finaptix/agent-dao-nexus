
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Clock, CheckCircle, XCircle, AlertCircle, Vote } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useAppContext } from '@/contexts/AppContext';

const ProposalDetails: React.FC = () => {
  const { selectedProposal, selectProposal } = useAppContext();
  
  if (!selectedProposal) return null;
  
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
    <Dialog open={!!selectedProposal} onOpenChange={(open) => !open && selectProposal(null)}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge 
              variant="outline" 
              className={typeColors[selectedProposal.type]}
            >
              {selectedProposal.type.charAt(0).toUpperCase() + selectedProposal.type.slice(1)}
            </Badge>
            <Badge 
              variant="outline"
              className={statusColors[selectedProposal.status]}
            >
              <div className="flex items-center gap-1">
                {statusIcons[selectedProposal.status]}
                <span>{selectedProposal.status.charAt(0).toUpperCase() + selectedProposal.status.slice(1)}</span>
              </div>
            </Badge>
          </div>
          <DialogTitle className="text-xl">{selectedProposal.title}</DialogTitle>
          <DialogDescription>
            <div className="flex items-center justify-between">
              <span>Submitted by {selectedProposal.author}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(selectedProposal.createdAt, { addSuffix: true })}
              </span>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          <div>
            <h3 className="mb-2 text-sm font-medium">Description</h3>
            <p className="text-sm text-muted-foreground">{selectedProposal.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {selectedProposal.budget && (
              <div>
                <h4 className="mb-1 text-xs font-medium text-muted-foreground">Budget</h4>
                <p className="text-sm">{selectedProposal.budget}</p>
              </div>
            )}
            
            {selectedProposal.timeline && (
              <div>
                <h4 className="mb-1 text-xs font-medium text-muted-foreground">Timeline</h4>
                <p className="text-sm">{selectedProposal.timeline}</p>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="mb-2 text-sm font-medium">Agent Votes & Feedback</h3>
            {selectedProposal.votes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No agent votes yet</p>
            ) : (
              <div className="space-y-3">
                {selectedProposal.votes.map((vote, index) => (
                  <Card key={index} className="border border-sidebar-border">
                    <CardContent className="p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={
                              vote.vote === 'approve' 
                                ? 'bg-green-500/10 text-green-500 border-green-500/30' 
                                : vote.vote === 'reject'
                                  ? 'bg-red-500/10 text-red-500 border-red-500/30'
                                  : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
                            }
                          >
                            {vote.vote.charAt(0).toUpperCase() + vote.vote.slice(1)}
                          </Badge>
                          <span className="text-sm">
                            Agent {vote.agentId.split('-')[1]}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(vote.timestamp, 'MMM d, yyyy HH:mm')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{vote.reason}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          {selectedProposal.txHash && (
            <>
              <Separator />
              <div>
                <h3 className="mb-2 text-sm font-medium">On-Chain Details</h3>
                <div className="flex items-center gap-2 rounded-md bg-sidebar-accent p-2">
                  <span className="text-xs text-muted-foreground">Transaction:</span>
                  <code className="flex-1 overflow-hidden overflow-ellipsis text-xs">{selectedProposal.txHash}</code>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0" asChild>
                    <a 
                      href={`https://explorer-testnet.soneium.org/tx/${selectedProposal.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={12} />
                    </a>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => selectProposal(null)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProposalDetails;
