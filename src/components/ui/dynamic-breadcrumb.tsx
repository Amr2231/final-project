"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { ADMIN_BREADCRUMB_LABELS } from "@/features/admin/constants/navigation";
import { DOCTOR_BREADCRUMB_LABELS } from "@/features/doctor/constants/navigation";

const labelMap: Record<string, string> = {
  ...ADMIN_BREADCRUMB_LABELS,
  ...DOCTOR_BREADCRUMB_LABELS,
  receptionist: "Receptionist",
  "historical-data": "Historical Data",
};

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .filter((seg) => isNaN(Number(seg)));

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((seg, i) => {
          const href = "/" + segments.slice(0, i + 1).join("/");
          const label = labelMap[seg] ?? seg;
          const isLast = i === segments.length - 1;

          return (
            <Fragment key={href}>
              <BreadcrumbItem className="hidden md:flex items-center gap-1.5">
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
