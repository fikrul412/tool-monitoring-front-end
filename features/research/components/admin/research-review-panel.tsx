"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useReviewResearch, useUpdateResearchStatus } from "../../hooks/use-research-mutations";
import { useResearchDetail } from "../../hooks/use-research";

export function ResearchReviewPanel({ id }: { id: string }) {
  const router = useRouter();
  const [comments, setComments] = useState("");
  const review = useReviewResearch();
  const updateStatus = useUpdateResearchStatus();
  const detail = useResearchDetail(id);
  if (detail.isLoading || !detail.data) return null;
  const submit = (status: "APPROVED" | "REJECTED") => review.mutate({ id, payload: { status, comments: comments.trim() || undefined } }, { onSuccess: () => { setComments(""); router.refresh(); } });
  const move = (status: "ONGOING" | "COMPLETED" | "CANCELLED") => updateStatus.mutate({ id, payload: { status, comments: comments.trim() || undefined } }, { onSuccess: () => { setComments(""); router.refresh(); } });
  const pending = detail.data.status === "PENDING";
  const actions: Array<{ label: string; status: "ONGOING" | "COMPLETED" | "CANCELLED" }> = detail.data.status === "APPROVED"
    ? [{ label: "Mark ongoing", status: "ONGOING" }, { label: "Cancel", status: "CANCELLED" }]
    : detail.data.status === "ONGOING" ? [{ label: "Mark completed", status: "COMPLETED" }, { label: "Cancel", status: "CANCELLED" }] : [];
  if (!pending && actions.length === 0) return null;
  const busy = review.isPending || updateStatus.isPending;
  const error = review.error ?? updateStatus.error;
  return <section className="mx-auto max-w-5xl px-6 pb-8"><div className="rounded-lg border p-5"><h2 className="font-semibold">{pending ? "Review application" : "Update research status"}</h2><label className="mt-4 block text-sm font-medium" htmlFor="review-comments">Comments (optional)</label><textarea id="review-comments" value={comments} onChange={(event) => setComments(event.target.value)} maxLength={2000} rows={4} className="mt-2 w-full rounded-md border bg-background p-3 text-sm" placeholder="Add feedback for the student"/><div className="mt-4 flex flex-wrap items-center justify-end gap-3">{error && <p className="mr-auto text-sm text-destructive">{error instanceof Error ? error.message : "Update failed. Please retry."}</p>}{pending ? <><button type="button" onClick={() => submit("REJECTED")} disabled={busy} className="rounded-md border px-4 py-2 text-sm disabled:opacity-50">Reject</button><button type="button" onClick={() => submit("APPROVED")} disabled={busy} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50">Approve</button></> : actions.map((action) => <button key={action.status} type="button" onClick={() => move(action.status)} disabled={busy} className="rounded-md border px-4 py-2 text-sm disabled:opacity-50">{action.label}</button>)}</div></div></section>;
}
