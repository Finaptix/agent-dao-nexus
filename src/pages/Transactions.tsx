
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink, CheckCircle, Clock, AlertTriangle, Search, Filter } from 'lucide-react';
import { Transaction } from '@/types';
import { format } from 'date-fns';

const Transactions = () => {
  const { transactions } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<Transaction['type'] | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<Transaction['status'] | 'all'>('all');

  const filteredTransactions = transactions
    .filter(tx => {
      const matchesSearch = tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (tx.proposalId && tx.proposalId.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = typeFilter === 'all' || tx.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
      
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => b.timestamp - a.timestamp);

  const statusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'failed':
        return <AlertTriangle size={16} className="text-red-500" />;
    }
  };

  return (
    <Layout>
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Transaction History</h1>
          <p className="text-sm text-muted-foreground">
            View on-chain transactions for proposals, votes, and executions
          </p>
        </div>
        
        <div className="mb-6 flex flex-col gap-4 rounded-lg border border-sidebar-border bg-sidebar-accent/30 p-4 sm:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by transaction hash or proposal ID..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="w-40">
              <Select 
                value={typeFilter} 
                onValueChange={(value) => setTypeFilter(value as Transaction['type'] | 'all')}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="vote">Vote</SelectItem>
                  <SelectItem value="execution">Execution</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-40">
              <Select 
                value={statusFilter} 
                onValueChange={(value) => setStatusFilter(value as Transaction['status'] | 'all')}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <Card className="border border-sidebar-border">
          <CardHeader>
            <CardTitle className="text-lg">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-muted-foreground">No transactions found</p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => {
                    setSearchTerm('');
                    setTypeFilter('all');
                    setStatusFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.map((tx, index) => (
                  <div 
                    key={index} 
                    className="rounded-md border border-sidebar-border bg-sidebar-accent/50 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {statusIcon(tx.status)}
                        <span className={`rounded-full px-2 py-0.5 text-xs ${
                          tx.type === 'proposal' 
                            ? 'bg-inject-cyan/20 text-inject-cyan' 
                            : tx.type === 'vote'
                              ? 'bg-inject-pink/20 text-inject-pink'
                              : 'bg-inject-green/20 text-inject-green'
                        }`}>
                          {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(tx.timestamp, 'MMM d, yyyy HH:mm:ss')}
                        </span>
                      </div>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" asChild>
                        <a 
                          href={`https://explorer-testnet.soneium.org/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </Button>
                    </div>
                    
                    <div className="mt-2">
                      <div className="mb-1 flex items-center gap-1 overflow-hidden text-sm">
                        <span className="text-muted-foreground">Hash:</span>
                        <code className="overflow-hidden overflow-ellipsis text-xs">
                          {tx.hash}
                        </code>
                      </div>
                      
                      <div className="mb-1 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-muted-foreground">From:</span>
                          <code>{tx.from}</code>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-muted-foreground">To:</span>
                          <code>{tx.to}</code>
                        </div>
                      </div>
                      
                      {tx.proposalId && (
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-muted-foreground">Proposal:</span>
                          <span>{tx.proposalId}</span>
                        </div>
                      )}
                      
                      {tx.value && (
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-muted-foreground">Value:</span>
                          <span>{tx.value} tokens</span>
                        </div>
                      )}
                      
                      {tx.gasUsed && (
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-muted-foreground">Gas Used:</span>
                          <span>{tx.gasUsed}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="mt-6 border border-sidebar-border">
          <CardHeader>
            <CardTitle className="text-lg">Minato Testnet Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h3 className="mb-1 text-sm font-medium">Network Details</h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
                  <div className="rounded-md border border-sidebar-border p-2">
                    <span className="text-xs text-muted-foreground">Network</span>
                    <p className="text-sm font-medium">Minato</p>
                  </div>
                  <div className="rounded-md border border-sidebar-border p-2">
                    <span className="text-xs text-muted-foreground">Chain ID</span>
                    <p className="text-sm font-medium">1946</p>
                  </div>
                  <div className="rounded-md border border-sidebar-border p-2">
                    <span className="text-xs text-muted-foreground">Symbol</span>
                    <p className="text-sm font-medium">ETH</p>
                  </div>
                  <div className="rounded-md border border-sidebar-border p-2">
                    <span className="text-xs text-muted-foreground">RPC URL</span>
                    <p className="text-sm font-medium truncate">https://rpc.minato.soneium.org/</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="mb-1 text-sm font-medium">Block Explorer</h3>
                <div className="flex items-center gap-2">
                  <Input 
                    value="https://explorer-testnet.soneium.org/" 
                    readOnly 
                    className="bg-sidebar-accent"
                  />
                  <Button asChild>
                    <a 
                      href="https://explorer-testnet.soneium.org/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="gap-2"
                    >
                      <span>Open</span>
                      <ExternalLink size={14} />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Transactions;
