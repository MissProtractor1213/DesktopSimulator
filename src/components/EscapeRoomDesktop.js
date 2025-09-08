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
} from "lucide-react";
import useFullscreen from "../hooks/useFullscreen";

/**
 * IMPORTANT: where to put your files so they render IN-TAB
 * -------------------------------------------
 * Place artifacts under:
 *   public/images/TEAM-PHOTO.png
 *   public/images/BUDGET-REPORT.png
 *   public/sim/files/suspicious-email.html
 *   public/sim/files/itinerary.html
 *   public/sim/files/invoice.html
 *   public/sim/files/history-bank.html
 *   public/sim/files/company-policy.pdf
 *
 * Then point file.path to `${process.env.PUBLIC_URL}/...`
 * This ensures correct paths on GitHub Pages (subpath /DesktopSimulator).
 */

const DESKTOP_BG =
  "bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500";

function WindowFrame({ title, icon, onClose, onMinimize, onMaximize, children }) {
  return (
    <div className="fixed inset-6 bg-white rounded-lg shadow-2xl border border-gray-300 flex flex-col z-30 overflow-hidden">
      <div className="bg-gray-100 px-3 py-2 border-b flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium text-gray-700">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onMinimize}
            className="w-7 h-7 bg-gray-300 hover:bg-gray-400 rounded flex items-center justify-center text-gray-700"
            title="Minimize"
          >
            <Minus size={16} />
          </button>
          <button
            onClick={onMaximize}
            className="w-7 h-7 bg-gray-300 hover:bg-gray-400 rounded flex items-center justify-center text-gray-700"
            title="Maximize"
          >
            <Square size={14} />
          </button>
          <button
            onClick={onClose}
            className="w-7 h-7 bg-red-500 hover:bg-red-600 rounded flex items-center justify-center text-white"
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
      <div className="p-4 text-sm text-gray-700">
        No file path provided. Add a <code>path</code> to the file entry.
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

function FileExplorer() {
  const [viewMode, setViewMode] = useState("grid");
  const [selected, setSelected] = useState(null);

  // Demo files. Wire real files by setting `path:` below.
  const files = useMemo(
    () => [
      {
        name: "TEAM-PHOTO.png",
        type: "image",
        suspicious: false,
        size: "1.2 MB",
        modified: "Today 3:10 PM",
        path: `${process.env.PUBLIC_URL}/images/TEAM-PHOTO.png`,
        content: "Fallback text if path is missing.",
      },
      {
        name: "BUDGET-REPORT.png",
        type: "image",
        suspicious: true,
        size: "980 KB",
        modified: "Today 3:12 PM",
        path: `${process.env.PUBLIC_URL}/images/BUDGET-REPORT.png`,
        content: "Fallback text if path is missing.",
      },
      {
        name: "suspicious-email.html",
        type: "html",
        suspicious: true,
        size: "3.1 KB",
        modified: "Today 3:35 PM",
        path: `${process.env.PUBLIC_URL}/sim/files/suspicious-email.html`,
        content: "Fallback email body if no HTML file shipped.",
      },
      {
        name: "company-policy.pdf",
        type: "pdf",
        suspicious: false,
        size: "220 KB",
        modified: "Yesterday 4:02 PM",
        path: `${process.env.PUBLIC_URL}/sim/files/company-policy.pdf`,
        content: "Fallback summary if no PDF shipped.",
      },
      {
        name: "history-bank.html",
        type: "html",
        suspicious: true,
        size: "2.4 KB",
        modified: "Yesterday 5:48 PM",
        path: `${process.env.PUBLIC_URL}/sim/files/history-bank.html`,
        content: "Fallback history snapshot if no HTML shipped.",
      },
      {
        name: "itinerary.html",
        type: "html",
        suspicious: false,
        size: "4.7 KB",
        modified: "Today 9:22 AM",
        path: `${process.env.PUBLIC_URL}/sim/files/itinerary.html`,
        content: "Fallback itinerary.",
      },
      {
        name: "invoice.html",
        type: "html",
        suspicious: true,
        size: "3.0 KB",
        modified: "Today 1:04 PM",
        path: `${process.env.PUBLIC_URL}/sim/files/invoice.html`,
        content: "Fallback invoice.",
      },
    ],
    []
  );

  const renderPreview = (file) => {
    const { type, path, name, content } = file;
    if (type === "html" || type === "pdf") {
      return <IFrameViewer src={path} title={name} />;
    }
    if (type === "image") {
      if (path) {
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
            <img
              src={path}
              alt={name}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        );
      }
      return (
        <div className="p-4 text-sm text-gray-700">
          {content || "Image not provided."}
        </div>
      );
    }
    return (
      <div className="p-4 text-sm whitespace-pre-wrap text-gray-800">
        {content || "No preview available."}
      </div>
    );
  };

  return (
    <div className="h-full flex min-h-0">
      <aside className="w-64 border-r border-gray-200 p-3 space-y-2 overflow-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Documents</h3>
          <span className="text-sm text-gray-500">{files.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1 rounded ${
              viewMode === "grid"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            title="Grid view"
          >
            <Grid size={16} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1 rounded ${
              viewMode === "list"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            title="List view"
          >
            <List size={16} />
          </button>
        </div>

        <div className="mt-2 space-y-1">
          {files.map((f, i) => (
            <button
              key={i}
              onClick={() => setSelected(f)}
              className={`w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${
                selected?.name === f.name ? "bg-gray-100" : ""
              }`}
            >
              <div className="text-sm font-medium text-gray-800">
                {f.name}
                {f.suspicious && (
                  <span className="ml-2 text-xs text-red-600 border border-red-300 rounded px-1">
                    suspicious
                  </span>
                )}
              </div>
              <div className="text-[11px] text-gray-500">
                {f.type} • {f.size} • {f.modified}
              </div>
            </button>
          ))}
        </div>
      </aside>

      <section className="flex-1 min-h-0">
        {/* viewer area */}
        <div className="w-full h-full">{selected ? renderPreview(selected) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a file to preview.
          </div>
        )}</div>
      </section>
    </div>
  );
}

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
      <aside className="w-80 border-r border-gray-200 overflow-auto">
        {emails.map((e) => (
          <div
            key={e.id}
            onClick={() => setSelected(e)}
            className={`px-3 py-2 cursor-pointer border-b ${
              selected?.id === e.id ? "bg-gray-100" : "hover:bg-gray-50"
            }`}
          >
            <div className="font-medium text-gray-800">{e.subject}</div>
            <div className="text-xs text-gray-500">{e.from}</div>
          </div>
        ))}
      </aside>
      <section className="flex-1 min-h-0">
        {selected ? (
          <IFrameViewer src={selected.path} title={selected.subject} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select an email.
          </div>
        )}
      </section>
    </div>
  );
}

