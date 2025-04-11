
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Network } from '@/types';
import { useAppContext } from '@/contexts/AppContext';

interface NetworkGraphProps {
  network: Network;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ network }) => {
  const graphRef = useRef<HTMLDivElement>(null);
  const { agents, proposals } = useAppContext();
  
  useEffect(() => {
    if (!graphRef.current) return;
    
    const renderGraph = () => {
      const container = graphRef.current;
      if (!container) return;
      
      container.innerHTML = '';
      
      // Calculate positions in a circular layout
      const centerX = container.clientWidth / 2;
      const centerY = container.clientHeight / 2;
      const radius = Math.min(centerX, centerY) * 0.8;
      
      // Create a map for node positions
      const nodePositions: Record<string, { x: number, y: number }> = {};
      
      // Position all nodes
      network.nodes.forEach((node, index) => {
        const angle = (2 * Math.PI * index) / network.nodes.length;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        nodePositions[node.id] = { x, y };
        
        // Create node element
        const nodeElement = document.createElement('div');
        
        // Find corresponding agent or proposal
        const isAgent = node.type === 'agent';
        const entity = isAgent 
          ? agents.find(a => a.id === node.entityId)
          : proposals.find(p => p.id === node.entityId);
        
        if (entity) {
          nodeElement.className = `absolute network-node ${isAgent ? 'agent-node' : 'proposal-node'} ${
            isAgent ? `${(entity as any).type}-node` : ''
          }`;
          
          nodeElement.style.left = `${x}px`;
          nodeElement.style.top = `${y}px`;
          nodeElement.style.transform = 'translate(-50%, -50%)';
          
          nodeElement.innerHTML = isAgent 
            ? (entity as any).avatar 
            : `<div class="text-xs">${(entity as any).title.substring(0, 10)}...</div>`;
          
          nodeElement.title = isAgent 
            ? (entity as any).name 
            : (entity as any).title;
          
          container.appendChild(nodeElement);
        }
      });
      
      // Create SVG element for links
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.style.position = 'absolute';
      svg.style.top = '0';
      svg.style.left = '0';
      svg.style.pointerEvents = 'none';
      
      // Create links
      network.links.forEach(link => {
        const sourcePos = nodePositions[link.source];
        const targetPos = nodePositions[link.target];
        
        if (sourcePos && targetPos) {
          const linkElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          
          linkElement.setAttribute('x1', sourcePos.x.toString());
          linkElement.setAttribute('y1', sourcePos.y.toString());
          linkElement.setAttribute('x2', targetPos.x.toString());
          linkElement.setAttribute('y2', targetPos.y.toString());
          
          const linkColor = link.type === 'vote' 
            ? 'rgba(255, 0, 255, 0.3)' 
            : link.type === 'debate' 
              ? 'rgba(0, 255, 157, 0.3)' 
              : 'rgba(0, 191, 255, 0.3)';
          
          linkElement.setAttribute('stroke', linkColor);
          linkElement.setAttribute('stroke-width', '2');
          linkElement.setAttribute('stroke-dasharray', link.type === 'routing' ? '5,5' : '');
          
          svg.appendChild(linkElement);
        }
      });
      
      container.appendChild(svg);
    };
    
    renderGraph();
    
    // Re-render on window resize
    window.addEventListener('resize', renderGraph);
    return () => window.removeEventListener('resize', renderGraph);
  }, [network, agents, proposals]);

  return (
    <Card className="border border-sidebar-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Agent Network</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={graphRef} 
          className="relative h-[400px] w-full rounded-md bg-sidebar-accent/30 bg-grid-pattern bg-[length:20px_20px]"
        ></div>
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="h-3 w-6 rounded-full bg-inject-pink/30"></div>
            <span>Vote</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-6 rounded-full bg-inject-green/30"></div>
            <span>Debate</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-6 rounded-full bg-inject-cyan/30"></div>
            <span>Routing</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkGraph;
