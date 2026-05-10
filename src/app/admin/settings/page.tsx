"use client";

import { 
  Settings, 
  Shield, 
  Bell, 
  Globe, 
  Lock, 
  Database, 
  Cpu, 
  Cloud,
  Save,
  Trash2,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight">Admin Settings</h1>
        <p className="text-muted-foreground">Configure system-wide settings and security.</p>
      </div>

      {/* General Settings */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary" /> General Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase">Company Name</label>
              <Input defaultValue="Startup India Technologies Pvt. Ltd." className="bg-background/50" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase">Admin Email</label>
              <Input defaultValue="admin@startupindia.gov.in" className="bg-background/50" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase">Contact Number</label>
              <Input defaultValue="+91 1800 123 4567" className="bg-background/50" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase">Timezone</label>
              <Input defaultValue="(GMT+05:30) India Standard Time" className="bg-background/50" disabled />
            </div>
          </div>
          <div className="pt-4 border-t border-border flex justify-end">
            <Button className="bg-primary text-white font-bold gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security & Roles */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Lock className="w-4 h-4 text-orange-500" /> Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-background/50">
              <div>
                <p className="text-sm font-bold">Two-Factor Auth</p>
                <p className="text-[10px] text-muted-foreground">Enabled via Clerk Security</p>
              </div>
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-background/50">
              <div>
                <p className="text-sm font-bold">API Access Tokens</p>
                <p className="text-[10px] text-muted-foreground">Manage external API keys</p>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs font-bold text-primary">Manage</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-500" /> System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-bold">MongoDB Atlas</span>
                </div>
                <Badge variant="outline" className="text-[10px] text-green-500 border-green-500/20">Operational</Badge>
             </div>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cloud className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-bold">Clerk Auth</span>
                </div>
                <Badge variant="outline" className="text-[10px] text-green-500 border-green-500/20">Operational</Badge>
             </div>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-bold">Razorpay API</span>
                </div>
                <Badge variant="outline" className="text-[10px] text-green-500 border-green-500/20">Operational</Badge>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="border-red-500/20 bg-red-500/5">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-red-500 flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">Actions in this section are permanent and cannot be undone.</p>
          <div className="flex flex-wrap gap-3">
             <Button variant="outline" className="border-red-500/20 text-red-500 hover:bg-red-500/10 font-bold">Clear All System Cache</Button>
             <Button variant="outline" className="border-red-500/20 text-red-500 hover:bg-red-500/10 font-bold">Reset Analytics Data</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
