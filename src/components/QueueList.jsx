import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, Inbox, ListFilter } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function QueueList({
  contracts = [],
  selectedContract,
  onSelectContract,
  searchQuery = "",
  setSearchQuery,
  supplierFilter = "All",
  setSupplierFilter,
  suppliers = [],
  priorityFilter = "All",
  setPriorityFilter,
  activeTab = "All",
  setActiveTab,
  tabCounts = {},
  isLoading = false,
  hasError = false,
  onRetry,
  searchInputRef,
}) {
  useEffect(() => {
    const onKeyboardSelect = () => {
      const selected = document.querySelector('[data-queue-selected="true"]');
      const scroller = selected?.closest("[data-queue-scroll]");
      if (!selected || !scroller) return;
      const item = selected.getBoundingClientRect();
      const bounds = scroller.getBoundingClientRect();
      if (item.bottom > bounds.bottom)
        scroller.scrollTop += item.bottom - bounds.bottom;
      else if (item.top < bounds.top)
        scroller.scrollTop -= bounds.top - item.top;
    };
    window.addEventListener("queue-keyboard-select", onKeyboardSelect);
    return () =>
      window.removeEventListener("queue-keyboard-select", onKeyboardSelect);
  }, []);
  const { activeTheme } = useTheme();
  const isDark = activeTheme === "dark";
  const theme = {
    bg: "var(--bg-main)",
    subtleBg: "var(--bg-subtle)",
    cardBg: "var(--bg-card)",
    selectedCardBg: "var(--bg-selected)",
    border: "var(--border-color)",
    borderLight: "var(--border-light)",
    textMain: "var(--text-main)",
    textMuted: "var(--text-muted)",
    inputBg: "var(--input-bg)",
    inputBgFocused: "var(--bg-hover)",
  };

  const priorityBadgeStyles = {
    HIGH: {
      bg: "var(--badge-high-bg)",
      color: "var(--badge-high-text)",
      border: "var(--badge-high-border)",
    },
    MEDIUM: {
      bg: "var(--badge-medium-bg)",
      color: "var(--badge-medium-text)",
      border: "var(--badge-medium-border)",
    },
    LOW: {
      bg: "var(--badge-low-bg)",
      color: "var(--badge-low-text)",
      border: "var(--badge-low-border)",
    },
  };

  const statusBadgeStyles = {
    New: {
      bg: "var(--badge-open-bg)",
      color: "var(--badge-open-text)",
      border: "var(--badge-open-border)",
    },
    Open: {
      bg: "var(--badge-open-bg)",
      color: "var(--badge-open-text)",
      border: "var(--badge-open-border)",
    },
    "In Review": {
      bg: "var(--badge-review-bg)",
      color: "var(--badge-review-text)",
      border: "var(--badge-review-border)",
    },
    Rework: {
      bg: "var(--badge-review-bg)",
      color: "var(--badge-review-text)",
      border: "var(--badge-review-border)",
    },
    Approved: {
      bg: "var(--badge-approved-bg)",
      color: "var(--badge-approved-text)",
      border: "var(--badge-approved-border)",
    },
    Blocked: {
      bg: "var(--badge-blocked-bg)",
      color: "var(--badge-blocked-text)",
      border: "var(--badge-blocked-border)",
    },
    Rejected: {
      bg: "var(--badge-rejected-bg)",
      color: "var(--badge-rejected-text)",
      border: "var(--badge-rejected-border)",
    },
  };

  const [isFocused, setIsFocused] = useState(false);
  const [supplierMenu, setSupplierMenu] = useState(null);
  const supplierButtonRef = useRef(null);
  useEffect(() => {
    if (!supplierMenu) return;
    const close = (e) => {
      if (
        !e.target.closest("[data-supplier-filter-menu]") &&
        !supplierButtonRef.current?.contains(e.target)
      )
        setSupplierMenu(null);
    };
    const escape = (e) => {
      if (e.key === "Escape") setSupplierMenu(null);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    window.addEventListener("resize", () => setSupplierMenu(null), {
      once: true,
    });
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [supplierMenu]);
  const tabs = ["All", "Open", "Rework", "Approved", "Blocked", "Rejected"];
  const safeQuery = typeof searchQuery === "string" ? searchQuery : "";
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div
      style={{
        width: "410px",
        borderRight: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
        backgroundColor: theme.bg,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        boxSizing: "border-box",
        flexShrink: 0,
        overflowX: "visible",
        minWidth: 0,
      }}
    >
      {/* 1. Search Box with Priority Filter beside it */}
      <div
        style={{
          padding: "14px 16px 10px 16px",
          borderBottom: `1px solid ${theme.borderLight}`,
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Search Box */}
          <div
            style={{
              position: "relative",
              flex: 1,
              minWidth: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Search
              size={14}
              style={{
                position: "absolute",
                left: "12px",
                color: isFocused ? "#3b82f6" : theme.textMuted,
                pointerEvents: "none",
              }}
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by ID,title supplier"
              value={safeQuery}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={{
                width: "100%",
                height: "34px",
                padding: "0 65px 0 34px",
                fontSize: "12px",
                borderRadius: "8px",
                border: isFocused
                  ? "1.5px solid #3b82f6"
                  : `1px solid ${theme.border}`,
                backgroundColor: isFocused
                  ? theme.inputBgFocused
                  : theme.inputBg,
                outline: "none",
                color: theme.textMain,
                boxSizing: "border-box",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: "8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {safeQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery && setSearchQuery("")}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "12px",
                    color: theme.textMuted,
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              ) : (
                <kbd
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
                    color: theme.textMuted,
                    border: `1px solid ${theme.border}`,
                    borderRadius: "4px",
                    padding: "1px 5px",
                    fontFamily: "monospace",
                  }}
                >
                  Ctrl K
                </kbd>
              )}
            </div>
          </div>

          <div
            style={{
              position: "relative",
              width: "34px",
              height: "34px",
              flexShrink: 0,
            }}
            title={
              supplierFilter === "All"
                ? "Filter by supplier"
                : `Supplier: ${supplierFilter}`
            }
          >
            <ListFilter
              size={17}
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "8px",
                top: "8px",
                pointerEvents: "none",
                color: theme.textMain,
              }}
            />
            <button
              ref={supplierButtonRef}
              type="button"
              aria-label="Filter by supplier"
              aria-expanded={Boolean(supplierMenu)}
              onClick={() => {
                if (supplierMenu) {
                  setSupplierMenu(null);
                  return;
                }
                const r = supplierButtonRef.current.getBoundingClientRect();
                setSupplierMenu({
                  top: Math.max(
                    8,
                    Math.min(r.bottom + 5, window.innerHeight - 285),
                  ),
                  left: Math.max(
                    8,
                    Math.min(r.right - 245, window.innerWidth - 253),
                  ),
                });
              }}
              style={{
                position: "absolute",
                inset: 0,
                width: 34,
                height: 34,
                opacity: 0,
                cursor: "pointer",
              }}
            />
            {supplierMenu &&
              createPortal(
                <div
                  data-supplier-filter-menu
                  role="listbox"
                  aria-label="Supplier filter options"
                  style={{
                    position: "fixed",
                    top: supplierMenu.top,
                    left: supplierMenu.left,
                    width: 245,
                    maxHeight: "min(270px, 55vh)",
                    overflowY: "auto",
                    zIndex: 9999,
                    background: "var(--bg-card)",
                    color: "var(--text-main)",
                    border: "1px solid var(--border-color)",
                    borderRadius: 8,
                    boxShadow: "0 8px 24px rgba(0,0,0,.18)",
                    padding: 5,
                  }}
                >
                  {["All", ...suppliers].map((name,i) => (
                    <button
                      key={name+i}
                      type="button"
                      role="option"
                      aria-selected={supplierFilter === name}
                      onClick={() => {
                        setSupplierFilter(name);
                        setSupplierMenu(null);
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "8px 10px",
                        textAlign: "left",
                        border: 0,
                        borderRadius: 5,
                        cursor: "pointer",
                        background:
                          supplierFilter === name
                            ? "var(--bg-selected)"
                            : "transparent",
                        color: "var(--text-main)",
                        fontSize: 12,
                      }}
                    >
                      {name === "All" ? "All suppliers" : name}
                    </button>
                  ))}
                </div>,
                document.body,
              )}
          </div>
          {/* Priority Filter Dropdown */}
          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter && setPriorityFilter(e.target.value)
            }
            style={{
              width: "92px",
              height: "34px",
              padding: "0 8px",
              fontSize: "11px",
              fontWeight: 600,
              borderRadius: "8px",
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.cardBg,
              color: theme.textMain,
              outline: "none",
              cursor: "pointer",
              flexShrink: 0,
              boxSizing: "border-box",
            }}
          >
            <option value="All">All</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* 2. Tabs */}
      <div
        style={{
          padding: "8px 12px",
          display: "flex",
          gap: "4px",
          borderBottom: `1px solid ${theme.borderLight}`,
          backgroundColor: theme.subtleBg,
          overflowX: "auto",
          overflowY: "hidden",
          scrollbarWidth: "thin",
          flexShrink: 0,
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          const count = tabCounts[tab] !== undefined ? tabCounts[tab] : 0;
          console.log(tab,"HUUU",tabCounts);
          
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab && setActiveTab(tab)}
              style={{
                flex: "0 0 auto",
                whiteSpace: "nowrap",
                padding: "6px 5px",
                borderRadius: "6px",
                fontSize: "11px",
                fontWeight: isActive ? 700 : 500,
                cursor: "pointer",
                border: isActive
                  ? `1px solid ${isDark ? "#3b82f6" : "#cbd5e1"}`
                  : "1px solid transparent",
                backgroundColor: isActive
                  ? isDark
                    ? "#1e293b"
                    : "#ffffff"
                  : "transparent",
                color: isActive ? "#3b82f6" : theme.textMuted,
              }}
            >
              <span>{tab}</span>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  marginLeft: "4px",
                  backgroundColor: isActive
                    ? isDark
                      ? "#172554"
                      : "#eff6ff"
                    : isDark
                      ? "#334155"
                      : "#e2e8f0",
                  color: isActive ? "#3b82f6" : theme.textMuted,
                  padding: "1px 5px",
                  borderRadius: "4px",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Sub-header */}
      <div
        style={{
          padding: "8px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "11px",
          color: theme.textMuted,
          borderBottom: `1px solid ${theme.borderLight}`,
        }}
      >
        <span>
          Showing{" "}
          <strong style={{ color: theme.textMain }}>{contracts.length}</strong>{" "}
          agreements
        </span>
        <span>
          Use <strong>J / K</strong> to move
        </span>
      </div>

      {/* 4. Contracts Queue List Container */}
      <div
        data-queue-scroll
        style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}
      >
        {/* Loading State */}
        {isLoading ? (
          <div
            style={{
              padding: "12px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                style={{
                  padding: "14px 16px",
                  border: `1px solid ${theme.borderLight}`,
                  borderRadius: "8px",
                  backgroundColor: theme.cardBg,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "14px",
                      backgroundColor: isDark ? "#334155" : "#e2e8f0",
                      borderRadius: "4px",
                    }}
                  />
                  <div
                    style={{
                      width: "75px",
                      height: "14px",
                      backgroundColor: isDark ? "#334155" : "#e2e8f0",
                      borderRadius: "4px",
                    }}
                  />
                </div>
                <div
                  style={{
                    width: "130px",
                    height: "11px",
                    backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
                    borderRadius: "4px",
                  }}
                />
                <div
                  style={{
                    width: "90%",
                    height: "14px",
                    backgroundColor: isDark ? "#334155" : "#e2e8f0",
                    borderRadius: "4px",
                  }}
                />
                <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                  <div
                    style={{
                      width: "50px",
                      height: "16px",
                      backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
                      borderRadius: "4px",
                    }}
                  />
                  <div
                    style={{
                      width: "50px",
                      height: "16px",
                      backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : hasError ? (
          <div style={{ padding: "36px 20px", textAlign: "center" }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#ef4444",
                marginBottom: "4px",
              }}
            >
              We couldn't load the queue.
            </div>
            <div
              style={{
                fontSize: "11px",
                color: theme.textMuted,
                marginBottom: "14px",
              }}
            >
              Your decisions are saved. Try again.
            </div>
            <button
              type="button"
              onClick={onRetry}
              style={{
                padding: "6px 14px",
                fontSize: "12px",
                fontWeight: 600,
                borderRadius: "6px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Retry
            </button>
          </div>
        ) : contracts.length === 0 ? (
          <div
            style={{
              padding: "48px 24px",
              textAlign: "center",
              color: theme.textMuted,
            }}
          >
            <Inbox
              size={32}
              style={{
                color: isDark ? "#334155" : "#cbd5e1",
                marginBottom: "10px",
              }}
            />
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: theme.textMain,
                marginBottom: "4px",
              }}
            >
              All caught up!
            </div>
            <div style={{ fontSize: "12px" }}>
              No contracts are waiting for review.
            </div>
          </div>
        ) : (
          contracts.map((c) => {
            const isSelected = selectedContract?.id === c.id;
            const pStyle =
              priorityBadgeStyles[c.priority] || priorityBadgeStyles.LOW;
            const displayStatus = c.status === "In Review" ? "New" : c.status;
            const sStyle =
              statusBadgeStyles[displayStatus] || statusBadgeStyles.New;
            const dueDateObj = new Date(c.dueDate);
            dueDateObj.setHours(0, 0, 0, 0);
            const diffDays = Math.round(
              (dueDateObj - today) / (1000 * 60 * 60 * 24),
            );
            const isPending =
              displayStatus === "New" ||
              displayStatus === "Open" ||
              displayStatus === "Blocked";
            const isOverdue = diffDays < 0 && isPending;
            return (
              <div
                key={c.id}
                data-queue-selected={isSelected}
                onClick={() => onSelectContract && onSelectContract(c)}
                style={{
                  padding: "14px 16px",
                  borderBottom: `1px solid ${theme.borderLight}`,
                  cursor: "pointer",
                  backgroundColor: isSelected
                    ? isDark
                      ? "#1e293b"
                      : "#eff6ff"
                    : "transparent",
                  borderLeft: isSelected
                    ? "3px solid #3b82f6"
                    : "3px solid transparent",
                  transition: "background-color 0.1s ease",
                  overflowX: "hidden",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 800,
                      color: "#3b82f6",
                      flexShrink: 0,
                    }}
                  >
                    {c.id}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 800,
                      color: theme.textMain,
                      flexShrink: 0,
                    }}
                  >
                    ₹{(c.value / 100000).toFixed(1)} Lakh
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: theme.textMuted,
                    marginTop: "2px",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  {c.supplier}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: theme.textMain,
                    marginTop: "4px",
                    lineHeight: "1.3",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  {c.title}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "10px",
                    gap: "6px",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        backgroundColor: pStyle.bg,
                        color: pStyle.color,
                        border: `1px solid ${pStyle.border}`,
                        padding: "2px 7px",
                        borderRadius: "5px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "3px",
                        flexShrink: 0,
                      }}
                    >
                      <span>●</span> {c.priority}
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        backgroundColor: sStyle.bg,
                        color: sStyle.color,
                        border: `1px solid ${sStyle.border}`,
                        padding: "2px 7px",
                        borderRadius: "5px",
                        flexShrink: 0,
                      }}
                    >
                      {displayStatus}
                    </span>
                  </div>
                  {isOverdue && (
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#f87171",
                        backgroundColor: isDark ? "#502c2c" : "#fef2f2",
                        border: `1px solid ${isDark ? "#7f1d1d" : "#fecaca"}`,
                        padding: "2px 7px",
                        borderRadius: "4px",
                        flexShrink: 0,
                      }}
                    >
                      Overdue by {Math.abs(diffDays)}{" "}
                      {Math.abs(diffDays) === 1 ? "day" : "days"}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