function BrowserApp() {
  const pages = [
    {
      id: "bank",
      title: "MyBank — Login",
      path: `${process.env.PUBLIC_URL}/sim/files/history-bank.html`,
    },
    {
      id: "company-policy",
      title: "Company Policy (PDF)",
      path: `${process.env.PUBLIC_URL}/sim/files/company-policy.pdf`,
    },
  ];
  const [selected, setSelected] = useState(pages[0]);

  return (
    <div className="h-full flex min-h-0">
      <aside className="w-80 border-r border-gray-200 overflow-auto">
        <h3 className="px-3 py-2 font-semibold text-gray-800">Recent</h3>
        {pages.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelected(p)}
            className={`px-3 py-2 cursor-pointer border-b ${
              selected?.id === p.id ? "bg-gray-100" : "hover:bg-gray-50"
            }`}
          >
            <div className="text-sm text-gray-800">{p.title}</div>
          </div>
        ))}
      </aside>
      <section className="flex-1 min-h-0">
        {selected ? (
          <IFrameViewer src={selected.path} title={selected.title} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a page.
          </div>
        )}
      </section>
    </div>
  );
}

export default function EscapeRoomDesktop() {
  const { toggle: toggleFullscreen } = useFullscreen("#root");
  const [open, setOpen] = useState({ files: false, mail: false, browser: false });
  const [minimized, setMinimized] = useState({ files: false, mail: false, browser: false });

  const launch = (key) => setOpen((o) => ({ ...o, [key]: true }));
  const close = (key) =>
    setOpen((o) => ({ ...o, [key]: false })) ||
    setMinimized((m) => ({ ...m, [key]: false }));
  const minimize = (key) =>
    setMinimized((m) => ({ ...m, [key]: !m[key] }));

  return (
    <div className={`min-h-screen ${DESKTOP_BG} relative overflow-hidden`}>
      {/* Desktop icons */}
      <div className="absolute top-8 left-8 space-y-4 z-10">
        <button
          onClick={() => launch("files")}
          className="flex flex-col items-center text-white/90 hover:text-white"
          title="File Explorer"
        >
          <Folder />
          <span className="text-xs mt-1">Files</span>
        </button>
        <button
          onClick={() => launch("mail")}
          className="flex flex-col items-center text-white/90 hover:text-white"
          title="Mail"
        >
          <Mail />
          <span className="text-xs mt-1">Mail</span>
        </button>
        <button
          onClick={() => launch("browser")}
          className="flex flex-col items-center text-white/90 hover:text-white"
          title="Browser"
        >
          <Globe />
          <span className="text-xs mt-1">Browser</span>
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

      {/* Simple taskbar (shows minimized states) */}
      <div className="fixed bottom-0 left-0 right-0 h-10 bg-black/30 backdrop-blur-sm flex items-center gap-2 px-3">
        {["files", "mail", "browser"].map((k) => (
          <button
            key={k}
            onClick={() =>
              setOpen((o) => ({ ...o, [k]: true })) ||
              setMinimized((m) => ({ ...m, [k]: false }))
            }
            className={`px-2 py-1 text-xs rounded ${
              open[k] ? "bg-white/20 text-white" : "bg-white/10 text-white/80"
            }`}
          >
            {k}
          </button>
        ))}
        <div className="ml-auto" />
        <button
          onClick={toggleFullscreen}
          className="px-3 py-1 text-xs rounded bg-white/20 text-white hover:bg-white/30"
          title="Toggle Fullscreen"
        >
          Fullscreen
        </button>
      </div>
    </div>
  );
}
