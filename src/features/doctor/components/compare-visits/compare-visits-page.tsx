"use client";

import { useState } from "react";
import Link from "next/link";
import { GitCompare, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { formatFullTimestamp } from "@/lib/utils/date-format";
import { DoctorPageShell } from "../shared/ui";
import { useHistoricalPatients } from "../../hooks/use-historical-patients";
import { useAiResult } from "../../hooks/use-ai-analysis";
import { useGetReport } from "../../hooks/use-report";
import { useDebounce } from "use-debounce";

// helper components
function VisitPanel({ studyId, label }: { studyId: string; label: string }) {
  // hooks
  const { data: aiResponse } = useAiResult(studyId);
  const { data: reportResponse } = useGetReport(studyId);
  const ai = aiResponse?.data;
  const report = reportResponse as
    | { notes?: string; data?: { notes?: string } }
    | undefined;

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 p-4 space-y-4">
      {/* header */}
      <h3 className="text-sm font-semibold text-[#8B1A2B]">{label}</h3>
      <div>
        <p className="text-xs font-medium text-gray-500 mb-1">AI Diagnosis</p>
        <p className="text-sm">{ai?.diagnosis ?? "No AI result"}</p>
        {ai?.ejection_fraction != null && (
          <p className="text-xs text-gray-500 mt-1">
            EF: {ai.ejection_fraction}%
          </p>
        )}
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 mb-1">Report Notes</p>
        <p className="text-sm whitespace-pre-wrap">
          {report?.data?.notes ?? report?.notes ?? "No report notes"}
        </p>
      </div>
      {/* actions */}
      <Link
        href={`/doctor/patients/${studyId}/ai-analysis`}
        className="text-xs text-[#8B1A2B] hover:underline"
      >
        Open full study
      </Link>
    </div>
  );
}

// Visit selector
function VisitSelector({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  // hooks
  const [search, setSearch] = useState("");
  const [debounced] = useDebounce(search, 400);
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  const { data, isLoading } = useHistoricalPatients({
    keyword: debounced.trim() || undefined,
    page,
    limit: LIMIT,
  });

  const patients = data?.patients ?? [];
  const totalPages = data?.pages ?? 1;

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <div className="rounded-xl border border-gray-200 bg-white dark:bg-gray-950 overflow-hidden">
        <div className="p-2 border-b border-gray-100">
          {/* search input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search patients..."
              className="pl-8 h-8 text-sm"
            />
          </div>
        </div>
        <div className="max-h-56 overflow-y-auto divide-y divide-gray-50">
          {isLoading ? (
            <p className="text-xs text-gray-400 py-3 text-center">Loading…</p>
          ) : patients.length === 0 ? (
            <p className="text-xs text-gray-400 py-3 text-center">No results</p>
          ) : (
            patients.map((p) => {
              const sid = String(p.studies.study_id);
              return (
                <button
                  key={sid}
                  type="button"
                  onClick={() => onChange(sid)}
                  className={`w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-colors text-sm ${value === sid ? "bg-[#8B1A2B]/5 text-[#8B1A2B] font-medium" : ""}`}
                >
                  <span className="block truncate">
                    {p.first_name} {p.last_name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {p.study} · {formatFullTimestamp(p.received_date)}
                  </span>
                </button>
              );
            })
          )}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100 bg-gray-50/50">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="text-xs text-gray-500 disabled:opacity-40 hover:text-[#8B1A2B]"
            >
              ← Prev
            </button>
            <span className="text-xs text-gray-400">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="text-xs text-gray-500 disabled:opacity-40 hover:text-[#8B1A2B]"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function CompareVisitsPage() {
  const [visitA, setVisitA] = useState("");
  const [visitB, setVisitB] = useState("");

  return (
    <DoctorPageShell
      title="Compare Visits"
      description="Side-by-side comparison of two patient studies"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <VisitSelector label="Visit A" value={visitA} onChange={setVisitA} />
        <VisitSelector label="Visit B" value={visitB} onChange={setVisitB} />
      </div>

      {!visitA || !visitB ? (
        <EmptyState
          icon={GitCompare}
          title="Select two visits"
          description="Choose studies from your historical patients to compare."
        />
      ) : visitA === visitB ? (
        <EmptyState
          icon={GitCompare}
          title="Different visits required"
          description="Select two different studies to compare."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <VisitPanel studyId={visitA} label="Visit A" />
          <VisitPanel studyId={visitB} label="Visit B" />
        </div>
      )}
    </DoctorPageShell>
  );
}
