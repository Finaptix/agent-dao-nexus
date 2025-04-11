
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/types';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface TransactionsListProps {
  transactions: Transaction[];
  limit?: number;
}

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions, limit }) => {
  const displayedTransactions = limit ? transactions.slice(0, limit) : transactions;
  
  const transactionTypeBadge = (type: Transaction['type']) => {
    switch (type) {
      case 'proposal':
        return <span className="rounded-full bg-inject-cyan/20 px-2 py-0.5 text-xs text-inject-cyan">Proposal</span>;
      case 'vote':
        return <span className="rounded-full bg-inject-pink/20 px-2 py-0.5 text-xs text-inject-pink">Vote</span>;
      case 'execution':
        return <span className="rounded-full bg-inject-green/20 px-2 py-0.5 text-xs text-inject-green">Execution</span>;
    }
  };
  
  const statusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={14} className="text-green-500" />;
      case 'pending':
        return <Clock size={14} className="text-yellow-500" />;
      case 'failed':
        return <AlertTriangle size={14} className="text-red-500" />;
    }
  };

  return (
    <Card className="border border-sidebar-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayedTransactions.length === 0 ? (
            <div className="py-3 text-center text-sm text-muted-foreground">
              No transactions found
            </div>
          ) : (
            displayedTransactions.map((tx, index) => (
              <div key={index} className="rounded-md border border-sidebar-border bg-sidebar-accent/50 p-3">
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {statusIcon(tx.status)}
                    {transactionTypeBadge(tx.type)}
                    <span className="text-xs text-muted-foreground">
                      {format(tx.timestamp, 'MMM d, yyyy HH:mm')}
                    </span>
                  </div>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0" asChild>
                    <a 
                      href={`https://explorer-testnet.soneium.org/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={12} />
                    </a>
                  </Button>
                </div>
                <div className="mb-1 flex items-center gap-1 text-xs">
                  <span className="text-muted-foreground">From:</span>
                  <code className="text-xs">{tx.from}</code>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-muted-foreground">To:</span>
                  <code className="text-xs">{tx.to}</code>
                </div>
                {tx.proposalId && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    For proposal: {tx.proposalId}
                  </div>
                )}
                {tx.value && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Value: {tx.value}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsList;
