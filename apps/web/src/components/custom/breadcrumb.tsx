import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BreadcrumbConfig } from "@/lib/types";
import { urlToBreadcrumbs } from "@/lib/utils";
import { Fragment } from "react";

interface BreadcrumbRendererProps {
  url: string;
  config?: BreadcrumbConfig;
}

export function BreadcrumbRenderer({ url, config }: BreadcrumbRendererProps) {
  const breadcrumbItems = urlToBreadcrumbs(url, config);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <Fragment key={item.href || item.label}>
            {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
            <BreadcrumbItem
              className={item.isCurrentPage ? undefined : "hidden md:block"}
            >
              {item.isCurrentPage ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : item.href ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              ) : (
                <span>{item.label}</span>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
