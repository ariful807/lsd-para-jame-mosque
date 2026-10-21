import React from 'react';

interface FooterProps {
  onNavigate?: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const links = [
    { id: 'donation', label: 'দান কার্যক্রম' },
    { id: 'financials', label: 'আয়-ব্যয় হিসাব' },
    { id: 'notices', label: 'নোটিশ বোর্ড' },
    { id: 'contact', label: 'যোগাযোগ' },
  ];

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="footer-brand"><span aria-hidden="true">☪</span> এলএসডি পাড়া জামে মসজিদ</div>
          <p>পুরাতন রেলওয়ে স্টেশন, নীলফামারী, বাংলাদেশ</p>
          <p className="footer-note">আমানত, স্বচ্ছতা ও সেবার অঙ্গীকার</p>
        </div>
        <div>
          <h3>দ্রুত লিংক</h3>
          <div className="footer-links">
            {links.map((link) => (
              <button key={link.id} onClick={() => onNavigate?.(link.id)}>{link.label}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} এলএসডি পাড়া জামে মসজিদ — সর্বস্বত্ব সংরক্ষিত</span>
        <span>স্বচ্ছ হিসাব • নিরাপদ দান • সম্মিলিত সেবা</span>
      </div>
    </footer>
  );
};
