import React, { useMemo, useState, useEffect } from "react";
import {
  Folder,
  Mail,
  Globe,
  X,
  Minus,
  Square,
  Grid,
  List,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  Search,
} from "lucide-react";
import useFullscreen from "../hooks/useFullscreen";

/**
 * Files served from public/ so they render *inside* the window:
 * public/images/TEAM-PHOTO.png
 * public/images/BUDGET-REPORT.png
 * public/sim/files/suspicious-email.html
 * public/sim/files/itinerary.html
 * public/sim/files/invoice.html
 * public/sim/files/history-bank.html
 * public/sim/files/company-policy.pdf
 * public/images/avatar.png   <-- avatar for login
 */

const WALLPAPER =
  "bg-[radial-gradient(1200px_800px_at_20%_-10%,#a1c4fd_0%,transparent_60%),radial-gradient(1000px_700px_at_100%_0%,#c2e9fb_0%,transparent_50%),linear-gradient(120deg,#7f7fd5_0%,#86a8e7_50%,#91eae4_100%)]";

/* Simple Windows logo (four squares) */
function WindowsLogo({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 256 256" className={className} aria-hidden="true">
      <rect x="16" y="16" width="104" height="104" fill="currentColor" />
      <rect x="136" y="16" width="104" height="104" fill="currentColor" />
      <rect x="16" y="136" width="104" height="104" fill="currentColor" />
      <rect x="136" y="136" width="104" height="104" fill="currentColor" />
    </svg>
  );
}

