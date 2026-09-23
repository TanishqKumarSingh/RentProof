import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Users, DollarSign, AlertCircle, FileText, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardMetrics } from '../services/propertyService';
import { getRecentEvents } from '../services/timelineService';
import { DashboardMetrics, RentalEvent } from '../types';
import { MetricCard } from '../components/dashboard/MetricCard';
import { RentalHealthScore } from '../components/dashboard/RentalHealthScore';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { QuickActions } from '../components/dashboard/QuickActions';
import { getDemoMetrics, DEMO_EVENTS } from '../lib/demoData';

const tenantChartData = [
  { month: 'Apr', amount: 18000 },
  { month: 'May', amount: 18000 },
  { month: 'Jun', amount: 18000 },
  { month: 'Jul', amount: 18000 },
  { month: 'Aug', amount: 18000 },
  { month: 'Sep', amount: 18000 },
];

const landlordChartData = [
  { month: 'Apr', amount: 18000 },
  { month: 'May', amount: 18000 },
  { month: 'Jun', amount: 36000 },
  { month: 'Jul', amount: 18000 },
  { month: 'Aug', amount: 18000 },
  { month: 'Sep', amount: 0 },
];

export default function DashboardPage() {
  const { profile, agreement, isLandlord, isDemoMode } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [events, setEvents] = useState<RentalEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!profile) return;

      if (isDemoMode) {
        const role = isLandlord ? 'landlord' : 'tenant';
        setMetrics(getDemoMetrics(role));
        setEvents(DEMO_EVENTS.slice(-5));
        setLoading(false);
        return;
      }

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
  }, [profile, agreement, isLandlord, isDemoMode]);

  const firstName = profile?.full_name?.split(' ')[0] || 'User';

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[#111827]">Welcome back, {firstName} 👋</h1>
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${isLandlord ? 'bg-[#101828] text-white' : 'bg-[#3157FF] text-white'}`}>
            {isLandlord ? '🏢 Landlord View' : '🏠 Tenant View'}
          </span>
        </div>
      </div>

      {/* AI Inspection CTA */}
      <div className="bg-gradient-to-r from-[#111827] to-[#1E293B] rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#3157FF] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">New</span>
            <h2 className="text-xl font-bold">AI Property Inspection</h2>
          </div>
          <p className="text-gray-300 text-sm max-w-xl">
            RentProof now uses AI to document and analyze your property's condition. 
            Compare move-in and move-out records instantly to resolve deposit disputes.
          </p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-4">
          <div className="text-center hidden sm:block">
            <div className="text-2xl font-black text-[#12B76A]">78<span className="text-sm font-normal text-gray-400">/100</span></div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider">Latest Score</div>
          </div>
          <a 
            href="/ai-inspect"
            className="bg-[#3157FF] hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors whitespace-nowrap shadow-lg shadow-[#3157FF]/30"
          >
            Start AI Inspection
          </a>
        </div>
      </div>

      {!isLandlord ? (
        <>
          {/* ═══════ TENANT VIEW ═══════ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Monthly Rent" value={`₹${(metrics?.monthlyRent ?? 18000).toLocaleString('en-IN')}`} icon={DollarSign} color="brand" />
            <MetricCard title="Rental Health" value={`${metrics?.healthScore ?? 87}/100`} icon={TrendingUp} color="success" />
            <MetricCard title="Open Issues" value={String(metrics?.openIssues ?? 2)} icon={AlertCircle} color="warning" />
            <MetricCard title="Documents" value={String(metrics?.documentCount ?? 8)} icon={FileText} color="brand" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Chart */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-xl border border-[#E4E7EC] shadow-sm">
                <h3 className="text-lg font-semibold text-[#111827] mb-6">Payment History</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={tenantChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
              <RentalHealthScore score={metrics?.healthScore ?? 87} breakdown={{ payment: 100, maintenance: 60, documentation: 90 }} />
              <QuickActions />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* ═══════ LANDLORD VIEW ═══════ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Properties" value="1" icon={Home} color="brand" />
            <MetricCard title="Active Tenants" value="1" icon={Users} color="brand" />
            <MetricCard title="Monthly Revenue" value="₹18,000" icon={DollarSign} color="success" />
            <MetricCard title="Pending Actions" value="3" icon={AlertCircle} color="warning" />
          </div>

          {/* Landlord-specific info cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-xl border border-[#E4E7EC] shadow-sm">
              <h3 className="text-lg font-semibold text-[#111827] mb-4">Property Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-[#E4E7EC]">
                  <span className="text-sm text-[#667085]">Property</span>
                  <span className="text-sm font-medium text-[#111827]">Sunrise Residency, Flat B-402</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#E4E7EC]">
                  <span className="text-sm text-[#667085]">Location</span>
                  <span className="text-sm font-medium text-[#111827]">Indirapuram, Ghaziabad</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#E4E7EC]">
                  <span className="text-sm text-[#667085]">Tenant</span>
                  <span className="text-sm font-medium text-[#111827]">Aarav Sharma</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#E4E7EC]">
                  <span className="text-sm text-[#667085]">Lease Period</span>
                  <span className="text-sm font-medium text-[#111827]">Oct 2025 – Sep 2026</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#E4E7EC]">
                  <span className="text-sm text-[#667085]">Monthly Rent</span>
                  <span className="text-sm font-bold text-[#12B76A]">₹18,000</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-[#667085]">Security Deposit</span>
                  <span className="text-sm font-medium text-[#111827]">₹36,000</span>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-xl border border-[#E4E7EC] shadow-sm">
              <h3 className="text-lg font-semibold text-[#111827] mb-4">Pending Actions</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-[#FFF4ED] border border-[#F79009]/20 rounded-lg">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-[#F79009]" />
                  <div>
                    <p className="text-sm font-medium text-[#111827]">Verify Aug 2026 Payment</p>
                    <p className="text-xs text-[#667085] mt-0.5">₹18,000 paid by Aarav on 2 Aug</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-[#FFF4ED] border border-[#F79009]/20 rounded-lg">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-[#F79009]" />
                  <div>
                    <p className="text-sm font-medium text-[#111827]">Sep 2026 Rent Due</p>
                    <p className="text-xs text-[#667085] mt-0.5">₹18,000 payment pending from tenant</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-[#ECFDF3] border border-[#12B76A]/20 rounded-lg">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-[#12B76A]" />
                  <div>
                    <p className="text-sm font-medium text-[#111827]">Schedule Year-End Inspection</p>
                    <p className="text-xs text-[#667085] mt-0.5">Lease ends Sep 30 — plan move-out check</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivity events={events} loading={loading} />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-xl border border-[#E4E7EC] shadow-sm">
              <h3 className="text-lg font-semibold text-[#111827] mb-6">Revenue Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={landlordChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
