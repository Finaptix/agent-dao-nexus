
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { ProposalType } from '@/types';

const proposalTypes = [
  { value: 'funding', label: 'Funding' },
  { value: 'governance', label: 'Governance' },
  { value: 'development', label: 'Development' },
  { value: 'community', label: 'Community' },
  { value: 'other', label: 'Other' }
];

const CreateProposalForm = () => {
  const { 
    addProposal, 
    walletConnected, 
    walletAddress, 
    isCorrectNetwork, 
    daoContract,
    checkAndSwitchNetwork
  } = useAppContext();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [proposalType, setProposalType] = useState<ProposalType>('funding');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description) {
      toast.error('Missing fields', {
        description: 'Please fill out all required fields'
      });
      return;
    }
    
    if (!walletConnected) {
      toast.error('Wallet not connected', {
        description: 'Please connect your MetaMask wallet to submit a proposal'
      });
      return;
    }
    
    if (!isCorrectNetwork) {
      toast.warning('Wrong network', {
        description: 'Please connect to Minato Testnet to submit a proposal'
      });
      const switched = await checkAndSwitchNetwork();
      if (!switched) return;
    }
    
    setIsSubmitting(true);
    
    try {
      // If we have a contract connection, submit on-chain
      if (daoContract) {
        // Convert proposalType string to number for the contract
        const proposalTypeIndex = proposalTypes.findIndex(t => t.value === proposalType);
        
        const tx = await daoContract.createProposal(
          title,
          description,
          proposalTypeIndex >= 0 ? proposalTypeIndex : 0,
          budget || 'N/A',
          timeline || 'N/A'
        );
        
        toast.success('Proposal submitted on-chain', {
          description: `Transaction hash: ${tx.substring(0, 10)}...${tx.substring(tx.length - 6)}`
        });
      }
      
      // Always update UI with the new proposal for demo purposes
      addProposal({
        title,
        description,
        type: proposalType, // Now this is correctly typed as ProposalType
        author: walletAddress || '0x0',
        budget: budget || 'N/A',
        timeline: timeline || 'N/A'
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setProposalType('funding');
      setBudget('');
      setTimeline('');
    } catch (error: any) {
      console.error('Error submitting proposal:', error);
      toast.error('Submission Failed', {
        description: error.message || 'Failed to submit proposal'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter proposal title"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your proposal in detail"
          className="min-h-[100px]"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type">Proposal Type</Label>
        <Select 
          value={proposalType} 
          onValueChange={(value) => setProposalType(value as ProposalType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a proposal type" />
          </SelectTrigger>
          <SelectContent>
            {proposalTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="budget">Budget (optional)</Label>
        <Input
          id="budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="e.g. 500 ETH"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="timeline">Timeline (optional)</Label>
        <Input
          id="timeline"
          value={timeline}
          onChange={(e) => setTimeline(e.target.value)}
          placeholder="e.g. 2 weeks"
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting || !walletConnected}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
      </Button>
      
      {!walletConnected && (
        <p className="text-xs text-center text-muted-foreground mt-2">
          Connect your wallet to submit proposals
        </p>
      )}
    </form>
  );
};

export default CreateProposalForm;
