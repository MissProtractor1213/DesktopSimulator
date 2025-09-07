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
        fileUrl: 'public/documents/budget-report.xlsx',
        //content: 'QUARTERLY BUDGET REPORT\n======================\n\nQ1 Expenses: $2,847,392\nQ2 Projected: $3,120,048\n\nDepartment Allocations:\n- IT Security: $450,000\n- Operations: $890,000\n- Research: $1,200,000\n- Classified Projects: $[REDACTED]'
      },
      { 
        name: 'Team photo.pdf', 
        type: 'pdf', 
        suspicious: true, 
        icon: 'pdf',
        size: '156.7 KB',
        modified: 'Today 1:45 PM',
        fileUrl: 'public/documents/Super Secret Wafer Recipe.pdf',
        //content: '⚠️ CLASSIFIED DOCUMENT ⚠️\n\nOPERATION NIGHTFALL - PERSONNEL DOSSIER\n=====================================\n\nAGENT ASSIGNMENTS:\n• Agent Smith - Lead Infiltrator\n• Agent Johnson - Systems Specialist  \n• Agent Davis - Extraction Coordinator\n\nTARGET FACILITY: Meridian Complex, Level B-7\nEXTRACTION POINT: Service tunnel, Grid Reference: X-47-Alpha\n\nSECURITY PROTOCOLS:\n- Biometric scanners offline: 23:15-23:45\n- Guard rotation change: 23:30\n- Emergency lockdown override: Code PHOENIX-7791\n\n❗ This document was disguised as "Team photo.pdf" to avoid detection ❗'
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
      { 
        name: 'SECRET_PLANS.txt', 
        type: 'text', 
        suspicious: true, 
        content: 'OPERATION BLUEPRINT\n==================\n\nPhase 1: Facility Infiltration [COMPLETE]\nPhase 2: Mainframe Access [IN PROGRESS] \nPhase 3: Data Extraction [PENDING]\nPhase 4: Clean Exit [PENDING]\n\nSECURITY BYPASS CODES:\n- Level 1 (Lobby): ALPHA7394\n- Level 2 (Offices): BETA2847  \n- Level 3 (Server Room): GAMMA5619\n- Emergency Override: CRIMSON2024\n\nCONTINGENCY: If discovered, initiate Protocol Black', 
        icon: 'text',
        size: '1.8 KB',
        modified: 'Today 11:20 AM'
      }
    ];

    const handleFileClick = (file) => {
      setSelectedFile(file);
      if (file.suspicious) {
        markClueFound('documents');
      }
    };

    const getFileIcon = (type, suspicious = false) => {
      const iconClass = "w-8 h-8 mb-2";
      const suspiciousClass = suspicious ? "text-red-600" : "";
      
      switch(type) {
        case 'text':
          return <div className={`${iconClass} ${suspiciousClass} bg-blue-100 rounded border flex items-center justify-center text-blue-600 text-xs font-bold`}>TXT</div>;
        case 'excel':
          return <div className={`${iconClass} bg-green-100 rounded border flex items-center justify-center text-green-600 text-xs font-bold`}>XLS</div>;
        case 'pdf':
          return <div className={`${iconClass} ${suspiciousClass || 'bg-red-100 text-red-600'} rounded border flex items-center justify-center text-xs font-bold`}>PDF</div>;
        case 'image':
          return <div className={`${iconClass} bg-purple-100 rounded border flex items-center justify-center text-purple-600 text-xs font-bold`}>JPG</div>;
        default:
          return <div className={`${iconClass} bg-gray-100 rounded border flex items-center justify-center text-gray-600 text-xs font-bold`}>FILE</div>;
      }
    };

    const renderFileContent = (file) => {
      // If file has text content, show that first (for escape room clues)
      if (file.content) {
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <pre className="text-sm whitespace-pre-wrap text-gray-800 font-mono leading-relaxed">
                {file.content}
              </pre>
            </div>
            
            {file.suspicious && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                <div className="flex items-center space-x-2">
                  <div className="text-red-600">🚨</div>
                  <div>
                    <div className="font-semibold text-red-800">Suspicious Content Detected!</div>
                    <div className="text-red-700 text-sm mt-1">
                      {file.name === 'Team photo.pdf' 
                        ? 'This file was disguised with an innocent name but contains classified information!' 
                        : 'This document contains potentially unauthorized or classified information.'
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }

      // If no content but has fileUrl, render based on file type
      if (file.fileUrl) {
        switch (file.type) {
          case 'image':
            return (
              <div className="text-center">
                <img 
                  src={file.fileUrl} 
                  alt={file.name}
                  className="max-w-full max-h-96 rounded shadow-lg mx-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div style={{display: 'none'}} className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🖼️</div>
                  <div>Image not found</div>
                  <div className="text-sm mt-2">Make sure the file exists at: {file.fileUrl}</div>
                </div>
              </div>
            );

          case 'pdf':
            return (
              <div className="w-full">
                <iframe
                  src={file.fileUrl}
                  className="w-full h-96 border rounded"
                  title={file.name}
                  onError={() => {
                    console.log('PDF failed to load');
                  }}
                >
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📄</div>
                    <div>PDF preview not available</div>
                    <div className="text-sm mt-2">
                      <a 
                        href={file.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Click here to open PDF in new tab
                      </a>
                    </div>
                  </div>
                </iframe>
              </div>
            );

          case 'excel':
            return (
              <div className="text-center py-8">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="text-4xl mb-4">📊</div>
                  <div className="text-lg font-medium text-gray-900 mb-2">Excel Spreadsheet</div>
                  <div className="text-sm text-gray-600 mb-4">
                    Excel files cannot be displayed directly in the browser.
                  </div>
                  
                  {/* Option 1: Download link */}
                  <a 
                    href={file.fileUrl}
                    download={file.name}
                    className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-2"
                  >
                    📥 Download Excel File
                  </a>
                  
                  {/* Option 2: Try to open in new tab */}
                  <a 
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    🔗 Open in New Tab
                  </a>
                </div>
              </div>
            );

          default:
            return (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📄</div>
                <div>File preview not available</div>
                <div className="text-sm mt-2">
                  <a 
                    href={file.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Open file in new tab
                  </a>
                </div>
              </div>
            );
        }
      }

      // Fallback for files without content or URL
      return (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📄</div>
          <div>No preview available for this file</div>
        </div>
      );
    };

    return (
      <div className="h-full flex flex-col bg-white">
        {/* File Explorer Header */}
        <div className="bg-gray-50 border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Folder size={20} className="text-blue-600" />
              <span className="font-medium">Documents</span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600">{files.length} items</span>
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
        </div>
        
        {/* File Grid/List */}
        <div className="flex-1 p-4 bg-white overflow-auto">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-6 gap-4">
              {files.map((file, index) => (
                <div
                  key={index}
                  className={`cursor-pointer p-3 text-center hover:bg-blue-50 rounded-lg border-2 border-transparent hover:border-blue-200 transition-all ${
                    file.suspicious ? 'ring-1 ring-red-200 bg-red-25' : ''
                  }`}
                  onClick={() => handleFileClick(file)}
                >
                  <div className="flex justify-center">
                    {getFileIcon(file.type, file.suspicious)}
                  </div>
                  <div className={`text-xs text-center break-words leading-tight ${
                    file.suspicious ? 'text-red-700 font-medium' : 'text-gray-700'
                  }`}>
                    {file.name}
                  </div>
                  {file.suspicious && (
                    <div className="text-xs text-red-500 mt-1">⚠️</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {files.map((file, index) => (
                <div
                  key={index}
                  className={`cursor-pointer p-3 flex items-center space-x-3 hover:bg-blue-50 rounded-lg ${
                    file.suspicious ? 'bg-red-25 border border-red-100' : ''
                  }`}
                  onClick={() => handleFileClick(file)}
                >
                  <div className="flex-shrink-0">
                    {getFileIcon(file.type, file.suspicious)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate ${
                      file.suspicious ? 'text-red-700' : 'text-gray-900'
                    }`}>
                      {file.name}
                      {file.suspicious && <span className="ml-2 text-red-500">⚠️</span>}
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
                  {selectedFile.fileUrl && (
                    <a 
                      href={selectedFile.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Open in New Tab
                    </a>
                  )}
                  <button 
                    onClick={() => setSelectedFile(null)}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
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
        content: 'Agent Smith,\n\nThe vault access code for tonight\'s operation is: 7394\n\nDelete this message immediately after reading.\nRemember - no traces.\n\n- Director Hayes\n\nP.S. The secondary escape route is through the maintenance tunnels.',
        suspicious: true,
        unread: true
      },
      {
        from: 'Security Admin',
        subject: '⚠️ System Maintenance Tonight - IGNORE ALARMS',
        time: '1:45 PM',
        content: 'All Personnel,\n\nScheduled system maintenance will occur tonight from 23:00 to 01:00.\n\nDuring this time:\n- Security cameras will be offline\n- Motion sensors disabled\n- Access logs suspended\n\nAny alarms during this period should be IGNORED.\n\nDO NOT investigate unusual activity.\n\n- IT Security Team',
        suspicious: true,
        unread: true
      },
      {
        from: 'Agent Johnson',
        subject: 'Equipment Drop Confirmed',
        time: '12:15 PM',
        content: 'Smith,\n\nEquipment package has been placed in Locker 47-B as discussed.\n\nContents:\n- Portable drive (encrypted)\n- Bypass device\n- Emergency beacon\n\nRetrieve before 22:00. Locker combination: 8472\n\n-J',
        suspicious: true,
        unread: false
      },
      {
        from: 'Anonymous Whistleblower',
        subject: 'You\'re being watched - CAREFUL',
        time: '2 days ago',
        content: 'Smith,\n\nSomeone in the organization knows about your activities.\n\nDirector Hayes may not be the only one involved. Trust no one.\n\nThey\'ve been monitoring email traffic. Use secure channels only.\n\nMeeting point Alpha if compromised.\n\n-A friend',
        suspicious: true,
        unread: false
      },
      {
        from: 'HR Department',
        subject: 'Weekly Team Meeting Reminder',
        time: '10:15 AM',
        content: 'Dear Team,\n\nReminder about our weekly team meeting tomorrow at 9 AM in Conference Room B.\n\nAgenda:\n- Project status updates\n- Q3 planning\n- Team building activities\n\nPlease bring your laptops and quarterly reports.\n\nBest regards,\nHR Team',
        suspicious: false,
        unread: false
      },
      {
        from: 'IT Help Desk',
        subject: 'Password Expiration Notice',
        time: '9:30 AM',
        content: 'Hello Agent Smith,\n\nYour network password will expire in 7 days.\n\nTo update your password, please visit: https://portal.company.com/password-reset\n\nFor security reasons, please choose a strong password with:\n- At least 12 characters\n- Mix of letters, numbers, and symbols\n- No dictionary words\n\nIf you need assistance, contact IT at ext. 2847.\n\nBest,\nIT Support Team',
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
        {/* Email List Sidebar */}
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
                  email.suspicious ? 'border-l-4 border-l-red-500 bg-red-50' : ''
                } ${email.unread ? 'bg-blue-50 font-medium' : ''} ${
                  selectedEmail === email ? 'bg-blue-100' : ''
                }`}
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
                  {email.suspicious && (
                    <div className="text-xs text-red-500 flex items-center">
                      ⚠️ <span className="ml-1">Flagged</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email Content Panel */}
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
                    ? 'bg-white bg-opacity-15'
                    : 'bg-white bg-opacity-10 hover:bg-opacity-20'
                }`}
                title={app.name}
              >
                {app.icon}
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                )}
                
                {/* Open indicator */}
                {isOpen && !isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-0.5 bg-white bg-opacity-60 rounded-full"></div>
                )}
                
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {app.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-white bg-opacity-20 mr-4"></div>

        {/* Running Apps (if any additional ones) */}
        <div className="flex space-x-1 flex-1 justify-center">
          {/* This section could show additional running apps that aren't pinned */}
        </div>

        {/* System Tray */}
        <div className="flex items-center space-x-4 text-white text-sm">
          <div className="flex items-center space-x-2 opacity-80">
            <Wifi size={16} />
            <Volume2 size={16} />
            <Battery size={16} />
          </div>
          <div className="text-xs font-medium">
            <div>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div className="text-xs opacity-60">{currentTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
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
