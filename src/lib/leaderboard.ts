export interface LbRow { id: string; team: string; college: string; project_name: string; score: number; }

export function computeLeaderboard(subs: any[], scores: any[]): LbRow[] {
  const totals: Record<string, number> = {};
  for (const s of scores) {
    totals[s.submission_id] = (totals[s.submission_id] ?? 0) + Number(s.points);
  }
  return subs
    .map((s) => ({
      id: s.id,
      team: s.teams?.name ?? "—",
      college: s.teams?.college ?? "—",
      project_name: s.project_name,
      score: totals[s.id] ?? 0,
    }))
    .sort((a, b) => b.score - a.score);
}