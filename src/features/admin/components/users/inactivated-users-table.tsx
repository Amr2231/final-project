"use client";

import { useState } from "react";
import { DeactivatedPatientsTable, InactiveUsersTable } from "@/features/admin";
import { cn } from "@/lib/utils/tailwind-merge";

// types
const TABS = ["Inactive Users", "Deactivated Patients"] as const;
type Tab = (typeof TABS)[number];

// Component
export default function InactiveAccountsPage() {
  // state
  const [activeTab, setActiveTab] = useState<Tab>("Inactive Users");

  return (
    <div className="p-6 space-y-6">
      <div>
        {/* title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Inactive Accounts
        </h1>

        {/* description */}
        <p className="text-sm text-gray-500 mt-1">
          Manage deactivated users and patients
        </p>
      </div>

      {/* tabs */}
      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-800">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors -mb-px border-b-2",
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* content */}
      {activeTab === "Inactive Users" ? (
        <InactiveUsersTable />
      ) : (
        <DeactivatedPatientsTable />
      )}
    </div>
  );
}
