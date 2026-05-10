import { SignIn } from "@clerk/nextjs";

export default function EmployeeSignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 -left-1/4 w-3/4 h-3/4 bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-1/4 w-3/4 h-3/4 bg-secondary/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">
            Internal Access Only
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Employee Portal</h1>
          <p className="text-muted-foreground">Sign in to access the admin dashboard.</p>
        </div>

        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-sm font-bold h-11",
              card: "bg-card border border-border shadow-2xl rounded-2xl",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton: "border-border hover:bg-accent text-foreground font-semibold",
              footerActionText: "text-muted-foreground",
              footerActionLink: "text-primary hover:text-primary/80 font-bold",
            }
          }}
          forceRedirectUrl="/admin"
          signUpUrl="/sign-up"
        />
        
        <p className="text-center mt-8 text-xs text-muted-foreground">
          Unauthorized access is strictly prohibited and monitored.
        </p>
      </div>
    </div>
  );
}