function WindowFrame({ title, icon, onClose, onMinimize, onMaximize, children }) {
  return (
    <div className="fixed inset-10 bg-white/95 rounded-2xl shadow-2xl border border-white/60 backdrop-blur-xl flex flex-col z-30 overflow-hidden">
      {/* Titlebar */}
      <div className="px-3 py-2 border-b border-white/50 bg-white/60 backdrop-blur-lg flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium text-gray-800">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onMinimize}
            className="w-8 h-8 rounded-md hover:bg-black/5 flex items-center justify-center text-gray-700"
            title="Minimize"
          >
            <Minus size={16} />
          </button>
          <button
            onClick={onMaximize}
            className="w-8 h-8 rounded-md hover:bg-black/5 flex items-center justify-center text-gray-700"
            title="Maximize"
          >
            <Square size={14} />
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md bg-red-500 hover:bg-red-600 flex items-center justify-center text-white"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}

function IFrameViewer({ src, title }) {
  if (!src) {
    return (
      <div className="h-full w-full grid place-items-center text-sm text-gray-600">
        No file path provided. Add <code>path</code> for in-tab preview.
      </div>
    );
  }
  return (
    <iframe
      title={title || "viewer"}
      src={src}
      className="w-full h-full"
      sandbox="allow-same-origin allow-scripts"
    />
  );
}

/** ---------- File Explorer ---------- */
function FileExplorer() {
  const [viewMode, setViewMode] = useState("grid");
  const [selected, setSelected] = useState(null);

  const files = useMemo(
    () => [
      {
        name: "TEAM-PHOTO.png",
        type: "image",
        suspicious: false,
        size: "1.2 MB",
        modified: "Today 3:10 PM",
        path: `${process.env.PUBLIC_URL}/images/TEAM-PHOTO.png`,
      },
      {
        name: "BUDGET-REPORT.png",
        type: "image",
        suspicious: true,
        size: "980 KB",
        modified: "Today 3:12 PM",
        path: `${process.env.PUBLIC_URL}/images/BUDGET-REPORT.png`,
      },
      {
        name: "suspicious-email.html",
        type: "html",
        suspicious: true,
        size: "3.1 KB",
        modified: "Today 3:35 PM",
        path: `${process.env.PUBLIC_URL}/sim/files/suspicious-email.html`,
      },
      {
        name: "company-policy.pdf",
        type: "pdf",
        suspicious: false,
        size: "220 KB",
        modified: "Yesterday 4:02 PM",
        path: `${process.env.PUBLIC_URL}/sim/files/company-policy.pdf`,
      },
      {
        name: "history-bank.html",
        type: "html",
        suspicious: true,
        size: "2.4 KB",
        modified: "Yesterday 5:48 PM",
        path: `${process.env.PUBLIC_URL}/sim/files/history-bank.html`,
      },
      {
        name: "itinerary.html",
        type: "html",
        suspicious: false,
        size: "4.7 KB",
        modified: "Today 9:22 AM",
        path: `${process.env.PUBLIC_URL}/sim/files/itinerary.html`,
      },
      {
        name: "invoice.html",
        type: "html",
        suspicious: true,
        size: "3.0 KB",
        modified: "Today 1:04 PM",
        path: `${process.env.PUBLIC_URL}/sim/files/invoice.html`,
      },
    ],
    []
  );

  const iconFor = (type) => {
    if (type === "image") return <ImageIcon size={16} className="text-pink-500" />;
    if (type === "pdf") return <FileText size={16} className="text-red-500" />;
    if (type === "sheet") return <FileSpreadsheet size={16} className="text-green-600" />;
    return <FileText size={16} className="text-blue-600" />;
  };

  const renderPreview = (file) => {
    const { type, path, name } = file;
    if (type === "html" || type === "pdf") return <IFrameViewer src={path} title={name} />;
    if (type === "image")
      return (
        <div className="w-full h-full flex items-center justify-center bg-white">
          <img src={path} alt={name} className="max-w-full max-h-full object-contain" />
        </div>
      );
    return (
      <div className="p-4 text-sm text-gray-700">No preview available.</div>
    );
  };

  return (
    <div className="h-full flex min-h-0">
      <aside className="w-72 border-r border-white/50 bg-white/60 backdrop-blur-md p-3 overflow-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Documents</h3>
          <span className="text-sm text-gray-500">{files.length}</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1 rounded ${
              viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-black/5"
            }`}
            title="Grid view"
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1 rounded ${
              viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-black/5"
            }`}
            title="List view"
          >
            <List size={16} />
          </button>
        </div>

        <div className="mt-2 space-y-1">
          {files.map((f) => (
            <button
              key={f.name}
              onClick={() => setSelected(f)}
              className={`w-full text-left px-2 py-2 rounded hover:bg-black/5 ${
                selected?.name === f.name ? "bg-black/5" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                {iconFor(f.type)}
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">
                    {f.name}
                    {f.suspicious && (
                      <span className="ml-2 text-[10px] text-red-700 border border-red-300 rounded px-1">
                        suspicious
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {f.type} • {f.size} • {f.modified}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      <section className="flex-1 min-h-0 bg-white">
        {selected ? (
          <div className="w-full h-full">{renderPreview(selected)}</div>
        ) : (
          <div className="h-full grid place-items-center text-gray-500">
            Select a file to preview.
          </div>
        )}
      </section>
    </div>
  );
}

/** ---------- Mail ---------- */
function MailApp() {
  const emails = [
    {
      id: 1,
      subject: "Invoice Reminder",
      from: "billing@vendor.com",
      path: `${process.env.PUBLIC_URL}/sim/files/invoice.html`,
    },
    {
      id: 2,
      subject: "Travel Itinerary",
      from: "noreply@airline.com",
      path: `${process.env.PUBLIC_URL}/sim/files/itinerary.html`,
    },
    {
      id: 3,
      subject: "Security Concern",
      from: "alerts@corp.com",
      path: `${process.env.PUBLIC_URL}/sim/files/suspicious-email.html`,
    },
  ];
  const [selected, setSelected] = useState(emails[0]);

  return (
    <div className="h-full flex min-h-0">
      <aside className="w-80 border-r border-white/50 bg-white/60 backdrop-blur-md overflow-auto">
        <h3 className="px-3 py-2 font-semibold text-gray-800">Inbox</h3>
        {emails.map((e) => (
          <div
            key={e.id}
            onClick={() => setSelected(e)}
            className={`px-3 py-2 cursor-pointer border-b border-white/50 ${
              selected?.id === e.id ? "bg-black/5" : "hover:bg-black/5"
            }`}
          >
            <div className="font-medium text-gray-800">{e.subject}</div>
            <div className="text-xs text-gray-500">{e.from}</div>
          </div>
        ))}
      </aside>
      <section className="flex-1 min-h-0 bg-white">
        {selected ? (
          <IFrameViewer src={selected.path} title={selected.subject} />
        ) : (
          <div className="h-full grid place-items-center text-gray-500">
            Select an email.
          </div>
        )}
      </section>
    </div>
  );
}

/** ---------- Browser ---------- */
function BrowserApp() {
  const pages = [
    {
      id: "bank",
      title: "MyBank — Login",
      path: `${process.env.PUBLIC_URL}/sim/files/history-bank.html`,
    },
    {
      id: "policy",
      title: "Company Policy (PDF)",
      path: `${process.env.PUBLIC_URL}/sim/files/company-policy.pdf`,
    },
  ];
  const [selected, setSelected] = useState(pages[0]);

  return (
    <div className="h-full flex min-h-0">
      <aside className="w-80 border-r border-white/50 bg-white/60 backdrop-blur-md overflow-auto">
        <h3 className="px-3 py-2 font-semibold text-gray-800">Recent</h3>
        {pages.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelected(p)}
            className={`px-3 py-2 cursor-pointer border-b border-white/50 ${
              selected?.id === p.id ? "bg-black/5" : "hover:bg-black/5"
            }`}
          >
            <div className="text-sm text-gray-800">{p.title}</div>
          </div>
        ))}
      </aside>
      <section className="flex-1 min-h-0 bg-white">
        {selected ? (
          <IFrameViewer src={selected.path} title={selected.title} />
        ) : (
          <div className="h-full grid place-items-center text-gray-500">
            Select a page.
          </div>
        )}
      </section>
    </div>
  );
}

export default function EscapeRoomDesktop() {
  const { toggle: toggleFullscreen } = useFullscreen("#root");

  // ---- LOGIN / CLOCK STATE ----
  const [hasUnlocked, setHasUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const correctPassword = "letmein"; // change to your puzzle password

  // Live clock
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // --
