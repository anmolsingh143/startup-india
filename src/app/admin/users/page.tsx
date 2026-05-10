"use client";

import { useState } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal,
  Mail,
  Calendar,
  Shield,
  UserCheck,
  UserMinus,
  ExternalLink,
  ChevronRight,
  UserPlus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const USERS_DATA = [
  { id: "U-8821", name: "Anish Kumar", email: "anish@example.com", joined: "2024-04-12", courses: 2, status: "Active", type: "Student" },
  { id: "U-8822", name: "Sanya Malhotra", email: "sanya@example.com", joined: "2024-04-15", courses: 1, status: "Active", type: "Intern" },
  { id: "U-8823", name: "Rohan Das", email: "rohan@example.com", joined: "2024-04-20", courses: 4, status: "Inactive", type: "Student" },
  { id: "U-8824", name: "Megha Gupta", email: "megha@example.com", joined: "2024-05-01", courses: 1, status: "Active", type: "Intern" },
  { id: "U-8825", name: "Vikram Singh", email: "vikram@example.com", joined: "2024-05-02", courses: 0, status: "Active", type: "Student" },
];

export default function UsersPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">User Directory</h1>
          <p className="text-muted-foreground">Manage all registered students and interns.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Users className="w-4 h-4" /> Export Users
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
            <UserPlus className="w-4 h-4" /> Add User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: "4,289", icon: Users },
          { label: "Active Now", value: "156", icon: UserCheck },
          { label: "New this week", value: "+124", icon: UserPlus },
          { label: "Premium Users", value: "842", icon: Shield },
        ].map((s) => (
          <Card key={s.label} className="bg-card/50 border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">{s.label}</p>
                <h3 className="text-lg font-black">{s.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Users Table */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="p-4 border-b border-border">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
             <div className="relative flex-1 md:w-96 w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search by name, email, or user ID..." 
                  className="pl-9 bg-background/50 h-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" /> Filters
              </Button>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase">User</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Type</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Status</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Joined</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Courses</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {USERS_DATA.map((user) => (
                <tr key={user.id} className="hover:bg-accent/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-accent border border-border flex items-center justify-center font-bold text-xs uppercase">
                            {user.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                            <div className="font-bold text-sm">{user.name}</div>
                            <div className="text-[10px] text-muted-foreground">{user.email}</div>
                        </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className="text-[10px] font-bold">{user.type}</Badge>
                  </td>
                  <td className="p-4">
                    <Badge className={`text-[10px] font-bold px-2 h-5 ${
                        user.status === "Active" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                    }`}>
                        {user.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-xs font-medium text-muted-foreground">{user.joined}</td>
                  <td className="p-4 text-sm font-bold">{user.courses}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-primary">
                            <ExternalLink className="w-4 h-4" />
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
      </Card>
    </div>
  );
}
