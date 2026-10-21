import React from 'react';
import { PrayerTime, CommitteeMember } from '../types';

interface PrayerCommitteeProps {
  prayerTimes: PrayerTime;
  committee: CommitteeMember[];
}

export const PrayerCommitteeSection: React.FC<PrayerCommitteeProps> = ({
  prayerTimes,
  committee,
}) => {
  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <section className="panel">
        <h2>নামাজের সময়সূচি (এলএসডি পাড়া জামে মসজিদ)</h2>
        <p className="muted" style={{ margin: '0 0 16px' }}>
          সময় জোন: Asia/Dhaka • {prayerTimes.Date}
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '12px',
          }}
        >
          <div
            style={{
              background: '#f4f9f6',
              border: '1px solid var(--line)',
              borderRadius: '12px',
              padding: '14px',
              textAlign: 'center',
            }}
          >
            <div style={{ color: 'var(--muted)', fontSize: '13px' }}>ফজর (Fajr)</div>
            <strong style={{ display: 'block', color: 'var(--deep)', fontSize: '20px', marginTop: '4px' }}>
              {prayerTimes.Fajr}
            </strong>
          </div>

          <div
            style={{
              background: '#fcf8ec',
              border: '1px solid #faeecd',
              borderRadius: '12px',
              padding: '14px',
              textAlign: 'center',
            }}
          >
            <div style={{ color: '#9c7310', fontSize: '13px' }}>সূর্যোদয় (Sunrise)</div>
            <strong style={{ display: 'block', color: '#805d09', fontSize: '20px', marginTop: '4px' }}>
              {prayerTimes.Sunrise}
            </strong>
          </div>

          <div
            style={{
              background: '#f4f9f6',
              border: '1px solid var(--line)',
              borderRadius: '12px',
              padding: '14px',
              textAlign: 'center',
            }}
          >
            <div style={{ color: 'var(--muted)', fontSize: '13px' }}>যোহর (Dhuhr)</div>
            <strong style={{ display: 'block', color: 'var(--deep)', fontSize: '20px', marginTop: '4px' }}>
              {prayerTimes.Dhuhr}
            </strong>
          </div>

          <div
            style={{
              background: '#f4f9f6',
              border: '1px solid var(--line)',
              borderRadius: '12px',
              padding: '14px',
              textAlign: 'center',
            }}
          >
            <div style={{ color: 'var(--muted)', fontSize: '13px' }}>আসর (Asr)</div>
            <strong style={{ display: 'block', color: 'var(--deep)', fontSize: '20px', marginTop: '4px' }}>
              {prayerTimes.Asr}
            </strong>
          </div>

          <div
            style={{
              background: '#f4f9f6',
              border: '1px solid var(--line)',
              borderRadius: '12px',
              padding: '14px',
              textAlign: 'center',
            }}
          >
            <div style={{ color: 'var(--muted)', fontSize: '13px' }}>মাগরিব (Maghrib)</div>
            <strong style={{ display: 'block', color: 'var(--deep)', fontSize: '20px', marginTop: '4px' }}>
              {prayerTimes.Maghrib}
            </strong>
          </div>

          <div
            style={{
              background: '#f4f9f6',
              border: '1px solid var(--line)',
              borderRadius: '12px',
              padding: '14px',
              textAlign: 'center',
            }}
          >
            <div style={{ color: 'var(--muted)', fontSize: '13px' }}>এশা (Isha)</div>
            <strong style={{ display: 'block', color: 'var(--deep)', fontSize: '20px', marginTop: '4px' }}>
              {prayerTimes.Isha}
            </strong>
          </div>
        </div>

        <div style={{ marginTop: '14px', textAlign: 'right' }}>
          <small className="muted">জুমার জামাত: দুপুর ১:৩০ মি. (খুতবা: দুপুর ১:১৫ মি.)</small>
        </div>
      </section>

      <section className="panel">
        <h2>মসজিদ পরিচালনা কমিটি</h2>
        <p className="muted" style={{ margin: '0 0 16px' }}>
          এলএসডি পাড়া জামে মসজিদ, পুরাতন রেলওয়ে স্টেশন এলাকা, নীলফামারী
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '14px',
          }}
        >
          {committee.map((member) => (
            <div
              key={member.Committee_ID}
              style={{
                border: '1px solid var(--line)',
                borderRadius: '12px',
                padding: '16px',
                background: '#fafcfa',
              }}
            >
              <span
                style={{
                  fontSize: '12px',
                  background: '#e0efe7',
                  color: 'var(--deep)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontWeight: 600,
                }}
              >
                {member.Position}
              </span>
              <h4 style={{ margin: '8px 0 4px', color: 'var(--deep)', fontSize: '16px' }}>
                {member.Name}
              </h4>
              <div className="muted" style={{ fontSize: '14px' }}>
                📞 {member.Phone_Public}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
