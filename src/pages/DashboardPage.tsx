import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Users, DollarSign, AlertCircle, FileText, CheckCircle, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardMetrics } from '../services/propertyService';
import { getRecentEvents } from '../services/timelineService';
import { DashboardMetrics, RentalEvent } from '../types';
import { MetricCard } from '../components/dashboard/MetricCard';
import { RentalHealthScore } from '../components/dashboard/RentalHealthScore';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { QuickActions } from '../components/dashboard/QuickActions';

const mockChartData = [
  { month: 'Jan', amount: 18000 },
  { month: 'Feb', amount: 18000 },
  { month: 'Mar', amount: 18000 },
  { month: 'Apr', amount: 18000 },
  { month: 'May', amount: 18000 },
  { month: 'Jun', amount: 18000 },
];

export default function DashboardPage() {
  const { profile, agreement, isLandlord } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [events, setEvents] = useState<RentalEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!profile) return;
      try {
        const [m, e] = await Promise.all([
          agreement?.id ? getDashboardMetrics(agreement.id, isLandlord ? 'landlord' : 'tenant') : Promise.resolve(null),
          agreement?.id ? getRecentEvents(agreement.id, 5) : Promise.resolve([]),
        ]);
        setMetrics(m as unknown as DashboardMetrics);
        setEvents(e);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [profile, agreement, isLandlord]);

  const firstName = profile?.full_name?.split(' ')[0] || 'User';

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#111827]">Welcome back, {firstName} 👋</h1>
      </div>

      {!isLandlord ? (
        <>
          {/* Tenant View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Monthly Rent" value="₹18,000" icon={DollarSign} color="brand" />
            <MetricCard title="Rental Health" value="87/100" icon={TrendingUp} color="success" />
            <MetricCard title="Open Issues" value="2" icon={AlertCircle} color="warning" />
            <MetricCard title="Documents" value="8" icon={FileText} color="brand" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Chart */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-xl border border-[#E4E7EC] shadow-sm">
                <h3 className="text-lg font-semibold text-[#111827] mb-6">Payment History</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3157FF" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#3157FF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E7EC" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#667085', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#667085', fontSize: 12 }} dx={-10} tickFormatter={(v) => `₹${v/1000}k`} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="amount" stroke="#3157FF" strokeWidth={2} fillOpacity={1} fill="url(#colorAmount)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
              
              <RecentActivity events={events} loading={loading} />
            </div>

            <div className="space-y-6">
              <RentalHealthScore score={87} breakdown={{ payment: 100, maintenance: 60, documentation: 90 }} />
              <QuickActions />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Landlord View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Properties" value="1" icon={Home} color="brand" />
            <MetricCard title="Active Tenants" value="1" icon={Users} color="brand" />
            <MetricCard title="Monthly Revenue" value="₹18,000" icon={DollarSign} color="success" />
            <MetricCard title="Pending Actions" value="3" icon={AlertCircle} color="warning" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivity events={events} loading={loading} />
            <div className="bg-white p-6 rounded-xl border border-[#E4E7EC] shadow-sm">
              <h3 className="text-lg font-semibold text-[#111827] mb-6">Revenue Trend</h3>
              <div className="h-64 flex items-center justify-center text-[#667085]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#12B76A" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#12B76A" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E7EC" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#667085', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#667085', fontSize: 12 }} dx={-10} tickFormatter={(v) => `₹${v/1000}k`} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="amount" stroke="#12B76A" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
