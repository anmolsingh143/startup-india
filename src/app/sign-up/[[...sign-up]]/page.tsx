
"use client";
import { useState } from "react";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  const [role, setRole] = useState("student");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute inset-0 bg-secondary/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="z-10 w-full max-w-md mx-auto">
        <div className="mb-6 p-4 bg-card border border-border rounded-xl shadow-lg">
          <label className="block mb-2 font-semibold text-foreground">Register as:</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="student"
                checked={role === "student"}
                onChange={() => setRole("student")}
                className="accent-primary"
              />
              Student
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={role === "admin"}
                onChange={() => setRole("admin")}
                className="accent-primary"
              />
              Admin
            </label>
          </div>
        </div>
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-sm",
              card: "bg-card border border-border shadow-2xl rounded-2xl",
            },
          }}
          signUpForceRedirectUrl={role === "admin" ? "/admin/dashboard" : "/dashboard"}
          afterSignUpUrl={role === "admin" ? "/admin/dashboard" : "/dashboard"}
          // Clerk v4+ supports passing metadata via props
          publicMetadata={{ role }}
        />
      </div>
    </div>
  );
}
