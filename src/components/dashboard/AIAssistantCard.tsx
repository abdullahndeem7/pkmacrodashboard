"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

const CHIPS = [
  "Summarize today's macro moves",
  "Explain the latest SBP decision",
  "How does this affect PSX?",
  "What's the outlook for PKR?",
];

export default function AIAssistantCard() {
  const [input, setInput] = useState("");

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-hairline)",
        borderRadius: 10,
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Sparkles size={14} color="var(--accent)" />
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
          AI Assistant
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 500,
            color: "var(--accent)",
            background: "color-mix(in srgb, var(--accent) 15%, transparent)",
            borderRadius: 999,
            padding: "2px 7px",
          }}
        >
          Beta
        </span>
      </div>

      <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0 }}>
        What can I help with?
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => {
              // TODO: wire to Claude API in phase 3
              console.log("AI UI-only:", chip);
            }}
            style={{
              border: "1px solid var(--border-hairline)",
              background: "var(--bg-surface-raised)",
              borderRadius: 999,
              fontSize: 12,
              color: "var(--text-secondary)",
              padding: "5px 12px",
              cursor: "pointer",
              transition: "background 0.12s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--bg-surface-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--bg-surface-raised)")
            }
          >
            {chip}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          // TODO: wire to Claude API in phase 3
          console.log("AI UI-only:", input);
          setInput("");
        }}
        style={{ display: "flex", gap: 8 }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Pakistan's macro economy…"
          style={{
            flex: 1,
            background: "var(--bg-surface-raised)",
            border: "1px solid var(--border-hairline)",
            borderRadius: 6,
            padding: "8px 10px",
            fontSize: 13,
            color: "var(--text-primary)",
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            background: "var(--accent)",
            color: "#1a1a1c",
            fontWeight: 600,
            border: "none",
            borderRadius: 6,
            padding: "7px 14px",
            fontSize: 13,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Send
        </button>
      </form>

      <p style={{ fontSize: 10, color: "var(--text-tertiary)", margin: 0 }}>
        AI responses coming in phase 3
      </p>
    </div>
  );
}
