import React, { useState, useEffect, useCallback } from 'react';
import { Monitor, Folder, Mail, Globe, User, Lock, X, Minimize, Volume2, Wifi, Battery } from 'lucide-react';

const EscapeRoomDesktop = () => {
  // State declarations
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

  // Effects and handlers
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = useCallback(() => {
    console.log('Login attempt with password:', password);
    console.log('Expected password:', CORRECT_PASSWORD);
    console.log('Passwords match:', password === CORRECT_PASSWORD);
    
    if (password === CORRECT_PASSWORD) {
      setIsLoggedIn(true);
    } else {
      alert('Incorrect password. Keep searching for clues!');
      setPassword('');
    }
  }, [password]);

  const handlePasswordChange = useCallback((e) => {
    const newPassword = e.target.value;
    console.log('Password changed to:', newPassword);
    setPassword(newPassword);
  }, []);

  const handlePasswordKeyPress = useCallback((e) => {
    console.log('Key pressed:', e.key);
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
  }, [activeApp, openApps]);

  const markClueFound = useCallback((clueType) => {
    setFoundClues(prev => ({ ...prev, [clueType]: true }));
  }, []);

  useEffect(() => {
    if (foundClues.documents && foundClues.email && foundClues.browser) {
      setGameComplete(true);
    }
  }, [foundClues]);

  // Component definitions
  const LoginScreen = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 relative">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 text-white text-center max-w-sm w-full">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <User size={40} />
              </div>
              <h2 className="text-lg font-light">Agent Smith</h2>
              <p className="text-sm text-white text-opacity-70 mt-1">agent.smith@company.com</p>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  onKeyDown={handlePasswordKeyPress}
                  className="w-full p-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                  autoComplete="new-password"
                  autoFocus
                />
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-opacity-50 pointer-events-none" size={18} />
              </div>
              
              <button
                onClick={handleLogin}
                type="button"
                className="w-full bg-blue-600 bg-opacity-80 hover:bg-opacity-100 active:bg-opacity-100 p-3 rounded font-medium transition-all duration-200"
              >
                Sign in
              </button>
            </div>
            
            <div className="mt-4 text-xs text-white text-opacity-50">
              Press Enter or click Sign in
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 text-white text-opacity-70 text-sm">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    );
  };

  const FileExplorer = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [viewMode, setViewMode] = useState('grid');

    const files = [
      { 
        name: 'Meeting_Notes.txt', 
        type: 'text', 
        suspicious: true, 
        content: 'Project CRIMSON - Operational Brief\n=================================\n\nTIMELINE: Tonight, 23:00 hours\nOBJECTIVE: Data extraction from mainframe\nCOVER: Routine system maintenance\n\nREMINDER: Vault access code is with Director Hayes\nWARNING: Clear all browser history after accessing security protocols\n\nEnd transmission.', 
        icon: 'text',
        size: '2.1 KB',
        modified: 'Today 2:15 PM'
      },
      { 
        name: 'Budget_Report.xlsx', 
        type: 'excel', 
        suspicious: false, 
        icon: 'excel',
        size: '48.3 KB',
        modified: 'Yesterday 4:30 PM',
        fileUrl: 'public/images/BUDGET-REPORT.png'
      },
      { 
        name: 'Team photo.pdf', 
        type: 'pdf', 
        suspicious: true, 
        icon: 'pdf',
        size: '156.7 KB',
        modified: 'Today 1:45 PM',
        fileUrl: 'public/images/TEAM-PHOTO.png',
        content: '⚠️ CLASSIFIED DOCUMENT ⚠️\n\nOPERATION NIGHTFALL - PERSONNEL DOSSIER\n=====================================\n\nAGENT ASSIGNMENTS:\n• Agent Smith - Lead Infiltrator\n• Agent Johnson - Systems Specialist  \n• Agent Davis - Extraction Coordinator\n\nTARGET FACILITY: Meridian Complex, Level B-7\nEXTRACTION POINT: Service tunnel, Grid Reference: X-47-Alpha\n\nSECURITY PROTOCOLS:\n- Biometric scanners offline: 23:15-23:45\n- Guard rotation change: 23:30\n- Emergency lockdown override: Code PHOENIX-7791\n\n❗ This document was disguised as "Team photo.pdf" to avoid detection ❗'
      },
      { 
        name: 'Team_Meeting.jpg', 
        type: 'image', 
        suspicious: false, 
        icon: 'image',
        size: '2.4 MB',
        modified: 'Yesterday 3:20 PM',
        fileUrl: '/documents/team-photo.jpg'
      },
      { 
        name: 'Company_Policy.pdf',
        type: 'pdf',
        suspicious: false,
        icon: 'pdf',
        size: '890 KB',
        modified: '2 days ago',
        fileUrl: '/documents/company-policy.pdf'
      },
    ];

    const handleFileClick = (file) => {
      setSelectedFile(file);
      if (file.suspicious) {
        markClueFound('documents');
      }
    };

    // Updated getFileIcon function - removed red highlighting for suspicious files
    const getFileIcon = (type, suspicious = false) => {
      const iconClass = "w-8 h-8 mb-2";
      
      switch(type) {
        case 'text':
          return <div className={`${iconClass} bg-blue-100 rounded border flex items-center justify-center text-blue-600 text-xs font-bold`}>TXT</div>;
        case 'excel':
          return <div className={`${iconClass} bg-green-100 rounded border flex items-center justify-center text-green-600 text-xs font-bold`}>XLS</div>;
        case 'pdf':
          return <div className={`${iconClass} bg-red-100 text-red-600 rounded border flex items-center justify-center text-xs font-bold`}>PDF</div>;
        case 'image':
          return <div className={`${iconClass} bg-purple-100 rounded border flex items-center justify-center text-purple-600 text-xs font-bold`}>JPG</div>;
        default:
          return <div className={`${iconClass} bg-gray-100 rounded border flex items-center justify-center text-gray-600 text-xs font-bold`}>FILE</div>;
      }
    };

    const renderFileContent = (file) => {
      if (file.content) {
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <pre className="text-sm whitespace-pre-wrap text-gray-800 font-mono leading-relaxed">
                {file.content}
              </pre>
            </div>
            
            {file.suspicious && (
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
                <div className="flex items-center space-x-2">
                  <div className="text-yellow-600">🚨</div>
                  <div>
                    <div className="font-semibold text-yellow-800">Suspicious Content Detected!</div>
                    <div className="text-yellow-700 text-sm mt-1">
                      {file.name === 'Team photo.pdf' 
                        ? 'This file was disguised with an innocent name but contains classified information!' 
                        : 'This document contains potentially unauthorized or classified information.'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }

      if (file.fileUrl) {
        return (
          <div className="text-center">
            <p className="text-gray-600 mb-4">This file requires an external application to view.</p>
            <a 
              href={file.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Open in External Application
            </a>
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
        {/* Toolbar */}
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
        
        {/* File Grid/List - UPDATED: Removed red highlighting and warning icons */}
        <div className="flex-1 p-4 bg-white overflow-auto">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-6 gap-4">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="cursor-pointer p-3 text-center hover:bg-blue-50 rounded-lg border-2 border-transparent hover:border-blue-200 transition-all"
                  onClick={() => handleFileClick(file)}
                >
                  <div className="flex justify-center">
                    {getFileIcon(file.type, file.suspicious)}
                  </div>
                  <div className="text-xs text-center break-words leading-tight text-gray-700">
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
                  className="cursor-pointer p-3 flex items-center space-x-3 hover:bg-blue-50 rounded-lg"
                  onClick={() => handleFileClick(file)}
                >
                  <div className="flex-shrink-0">
                    {getFileIcon(file.type, file.suspicious)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate text-gray-900">
                      {file.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      Modified {file.modified} • {file.size}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* File Viewer Modal */}
        {selectedFile && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-5xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
              {/* Modal Header */}
              <div className="bg-gray-50 p-4 border-b flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getFileIcon(selectedFile.type, selectedFile.suspicious)}
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedFile.name}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedFile.size} • Modified {selectedFile.modified}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setSelectedFile(null)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Close"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="p-6 overflow-auto max-h-[calc(85vh-120px)]">
                {renderFileContent(selectedFile)}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const MailApp = () => {
    const [selectedEmail, setSelectedEmail] = useState(null);

    const emails = [
      {
        from: 'Director Hayes',
        subject: '🔴 URGENT: Vault Access Code - CONFIDENTIAL',
        time: '2:30 PM',
        content: 'Agent Smith,\n\nThe vault access code for tonight\'s operation is: 7394\n\nDelete this message immediately after reading.\nRemember - no traces.\n\n- Director Hayes\n\nP.S. The backup codes are stored in the secure folder if needed.',
        suspicious: true,
        unread: true
      },
      {
        from: 'IT Support',
        subject: 'Password Reset Confirmation',
        time: 'Yesterday 2:45 PM',
        content: 'Hello Agent Smith,\n\nYour password reset request has been processed.\nNew temporary password: TempPass2847.\n\nPlease log in and change this immediately.\n\nBest,\nIT Support Team',
        suspicious: false,
        unread: false
      },
      {
        from: 'Finance Department',
        subject: 'Expense Report Deadline',
        time: 'Yesterday 11:00 AM',
        content: 'Dear Employees,\n\nReminder: Monthly expense reports are due by end of business Friday.\n\nPlease submit through the online portal with all required receipts attached.\n\nLate submissions may delay reimbursement processing.\n\nQuestions? Contact finance@company.com\n\nFinance Team',
        suspicious: false,
        unread: false
      },
      {
        from: 'Company Newsletter',
        subject: 'Employee of the Month - Congratulations!',
        time: '3 days ago',
        content: 'Dear Team,\n\nCongratulations to Sarah Chen from Accounting for being selected as Employee of the Month!\n\nSarah\'s dedication to accuracy and her helpful attitude make her a valuable team member.\n\nJoin us for the recognition ceremony Friday at 3 PM in the main lobby.\n\nCongratulations Sarah!\n\nManagement Team',
        suspicious: false,
        unread: false
      }
    ];

    const handleEmailClick = (email) => {
      console.log('Email clicked:', email.from, email.suspicious);
      setSelectedEmail(email);
      if (email.suspicious) {
        markClueFound('email');
      }
    };

    return (
      <div className="h-full flex bg-white">
        {/* Email List Sidebar - UPDATED: Removed red background highlighting */}
        <div className="w-80 bg-gray-50 border-r overflow-auto">
          <div className="p-4 border-b bg-white">
            <h3 className="font-semibold text-blue-600 mb-2 flex items-center">
              <Mail size={20} className="mr-2" />
              Inbox
            </h3>
            <p className="text-sm text-gray-600">{emails.filter(e => e.unread).length} unread, {emails.length} total</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {emails.map((email, index) => (
              <div
                key={index}
                className={`p-4 cursor-pointer hover:bg-gray-100 transition-colors ${
                  email.unread ? 'bg-blue-50 font-medium' : ''
                } ${selectedEmail === email ? 'bg-blue-100' : ''}`}
                onClick={() => handleEmailClick(email)}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className={`text-sm font-medium truncate pr-2 ${
                    email.suspicious ? 'text-red-700' : 'text-gray-900'
                  }`}>
                    {email.from}
                  </div>
                  <div className="text-xs text-gray-500 flex-shrink-0">{email.time}</div>
                </div>
                
                <div className={`text-sm truncate mb-1 ${
                  email.suspicious ? 'text-red-600 font-medium' : 'text-gray-800'
                } ${email.unread ? 'font-semibold' : ''}`}>
                  {email.subject}
                </div>
                
                <div className="text-xs text-gray-600 truncate">
                  {email.content.split('\n')[0]}
                </div>
                
                <div className="flex items-center mt-2 space-x-2">
                  {email.unread && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email Content Panel - UPDATED: Ensured content readability */}
        <div className="flex-1">
          {selectedEmail ? (
            <div className="h-full flex flex-col">
              <div className="p-6 border-b bg-white">
                <h2 className="text-xl font-semibold mb-2">{selectedEmail.subject}</h2>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div>
                    <strong>From:</strong> {selectedEmail.from}
                  </div>
                  <div>{selectedEmail.time}</div>
                </div>
              </div>
              
              <div className="flex-1 p-6 overflow-auto">
                <div className="bg-gray-50 p-4 rounded-lg border mb-4">
                  <pre className="whitespace-pre-line text-sm text-gray-800 font-sans leading-relaxed">
                    {selectedEmail.content}
                  </pre>
                </div>
                
                {selectedEmail.suspicious && (
                  <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
                    <div className="flex items-center space-x-2">
                      <div className="text-yellow-600">⚠️</div>
                      <div>
                        <div className="font-semibold text-yellow-800">Suspicious Email Detected!</div>
                        <div className="text-yellow-700 text-sm mt-1">
                          This email has been flagged for containing potentially sensitive or unauthorized information.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
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
            <div className="p-4">
              <h3 className="font-semibold mb-4 text-lg">📜 Browser History</h3>
              <div className="space-y-2">
                {browserHistory.map((item, index) => (
                  <div
                    key={index}
                    className={`p-3 border rounded ${
                      item.suspicious ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className={`font-medium ${
                      item.suspicious ? 'text-red-700' : 'text-blue-600'
                    }`}>
                      {item.title}
                    </div>
                    <div className="text-sm text-gray-600">{item.url}</div>
                    <div className="text-xs text-gray-400">{item.time}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 rounded">
                <div className="text-red-800 font-semibold">🚨 Suspicious Activity Detected!</div>
                <div className="text-red-700 text-sm">This browser history shows unauthorized access to restricted sites.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const WinCompleteModal = () => {
    if (!gameComplete) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">Congratulations!</h2>
          <p className="text-gray-700 mb-4">
            You've found all the clues and uncovered Agent Smith's suspicious activities!
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

  const Taskbar = () => {
    const pinnedApps = [
      { id: 'files', icon: <Folder size={20} className="text-orange-500" />, name: 'File Explorer' },
      { id: 'mail', icon: <Mail size={20} className="text-blue-600" />, name: 'Mail' },
      { id: 'browser', icon: <Globe size={20} className="text-cyan-500" />, name: 'Microsoft Edge' }
    ];

    return (
      <div className="fixed bottom-0 left-0 right-0 h-14 bg-black bg-opacity-70 backdrop-blur-xl border-t border-white border-opacity-20 flex items-center justify-center px-4 z-40">
        {/* Start Button */}
        <button
          onClick={() => setShowStartMenu(!showStartMenu)}
          className="h-10 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg flex items-center space-x-2 mr-4 shadow-lg transition-all duration-200 hover:scale-105"
        >
          <div className="w-4 h-4 bg-white rounded-sm shadow-sm"></div>
        </button>

        {/* Pinned Apps */}
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
                    ? 'bg-white bg-opacity-10 hover:bg-opacity-20'
                    : 'hover:bg-white hover:bg-opacity-10'
                }`}
                title={app.name}
              >
                {app.icon}
                {isOpen && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* System Tray */}
        <div className="ml-auto flex items-center space-x-4 text-white text-opacity-80">
          <div className="flex items-center space-x-2 text-sm">
            <Volume2 size={16} />
            <Wifi size={16} />
            <Battery size={16} />
          </div>
          <div className="text-sm">
            <div>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div className="text-xs text-white text-opacity-60">
              {currentTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const StartMenu = () => {
    if (!showStartMenu) return null;

    const apps = [
      { id: 'files', name: 'File Explorer', icon: <Folder size={24} className="text-orange-500" />, description: 'Browse your files', color: 'from-orange-400 to-orange-500' },
      { id: 'mail', name: 'Mail', icon: <Mail size={24} className="text-blue-600" />, description: 'Check your messages', color: 'from-blue-500 to-blue-600' },
      { id: 'browser', name: 'Microsoft Edge', icon: <Globe size={24} className="text-cyan-500" />, description: 'Browse the web', color: 'from-cyan-400 to-cyan-500' }
    ];

    return (
      <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 w-96 bg-black bg-opacity-80 backdrop-blur-xl text-white rounded-xl border border-white border-opacity-20 shadow-2xl z-50 overflow-hidden">
        {/* User Profile Section */}
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

        {/* Recommended Apps */}
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

        {/* Power Options */}
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
      <div className={`fixed inset-8 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col backdrop-blur-lg z-30 overflow-hidden ${
        activeApp === app ? 'z-40' : 'z-30'
      }`}>
        {/* Title Bar */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getAppIcon(app)}
            <div className="text-sm font-medium text-gray-800">{titles[app]}</div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="w-8 h-8 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors group">
              <Minimize size={14} className="text-gray-600 group-hover:text-gray-800" />
            </button>
            <button className="w-8 h-8 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors group">
              <div className="w-3 h-3 border border-gray-600 group-hover:border-gray-800"></div>
            </button>
            <button 
              onClick={() => closeApp(app)}
              className="w-8 h-8 hover:bg-red-500 hover:text-white rounded-lg flex items-center justify-center transition-colors group"
            >
              <X size={14} className="text-gray-600 group-hover:text-white" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden bg-white">
          {children}
        </div>
      </div>
    );
  };

  // Main render
  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
      {/* Wallpaper */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600"></div>
      
      {/* Desktop Icons */}
      <div className="absolute top-6 left-6 space-y-6">
        <div 
          className="flex flex-col items-center cursor-pointer p-3 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all duration-200 group"
          onClick={() => openApp('files')}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-lg flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
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

      {/* Open Applications */}
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

      {/* UI Components */}
      <StartMenu />
      <Taskbar />
      <WinCompleteModal />

      {/* Click outside to close start menu */}
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
