import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard, CalendarDays, Users, UsersRound, Gavel, Trophy,
  Award, BarChart3, Settings, Menu, X, FileText, ListChecks, GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BeaconLogo, BeaconMark } from "./logo";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/organizer/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/organizer/events", label: "All Events", icon: CalendarDays },
];

export function OrganizerShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const SidebarInner = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-5 border-b">
        {collapsed ? <BeaconMark /> : <BeaconLogo />}
      </div>
      <nav className="flex-1 px-3 py-6 space-y-0.5">
        {nav.map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-beige text-navy" : "text-muted-foreground hover:bg-beige/60 hover:text-navy",
                collapsed && "justify-center",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        {!collapsed ? (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
            <Button onClick={signOut} variant="outline" size="sm" className="w-full">Sign out</Button>
          </div>
        ) : (
          <Button onClick={signOut} variant="outline" size="icon" className="w-full h-9">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r bg-card transition-[width] duration-200 lg:block",
          collapsed ? "w-[64px]" : "w-[240px]",
        )}
      >
        {SidebarInner}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy/30" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[260px] border-r bg-card">{SidebarInner}</aside>
        </div>
      )}

      {/* Main */}
      <div className={cn("transition-[padding] duration-200", collapsed ? "lg:pl-[64px]" : "lg:pl-[240px]")}>
        <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <Button onClick={() => setMobileOpen(true)} variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              <Button onClick={() => setCollapsed(!collapsed)} variant="ghost" size="icon" className="hidden lg:inline-flex">
                <Menu className="h-5 w-5" />
              </Button>
              <div className="hidden text-xs uppercase tracking-[0.22em] text-muted-foreground sm:block">
                Organizer Workspace
              </div>
            </div>
            <Button onClick={() => navigate({ to: "/organizer/events/new" })} className="bg-navy text-background hover:bg-navy/90">
              + Create Event
            </Button>
          </div>
        </header>
        <main className="mx-auto max-w-[1440px] px-6 py-10">{children}</main>
      </div>
    </div>
  );
}

/* Event sub-navigation for /organizer/events/$id/* */
const eventTabs = [
  { slug: "", label: "Overview", icon: FileText },
  { slug: "jury", label: "Jury", icon: GraduationCap },
  { slug: "registrations", label: "Registrations", icon: Users },
  { slug: "teams", label: "Teams", icon: UsersRound },
  { slug: "submissions", label: "Submissions", icon: ListChecks },
  { slug: "judging", label: "Judging", icon: Gavel },
  { slug: "leaderboard", label: "Leaderboard", icon: Trophy },
  { slug: "certificates", label: "Certificates", icon: Award },
  { slug: "analytics", label: "Analytics", icon: BarChart3 },
];

export function EventTabs({ eventId }: { eventId: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const base = `/organizer/events/${eventId}`;
  return (
    <div className="border-b -mx-6 px-6 mb-8">
      <div className="flex gap-1 overflow-x-auto">
        {eventTabs.map((t) => {
          const href = t.slug ? `${base}/${t.slug}` : base;
          const active = t.slug ? pathname.startsWith(href) : pathname === base;
          const Icon = t.icon;
          return (
            <Link
              key={t.slug}
              to={href as string}
              className={cn(
                "inline-flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-colors whitespace-nowrap",
                active ? "border-navy text-navy" : "border-transparent text-muted-foreground hover:text-navy",
              )}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* Role gate */
export function RequireRole({ role, children }: { role: "organizer" | "jury" | "participant"; children: ReactNode }) {
  const { loading, role: current } = useAuth();
  const navigate = useNavigate();
  if (loading) {
    return <div className="p-12 text-sm text-muted-foreground">Loading…</div>;
  }
  if (current !== role) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <h2 className="font-display text-2xl text-navy">403 · Access restricted</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          This page is for {role}s only. Your account doesn't have permission to view it.
        </p>
        <Button onClick={() => navigate({ to: "/login" })} className="mt-6 bg-navy text-background hover:bg-navy/90">
          Back to sign in
        </Button>
      </div>
    );
  }
  return <>{children}</>;
}