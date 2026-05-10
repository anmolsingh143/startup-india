"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreHorizontal,
  Mail,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Target
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const LEADS_DATA = [
  { id: "L-101", name: "Anish Kumar", email: "anish@example.com", phone: "+91 98765 43210", status: "Interested", source: "Facebook Ads", assigned: "Rahul Sharma", date: "2024-05-09" },
  { id: "L-102", name: "Sanya Malhotra", email: "sanya@example.com", phone: "+91 91234 56789", status: "New Lead", source: "Google Search", assigned: "Priya Verma", date: "2024-05-09" },
  { id: "L-103", name: "Rohan Das", email: "rohan@example.com", phone: "+91 99887 76655", status: "Converted", source: "Direct", assigned: "Amit Kumar", date: "2024-05-08" },
  { id: "L-104", name: "Megha Gupta", email: "megha@example.com", phone: "+91 88776 65544", status: "Contacted", source: "LinkedIn", assigned: "Rahul Sharma", date: "2024-05-08" },
  { id: "L-105", name: "Vikram Singh", email: "vikram@example.com", phone: "+91 77665 54433", status: "Payment Pending", source: "Instagram", assigned: "Sunita Rao", date: "2024-05-07" },
  { id: "L-106", name: "Neha Sharma", email: "neha@example.com", phone: "+91 66554 43322", status: "Rejected", source: "YouTube", assigned: "Amit Kumar", date: "2024-05-07" },
];

const STATUS_COLORS: any = {
  "New Lead": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "Contacted": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  "Interested": "bg-primary/10 text-primary border-primary/20",
  "Payment Pending": "bg-orange-500/10 text-orange-500 border-orange-500/20",
  "Converted": "bg-green-500/10 text-green-500 border-green-500/20",
  "Rejected": "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function LeadsPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Lead Management</h1>
          <p className="text-muted-foreground">Track, assign and convert your internship leads.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" /> Add New Lead
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "New Leads", value: "12", color: "text-blue-500" },
          { label: "Interested", value: "45", color: "text-primary" },
          { label: "Pending Payment", value: "8", color: "text-orange-500" },
          { label: "Conversions", value: "156", color: "text-green-500" },
        ].map((s) => (
          <Card key={s.label} className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <p className="text-xs font-bold text-muted-foreground uppercase">{s.label}</p>
              <h3 className={`text-xl font-black ${s.color}`}>{s.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters & Search */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search by name, email, phone..." 
                className="pl-9 bg-background/50 border-border"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button variant="outline" className="gap-2 flex-1 md:flex-none">
                <Filter className="w-4 h-4" /> Filters
              </Button>
              <Button variant="outline" className="gap-2 flex-1 md:flex-none">
                <Target className="w-4 h-4" /> Assign
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Lead Info</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Source</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Assigned To</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {LEADS_DATA.filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase())).map((lead) => (
                <tr key={lead.id} className="hover:bg-accent/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        {lead.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-sm group-hover:text-primary transition-colors">{lead.name}</div>
                        <div className="text-xs text-muted-foreground">{lead.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className={`text-[10px] font-bold px-2 py-0.5 ${STATUS_COLORS[lead.status]}`}>
                      {lead.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground font-medium">{lead.source}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-accent border border-border flex items-center justify-center text-[10px] font-bold">
                        {lead.assigned.split(" ")[0][0]}
                      </div>
                      <span className="text-sm font-semibold">{lead.assigned}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground font-medium">{lead.date}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-primary hover:bg-primary/10">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-border bg-muted/10 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Showing 6 of 2,421 leads</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled><ChevronLeft className="w-4 h-4" /></Button>
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-bold bg-primary text-white border-primary">1</Button>
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-bold">2</Button>
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-bold">3</Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0"><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
