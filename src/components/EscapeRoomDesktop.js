import React, { useMemo, useState } from "react";
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
 */

const WALLPAPER =
  "bg-[radial-gradient(1200px_800px_at_20%_-10%,#a1c4fd_0%,transparent_60%),radial-gradient(1000px_700px_at_100%_0%,#c2e9fb_0%,transparent_50%),linear-gradient(120deg,#7f7fd5_0%,#86a8e7_50%,#91eae4_100%)]";

function WindowFrame({ title, icon, onClose, onMinimize, onMaximize, children }) {
  return (
    <div className="fixed inset-6 bg-white/95 rounded-2xl shadow-2xl border border-white/60 backdrop-blur-xl flex flex-col z-30 overflow-hidden">
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

/** ---------- File Explorer (with per-item icons) ---------- */
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
      {/* Left rail */}
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
              viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg黑/5"
            }`}
            title="List view"
          >
            <List size={16} />
          </button>
        </div>

        {/* Items */}
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

      {/* Preview pane */}
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

/** ---------- Browser (history snapshots + PDF) ---------- */
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

  // --- LOGIN GATE (Windows-11 style lock screen -> password) ---
  const [hasUnlocked, setHasUnlocked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const correctPassword = "letmein"; // change to your puzzle password

  if (!hasUnlocked) {
    // Lock/Welcome screen
    if (!showPassword) {
      return (
        <div className={`min-h-screen ${WALLPAPER} relative`}>
          <div className="absolute inset-0 backdrop-blur-[1px]" />
          <div className="h-full w-full grid place-items-center select-none">
            <div className="text-white text-center">
              <div className="text-6xl font-light drop-shadow">14:00</div>
              <div className="opacity-90 mt-1">Sunday • Welcome</div>
              <button
                onClick={() => setShowPassword(true)}
                className="mt-6 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur text-white"
                title="Click to enter password"
              >
                Click or press any key to sign in
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Password screen
    return (
      <div className={`min-h-screen ${WALLPAPER} relative`}>
        <div className="absolute inset-0 backdrop-blur-sm" />
        <div className="h-full w-full grid place-items-center">
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-6 w-[320px] shadow-2xl">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-800">User</div>
              <div className="text-sm text-gray-500 mb-3">Sign in</div>
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && password === correctPassword && setHasUnlocked(true)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={() => password === correctPassword && setHasUnlocked(true)}
              className="mt-3 w-full px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              Sign in
            </button>
            <div className="mt-3 text-xs text-gray-600">
              Hint: <code>{correctPassword}</code> (replace with your puzzle)
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- DESKTOP (after login) ---
  const [open, setOpen] = useState({ files: false, mail: false, browser: false });
  const [minimized, setMinimized] = useState({ files: false, mail: false, browser: false });

  const launch = (key) => setOpen((o) => ({ ...o, [key]: true }));
  const close = (key) =>
    setOpen((o) => ({ ...o, [key]: false })) ||
    setMinimized((m) => ({ ...m, [key]: false }));
  const minimize = (key) => setMinimized((m) => ({ ...m, [key]: !m[key] }));

  return (
    <div className={`min-h-screen ${WALLPAPER} relative overflow-hidden`}>
      {/* Desktop icons (Win11-ish) */}
      <div className="absolute top-8 left-8 space-y-6 z-10">
        <button
          onClick={() => launch("files")}
          className="flex flex-col items-center text-white/90 hover:text-white"
          title="File Explorer"
        >
          <div className="w-14 h-14 grid place-items-center bg-white/30 backdrop-blur rounded-2xl shadow">
            <Folder />
          </div>
          <span className="text-[11px] mt-1">Files</span>
        </button>
        <button
          onClick={() => launch("mail")}
          className="flex flex-col items-center text-white/90 hover:text-white"
          title="Mail"
        >
          <div className="w-14 h-14 grid place-items-center bg-white/30 backdrop-blur rounded-2xl shadow">
            <Mail />
          </div>
          <span className="text-[11px] mt-1">Mail</span>
        </button>
        <button
          onClick={() => launch("browser")}
          className="flex flex-col items-center text-white/90 hover:text-white"
          title="Browser"
        >
          <div className="w-14 h-14 grid place-items-center bg-white/30 backdrop-blur rounded-2xl shadow">
            <Globe />
          </div>
          <span className="text-[11px] mt-1">Browser</span>
        </button>
      </div>

      {/* Windows */}
      {open.files && !minimized.files && (
        <WindowFrame
          title="File Explorer"
          icon={<Folder size={16} className="text-orange-500" />}
          onClose={() => close("files")}
          onMinimize={() => minimize("files")}
          onMaximize={() => {}}
        >
          <FileExplorer />
        </WindowFrame>
      )}

      {open.mail && !minimized.mail && (
        <WindowFrame
          title="Mail"
          icon={<Mail size={16} className="text-blue-600" />}
          onClose={() => close("mail")}
          onMinimize={() => minimize("mail")}
          onMaximize={() => {}}
        >
          <MailApp />
        </WindowFrame>
      )}

      {open.browser && !minimized.browser && (
        <WindowFrame
          title="Microsoft Edge"
          icon={<Globe size={16} className="text-cyan-500" />}
          onClose={() => close("browser")}
          onMinimize={() => minimize("browser")}
          onMaximize={() => {}}
        >
          <BrowserApp />
        </WindowFrame>
      )}

      {/* Taskbar (centered buttons, Win11-style) */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 h-12 px-3 rounded-2xl bg-black/30 text-white backdrop-blur-xl shadow-2xl flex items-center gap-2">
        {["files", "mail", "browser"].map((k) => (
          <button
            key={k}
            onClick={() =>
              setOpen((o) => ({ ...o, [k]: true })) ||
              setMinimized((m) => ({ ...m, [k]: false }))
            }
            className={`px-3 py-2 text-sm rounded-xl ${
              open[k] ? "bg-white/30" : "hover:bg-white/20"
            } capitalize`}
          >
            {k}
          </button>
        ))}
        <div className="w-px h-6 bg-white/30 mx-2" />
        <button
          onClick={toggleFullscreen}
          className="px-3 py-2 text-sm rounded-xl bg-white/20 hover:bg-white/30"
          title="Toggle Fullscreen"
        >
          Fullscreen
        </button>
      </div>
    </div>
  );
}
