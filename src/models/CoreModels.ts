import mongoose, { Schema, Document } from 'mongoose';

// ----------------------------------------
// USER MODEL (Students, Admins, Mentors)
// ----------------------------------------
export interface IUser extends Document {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'Student' | 'Admin' | 'Employee' | 'Mentor' | 'College Partner';
  profileImage?: string;
  phone?: string;
  skills: string[];
  education: {
    college: string;
    degree: string;
    graduationYear: number;
  }[];
  walletBalance: number;
  xpPoints: number;
  enrolledCourses: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  clerkId: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ['Student', 'Admin', 'Employee', 'Mentor', 'College Partner'], default: 'Student' },
  profileImage: String,
  phone: String,
  skills: [String],
  education: [{ college: String, degree: String, graduationYear: Number }],
  walletBalance: { type: Number, default: 0 },
  xpPoints: { type: Number, default: 0 },
  enrolledCourses: [String],
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// ----------------------------------------
// RECRUITER MODEL
// ----------------------------------------
export interface IRecruiter extends Document {
  clerkId: string;
  email: string;
  companyName: string;
  companyLogo?: string;
  industry: string;
  verified: boolean;
  subscriptionPlan: 'Free' | 'Pro' | 'Enterprise';
}

const RecruiterSchema = new Schema<IRecruiter>({
  clerkId: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true },
  companyName: { type: String, required: true },
  companyLogo: String,
  industry: String,
  verified: { type: Boolean, default: false },
  subscriptionPlan: { type: String, enum: ['Free', 'Pro', 'Enterprise'], default: 'Free' }
}, { timestamps: true });

export const Recruiter = mongoose.models.Recruiter || mongoose.model<IRecruiter>('Recruiter', RecruiterSchema);

// ----------------------------------------
// INTERNSHIP MODEL
// ----------------------------------------
export interface IInternship extends Document {
  recruiterId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  skillsRequired: string[];
  stipend: {
    amount: number;
    currency: string;
    type: 'Fixed' | 'Performance-based' | 'Unpaid';
  };
  durationMonths: number;
  location: string;
  type: 'Remote' | 'On-site' | 'Hybrid';
  status: 'Open' | 'Closed' | 'Draft';
  vectorEmbedding?: number[]; // For Vector Search
}

const InternshipSchema = new Schema<IInternship>({
  recruiterId: { type: Schema.Types.ObjectId, ref: 'Recruiter', required: true, index: true },
  title: { type: String, required: true, text: true }, // Text index for basic search
  description: { type: String, required: true },
  category: { type: String, required: true, index: true },
  skillsRequired: [String],
  stipend: {
    amount: Number,
    currency: { type: String, default: 'INR' },
    type: { type: String, enum: ['Fixed', 'Performance-based', 'Unpaid'], default: 'Fixed' }
  },
  durationMonths: Number,
  location: String,
  type: { type: String, enum: ['Remote', 'On-site', 'Hybrid'], default: 'Remote' },
  status: { type: String, enum: ['Open', 'Closed', 'Draft'], default: 'Draft' },
  vectorEmbedding: { type: [Number], select: false } // Hidden by default, used for AI matches
}, { timestamps: true });

export const Internship = mongoose.models.Internship || mongoose.model<IInternship>('Internship', InternshipSchema);

// ----------------------------------------
// APPLICATION MODEL
// ----------------------------------------
export interface IApplication extends Document {
  studentId: string;
  internshipId: mongoose.Types.ObjectId;
  resumeUrl: string;
  coverLetter?: string;
  status: 'Pending' | 'Reviewed' | 'Shortlisted' | 'Rejected' | 'Hired';
  atsScore?: number;
}

const ApplicationSchema = new Schema<IApplication>({
  studentId: { type: String, required: true, index: true },
  internshipId: { type: Schema.Types.ObjectId, ref: 'Internship', required: true, index: true },
  resumeUrl: { type: String, required: true },
  coverLetter: String,
  status: { type: String, enum: ['Pending', 'Reviewed', 'Shortlisted', 'Rejected', 'Hired'], default: 'Pending' },
  atsScore: Number
}, { timestamps: true });

// Compound index to prevent duplicate applications
ApplicationSchema.index({ studentId: 1, internshipId: 1 }, { unique: true });

export const Application = mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);

// ----------------------------------------
// LEAD MODEL (CRM)
// ----------------------------------------
export interface ILead extends Document {
  clerkId: string;
  name: string;
  email: string;
  phone: string;
  status: 'New Lead' | 'Applied' | 'Payment Pending' | 'Payment Success' | 'Enrolled' | 'Rejected';
  source: string;
  assignedTo?: string; // Employee ID or Name
  internshipId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>({
  clerkId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['New Lead', 'Applied', 'Payment Pending', 'Payment Success', 'Enrolled', 'Rejected'],
    default: 'New Lead' 
  },
  source: { type: String, default: 'Direct' },
  assignedTo: String,
  internshipId: { type: Schema.Types.ObjectId, ref: 'Internship' },
}, { timestamps: true });

export const Lead = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
