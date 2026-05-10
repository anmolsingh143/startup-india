"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Briefcase, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  ChevronRight,
  Target,
  Zap,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";

const DATA = [
  { name: "Mon", revenue: 4000, leads: 24 },
  { name: "Tue", revenue: 3000, leads: 13 },
  { name: "Wed", revenue: 2000, leads: 98 },
  { name: "Thu", revenue: 2780, leads: 39 },
  { name: "Fri", revenue: 1890, leads: 48 },
  { name: "Sat", revenue: 2390, leads: 38 },
  { name: "Sun", revenue: 3490, leads: 43 },
];

export default function AdminDashboard() {
  type Stat = {
    icon: keyof typeof iconMap;
    label: string;
    value: string;
    trend: string;
    positive: boolean;
    color: string;
  };

  type Lead = {
    _id: string;
    name: string;
    source: string;
    status: string;
    createdAt: string;
  };

  const [stats, setStats] = useState<Stat[]>([]);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const iconMap = {
    CreditCard,
    Target,
    TrendingUp,
    Users
  } satisfies Record<string, ComponentType<SVGProps<SVGSVGElement>>>;

  useEffect(() => {
    async function fetchStats() {
      try {
        const [statsRes, leadsRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/leads")
        ]);
        
        const statsData = await statsRes.json();
        const leadsData = await leadsRes.json();

        setStats(Array.isArray(statsData.stats) ? statsData.stats : []);
        setRecentLeads(Array.isArray(leadsData) ? leadsData.slice(0, 5) : []);
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">Loading Dashboard Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back, Admin. Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Clock className="w-4 h-4" /> Last 30 Days
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
            <Zap className="w-4 h-4" /> Generate Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = iconMap[stat.icon] || Target;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg bg-background border border-border group-hover:border-primary/30 transition-all`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-bold ${stat.positive ? "text-green-500" : "text-red-500"}`}>
                      {stat.trend} {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1">{stat.label}</p>
                    <h3 className="text-2xl font-black">{stat.value}</h3>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Revenue & Leads Growth
              </CardTitle>
              <Badge variant="outline" className="font-bold border-primary/20 text-primary bg-primary/10">LIVE UPDATES</Badge>
            </div>
          </CardHeader>
          <CardContent className="h-[350px] min-w-0 mt-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 720, height: 350 }}>
              <AreaChart data={DATA}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="oklch(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: "oklch(var(--muted-foreground))" }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: "oklch(var(--muted-foreground))" }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "oklch(var(--card))", 
                    borderColor: "oklch(var(--border))",
                    borderRadius: "12px",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="oklch(var(--primary))" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Users className="w-4 h-4 text-secondary" /> Recent Leads
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {recentLeads.length > 0 ? recentLeads.map((lead) => (
              <div key={lead._id} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent border border-border flex items-center justify-center font-bold text-sm">
                    {lead.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="max-w-[120px]">
                    <h4 className="text-sm font-bold group-hover:text-primary transition-colors truncate">{lead.name}</h4>
                    <p className="text-xs text-muted-foreground truncate">{lead.source}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`text-[10px] px-1.5 h-5 ${
                    lead.status === "Payment Success" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                    lead.status === "New Lead" ? "bg-primary/10 text-primary border-primary/20" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {lead.status}
                  </Badge>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground text-center py-8">No leads found yet.</p>
            )}
            <Link href="/admin/leads">
              <Button variant="ghost" className="w-full text-sm font-bold text-primary gap-2 mt-4">
                View All Leads <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Performance & Activity */}
      <div className="grid lg:grid-cols-2 gap-8 pb-12">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-500" /> Employee Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                {[
                  { name: "Rahul Sharma", deals: 42, revenue: "₹8.4L", score: 98 },
                  { name: "Priya Verma", deals: 38, revenue: "₹7.1L", score: 95 },
                  { name: "Amit Kumar", deals: 31, revenue: "₹6.2L", score: 88 },
                ].map((emp, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border bg-background/50">
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-black text-muted-foreground/30">#0{i+1}</div>
                      <div>
                        <h4 className="text-sm font-bold">{emp.name}</h4>
                        <p className="text-xs text-muted-foreground">{emp.deals} Conversions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-primary">{emp.revenue}</div>
                      <div className="text-xs font-bold text-green-500">{emp.score} pts</div>
                    </div>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" /> System Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { event: "New Payment Received", time: "2 mins ago", desc: "Order #RZP-9082 via UPI", icon: CreditCard, color: "text-green-500" },
                { event: "New Lead Generated", time: "15 mins ago", desc: "Anish Kumar from Instagram Ads", icon: Target, color: "text-primary" },
                { event: "Support Ticket Resolved", time: "1 hour ago", desc: "Fixed login issue for User #882", icon:Zap, color: "text-orange-500" },
              ].map((activity, i) => (
                <div key={i} className="flex gap-4">
                  <div className={`w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center flex-shrink-0`}>
                    <activity.icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{activity.event}</h4>
                    <p className="text-xs text-muted-foreground mb-1">{activity.desc}</p>
                    <span className="text-[10px] font-semibold text-muted-foreground/60">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
