"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  HeadphonesIcon, 
  Search, 
  Filter, 
  Plus, 
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  ChevronRight,
  User,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const TICKETS_DATA = [
  { id: "TKT-501", user: "Anish Kumar", issue: "Payment failed but amount deducted", priority: "High", status: "Open", assigned: "Rahul Sharma", date: "10 mins ago" },
  { id: "TKT-502", user: "Sanya Malhotra", issue: "Unable to access the internship hub", priority: "Medium", status: "Pending", assigned: "Priya Verma", date: "45 mins ago" },
  { id: "TKT-503", user: "Rohan Das", issue: "Wrong certificate name generated", priority: "Low", status: "Resolved", assigned: "Amit Kumar", date: "2 hours ago" },
  { id: "TKT-504", user: "Megha Gupta", issue: "Inquiry about next month's batch", priority: "Low", status: "Open", assigned: "Rahul Sharma", date: "3 hours ago" },
  { id: "TKT-505", user: "Vikram Singh", issue: "Refund request for course cancellation", priority: "High", status: "Pending", assigned: "Sunita Rao", date: "5 hours ago" },
];

const PRIORITY_COLORS: any = {
  "High": "bg-red-500/10 text-red-500 border-red-500/20",
  "Medium": "bg-orange-500/10 text-orange-500 border-orange-500/20",
  "Low": "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

const STATUS_CONFIG: any = {
  "Open": { color: "text-blue-500", bg: "bg-blue-500/10", icon: AlertCircle },
  "Pending": { color: "text-yellow-500", bg: "bg-yellow-500/10", icon: Clock },
  "Resolved": { color: "text-green-500", bg: "bg-green-500/10", icon: CheckCircle2 },
};

export default function SupportPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Support Tickets</h1>
          <p className="text-muted-foreground">Manage user inquiries and technical issues.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <MessageSquare className="w-4 h-4" /> WhatsApp Support
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" /> Create Ticket
          </Button>
        </div>
      </div>

      {/* Ticket Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Active Tickets", count: 18, color: "text-blue-500", icon: AlertCircle },
          { label: "Pending Response", count: 7, color: "text-orange-500", icon: Clock },
          { label: "Resolved Today", count: 42, color: "text-green-500", icon: CheckCircle2 },
        ].map((s) => (
          <Card key={s.label} className="bg-card/50 border-border/50">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase mb-1">{s.label}</p>
                <h3 className={`text-3xl font-black ${s.color}`}>{s.count}</h3>
              </div>
              <div className={`w-12 h-12 rounded-2xl bg-accent border border-border flex items-center justify-center`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tickets List */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="p-4 border-b border-border">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="bg-primary/10 text-primary border-primary/20 h-8 px-4 font-bold">All Tickets</Button>
              <Button size="sm" variant="ghost" className="text-muted-foreground h-8 px-4 font-bold">Open</Button>
              <Button size="sm" variant="ghost" className="text-muted-foreground h-8 px-4 font-bold">Pending</Button>
              <Button size="sm" variant="ghost" className="text-muted-foreground h-8 px-4 font-bold">Resolved</Button>
            </div>
            <div className="relative flex-1 md:w-64 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search issue or user..." 
                className="pl-9 bg-background/50 h-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Ticket ID</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase">User</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Issue</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Priority</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Status</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Assigned</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {TICKETS_DATA.map((t) => {
                const StatusIcon = STATUS_CONFIG[t.status].icon;
                return (
                  <tr key={t.id} className="hover:bg-accent/50 transition-colors group cursor-pointer">
                    <td className="p-4 font-bold text-sm text-primary">{t.id}</td>
                    <td className="p-4">
                       <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-accent border border-border flex items-center justify-center text-[10px] font-bold">
                             {t.user[0]}
                          </div>
                          <span className="text-sm font-bold">{t.user}</span>
                       </div>
                    </td>
                    <td className="p-4">
                       <div className="max-w-[250px]">
                          <div className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{t.issue}</div>
                          <div className="text-[10px] text-muted-foreground">Category: Technical Support</div>
                       </div>
                    </td>
                    <td className="p-4">
                      <Badge className={`text-[10px] font-bold px-2 py-0.5 ${PRIORITY_COLORS[t.priority]}`}>
                        {t.priority}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className={`flex items-center gap-1.5 text-xs font-bold ${STATUS_CONFIG[t.status].color}`}>
                        <StatusIcon className="w-3.5 h-3.5" /> {t.status}
                      </div>
                    </td>
                    <td className="p-4 text-sm font-semibold text-muted-foreground">{t.assigned}</td>
                    <td className="p-4 text-[10px] text-muted-foreground font-medium">{t.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border flex justify-between items-center">
            <p className="text-xs text-muted-foreground">Average resolution time: <strong>4.2 hours</strong></p>
            <Button variant="ghost" className="text-xs font-bold text-primary gap-1">
                View Support Logs <ExternalLink className="w-3 h-3" />
            </Button>
        </div>
      </Card>
    </div>
  );
}
