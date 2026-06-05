"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";

// Types
interface PaginationProps {
  totalPages: number;
  searchParams?: { page?: string };
  rtl?: boolean;
  className?: string;
}

// Component
export default function PaginationWrapper({
  totalPages,
  searchParams,
  rtl = false,
  className,
}: PaginationProps) {
  // Navigation
  const router = useRouter();
  const pathname = usePathname();
  const currentSearchParams = useSearchParams();

  // State
  const pageParam = Number(searchParams?.page) || 1;
  const currentPage = Math.max(1, Math.min(pageParam, totalPages));

  // Variables
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;
  const visiblePages = generatePageNumbers();

  // Functions
  /**
   * Generate an array of page numbers to display in the pagination.
   * Handles edge cases for first/last pages and includes ellipsis where needed.
   */
  function generatePageNumbers(): (number | "ellipsis")[] {
    // constants
    const maxVisible = 5;
    const edgeThreshold = 3;

    // Show all pages if total is within max visible range.
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Show first pages with ellipsis at the end.
    if (currentPage <= edgeThreshold) {
      return [1, 2, 3, 4, "ellipsis", totalPages];
    }

    // Show last pages with ellipsis at the start.
    if (currentPage >= totalPages - 2) {
      return [
        1,
        "ellipsis",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    // Show current page with surrounding pages and ellipsis on both sides.
    return [
      1,
      "ellipsis",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "ellipsis",
      totalPages,
    ];
  }

  /**
   * Navigate to a specific page by updating the URL query parameters.
   * Removes the page param if navigating to page 1.
   */
  function navigateToPage(page: number): void {
    if (page < 1 || page > totalPages) return;

    const params = new URLSearchParams(currentSearchParams.toString());

    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }

    const newUrl = params.toString() ? `${pathname}?${params}` : pathname;
    router.push(newUrl);
  }

  // Render
  return (
    <PaginationRoot className={className}>
      <PaginationContent dir={rtl ? "rtl" : "ltr"}>
        <PaginationItem>
          {/* Go to first page */}
          <PaginationLink
            onClick={() => navigateToPage(1)}
            className={cn(
              "rounded-lg border border-zinc-100 dark:border-zinc-200 hover:border-zinc-200 hover:bg-zinc-50 cursor-pointer",
              isFirstPage && "opacity-50 pointer-events-none",
            )}
            aria-disabled={isFirstPage}
          >
            {rtl ? (
              <ChevronsRight className="h-4 w-4 dark:text-zinc-50" />
            ) : (
              <ChevronsLeft className="h-4 w-4 dark:text-zinc-50" />
            )}
          </PaginationLink>
        </PaginationItem>

        {/* Previous page button */}
        <PaginationItem>
          <PaginationLink
            onClick={() => navigateToPage(currentPage - 1)}
            className={cn(
              "rounded-lg border border-zinc-100 dark:border-zinc-200 hover:border-zinc-200 hover:bg-zinc-50 cursor-pointer",
              isFirstPage && "opacity-50 pointer-events-none",
            )}
            aria-disabled={isFirstPage}
          >
            {rtl ? (
              <ChevronRight className="h-4 w-4 dark:text-zinc-50" />
            ) : (
              <ChevronLeft className="h-4 w-4 dark:text-zinc-50" />
            )}
          </PaginationLink>
        </PaginationItem>

        {/* Page numbers with ellipsis */}
        {visiblePages.map((page, idx) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => navigateToPage(page)}
                isActive={page === currentPage}
                className={cn(
                  "w-9 h-9 rounded-lg border",
                  page === currentPage
                    ? "bg-red-800 text-white border-red-600 hover:border-red-700 hover:bg-red-700 dark:bg-softPink-300 dark:text-black dark:border-softPink-300 cursor-pointer"
                    : "border-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-600 hover:border-zinc-200 hover:bg-zinc-50 cursor-pointer",
                )}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        {/* Next page button */}
        <PaginationItem>
          <PaginationLink
            onClick={() => navigateToPage(currentPage + 1)}
            className={cn(
              "rounded-lg border border-zinc-100 dark:border-zinc-200 hover:border-zinc-200 hover:bg-zinc-50 cursor-pointer",
              isLastPage && "opacity-50 pointer-events-none",
            )}
            aria-disabled={isLastPage}
          >
            {rtl ? (
              <ChevronLeft className="h-4 w-4 dark:text-zinc-50" />
            ) : (
              <ChevronRight className="h-4 w-4 dark:text-zinc-50" />
            )}
          </PaginationLink>
        </PaginationItem>

        {/* Forward 2 pages button */}
        <PaginationItem>
          <PaginationLink
            onClick={() => navigateToPage(totalPages)}
            className={cn(
              "rounded-lg border border-zinc-100 dark:border-zinc-200 hover:border-zinc-200 hover:bg-zinc-50 cursor-pointer",
              isLastPage && "opacity-50 pointer-events-none",
            )}
            aria-disabled={isLastPage}
          >
            {rtl ? (
              <ChevronsLeft className="h-4 w-4 dark:text-zinc-50" />
            ) : (
              <ChevronsRight className="h-4 w-4 dark:text-zinc-50" />
            )}
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
}
