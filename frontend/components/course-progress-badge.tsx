"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { useProgress } from "@/components/progress-provider";

export default function CourseProgressBadge({
  courseId,
  allFileKeys,
}: {
  courseId: string;
  allFileKeys: string[];
}) {
  const { getCourseProgress } = useProgress();
  const progress = getCourseProgress(courseId, allFileKeys.length, allFileKeys);

  return (
    <Badge variant={progress.percentage === 100 ? "secondary" : "outline"}>
      {progress.percentage}% complete
    </Badge>
  );
}
