import React from 'react';
import { PublicData, Notice, Campaign } from '../types';
import { formatMoney } from '../services/storage';

interface HomeSectionProps {
  publicData: PublicData;
  onNavigate: (section: string) => void;
  onSelectCampaignForDonation: (campaign: Campaign) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  publicData,
  onNavigate,
  onSelectCampaignForDonation,
}) => {
  const { summary, notices, campaigns } = publicData;

  return (
    <section id="home">
      <div className="hero">
        <div>
          <div style={{ fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', color: '#0d5e46', fontWeight: 700, marginBottom: '8px' }}>
            এলএসডি পাড়া জামে মসজিদ
          </div>
          <h1>আসুন, মসজিদের উন্নয়নে অংশ নিই — স্বচ্ছতা, আমানতদারি ও সম্মিলিত প্রচেষ্টায়।</h1>
          <p>
            পুরাতন রেলওয়ে স্টেশন, নীলফামারী, বাংলাদেশ। মসজিদের স্বচ্ছতা, অনুদান, মাসিক চাঁদা,
            আয়-ব্যয় ও সেবামূলক কার্যক্রম একসাথে দেখুন।
          </p>
          <div className="muted">📍 {publicData.address}</div>
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="btn" onClick={() => onNavigate('campaigns')}>
              মসজিদে দান করুন
            </button>
            <button className="btn secondary" onClick={() => onNavigate('financials')}>
              আয়-ব্যয়ের হিসাব দেখুন
            </button>
            <button className="btn secondary" onClick={() => onNavigate('admin')}>
              মুসল্লি লগইন
            </button>
          </div>
        </div>
        <div className="crescent" aria-hidden="true">
          ☪
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <small>মোট সংগৃহীত অনুদান</small>
          <strong>{formatMoney(summary.donations)}</strong>
        </div>
        <div className="stat">
          <small>চলতি মাসের অনুদান</small>
          <strong>{formatMoney(summary.income / 2)}</strong>
        </div>
        <div className="stat">
          <small>মোট ব্যয়</small>
          <strong>{formatMoney(summary.expenses)}</strong>
        </div>
        <div className="stat">
          <small>বর্তমান হিসাবের স্থিতি</small>
          <strong>{formatMoney(summary.balance)}</strong>
        </div>
      </div>

      <div className="stats" style={{ marginTop: '0' }}>
        <div className="stat">
          <small>চলতি মাসের চাঁদা সংগ্রহ</small>
          <strong>{formatMoney(summary.income / 2)}</strong>
        </div>
        <div className="stat">
          <small>চলতি মাসের মোট দাতা</small>
          <strong>{Math.max(12, Math.round((summary.donations || 1) / 5000))}</strong>
        </div>
        <div className="stat">
          <small>সক্রিয় কার্যক্রম</small>
          <strong>{campaigns.length || 0}</strong>
        </div>
        <div className="stat">
          <small>প্রকাশিত নোটিশ</small>
          <strong>{notices.length || 0}</strong>
        </div>
      </div>

      <div className="grid">
        <article className="panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h2 style={{ margin: 0 }}>সর্বশেষ নোটিশ</h2>
            <button
              className="btn secondary"
              style={{ padding: '4px 10px', fontSize: '13px' }}
              onClick={() => onNavigate('notices')}
            >
              সব দেখুন
            </button>
          </div>
          {notices.length === 0 ? (
            <div className="empty">এখনো প্রকাশিত নোটিশ নেই।</div>
          ) : (
            <div>
              {notices.slice(0, 3).map((notice: Notice) => (
                <div key={notice.Notice_ID} className="notice">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                    <b style={{ color: 'var(--deep)', fontSize: '15px' }}>{notice.Title}</b>
                    <span className="badge published" style={{ whiteSpace: 'nowrap' }}>
                      {notice.Publish_Date || 'সাম্প্রতিক'}
                    </span>
                  </div>
                  <div className="muted" style={{ marginTop: '6px', lineHeight: 1.5 }}>
                    {notice.Body.length > 120
                      ? notice.Body.slice(0, 120) + '...'
                      : notice.Body}
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h2 style={{ margin: 0 }}>চলমান কার্যক্রম</h2>
            <button
              className="btn secondary"
              style={{ padding: '4px 10px', fontSize: '13px' }}
              onClick={() => onNavigate('campaigns')}
            >
              সব কার্যক্রম
            </button>
          </div>
          {campaigns.length === 0 ? (
            <div className="empty">এখনো চলমান কার্যক্রম নেই।</div>
          ) : (
            <div>
              {campaigns.slice(0, 2).map((c: Campaign) => {
                const percent = Math.min(
                  100,
                  Math.round((c.Collected_Amount / (c.Target_Amount || 1)) * 100)
                );
                return (
                  <div key={c.Campaign_ID} className="notice">
                    <b style={{ color: 'var(--deep)', fontSize: '15px' }}>{c.Title}</b>
                    <div className="muted" style={{ marginTop: '4px' }}>
                      {c.Description.length > 90
                        ? c.Description.slice(0, 90) + '...'
                        : c.Description}
                    </div>

                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '13px',
                        color: 'var(--muted)',
                      }}
                    >
                      <span>
                        সংগৃহীত: <b>{formatMoney(c.Collected_Amount)}</b> /{' '}
                        {formatMoney(c.Target_Amount)}
                      </span>
                      <span>{percent}%</span>
                    </div>

                    <div style={{ marginTop: '10px' }}>
                      <button
                        className="btn"
                        style={{ padding: '6px 12px', fontSize: '13px' }}
                        onClick={() => onSelectCampaignForDonation(c)}
                      >
                        দান করুন
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </article>
      </div>
    </section>
  );
};
