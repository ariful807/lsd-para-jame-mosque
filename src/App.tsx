import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeSection } from './components/HomeSection';
import { NoticesSection } from './components/NoticesSection';
import { CampaignsSection } from './components/CampaignsSection';
import { PrayerCommitteeSection } from './components/PrayerCommitteeSection';
import { AdminSection } from './components/AdminSection';
import { Footer } from './components/Footer';
import { mosqueStorage, formatMoney } from './services/storage';
import { PublicData, Campaign, PrayerTime, CommitteeMember } from './types';

const sectionStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #dce7df',
  borderRadius: '18px',
  padding: '24px',
  boxShadow: '0 10px 30px rgba(18, 51, 34, 0.04)',
  marginTop: '18px',
};

export const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [publicData, setPublicData] = useState<PublicData>(() => mosqueStorage.getPublicData());
  const [activeDonationCampaign, setActiveDonationCampaign] = useState<Campaign | null | undefined>(undefined);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime>(() =>
    mosqueStorage.getSheet<PrayerTime>('Prayer_Times')[0] || {
      Date: 'আজকের সময়সূচি (Asia/Dhaka)',
      Fajr: '০৪:৪৮ মি.',
      Sunrise: '০৬:০৩ মি.',
      Dhuhr: '১২:০৮ মি.',
      Asr: '০৪:২৯ মি.',
      Maghrib: '০৬:১২ মি.',
      Isha: '০৭:২৭ মি.',
      Updated_At: new Date().toISOString(),
    }
  );
  const [committee, setCommittee] = useState<CommitteeMember[]>(() =>
    mosqueStorage.getSheet<CommitteeMember>('Committee')
  );

  const refreshAllData = () => {
    const data = mosqueStorage.getPublicData();
    setPublicData(data);
    const pTimes = mosqueStorage.getSheet<PrayerTime>('Prayer_Times')[0];
    if (pTimes) setPrayerTimes(pTimes);
    setCommittee(mosqueStorage.getSheet<CommitteeMember>('Committee'));
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCampaignForDonation = (campaign: Campaign) => {
    setActiveSection('campaigns');
    setActiveDonationCampaign(campaign);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitDonation = (donationData: {
    Donor_Name: string;
    Phone: string;
    Amount: number;
    Purpose: string;
    Payment_Method: string;
  }) => {
    mosqueStorage.addPublicDonation({
      ...donationData,
      Status: 'Approved',
      Received_By: 'অনলাইন পোর্টাল',
    });
    refreshAllData();
  };

  const renderCustomSection = () => {
    switch (activeSection) {
      case 'about':
        return (
          <section style={sectionStyle}>
            <h2 style={{ marginTop: 0, color: '#083d30' }}>মসজিদ সম্পর্কে</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
              <div>
                <p style={{ color: '#687970', lineHeight: 1.8 }}>
                  এলএসডি পাড়া জামে মসজিদ একটি ঐক্যবদ্ধ মুসলিম কমিউনিটি কেন্দ্র। এখানে নামাজ,
                  শিক্ষা, সামাজিক দায়িত্ব, দান, সামাজিক সংহতি, অনুদান সংগ্রহ ও খোলা আয়-ব্যয়ের
                  transparence বজায় রাখার ওপর গুরুত্ব দেওয়া হয়।
                </p>
              </div>
              <div>
                <p style={{ color: '#687970', lineHeight: 1.8 }}>
                  <strong style={{ color: '#0d5e46' }}>ঠিকানা:</strong> পুরাতন রেলওয়ে স্টেশন,
                  নীলফামারী, বাংলাদেশ<br />
                  <strong style={{ color: '#0d5e46' }}>ভাষা:</strong> বাংলা (প্রধান), English (ঐচ্ছিক)
                </p>
              </div>
            </div>
          </section>
        );
      case 'donation':
        return (
          <CampaignsSection
            campaigns={publicData.campaigns}
            activeDonationCampaign={activeDonationCampaign ?? null}
            onOpenDonationModal={(camp) => setActiveDonationCampaign(camp)}
            onCloseDonationModal={() => setActiveDonationCampaign(undefined)}
            onSubmitDonation={handleSubmitDonation}
          />
        );
      case 'financials':
        return (
          <section style={sectionStyle}>
            <h2 style={{ marginTop: 0, color: '#083d30' }}>আয়-ব্যয় ও স্বচ্ছ হিসাব</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              <div className="stat">
                <small>মোট আয়</small>
                <strong>{formatMoney(publicData.summary.income)}</strong>
              </div>
              <div className="stat">
                <small>অনুদান</small>
                <strong>{formatMoney(publicData.summary.donations)}</strong>
              </div>
              <div className="stat">
                <small>মোট ব্যয়</small>
                <strong>{formatMoney(publicData.summary.expenses)}</strong>
              </div>
              <div className="stat">
                <small>ব্যালেন্স</small>
                <strong>{formatMoney(publicData.summary.balance)}</strong>
              </div>
            </div>
          </section>
        );
      case 'contributions':
        return (
          <section style={sectionStyle}>
            <h2 style={{ marginTop: 0, color: '#083d30' }}>মাসিক চাঁদা ও সদস্য ব্যবস্থাপনা</h2>
            <p style={{ color: '#687970', lineHeight: 1.8 }}>
              মাসিক চাঁদা, বিশেষ তহবিল, নির্মাণ ভর্তুকি ও সদস্যভিত্তিক সংগ্রহের তথ্য সুনির্দিষ্টভাবে
              ব্যবস্থাপনা করা হয়। প্রশাসকের ড্যাশবোর্ডে সদস্য, চাঁদা, জমা ও বকেয়া যাচাই করা যায়।
            </p>
            <div className="message">
              জন্য: মাসিক চাঁদা, নির্মাণ তহবিল, বকেয়া, অনলাইন/নগদ জমা, ভেরিফিকেশন, রসিদ তৈরি ও
              প্রতিবেদন।
            </div>
          </section>
        );
      case 'events':
        return (
          <section style={sectionStyle}>
            <h2 style={{ marginTop: 0, color: '#083d30' }}>ইভেন্ট ও ধর্মীয় কার্যক্রম</h2>
            <ul style={{ color: '#687970', lineHeight: 2, paddingLeft: '20px' }}>
              <li>রমজান তা’মীর, ইফতার ও তারাবীহ</li>
              <li>জুমার খুতবা ও বিশেষ দোয়া</li>
              <li>কুরআন শিক্ষা ও হিফজ ক্লাস</li>
              <li>ঈদ জামাত ও বিশেষ উপলক্ষে সভা</li>
              <li>মসজিদ রক্ষণাবেক্ষণ ও সংস্কার কার্যক্রম</li>
            </ul>
          </section>
        );
      case 'gallery':
        return (
          <section style={sectionStyle}>
            <h2 style={{ marginTop: 0, color: '#083d30' }}>গ্যালারি ও ছবি</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
              {['মসজিদ দৃশ্য', 'নামাজের মজলিস', 'চাঁদার সংগ্রহ', 'সামাজিক সভা', 'ইফতার', 'সংস্কার কাজ'].map((item) => (
                <div key={item} style={{ background: '#f7faf7', border: '1px solid #dce7df', borderRadius: '12px', padding: '18px', textAlign: 'center', color: '#083d30', fontWeight: 700 }}>
                  {item}
                </div>
              ))}
            </div>
          </section>
        );
      case 'contact':
        return (
          <section style={sectionStyle}>
            <h2 style={{ marginTop: 0, color: '#083d30' }}>যোগাযোগ</h2>
            <p style={{ color: '#687970', lineHeight: 1.8 }}>
              <strong style={{ color: '#0d5e46' }}>মসজিদ:</strong> এলএসডি পাড়া জামে মসজিদ<br />
              <strong style={{ color: '#0d5e46' }}>ঠিকানা:</strong> পুরাতন রেলওয়ে স্টেশন, নীলফামারী,<br />
              বাংলাদেশ<br />
              <strong style={{ color: '#0d5e46' }}>নির্দেশ:</strong> ফোন, ইমেইল, ব্যাংক/পেমেন্ট তথ্য
              প্রশাসক প্যানেল থেকে কনফিগার করুন।
            </p>
          </section>
        );
      case 'login':
        return (
          <section style={sectionStyle}>
            <h2 style={{ marginTop: 0, color: '#083d30' }}>লগইন / রেজিস্টার</h2>
            <div className="message">
              সদস্য, দাতা, অডিটিং ও প্রশাসকের জন্য নিরাপদ লগইন সিস্টেম, সদস্য নিবন্ধন ও ভেরিফিকেশন
              সেটআপ করা আছে। বাস্তব 인증ের জন্য প্রশাসক প্যানেল থেকে সেটিংস কনফিগার করুন।
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Header activeSection={activeSection} onNavigate={handleNavigate} />

      <main className="wrap">
        {activeSection === 'home' && (
          <HomeSection
            publicData={publicData}
            onNavigate={handleNavigate}
            onSelectCampaignForDonation={handleSelectCampaignForDonation}
          />
        )}

        {activeSection === 'notices' && <NoticesSection notices={publicData.notices} />}

        {activeSection === 'campaigns' && (
          <CampaignsSection
            campaigns={publicData.campaigns}
            activeDonationCampaign={activeDonationCampaign ?? null}
            onOpenDonationModal={(camp) => setActiveDonationCampaign(camp)}
            onCloseDonationModal={() => setActiveDonationCampaign(undefined)}
            onSubmitDonation={handleSubmitDonation}
          />
        )}

        {activeSection === 'prayer_committee' && (
          <PrayerCommitteeSection
            prayerTimes={prayerTimes}
            committee={committee}
          />
        )}

        {activeSection === 'admin' && (
          <AdminSection onDataChanged={refreshAllData} />
        )}

        {['about', 'donation', 'financials', 'contributions', 'events', 'gallery', 'contact', 'login'].includes(activeSection) && renderCustomSection()}
      </main>

      <Footer />
    </div>
  );
};

export default App;
