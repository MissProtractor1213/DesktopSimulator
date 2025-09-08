import React, { useState, useEffect, useCallback } from 'react';
import { Monitor, Folder, Mail, Globe, User, Lock, X, Minimize, Volume2, Wifi, Battery, FileText, FileSpreadsheet, File, Image } from 'lucide-react';

const EscapeRoomDesktop = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [openApps, setOpenApps] = useState([]);
  const [activeApp, setActiveApp] = useState(null);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [foundClues, setFoundClues] = useState({
    documents: false,
    email: false,
    browser: false
  });
  const [gameComplete, setGameComplete] = useState(false);

  const CORRECT_PASSWORD = 'CRIMSON2024';

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = useCallback(() => {
    if (password === CORRECT_PASSWORD) {
      setIsLoggedIn(true);
    } else {
      alert('Incorrect password. Keep searching for clues!');
      setPassword('');
    }
  }, [password]);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const handlePasswordKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLogin();
    }
  }, [handleLogin]);

  const openApp = useCallback((appName) => {
    if (!openApps.includes(appName)) {
      setOpenApps(prev => [...prev, appName]);
    }
    setActiveApp(appName);
    setShowStartMenu(false);
  }, [openApps]);

  const closeApp = useCallback((appName) => {
    setOpenApps(prev => prev.filter(app => app !== appName));
    if (activeApp === appName) {
      setActiveApp(openApps.length > 1 ? openApps[openApps.length - 2] : null);
    }
  }, [openApps, activeApp]);

  const markClueFound = useCallback((clueType) => {
    setFoundClues(prev => {
      const newClues = { ...prev, [clueType]: true };
      if (Object.values(newClues).every(found => found)) {
        setGameComplete(true);
      }
      return newClues;
    });
  }, []);

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
                onKeyPress={handlePasswordKeyPress}
                placeholder="Enter password"
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
            Press Enter or click Sign in
          </div>
        </div>
        <div className="absolute bottom-4 right-4 text-white text-opacity-70 text-sm">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    );
  }

  const FileExplorer = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [viewMode, setViewMode] = useState('grid');

    const files = [
      { 
        name: 'Meeting_Notes.txt', 
        type: 'text', 
        suspicious: true, 
        content: `Project CRIMSON - Operational Brief
=================================

TIMELINE: Tonight, 23:00 hours
OBJECTIVE: Data extraction from mainframe
COVER: Routine system maintenance

REMINDER: Vault access code is with Director Hayes
WARNING: Clear all browser history after accessing security protocols

End transmission.`, 
        size: '2.1 KB',
        modified: 'Today 2:15 PM'
      },
      { 
        name: 'Budget_Report.xlsx', 
        type: 'excel', 
        suspicious: false, 
        size: '48.3 KB',
        modified: 'Yesterday 4:30 PM',
        content: `MERIDIAN CORP - Q4 BUDGET ANALYSIS
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
        name: 'Team photo.pdf', 
        type: 'pdf', 
        suspicious: true, 
        size: '156.7 KB',
        modified: 'Today 1:45 PM',
        content: `⚠️ CLASSIFIED DOCUMENT ⚠️

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

❗ This document was disguised as "Team photo.pdf" to avoid detection ❗`
      },
      { 
        name: 'Team_Meeting.jpg', 
        type: 'image', 
        suspicious: false, 
        size: '245.8 KB',
        modified: 'Last week',
        content: `TEAM MEETING PHOTO
==================

This appears to be a normal team photo from last week's meeting.
Nothing suspicious found in this file.`
      }
    ];

    const getFileIcon = (type, suspicious = false) => {
      const baseSize = 32;
      const baseColor = suspicious ? 'text-red-600' : 'text-blue-600';
      
      switch(type) {
        case 'text':
          return <FileText size={baseSize} className={baseColor} />;
        case 'excel':
          return <FileSpreadsheet size={baseSize} className="text-green-600" />;
        case 'pdf':
          return <File size={baseSize} className={baseColor} />;
        case 'image':
          return <Image size={baseSize} className={baseColor} />;
        default:
          return <File size={baseSize} className={baseColor} />;
      }
    };

    const handleFileClick = (file) => {
      setSelectedFile(file);
      if (file.suspicious) {
        markClueFound('documents');
      }
    };

    const renderFileContent = (file) => {
      if (file.content) {
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-bold mb-3 text-gray-800">{file.name}</h4>
            <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {file.content}
            </div>
            {file.suspicious && (
              <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <div className="text-sm text-yellow-800 font-medium">
                  ⚠️ Suspicious Content Detected
                </div>
                <div className="text-xs text-yellow-700 mt-1">
                  {file.type === 'pdf' ? 
                    'This file was disguised with an innocent name but contains classified information!' 
                    : 'This document contains potentially unauthorized or classified information.'}
                </div>
              </div>
            )}
          </div>
        );
      }

      return (
        <div className="text-center text-gray-600">
          <div className="mb-4">Preview not available for this file type.</div>
        </div>
      );
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
            >
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <div className="w-4 h-4 flex flex-col gap-0.5">
                <div className="bg-current h-0.5 rounded"></div>
                <div className="bg-current h-0.5 rounded"></div>
                <div className="bg-current h-0.5 rounded"></div>
              </div>
            </button>
          </div>
        </div>
        
        <div className="flex-1 flex">
          <div className="w-1/2 p-4 bg-white overflow-auto border-r">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-3 gap-4">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer p-3 text-center hover:bg-blue-50 rounded-lg border-2 transition-all ${
                      selectedFile?.name === file.name ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-blue-200'
                    }`}
                    onClick={() => handleFileClick(file)}
                  >
                    <div className="flex justify-center">
                      {getFileIcon(file.type, file.suspicious)}
                    </div>
                    <div className="text-xs text-center break-words leading-tight text-gray-700 mt-2">
                      {file.name}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer p-3 flex items-center space-x-3 hover:bg-blue-50 rounded-lg ${
                      selectedFile?.name === file.name ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleFileClick(file)}
                  >
                    <div className="flex-shrink-0">
                      {getFileIcon(file.type, file.suspicious)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{file.name}</div>
                      <div className="text-xs text-gray-500">{file.size} • {file.modified}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="w-1/2 p-4 bg-gray-50">
            {selectedFile ? (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">File Preview</h3>
                {renderFileContent(selectedFile)}
              </div>
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
        content: `From: Director Hayes <director.hayes@company.com>
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
        content: `From: Security Department <security@company.com>
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
        content: `From: Human Resources <hr@company.com>
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
      if (email.suspicious) {
        markClueFound('email');
      }
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
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedEmail?.id === email.id ? 'bg-blue-50 border-blue-200' : ''
                } ${email.suspicious ? 'border-l-4 border-l-red-400' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-medium text-sm text-gray-900 truncate flex-1 mr-2">
                    {email.from}
                  </div>
                  <div className="text-xs text-gray-500 whitespace-nowrap">
                    {email.time}
                  </div>
                </div>
                <div className="font-medium text-sm text-gray-800 mb-1 truncate">
                  {email.subject}
                </div>
                <div className="text-sm text-gray-600 truncate">
                  {email.preview}
                </div>
                {email.suspicious && (
                  <div className="mt-2 text-xs text-red-600 font-medium">
                    🔴 Flagged for Review
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col">
          {selectedEmail ? (
            <div className="flex-1 overflow-y-auto">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {selectedEmail.subject}
                </h2>
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
                      <div className="text-sm text-red-800 font-medium">
                        ⚠️ Suspicious Email Detected
                      </div>
                      <div className="text-xs text-red-700 mt-1">
                        This email contains sensitive information that may be related to unauthorized activities.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 bg-gray-25">
              <div className="text-center">
                <Mail size={48} className="mx-auto mb-4 text-gray-300" />
                <div className="text-lg font-medium text-gray-600 mb-1">Select an email to read</div>
                <div className="text-sm text-gray-500">Choose from {emails.length} messages in your inbox</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const BrowserApp = () => {
    const [showHistory, setShowHistory] = useState(false);

    const handleHistoryClick = () => {
      setShowHistory(true);
      markClueFound('browser');
    };

    const browserHistory = [
      { url: 'https://company-portal.com', title: '🏢 Company Portal', time: '4:15 PM', suspicious: false },
      { url: 'https://darkweb-markets.onion/weapons', title: '🔫 Anonymous Weapons Marketplace', time: '2:15 PM', suspicious: true },
      { url: 'https://company-intranet.com/classified', title: '🔒 Security Protocols - CLASSIFIED', time: '1:30 PM', suspicious: true },
      { url: 'https://hacking-tutorials.net/bypass', title: '💻 Security Bypass Methods', time: '11:20 AM', suspicious: true }
    ];

    return (
      <div className="h-full flex flex-col bg-white">
        <div className="bg-gray-100 border-b p-2">
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-white border rounded px-3 py-1 text-sm">
              https://www.company-portal.com
            </div>
            <button
              onClick={handleHistoryClick}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              History
            </button>
          </div>
        </div>
        
        <div className="flex-1">
          {!showHistory ? (
            <div className="h-full flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <Globe size={60} className="mx-auto mb-4 text-gray-300" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Welcome to Company Portal</h2>
                <p className="text-gray-500">Check the browser history for more information...</p>
              </div>
            </div>
          ) : (
            <div className="p-6 h-full overflow-y-auto">
              <h3 className="font-semibold mb-6 text-xl text-gray-800">📜 Browser History</h3>
              <div className="space-y-3">
                {browserHistory.map((item, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg transition-all hover:shadow-md ${
                      item.suspicious 
                        ? 'bg-red-50 border-red-200 hover:bg-red-100' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {item.title}
                        </div>
                        <div className="text-xs text-gray-600 break-all">
                          {item.url}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 ml-4 whitespace-nowrap">
                        {item.time}
                      </div>
                    </div>
                    {item.suspicious && (
                      <div className="mt-2 text-xs text-red-600 font-medium">
                        ⚠️ Potentially dangerous website
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="text-sm text-yellow-800 font-medium mb-1">
                  🔍 Investigation Notes
                </div>
                <div className="text-xs text-yellow-700">
                  Multiple suspicious websites accessed. Evidence suggests unauthorized activities and potential security breaches.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const StartMenu = () => {
    if (!showStartMenu) return null;

    const apps = [
      { id: 'files', icon: <Folder size={20} className="text-orange-500" />, name: 'File Explorer', description: 'Browse files and folders', color: 'from-orange-400 to-orange-500' },
      { id: 'mail', icon: <Mail size={20} className="text-blue-600" />, name: 'Mail', description: 'Read and send emails', color: 'from-blue-400 to-blue-500' },
      { id: 'browser', icon: <Globe size={20} className="text-cyan-500" />, name: 'Edge', description: 'Browse the web', color: 'from-cyan-400 to-cyan-500' }
    ];

    return (
      <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 w-96 bg-black bg-opacity-80 backdrop-blur-xl text-white rounded-xl border border-white border-opacity-20 shadow-2xl z-50 overflow-hidden">
        <div className="p-6 border-b border-white border-opacity-10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <User size={24} className="text-white" />
            </div>
            <div>
              <div className="font-medium text-lg">Agent Smith</div>
              <div className="text-sm text-white text-opacity-70">agent.smith@company.com</div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-sm font-medium text-white text-opacity-80 mb-4 uppercase tracking-wider">Recommended</h3>
          <div className="space-y-2">
            {apps.map(app => (
              <button
                key={app.id}
                onClick={() => openApp(app.id)}
                className="w-full flex items-center space-x-4 p-3 hover:bg-white hover:bg-opacity-10 rounded-lg text-left transition-all duration-200 group"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${app.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  {app.icon}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{app.name}</div>
                  <div className="text-xs text-white text-opacity-60">{app.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-white border-opacity-10 p-4">
          <div className="flex justify-end">
            <button className="w-10 h-10 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 flex items-center justify-center transition-colors">
              <div className="w-5 h-5 rounded-full border-2 border-white border-opacity-60"></div>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const WindowFrame = ({ app, children }) => {
    const titles = {
      files: 'File Explorer',
      mail: 'Mail',
      browser: 'Microsoft Edge'
    };

    const getAppIcon = (app) => {
      switch(app) {
        case 'files':
          return <Folder size={16} className="text-orange-500" />;
        case 'mail':
          return <Mail size={16} className="text-blue-600" />;
        case 'browser':
          return <Globe size={16} className="text-cyan-500" />;
        default:
          return null;
      }
    };

    return (
      <div className={`fixed inset-8 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col backdrop-blur-lg overflow-hidden ${
        activeApp === app ? 'z-40' : 'z-30'
      }`}>
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getAppIcon(app)}
            <span className="font-medium text-gray-700">{titles[app]}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded transition-colors"
              onClick={() => setActiveApp(null)}
            >
              <Minimize size={14} className="text-gray-600" />
            </button>
            <button 
              className="w-8 h-8 flex items-center justify-center hover:bg-red-500 hover:text-white rounded transition-colors text-gray-600"
              onClick={() => closeApp(app)}
            >
              <X size={14} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    );
  };

  const Taskbar = () => {
    const pinnedApps = [
      { id: 'files', icon: <Folder size={20} className="text-orange-500" />, name: 'File Explorer' },
      { id: 'mail', icon: <Mail size={20} className="text-blue-600" />, name: 'Mail' },
      { id: 'browser', icon: <Globe size={20} className="text-cyan-500" />, name: 'Microsoft Edge' }
    ];

    return (
      <div className="fixed bottom-0 left-0 right-0 h-14 bg-black bg-opacity-70 backdrop-blur-xl border-t border-white border-opacity-20 flex items-center justify-center px-4 z-40">
        <button
          onClick={() => setShowStartMenu(!showStartMenu)}
          className="h-10 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg flex items-center space-x-2 mr-4 shadow-lg transition-all duration-200 hover:scale-105"
        >
          <div className="w-4 h-4 bg-white rounded-sm shadow-sm"></div>
        </button>

        <div className="flex space-x-1 mr-4">
          {pinnedApps.map(app => {
            const isOpen = openApps.includes(app.id);
            const isActive = activeApp === app.id;

            return (
              <button
                key={app.id}
                onClick={() => openApp(app.id)}
                className={`h-10 w-12 rounded-lg flex items-center justify-center transition-all duration-200 relative group ${
                  isActive 
                    ? 'bg-white bg-opacity-25 shadow-lg' 
                    : isOpen
                    ? 'bg-white bg-opacity-15' 
                    : 'hover:bg-white hover:bg-opacity-10'
                }`}
              >
                {app.icon}
                {isOpen && (
                  <div className="absolute bottom-1 w-1 h-1 bg-white rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex-1"></div>
        <div className="flex items-center space-x-3 text-white text-opacity-80">
          <Wifi size={16} />
          <Volume2 size={16} />
          <Battery size={16} />
          <div className="text-sm">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

      {openApps.includes('files') && (
        <WindowFrame app="files">
          <FileExplorer />
        </WindowFrame>
      )}

      {openApps.includes('mail') && (
        <WindowFrame app="mail">
          <MailApp />
        </WindowFrame>
      )}

      {openApps.includes('browser') && (
        <WindowFrame app="browser">
          <BrowserApp />
        </WindowFrame>
      )}

      <StartMenu />
      <Taskbar />
      <WinCompleteModal />

      {showStartMenu && (
        <div 
          className="fixed inset-0 z-20" 
          onClick={() => setShowStartMenu(false)}
        ></div>
      )}
    </div>
  );
};

export default EscapeRoomDesktop;
