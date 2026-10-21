import React, { useState } from 'react';
import { Notice } from '../types';

interface NoticesSectionProps {
  notices: Notice[];
}

export const NoticesSection: React.FC<NoticesSectionProps> = ({ notices }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const filtered = notices.filter(
    (n) =>
      n.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.Body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="notices" className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <h2 style={{ margin: 0 }}>সকল নোটিশ</h2>
        <div style={{ minWidth: '240px' }}>
          <input
            type="search"
            placeholder="নোটিশ খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid var(--line)',
              borderRadius: '8px',
              width: '100%',
              fontSize: '14px',
            }}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">কোনো নোটিশ পাওয়া যায়নি।</div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {filtered.map((notice) => (
            <div
              key={notice.Notice_ID}
              className="notice"
              style={{
                cursor: 'pointer',
                background: '#fafdfa',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--line)',
              }}
              onClick={() => setSelectedNotice(notice)}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: '12px',
                }}
              >
                <b style={{ color: 'var(--deep)', fontSize: '17px' }}>
                  {notice.Title}
                </b>
                <span className="badge published">{notice.Publish_Date || 'সাম্প্রতিক'}</span>
              </div>
              <div
                className="muted"
                style={{
                  marginTop: '8px',
                  lineHeight: '1.6',
                  fontSize: '15px',
                  whiteSpace: 'pre-line',
                }}
              >
                {notice.Body.length > 200
                  ? notice.Body.slice(0, 200) + '... (বিস্তারিত পড়তে ক্লিক করুন)'
                  : notice.Body}
              </div>
              <div
                style={{
                  marginTop: '10px',
                  fontSize: '12px',
                  color: 'var(--muted)',
                  display: 'flex',
                  gap: '16px',
                }}
              >
                <span>প্রকাশক: মসজিদ প্রশাসন কমিটি</span>
                <span>স্মারক নং: {notice.Notice_ID}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedNotice && (
        <div className="modal-backdrop" onClick={() => setSelectedNotice(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--line)',
                paddingBottom: '12px',
                marginBottom: '16px',
              }}
            >
              <span className="badge published">{selectedNotice.Publish_Date || 'বিজ্ঞপ্তি'}</span>
              <button
                className="btn secondary"
                style={{ padding: '4px 10px', fontSize: '13px' }}
                onClick={() => setSelectedNotice(null)}
              >
                ✕ বন্ধ করুন
              </button>
            </div>

            <h3 style={{ color: 'var(--deep)', marginTop: 0, fontSize: '20px', lineHeight: 1.4 }}>
              {selectedNotice.Title}
            </h3>

            <div
              style={{
                fontSize: '15px',
                lineHeight: 1.7,
                color: 'var(--ink)',
                whiteSpace: 'pre-line',
                margin: '16px 0',
                background: '#f8faf9',
                padding: '16px',
                borderRadius: '10px',
                border: '1px solid var(--line)',
              }}
            >
              {selectedNotice.Body}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: 'var(--muted)',
                fontSize: '13px',
                paddingTop: '8px',
              }}
            >
              <span>আইডি: {selectedNotice.Notice_ID}</span>
              <span>এলএসডি পাড়া জামে মসজিদ, নীলফামারী</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
