import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Files,
  CheckCircle2,
  Ban,
  XCircle,
  CalendarClock,
  GitCompareArrows,
  ArrowRight,
  PlusCircle,
  ClipboardCheck,
  BarChart3,
  RefreshCw,
  History,
  X,
  ShieldAlert,
} from "lucide-react";
import "./DashboardPage.css";

const dayKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const daysUntil = (value) => {
  if (!value) return null;
  const parsed = new Date(`${String(value).slice(0, 10)}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  return Math.round(
    (parsed - new Date(`${dayKey(new Date())}T12:00:00`)) / 86400000,
  );
};
const actionable = (c) =>
  !["Approved", "Rejected", "Blocked"].includes(c.status);
const auditTime = (entry) => {
  const t = Date.parse(entry?.timestamp || "");
  if (!Number.isNaN(t)) return t;
  const normalized = String(entry?.timestamp || "").replace(
    /(\d{2}) (\w{3}) (\d{4}),?/,
    "$2 $1, $3",
  );
  return Date.parse(normalized) || 0;
};
const reasonEntry = (c) =>
  (c.audit || []).find((a) => a.note && /reject/i.test(a.action || ""));
const revisions = (c) => (c.audit || []).filter((a) => a.before && a.after);
const money = (value) =>
  typeof value === "number"
    ? `₹${value.toLocaleString("en-IN")}`
    : String(value ?? "—");
const formatValue = (value, key = "") => {
  if (value === undefined || value === null) return "—";
  if (key === "value" && typeof value === "number") return money(value);
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};
const changedFields = (revision) => {
  const before = revision.before || {},
    after = revision.after || {};
  const rows = [];
  for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
    if (
      key === "lineItems" &&
      (Array.isArray(before[key]) || Array.isArray(after[key]))
    ) {
      const a = Array.isArray(before[key]) ? before[key] : [],
        b = Array.isArray(after[key]) ? after[key] : [];
      const keys = new Set([
        ...a.map((x, i) => x.id || `index-${i}`),
        ...b.map((x, i) => x.id || `index-${i}`),
      ]);
      for (const id of keys) {
        const old = a.find((x, i) => (x.id || `index-${i}`) === id);
        const now = b.find((x, i) => (x.id || `index-${i}`) === id);
        const title = now?.desc || old?.desc || "Line item";
        for (const field of new Set([
          ...Object.keys(old || {}),
          ...Object.keys(now || {}),
        ])) {
          if (field === "id" || field === "desc") continue;
          if (JSON.stringify(old?.[field]) !== JSON.stringify(now?.[field]))
            rows.push({
              label: `${title} · ${field}`,
              before: formatValue(old?.[field], field),
              after: formatValue(now?.[field], field),
            });
        }
        if (JSON.stringify(old?.desc) !== JSON.stringify(now?.desc))
          rows.push({
            label: `${title} · description`,
            before: formatValue(old?.desc),
            after: formatValue(now?.desc),
          });
      }
    } else if (JSON.stringify(before[key]) !== JSON.stringify(after[key]))
      rows.push({
        label: key === "value" ? "Contract value" : key,
        before: formatValue(before[key], key),
        after: formatValue(after[key], key),
      });
  }
  return rows;
};
const priorityRank = { HIGH: 0, MEDIUM: 1, LOW: 2 };

function DetailModal({ title, subtitle, onClose, children }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div
      className="dash-modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        className="dash-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="dash-modal-head">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="dash-icon-button"
          >
            <X size={19} />
          </button>
        </header>
        <div className="dash-modal-content">{children}</div>
      </section>
    </div>
  );
}

export default function DashboardPage({ contracts = [], user, onAddContract }) {
  const [modal, setModal] = useState(null);
  const [dayFilter, setDayFilter] = useState(null);
  const stats = useMemo(
    () => [
      {
        label: "Total Contracts",
        value: contracts.length,
        icon: Files,
        kind: "total",
        tab: "All",
      },
      {
        label: "Approved",
        value: contracts.filter((c) => c.status === "Approved").length,
        icon: CheckCircle2,
        kind: "approved",
        tab: "Approved",
      },
      {
        label: "Blocked",
        value: contracts.filter((c) => c.status === "Blocked").length,
        icon: Ban,
        kind: "blocked",
        tab: "Blocked",
      },
      {
        label: "Rejected",
        value: contracts.filter((c) => c.status === "Rejected").length,
        icon: XCircle,
        kind: "rejected",
        tab: "Rejected",
      },
    ],
    [contracts],
  );
  const overdue = contracts
    .filter(
      (c) =>
        actionable(c) &&
        daysUntil(c.dueDate) !== null &&
        daysUntil(c.dueDate) < 0,
    )
    .sort(
      (a, b) =>
        (priorityRank[a.priority] ?? 3) - (priorityRank[b.priority] ?? 3) ||
        daysUntil(a.dueDate) - daysUntil(b.dueDate),
    );
  const upcoming = [
    { label: "Today", from: 0, to: 0 },
    { label: "Tomorrow", from: 1, to: 1 },
    { label: "Next 7 Days", from: 2, to: 7 },
  ].map((item) => ({
    ...item,
    items: contracts.filter(
      (c) =>
        actionable(c) &&
        daysUntil(c.dueDate) !== null &&
        daysUntil(c.dueDate) >= item.from &&
        daysUntil(c.dueDate) <= item.to,
    ),
  }));
  const rejected = contracts
    .filter((c) => c.status === "Rejected")
    .map((c) => ({ contract: c, entry: reasonEntry(c) }))
    .sort((a, b) => auditTime(b.entry) - auditTime(a.entry));
  const reworked = contracts
    .filter((c) =>
      (c.audit || []).some((a) => /rework|revis/i.test(a.action || "")),
    )
    .sort(
      (a, b) =>
        Math.max(
          0,
          ...(b.audit || [])
            .filter((x) => /rework|revis/i.test(x.action || ""))
            .map(auditTime),
        ) -
        Math.max(
          0,
          ...(a.audit || [])
            .filter((x) => /rework|revis/i.test(x.action || ""))
            .map(auditTime),
        ),
    );
  const activities = contracts
    .flatMap((c) => (c.audit || []).map((a) => ({ ...a, contract: c })))
    .sort((a, b) => auditTime(b) - auditTime(a));
  const priorityContracts = contracts.filter(actionable);
  const priority = ["HIGH", "MEDIUM", "LOW"].map((name) => ({
    name,
    count: priorityContracts.filter((c) => c.priority === name).length,
  }));
  const selectedUpcoming = upcoming.find((d) => d.label === dayFilter);
  const selectedReject =
    modal?.type === "rejection"
      ? rejected.find((x) => x.contract.id === modal.id)
      : null;
  const selectedRework =
    modal?.type === "rework" ? reworked.find((x) => x.id === modal.id) : null;
  const activityIcon = (action) =>
    /reject/i.test(action)
      ? XCircle
      : /approv/i.test(action)
        ? CheckCircle2
        : /rework|revis/i.test(action)
          ? RefreshCw
          : History;
  return (
    <main className="dash-page">
      <header className="dash-welcome">
        <div>
          <h1>
            Welcome back, {user?.name || "Reviewer"}{" "}
            <span aria-hidden="true">👋</span>
          </h1>
          <p>Your contract review workspace</p>
        </div>
      </header>
      <section className="dash-stats" aria-label="Contract summary">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              to="/queue"
              state={{ statusFilter: s.tab }}
              key={s.label}
              className={`dash-card dash-stat dash-${s.kind}`}
            >
              <span className="dash-stat-title">
                {s.label}
                <Icon size={19} />
              </span>
              <strong>{s.value}</strong>
              <span className="dash-stat-line" />
            </Link>
          );
        })}
      </section>
      <div className="dash-grid-two">
        <section className="dash-card">
          <div className="dash-section-title">
            <h2>Overdue Contracts</h2>
            <span className="dash-alert-label">Action required</span>
          </div>
          <div className="dash-overdue-compact">
            <div
              className="dash-ring"
              style={{ "--dash-progress": overdue.length ? "235" : "0" }}
            >
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <circle cx="60" cy="60" r="48" className="dash-ring-track" />
                <circle cx="60" cy="60" r="48" className="dash-ring-progress" />
              </svg>
              <div className="dash-ring-count">
                <strong>{overdue.length}</strong>
                {/* <small>OVERDUE</small> */}
              </div>
            </div>
            <div className="dash-overdue-info">
              <strong>
                {overdue.length
                  ? `${overdue.length} contract${overdue.length === 1 ? "" : "s"} past due`
                  : "All caught up"}
              </strong>
              <p>Open contracts with missed review deadlines.</p>
              <Link
                to="/queue"
                state={{ overdueOnly: true }}
                className="dash-text-link"
              >
                View contracts <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <div className="dash-urgent-list">
            {overdue.slice(0, 3).map((c) => (
              <Link
                key={c.id}
                to="/queue"
                state={{ contractId: c.id }}
                className="dash-urgent-item"
              >
                <span className="dash-urgent-text">
                  <strong>
                    {c.id} · {c.title}
                  </strong>
                  <small>{Math.abs(daysUntil(c.dueDate))} day(s) overdue</small>
                </span>
                <span
                  className={`dash-priority-tag dash-priority-${(c.priority || "").toLowerCase()}`}
                >
                  {c.priority || "—"}
                </span>
                <ArrowRight size={14} />
              </Link>
            ))}
            {!overdue.length && (
              <p className="dash-muted">No overdue contracts.</p>
            )}
          </div>
        </section>
        <section className="dash-card">
          <div className="dash-section-title">
            <h2>Quick Actions</h2>
            <ClipboardCheck size={18} />
          </div>
          <div className="dash-actions-grid">
            <Link to="/queue" className="dash-action">
              <span className="dash-action-icon">
                <ClipboardCheck size={18} />
              </span>
              <span>Review</span>
            </Link>
            <button
              type="button"
              className="dash-action"
              onClick={onAddContract}
            >
              <span className="dash-action-icon">
                <PlusCircle size={18} />
              </span>
              <span>Add</span>
            </button>
            <button
              type="button"
              className="dash-action"
              onClick={() => setModal({ type: "rework-list" })}
            >
              <span className="dash-action-icon">
                <RefreshCw size={18} />
              </span>
              <span>Rework</span>
            </button>
            <Link to="/reports" className="dash-action">
              <span className="dash-action-icon">
                <BarChart3 size={18} />
              </span>
              <span>Reports</span>
            </Link>
          </div>
        </section>
        <section className="dash-card">
          <div className="dash-section-title">
            <h2>Deadline Watch</h2>
            <CalendarClock size={18} />
          </div>
          <div className="dash-deadline-grid">
            {upcoming.map((d, i) => (
              <button
                key={d.label}
                type="button"
                className={`dash-deadline dash-deadline-${i} ${dayFilter === d.label ? "is-selected" : ""}`}
                onClick={() =>
                  setDayFilter(dayFilter === d.label ? null : d.label)
                }
                aria-pressed={dayFilter === d.label}
              >
                <span>{d.label}</span>
                <strong className="dash-deadline-count">
                  {d.items.length}
                </strong>
              </button>
            ))}
          </div>
          {selectedUpcoming && (
            <div className="dash-deadline-results">
              {selectedUpcoming.items.length ? (
                selectedUpcoming.items.slice(0, 4).map((c) => (
                  <Link key={c.id} to="/queue" state={{ contractId: c.id }}>
                    {c.id} · {c.title}
                    <ArrowRight size={13} />
                  </Link>
                ))
              ) : (
                <span>No contracts due in this period.</span>
              )}
            </div>
          )}
        </section>
        <section className="dash-card">
          <div className="dash-section-title">
            <h2>Open Contracts by Priority</h2>
            <ShieldAlert size={18} />
          </div>
          <p className="dash-muted">
            {priorityContracts.length} actionable contracts
          </p>
          <div className="dash-bars">
            {priority.map((p) => (
              <div className="dash-bar-row" key={p.name}>
                <div className="dash-bar-label">
                  <span>{p.name[0] + p.name.slice(1).toLowerCase()}</span>
                  <strong>
                    {p.count} / {priorityContracts.length}
                  </strong>
                </div>
                <div className="dash-bar-track">
                  <div
                    className={`dash-bar-fill dash-bar-${p.name.toLowerCase()}`}
                    style={{
                      width: `${priorityContracts.length ? (p.count / priorityContracts.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="dash-grid-three">
        <section className="dash-card">
          <div className="dash-section-title">
            <h2>Recent Activity</h2>
            <History size={18} />
          </div>
          <div className="dash-preview-list">
            {activities.slice(0, 3).map((a, i) => {
              const Icon = activityIcon(a.action || "");
              return (
                <button
                  type="button"
                  key={`${a.contract.id}-${a.id || i}-${i}`}
                  className="dash-preview-item"
                  onClick={() => setModal({ type: "activity", index: i })}
                >
                  <Icon size={16} />
                  <span>
                    <strong>{a.action}</strong>
                    <small>
                      {a.contract.id} · {a.timestamp || "Time unavailable"}
                    </small>
                  </span>
                  <ArrowRight size={14} />
                </button>
              );
            })}
            {!activities.length && (
              <p className="dash-muted">No activity recorded.</p>
            )}
          </div>
          <button
            className="dash-view-all"
            onClick={() => setModal({ type: "activity-list" })}
          >
            View all activity <ArrowRight size={14} />
          </button>
        </section>
        <section className="dash-card">
          <div className="dash-section-title">
            <h2>Recent Rejections</h2>
            <XCircle size={18} className="dash-reject-icon" />
          </div>
          <div className="dash-preview-list">
            {rejected.slice(0, 3).map(({ contract: c, entry }) => (
              <button
                key={c.id}
                className="dash-preview-item"
                type="button"
                onClick={() => setModal({ type: "rejection", id: c.id })}
              >
                <XCircle size={16} />
                <span>
                  <strong>
                    {c.id} · {c.title}
                  </strong>
                  <small>{entry?.note || "No rejection reason recorded"}</small>
                </span>
                <ArrowRight size={14} />
              </button>
            ))}
            {!rejected.length && (
              <p className="dash-muted">No rejected contracts.</p>
            )}
          </div>
          {rejected.length > 3 && (
            <button
              className="dash-view-all"
              onClick={() => setModal({ type: "rejection-list" })}
            >
              View all rejections <ArrowRight size={14} />
            </button>
          )}
        </section>
        <section className="dash-card">
          <div className="dash-section-title">
            <h2>Rework Changes</h2>
            <GitCompareArrows size={18} />
          </div>
          <div className="dash-preview-list">
            {reworked.slice(0, 3).map((c) => (
              <button
                key={c.id}
                className="dash-preview-item"
                type="button"
                onClick={() => setModal({ type: "rework", id: c.id })}
              >
                <RefreshCw size={16} />
                <span>
                  <strong>
                    {c.id} · {c.title}
                  </strong>
                  <small>
                    {revisions(c).filter((r) => changedFields(r).length).length}{" "}
                    recorded revision(s) with changes · {c.status}
                  </small>
                </span>
                <ArrowRight size={14} />
              </button>
            ))}
            {!reworked.length && (
              <p className="dash-muted">No rework contracts recorded yet.</p>
            )}
          </div>
          <button
            className="dash-view-all"
            onClick={() => setModal({ type: "rework-list" })}
          >
            View all rework <ArrowRight size={14} />
          </button>
        </section>
      </div>
      {modal && (
        <DetailModal
          title={
            modal.type.startsWith("activity")
              ? "Recent Activity"
              : modal.type.startsWith("rejection")
                ? "Recent Rejections"
                : "Rework Changes"
          }
          subtitle={modal.id || "Contract audit details"}
          onClose={() => setModal(null)}
        >
          {modal.type === "activity" && activities[modal.index] && (
            <div className="dash-detail">
              <strong>{activities[modal.index].action}</strong>
              <p>
                {activities[modal.index].contract.id} ·{" "}
                {activities[modal.index].contract.title}
              </p>
              <p>
                {activities[modal.index].note || "No additional note recorded."}
              </p>
              <small>
                {activities[modal.index].by || "Actor unavailable"} ·{" "}
                {activities[modal.index].timestamp || "Time unavailable"}
              </small>
              <Link
                to="/queue"
                state={{ contractId: activities[modal.index].contract.id }}
                className="dash-text-link"
                onClick={() => setModal(null)}
              >
                Open contract <ArrowRight size={14} />
              </Link>
            </div>
          )}
          {modal.type === "activity-list" && (
            <div className="dash-modal-list">
              {activities.map((a, i) => (
                <button
                  key={`${a.contract.id}-${a.id || i}-${i}`}
                  onClick={() => setModal({ type: "activity", index: i })}
                >
                  <strong>{a.action}</strong>
                  <small>
                    {a.contract.id} · {a.by || "Unknown"} ·{" "}
                    {a.timestamp || "Time unavailable"}
                  </small>
                </button>
              ))}
              {!activities.length && <p>No activity recorded.</p>}
            </div>
          )}
          {selectedReject && (
            <div className="dash-detail">
              <strong>{selectedReject.contract.title}</strong>
              <p>
                {selectedReject.contract.id} ·{" "}
                {selectedReject.contract.supplier}
              </p>
              <div className="dash-reason">
                <strong>Reason for rejection</strong>
                <p>
                  {selectedReject.entry?.note ||
                    "No rejection reason recorded in the available audit history."}
                </p>
              </div>
              <small>
                {selectedReject.entry?.by || "Reviewer unavailable"} ·{" "}
                {selectedReject.entry?.timestamp || "Time unavailable"}
              </small>
              <Link
                to="/queue"
                state={{ contractId: selectedReject.contract.id }}
                className="dash-text-link"
                onClick={() => setModal(null)}
              >
                Open contract <ArrowRight size={14} />
              </Link>
            </div>
          )}
          {modal.type === "rejection-list" && (
            <div className="dash-modal-list">
              {rejected.map(({ contract: c, entry }) => (
                <button
                  key={c.id}
                  onClick={() => setModal({ type: "rejection", id: c.id })}
                >
                  <strong>
                    {c.id} · {c.title}
                  </strong>
                  <small>{entry?.note || "No rejection reason recorded"}</small>
                </button>
              ))}
            </div>
          )}
          {selectedRework && (
            <div className="dash-detail">
              <strong>{selectedRework.title}</strong>
              <p>
                {selectedRework.id} · {selectedRework.status}
              </p>
              {revisions(selectedRework)
                .filter((r) => changedFields(r).length)
                .map((r, i) => (
                  <div key={r.id || i} className="dash-change-group">
                    <small>
                      {r.action || "Revision"} · {r.by || "Unknown"} ·{" "}
                      {r.timestamp || "Time unavailable"}
                    </small>
                    <div className="dash-table-wrap">
                      <table className="dash-changes-table">
                        <thead>
                          <tr>
                            <th>Field</th>
                            <th>Before</th>
                            <th>After</th>
                          </tr>
                        </thead>
                        <tbody>
                          {changedFields(r).map((row, j) => (
                            <tr key={j}>
                              <td>{row.label}</td>
                              <td>{row.before}</td>
                              <td>{row.after}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              {!revisions(selectedRework).some(
                (r) => changedFields(r).length,
              ) && (
                <p>
                  Rework recorded, but no changed before/after fields are
                  available yet.
                </p>
              )}
              <Link
                to="/queue"
                state={{ contractId: selectedRework.id }}
                className="dash-text-link"
                onClick={() => setModal(null)}
              >
                Open contract <ArrowRight size={14} />
              </Link>
            </div>
          )}
          {modal.type === "rework-list" && (
            <div className="dash-modal-list">
              {reworked.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setModal({ type: "rework", id: c.id })}
                >
                  <strong>
                    {c.id} · {c.title}
                  </strong>
                  <small>
                    {c.status} ·{" "}
                    {revisions(c).filter((r) => changedFields(r).length).length}{" "}
                    revision(s) with changes
                  </small>
                </button>
              ))}
              {!reworked.length && <p>No rework contracts recorded yet.</p>}
            </div>
          )}
        </DetailModal>
      )}
    </main>
  );
}
