"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Zap, 
  Globe,
  Monitor,
  Smartphone,
  PieChart as PieChartIcon,
  Calendar,
  Download,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const REVENUE_DATA = [
  { month: "Jan", rev: 420000, leads: 1200 },
  { month: "Feb", rev: 550000, leads: 1450 },
  { month: "Mar", rev: 780000, leads: 2100 },
  { month: "Apr", rev: 920000, leads: 2800 },
  { month: "May", rev: 1240000, leads: 4200 },
];

const SOURCE_DATA = [
  { name: "Google Search", value: 45, color: "#00D4FF" },
  { name: "Facebook Ads", value: 25, color: "#7B61FF" },
  { name: "Instagram", value: 15, color: "#f43f5e" },
  { name: "LinkedIn", value: 10, color: "#3b82f6" },
  { name: "Others", value: 5, color: "#94a3b8" },
];

const DEVICE_DATA = [
  { name: "Mobile", value: 68, icon: Smartphone },
  { name: "Desktop", value: 28, icon: Monitor },
  { name: "Tablet", value: 4, icon: Globe },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Business Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into your growth and performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" /> Year to Date
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
            <Download className="w-4 h-4" /> Download PDF Report
          </Button>
        </div>
      </div>

      {/* Main Growth Chart */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Revenue & Lead Acquisition
            </CardTitle>
            <p className="text-xs text-muted-foreground">Yearly performance metrics</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs font-bold">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary" />
              <span className="text-xs font-bold">Leads</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[400px] min-w-0 pt-8">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 800, height: 400 }}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="oklch(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(var(--secondary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="oklch(var(--secondary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(var(--border))" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "oklch(var(--muted-foreground))" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "oklch(var(--muted-foreground))" }} />
              <Tooltip 
                contentStyle={{ 
                    backgroundColor: "oklch(var(--card))", 
                    borderColor: "oklch(var(--border))",
                    borderRadius: "12px",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
                  }}
              />
              <Area type="monotone" dataKey="rev" stroke="oklch(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              <Area type="monotone" dataKey="leads" stroke="oklch(var(--secondary))" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Lead Sources */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-primary" /> Traffic & Lead Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] min-w-0 flex items-center">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 360, height: 300 }}>
              <PieChart>
                <Pie
                  data={SOURCE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {SOURCE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-1/2 space-y-4">
              {SOURCE_DATA.map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-xs font-bold text-muted-foreground">{s.name}</span>
                  </div>
                  <span className="text-xs font-black">{s.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Distribution */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Monitor className="w-4 h-4 text-secondary" /> User Engagement by Device
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            {DEVICE_DATA.map((d) => (
              <div key={d.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <d.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-bold">{d.name}</span>
                  </div>
                  <span className="text-sm font-black text-primary">{d.value}%</span>
                </div>
                <div className="h-2 w-full bg-accent rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    whileInView={{ width: `${d.value}%` }} 
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-primary" 
                  />
                </div>
              </div>
            ))}
            <div className="pt-4 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-background border border-border">
                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Avg. Session</p>
                <p className="text-xl font-black">4m 32s</p>
              </div>
              <div className="p-4 rounded-xl bg-background border border-border">
                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Bounce Rate</p>
                <p className="text-xl font-black text-red-500">24.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Business Insights */}
      <Card className="border-border/50 bg-primary/5 border-primary/20 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Zap className="w-24 h-24 text-primary" />
        </div>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> AI Business Insights (Gemini Powered)
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Conversion Prediction", desc: "Based on historical data, we expect a 12% increase in conversions next month.", color: "text-blue-500" },
            { title: "Follow-up Optimization", desc: "Leads from Instagram are 3x more likely to convert if contacted within 15 minutes.", color: "text-primary" },
            { title: "Fraud Detection", desc: "No unusual payment patterns detected in the last 24 hours. Revenue is secure.", color: "text-green-500" },
          ].map((insight) => (
            <div key={insight.title} className="p-5 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all">
              <h4 className={`font-bold text-sm mb-2 ${insight.color}`}>{insight.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{insight.desc}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
