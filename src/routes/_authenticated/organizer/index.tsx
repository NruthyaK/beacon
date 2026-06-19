import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/organizer/")({
  component: () => <Navigate to="/organizer/dashboard" />,
});