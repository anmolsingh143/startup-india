import { COURSES } from "@/data/courses";
import { CourseDetailClient } from "@/components/courses/CourseDetailClient";
import { Suspense } from "react";

export async function generateStaticParams() {
  return COURSES.map((c) => ({ id: c.id }));
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary font-bold">Loading Experience...</div>
      </div>
    }>
      <CourseDetailClient courseId={id} />
    </Suspense>
  );
}
