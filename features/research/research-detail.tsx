"use client";

import Link from "next/link";
import { useResearchDetail, useResearchLogs } from "./hooks/use-research";
import { ResearchStatusBadge } from "./components/research-status-badge";

function dateLabel(value: string | null | undefined) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(value));
}

export function ResearchDetail({ id, admin = false }: { id: string; admin?: boolean }) {
  const detail = useResearchDetail(id);
  const logs = useResearchLogs(id);
  if (detail.isLoading) return <p className="p-8 text-sm text-muted-foreground">Loading research application…</p>;
  if (detail.isError || !detail.data) return <p className="p-8 text-sm text-destructive">Could not load this research application. <button className="underline" onClick={() => detail.refetch()}>Retry</button></p>;
  const research = detail.data;
  return <main className="mx-auto max-w-5xl space-y-6 p-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><Link href={admin ? "/admin/research" : "/dashboard/research"} className="text-sm text-muted-foreground hover:underline">← Research applications</Link><h1 className="mt-2 text-2xl font-semibold">{research.title}</h1></div>
      <div className="flex items-center gap-3"><ResearchStatusBadge status={research.status} />{!admin && research.status === "PENDING" && <Link className="rounded-md border px-4 py-2 text-sm" href={`/dashboard/research/${id}/edit`}>Edit application</Link>}</div>
    </div>
    {research.student && <section className="rounded-lg border p-5"><h2 className="font-medium">Student</h2><p className="mt-2">{research.student.name} · {research.student.nim}</p></section>}
    <section className="grid gap-4 rounded-lg border p-5 sm:grid-cols-2"><div><h2 className="font-medium">Research period</h2><p className="mt-2 text-sm text-muted-foreground">{dateLabel(research.startDate)} – {dateLabel(research.endDate)}</p></div><div><h2 className="font-medium">Submitted</h2><p className="mt-2 text-sm text-muted-foreground">{dateLabel(research.createdAt)}</p></div></section>
    <section className="grid gap-4 md:grid-cols-3">
      <div className="rounded-lg border p-5"><h2 className="font-medium">Supervisors</h2>{research.supervisors.length ? <ul className="mt-3 space-y-2 text-sm">{research.supervisors.map((person) => <li key={person.id}>{person.name} <span className="text-muted-foreground">({person.nip})</span></li>)}</ul> : <p className="mt-3 text-sm text-muted-foreground">None selected</p>}</div>
      <div className="rounded-lg border p-5"><h2 className="font-medium">Laboratories</h2>{research.laboratories.length ? <ul className="mt-3 space-y-2 text-sm">{research.laboratories.map((lab) => <li key={lab.id}>{lab.name}{lab.location ? <span className="text-muted-foreground"> · {lab.location}</span> : null}</li>)}</ul> : <p className="mt-3 text-sm text-muted-foreground">None selected</p>}</div>
      <div className="rounded-lg border p-5"><h2 className="font-medium">Equipment</h2>{research.equipment.length ? <ul className="mt-3 space-y-2 text-sm">{research.equipment.map((item) => <li key={item.id}>{item.name}{item.inventoryCode ? <span className="text-muted-foreground"> · {item.inventoryCode}</span> : null}</li>)}</ul> : <p className="mt-3 text-sm text-muted-foreground">None selected</p>}</div>
    </section>
    <section className="rounded-lg border p-5"><h2 className="font-medium">Application history</h2>{logs.isLoading ? <p className="mt-3 text-sm text-muted-foreground">Loading history…</p> : logs.isError ? <button onClick={() => logs.refetch()} className="mt-3 text-sm underline">Could not load history. Retry</button> : <ol className="mt-4 space-y-4">{(logs.data ?? []).map((entry) => <li key={entry.id} className="border-l-2 pl-4"><div className="flex flex-wrap items-center gap-3"><ResearchStatusBadge status={entry.status} /><time className="text-xs text-muted-foreground">{dateLabel(entry.createdAt)}</time></div>{entry.comments && <p className="mt-2 text-sm">{entry.comments}</p>}{entry.reviewer?.email && <p className="mt-1 text-xs text-muted-foreground">Reviewed by {entry.reviewer.email}</p>}</li>)}</ol>}</section>
  </main>;
}
