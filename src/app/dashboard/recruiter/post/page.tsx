"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Clock, IndianRupee, Plus, Loader2 } from "lucide-react";

export default function PostInternshipPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Software Development",
    location: "Remote",
    durationMonths: 6,
    stipendAmount: 10000,
    skills: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // In a real app, this would be a Server Action or API call
    // For this demo, we simulate success
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard/recruiter");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center">
      <Card className="max-w-2xl w-full border-border shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-space-grotesk font-bold">Post New Internship</CardTitle>
          <CardDescription>Fill in the details to find the best candidates for your startup.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Internship Title</label>
              <Input 
                placeholder="e.g. Frontend React Intern" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Category</label>
                <Input 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Location</label>
                <Input 
                   value={formData.location}
                   onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Duration (Months)</label>
                <Input 
                  type="number"
                  value={formData.durationMonths}
                  onChange={(e) => setFormData({...formData, durationMonths: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Stipend (₹ / month)</label>
                <Input 
                  type="number"
                  value={formData.stipendAmount}
                  onChange={(e) => setFormData({...formData, stipendAmount: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Description</label>
              <Textarea 
                placeholder="Describe the role and responsibilities..." 
                className="min-h-[150px]"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Skills Required (comma separated)</label>
              <Input 
                placeholder="React, TypeScript, TailwindCSS" 
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
              />
            </div>

            <div className="pt-4 flex gap-3">
              <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">Cancel</Button>
              <Button type="submit" className="flex-1 bg-primary text-white" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publish Internship"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
