"use client";

import React, { useState, useEffect } from "react";
import { ClipboardList, Search, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface AuditLogRecord {
  id: string;
  admin_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  entity_title: string | null;
  changes: Record<string, unknown> | null;
  created_at: string;
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 25;

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  async function fetchAuditLogs() {
    setLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("admin_audit_logs")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setLogs(data as AuditLogRecord[]);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error("Fetch audit logs error", e);
      }
    }

    setLogs([
      {
        id: "log-1",
        admin_id: "admin-001",
        action: "Initial Admin System Mounted",
        entity_type: "system",
        entity_id: null,
        entity_title: "Affan er Tong Security Subsystem",
        changes: null,
        created_at: new Date().toISOString(),
      },
    ]);
    setLoading(false);
  }

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.entity_title && log.entity_title.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="pb-6 border-b border-[#171717]/15 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#E87525] mb-1">
            SECURITY &amp; COMPLIANCE
          </div>
          <h1 className="font-condensed text-4xl uppercase tracking-wider text-[#171717]">
            ADMINISTRATIVE AUDIT LOGS
          </h1>
          <p className="text-xs text-[#171717]/80 mt-1">
            Read-only chronological record of all module edits, video creations, role modifications, and account suspensions.
          </p>
        </div>

        <div className="text-xs font-mono text-[#171717]/60 bg-white p-2.5 border border-[#171717]/15">
          Total Recorded Actions: <strong className="text-[#E87525]">{logs.length}</strong>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 border border-[#171717]/15">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#171717]/60" />
          <input
            type="text"
            placeholder="Search logs by action, entity type, or title..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-[#F5F0E6] border border-[#171717]/20 text-xs text-[#171717] focus:outline-none focus:border-[#E87525]"
          />
        </div>
      </div>

      {/* Logs Table */}
      {loading ? (
        <div className="p-12 text-center font-mono text-xs text-[#E87525] bg-white border border-[#171717]/15">
          Loading administrative audit logs...
        </div>
      ) : paginatedLogs.length > 0 ? (
        <div className="bg-white border border-[#171717]/15 shadow-xs overflow-hidden">
          
          {/* Header */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-3.5 bg-[#171717] text-[#F5F0E6] font-mono text-xs font-bold uppercase tracking-wider border-b border-[#171717]">
            <div className="col-span-3">TIMESTAMP</div>
            <div className="col-span-3">ACTION</div>
            <div className="col-span-2">ENTITY TYPE</div>
            <div className="col-span-4">TARGET ITEM / DETAILS</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-[#171717]/10">
            {paginatedLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 sm:p-5 lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center hover:bg-[#F5F0E6]/30 transition-colors text-xs"
              >
                {/* Timestamp */}
                <div className="lg:col-span-3 font-mono text-[11px] text-[#625E57] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#E87525] shrink-0" />
                  <span>{new Date(log.created_at).toLocaleString()}</span>
                </div>

                {/* Action */}
                <div className="lg:col-span-3 mt-1 lg:mt-0 font-bold text-[#171717]">
                  <span className="px-2 py-0.5 bg-[#171717]/5 border border-[#171717]/15 font-mono text-[11px] uppercase">
                    {log.action}
                  </span>
                </div>

                {/* Entity Type */}
                <div className="lg:col-span-2 mt-1 lg:mt-0 font-mono text-[11px] text-[#E87525] uppercase">
                  {log.entity_type}
                </div>

                {/* Target Title & Changes */}
                <div className="lg:col-span-4 mt-1 lg:mt-0 font-sans text-xs text-[#171717]/80 truncate">
                  {log.entity_title || log.entity_id || "N/A"}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 bg-[#F5F0E6]/40 border-t border-[#171717]/15 flex items-center justify-between font-mono text-xs">
              <span className="text-[#171717]/60">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-3 py-1 bg-white border border-[#171717]/20 disabled:opacity-40 font-bold uppercase min-h-[36px] flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-3 py-1 bg-white border border-[#171717]/20 disabled:opacity-40 font-bold uppercase min-h-[36px] flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="p-12 text-center bg-white border border-[#171717]/15 space-y-3">
          <ClipboardList className="w-8 h-8 text-[#171717]/40 mx-auto" />
          <p className="text-sm font-bold uppercase tracking-wider text-[#171717]">No audit log records found</p>
        </div>
      )}

    </div>
  );
}
