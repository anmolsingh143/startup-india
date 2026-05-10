import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute inset-0 bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: "bg-primary hover:bg-primary/90 text-sm",
            card: "bg-card border border-border shadow-2xl rounded-2xl",
          }
        }}
      />
    </div>
  );
}
