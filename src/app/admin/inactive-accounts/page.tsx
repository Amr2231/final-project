"use client";

import { useState } from "react";
import {
  DeactivatedPatientsTable,
  InactiveUsersTable,
} from "@/features/admin";
import { cn } from "@/lib/utils/tailwind-merge";

const TABS = ["Inactive Users", "Deactivated Patients"] as const;
type Tab = (typeof TABS)[number];

export default function InactiveAccountsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Inactive Users");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inactive Accounts</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage deactivated users and patients
        </p>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeTab === tab
                ? "border-blue-800 text-blue-800"
                : "border-transparent text-gray-500 hover:text-gray-700",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Inactive Users" ? (
        <InactiveUsersTable />
      ) : (
        <DeactivatedPatientsTable />
      )}
    </div>
  );
}
