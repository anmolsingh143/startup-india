"use client";

import { useState, useEffect } from "react";
import type { ComponentType, SVGProps } from "react";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Zap,
  TrendingUp,
  Receipt,
  ArrowLeft,
  Loader2,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type PaymentStatus = "Successful" | "Pending" | "Created" | "Failed" | "Refunded";

type PaymentRecord = {
  _id: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amount: number;
  status: PaymentStatus;
  itemType?: string;
  itemId?: string;
  createdAt: string;
};

const STATUS_CONFIG: Record<PaymentStatus, { color: string; bg: string; border: string; icon: ComponentType<SVGProps<SVGSVGElement>> }> = {
  "Successful": { color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20", icon: CheckCircle2 },
  "Pending": { color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: Clock },
  "Created": { color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: ShieldCheck },
  "Failed": { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", icon: XCircle },
  "Refunded": { color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: ArrowLeft },
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [revenue, setRevenue] = useState(0);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/payments");
      const data: unknown = await res.json();

      if (!res.ok) {
        throw new Error((data as { error?: string }).error || "Failed to fetch payments");
      }

      const paymentList = Array.isArray(data) ? data as PaymentRecord[] : [];
      setPayments(paymentList);
      
      const total = paymentList
        .filter((p) => p.status === "Successful")
        .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
      setRevenue(total);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      void fetchPayments();
    });
  }, []);

  const filteredPayments = payments.filter(p => 
    (p.razorpayOrderId || "").toLowerCase().includes(search.toLowerCase()) || 
    (p.razorpayPaymentId && p.razorpayPaymentId.toLowerCase().includes(search.toLowerCase()))
  );

  const exportCsv = () => {
    const header = ["Order ID", "Razorpay ID", "Item", "Amount", "Status", "Date"];
    const rows = filteredPayments.map((payment) => [
      payment.razorpayOrderId || "",
      payment.razorpayPaymentId || "",
      payment.itemType || "",
      payment.amount,
      payment.status,
      new Date(payment.createdAt).toLocaleString(),
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "admin-payments.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Payments & Revenue</h1>
          <p className="text-muted-foreground">Monitor transactions and financial performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={fetchPayments} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="outline" className="gap-2" onClick={exportCsv} disabled={!filteredPayments.length}>
            <Download className="w-4 h-4" /> Reports
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
            <TrendingUp className="w-4 h-4" /> Revenue Settings
          </Button>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-primary uppercase">Total Revenue</p>
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-3xl font-black">₹{(revenue / 100000).toFixed(2)}L</h2>
            <div className="flex items-center gap-1 text-xs font-bold text-green-500 mt-2">
              Live <span className="text-muted-foreground ml-1">Real-time stats</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/5 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-green-500 uppercase">Successful</p>
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            </div>
            <h2 className="text-3xl font-black">{payments.filter(p => p.status === "Successful").length}</h2>
            <div className="flex items-center gap-1 text-xs font-bold text-green-500 mt-2">
              {((payments.filter(p => p.status === "Successful").length / (payments.length || 1)) * 100).toFixed(1)}% <span className="text-muted-foreground ml-1">Success Rate</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-orange-500/5 border-orange-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-orange-500 uppercase">Total Transactions</p>
              <Receipt className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="text-3xl font-black">{payments.length}</h2>
            <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground mt-2">
              Including created & pending
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="border-b border-border p-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <CardTitle className="text-lg font-bold">Transaction History</CardTitle>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search by ID, RZP ID..." 
                  className="pl-9 bg-background/50 h-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" /> Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground font-medium">Fetching transaction history...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Order ID</th>
                  <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Item</th>
                  <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Amount</th>
                  <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Status</th>
                  <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Razorpay ID</th>
                  <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPayments.length > 0 ? filteredPayments.map((pay) => {
                  const statusConfig = STATUS_CONFIG[pay.status] || STATUS_CONFIG.Created;
                  const StatusIcon = statusConfig.icon;
                  return (
                    <tr key={pay._id} className="hover:bg-accent/50 transition-colors group">
                      <td className="p-4 font-bold text-sm text-primary truncate max-w-[150px]">{pay.razorpayOrderId || "N/A"}</td>
                      <td className="p-4">
                        <div>
                          <div className="font-bold text-sm">{pay.itemType}</div>
                          <div className="text-[10px] text-muted-foreground">ID: {pay.itemId}</div>
                        </div>
                      </td>
                      <td className="p-4 font-black text-sm">₹{pay.amount.toLocaleString()}</td>
                      <td className="p-4">
                        <Badge className={`text-[10px] gap-1 px-2 py-0.5 ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`}>
                          <StatusIcon className="w-3 h-3" /> {pay.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                         <code className="text-[10px] bg-accent p-1 rounded font-mono">{pay.razorpayPaymentId || "N/A"}</code>
                      </td>
                      <td className="p-4 text-[10px] text-muted-foreground font-medium">
                        {new Date(pay.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground italic">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        <div className="p-4 border-t border-border flex justify-center">
            <Button variant="ghost" className="text-sm font-bold text-primary gap-2" onClick={fetchPayments}>
                Refresh Transactions <RefreshCw className="w-4 h-4" />
            </Button>
        </div>
      </Card>
    </div>
  );
}
