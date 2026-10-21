import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeSection } from './components/HomeSection';
import { NoticesSection } from './components/NoticesSection';
import { CampaignsSection } from './components/CampaignsSection';
import { PrayerCommitteeSection } from './components/PrayerCommitteeSection';
import { AdminSection } from './components/AdminSection';
import { Footer } from './components/Footer';
import { mosqueStorage } from './services/storage';
import { PublicData, Campaign, PrayerTime, CommitteeMember } from './types';

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

        {activeSection === 'notices' && (
          <NoticesSection notices={publicData.notices} />
        )}

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
      </main>

      <Footer />
    </div>
  );
};

export default App;
