"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  Search, 
  UserPlus, 
  MoreHorizontal,
  Mail,
  Trophy,
  Star,
  Target,
  TrendingUp,
  Award,
  Zap,
  BarChart3,
  Shield,
  Filter,
  ChevronRight,
  MessageCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const EMPLOYEES = [
  { id: "E-001", name: "Rahul Sharma", role: "Sales Manager", leads: 245, conversions: 42, revenue: "₹8.4L", score: 98, status: "Active" },
  { id: "E-002", name: "Priya Verma", role: "Sales Executive", leads: 198, conversions: 38, revenue: "₹7.1L", score: 95, status: "Active" },
  { id: "E-003", name: "Amit Kumar", role: "Counselor", leads: 156, conversions: 31, revenue: "₹6.2L", score: 88, status: "Active" },
  { id: "E-004", name: "Sunita Rao", role: "Sales Executive", leads: 167, conversions: 28, revenue: "₹5.4L", score: 82, status: "Away" },
  { id: "E-005", name: "Rohan Mehra", role: "Support Lead", leads: 45, conversions: 12, revenue: "₹1.8L", score: 90, status: "Active" },
];

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const filteredEmployees = EMPLOYEES.filter((employee) =>
    employee.name.toLowerCase().includes(search.toLowerCase()) ||
    employee.role.toLowerCase().includes(search.toLowerCase()) ||
    employee.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Employee Hub</h1>
          <p className="text-muted-foreground">Manage your team and track performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <BarChart3 className="w-4 h-4" /> Performance Reports
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
            <UserPlus className="w-4 h-4" /> Invite Employee
          </Button>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" /> Monthly Leaderboard
            </CardTitle>
            <Badge className="bg-primary/10 text-primary border-primary/20 font-bold">TOP PERFORMERS</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {[...EMPLOYEES].sort((a,b) => b.score - a.score).map((emp, i) => (
                <div key={emp.id} className="flex items-center justify-between p-5 hover:bg-accent/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-accent border border-border flex items-center justify-center font-black text-lg">
                        {emp.name[0]}
                      </div>
                      {i === 0 && <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-yellow-500 border-2 border-background flex items-center justify-center text-[10px]">👑</div>}
                    </div>
                    <div>
                      <h4 className="font-bold text-base group-hover:text-primary transition-colors">{emp.name}</h4>
                      <p className="text-xs text-muted-foreground font-semibold">{emp.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="hidden md:block text-right">
                      <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Revenue</div>
                      <div className="text-sm font-black text-primary">{emp.revenue}</div>
                    </div>
                    <div className="text-right min-w-[60px]">
                      <div className="text-xs font-bold text-muted-foreground uppercase mb-1">Score</div>
                      <div className="text-sm font-black text-green-500">{emp.score} pts</div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                <div className="h-2 w-full bg-primary/20">
                    <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} className="h-full bg-primary" />
                </div>
                <CardContent className="p-6 text-center">
                    <Award className="w-10 h-10 text-primary mx-auto mb-3" />
                    <h3 className="font-bold text-lg mb-1">Monthly Target</h3>
                    <p className="text-xs text-muted-foreground mb-4">₹42L / ₹50L Achieved</p>
                    <div className="flex justify-between items-end gap-2">
                        <div className="text-left">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Revenue</p>
                            <p className="text-xl font-black">₹42.8L</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Left</p>
                            <p className="text-xl font-black text-primary">₹7.2L</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                        <Shield className="w-4 h-4 text-secondary" /> System Access
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[
                        { role: "Super Admin", count: 2, icon: Shield, color: "text-red-500" },
                        { role: "Sales Team", count: 18, icon: TrendingUp, color: "text-primary" },
                        { role: "Support", count: 12, icon: MessageCircle, color: "text-orange-500" },
                    ].map((role) => (
                        <div key={role.role} className="flex items-center justify-between p-3 rounded-xl border border-border bg-background/50">
                            <div className="flex items-center gap-2">
                                <role.icon className={`w-3.5 h-3.5 ${role.color}`} />
                                <span className="text-xs font-bold">{role.role}</span>
                            </div>
                            <Badge variant="outline" className="text-[10px] font-bold">{role.count} Active</Badge>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
      </div>

      {/* Full Directory Table */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="p-4 border-b border-border">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <CardTitle className="text-lg font-bold">Team Directory</CardTitle>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search team members..." 
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
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Employee</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Role</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Status</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Leads</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Revenue</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-accent/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent border border-border flex items-center justify-center font-bold text-xs uppercase">
                            {emp.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                            <div className="font-bold text-sm">{emp.name}</div>
                            <div className="text-[10px] text-muted-foreground">{emp.id}</div>
                        </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-semibold">{emp.role}</td>
                  <td className="p-4">
                    <Badge className={`text-[10px] font-bold px-2 h-5 ${
                        emp.status === "Active" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                    }`}>
                        {emp.status}
                    </Badge>
                  </td>
                  <td className="p-4 font-bold text-sm">{emp.leads}</td>
                  <td className="p-4 font-black text-sm text-primary">{emp.revenue}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-primary">
                            <Mail className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground">
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground italic">
                    No team members match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
