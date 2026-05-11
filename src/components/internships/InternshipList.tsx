"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { 
  Clock, 
  GraduationCap, 
  MapPin, 
  Search, 
  CheckCircle, 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  X,
  CreditCard,
  Tag,
  ArrowRight
} from "lucide-react";
import { PremiumApplicationForm } from "./ApplicationForm";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";

export function InternshipList({ internships }: { internships: any[] }) {
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const [selectedInternship, setSelectedInternship] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [paidInternship, setPaidInternship] = useState<any>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleEnrollClick = (internship: any) => {
    setSelectedInternship(internship);
    setShowPaymentModal(true);
  };

  const initiatePayment = async () => {
    if (!isSignedIn) {
      alert("Please sign in to complete payment.");
      return;
    }

    setIsPaymentLoading(true);
    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: 1999, 
          itemType: 'InternshipEnrollment', 
          itemId: selectedInternship._id 
        }),
      });
      
      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.details || orderData.error || "Failed to create order");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Startup India Technologies",
        description: `Enrollment for ${selectedInternship.title}`,
        order_id: orderData.id,
        handler: async function (response: any) {
          // Payment successful!
          setIsPaymentLoading(true);
          try {
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              credentials: "include",
              cache: "no-store",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay: response,
                internshipId: selectedInternship._id,
                amount: 1999
              })
            });

            if (verifyRes.ok) {
              setPaymentData(response);
              setShowPaymentModal(false);
              setPaidInternship(selectedInternship);
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (err) {
            alert("Payment recorded but verification failed. Please contact support.");
          } finally {
            setIsPaymentLoading(false);
          }
        },
        prefill: {
          name: user?.fullName || "Student",
          email: user?.primaryEmailAddress?.emailAddress || "",
        },
        theme: { color: "#00D4FF" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error(error);
      alert(`Payment Error: ${error.message || "Please check your connection and try again."}`);
    } finally {
      setIsPaymentLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {internships.length > 0 ? (
          internships.map((internship: any) => (
            <Card key={internship._id.toString()} className="bg-card border-border hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col group">
              <CardContent className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-semibold">
                    {internship.category}
                  </Badge>
                  <Badge variant="secondary" className="bg-secondary/10 text-secondary border-0">
                    {internship.type}
                  </Badge>
                </div>
                
                <h3 className="text-2xl font-bold font-space-grotesk leading-tight mb-2 group-hover:text-primary transition-colors">
                  {internship.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                  {internship.description}
                </p>
                
                <div className="flex flex-col gap-2 mb-4 text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> {internship.durationMonths} Months</div>
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-secondary" /> {internship.location || 'Remote'}</div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-green-500" /> 
                    {internship.stipend?.amount ? `₹${internship.stipend.amount} / month` : 'Unpaid'}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {internship.skillsRequired?.slice(0, 3).map((skill: string, i: number) => (
                    <span key={i} className="text-xs font-semibold bg-muted text-foreground px-2 py-1 rounded-md border border-border/50">
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button 
                  onClick={() => handleEnrollClick(internship)}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 h-12 gap-2"
                >
                  Enroll Now <ArrowRight className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-24 text-center text-muted-foreground border-dashed border-2 border-border rounded-3xl bg-muted/20">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <h3 className="text-2xl font-semibold mb-2">No internships currently open</h3>
            <p className="text-lg">Recruiters are adding new roles. Check back later!</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {/* Payment Summary Modal */}
        {showPaymentModal && selectedInternship && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setShowPaymentModal(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-border bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-space-grotesk font-black text-xl">Secure Checkout</h3>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Internship Enrollment</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowPaymentModal(false)} className="rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-4">
                   <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-bold">{selectedInternship.title}</h4>
                        <p className="text-sm text-muted-foreground">{selectedInternship.durationMonths} Months Program</p>
                      </div>
                      <Badge className="bg-primary/10 text-primary border-primary/20">Verified</Badge>
                   </div>

                   <div className="space-y-2">
                      {[
                        "Guaranteed Internship Certificate",
                        "Industry-led Training Modules",
                        "LMS Dashboard Access",
                        "Career Mentor Support"
                      ].map(benefit => (
                        <div key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-500" /> {benefit}
                        </div>
                      ))}
                   </div>
                </div>

                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
                   <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Program Fee</span>
                      <span className="font-bold line-through text-muted-foreground/50">₹4,999</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Limited Time Discount</span>
                      <span className="font-bold text-green-500">-₹3,000</span>
                   </div>
                   <div className="flex items-center gap-2 border-t border-primary/10 pt-4 mt-2">
                      <Tag className="w-4 h-4 text-primary" />
                      <input 
                        placeholder="Coupon Code" 
                        className="bg-transparent border-none outline-none text-sm flex-1 placeholder:text-muted-foreground/50" 
                      />
                      <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/10">Apply</Button>
                   </div>
                   <div className="flex justify-between items-center pt-2">
                      <span className="font-black text-xl">Total Payable</span>
                      <span className="font-black text-2xl text-primary">₹1,999</span>
                   </div>
                </div>

                <Button 
                  onClick={initiatePayment}
                  disabled={isPaymentLoading}
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-2xl shadow-lg shadow-primary/20"
                >
                  {isPaymentLoading ? "Processing..." : "Pay Now & Continue"}
                </Button>

                <div className="flex items-center justify-center gap-6 opacity-50">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">SSL Secure Payment</span>
                  <Zap className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Post-Payment Application Form */}
        {paidInternship && (
          <PremiumApplicationForm 
            internship={paidInternship} 
            paymentData={paymentData}
            onClose={() => setPaidInternship(null)}
            onSuccess={() => {
              setPaidInternship(null);
              setShowSuccess(true);
            }}
          />
        )}

        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }}
               className="absolute inset-0 bg-black/80 backdrop-blur-md"
               onClick={() => setShowSuccess(false)}
             />
             <motion.div
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="relative w-full max-w-md bg-card border border-border rounded-3xl p-8 text-center"
             >
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-3xl font-black mb-4">Enrollment Success!</h2>
                <p className="text-muted-foreground mb-8">
                  Congratulations! Your enrollment and internship application have been completed successfully. Your dashboard is now unlocked.
                </p>
                <Button 
                  onClick={() => window.location.href = "/dashboard"}
                  className="w-full bg-primary font-bold h-12 shadow-lg shadow-primary/20"
                >
                  Go to Dashboard
                </Button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
