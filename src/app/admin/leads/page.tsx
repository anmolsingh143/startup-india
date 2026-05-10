"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreHorizontal,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Target,
  Loader2,
  RefreshCw
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type LeadStatus =
  | "New Lead"
  | "Applied"
  | "Payment Pending"
  | "Payment Success"
  | "Enrolled"
  | "Rejected";

type Lead = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: string;
  assignedTo?: string;
  createdAt: string;
};

type LeadStats = {
  new: number;
  interested: number;
  pending: number;
  success: number;
};

type NewLeadForm = {
  name: string;
  email: string;
  phone: string;
  source: string;
  assignedTo: string;
};

const STATUS_COLORS: Record<LeadStatus, string> = {
  "New Lead": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "Applied": "bg-purple-500/10 text-purple-500 border-purple-500/20",
  "Payment Pending": "bg-orange-500/10 text-orange-500 border-orange-500/20",
  "Payment Success": "bg-green-500/10 text-green-500 border-green-500/20",
  "Enrolled": "bg-primary/10 text-primary border-primary/20",
  "Rejected": "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLead, setNewLead] = useState<NewLeadForm>({
    name: "",
    email: "",
    phone: "",
    source: "Manual Admin Entry",
    assignedTo: "",
  });
  const [stats, setStats] = useState<LeadStats>({ new: 0, interested: 0, pending: 0, success: 0 });

  const fetchLeads = async () => {
    await Promise.resolve();
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/leads");
      const data: unknown = await res.json();
      if (!res.ok) {
        throw new Error((data as { error?: string }).error || "Failed to fetch leads");
      }
      const leadList = Array.isArray(data) ? data as Lead[] : [];
      setLeads(leadList);
      
      // Calculate mini stats
      const s = {
        new: leadList.filter((l) => l.status === "New Lead").length,
        interested: leadList.filter((l) => l.status === "Applied").length,
        pending: leadList.filter((l) => l.status === "Payment Pending").length,
        success: leadList.filter((l) => l.status === "Payment Success").length
      };
      setStats(s);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      void fetchLeads();
    });
  }, []);

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.email.toLowerCase().includes(search.toLowerCase()) ||
    (l.phone || "").includes(search)
  );

  const exportCsv = () => {
    const header = ["Name", "Email", "Phone", "Status", "Source", "Assigned To", "Created"];
    const rows = filteredLeads.map((lead) => [
      lead.name,
      lead.email,
      lead.phone,
      lead.status,
      lead.source,
      lead.assignedTo || "Unassigned",
      new Date(lead.createdAt).toLocaleString(),
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "admin-leads.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const createLead = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create lead");
      }

      setShowAddForm(false);
      setNewLead({ name: "", email: "", phone: "", source: "Manual Admin Entry", assignedTo: "" });
      await fetchLeads();
    } catch (error) {
      console.error("Failed to create lead:", error);
      alert(error instanceof Error ? error.message : "Failed to create lead");
    } finally {
      setIsSaving(false);
    }
  };

  const assignVisibleLeads = async () => {
    setIsSaving(true);
    try {
      const targets = filteredLeads.filter((lead) => !lead.assignedTo);
      await Promise.all(targets.map((lead) => fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lead._id, assignedTo: "Rahul Sharma" }),
      })));
      await fetchLeads();
    } catch (error) {
      console.error("Failed to assign leads:", error);
      alert("Failed to assign leads.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Lead Management</h1>
          <p className="text-muted-foreground">Track, assign and convert your internship leads.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={fetchLeads} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="outline" className="gap-2" onClick={exportCsv} disabled={!filteredLeads.length}>
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" onClick={() => setShowAddForm((value) => !value)}>
            <Plus className="w-4 h-4" /> Add New Lead
          </Button>
        </div>
      </div>

      {showAddForm && (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4 grid md:grid-cols-5 gap-3">
            <Input placeholder="Name" value={newLead.name} onChange={(event) => setNewLead((lead) => ({ ...lead, name: event.target.value }))} />
            <Input placeholder="Email" value={newLead.email} onChange={(event) => setNewLead((lead) => ({ ...lead, email: event.target.value }))} />
            <Input placeholder="Phone" value={newLead.phone} onChange={(event) => setNewLead((lead) => ({ ...lead, phone: event.target.value }))} />
            <Input placeholder="Assigned to" value={newLead.assignedTo} onChange={(event) => setNewLead((lead) => ({ ...lead, assignedTo: event.target.value }))} />
            <Button onClick={createLead} disabled={isSaving || !newLead.name || !newLead.email || !newLead.phone}>
              {isSaving ? "Saving..." : "Create Lead"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "New Leads", value: stats.new, color: "text-blue-500" },
          { label: "Applications", value: stats.interested, color: "text-purple-500" },
          { label: "Pending Payment", value: stats.pending, color: "text-orange-500" },
          { label: "Success", value: stats.success, color: "text-green-500" },
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
              <Button variant="outline" className="gap-2 flex-1 md:flex-none" onClick={assignVisibleLeads} disabled={isSaving || !filteredLeads.some((lead) => !lead.assignedTo)}>
                <Target className="w-4 h-4" /> Assign Unowned
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground font-medium">Fetching leads from database...</p>
          </div>
        ) : (
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
                {filteredLeads.length > 0 ? filteredLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-accent/50 transition-colors group">
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
                      <Badge className={`text-[10px] font-bold px-2 py-0.5 ${STATUS_COLORS[lead.status] || "bg-muted"}`}>
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground font-medium">{lead.source}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-accent border border-border flex items-center justify-center text-[10px] font-bold">
                          {lead.assignedTo ? lead.assignedTo[0] : "?"}
                        </div>
                        <span className="text-sm font-semibold">{lead.assignedTo || "Unassigned"}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground font-medium">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
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
                )) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground italic">
                      No leads matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {!isLoading && (
          <div className="p-4 border-t border-border bg-muted/10 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Showing {filteredLeads.length} leads</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-bold bg-primary text-white border-primary">1</Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
