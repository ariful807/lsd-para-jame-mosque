import React from 'react';

interface HeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeSection, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'হোম' },
    { id: 'about', label: 'মসজিদ সম্পর্কে' },
    { id: 'donation', label: 'দান' },
    { id: 'financials', label: 'আয়-ব্যয়' },
    { id: 'contributions', label: 'মাসিক চাঁদা' },
    { id: 'notices', label: 'নোটিশ' },
    { id: 'prayer_committee', label: 'নামাজ ও কমিটি' },
    { id: 'events', label: 'ইভেন্ট' },
    { id: 'gallery', label: 'গ্যালারি' },
    { id: 'contact', label: 'যোগাযোগ' },
    { id: 'admin', label: 'লগইন / রেজিস্টার' },
  ];

  return (
    <header>
      <div className="brand">☪ এলএসডি পাড়া জামে মসজিদ</div>
      <p>পুরাতন রেলওয়ে স্টেশন, নীলফামারী • স্বচ্ছতা • আমানতদারি • মুসলিম ঐক্য</p>
      <nav className="nav" aria-label="Main Navigation">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={activeSection === item.id ? 'active' : ''}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
};
