import { BreadcrumbConfig, BreadcrumbItem } from "@/lib/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  const wordArray = name.split(" ");
  if (wordArray.length === 0) {
    return "AA";
  }
  if (wordArray.length === 1) {
    return wordArray[0].charAt(0).toUpperCase();
  }

  const firstWord = wordArray[0];
  const secondWord = wordArray[1];
  return firstWord.charAt(0).toUpperCase() + secondWord.charAt(0).toUpperCase();
}

export function urlToBreadcrumbs(
  url: string,
  config: BreadcrumbConfig = {},
): BreadcrumbItem[] {
  const {
    pathLabels = {},
    pathTransforms = [],
    homeLabel: staticHomeLabel = "Dashboard",
    getHomeLabel,
    includeHome = true,
    makeDynamicSegmentsClickable = false,
    segmentToLabel = defaultSegmentToLabel,
    includeDomain = false,
  } = config;

  const homeLabel = getHomeLabel ? getHomeLabel(url) : staticHomeLabel;

  let urlObj: URL;
  try {
    urlObj = new URL(url);
  } catch {
    urlObj = new URL(
      url.startsWith("/") ? url : `/${url}`,
      "http://example.com",
    );
  }

  const pathSegments = urlObj.pathname.split("/").filter(Boolean);

  for (const { pattern, transform } of pathTransforms) {
    const matches = urlObj.pathname.match(pattern);
    if (matches) {
      return transform(matches, urlObj.pathname);
    }
  }

  const breadcrumbs: BreadcrumbItem[] = [];

  if (includeDomain) {
    const shouldIncludeDomain =
      typeof includeDomain === "function" ? includeDomain(url) : includeDomain;

    if (
      shouldIncludeDomain &&
      urlObj.hostname &&
      urlObj.hostname !== "example.com"
    ) {
      breadcrumbs.push({
        label: urlObj.hostname,
        href: `${urlObj.protocol}//${urlObj.hostname}`,
      });
    }
  }

  if (includeHome) {
    breadcrumbs.push({
      label: homeLabel,
      href: `/${pathSegments[0] || ""}`,
    });
  }

  let currentPath = "";

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    if (includeHome && index === 0) return;

    const isDynamicSegment = segmentLooksLikeId(segment);

    let label;
    const fullPath = currentPath.endsWith("/")
      ? currentPath.slice(0, -1)
      : currentPath;

    if (pathLabels[fullPath]) {
      label = pathLabels[fullPath];
    } else if (pathLabels[segment]) {
      label = pathLabels[segment];
    } else {
      label = segmentToLabel(segment);
    }

    const isLastSegment = index === pathSegments.length - 1;

    breadcrumbs.push({
      label,
      href:
        isDynamicSegment && !makeDynamicSegmentsClickable
          ? undefined
          : currentPath,
      isCurrentPage: isLastSegment,
    });
  });

  return breadcrumbs;
}

function defaultSegmentToLabel(segment: string): string {
  if (segmentLooksLikeId(segment)) {
    return "Details";
  }

  const words = segment.replace(/-/g, " ").replace(/_/g, " ").split(" ");
  return words.map(capitalize).join(" ");
}

function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function segmentLooksLikeId(segment: string): boolean {
  // - CUID v2: cld8z5z0f000001l3i3z7z3z9
  if (/^c[a-z0-9]{24,}$/i.test(segment)) {
    return true;
  }

  return false;
}
