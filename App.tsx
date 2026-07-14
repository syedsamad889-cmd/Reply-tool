import { useState } from "react";

// ── Types ─────────────────────────────────────
interface Ticket {
  id: number;
  customer: string;
  subject: string;
  message: string;
  status: "open" | "pending" | "resolved";
  priority: "low" | "normal" | "high";
  replies: Reply[];
}

interface Reply {
  agent: string;
  message: string;
  time: string;
}

// ── Seed Data ────────────────────────────────
const INITIAL_TICKETS: Ticket[] = [
  {
    id: 1,
    customer: "Ali Hassan",
    subject: "Order not received",
    message: "My order #1023 has not arrived yet. It has been 10 days.",
    status: "open",
    priority: "high",
    replies: [],
  },
  {
    id: 2,
    customer: "Sara Ahmed",
    subject: "Wrong item delivered",
    message: "I received the wrong sticker size. I ordered 4x4 but got 2x2.",
    status: "pending",
    priority: "normal",
    replies: [
      {
        agent: "Samad Shahid",
        message: "Hi Sara, a replacement has been dispatched. Sorry for the inconvenience.",
        time: "2024-07-01 10:30",
      },
    ],
  },
  {
    id: 3,
    customer: "John Smith",
    subject: "Refund request",
    message: "I would like a refund for order #2045. Quality was not as expected.",
    status: "open",
    priority: "high",
    replies: [],
  },
];

const PRIORITY_COLOR: Record<string, string> = {
  high:   "#ef4444",
  normal: "#f59e0b",
  low:    "#22c55e",
};

const STATUS_COLOR: Record<string, string> = {
  open:     "#3b82f6",
  pending:  "#f59e0b",
  resolved: "#22c55e",
};

// ── App ───────────────────────────────────────
export default function App() {
  const [tickets, setTickets]     = useState<Ticket[]>(INITIAL_TICKETS);
  const [selected, setSelected]   = useState<Ticket | null>(null);
  const [filter, setFilter]       = useState<string>("all");
  const [replyText, setReplyText] = useState("");

  const filtered = filter === "all"
    ? tickets
    : tickets.filter((t) => t.status === filter);

  const sendReply = () => {
    if (!selected || !replyText.trim()) return;
    const reply: Reply = {
      agent:   "Samad Shahid",
      message: replyText.trim(),
      time:    new Date().toLocaleString(),
    };
    const updated = tickets.map((t) =>
      t.id === selected.id
        ? { ...t, replies: [...t.replies, reply], status: "pending" as const }
        : t
    );
    setTickets(updated);
    setSelected({ ...selected, replies: [...selected.replies, reply], status: "pending" });
    setReplyText("");
  };

  const resolveTicket = () => {
    if (!selected) return;
    const updated = tickets.map((t) =>
      t.id === selected.id ? { ...t, status: "resolved" as const } : t
    );
    setTickets(updated);
    setSelected({ ...selected, status: "resolved" });
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif", display: "flex", height: "100vh", background: "#f1f5f9" }}>

      {/* ── Sidebar ── */}
      <div style={{ width: 320, background: "#1A3A5C", color: "white", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid #2d5a8e" }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>⚡ Reply Tool</div>
          <div style={{ fontSize: 11, color: "#90caf9", marginTop: 2 }}>Sticker Mule Support</div>
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: 4, padding: "10px 12px", borderBottom: "1px solid #2d5a8e" }}>
          {["all","open","pending","resolved"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                flex: 1, padding: "4px 0", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11,
                background: filter === f ? "#3b82f6" : "#2d5a8e",
                color: "white", fontWeight: filter === f ? 700 : 400,
              }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Ticket List */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filtered.map((ticket) => (
            <div key={ticket.id} onClick={() => setSelected(ticket)}
              style={{
                padding: "12px 16px", borderBottom: "1px solid #2d5a8e", cursor: "pointer",
                background: selected?.id === ticket.id ? "#2d5a8e" : "transparent",
              }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{ticket.customer}</div>
                <span style={{
                  fontSize: 10, padding: "2px 6px", borderRadius: 10,
                  background: PRIORITY_COLOR[ticket.priority], color: "white",
                }}>{ticket.priority}</span>
              </div>
              <div style={{ fontSize: 12, color: "#90caf9", marginTop: 3 }}>{ticket.subject}</div>
              <span style={{
                fontSize: 10, padding: "2px 7px", borderRadius: 10, marginTop: 5, display: "inline-block",
                background: STATUS_COLOR[ticket.status], color: "white",
              }}>{ticket.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Panel ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selected ? (
          <>
            {/* Header */}
            <div style={{ padding: "16px 24px", background: "white", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{selected.subject}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>From: {selected.customer}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ padding: "4px 12px", borderRadius: 20, background: STATUS_COLOR[selected.status], color: "white", fontSize: 12 }}>
                  {selected.status}
                </span>
                {selected.status !== "resolved" && (
                  <button onClick={resolveTicket}
                    style={{ padding: "4px 14px", borderRadius: 20, background: "#22c55e", color: "white", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                    ✓ Resolve
                  </button>
                )}
              </div>
            </div>

            {/* Thread */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Customer message */}
              <div style={{ background: "white", borderRadius: 10, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", maxWidth: "75%" }}>
                <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6 }}>
                  🧑 {selected.customer} — Customer
                </div>
                <div style={{ fontSize: 13, color: "#1e293b" }}>{selected.message}</div>
              </div>

              {/* Replies */}
              {selected.replies.map((r, i) => (
                <div key={i} style={{ background: "#1A3A5C", borderRadius: 10, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", maxWidth: "75%", alignSelf: "flex-end" }}>
                  <div style={{ fontSize: 11, color: "#90caf9", marginBottom: 6 }}>
                    ⚡ {r.agent} — Agent · {r.time}
                  </div>
                  <div style={{ fontSize: 13, color: "white" }}>{r.message}</div>
                </div>
              ))}
            </div>

            {/* Reply Box */}
            {selected.status !== "resolved" && (
              <div style={{ padding: "16px 24px", background: "white", borderTop: "1px solid #e2e8f0" }}>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  rows={3}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, resize: "none", outline: "none", boxSizing: "border-box" }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                  <button onClick={sendReply}
                    style={{ padding: "8px 24px", background: "#1A3A5C", color: "white", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                    Send Reply ➤
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 15 }}>
            ← Select a ticket to view and reply
          </div>
        )}
      </div>
    </div>
  );
}
