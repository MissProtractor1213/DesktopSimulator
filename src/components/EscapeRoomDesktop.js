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

    const files = [
      { 
        name: 'Meeting_Notes.txt', 
        type: 'text', 
        suspicious: true, 
        content: 'Project CRIMSON is scheduled for tonight. The vault code is in the email from Director Hayes.\n\nRemember to clear browser history after accessing the security protocols.', 
        icon: '📄' 
      },
      { name: 'Budget_Report.xlsx', type: 'excel', suspicious: false, icon: '📊' },
      { name: 'Team_Photo.jpg', type: 'image', suspicious: false, icon: '🖼️' },
      { 
        name: 'SECRET_PLANS.txt', 
        type: 'text', 
        suspicious: true, 
        content: 'Phase 1: Infiltrate the facility\nPhase 2: Locate the mainframe\nPhase 3: Extract data before midnight\n\nSecurity bypass codes:\n- Level 1: ALPHA7394\n- Level 2: BETA2847\n- Level 3: GAMMA5619', 
        icon: '🔒' 
      },
      { name: 'Research_Data.pdf', type: 'pdf', suspicious: false, icon: '📋' }
    ];

    const handleFileClick = (file) => {
      setSelectedFile(file);
      if (file.suspicious) {
        markClueFound('documents');
      }
    };

    return (
      <div className="h-full flex flex-col bg-white">
        <div className="bg-gray-100 border-b px-3 py-2">
          <div className="flex items-center space-x-2 text-sm">
            <Folder size={16} className="text-blue-600" />
            <span>Documents</span>
          </div>
        </div>
        
        <div className="flex-1 p-4 bg-gray-50">
          <div className="grid grid-cols-4 gap-4">
            {files.map((file, index) => (
              <div
                key={index}
                className={`cursor-pointer p-3 text-center hover:bg-blue-50 rounded ${
                  file.suspicious ? 'ring-2 ring-red-300 bg-red-50' : ''
                }`}
                onClick={() => handleFileClick(file)}
              >
                <div className="text-2xl mb-1">{file.icon}</div>
                <div className={`text-xs ${file.suspicious ? 'text-red-700 font-semibold' : 'text-gray-700'}`}>
                  {file.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedFile && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-lg w-full mx-4 max-h-96 overflow-hidden">
              <div className="bg-gray-100 p-3 border-b flex justify-between items-center">
                <h3 className="font-semibold">{selectedFile.name}</h3>
                <button onClick={() => setSelectedFile(null)}>
                  <X size={18} />
                </button>
              </div>
              <div className="p-4">
                {selectedFile.content && (
                  <div className="bg-gray-50 p-3 rounded text-sm font-mono whitespace-pre-line">
                    {selectedFile.content}
                  </div>
                )}
                {selectedFile.suspicious && (
                  <div className="mt-3 p-3 bg-green-100 border-l-4 border-green-500 rounded">
                    <div className="text-green-800 font-semibold">🔍 Clue Discovered!</div>
                    <div className="text-green-700 text-sm">Important evidence found.</div>
                  </div>
                )}
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
      }
    ];

    const handleEmailClick = (email) => {
      console.log('Email clicked:', email.from, email.suspicious); // Debug log
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
    return (
      <div className="fixed bottom-0 left-0 right-0 h-12 bg-gray-900 bg-opacity-95 backdrop-blur-md border-t border-gray-700 flex items-center px-2 z-40">
        <button
          onClick={() => setShowStartMenu(!showStartMenu)}
          className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center space-x-2 mr-2"
        >
          <div className="w-4 h-4 bg-white rounded-sm"></div>
          <span className="text-sm">Start</span>
        </button>

        <div className="flex space-x-1 flex-1">
          {openApps.map(app => (
            <button
              key={app}
              onClick={() => setActiveApp(app)}
              className={`h-10 px-3 rounded text-sm ${
                activeApp === app 
                  ? 'bg-gray-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {app === 'files' && '📁 Files'}
              {app === 'mail' && '📧 Mail'}
              {app === 'browser' && '🌐 Browser'}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-3 text-white text-sm">
          <Wifi size={16} />
          <Volume2 size={16} />
          <Battery size={16} />
          <div className="text-xs">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

    return (
      <div className={`fixed inset-8 bg-white rounded-lg shadow-2xl border border-gray-300 flex flex-col z-30 ${
        activeApp === app ? 'z-40' : 'z-30'
      }`}>
        <div className="bg-gray-100 border-b px-3 py-2 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center space-x-2">
            <div className="text-sm font-medium">{titles[app]}</div>
          </div>
          <div className="flex items-center space-x-1">
            <button className="w-6 h-6 hover:bg-gray-200 rounded flex items-center justify-center">
              <Minimize size={12} />
            </button>
            <button 
              onClick={() => closeApp(app)}
              className="w-6 h-6 hover:bg-red-500 hover:text-white rounded flex items-center justify-center"
            >
              <X size={12} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
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
      <div className="absolute top-4 left-4 space-y-4">
        <div 
          className="flex flex-col items-center cursor-pointer p-2 hover:bg-white hover:bg-opacity-20 rounded"
          onClick={() => openApp('files')}
        >
          <Folder size={32} className="text-white mb-1" />
          <span className="text-white text-xs">Documents</span>
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
