
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useAppContext } from '@/contexts/AppContext';
import ProposalCard from '@/components/ProposalCard';
import ProposalDetails from '@/components/ProposalDetails';
import CreateProposalForm from '@/components/CreateProposalForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProposalStatus, ProposalType } from '@/types';
import { Search, Filter } from 'lucide-react';

const Proposals = () => {
  const { proposals } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProposalStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ProposalType | 'all'>('all');

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          proposal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
    const matchesType = typeFilter === 'all' || proposal.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <Layout>
      <ProposalDetails />
      
      <div className="container py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Proposals</h1>
            <p className="text-sm text-muted-foreground">
              View, filter, and create governance proposals
            </p>
          </div>
          <CreateProposalForm />
        </div>
        
        <div className="mb-6 flex flex-col gap-4 rounded-lg border border-sidebar-border bg-sidebar-accent/30 p-4 sm:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search proposals..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="w-40">
              <Select 
                value={statusFilter} 
                onValueChange={(value) => setStatusFilter(value as ProposalStatus | 'all')}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="debating">Debating</SelectItem>
                  <SelectItem value="voting">Voting</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="executed">Executed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-40">
              <Select 
                value={typeFilter} 
                onValueChange={(value) => setTypeFilter(value as ProposalType | 'all')}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="funding">Funding</SelectItem>
                  <SelectItem value="governance">Governance</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {filteredProposals.length === 0 ? (
          <div className="rounded-lg border border-sidebar-border p-8 text-center">
            <h3 className="mb-2 text-lg font-medium">No proposals found</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                ? 'Try adjusting your search filters'
                : 'Create a new proposal to get started'}
            </p>
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' ? (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setTypeFilter('all');
                }}
              >
                Clear Filters
              </Button>
            ) : (
              <CreateProposalForm />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProposals.map(proposal => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Proposals;
