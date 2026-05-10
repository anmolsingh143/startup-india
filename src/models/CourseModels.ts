import mongoose, { Schema, Document } from 'mongoose';

// ----------------------------------------
// COURSE MODEL
// ----------------------------------------
export interface ICourse extends Document {
  title: string;
  description: string;
  instructor: string;
  price: number;
  tags: string[];
  thumbnailUrl: string;
  enrolledStudents: mongoose.Types.ObjectId[];
}

const CourseSchema = new Schema<ICourse>({
  title: { type: String, required: true, text: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true },
  price: { type: Number, default: 0 },
  tags: [String],
  thumbnailUrl: String,
  enrolledStudents: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export const Course = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);

// ----------------------------------------
// LESSON & QUIZ MODELS
// ----------------------------------------
export interface ILesson extends Document {
  courseId: mongoose.Types.ObjectId;
  title: string;
  videoUrl: string;
  content: string;
  order: number;
}

const LessonSchema = new Schema<ILesson>({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  title: { type: String, required: true },
  videoUrl: String,
  content: String,
  order: { type: Number, required: true }
}, { timestamps: true });

export const Lesson = mongoose.models.Lesson || mongoose.model<ILesson>('Lesson', LessonSchema);

// ----------------------------------------
// CERTIFICATE MODEL
// ----------------------------------------
export interface ICertificate extends Document {
  studentId: mongoose.Types.ObjectId;
  courseId?: mongoose.Types.ObjectId;
  internshipId?: mongoose.Types.ObjectId;
  type: 'Course' | 'Internship';
  issueDate: Date;
  certificateUrl: string;
  verificationHash: string;
}

const CertificateSchema = new Schema<ICertificate>({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
  internshipId: { type: Schema.Types.ObjectId, ref: 'Internship' },
  type: { type: String, enum: ['Course', 'Internship'], required: true },
  issueDate: { type: Date, default: Date.now },
  certificateUrl: { type: String, required: true },
  verificationHash: { type: String, required: true, unique: true, index: true }
}, { timestamps: true });

export const Certificate = mongoose.models.Certificate || mongoose.model<ICertificate>('Certificate', CertificateSchema);
