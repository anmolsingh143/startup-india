"use client";

import { useState, useEffect } from "react";
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
  UserPlus,
  Loader2,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const WEEK_AGO = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    queueMicrotask(() => {
      void fetchUsers();
    });
  }, []);

  const filteredUsers = users.filter(u => 
    u.firstName.toLowerCase().includes(search.toLowerCase()) || 
    u.lastName.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">User Directory</h1>
          <p className="text-muted-foreground">Manage all registered students and interns.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={fetchUsers} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
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
          { label: "Total Users", value: users.length, icon: Users },
          { label: "Students", value: users.filter(u => u.role === "Student").length, icon: UserCheck },
          { label: "New this week", value: users.filter(u => new Date(u.createdAt) > WEEK_AGO).length, icon: UserPlus },
          { label: "Admins/Staff", value: users.filter(u => u.role === "Admin" || u.role === "Employee").length, icon: Shield },
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
                  placeholder="Search by name or email..." 
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground font-medium">Fetching user data...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="p-4 text-xs font-bold text-muted-foreground uppercase">User</th>
                  <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Role</th>
                  <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Joined</th>
                  <th className="p-4 text-xs font-bold text-muted-foreground uppercase">XP Points</th>
                  <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-accent/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-accent border border-border flex items-center justify-center font-bold text-xs uppercase overflow-hidden">
                              {user.profileImage ? (
                                <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                              ) : (
                                `${user.firstName[0]}${user.lastName[0]}`
                              )}
                          </div>
                          <div>
                              <div className="font-bold text-sm">{user.firstName} {user.lastName}</div>
                              <div className="text-[10px] text-muted-foreground">{user.email}</div>
                          </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className={`text-[10px] font-bold ${
                        user.role === "Admin" ? "border-primary text-primary" : 
                        user.role === "Employee" ? "border-purple-500 text-purple-500" : ""
                      }`}>{user.role}</Badge>
                    </td>
                    <td className="p-4 text-xs font-medium text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm font-bold">{user.xpPoints || 0}</td>
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
                )) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground italic">
                      No users found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
