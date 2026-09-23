import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  Shield,
  Download,
  Share2,
  Printer,
  Calendar,
  Building,
  User,
  CheckCircle2,
  FileCheck,
  FileText,
  Camera,
  Wrench,
  Lock,
  History
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  DEMO_AGREEMENT,
  DEMO_PROPERTY,
  DEMO_PAYMENTS,
  DEMO_EVENTS,
  DEMO_MAINTENANCE,
  DEMO_INSPECTIONS,
  DEMO_DOCUMENTS,
  DEMO_EVIDENCE,
  DEMO_TENANT,
  DEMO_LANDLORD
} from '../lib/demoData';

export default function ReportsPage() {
  const { isDemoMode } = useAuth();

  // Current generation timestamp
  const generatedTimestamp = useMemo(() => {
    return format(new Date(), 'dd MMMM yyyy, HH:mm') + ' IST';
  }, []);

  // Format currency in INR
  const formatINR = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  // Calculated values matching requirements
  const totalPaid = 198000;
  const monthsPaidText = '11/12';
  const onTimeRateText = '100%';
  const depositHeld = 36000;

  // Chart data from DEMO_PAYMENTS
  const chartData = useMemo(() => {
    return DEMO_PAYMENTS.map((payment) => {
      const date = new Date(payment.due_date);
      const isPaid = payment.status === 'paid' || payment.status === 'verified';
      return {
        month: format(date, 'MMM yy'),
        fullMonth: format(date, 'MMMM yyyy'),
        amount: isPaid ? payment.amount : 0,
        dueAmount: payment.amount,
        status: payment.status,
      };
    });
  }, []);

  const handleDownloadPdf = () => {
    alert('PDF download coming soon!');
  };

  const handleShareReport = () => {
    alert('PDF download coming soon!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* ─── Page Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
              Proof Report
            </h1>
            {isDemoMode && (
              <Badge variant="info" size="sm">
                Demo Mode
              </Badge>
            )}
            <Badge variant="success" dot size="sm">
              Ledger Verified
            </Badge>
          </div>
          <p className="text-[#667085] mt-1 text-sm sm:text-base">
            Your complete rental evidence package.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            icon={<Share2 size={16} />}
            onClick={handleShareReport}
          >
            Share Report
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={<Download size={16} />}
            onClick={handleDownloadPdf}
          >
            Download PDF
          </Button>
        </div>
      </motion.div>

      {/* ─── Report Document Preview Card ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl border border-[#E4E7EC] shadow-xl overflow-hidden relative"
      >
        {/* Blue accent bar at top */}
        <div className="h-3 bg-gradient-to-r from-[#3157FF] via-[#5B7BFF] to-[#3157FF] w-full" />

        <div className="p-6 sm:p-10 space-y-8">
          {/* Certificate / Document Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#E4E7EC]">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="bg-[#EFF4FF] p-2 rounded-xl text-[#3157FF] shadow-xs">
                  <Shield size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-[#111827] tracking-tight">
                      Rent<span className="text-[#3157FF]">Proof</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                      Official Dossier
                    </span>
                  </div>
                  <p className="text-xs text-[#667085] font-medium tracking-wide uppercase">
                    Tamper-Evident Rental Evidence Ledger
                  </p>
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#101828] pt-2">
                Certified Tenancy & Evidence Report
              </h2>
              <p className="text-xs sm:text-sm text-[#667085]">
                Comprehensive verifiable proof of tenancy, payment performance, property condition, and compliance.
              </p>
            </div>

            <div className="bg-[#F7F8FA] border border-[#E4E7EC] rounded-xl p-4 min-w-[240px] text-xs space-y-2">
              <div className="flex justify-between items-center text-[#667085]">
                <span>Document Ref:</span>
                <span className="font-mono font-bold text-[#111827]">RP-2026-B402-9842</span>
              </div>
              <div className="flex justify-between items-center text-[#667085]">
                <span>Issued On:</span>
                <span className="font-semibold text-[#111827]">{format(new Date(), 'dd MMM yyyy')}</span>
              </div>
              <div className="flex justify-between items-center text-[#667085]">
                <span>Audit Trail:</span>
                <span className="inline-flex items-center gap-1 font-semibold text-[#3157FF]">
                  <History size={13} /> {DEMO_EVENTS.length} Ledger Events
                </span>
              </div>
              <div className="flex justify-between items-center text-[#667085]">
                <span>Verification:</span>
                <span className="inline-flex items-center gap-1 font-semibold text-[#12B76A]">
                  <CheckCircle2 size={13} /> Blockchain-Ready
                </span>
              </div>
              <div className="pt-1 border-t border-[#E4E7EC] flex items-center justify-between">
                <span className="text-[11px] text-[#667085]">Agreement Status:</span>
                <Badge variant="success" size="sm" dot>
                  {DEMO_AGREEMENT.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>

          {/* Property & Lease Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Property Details */}
            <div className="bg-[#F7F8FA] p-5 rounded-xl border border-[#E4E7EC] space-y-3">
              <div className="flex items-center gap-2 text-[#3157FF] font-semibold text-xs uppercase tracking-wider">
                <Building size={16} />
                <span>Property Details</span>
              </div>
              <div>
                <h3 className="font-bold text-base text-[#111827] leading-snug">
                  {DEMO_PROPERTY.name}
                </h3>
                <p className="text-xs text-[#667085] mt-1">
                  {DEMO_PROPERTY.address}, {DEMO_PROPERTY.city}, {DEMO_PROPERTY.state} - {DEMO_PROPERTY.pincode}
                </p>
              </div>
              <div className="pt-2 border-t border-[#E4E7EC] grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#667085] block">Type</span>
                  <span className="font-semibold text-[#111827]">{DEMO_PROPERTY.property_type}</span>
                </div>
                <div>
                  <span className="text-[#667085] block">Layout</span>
                  <span className="font-semibold text-[#111827]">{DEMO_PROPERTY.bedrooms} BHK / {DEMO_PROPERTY.bathrooms} Bath</span>
                </div>
                <div>
                  <span className="text-[#667085] block">Carpet Area</span>
                  <span className="font-semibold text-[#111827]">{DEMO_PROPERTY.area_sqft} sq.ft</span>
                </div>
                <div>
                  <span className="text-[#667085] block">Amenities</span>
                  <span className="font-semibold text-[#111827] capitalize">{(DEMO_PROPERTY.amenities ?? []).join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Lease Summary */}
            <div className="bg-[#F7F8FA] p-5 rounded-xl border border-[#E4E7EC] space-y-3">
              <div className="flex items-center gap-2 text-[#3157FF] font-semibold text-xs uppercase tracking-wider">
                <Calendar size={16} />
                <span>Lease Summary</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#667085]">Start Date:</span>
                  <span className="font-semibold text-[#111827]">
                    {format(new Date(DEMO_AGREEMENT.start_date), 'dd MMM yyyy')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#667085]">End Date:</span>
                  <span className="font-semibold text-[#111827]">
                    {format(new Date(DEMO_AGREEMENT.end_date), 'dd MMM yyyy')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#667085]">Monthly Rent:</span>
                  <span className="font-bold text-[#111827] text-sm">
                    {formatINR(DEMO_AGREEMENT.rent_amount)} / mo
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#667085]">Security Deposit:</span>
                  <span className="font-bold text-[#111827]">
                    {formatINR(DEMO_AGREEMENT.deposit_amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#E4E7EC]">
                  <span className="text-[#667085]">Payment Due Day:</span>
                  <span className="font-semibold text-[#111827]">Day {DEMO_AGREEMENT.payment_due_day} of month</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#667085]">Terms:</span>
                  <span className="font-medium text-[#111827] text-right truncate max-w-[150px]" title={DEMO_AGREEMENT.terms ?? undefined}>
                    {DEMO_AGREEMENT.terms}
                  </span>
                </div>
              </div>
            </div>

            {/* Parties Involved */}
            <div className="bg-[#F7F8FA] p-5 rounded-xl border border-[#E4E7EC] space-y-3">
              <div className="flex items-center gap-2 text-[#3157FF] font-semibold text-xs uppercase tracking-wider">
                <User size={16} />
                <span>Tenancy Parties</span>
              </div>
              <div className="space-y-3 text-xs">
                {/* Tenant */}
                <div className="p-2.5 bg-white rounded-lg border border-[#E4E7EC]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-[#3157FF] tracking-wide">
                      Tenant
                    </span>
                    <Badge variant="success" size="sm">KYC Verified</Badge>
                  </div>
                  <p className="font-bold text-sm text-[#111827] mt-0.5">{DEMO_TENANT.full_name}</p>
                  <p className="text-[#667085] text-[11px]">{DEMO_TENANT.email} • {DEMO_TENANT.phone}</p>
                </div>

                {/* Landlord */}
                <div className="p-2.5 bg-white rounded-lg border border-[#E4E7EC]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-[#101828] tracking-wide">
                      Landlord
                    </span>
                    <Badge variant="info" size="sm">Owner Verified</Badge>
                  </div>
                  <p className="font-bold text-sm text-[#111827] mt-0.5">{DEMO_LANDLORD.full_name}</p>
                  <p className="text-[#667085] text-[11px]">{DEMO_LANDLORD.email} • {DEMO_LANDLORD.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary Section with Recharts Mini Chart */}
          <div className="border border-[#E4E7EC] rounded-xl p-6 bg-white space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E4E7EC]">
              <div>
                <h3 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                  <span>Payment Performance & Record</span>
                  <Badge variant="success" size="sm">100% On-Time</Badge>
                </h3>
                <p className="text-xs text-[#667085]">
                  Audited rent payments and security deposit ledger for Flat B-402
                </p>
              </div>
              <div className="text-xs text-[#667085] font-medium">
                Cycle: Oct 2025 – Sep 2026
              </div>
            </div>

            {/* 4 Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E4E7EC]">
                <span className="text-xs text-[#667085] block font-medium">Total Paid</span>
                <span className="text-xl sm:text-2xl font-extrabold text-[#111827] block mt-1">
                  {formatINR(totalPaid)}
                </span>
                <span className="text-[11px] text-[#12B76A] font-semibold flex items-center gap-1 mt-1">
                  <CheckCircle2 size={12} /> 11 Installments
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E4E7EC]">
                <span className="text-xs text-[#667085] block font-medium">Months Paid</span>
                <span className="text-xl sm:text-2xl font-extrabold text-[#111827] block mt-1">
                  {monthsPaidText}
                </span>
                <span className="text-[11px] text-[#667085] font-medium block mt-1">
                  Sep 2026 pending
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E4E7EC]">
                <span className="text-xs text-[#667085] block font-medium">On-Time Rate</span>
                <span className="text-xl sm:text-2xl font-extrabold text-[#12B76A] block mt-1">
                  {onTimeRateText}
                </span>
                <span className="text-[11px] text-[#12B76A] font-semibold block mt-1">
                  0 Late / Overdue
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E4E7EC]">
                <span className="text-xs text-[#667085] block font-medium">Deposit Held</span>
                <span className="text-xl sm:text-2xl font-extrabold text-[#3157FF] block mt-1">
                  {formatINR(depositHeld)}
                </span>
                <span className="text-[11px] text-[#667085] font-medium block mt-1">
                  Bank Transfer • Safe
                </span>
              </div>
            </div>

            {/* Recharts Mini Payment Area Chart */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#111827]">Monthly Payment Trajectory</span>
                <span className="text-[#667085]">Rent: {formatINR(18000)} / month</span>
              </div>
              <div className="h-44 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 12, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="paymentReportGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3157FF" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#3157FF" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2F4F7" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#667085', fontSize: 11 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#667085', fontSize: 11 }}
                      tickFormatter={(value) => `₹${value / 1000}k`}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-[#101828] text-white px-3 py-2 rounded-lg text-xs shadow-lg space-y-1">
                              <p className="font-semibold">{data.fullMonth}</p>
                              <p className="text-gray-300">
                                Amount Paid: <span className="font-bold text-white">₹{data.amount.toLocaleString('en-IN')}</span>
                              </p>
                              <p className="text-gray-300 capitalize">
                                Status: <span className="font-medium text-[#12B76A]">{data.status}</span>
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#3157FF"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#paymentReportGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap items-center justify-between text-[11px] text-[#667085] pt-1">
                <span>* 10 payments verified by landlord • 1 payment submitted & verified via UPI • 1 month pending (Sep 2026)</span>
                <span className="font-medium text-[#111827]">Consistent Timely Settlement</span>
              </div>
            </div>
          </div>

          {/* Inspection & Maintenance Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inspection Summary */}
            <div className="border border-[#E4E7EC] rounded-xl p-5 bg-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC]">
                <div className="flex items-center gap-2">
                  <div className="bg-[#EFF4FF] p-1.5 rounded-lg text-[#3157FF]">
                    <FileCheck size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#111827]">Property Inspections</h3>
                    <p className="text-[11px] text-[#667085]">3 Scheduled & Completed Audits</p>
                  </div>
                </div>
                <Badge variant="neutral" size="sm">3 Total</Badge>
              </div>

              <div className="space-y-3">
                {DEMO_INSPECTIONS.map((inspection) => {
                  const getStatusBadge = (status: string) => {
                    switch (status) {
                      case 'signed_off':
                        return <Badge variant="success" size="sm">Signed Off</Badge>;
                      case 'completed':
                        return <Badge variant="info" size="sm">Completed</Badge>;
                      case 'scheduled':
                        return <Badge variant="warning" size="sm">Scheduled</Badge>;
                      default:
                        return <Badge variant="neutral" size="sm">{status}</Badge>;
                    }
                  };

                  const getTypeName = (type: string) => {
                    switch (type) {
                      case 'move_in': return 'Move-In Inspection';
                      case 'routine': return '6-Month Routine Audit';
                      case 'move_out': return 'Move-Out Inspection';
                      default: return type;
                    }
                  };

                  return (
                    <div
                      key={inspection.id}
                      className="p-3 bg-[#F7F8FA] rounded-lg border border-[#E4E7EC] text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#111827]">
                          {getTypeName(inspection.inspection_type)}
                        </span>
                        {getStatusBadge(inspection.status)}
                      </div>
                      <div className="flex items-center justify-between text-[#667085] text-[11px]">
                        <span>Date: {format(new Date(inspection.inspection_date), 'dd MMM yyyy')}</span>
                        <span>
                          {inspection.tenant_signed && inspection.landlord_signed
                            ? 'Dual Signed ✓'
                            : 'Pending Completion'}
                        </span>
                      </div>
                      {inspection.overall_condition && (
                        <p className="text-[11px] text-gray-700 italic border-t border-[#E4E7EC] pt-1">
                          "{inspection.overall_condition}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Maintenance Summary */}
            <div className="border border-[#E4E7EC] rounded-xl p-5 bg-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E4E7EC]">
                <div className="flex items-center gap-2">
                  <div className="bg-[#EFF4FF] p-1.5 rounded-lg text-[#3157FF]">
                    <Wrench size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#111827]">Maintenance Summary</h3>
                    <p className="text-[11px] text-[#667085]">5 Service Requests Logged</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#667085]">
                  <span>2 Resolved</span> • <span>1 In Prog</span> • <span>1 Ack</span> • <span>1 Rep</span>
                </div>
              </div>

              <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                {DEMO_MAINTENANCE.map((item) => {
                  const getStatusBadge = (status: string) => {
                    switch (status) {
                      case 'resolved':
                      case 'closed':
                        return <Badge variant="success" size="sm">Resolved</Badge>;
                      case 'in_progress':
                        return <Badge variant="info" size="sm">In Progress</Badge>;
                      case 'acknowledged':
                        return <Badge variant="warning" size="sm">Acknowledged</Badge>;
                      case 'reported':
                        return <Badge variant="neutral" size="sm">Reported</Badge>;
                      default:
                        return <Badge variant="neutral" size="sm">{status}</Badge>;
                    }
                  };

                  return (
                    <div
                      key={item.id}
                      className="p-2.5 bg-[#F7F8FA] rounded-lg border border-[#E4E7EC] text-xs flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-[#111827] truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-[#667085]">
                          {item.room} • {item.category} • Priority: <span className="capitalize">{item.priority}</span>
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Document Locker & Evidence Counts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Document Count & Locker */}
            <div className="bg-[#F7F8FA] p-5 rounded-xl border border-[#E4E7EC] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="text-[#3157FF]" size={18} />
                  <h4 className="font-bold text-sm text-[#111827]">
                    Document Vault
                  </h4>
                </div>
                <Badge variant="info" size="sm">
                  {DEMO_DOCUMENTS.length} Documents in Locker
                </Badge>
              </div>
              <p className="text-xs text-[#667085]">
                Includes executed rental agreement, tenant KYC identity proofs, tax receipts, and NOCs.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                {DEMO_DOCUMENTS.slice(0, 6).map((doc) => (
                  <div
                    key={doc.id}
                    className="p-2 bg-white rounded-md border border-[#E4E7EC] truncate flex items-center gap-1.5"
                    title={doc.name}
                  >
                    <FileCheck size={12} className="text-[#12B76A] flex-shrink-0" />
                    <span className="truncate text-[#111827]">{doc.name}</span>
                  </div>
                ))}
              </div>
              {DEMO_DOCUMENTS.length > 6 && (
                <p className="text-[11px] text-[#667085] italic text-right">
                  + {DEMO_DOCUMENTS.length - 6} more archived documents
                </p>
              )}
            </div>

            {/* Evidence Count */}
            <div className="bg-[#F7F8FA] p-5 rounded-xl border border-[#E4E7EC] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="text-[#3157FF]" size={18} />
                  <h4 className="font-bold text-sm text-[#111827]">
                    Digital Evidence Vault
                  </h4>
                </div>
                <Badge variant="info" size="sm">
                  {DEMO_EVIDENCE.length} Evidence Items
                </Badge>
              </div>
              <p className="text-xs text-[#667085]">
                Timestamped move-in photos, repair before/after captures, and appliance inspection proofs.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                {DEMO_EVIDENCE.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    className="p-2 bg-white rounded-md border border-[#E4E7EC] truncate flex items-center gap-1.5"
                    title={item.title}
                  >
                    <CheckCircle2 size={12} className="text-[#3157FF] flex-shrink-0" />
                    <span className="truncate text-[#111827]">{item.title}</span>
                  </div>
                ))}
              </div>
              {DEMO_EVIDENCE.length > 6 && (
                <p className="text-[11px] text-[#667085] italic text-right">
                  + {DEMO_EVIDENCE.length - 6} more photographic records
                </p>
              )}
            </div>
          </div>

          {/* Certificate Footer / Sign-off / Generated timestamp */}
          <div className="pt-6 border-t border-[#E4E7EC] space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Tenant Sign block */}
              <div className="p-4 rounded-xl border border-dashed border-[#D0D5DD] bg-[#FAFAFA] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#667085] tracking-wider block">
                    Tenant Digital Signature
                  </span>
                  <p className="font-semibold text-sm text-[#111827] mt-0.5">{DEMO_TENANT.full_name}</p>
                  <p className="text-[10px] text-[#667085]">Signed electronically on 01 Oct 2025</p>
                </div>
                <div className="text-right">
                  <Badge variant="success" size="sm">VERIFIED</Badge>
                </div>
              </div>

              {/* Landlord Sign block */}
              <div className="p-4 rounded-xl border border-dashed border-[#D0D5DD] bg-[#FAFAFA] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#667085] tracking-wider block">
                    Landlord Digital Signature
                  </span>
                  <p className="font-semibold text-sm text-[#111827] mt-0.5">{DEMO_LANDLORD.full_name}</p>
                  <p className="text-[10px] text-[#667085]">Signed electronically on 01 Oct 2025</p>
                </div>
                <div className="text-right">
                  <Badge variant="success" size="sm">VERIFIED</Badge>
                </div>
              </div>
            </div>

            {/* Generated on timestamp & Authenticity Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-[#E4E7EC] text-xs text-[#667085]">
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-[#3157FF]" />
                <span>
                  Generated on <strong className="text-[#111827]">{generatedTimestamp}</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <span className="inline-block w-2 h-2 rounded-full bg-[#12B76A]" />
                <span>Cryptographic Digest: SHA256:7f8a92...b402e1</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── Actions Below Preview Card ─── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="bg-white rounded-xl border border-[#E4E7EC] p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="text-center sm:text-left">
          <h4 className="font-bold text-base text-[#111827]">
            Ready to export this Proof Report?
          </h4>
          <p className="text-xs sm:text-sm text-[#667085] mt-0.5">
            Download the tamper-evident PDF or share an instant verifiable link with your bank, society, or landlord.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="lg"
            icon={<Printer size={18} />}
            onClick={handlePrint}
          >
            Print
          </Button>
          <Button
            variant="outline"
            size="lg"
            icon={<Share2 size={18} />}
            onClick={handleShareReport}
          >
            Share Report
          </Button>
          <Button
            variant="primary"
            size="lg"
            icon={<Download size={18} />}
            onClick={handleDownloadPdf}
          >
            Download PDF
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
