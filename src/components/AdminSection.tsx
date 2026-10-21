import React, { useState, useEffect } from 'react';
import { mosqueStorage, formatMoney, formatBengaliDate } from '../services/storage';
import { Expense } from '../types';

interface AdminSectionProps {
  onDataChanged: () => void;
}

export const AdminSection: React.FC<AdminSectionProps> = ({ onDataChanged }) => {
  const [currentUser, setCurrentUser] = useState<string>(() => { try { return sessionStorage.getItem('lsd_mosque_admin_session_user_v1') || ''; } catch { return ''; } });
  const [inputEmail, setInputEmail] = useState<string>(() => mosqueStorage.getAdminEmail());
  const [inputPassword, setInputPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [needsPasswordSetup, setNeedsPasswordSetup] = useState<boolean>(() => !localStorage.getItem('lsd_mosque_admin_credential_v1'));
  const [loginBusy, setLoginBusy] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try { return sessionStorage.getItem('lsd_mosque_admin_session_v1') === 'active' && Boolean(sessionStorage.getItem('lsd_mosque_admin_session_user_v1')); } catch { return false; }
  });
  const [activeSheet, setActiveSheet] = useState<string>('Dashboard');
  const [sheetData, setSheetData] = useState<any[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [message, setMessage] = useState<string>('অ্যাডমিন তথ্য লোড করতে বোতাম চাপুন।');
  const [isError, setIsError] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showJsonView, setShowJsonView] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newRecordForm, setNewRecordForm] = useState<Record<string, any>>({});

  const adminEmail = mosqueStorage.getAdminEmail();

  useEffect(() => {
    if (!isAdminAuthenticated || !currentUser) return;
    try {
      mosqueStorage.requireAdmin(currentUser);
      loadDashboard();
    } catch {
      setIsAdminAuthenticated(false);
      try { sessionStorage.removeItem('lsd_mosque_admin_session_v1'); sessionStorage.removeItem('lsd_mosque_admin_session_user_v1'); } catch { /* private browsing */ }
    }
  }, [currentUser, isAdminAuthenticated]);

  const loadDashboard = () => {
    try {
      const res = mosqueStorage.adminGetDashboard(currentUser);
      setCounts(res.counts);
      setActiveSheet('Dashboard');
      setMessage(
        `অ্যাডমিন ড্যাশবোর্ড সফলভাবে লোড হয়েছে।\n` +
          JSON.stringify(res.counts, null, 2)
      );
      setIsError(false);
    } catch (err: any) {
      setMessage('অ্যাক্সেস/সার্ভার সমস্যা: ' + err.message);
      setIsError(true);
    }
  };

  const loadSheet = (sheetName: string) => {
    try {
      mosqueStorage.requireAdmin(currentUser);
      setActiveSheet(sheetName);
      const data = mosqueStorage.getSheet(sheetName);
      setSheetData(data);
      setMessage(`${sheetName} (${data.length} রেকর্ড লোড করা হয়েছে)`);
      setIsError(false);
      setSearchTerm('');
    } catch (err: any) {
      setMessage('অ্যাক্সেস/সার্ভার সমস্যা: ' + err.message);
      setIsError(true);
    }
  };

  const handleApproveExpense = (expenseId: string) => {
    try {
      mosqueStorage.adminApproveExpense(expenseId, currentUser);
      setMessage(`ব্যয় রেকর্ড (${expenseId}) সফলভাবে অনুমোদিত হয়েছে।`);
      setIsError(false);
      loadSheet('Expenses');
      onDataChanged();
    } catch (err: any) {
      setMessage('ব্যয় অনুমোদন ব্যর্থ: ' + err.message);
      setIsError(true);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginBusy) return;
    setLoginBusy(true);
    setIsError(false);
    try {
      const email = inputEmail.trim().toLowerCase();
      if (email !== adminEmail.trim().toLowerCase()) throw new Error('এই ইমেইলটি অনুমোদিত অ্যাডমিন ইমেইলের সঙ্গে মিলছে না।');
      if (inputPassword.length < 10) throw new Error('পাসওয়ার্ড কমপক্ষে ১০ অক্ষরের হতে হবে।');
      const key = 'lsd_mosque_admin_credential_v1';
      const encoder = new TextEncoder();
      const makeHash = async (password: string, salt: Uint8Array) => {
        const material = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
        const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 150000, hash: 'SHA-256' }, material, 256);
        return Array.from(new Uint8Array(bits)).map((b) => b.toString(16).padStart(2, '0')).join('');
      };
      const stored = localStorage.getItem(key);
      if (!stored) {
        if (inputPassword !== confirmPassword) throw new Error('দুটি পাসওয়ার্ড মিলছে না।');
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const saltText = Array.from(salt).map((b) => b.toString(16).padStart(2, '0')).join('');
        const hash = await makeHash(inputPassword, salt);
        localStorage.setItem(key, JSON.stringify({ salt: saltText, hash, email, createdAt: new Date().toISOString() }));
        setNeedsPasswordSetup(false);
      } else {
        const attemptsKey = 'lsd_mosque_admin_login_attempts_v1';
        const attemptData = JSON.parse(localStorage.getItem(attemptsKey) || '{"count":0,"until":0}');
        if (Date.now() < Number(attemptData.until || 0)) {
          throw new Error('অনেকবার ভুল চেষ্টা হয়েছে। ৫ মিনিট পর আবার চেষ্টা করুন।');
        }
        const credential = JSON.parse(stored);
        const salt = new Uint8Array(String(credential.salt).match(/.{2}/g)?.map((byte: string) => parseInt(byte, 16)) || []);
        const hash = await makeHash(inputPassword, salt);
        if (hash !== credential.hash || email !== String(credential.email).toLowerCase()) {
          const count = Number(attemptData.count || 0) + 1;
          localStorage.setItem(attemptsKey, JSON.stringify({ count: count >= 5 ? 0 : count, until: count >= 5 ? Date.now() + 5 * 60 * 1000 : 0 }));
          throw new Error(count >= 5 ? '৫ বার ভুল চেষ্টা হয়েছে। ৫ মিনিটের জন্য লগইন বন্ধ রাখা হয়েছে।' : `ইমেইল বা পাসওয়ার্ড সঠিক নয়। বাকি চেষ্টা: ${5 - count}`);
        }
        localStorage.removeItem(attemptsKey);
      }
      setCurrentUser(email);
      try { sessionStorage.setItem('lsd_mosque_admin_session_v1', 'active'); sessionStorage.setItem('lsd_mosque_admin_session_user_v1', email); } catch { /* session storage unavailable */ }
      setIsAdminAuthenticated(true);
      setInputPassword('');
      setConfirmPassword('');
      setMessage('লগইন সফল হয়েছে।');
      setIsError(false);
    } catch (err: any) {
      setIsError(true);
      setMessage(err?.message || 'লগইন করা যায়নি। আবার চেষ্টা করুন।');
    } finally {
      setLoginBusy(false);
    }
  };

  const handleLogout = () => {
    try { sessionStorage.removeItem('lsd_mosque_admin_session_v1'); } catch { /* private browsing */ }
    setIsAdminAuthenticated(false);
    setCurrentUser('');
    setInputPassword('');
    setConfirmPassword('');
    setActiveSheet('Dashboard');
    setSheetData([]);
    setMessage('আপনি নিরাপদে লগআউট করেছেন।');
  };

  const handleResetData = () => {
    if (window.confirm('আপনি কি নিশ্চিত যে সকল রেকর্ড ডিফল্ট ডেমো ডেটায় রিসেট করতে চান?')) {
      mosqueStorage.resetToDefaults();
      onDataChanged();
      loadDashboard();
      setMessage('সকল তথ্য প্রাথমিক অবস্থায় সফলভাবে রিসেট করা হয়েছে।');
    }
  };

  const openAddModalForSheet = () => {
    setNewRecordForm({});
    setShowAddModal(true);
  };

  const handleSaveNewRecord = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      mosqueStorage.adminAddRecord(activeSheet, newRecordForm, currentUser);
      setShowAddModal(false);
      setNewRecordForm({});
      loadSheet(activeSheet);
      onDataChanged();
      setMessage(`নতুন রেকর্ড সফলভাবে ${activeSheet} শিটে যুক্ত হয়েছে।`);
      setIsError(false);
    } catch (err: any) {
      alert('ত্রুটি: ' + err.message);
    }
  };

  const filteredData = sheetData.filter((item) => {
    if (!searchTerm) return true;
    return JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <section id="admin" className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px' }}>অ্যাডমিন ড্যাশবোর্ড</h2>
          <p className="muted" style={{ margin: 0 }}>
            এই অংশের তথ্য দেখতে Google Apps Script-এ অ্যাডমিন ইমেইল অনুমোদিত থাকতে হবে।
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
            অনুমোদিত অ্যাডমিন: <b>{adminEmail}</b>
          </span>
        </div>
      </div>

      <div style={{ marginTop: '16px', padding: '12px 16px', background: '#f2f8f4', borderRadius: '12px', border: '1px solid #d2ebd7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <span style={{ fontSize: '14px' }}>সক্রিয় অ্যাডমিন: <b style={{ color: 'var(--green)' }}>{currentUser}</b> <span className="badge approved">লগইন সক্রিয়</span></span>
        <button type="button" className="btn secondary" onClick={handleLogout}>লগআউট</button>
      </div>

      <div className="toolbar" style={{ marginTop: '20px' }}>
        <button
          className={activeSheet === 'Dashboard' ? 'btn' : 'btn secondary'}
          onClick={loadDashboard}
        >
          ড্যাশবোর্ড লোড
        </button>
        <button
          className={activeSheet === 'Members' ? 'btn' : 'btn secondary'}
          onClick={() => loadSheet('Members')}
        >
          সদস্য তালিকা
        </button>
        <button
          className={activeSheet === 'Contributions' ? 'btn' : 'btn secondary'}
          onClick={() => loadSheet('Contributions')}
        >
          মাসিক চাঁদা
        </button>
        <button
          className={activeSheet === 'Donations' ? 'btn' : 'btn secondary'}
          onClick={() => loadSheet('Donations')}
        >
          অনুদান তালিকা
        </button>
        <button
          className={activeSheet === 'Expenses' ? 'btn' : 'btn secondary'}
          onClick={() => loadSheet('Expenses')}
        >
          ব্যয় তালিকা
        </button>
        <button
          className={activeSheet === 'Income' ? 'btn' : 'btn secondary'}
          onClick={() => loadSheet('Income')}
        >
          আয় তালিকা
        </button>
        <button
          className={activeSheet === 'Notices' ? 'btn' : 'btn secondary'}
          onClick={() => loadSheet('Notices')}
        >
          নোটিশ তালিকা
        </button>
        <button
          className={activeSheet === 'Campaigns' ? 'btn' : 'btn secondary'}
          onClick={() => loadSheet('Campaigns')}
        >
          কার্যক্রম
        </button>
        <button
          className={activeSheet === 'Projects' ? 'btn' : 'btn secondary'}
          onClick={() => loadSheet('Projects')}
        >
          প্রজেক্ট
        </button>
        <button
          className={activeSheet === 'Committee' ? 'btn' : 'btn secondary'}
          onClick={() => loadSheet('Committee')}
        >
          পরিচালনা কমিটি
        </button>
        <button
          className={activeSheet === 'Prayer_Times' ? 'btn' : 'btn secondary'}
          onClick={() => loadSheet('Prayer_Times')}
        >
          নামাজের সময়
        </button>
        <button
          className={activeSheet === 'Audit_Logs' ? 'btn' : 'btn secondary'}
          onClick={() => loadSheet('Audit_Logs')}
        >
          অডিট লগ
        </button>
      </div>

      <div className={`message ${isError ? 'error' : ''}`} id="adminMessage">
        {message}
      </div>

      {activeSheet === 'Dashboard' ? (
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ color: 'var(--deep)', marginBottom: '14px' }}>
            শিট অনুযায়ী রেকর্ড সংখ্যা (Overview)
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '12px',
            }}
          >
            {Object.entries(counts).map(([name, count]) => (
              <div
                key={name}
                onClick={() => loadSheet(name)}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--line)',
                  borderRadius: '12px',
                  padding: '14px',
                  cursor: 'pointer',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
              >
                <div style={{ color: 'var(--muted)', fontSize: '13px' }}>{name}</div>
                <div
                  style={{
                    color: 'var(--green)',
                    fontSize: '24px',
                    fontWeight: '700',
                    marginTop: '4px',
                  }}
                >
                  {count} টি রেকর্ড
                </div>
                <div style={{ fontSize: '12px', color: 'var(--deep)', marginTop: '4px' }}>
                  তালিকা দেখতে ক্লিক করুন →
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn secondary"
              style={{ fontSize: '13px', color: '#b91c1c' }}
              onClick={handleResetData}
            >
              🔄 ডেমো ডেটা রিসেট করুন
            </button>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 style={{ margin: 0, color: 'var(--deep)' }}>
                {activeSheet} ডেটা শিট
              </h3>
              <span className="badge active">{filteredData.length} রেকর্ড</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input
                type="search"
                placeholder="সার্চ করুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--line)',
                  fontSize: '13px',
                  width: '180px',
                }}
              />
              <button
                className="btn secondary"
                style={{ padding: '6px 12px', fontSize: '13px' }}
                onClick={() => setShowJsonView(!showJsonView)}
              >
                {showJsonView ? 'টেবিল ভিউ' : 'JSON ভিউ'}
              </button>
              {activeSheet !== 'Audit_Logs' && (
                <button
                  className="btn"
                  style={{ padding: '6px 12px', fontSize: '13px' }}
                  onClick={openAddModalForSheet}
                >
                  + নতুন যোগ করুন
                </button>
              )}
            </div>
          </div>

          {showJsonView ? (
            <pre
              style={{
                background: '#1a2721',
                color: '#8be9fd',
                padding: '16px',
                borderRadius: '10px',
                overflowX: 'auto',
                fontSize: '13px',
                maxHeight: '400px',
              }}
            >
              {JSON.stringify(filteredData, null, 2)}
            </pre>
          ) : (
            <div className="table-container">
              {filteredData.length === 0 ? (
                <div className="empty">এই শিটে কোনো রেকর্ড পাওয়া যায়নি।</div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      {Object.keys(filteredData[0]).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                      {activeSheet === 'Expenses' && <th>অ্যাকশন</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((row, idx) => (
                      <tr key={idx}>
                        {Object.entries(row).map(([k, val]: [string, any], vIdx) => {
                          let displayVal = String(val ?? '');

                          if (k.toLowerCase().includes('amount') || k.toLowerCase().includes('budget') || k.toLowerCase().includes('spent')) {
                            displayVal = formatMoney(val);
                          } else if (k === 'Status' || k === 'Approval_Status') {
                            const isGood =
                              val === 'Approved' ||
                              val === 'Published' ||
                              val === 'Active' ||
                              val === 'Received';
                            const isPending = val === 'Pending';
                            return (
                              <td key={vIdx}>
                                <span
                                  className={`badge ${
                                    isGood
                                      ? 'approved'
                                      : isPending
                                      ? 'pending'
                                      : 'danger'
                                  }`}
                                >
                                  {val}
                                </span>
                              </td>
                            );
                          } else if (k.includes('_At') && val) {
                            displayVal = formatBengaliDate(val);
                          }

                          if (!isAdminAuthenticated) {
    return (
      <section id="admin" className="panel admin-login-panel">
        <div className="admin-login-art">
          <div className="admin-login-mark">☪</div>
          <span className="admin-login-eyebrow">SECURE ADMIN ACCESS</span>
          <h2>অ্যাডমিন লগইন</h2>
          <p>এলএসডি পাড়া জামে মসজিদ ব্যবস্থাপনা প্যানেলে প্রবেশ করতে অনুমোদিত ইমেইল ও পাসওয়ার্ড দিন।</p>
        </div>
        <form className="admin-login-form" onSubmit={handleLogin} autoComplete="on">
          <div className="formrow">
            <label htmlFor="admin-email">অ্যাডমিন ইমেইল</label>
            <input id="admin-email" type="email" autoComplete="username" value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} required />
          </div>
          <div className="formrow">
            <label htmlFor="admin-password">{needsPasswordSetup ? 'নতুন পাসওয়ার্ড তৈরি করুন' : 'পাসওয়ার্ড'}</label>
            <input id="admin-password" type="password" autoComplete={needsPasswordSetup ? 'new-password' : 'current-password'} value={inputPassword} onChange={(e) => setInputPassword(e.target.value)} minLength={10} required />
            <small className="muted">কমপক্ষে ১০ অক্ষর ব্যবহার করুন।</small>
          </div>
          {needsPasswordSetup && <div className="formrow">
            <label htmlFor="admin-password-confirm">পাসওয়ার্ড নিশ্চিত করুন</label>
            <input id="admin-password-confirm" type="password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} minLength={10} required />
          </div>}
          <button className="btn admin-login-submit" type="submit" disabled={loginBusy}>{loginBusy ? 'যাচাই করা হচ্ছে…' : needsPasswordSetup ? 'প্রথম পাসওয়ার্ড সেট করুন' : 'নিরাপদে লগইন করুন'}</button>
          <div className={isError ? 'message error' : 'message'} role="status">{message}</div>
          <p className="admin-security-note"><strong>গুরুত্বপূর্ণ:</strong> এই GitHub Pages সংস্করণে পাসওয়ার্ড যাচাই ব্রাউজারেই হয়। এটি ব্যবহারযোগ্য অতিরিক্ত বাধা, কিন্তু সার্ভার-সাইড নিরাপত্তা নয়। বাস্তব/আর্থিক ডেটার জন্য Google Apps Script বা অন্য ব্যাকএন্ডে যাচাই চালু করতে হবে।</p>
        </form>
      </section>
    );
  }

  return (
                            <td key={vIdx} style={{ maxWidth: '250px', wordBreak: 'break-word' }}>
                              {displayVal}
                            </td>
                          );
                        })}

                        {activeSheet === 'Expenses' && (
                          <td>
                            {(row as Expense).Approval_Status === 'Pending' ? (
                              <button
                                className="btn"
                                style={{ padding: '4px 8px', fontSize: '12px' }}
                                onClick={() => handleApproveExpense((row as Expense).Expense_ID)}
                              >
                                অনুমোদন করুন
                              </button>
                            ) : (
                              <span className="muted" style={{ fontSize: '12px' }}>
                                সম্পন্ন
                              </span>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}

      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                borderBottom: '1px solid var(--line)',
                paddingBottom: '10px',
              }}
            >
              <h3 style={{ margin: 0, color: 'var(--deep)' }}>
                নতুন রেকর্ড যোগ করুন: {activeSheet}
              </h3>
              <button
                type="button"
                className="btn secondary"
                style={{ padding: '4px 8px', fontSize: '12px' }}
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewRecord}>
              {activeSheet === 'Members' && (
                <>
                  <div className="formrow">
                    <label>সদস্যের নাম:</label>
                    <input
                      type="text"
                      required
                      value={newRecordForm.Name || ''}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Name: e.target.value })}
                    />
                  </div>
                  <div className="formrow">
                    <label>ফোন নম্বর:</label>
                    <input
                      type="tel"
                      required
                      value={newRecordForm.Phone || ''}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Phone: e.target.value })}
                    />
                  </div>
                  <div className="formrow">
                    <label>ইমেইল:</label>
                    <input
                      type="email"
                      value={newRecordForm.Email || ''}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Email: e.target.value })}
                    />
                  </div>
                  <div className="formrow">
                    <label>ঠিকানা:</label>
                    <input
                      type="text"
                      value={newRecordForm.Address || ''}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Address: e.target.value })}
                    />
                  </div>
                  <div className="formrow">
                    <label>ভূমিকা (Role):</label>
                    <select
                      value={newRecordForm.Role || 'General'}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Role: e.target.value })}
                    >
                      <option value="General">General (সাধারণ)</option>
                      <option value="Life">Life (আজীবন)</option>
                      <option value="Committee">Committee (কমিটি)</option>
                      <option value="Donor">Donor (দাতা)</option>
                    </select>
                  </div>
                  <div className="formrow">
                    <label>স্ট্যাটাস:</label>
                    <select
                      value={newRecordForm.Status || 'Active'}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </>
              )}

              {activeSheet === 'Expenses' && (
                <>
                  <div className="formrow">
                    <label>তারিখ:</label>
                    <input
                      type="date"
                      required
                      value={newRecordForm.Date || new Date().toISOString().slice(0, 10)}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Date: e.target.value })}
                    />
                  </div>
                  <div className="formrow">
                    <label>খাত / ক্যাটাগরি:</label>
                    <input
                      type="text"
                      required
                      placeholder="উদাঃ বিদ্যুৎ বিল, মেরামত, বেতন"
                      value={newRecordForm.Category || ''}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Category: e.target.value })}
                    />
                  </div>
                  <div className="formrow">
                    <label>বিবরণ:</label>
                    <textarea
                      required
                      value={newRecordForm.Description || ''}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Description: e.target.value })}
                    />
                  </div>
                  <div className="formrow">
                    <label>পরিমাণ (টাকা):</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newRecordForm.Amount || ''}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Amount: Number(e.target.value) })}
                    />
                  </div>
                  <div className="formrow">
                    <label>প্রাপক (Payee):</label>
                    <input
                      type="text"
                      required
                      value={newRecordForm.Payee || ''}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Payee: e.target.value })}
                    />
                  </div>
                  <div className="formrow">
                    <label>অনুমোদনের অবস্থা:</label>
                    <select
                      value={newRecordForm.Approval_Status || 'Approved'}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Approval_Status: e.target.value })}
                    >
                      <option value="Approved">Approved (অনুমোদিত)</option>
                      <option value="Pending">Pending (অপেক্ষমান)</option>
                      <option value="Paid">Paid (পরিশোধিত)</option>
                    </select>
                  </div>
                </>
              )}

              {activeSheet === 'Income' && (
                <>
                  <div className="formrow">
                    <label>তারিখ:</label>
                    <input
                      type="date"
                      required
                      value={newRecordForm.Date || new Date().toISOString().slice(0, 10)}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Date: e.target.value })}
                    />
                  </div>
                  <div className="formrow">
                    <label>খাত / ক্যাটাগরি:</label>
                    <input
                      type="text"
                      required
                      placeholder="উদাঃ মাসিক চাঁদা, দোকান ভাড়া, দানবাক্স"
                      value={newRecordForm.Category || ''}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Category: e.target.value })}
                    />
                  </div>
                  <div className="formrow">
                    <label>বিবরণ:</label>
                    <textarea
                      required
                      value={newRecordForm.Description || ''}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Description: e.target.value })}
                    />
                  </div>
                  <div className="formrow">
                    <label>পরিমাণ (টাকা):</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newRecordForm.Amount || ''}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Amount: Number(e.target.value) })}
                    />
                  </div>
                  <div className="formrow">
                    <label>কার নিকট হতে প্রাপ্ত:</label>
                    <input
                      type="text"
                      required
                      value={newRecordForm.Received_From || ''}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Received_From: e.target.value })}
                    />
                  </div>
                  <div className="formrow">
                    <label>মাধ্যম:</label>
                    <input
                      type="text"
                      value={newRecordForm.Payment_Method || 'নগদ'}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Payment_Method: e.target.value })}
                    />
                  </div>
                </>
              )}

              {activeSheet === 'Donations' && (
                <>
                  <div className="formrow">
                    <label>দানকারীর নাম:</label>
                    <input
                      type="text"
                      required
                      value={newRecordForm.Donor_Name || ''}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Donor_Name: e.target.value })}
                    />
                  </div>
                  <div className="formrow">
                    <label>ফোন নম্বর:</label>
                    <input
                      type="tel"
                      value={newRecordForm.Phone || ''}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Phone: e.target.value })}
                    />
                  </div>
                  <div className="formrow">
                    <label>পরিমাণ (টাকা):</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newRecordForm.Amount || ''}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Amount: Number(e.target.value) })}
                    />
                  </div>
                  <div className="formrow">
                    <label>উদ্দেশ্য / ফান্ড:</label>
                    <input
                      type="text"
                      required
                      value={newRecordForm.Purpose || ''}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Purpose: e.target.value })}
                    />
                  </div>
                  <div className="formrow">
                    <label>পদ্ধতি:</label>
                    <input
                      type="text"
                      value={newRecordForm.Payment_Method || 'নগদ'}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Payment_Method: e.target.value })}
                    />
                  </div>
                  <div className="formrow">
                    <label>স্ট্যাটাস:</label>
                    <select
                      value={newRecordForm.Status || 'Approved'}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Status: e.target.value })}
                    >
                      <option value="Approved">Approved</option>
                      <option value="Received">Received</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                </>
              )}

              {activeSheet === 'Notices' && (
                <>
                  <div className="formrow">
                    <label>শিরোনাম:</label>
                    <input
                      type="text"
                      required
                      value={newRecordForm.Title || ''}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Title: e.target.value })}
                    />
                  </div>
                  <div className="formrow">
                    <label>বিস্তারিত নোটিশ:</label>
                    <textarea
                      rows={5}
                      required
                      value={newRecordForm.Body || ''}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Body: e.target.value })}
                    />
                  </div>
                  <div className="formrow">
                    <label>প্রকাশের তারিখ:</label>
                    <input
                      type="text"
                      placeholder="উদাঃ ২০২৬-০৩-১৫"
                      value={newRecordForm.Publish_Date || new Date().toISOString().slice(0, 10)}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Publish_Date: e.target.value })}
                    />
                  </div>
                  <div className="formrow">
                    <label>স্ট্যাটাস:</label>
                    <select
                      value={newRecordForm.Status || 'Published'}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Status: e.target.value })}
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </>
              )}

              {activeSheet === 'Campaigns' && (
                <>
                  <div className="formrow">
                    <label>কার্যক্রমের শিরোনাম:</label>
                    <input
                      type="text"
                      required
                      value={newRecordForm.Title || ''}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Title: e.target.value })}
                    />
                  </div>
                  <div className="formrow">
                    <label>বিবরণ:</label>
                    <textarea
                      rows={4}
                      required
                      value={newRecordForm.Description || ''}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Description: e.target.value })}
                    />
                  </div>
                  <div className="formrow">
                    <label>লক্ষ্যমাত্রা (টাকা):</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newRecordForm.Target_Amount || ''}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Target_Amount: Number(e.target.value) })}
                    />
                  </div>
                  <div className="formrow">
                    <label>সংগৃহীত প্রাথমিক পরিমাণ (টাকা):</label>
                    <input
                      type="number"
                      value={newRecordForm.Collected_Amount || 0}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Collected_Amount: Number(e.target.value) })}
                    />
                  </div>
                  <div className="formrow">
                    <label>শুরুর তারিখ:</label>
                    <input
                      type="date"
                      value={newRecordForm.Start_Date || new Date().toISOString().slice(0, 10)}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Start_Date: e.target.value })}
                    />
                  </div>
                  <div className="formrow">
                    <label>শেষের তারিখ:</label>
                    <input
                      type="date"
                      value={newRecordForm.End_Date || ''}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, End_Date: e.target.value })}
                    />
                  </div>
                  <div className="formrow">
                    <label>স্ট্যাটাস:</label>
                    <select
                      value={newRecordForm.Status || 'Active'}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                      <option value="Upcoming">Upcoming</option>
                    </select>
                  </div>
                </>
              )}

              {activeSheet === 'Projects' && (
                <>
                  <div className="formrow">
                    <label>প্রজেক্টের নাম:</label>
                    <input
                      type="text"
                      required
                      value={newRecordForm.Name || ''}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Name: e.target.value })}
                    />
                  </div>
                  <div className="formrow">
                    <label>বিবরণ:</label>
                    <textarea
                      required
                      value={newRecordForm.Description || ''}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Description: e.target.value })}
                    />
                  </div>
                  <div className="formrow">
                    <label>বাজেট (টাকা):</label>
                    <input
                      type="number"
                      required
                      value={newRecordForm.Budget || ''}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Budget: Number(e.target.value) })}
                    />
                  </div>
                  <div className="formrow">
                    <label>ব্যয় (টাকা):</label>
                    <input
                      type="number"
                      value={newRecordForm.Spent || 0}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Spent: Number(e.target.value) })}
                    />
                  </div>
                  <div className="formrow">
                    <label>স্ট্যাটাস:</label>
                    <select
                      value={newRecordForm.Status || 'In Progress'}
                      onChange={(e) => setNewRecordForm({ ...newRecordForm, Status: e.target.value })}
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="Planning">Planning</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  বাতিল
                </button>
                <button type="submit" className="btn">
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
