"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Shield,
  ShieldCheck,
  Ban,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  UserX,
  UserCheck,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface UserProfileItem {
  id: string;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: "user" | "admin";
  account_status: "active" | "suspended" | "disabled";
  suspended_reason: string | null;
  suspended_at: string | null;
  created_at: string;
  last_active_at: string | null;
  email_verified?: boolean;
}

export default function AdminUsersDirectoryPage() {
  const [users, setUsers] = useState<UserProfileItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 20;

  const [roleModalUser, setRoleModalUser] = useState<UserProfileItem | null>(null);
  const [targetRole, setTargetRole] = useState<"user" | "admin">("admin");
  const [isChangingRole, setIsChangingRole] = useState<boolean>(false);

  const [suspendModalUser, setSuspendModalUser] = useState<UserProfileItem | null>(null);
  const [suspensionReason, setSuspensionReason] = useState<string>("");
  const [isSuspending, setIsSuspending] = useState<boolean>(false);

  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchUsersDirectory();
  }, []);

  async function fetchUsersDirectory() {
    setLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && profiles) {
          setUsers(
            profiles.map((p) => ({
              id: p.id,
              display_name: p.display_name,
              email: p.display_name?.includes("@") ? p.display_name : `${p.display_name || "debater"}@affanertong.org`,
              avatar_url: p.avatar_url,
              role: p.role || "user",
              account_status: p.account_status || "active",
              suspended_reason: p.suspended_reason,
              suspended_at: p.suspended_at,
              created_at: p.created_at,
              last_active_at: p.last_active_at || p.created_at,
              email_verified: true,
            }))
          );
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error("Supabase profiles load error", e);
      }
    }

    const mockUsers: UserProfileItem[] = [
      {
        id: "admin-001",
        display_name: "Affan (Chief Administrator)",
        email: "admin@affanertong.org",
        avatar_url: null,
        role: "admin",
        account_status: "active",
        suspended_reason: null,
        suspended_at: null,
        created_at: "2026-01-01T00:00:00Z",
        last_active_at: new Date().toISOString(),
        email_verified: true,
      },
      {
        id: "user-002",
        display_name: "Tanvir Ahmed",
        email: "tanvir@example.com",
        avatar_url: null,
        role: "user",
        account_status: "active",
        suspended_reason: null,
        suspended_at: null,
        created_at: "2026-02-10T12:00:00Z",
        last_active_at: "2026-08-20T14:30:00Z",
        email_verified: true,
      },
      {
        id: "user-003",
        display_name: "Nusrat Jahan",
        email: "nusrat@example.com",
        avatar_url: null,
        role: "user",
        account_status: "active",
        suspended_reason: null,
        suspended_at: null,
        created_at: "2026-03-05T09:15:00Z",
        last_active_at: "2026-08-19T11:00:00Z",
        email_verified: true,
      },
    ];

    setUsers(mockUsers);
    setLoading(false);
  }

  const handleConfirmRoleChange = async () => {
    if (!roleModalUser) return;
    setIsChangingRole(true);
    setFeedback(null);

    if (targetRole === "user" && roleModalUser.role === "admin") {
      const adminCount = users.filter((u) => u.role === "admin").length;
      if (adminCount <= 1) {
        setFeedback({
          message: "Safety Block: Cannot demote the final remaining administrator account.",
          type: "error",
        });
        setIsChangingRole(false);
        setRoleModalUser(null);
        return;
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("profiles")
          .update({
            role: targetRole,
            updated_at: new Date().toISOString(),
          })
          .eq("id", roleModalUser.id);

        if (!error) {
          const { data: session } = await supabase.auth.getSession();
          if (session.session?.user) {
            await supabase.from("admin_audit_logs").insert({
              admin_id: session.session.user.id,
              action: `User role changed from ${roleModalUser.role} to ${targetRole}`,
              entity_type: "user_profile",
              entity_id: roleModalUser.id,
              entity_title: roleModalUser.display_name || roleModalUser.email || "User",
            });
          }
        }
      } catch (err) {
        console.error("Role update error", err);
      }
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === roleModalUser.id ? { ...u, role: targetRole } : u))
    );

    setFeedback({
      message: `User ${roleModalUser.display_name || roleModalUser.email} role updated to ${targetRole.toUpperCase()}.`,
      type: "success",
    });

    setIsChangingRole(false);
    setRoleModalUser(null);
  };

  const handleConfirmSuspension = async () => {
    if (!suspendModalUser) return;
    setIsSuspending(true);
    setFeedback(null);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: session } = await supabase.auth.getSession();
        const adminId = session.session?.user?.id;

        const { error } = await supabase
          .from("profiles")
          .update({
            account_status: "suspended",
            suspended_reason: suspensionReason || "Administrative decision",
            suspended_by: adminId || null,
            suspended_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", suspendModalUser.id);

        if (!error && adminId) {
          await supabase.from("admin_audit_logs").insert({
            admin_id: adminId,
            action: "Account suspended",
            entity_type: "user_profile",
            entity_id: suspendModalUser.id,
            entity_title: suspendModalUser.display_name || suspendModalUser.email || "User",
            changes: { reason: suspensionReason },
          });
        }
      } catch (err) {
        console.error("Suspension error", err);
      }
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.id === suspendModalUser.id
          ? {
              ...u,
              account_status: "suspended",
              suspended_reason: suspensionReason || "Administrative decision",
              suspended_at: new Date().toISOString(),
            }
          : u
      )
    );

    setFeedback({
      message: `Account ${suspendModalUser.display_name || suspendModalUser.email} suspended.`,
      type: "success",
    });

    setIsSuspending(false);
    setSuspendModalUser(null);
    setSuspensionReason("");
  };

  const handleReactivateAccount = async (u: UserProfileItem) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: session } = await supabase.auth.getSession();
        const adminId = session.session?.user?.id;

        await supabase
          .from("profiles")
          .update({
            account_status: "active",
            suspended_reason: null,
            suspended_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", u.id);

        if (adminId) {
          await supabase.from("admin_audit_logs").insert({
            admin_id: adminId,
            action: "Account reactivated",
            entity_type: "user_profile",
            entity_id: u.id,
            entity_title: u.display_name || u.email || "User",
          });
        }
      } catch (err) {
        console.error("Reactivation error", err);
      }
    }

    setUsers((prev) =>
      prev.map((item) =>
        item.id === u.id
          ? { ...item, account_status: "active", suspended_reason: null, suspended_at: null }
          : item
      )
    );

    setFeedback({
      message: `Account ${u.display_name || u.email} reactivated successfully.`,
      type: "success",
    });
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.display_name && u.display_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesStatus = statusFilter === "all" || u.account_status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getInitials = (name: string | null, email: string | null) => {
    const target = name || email || "US";
    const parts = target.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return target.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="pb-6 border-b border-[#171717]/15 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#E87525] mb-1">
            USER MANAGEMENT &amp; DIRECTORY
          </div>
          <h1 className="font-condensed text-4xl uppercase tracking-wider text-[#171717]">
            REGISTERED USERS DIRECTORY
          </h1>
          <p className="text-xs text-[#171717]/80 mt-1">
            Search registered debaters, manage administrator role assignments, and oversee account statuses.
          </p>
        </div>

        <div className="text-xs font-mono text-[#171717]/60 bg-white p-2.5 border border-[#171717]/15">
          Total Registered: <strong className="text-[#E87525]">{users.length}</strong>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 border text-xs font-bold flex items-center justify-between ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
              : "bg-red-50 border-red-300 text-red-700"
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-xs uppercase font-mono hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 border border-[#171717]/15 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#171717]/60" />
          <input
            type="text"
            placeholder="Search by display name or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-[#F5F0E6] border border-[#171717]/20 text-xs text-[#171717] focus:outline-none focus:border-[#E87525]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-[#F5F0E6] border border-[#171717]/20 font-bold uppercase tracking-wider text-xs focus:outline-none focus:border-[#E87525] min-h-[40px]"
          >
            <option value="all">ALL ROLES</option>
            <option value="user">USER (DEBATER)</option>
            <option value="admin">ADMINISTRATOR</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-[#F5F0E6] border border-[#171717]/20 font-bold uppercase tracking-wider text-xs focus:outline-none focus:border-[#E87525] min-h-[40px]"
          >
            <option value="all">ALL STATUSES</option>
            <option value="active">ACTIVE</option>
            <option value="suspended">SUSPENDED</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      {loading ? (
        <div className="p-12 text-center font-mono text-xs text-[#E87525] bg-white border border-[#171717]/15">
          Loading registered users directory...
        </div>
      ) : paginatedUsers.length > 0 ? (
        <div className="bg-white border border-[#171717]/15 shadow-xs overflow-hidden">
          
          <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-3.5 bg-[#171717] text-[#F5F0E6] font-mono text-xs font-bold uppercase tracking-wider border-b border-[#171717]">
            <div className="col-span-3">USER &amp; EMAIL</div>
            <div className="col-span-2">ROLE</div>
            <div className="col-span-2">STATUS</div>
            <div className="col-span-2">REGISTERED</div>
            <div className="col-span-3 text-right">ACTIONS</div>
          </div>

          <div className="divide-y divide-[#171717]/10">
            {paginatedUsers.map((u) => (
              <div
                key={u.id}
                className="p-4 sm:p-6 lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center hover:bg-[#F5F0E6]/30 transition-colors"
              >
                
                <div className="lg:col-span-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#E87525] text-[#F5F0E6] font-condensed font-bold text-xs flex items-center justify-center shrink-0 border border-[#171717]/20">
                    {getInitials(u.display_name, u.email)}
                  </div>
                  <div className="space-y-0.5 truncate">
                    <h3 className="font-bold text-[#171717] text-xs truncate">
                      {u.display_name || "Debater"}
                    </h3>
                    <p className="font-mono text-[11px] text-[#625E57] truncate">{u.email}</p>
                  </div>
                </div>

                <div className="lg:col-span-2 mt-2 lg:mt-0 font-mono text-xs">
                  {u.role === "admin" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#171717] text-[#F5F0E6] text-[10px] font-bold uppercase tracking-wider border border-[#171717]">
                      <ShieldCheck className="w-3 h-3 text-[#E87525]" />
                      <span>ADMIN</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gray-100 text-gray-800 text-[10px] font-bold uppercase tracking-wider border border-gray-300">
                      <span>USER</span>
                    </span>
                  )}
                </div>

                <div className="lg:col-span-2 mt-2 lg:mt-0">
                  {u.account_status === "active" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider border border-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>ACTIVE</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-red-50 text-red-700 text-[10px] font-bold uppercase tracking-wider border border-red-300">
                      <Ban className="w-3 h-3 text-red-600" />
                      <span>SUSPENDED</span>
                    </span>
                  )}
                </div>

                <div className="lg:col-span-2 mt-2 lg:mt-0 font-mono text-[11px] text-[#625E57]">
                  {new Date(u.created_at).toLocaleDateString()}
                </div>

                <div className="lg:col-span-3 mt-4 lg:mt-0 flex flex-wrap lg:justify-end items-center gap-2 font-condensed uppercase tracking-wider text-xs">
                  
                  <button
                    onClick={() => {
                      setRoleModalUser(u);
                      setTargetRole(u.role === "admin" ? "user" : "admin");
                    }}
                    className="px-3 py-1.5 border border-[#171717]/20 text-[#171717] hover:bg-[#171717] hover:text-[#F5F0E6] transition-colors font-bold min-h-[38px] flex items-center gap-1"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#E87525]" />
                    <span>{u.role === "admin" ? "Demote to User" : "Promote to Admin"}</span>
                  </button>

                  {u.account_status === "active" ? (
                    <button
                      onClick={() => setSuspendModalUser(u)}
                      className="px-3 py-1.5 border border-red-300 text-red-600 hover:bg-red-600 hover:text-white transition-colors font-bold min-h-[38px] flex items-center gap-1"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Suspend</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReactivateAccount(u)}
                      className="px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 transition-colors font-bold min-h-[38px] flex items-center gap-1"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Reactivate</span>
                    </button>
                  )}

                </div>

              </div>
            ))}
          </div>

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
          <Users className="w-8 h-8 text-[#171717]/40 mx-auto" />
          <p className="text-sm font-bold uppercase tracking-wider text-[#171717]">No registered users found</p>
          <p className="text-xs text-[#171717]/60">Try adjusting your search query or status filter.</p>
        </div>
      )}

      {roleModalUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#F5F0E6] max-w-md w-full p-6 border-2 border-[#171717] shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-[#E87525] border-b border-[#171717]/15 pb-3">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h3 className="font-condensed text-2xl uppercase font-bold text-[#171717]">
                CONFIRM ROLE CHANGE
              </h3>
            </div>

            <p className="text-xs text-[#171717] leading-relaxed">
              Are you sure you want to change the role of <strong className="text-[#E87525]">{roleModalUser.display_name || roleModalUser.email}</strong> from <code>{roleModalUser.role.toUpperCase()}</code> to <code>{targetRole.toUpperCase()}</code>?
            </p>

            {targetRole === "admin" && (
              <p className="text-[11px] bg-amber-50 border border-amber-300 p-2 text-amber-900 font-medium">
                <strong>Warning:</strong> Administrators have complete access to manage learning modules, YouTube videos, and the registered user directory.
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#171717]/15">
              <button
                onClick={() => setRoleModalUser(null)}
                disabled={isChangingRole}
                className="px-4 py-2 border border-[#171717]/30 text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors min-h-[44px]"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmRoleChange}
                disabled={isChangingRole}
                className="px-4 py-2 bg-[#E87525] text-[#F5F0E6] text-xs font-bold uppercase tracking-wider hover:bg-[#171717] transition-colors flex items-center gap-1.5 min-h-[44px]"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isChangingRole ? "Updating..." : "Confirm Role Update"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {suspendModalUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#F5F0E6] max-w-md w-full p-6 border-2 border-[#171717] shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600 border-b border-[#171717]/15 pb-3">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-condensed text-2xl uppercase font-bold text-[#171717]">
                SUSPEND USER ACCOUNT
              </h3>
            </div>

            <p className="text-xs text-[#171717] leading-relaxed">
              You are about to suspend account <strong className="text-red-600">{suspendModalUser.display_name || suspendModalUser.email}</strong>.
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1">
                Reason for Suspension *
              </label>
              <textarea
                required
                rows={2}
                placeholder="State the administrative reason for account suspension..."
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#171717]/20 text-xs text-[#171717] focus:outline-none focus:border-[#E87525]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#171717]/15">
              <button
                onClick={() => {
                  setSuspendModalUser(null);
                  setSuspensionReason("");
                }}
                disabled={isSuspending}
                className="px-4 py-2 border border-[#171717]/30 text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors min-h-[44px]"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmSuspension}
                disabled={isSuspending || !suspensionReason.trim()}
                className="px-4 py-2 bg-red-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors flex items-center gap-1.5 min-h-[44px] disabled:opacity-50"
              >
                <Ban className="w-4 h-4" />
                <span>{isSuspending ? "Suspending..." : "Confirm Account Suspension"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
