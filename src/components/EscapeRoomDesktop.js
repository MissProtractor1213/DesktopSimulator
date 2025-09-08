import useFullScreen from '../hooks/useFullscreen';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Monitor, Lock, Mail, Folder, Globe, User, X, Minus, Square,
  Battery, Wifi, Volume2, FileText, File as FileIcon, Image as ImageIcon,
  FileSpreadsheet, Grid, List, Maximize2, Minimize2
} from 'lucide-react';

/**
 * IMPORTANT (one-time):
 * If you want to preview real images/PDF/HTML "inside" the window (no new tab),
 * put them in CRA's public folder, e.g.:
 *   public/sim/files/Team_photo.pdf
 *   public/sim/files/surveillance_cam_01.jpg
 *   public/sim/files/landing.html
 *   public/sim/files/browser-history.json
 * Then add `path: "/sim/files/..."` to a file entry below.
 *
 * If a file has no `path`, we fall back to rendering `content` inline (your current behavior).
 */

const EscapeRoomDesktop = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [openApps, setOpenApps] = useState([]);
  const [activeApp, setActiveApp] = useState(null);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [foundClues, setFoundClues] = useState({ email: false, documents: false, browser: false });
  const [gameComplete, setGameComplete] = useState(false);
  const { toggle: toggleFullscreen } = useFullscreen('#root'); // or a more specific container


  // minimal "minimize" support (keeps app open but hides window)
  const [minimized, setMinimized] = useState({});

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handlePasswordKeyDown = (e) => { if (e.key === 'Enter') handleLogin(); };
  const handleLogin = () => {
    if (password.toLowerCase() === 'agent123' || password === '') setIsLoggedIn(true);
  };

  const openApp = useCallback((appName) => {
    setOpenApps(prev => (prev.includes(appName) ? prev : [...prev, appName]));
    setActiveApp(appName);
    setMinimized(m => ({ ...m, [appName]: false }));
    setShowStartMenu(false);
  }, []);

  // FIX: make closeApp state-safe and reliably activate the next window
  const closeApp = useCallback((appName) => {
    setOpenApps(prev => {
      const idx = prev.indexOf(appName);
      const next = prev.filter(a => a !== appName);
      setActiveApp(curr => {
        if (curr !== appName) return curr;
        // Try to activate the neighbor: previous in the list, otherwise last
        const neighbor = next[Math.min(idx, next.length - 1)] ?? null;
        return neighbor;
      });
      return next;
    });
    setMinimized(m => {
      const { [appName]: _, ...rest } = m;
      return rest;
    });
  }, []);

  const markClueFound = useCallback((clueType) => {
    setFoundClues(prev => {
      const newClues = { ...prev, [clueType]: true };
      if (Object.values(newClues).every(Boolean)) setGameComplete(true);
      return newClues;
    });
  }, []);

  const toggleMinimize = (app) => setMinimized(m => ({ ...m, [app]: !m[app] }));
  const isMinimized = (app) => !!minimized[app];

  /** ---------- WindowFrame: single-tab, in-window controls ---------- */
  const WindowFrame = ({ app, children }) => {
    const appNames = { files: 'File Explorer', mail: 'Mail', browser: 'Microsoft Edge' };
    const active = activeApp === app && !isMinimized(app);

    if (isMinimized(app)) return null;

    return (
      <div
        className={`fixed inset-4 bg-white rounded-lg shadow-2xl border border-gray-300 flex flex-col
                    ${active ? 'z-40' : 'z-30'}`}
        onMouseDown={() => setActiveApp(app)}
      >
        <div className="bg-gray-100 px-4 py-2 rounded-t-lg border-b flex items-center justify-between select-none">
          <div className="flex items-center space-x-2">
            {app === 'files' && <Folder size={16} className="text-orange-500" />}
            {app === 'mail' && <Mail size={16} className="text-blue-600" />}
            {app === 'browser' && <Globe size={16} className="text-cyan-500" />}
            <span className="text-sm font-medium text-gray-700">{appNames[app]}</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onMouseDown={(e) => { e.stopPropagation(); toggleMinimize(app); }}
              className="w-6 h-6 bg-gray-300 hover:bg-gray-400 rounded flex items-center justify-center text-gray-600"
              title="Minimize"
            >
              <Minus size={14} />
            </button>
            <button
              onMouseDown={(e) => { e.stopPropagation(); /* placeholder for maximize */ }}
              className="w-6 h-6 bg-gray-300 hover:bg-gray-400 rounded flex items-center justify-center text-gray-600"
              title="Maximize"
            >
              <Square size={12} />
            </button>
            <button
              onMouseDown={(e) => { e.stopPropagation(); closeApp(app); }}
              className="w-6 h-6 bg-red-500 hover:bg-red-600 rounded flex items-center justify-center text-white"
              title="Close"
            >
              <X size={14} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    );
  };

  /** ---------- File Explorer with real in-window viewers ---------- */
  const FileExplorer = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [viewMode, setViewMode] = useState('list');

    const files = [
      {
        name: 'Meeting_Notes.txt',
        type: 'text',
        suspicious: true,
        size: '2.1 KB',
        modified: 'Today 2:15 PM',
        content:
`Project CRIMSON - Operational Brief
=================================

TIMELINE: Tonight, 23:00 hours
OBJECTIVE: Data extraction from mainframe
COVER: Routine system maintenance

REMINDER: Vault access code is with Director Hayes
WARNING: Clear all browser history after accessing security protocols

End transmission.`
      },
      {
        name: 'Budget_Report.xlsx',
        type: 'excel',
        suspicious: false,
        size: '48.3 KB',
        modified: 'Yesterday 4:30 PM',
        content:
`MERIDIAN CORP - Q4 BUDGET ANALYSIS
================================

DEPARTMENT ALLOCATIONS:
• Security Systems: $2.4M
• IT Infrastructure: $1.8M
• Personnel: $3.2M
• Operations: $1.6M

SPECIAL PROJECTS:
• Project NIGHTFALL: $500K (CLASSIFIED)
• Facility Upgrade B-7: $750K
• Emergency Protocols: $200K

NOTE: All classified project funds are routed through offshore accounts.
Access codes maintained by Director Hayes only.`
      },
      {
        name: 'Team_photo.pdf',
        type: 'pdf',
        suspicious: true,
        size: '156.7 KB',
        modified: 'Today 1:45 PM',
        // If you add the real PDF at public/sim/files/Team_photo.pdf, uncomment the next line:
        // path: '/sim/files/Team_photo.pdf',
        content:
`⚠️ CLASSIFIED DOCUMENT ⚠️

OPERATION NIGHTFALL - PERSONNEL DOSSIER
=====================================

AGENT ASSIGNMENTS:
• Agent Smith - Lead Infiltrator
• Agent Johnson - Systems Specialist
• Agent Davis - Extraction Coordinator

TARGET FACILITY: Meridian Complex, Level B-7
EXTRACTION POINT: Service tunnel, Grid Reference: X-47-Alpha

SECURITY PROTOCOLS:
- Biometric scanners offline: 23:15-23:45
- Guard rotation change: 23:30
- Emergency lockdown override: Code PHOENIX-7791

❗ This document was disguised as "Team_photo.pdf" to avoid detection ❗`
      },
      {
        name: 'surveillance_cam_01.jpg',
        type: 'image',
        suspicious: true,
        size: '2.1 MB',
        modified: 'Today 3:22 PM',
        // Add the real image at public/sim/files/surveillance_cam_01.jpg then uncomment:
        // path: '/sim/files/surveillance_cam_01.jpg',
        content:
`🖼️ SURVEILLANCE CAMERA FOOTAGE
=============================

TIMESTAMP: Today 15:22:17
LOCATION: Vault entrance, Level B-7

IMAGE ANALYSIS:
- Agent Smith visible near restricted area
- Wearing maintenance coveralls (disguise)
- Accessing keypad at vault entrance
- Security badge: FAKE (Serial: X9999)

⚠️ SECURITY BREACH DETECTED ⚠️
This image contains evidence of unauthorized access attempt.

RECOMMENDED ACTION: Immediate investigation required.`
      },
      {
        name: 'landing.html',
        type: 'html',
        suspicious: false,
        size: '3.4 KB',
        modified: 'Today 3:40 PM',
        // If you add public/sim/files/landing.html, uncomment:
        // path: '/sim/files/landing.html',
        content: '<h1>Company Intranet</h1><p>Placeholder preview</p>'
      },
      {
        name: 'Team_Meeting.jpg',
        type: 'image',
        suspicious: false,
        size: '245.8 KB',
        modified: 'Last week',
        // path: '/sim/files/Team_Meeting.jpg',
        content:
`TEAM MEETING PHOTO
==================

This appears to be a normal team photo from last week's meeting.
Nothing suspicious found in this file.

ATTENDEES:
- Director Hayes
- Agent Johnson
- Agent Davis
- Security Chief Martinez
- IT Manager Thompson`
      }
    ];

    const getFileIcon = (type, suspicious = false) => {
      const baseSize = 32;
      const baseColor = suspicious ? 'text-red-600' : 'text-blue-600';
      switch (type) {
        case 'text': return <FileText size={baseSize} className={baseColor} />;
        case 'excel': return <FileSpreadsheet size={baseSize} className="text-green-600" />;
        case 'pdf': return <FileIcon size={baseSize} className={baseColor} />;
        case 'image': return <ImageIcon size={baseSize} className={baseColor} />;
        case 'html': return <Globe size={baseSize} className="text-cyan-600" />;
        default: return <FileIcon size={baseSize} className={baseColor} />;
      }
    };

    const handleFileClick = (file) => {
      setSelectedFile(file);
      if (file.suspicious) markClueFound('documents');
    };

    // NEW: in-window viewers based on type, first tries `path` from public/
    const renderFileContent = (file) => {
      if (!file) return null;

      const publicURL = file.path ? (process.env.PUBLIC_URL + file.path) : null;

      const Wrapper = ({ children }) => (
        <div className="p-4 bg-gray-50 rounded-lg h-full">
          <h4 className="font-bold mb-3 text-gray-800">{file.name}</h4>
          <div className="h-[calc(100%-2.5rem)] overflow-auto rounded">{children}</div>
          {file.suspicious && (
            <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <div className="text-sm text-yellow-800 font-medium">⚠️ Suspicious Content Detected</div>
              <div className="text-xs text-yellow-700 mt-1">
                {file.type === 'pdf'
                  ? 'This file was disguised with an innocent name but contains classified information!'
                  : file.type === 'image'
                  ? 'This surveillance image shows unauthorized access attempts!'
                  : 'This document contains potentially unauthorized or classified information.'}
              </div>
            </div>
          )}
        </div>
      );

      switch (file.type) {
        case 'text':
        case 'excel': // we can’t render xlsx without a lib; show text summary
          return (
            <Wrapper>
              <pre className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{file.content || 'No preview available.'}</pre>
            </Wrapper>
          );
        case 'image':
          return (
            <Wrapper>
              {publicURL ? (
                <img src={publicURL} alt={file.name} className="max-w-full max-h-[70vh] object-contain mx-auto" />
              ) : (
                <pre className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{file.content || 'Image not provided.'}</pre>
              )}
            </Wrapper>
          );
        case 'pdf':
          return (
            <Wrapper>
              {publicURL ? (
                <iframe title="pdf" src={publicURL} className="w-full h-[70vh] rounded" />
              ) : (
                <pre className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{file.content || 'PDF not provided.'}</pre>
              )}
            </Wrapper>
          );
        case 'html':
          return (
            <Wrapper>
              {publicURL ? (
                <iframe
                  title="html"
                  src={publicURL}
                  sandbox="allow-scripts allow-forms"
                  className="w-full h-[70vh] rounded border"
                />
              ) : (
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: file.content || '<em>No HTML content.</em>' }}
                />
              )}
            </Wrapper>
          );
        default:
          return (
            <Wrapper>
              <div className="text-center text-gray-600 p-8">Preview not available for this file type.</div>
            </Wrapper>
          );
      }
    };

    return (
      <div className="h-full flex flex-col bg-gray-50">
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="font-semibold text-gray-800">Documents</h3>
            <span className="text-sm text-gray-500">{files.length} items</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
              title="Grid view"
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
              title="List view"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex">
          <div className="w-1/2 p-4 bg-white overflow-auto border-r">
            <div className="space-y-1">
              {files.map((file, index) => (
                <div
                  key={`file-${index}-${file.name}`}
                  className={`cursor-pointer p-3 flex items-center space-x-3 hover:bg-blue-50 rounded-lg transition-colors
                              ${file.suspicious ? 'bg-red-50' : ''}
                              ${selectedFile?.name === file.name ? 'bg-blue-50 border border-blue-200' : 'border border-transparent'}`}
                  onClick={() => handleFileClick(file)}
                >
                  <div className="flex-shrink-0">{getFileIcon(file.type, file.suspicious)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{file.name}</div>
                    <div className="text-xs text-gray-500">{file.size} • {file.modified}</div>
                    {file.suspicious && <div className="text-xs text-red-600 font-medium mt-1">🔴 Suspicious File</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-1/2 p-4 bg-gray-50 overflow-hidden">
            {selectedFile ? (
              <>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">File Preview</h3>
                <div className="h-[calc(100%-2rem)] overflow-auto">
                  {renderFileContent(selectedFile)}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Folder size={48} className="mx-auto mb-4 text-gray-300" />
                  <div className="text-lg font-medium text-gray-600 mb-1">Select a file to preview</div>
                  <div className="text-sm text-gray-500">Choose from {files.length} documents</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  /** ---------- Mail ---------- */
  const MailApp = () => {
    const [selectedEmail, setSelectedEmail] = useState(null);
    const emails = [
      {
        id: 1,
        from: 'director.hayes@company.com',
        subject: 'RE: Tonight Maintenance Schedule',
        preview: 'Confirming the system maintenance window...',
        time: '2:30 PM',
        suspicious: true,
        content:
`From: Director Hayes <director.hayes@company.com>
To: Agent Smith <agent.smith@company.com>
Subject: RE: Tonight Maintenance Schedule

Agent Smith,

Confirming the system maintenance window for tonight:

🔒 VAULT ACCESS CODE: CRIMSON2024
📍 Location: Sub-level B-7, Sector 12
⏰ Time Window: 23:00 - 23:45 hours

Remember to use the service tunnels. The main elevators will be monitored.

Clean up is essential. Leave no digital traces.

- Director Hayes

P.S. This email will self-delete in 24 hours.`
      },
      {
        id: 2,
        from: 'security@company.com',
        subject: 'Security Alert: Unusual Access Patterns',
        preview: 'We have detected unusual access patterns...',
        time: '1:15 PM',
        suspicious: false,
        content:
`From: Security Department <security@company.com>
To: All Staff <all@company.com>
Subject: Security Alert: Unusual Access Patterns

Dear Team,

We have detected unusual access patterns on our network between 14:00-15:00 today.

As a precautionary measure:
- Change your passwords within 48 hours
- Report any suspicious emails immediately
- Do not access personal accounts on company devices

If you notice anything unusual, contact IT immediately.

Best regards,
Security Department`
      },
      {
        id: 3,
        from: 'hr@company.com',
        subject: 'Team Building Event - Friday',
        preview: 'Do not forget about our team building event...',
        time: '11:30 AM',
        suspicious: false,
        content:
`From: Human Resources <hr@company.com>
To: All Staff <all@company.com>
Subject: Team Building Event - Friday

Hello everyone!

Do not forget about our team building event this Friday at 6 PM in the main conference room.

Activities include:
- Team trivia
- Pizza dinner
- Awards ceremony

Please RSVP by Wednesday.

Thanks!
HR Team`
      }
    ];

    const handleEmailClick = (email) => {
      setSelectedEmail(email);
      if (email.suspicious) markClueFound('email');
    };

    return (
      <div className="h-full flex bg-white">
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h3 className="font-semibold text-gray-800">Inbox</h3>
            <div className="text-sm text-gray-500">{emails.length} messages</div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {emails.map(email => (
              <div
                key={email.id}
                onClick={() => handleEmailClick(email)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors
                  ${selectedEmail?.id === email.id ? 'bg-blue-100 border-blue-300' : ''}
                  ${email.suspicious ? 'border-l-4 border-l-red-400 bg-red-50' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-medium text-sm text-gray-900 truncate flex-1 mr-2">
                    {email.from}
                  </div>
                  <div className="text-xs text-gray-500 whitespace-nowrap">{email.time}</div>
                </div>
                <div className="font-medium text-sm text-gray-800 mb-1 truncate">{email.subject}</div>
                <div className="text-sm text-gray-600 truncate">{email.preview}</div>
                {email.suspicious && <div className="mt-2 text-xs text-red-600 font-medium">🔴 Flagged for Review</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedEmail ? (
            <div className="flex-1 overflow-y-auto">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{selectedEmail.subject}</h2>
                <div className="text-sm text-gray-600">
                  <div>From: {selectedEmail.from}</div>
                  <div>Time: {selectedEmail.time}</div>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-white border rounded-lg p-4">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                    {selectedEmail.content}
                  </pre>
                  {selectedEmail.suspicious && (
                    <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-400 rounded">
                      <div className="text-sm text-red-800 font-medium">⚠️ Suspicious Email Detected</div>
                      <div className="text-xs text-red-700 mt-1">
                        This email contains sensitive information that may be related to unauthorized activities.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Mail size={48} className="mx-auto mb-4 text-gray-300" />
                <div className="text-lg font-medium text-gray-600 mb-1">Select an email to read</div>
                <div className="text-sm text-gray-500">Choose from {emails.length} messages in your inbox</div>
                <div className="text-xs text-red-500 mt-2">Look for the flagged email! 🔴</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  /** ---------- Browser: loads JSON if present, else uses fallback ---------- */
  const BrowserApp = () => {
    const [history, setHistory] = useState(null);

    useEffect(() => { markClueFound('browser'); }, [markClueFound]);

    useEffect(() => {
      let cancelled = false;
      // Try to load public/sim/files/browser-history.json
      fetch(process.env.PUBLIC_URL + '/sim/files/browser-history.json', { cache: 'no-store' })
        .then(r => (r.ok ? r.json() : Promise.reject()))
        .then(data => { if (!cancelled) setHistory(data.map(h => ({
          url: h.url, title: h.title, time: new Date(h.visitedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suspicious: /darkweb|hack|fake|infiltration|bypass|disable|classified|tor|onion/i.test(h.url + ' ' + h.title)
        })) ); })
        .catch(() => {
          if (!cancelled) setHistory([
            { url: 'https://company-portal.com', title: '🏢 Company Portal', time: '4:15 PM', suspicious: false },
            { url: 'https://gmail.com', title: '📧 Gmail', time: '3:45 PM', suspicious: false },
            { url: 'https://stealth-cyber.net/avoid-detection', title: '🥷 How to not have cyber security detect you', time: '2:50 PM', suspicious: true },
            { url: 'https://darkweb-markets.onion/weapons', title: '🔫 Anonymous Weapons Marketplace', time: '2:15 PM', suspicious: true },
            { url: 'https://hack-forums.onion/corporate-infiltration', title: '💻 Corporate Network Infiltration Guide', time: '1:45 PM', suspicious: true },
            { url: 'https://company-intranet.com/classified', title: '🔒 Security Protocols - CLASSIFIED', time: '1:30 PM', suspicious: true },
            { url: 'https://crypted-comms.tor/secure-messaging', title: '🔐 Encrypted Communication for Illegal Activities', time: '12:20 PM', suspicious: true },
            { url: 'https://hacking-tutorials.net/bypass', title: '💻 Security Bypass Methods', time: '11:20 AM', suspicious: true },
            { url: 'https://fake-id-generator.onion/employee-badges', title: '🆔 Generate Fake Employee ID Cards', time: '10:45 AM', suspicious: true },
            { url: 'https://surveillance-countermeasures.net/cameras', title: '📹 How to Disable Security Cameras', time: '10:15 AM', suspicious: true },
            { url: 'https://linkedin.com', title: '💼 LinkedIn', time: '9:30 AM', suspicious: false }
          ]);
        });
      return () => { cancelled = true; };
    }, []);

    const browserHistory = history || [];

    return (
      <div className="h-full flex flex-col bg-white">
        <div className="bg-gray-100 border-b p-2">
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-white border rounded px-3 py-1 text-sm">https://www.company-portal.com</div>
            <div className="px-4 py-2 text-sm bg-green-600 text-white rounded font-medium">Browsing History</div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="p-6 h-full overflow-y-auto bg-white">
            <h3 className="font-semibold mb-6 text-xl text-gray-800">📜 Browser History - Recent Activity</h3>
            <div className="space-y-3">
              {browserHistory.map((item, index) => (
                <div
                  key={`history-${index}`}
                  className={`p-4 border rounded-lg transition-all hover:shadow-md
                    ${item.suspicious ? 'bg-red-50 border-red-300 hover:bg-red-100' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 mb-1">{item.title}</div>
                      <div className="text-xs text-gray-600 break-all font-mono">{item.url}</div>
                    </div>
                    <div className="text-xs text-gray-500 ml-4 whitespace-nowrap">{item.time}</div>
                  </div>
                  {item.suspicious && (
                    <div className="mt-2 text-xs text-red-600 font-medium">
                      ⚠️ SECURITY ALERT: Potentially dangerous website
                    </div>
                  )}
                </div>
              ))}
            </div>

            {browserHistory.filter(i => i.suspicious).length > 0 && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="text-sm text-yellow-800 font-medium mb-2">🔍 INVESTIGATION SUMMARY</div>
                <div className="text-xs text-yellow-700">
                  <strong>THREAT LEVEL: HIGH</strong><br />
                  Agent Smith accessed {browserHistory.filter(item => item.suspicious).length} suspicious websites.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  /** ---------- Taskbar (with Fullscreen toggle) ---------- */
  const Taskbar = () => {
    const apps = [
      { id: 'files', icon: <Folder size={20} className="text-orange-500" /> },
      { id: 'mail', icon: <Mail size={20} className="text-blue-600" /> },
      { id: 'browser', icon: <Globe size={20} className="text-cyan-500" /> }
    ];

    const toggleFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        } else {
          await document.exitFullscreen();
        }
      } catch (e) {
        console.error('Fullscreen error:', e);
      }
    };

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-60 backdrop-blur-lg border-t border-white border-opacity-20 px-4 py-2 z-50">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowStartMenu(!showStartMenu)}
            className="flex items-center space-x-2 px-3 py-2 hover:bg-white hover:bg-opacity-10 rounded transition-colors"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </div>
            <span className="text-white text-sm font-medium">Start</span>
          </button>

          <div className="flex items-center space-x-2">
            {apps.map(app => {
              const isOpen = openApps.includes(app.id);
              return (
                <button
                  key={app.id}
                  onClick={() => {
                    if (isMinimized(app.id)) {
                      setMinimized(m => ({ ...m, [app.id]: false }));
                      setActiveApp(app.id);
                    } else {
                      openApp(app.id);
                    }
                  }}
                  className={`p-2 rounded transition-all relative
                    ${activeApp === app.id ? 'bg-white bg-opacity-25 shadow-lg'
                      : isOpen ? 'bg-white bg-opacity-15'
                      : 'hover:bg-white hover:bg-opacity-10'}`}
                >
                  {app.icon}
                  {isOpen && <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>}
                </button>
              );
            })}
          </div>

          <div className="flex-1" />

          <button
            onClick={toggleFullscreen}
            className="text-white text-opacity-80 px-2 py-1 rounded hover:bg-white hover:bg-opacity-10 flex items-center gap-1 mr-3"
            title="Toggle Fullscreen"
          >
            <Maximize2 size={16} />
            <span className="text-sm">Fullscreen</span>
          </button>

          <div className="flex items-center space-x-3 text-white text-opacity-80">
            <Wifi size={16} />
            <Volume2 size={16} />
            <Battery size={16} />
            <div className="text-sm">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const StartMenu = () => {
    if (!showStartMenu) return null;
    const apps = [
      { id: 'files', icon: <Folder size={20} className="text-orange-500" />, name: 'File Explorer', description: 'Browse files and folders' },
      { id: 'mail', icon: <Mail size={20} className="text-blue-600" />, name: 'Mail', description: 'Read and send emails' },
      { id: 'browser', icon: <Globe size={20} className="text-cyan-500" />, name: 'Edge', description: 'Browse the web' }
    ];
    return (
      <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 w-96 bg-black bg-opacity-80 backdrop-blur-xl text-white rounded-xl border border-white border-opacity-20 shadow-2xl z-50 overflow-hidden">
        <div className="p-6 border-b border-white border-opacity-10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <User size={24} className="text-white" />
            </div>
            <div>
              <div className="font-medium">Agent Smith</div>
              <div className="text-sm text-white text-opacity-70">Investigator</div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid gap-3">
            {apps.map(app => (
              <button
                key={app.id}
                onClick={() => openApp(app.id)}
                className="flex items-center space-x-3 w-full p-3 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all"
              >
                <div className="flex-shrink-0">{app.icon}</div>
                <div className="flex-1 text-left">
                  <div className="font-medium">{app.name}</div>
                  <div className="text-xs text-white text-opacity-70">{app.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const WinCompleteModal = () => {
    if (!gameComplete) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center shadow-2xl">
          <div className="text-6xl mb-4">🔓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Investigation Complete!</h2>
          <p className="text-gray-600 mb-6">
            You have successfully uncovered all the evidence. Agent Smith's suspicious activities have been exposed through the documents, emails, and browser history.
          </p>
          <div className="text-sm text-gray-600 mb-6">
            ✅ Documents examined<br />
            ✅ Email evidence found<br />
            ✅ Browser history analyzed
          </div>
          <button
            onClick={() => setGameComplete(false)}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Continue Investigation
          </button>
        </div>
      </div>
    );
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern animate-pulse opacity-10"></div>

        <div className="bg-black bg-opacity-40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white border-opacity-20 w-96 relative z-10">
          <div className="text-center mb-8">
            <Monitor size={48} className="mx-auto text-white mb-4" />
            <h1 className="text-2xl font-light text-white mb-2">Windows Security</h1>
            <div className="text-white text-opacity-70 text-sm">Agent Smith's Workstation</div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white text-opacity-50" />
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                onKeyDown={handlePasswordKeyDown}
                placeholder="Enter password (agent123 or just press Enter)"
                className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200"
            >
              Sign in
            </button>
          </div>

          <div className="mt-4 text-xs text-white text-opacity-50">
            Try: agent123 or just press Enter
          </div>
        </div>
        <div className="absolute bottom-4 right-4 text-white text-opacity-70 text-sm">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-pattern"></div>
      </div>

      <div className="absolute top-8 left-8 space-y-6 z-10">
        <div
          className="flex flex-col items-center cursor-pointer p-3 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all duration-200 group"
          onClick={() => openApp('files')}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg shadow-lg flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Folder size={24} className="text-white" />
          </div>
          <span className="text-white text-xs font-medium drop-shadow-lg">Documents</span>
        </div>

        <div
          className="flex flex-col items-center cursor-pointer p-3 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all duration-200 group"
          onClick={() => openApp('mail')}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Mail size={24} className="text-white" />
          </div>
          <span className="text-white text-xs font-medium drop-shadow-lg">Mail</span>
        </div>

        <div
          className="flex flex-col items-center cursor-pointer p-3 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all duration-200 group"
          onClick={() => openApp('browser')}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg shadow-lg flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Globe size={24} className="text-white" />
          </div>
          <span className="text-white text-xs font-medium drop-shadow-lg">Edge</span>
        </div>
      </div>

      {/* Debug info */}
      <div className="absolute bottom-20 left-4 bg-black bg-opacity-50 text-white text-xs p-2 rounded z-30">
        <div>Apps: {openApps.join(', ') || '—'}</div>
        <div>Clues: Email:{foundClues.email ? '✅' : '❌'} Files:{foundClues.documents ? '✅' : '❌'} Browser:{foundClues.browser ? '✅' : '❌'}</div>
      </div>

      {openApps.includes('files') && <WindowFrame app="files"><FileExplorer /></WindowFrame>}
      {openApps.includes('mail') && <WindowFrame app="mail"><MailApp /></WindowFrame>}
      {openApps.includes('browser') && <WindowFrame app="browser"><BrowserApp /></WindowFrame>}

      <StartMenu />
      <Taskbar />
      <WinCompleteModal />

      {showStartMenu && <div className="fixed inset-0 z-20" onClick={() => setShowStartMenu(false)}></div>}
    </div>
  );
};

export default EscapeRoomDesktop;
