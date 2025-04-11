
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Proposal } from '@/types';
import { Activity, FileText, CheckCircle, Clock } from 'lucide-react';

interface DashboardStatsProps {
  proposals: Proposal[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ proposals }) => {
  const total = proposals.length;
  const pending = proposals.filter(p => p.status === 'pending' || p.status === 'reviewing' || p.status === 'debating' || p.status === 'voting').length;
  const approved = proposals.filter(p => p.status === 'approved' || p.status === 'executed').length;
  const rejected = proposals.filter(p => p.status === 'rejected').length;
  
  const stats = [
    {
      title: 'Total Proposals',
      value: total,
      icon: <FileText className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: 'Pending Review',
      value: pending,
      icon: <Clock className="h-5 w-5 text-inject-cyan" />,
    },
    {
      title: 'Approved',
      value: approved,
      icon: <CheckCircle className="h-5 w-5 text-inject-green" />,
    },
    {
      title: 'Activity Score',
      value: `${(total > 0 ? (approved / total) * 100 : 0).toFixed(0)}%`,
      icon: <Activity className="h-5 w-5 text-inject-pink" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border border-sidebar-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="mt-1 text-2xl font-bold">{stat.value}</h3>
              </div>
              <div className="rounded-full bg-sidebar-accent p-3">
                {stat.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
