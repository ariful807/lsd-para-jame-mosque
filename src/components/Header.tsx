import React from 'react';

interface HeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeSection, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'হোম' },
    { id: 'about', label: 'মসজিদ সম্পর্কে' },
    { id: 'donation', label: 'দান কার্যক্রম' },
    { id: 'financials', label: 'আয়-ব্যয়' },
    { id: 'contributions', label: 'মাসিক চাঁদা' },
    { id: 'notices', label: 'নোটিশ' },
    { id: 'prayer_committee', label: 'নামাজ ও কমিটি' },
    { id: 'events', label: 'ইভেন্ট' },
    { id: 'gallery', label: 'গ্যালারি' },
    { id: 'contact', label: 'যোগাযোগ' },
    { id: 'admin', label: 'লগইন' },
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="brand-lockup" onClick={() => onNavigate('home')} aria-label="হোম পেজে যান">
          <span className="brand-mark" aria-hidden="true">☪</span>
          <span>
            <span className="brand">এলএসডি পাড়া জামে মসজিদ</span>
            <span className="brand-subtitle">পুরাতন রেলওয়ে স্টেশন, নীলফামারী</span>
          </span>
        </button>
        <div className="header-promise">আমানতদারি <span>•</span> স্বচ্ছতা <span>•</span> মুসলিম ঐক্য</div>
      </div>
      <nav className="nav" aria-label="প্রধান নেভিগেশন">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={activeSection === item.id ? 'active' : ''}
            onClick={() => onNavigate(item.id)}
            aria-current={activeSection === item.id ? 'page' : undefined}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
};
