import { LucideIcon } from "lucide-react";

export const UserRole = {
  STUDENT: "student",
  TEACHER: "teacher",
  ADMIN: "admin",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export interface SidebarItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

export interface BreadcrumbConfig {
  // Map path segments to custom labels
  pathLabels?: Record<string, string>;
  // Custom transformations for specific path patterns
  pathTransforms?: Array<{
    pattern: RegExp;
    transform: (matches: RegExpMatchArray, path: string) => BreadcrumbItem[];
  }>;
  // Default home/root breadcrumb label
  homeLabel?: string;
  // Or a function to determine home label based on URL
  getHomeLabel?: (url: string) => string;
  // Whether to include the home breadcrumb
  includeHome?: boolean;
  // Whether to make dynamic segments (like [id]) clickable
  makeDynamicSegmentsClickable?: boolean;
  // Function to transform path segment to label
  segmentToLabel?: (segment: string) => string;
  // Function to determine if the domain should be included in breadcrumbs
  includeDomain?: boolean | ((url: string) => boolean);
}
