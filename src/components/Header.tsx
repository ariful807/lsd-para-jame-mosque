import React from 'react';

interface HeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeSection, onNavigate }) => {
  return (
    <header>
      <div className="brand">☪ এলএসডি পাড়া জামে মসজিদ</div>
      <p>ইসলামিক শিক্ষা • স্বচ্ছ হিসাব • ঐক্যবদ্ধ সমাজ</p>
      <nav className="nav" aria-label="Main Navigation">
        <button
          className={activeSection === 'home' ? 'active' : ''}
          onClick={() => onNavigate('home')}
        >
          হোম
        </button>
        <button
          className={activeSection === 'notices' ? 'active' : ''}
          onClick={() => onNavigate('notices')}
        >
          নোটিশ
        </button>
        <button
          className={activeSection === 'campaigns' ? 'active' : ''}
          onClick={() => onNavigate('campaigns')}
        >
          অনুদান কার্যক্রম
        </button>
        <button
          className={activeSection === 'prayer_committee' ? 'active' : ''}
          onClick={() => onNavigate('prayer_committee')}
        >
          নামাজ ও কমিটি
        </button>
        <button
          className={activeSection === 'admin' ? 'active' : ''}
          onClick={() => onNavigate('admin')}
        >
          অ্যাডমিন
        </button>
      </nav>
    </header>
  );
};
