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
 * Public files (so they render inside iframes/images):
 * public/images/TEAM-PHOTO.png
 * public/images/BUDGET-REPORT.png
 * public/images/avatar.png
 * public/sim/files/suspicious-email.html
 * public/sim/files/itinerary.html
 * public/sim/files/invoice.html
 * public/sim/files/history-bank.html
 * public/sim/files/company-policy.pdf
 */

const WALLPAPER = "bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500";

/* Simple Windows logo */
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
        name: "company-policy.pdf",
        type: "pdf",
        size: "220 KB",
        modified: "Yesterday 4:02 PM",
        path: `${process.env.PUBLIC_URL}/sim/files/company-policy.html`,
      },
      {
        name: "TEAM-PHOTO.pdf",
        type: "html",
        size: "1.2 MB",
        modified: "Today 3:10 PM",
        path: `${process.env.PUBLIC_URL}/sim/files/wafer-recipe.html`,
      },
      {
        name: "itinerary.doc",
        type: "html",
        suspicious: false,
        size: "4.7 KB",
        modified: "Today 9:22 AM",
        path: `${process.env.PUBLIC_URL}/sim/files/itinerary.html`,
      },
      {
        name: "invoice.doc",
        type: "html",
        size: "3.0 KB",
        modified: "Today 1:04 PM",
        path: `${process.env.PUBLIC_URL}/sim/files/invoice.html`,
      },
       {
        name: "budget_summary.doc",
        type: "html",
        size: "3.0 KB",
        modified: "Today 1:00 AM",
        path: `${process.env.PUBLIC_URL}/sim/files/budget_summary.html`,
      },
     {
        name: "bom_detailed.doc",
        type: "html",
        size: "3.0 KB",
        modified: "Today 2:00 PM",
        path: `${process.env.PUBLIC_URL}/sim/files/bom_detailed.html`,
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
    return <div className="p-4 text-sm text-gray-700">No preview available.</div>;
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
                  <div className="text-sm font-medium">
                    <span className={f.name === "TEAM-PHOTO.pdf" ? "text-red-600" : "text-gray-800"}>
                      {f.name}
                    </span>
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
          <div className="h-full grid place-items-center text-gray-500">Select a file to preview.</div>
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
      to: "employee@company.com",
      path: `${process.env.PUBLIC_URL}/sim/files/invoice.html`,
    },
    {
      id: 2,
      subject: "Travel Itinerary",
      from: "noreply@airline.com",
      to: "employee@company.com",
      path: `${process.env.PUBLIC_URL}/sim/files/itinerary.html`,
    },
    {
      id: 3,
      subject: "Security Concern",
      from: "alerts@corp.com",
      to: "employee@company.com",
      path: `${process.env.PUBLIC_URL}/sim/files/suspicious-email.html`,
    },
    {
      id: 4,
      subject: "Dispose Immediately",
      from: "sus@corp.com",
      to: "employee@company.com",
      path: `${process.env.PUBLIC_URL}/sim/files/suspicious-email2.html`,
    },  
    {
      id: 5,
      subject: "[Ext] RE: Monthly Data Transfer",
      from: "employee@company.com",
      to: "ared@northbridge.example",
      path: `${process.env.PUBLIC_URL}/sim/files/email-data-transfer.html`,
    },
    {
      id: 2,
      subject: "FWD: Team Photo (final)",
      from: "employee@company.com",
      to: "sus@corp.com",
      path: `${process.env.PUBLIC_URL}/sim/files/email-team-attachment.html`,
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
          <div className="h-full grid place-items-center text-gray-500">Select an email.</div>
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
      id: "awareness",
      title: "Staying Secure: Why Cybersecurity Procedures Matter",
      path: `${process.env.PUBLIC_URL}/sim/files/cyber-article.html`,
    },
    {
      id: "China",
      title: "Tickets to Shanghai",
      path: `${process.env.PUBLIC_URL}/sim/files/shanghai.html`,
    },
    {
      id: "Silly",
      title: "The Parsnip: Latest News",
      path: `${process.env.PUBLIC_URL}/sim/files/silly-news.html`,
    },
    {
      id: "hack",
      title: "Understanding Attack Techniques",
      path: `${process.env.PUBLIC_URL}/sim/files/hacking-techniques.html`,
    },
    {
      id: "disposal",
      title: "Proper and Secure Disposal",
      path: `${process.env.PUBLIC_URL}/sim/files/secure_disposal.html`,
    },
    {
      id: "ehs",
      title: "EHS × Cybersecurity: One Safety Program",
      path: `${process.env.PUBLIC_URL}/sim/files/ehs_cyber.html`,
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
          <div className="h-full grid place-items-center text-gray-500">Select a page.</div>
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

  // ---- DESKTOP WINDOW STATE ----
  const [open, setOpen] = useState({ files: false, mail: false, browser: false });
  const [minimized, setMinimized] = useState({ files: false, mail: false, browser: false });

  // --- LOGIN SCREEN (centered card; fullscreen top-right) ---
  if (!hasUnlocked) {
    return (
      // CHANGED: min-h-screen -> h-screen to give child a definite height
      <div className={`h-screen ${WALLPAPER} relative`}>
        {/* Fullscreen button at top-right */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-3 right-3 z-50 px-3 py-1.5 text-xs rounded-xl bg-white/25 hover:bg-white/35 text-white backdrop-blur"
          title="Toggle Fullscreen"
        >
          Fullscreen
        </button>

        <div className="absolute inset-0 backdrop-blur-sm" />

        {/* CHANGED: make this container fill the viewport and center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-6 w-[360px] shadow-2xl">
            {/* Clock + Date */}
            <div className="text-center mb-4">
              <div className="text-5xl font-light text-gray-900">{timeStr}</div>
              <div className="text-sm text-gray-600">{dateStr}</div>
            </div>

            {/* Avatar + User */}
            <div className="flex flex-col items-center mb-3">
              <img
                src={`${process.env.PUBLIC_URL}/images/avatar.png`}
                alt="User avatar"
                className="w-16 h-16 rounded-full object-cover border border-white/70 shadow"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div className="text-lg font-semibold text-gray-800 mt-2">User</div>
              <div className="text-sm text-gray-500">Sign in</div>
            </div>

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && password === correctPassword && setHasUnlocked(true)
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              onClick={() => password === correctPassword && setHasUnlocked(true)}
              className="mt-3 w-full px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              Sign in
            </button>

            {/* Optional: remove in production */}
            <div className="mt-3 text-xs text-gray-600 text-center">
              Hint: "Some notes stick more than others."
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- DESKTOP (after login) ---
  const launch = (key) => setOpen((o) => ({ ...o, [key]: true }));
  const close = (key) => {
    setOpen((o) => ({ ...o, [key]: false }));
    setMinimized((m) => ({ ...m, [key]: false }));
  };
  const minimize = (key) => setMinimized((m) => ({ ...m, [key]: !m[key] }));

  return (
    <div className={`min-h-screen ${WALLPAPER} relative overflow-hidden`}>
      {/* DESKTOP ICONS (left side column) */}
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

      {/* WINDOWS-LIKE TASKBAR (bottom, left-aligned) */}
      <div className="fixed left-0 right-0 bottom-0 h-12 bg-black/35 text-white backdrop-blur-xl shadow-2xl flex items-center px-2 gap-2">
        {/* Start */}
        <button
          onClick={() => {}}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/15"
          title="Start"
        >
          <WindowsLogo className="w-5 h-5" />
          <span className="hidden sm:inline text-sm">Start</span>
        </button>

        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 flex-1 max-w-xl bg-white/15 rounded-lg px-3 py-1.5">
          <Search size={16} />
          <input
            className="bg-transparent outline-none text-sm placeholder-white/70 w-full"
            placeholder="Type here to search"
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          />
        </div>

        {/* Pinned apps */}
        <div className="flex items-center gap-1 ml-auto sm:ml-2">
          <button
            onClick={() => {
              setOpen((o) => ({ ...o, files: true }));
              setMinimized((m) => ({ ...m, files: false }));
            }}
            className={`px-3 py-2 rounded-lg ${open.files ? "bg-white/25" : "hover:bg-white/15"}`}
            title="File Explorer"
          >
            <Folder />
          </button>
          <button
            onClick={() => {
              setOpen((o) => ({ ...o, mail: true }));
              setMinimized((m) => ({ ...m, mail: false }));
            }}
            className={`px-3 py-2 rounded-lg ${open.mail ? "bg-white/25" : "hover:bg-white/15"}`}
            title="Mail"
          >
            <Mail />
          </button>
          <button
            onClick={() => {
              setOpen((o) => ({ ...o, browser: true }));
              setMinimized((m) => ({ ...m, browser: false }));
            }}
            className={`px-3 py-2 rounded-lg ${open.browser ? "bg-white/25" : "hover:bg-white/15"}`}
            title="Browser"
          >
            <Globe />
          </button>
        </div>
      </div>

      {/* APP WINDOWS */}
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
    </div>
  );
}
