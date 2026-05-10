"use client";

import { useState } from "react";
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
  ArrowLeft
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const PAYMENTS_DATA = [
  { id: "PAY-901", user: "Anish Kumar", email: "anish@example.com", amount: "₹4,999", status: "Success", method: "UPI", rzp_id: "pay_NzkX9z8L1", date: "2024-05-09 14:20" },
  { id: "PAY-902", user: "Sanya Malhotra", email: "sanya@example.com", amount: "₹4,999", status: "Pending", method: "Card", rzp_id: "pay_NzkY1v2M4", date: "2024-05-09 13:45" },
  { id: "PAY-903", user: "Rohan Das", email: "rohan@example.com", amount: "₹2,499", status: "Success", method: "GPay", rzp_id: "pay_NzkZ5p9Q2", date: "2024-05-08 18:10" },
  { id: "PAY-904", user: "Megha Gupta", email: "megha@example.com", amount: "₹4,999", status: "Failed", method: "PhonePe", rzp_id: "pay_NzkA3n7B1", date: "2024-05-08 11:30" },
  { id: "PAY-905", user: "Vikram Singh", email: "vikram@example.com", amount: "₹4,999", status: "Success", method: "UPI", rzp_id: "pay_NzkB8k2W5", date: "2024-05-07 16:50" },
  { id: "PAY-906", user: "Neha Sharma", email: "neha@example.com", amount: "₹4,999", status: "Refunded", method: "Card", rzp_id: "pay_NzkC4v9L0", date: "2024-05-07 09:15" },
];

const STATUS_CONFIG: any = {
  "Success": { color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20", icon: CheckCircle2 },
  "Pending": { color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: Clock },
  "Failed": { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", icon: XCircle },
  "Refunded": { color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: ArrowLeft },
};

export default function PaymentsPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Payments & Revenue</h1>
          <p className="text-muted-foreground">Monitor transactions and financial performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
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
              <p className="text-xs font-bold text-primary uppercase">Monthly Revenue</p>
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-3xl font-black">₹12.42L</h2>
            <div className="flex items-center gap-1 text-xs font-bold text-green-500 mt-2">
              +15.2% <ArrowUpRight className="w-3 h-3" /> <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/5 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-green-500 uppercase">Successful Payments</p>
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            </div>
            <h2 className="text-3xl font-black">428</h2>
            <div className="flex items-center gap-1 text-xs font-bold text-green-500 mt-2">
              98.2% <span className="text-muted-foreground ml-1">Success Rate</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-orange-500/5 border-orange-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-orange-500 uppercase">Pending / Failed</p>
              <XCircle className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="text-3xl font-black">24</h2>
            <div className="flex items-center gap-1 text-xs font-bold text-red-500 mt-2">
              -4.5% <ArrowDownRight className="w-3 h-3" /> <span className="text-muted-foreground ml-1">from yesterday</span>
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
                  placeholder="Search by ID, User, RZP ID..." 
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
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Transaction ID</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase">User</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Amount</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Status</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Method</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase">RZP ID</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {PAYMENTS_DATA.map((pay) => {
                const StatusIcon = STATUS_CONFIG[pay.status]?.icon || ShieldCheck;
                return (
                  <tr key={pay.id} className="hover:bg-accent/50 transition-colors group">
                    <td className="p-4 font-bold text-sm text-primary">{pay.id}</td>
                    <td className="p-4">
                      <div>
                        <div className="font-bold text-sm">{pay.user}</div>
                        <div className="text-[10px] text-muted-foreground">{pay.email}</div>
                      </div>
                    </td>
                    <td className="p-4 font-black text-sm">{pay.amount}</td>
                    <td className="p-4">
                      <Badge className={`text-[10px] gap-1 px-2 py-0.5 ${STATUS_CONFIG[pay.status]?.bg} ${STATUS_CONFIG[pay.status]?.color} ${STATUS_CONFIG[pay.status]?.border}`}>
                        <StatusIcon className="w-3 h-3" /> {pay.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-xs font-semibold text-muted-foreground">{pay.method}</td>
                    <td className="p-4">
                       <code className="text-[10px] bg-accent p-1 rounded font-mono">{pay.rzp_id}</code>
                    </td>
                    <td className="p-4 text-[10px] text-muted-foreground font-medium">{pay.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border flex justify-center">
            <Button variant="ghost" className="text-sm font-bold text-primary gap-2">
                Load More Transactions <Download className="w-4 h-4" />
            </Button>
        </div>
      </Card>
    </div>
  );
}
