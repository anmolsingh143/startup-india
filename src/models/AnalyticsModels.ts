import mongoose, { Schema, Document } from 'mongoose';

// ----------------------------------------
// AI REPORT MODEL
// ----------------------------------------
export interface IAiReport extends Document {
  studentId: mongoose.Types.ObjectId;
  reportType: 'ResumeAnalysis' | 'InterviewFeedback' | 'CareerRoadmap' | 'SkillGap';
  content: Record<string, unknown>; // JSON payload of the AI output
  score?: number;
  vectorEmbedding?: number[]; // For finding similar reports/users
}

const AiReportSchema = new Schema<IAiReport>({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  reportType: { type: String, enum: ['ResumeAnalysis', 'InterviewFeedback', 'CareerRoadmap', 'SkillGap'], required: true },
  content: { type: Schema.Types.Mixed, required: true },
  score: Number,
  vectorEmbedding: { type: [Number], select: false }
}, { timestamps: true });

export const AiReport = mongoose.models.AiReport || mongoose.model<IAiReport>('AiReport', AiReportSchema);

// ----------------------------------------
// NOTIFICATION MODEL
// ----------------------------------------
export interface INotification extends Document {
  userId: string; // Can be ClerkID or ObjectId
  title: string;
  message: string;
  type: 'Info' | 'Success' | 'Warning' | 'Error';
  read: boolean;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['Info', 'Success', 'Warning', 'Error'], default: 'Info' },
  read: { type: Boolean, default: false }
}, { timestamps: true });

export const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

// ----------------------------------------
// PAYMENT MODEL (Razorpay Integration)
// ----------------------------------------
export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  status: 'Created' | 'Successful' | 'Failed' | 'Refunded';
  itemType: 'Course' | 'Subscription' | 'Internship';
  itemId: mongoose.Types.ObjectId;
}

const PaymentSchema = new Schema<IPayment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  razorpayOrderId: { type: String, required: true, unique: true },
  razorpayPaymentId: { type: String, index: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['Created', 'Successful', 'Failed', 'Refunded'], default: 'Created' },
  itemType: { type: String, enum: ['Course', 'Subscription', 'Internship'], required: true },
  itemId: { type: Schema.Types.ObjectId, required: true }
}, { timestamps: true });

export const Payment = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
