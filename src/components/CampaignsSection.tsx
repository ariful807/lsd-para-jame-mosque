import React, { useState } from 'react';
import { Campaign } from '../types';
import { formatMoney } from '../services/storage';

interface CampaignsSectionProps {
  campaigns: Campaign[];
  activeDonationCampaign: Campaign | null;
  onOpenDonationModal: (campaign: Campaign | null) => void;
  onCloseDonationModal: () => void;
  onSubmitDonation: (data: {
    Donor_Name: string;
    Phone: string;
    Amount: number;
    Purpose: string;
    Payment_Method: string;
  }) => void;
}

export const CampaignsSection: React.FC<CampaignsSectionProps> = ({
  campaigns,
  activeDonationCampaign,
  onOpenDonationModal,
  onCloseDonationModal,
  onSubmitDonation,
}) => {
  const [donorName, setDonorName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState<string>('1000');
  const [method, setMethod] = useState('bKash (বিকাশ)');
  const [purpose, setPurpose] = useState('');
  const [submittedReceipt, setSubmittedReceipt] = useState<{
    id: string;
    donor: string;
    amount: number;
    purpose: string;
    date: string;
  } | null>(null);

  const handleOpenDonate = (campaign: Campaign | null) => {
    onOpenDonationModal(campaign);
    setPurpose(campaign ? campaign.Title : 'সাধারণ মসজিদ তহবিল');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) return;

    onSubmitDonation({
      Donor_Name: donorName.trim() || 'নাম প্রকাশে অনিচ্ছুক',
      Phone: phone.trim() || 'প্রযোজ্য নয়',
      Amount: numAmount,
      Purpose: purpose || 'মসজিদের সার্বিক তহবিল',
      Payment_Method: method,
    });

    setSubmittedReceipt({
      id: `RCP-${Math.floor(100000 + Math.random() * 900000)}`,
      donor: donorName.trim() || 'নাম প্রকাশে অনিচ্ছুক',
      amount: numAmount,
      purpose: purpose || 'মসজিদের সার্বিক তহবিল',
      date: new Date().toLocaleDateString('bn-BD'),
    });
  };

  const handleDone = () => {
    setSubmittedReceipt(null);
    onCloseDonationModal();
    setDonorName('');
    setPhone('');
    setAmount('1000');
  };

  return (
    <section id="campaigns" className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: '0 0 6px' }}>অনুদান ও চলমান কার্যক্রম</h2>
          <p className="muted" style={{ margin: 0 }}>
            অনলাইনে পেমেন্ট গ্রহণ চালু করার আগে অনুমোদিত মার্চেন্ট ও সার্ভার-সাইড পেমেন্ট যাচাই সংযুক্ত করতে হবে।
          </p>
        </div>
        <button className="btn" onClick={() => handleOpenDonate(null)}>
          + সাধারণ অনুদান দিন
        </button>
      </div>

      <div style={{ marginTop: '24px', display: 'grid', gap: '20px' }}>
        {campaigns.length === 0 ? (
          <div className="empty">বর্তমানে কোনো সক্রিয় অনুদান কার্যক্রম নেই।</div>
        ) : (
          campaigns.map((camp) => {
            const percent = Math.min(
              100,
              Math.round((camp.Collected_Amount / (camp.Target_Amount || 1)) * 100)
            );
            const isCompleted = camp.Status === 'Completed' || camp.Collected_Amount >= camp.Target_Amount;

            return (
              <div
                key={camp.Campaign_ID}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--line)',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 4px 15px rgba(18, 51, 34, 0.04)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <h3 style={{ margin: 0, color: 'var(--deep)', fontSize: '18px' }}>
                    {camp.Title}
                  </h3>
                  <span
                    className={`badge ${
                      camp.Status === 'Active' ? 'active' : 'approved'
                    }`}
                  >
                    {camp.Status === 'Active' ? 'চলমান প্রকল্প' : 'সম্পন্ন হয়েছে'}
                  </span>
                </div>

                <p style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: 1.6, margin: '10px 0 16px' }}>
                  {camp.Description}
                </p>

                <div className="progress-bar-bg" style={{ height: '12px' }}>
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
                    flexWrap: 'wrap',
                    gap: '10px',
                    margin: '12px 0 16px',
                    fontSize: '14px',
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--muted)' }}>সংগৃহীত: </span>
                    <strong style={{ color: 'var(--green)', fontSize: '16px' }}>
                      {formatMoney(camp.Collected_Amount)}
                    </strong>
                    <span style={{ color: 'var(--muted)', marginLeft: '8px' }}>
                      (লক্ষ্যমাত্রা: {formatMoney(camp.Target_Amount)})
                    </span>
                  </div>
                  <div>
                    <span
                      style={{
                        background: '#edf5ee',
                        color: 'var(--deep)',
                        fontWeight: '700',
                        padding: '3px 10px',
                        borderRadius: '10px',
                      }}
                    >
                      {percent}% সম্পন্ন
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <span className="muted" style={{ fontSize: '13px' }}>
                    মেয়াদ: {camp.Start_Date} হতে {camp.End_Date} পর্যন্ত
                  </span>
                  {!isCompleted && (
                    <button
                      className="btn"
                      onClick={() => handleOpenDonate(camp)}
                    >
                      এই প্রকল্পে দান করুন
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {activeDonationCampaign !== undefined && activeDonationCampaign !== null && (
        <div className="modal-backdrop" onClick={onCloseDonationModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            {submittedReceipt ? (
              <div>
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ fontSize: '48px', color: 'var(--green)' }}>✓</div>
                  <h3 style={{ color: 'var(--deep)', margin: '8px 0' }}>
                    জাযাকাল্লাহু খাইরান!
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
                    আপনার অনুদানের তথ্য সফলভাবে সংরক্ষিত হয়েছে।
                  </p>
                </div>

                <div
                  style={{
                    background: '#f7faf7',
                    border: '1px dashed var(--green)',
                    borderRadius: '12px',
                    padding: '16px',
                    margin: '16px 0',
                    fontSize: '14px',
                    lineHeight: 1.8,
                  }}
                >
                  <div><strong>রসিদ ট্র্যাকিং নং:</strong> {submittedReceipt.id}</div>
                  <div><strong>দানকারী:</strong> {submittedReceipt.donor}</div>
                  <div><strong>খাত:</strong> {submittedReceipt.purpose}</div>
                  <div><strong>পরিমাণ:</strong> {formatMoney(submittedReceipt.amount)}</div>
                  <div><strong>তারিখ:</strong> {submittedReceipt.date}</div>
                  <div><strong>প্রতিষ্ঠান:</strong> এলএসডি পাড়া জামে মসজিদ, নীলফামারী</div>
                </div>

                <div className="message" style={{ fontSize: '13px' }}>
                  মসজিদ তহবিল পর্যালোচনার পর কোষাধ্যক্ষ কর্তৃক এটি চূড়ান্ত অনুমোদন করা হবে।
                </div>

                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                  <button className="btn" onClick={handleDone}>
                    সম্পন্ন করুন
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '14px',
                    borderBottom: '1px solid var(--line)',
                    paddingBottom: '10px',
                  }}
                >
                  <h3 style={{ margin: 0, color: 'var(--deep)' }}>
                    মসজিদে অনুদান প্রদান
                  </h3>
                  <button
                    type="button"
                    className="btn secondary"
                    style={{ padding: '4px 8px', fontSize: '12px' }}
                    onClick={onCloseDonationModal}
                  >
                    ✕
                  </button>
                </div>

                <div className="message" style={{ fontSize: '13px', margin: '0 0 14px' }}>
                  ⚠️ <b>পেমেন্ট নীতি:</b> অনলাইনে সরাসরি অটো-গেflight চালু করার পূর্বে অনুমোদিত মার্চেন্ট ও ভেরিফায়েড গেটওয়ে আবশ্যক। নিচে আপনার প্রতিশ্রুতি বা ট্রানজ্যাকশন আইডি এন্ট্রি করুন।
                </div>

                <div className="formrow">
                  <label>উদ্দেশ্য / ফান্ড:</label>
                  <input
                    type="text"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    required
                  />
                </div>

                <div className="formrow">
                  <label>দানকারীর নাম (ঐচ্ছিক):</label>
                  <input
                    type="text"
                    placeholder="উদাঃ মোঃ আব্দুল্লাহ (খালি রাখলে গোপন রাখা হবে)"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                  />
                </div>

                <div className="formrow">
                  <label>মোবাইল নম্বর (যোগাযোগের জন্য):</label>
                  <input
                    type="tel"
                    placeholder="০১৭১১-XXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="formrow">
                  <label>অনুদানের পরিমাণ (টাকা):</label>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="formrow">
                  <label>পেমেন্ট মাধ্যম:</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                  >
                    <option value="bKash (বিকাশ)">bKash (বিকাশ মার্চেন্ট/পার্সোনাল)</option>
                    <option value="Nagad (নগদ)">Nagad (নগদ)</option>
                    <option value="Rocket (রকেট)">Rocket (রকেট)</option>
                    <option value="Bank Transfer (ব্যাংক)">ব্যাংক হিসাব (সরাসরি জমা)</option>
                    <option value="নগদ (ক্যাশ)">মসজিদের দানবাক্স / কোষাধ্যক্ষের নিকট নগদ</option>
                  </select>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '10px',
                    marginTop: '20px',
                  }}
                >
                  <button
                    type="button"
                    className="btn secondary"
                    onClick={onCloseDonationModal}
                  >
                    বাতিল
                  </button>
                  <button type="submit" className="btn">
                    অনুদান নিশ্চিত করুন
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
