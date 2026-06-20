import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { BeaconLogo } from "@/components/beacon/logo";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="w-full border-b bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8"><BeaconLogo /></div>
            <span className="hidden font-semibold text-navy sm:inline">Beacon HQ</span>
          </Link>
        </div>

        <nav className="hidden gap-4 sm:flex">
          <Link to="/" className="text-sm text-muted-foreground hover:text-navy">Home</Link>
          <Link to="/events" className="text-sm text-muted-foreground hover:text-navy">Events</Link>
          <Link to="/leaderboard" className="text-sm text-muted-foreground hover:text-navy">Leaderboards</Link>
          <Link to="/about" className="text-sm text-muted-foreground hover:text-navy">About</Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <Link to="/login"><Button variant="outline">Sign in</Button></Link>
          </div>
          <button className="sm:hidden" onClick={() => setOpen(!open)} aria-label="Open menu">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="sm:hidden border-t bg-background">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 p-4">
            <Link to="/" className="text-sm text-muted-foreground" onClick={() => setOpen(false)}>Home</Link>
            <Link to="/events" className="text-sm text-muted-foreground" onClick={() => setOpen(false)}>Events</Link>
            <Link to="/leaderboard" className="text-sm text-muted-foreground" onClick={() => setOpen(false)}>Leaderboards</Link>
            <Link to="/about" className="text-sm text-muted-foreground" onClick={() => setOpen(false)}>About</Link>
            <Link to="/login" className="text-sm text-muted-foreground" onClick={() => setOpen(false)}>Sign in</Link>
          </div>
        </div>
      )}
    </header>
  );
}
