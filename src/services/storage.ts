import {
  Member,
  Contribution,
  Donation,
  Expense,
  Income,
  Notice,
  Campaign,
  Project,
  PrayerTime,
  CommitteeMember,
  AuditLog,
  PublicData,
} from '../types';

const STORAGE_KEY_PREFIX = 'lsd_mosque_';

// Initial realistic seed data for LSD Para Jame Mosque, Nilphamari
const INITIAL_MEMBERS: Member[] = [
  {
    Member_ID: 'MEM-001',
    Name: 'মাওলানা মোঃ আব্দুর রহিম',
    Phone: '01711-234567',
    Email: 'rahim.imam@gmail.com',
    Address: 'পুরাতন রেলওয়ে স্টেশন সংলগ্ন, নীলফামারী সদর',
    Join_Date: '2020-01-15',
    Status: 'Active',
    Role: 'Committee',
    Created_At: new Date(Date.now() - 90 * 86400000).toISOString(),
  },
  {
    Member_ID: 'MEM-002',
    Name: 'আলহাজ্ব মোঃ তৌফিকুল ইসলাম',
    Phone: '01819-876543',
    Email: 'towfiq.trade@gmail.com',
    Address: 'স্টেশন রোড, নীলফামারী',
    Join_Date: '2019-03-10',
    Status: 'Active',
    Role: 'Committee',
    Created_At: new Date(Date.now() - 85 * 86400000).toISOString(),
  },
  {
    Member_ID: 'MEM-003',
    Name: 'মোঃ শফিকুল আলম খোকন',
    Phone: '01722-334455',
    Email: 'shafiq.khokon@gmail.com',
    Address: 'এলএসডি পাড়া, ৩নং ওয়ার্ড, নীলফামারী',
    Join_Date: '2021-06-20',
    Status: 'Active',
    Role: 'Life',
    Created_At: new Date(Date.now() - 70 * 86400000).toISOString(),
  },
  {
    Member_ID: 'MEM-004',
    Name: 'প্রকৌশলী হাসান মাহমুদ',
    Phone: '01912-998877',
    Email: 'hasan.engr@gmail.com',
    Address: 'কলেজ রোড, নীলফামারী',
    Join_Date: '2022-02-01',
    Status: 'Active',
    Role: 'General',
    Created_At: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  {
    Member_ID: 'MEM-005',
    Name: 'হাজী বশির উদ্দিন আহমেদ',
    Phone: '01733-445566',
    Email: 'bashir.ahmed@gmail.com',
    Address: 'এলএসডি পাড়া বাজার এলাকা, নীলফামারী',
    Join_Date: '2018-11-12',
    Status: 'Active',
    Role: 'Donor',
    Created_At: new Date(Date.now() - 50 * 86400000).toISOString(),
  },
];

const INITIAL_NOTICES: Notice[] = [
  {
    Notice_ID: 'NOT-101',
    Title: 'পবিত্র মাহে রমজানের তারাবীহ নামাজ ও ইফতার মাহফিল সংক্রান্ত',
    Body: 'পবিত্র রমজান উপলক্ষে প্রতিদিন বাদ এশা খতম তারাবীহ নামাজ অনুষ্ঠিত হবে। হাফেজ মাওলানা মোঃ হাফিজুর রহমান তারাবীহ নামাজে ইমামতি করবেন। প্রতিদিন আসরের পর তাফসিরুল কুরআন আলোচনা এবং মাগরিবের পূর্বে সর্বসাধারণের জন্য গণ-ইফতারের আয়োজন থাকবে। সকল মুসল্লিকে অংশগ্রহণের অনুরোধ রইল।',
    Publish_Date: '২০২৬-০৩-১০',
    Status: 'Published',
    Created_By: 'ajariful520@gmail.com',
    Created_At: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    Notice_ID: 'NOT-102',
    Title: 'মসজিদের দ্বিতীয় তলা সম্প্রসারণ কাজের বিশেষ অগ্রগতি ও হিসাব বিবরণী',
    Body: 'আলহামদুলিল্লাহ, এলএসডি পাড়া জামে মসজিদের দ্বিতীয় তলার ছাদ ঢালাইয়ের কাজ সফলভাবে সম্পন্ন হয়েছে। এ পর্যন্ত সংগৃহীত অনুদান ও ব্যয়ের পূর্ণাঙ্গ হিসাব মসজিদের নোটিশ বোর্ড ও এই অনলাইন পোর্টালে প্রকাশ করা হয়েছে। অবশিষ্ট প্লাস্টার ও টাইলস কাজের জন্য মুসল্লি ভাইদের আন্তরিক দান কামনা করছি।',
    Publish_Date: '২০২৬-০৩-০২',
    Status: 'Published',
    Created_By: 'ajariful520@gmail.com',
    Created_At: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    Notice_ID: 'NOT-103',
    Title: 'ফ্রি কুরআন শিক্ষা ও হিফজুল কুরআন বিভাগ চালু প্রসঙ্গে',
    Body: 'মসজিদ কমিটির উদ্যোগে সকাল ৬:০০ টা থেকে ৭:০০ টা পর্যন্ত শিশু-কিশোর ও বয়স্কদের জন্য বিশুদ্ধ কুরআন তিলাওয়াত প্রশিক্ষণ শুরু হচ্ছে। আগ্রহী অভিভাবকগণ ইমাম সাহেবের সাথে যোগাযোগ করে নাম তালিকাভুক্ত করার জন্য অনুরোধ করা যাচ্ছে।',
    Publish_Date: '২০২৬-০২-১৮',
    Status: 'Published',
    Created_By: 'ajariful520@gmail.com',
    Created_At: new Date(Date.now() - 35 * 86400000).toISOString(),
  },
];

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    Campaign_ID: 'CMP-201',
    Title: 'মসজিদের দ্বিতীয় তলার অভ্যন্তরীণ ফিনিশিং ও টাইলস প্রকল্প',
    Description: 'জুমার নামাজে ক্রমবর্ধমান মুসল্লিদের স্থান সংকুলান নিরসনে দ্বিতীয় তলার মেঝের মার্বেল টাইলস ও দেয়াল পেইন্টিংয়ের কার্যক্রম শুরু হয়েছে। এতে আনুমানিক ৪,০০,০০০ টাকা প্রয়োজন। সাদাকায়ে জারিয়ার উদ্দেশ্যে এগিয়ে আসুন।',
    Target_Amount: 400000,
    Collected_Amount: 265000,
    Start_Date: '2026-02-01',
    End_Date: '2026-04-30',
    Status: 'Active',
    Created_At: new Date(Date.now() - 40 * 86400000).toISOString(),
  },
  {
    Campaign_ID: 'CMP-202',
    Title: 'আধুনিক ওজুখানা সংস্কার ও সুপেয় পানির ফিল্টার স্থাপন',
    Description: 'মসজিদে আগত মুসল্লি ও বিশেষ চাহিদাসম্পন্ন ব্যক্তিবর্গের সুবিধার্থে নতুন ওজুখানা এবং হাইজিন ওয়াশরুম কমপ্লেক্স সংস্কার প্রকল্প। সাথে স্বয়ংক্রিয় গভীর নলকূপ ও ওয়াটার পিউরিফায়ার স্থাপন করা হবে।',
    Target_Amount: 180000,
    Collected_Amount: 125000,
    Start_Date: '2026-01-15',
    End_Date: '2026-03-31',
    Status: 'Active',
    Created_At: new Date(Date.now() - 55 * 86400000).toISOString(),
  },
  {
    Campaign_ID: 'CMP-203',
    Title: 'সৌরবিদ্যুৎ (সোলার প্যানেল) ও সার্বক্ষণিক আইপিএস ব্যবস্থা',
    Description: 'গ্রীষ্মকালে নিরবচ্ছিন্ন বিদ্যুৎ ও ফ্যান-লাইটের জন্য মসজিদের ছাদে ১০ কিলোওয়াট ক্ষমতার সোলার সিস্টেম স্থাপন প্রকল্প সম্পন্ন হয়েছে।',
    Target_Amount: 150000,
    Collected_Amount: 150000,
    Start_Date: '2025-11-01',
    End_Date: '2026-01-10',
    Status: 'Completed',
    Created_At: new Date(Date.now() - 100 * 86400000).toISOString(),
  },
];

const INITIAL_DONATIONS: Donation[] = [
  {
    Donation_ID: 'DON-001',
    Donor_Name: 'হাজী বশির উদ্দিন আহমেদ',
    Phone: '01733-445566',
    Amount: 50000,
    Purpose: 'দ্বিতীয় তলার ফিনিশিং ফান্ড',
    Payment_Method: 'ব্যাংক স্থানান্তর',
    Status: 'Approved',
    Received_By: 'আলহাজ্ব মোঃ তৌফিকুল ইসলাম',
    Created_At: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    Donation_ID: 'DON-002',
    Donor_Name: 'নাম প্রকাশে অনিচ্ছুক (প্রবাসী ভাই)',
    Phone: '01811-000000',
    Amount: 25000,
    Purpose: 'ওজুখানা সংস্কার প্রকল্প',
    Payment_Method: 'বিকাশ (bKash)',
    Status: 'Approved',
    Received_By: 'মোঃ শফিকুল আলম খোকন',
    Created_At: new Date(Date.now() - 18 * 86400000).toISOString(),
  },
  {
    Donation_ID: 'DON-003',
    Donor_Name: 'জুমার জামাতের সাধারণ মুসল্লিবৃন্দ',
    Phone: 'N/A',
    Amount: 16800,
    Purpose: 'জুমার সাধারণ দানবাক্স',
    Payment_Method: 'নগদ',
    Status: 'Received',
    Received_By: 'মাওলানা মোঃ আব্দুর রহিম',
    Created_At: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    Donation_ID: 'DON-004',
    Donor_Name: 'মোঃ ইকবাল হোসেন',
    Phone: '01712-456789',
    Amount: 10000,
    Purpose: 'ইফতার ও রোজাদার সেবা ফান্ড',
    Payment_Method: 'নগদ (Nagad)',
    Status: 'Approved',
    Received_By: 'আলহাজ্ব মোঃ তৌফিকুল ইসলাম',
    Created_At: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

const INITIAL_INCOME: Income[] = [
  {
    Income_ID: 'INC-001',
    Date: '2026-03-01',
    Category: 'মাসিক চাঁদা',
    Description: 'ফেব্রুয়ারি ২০২৬ মাসের নিয়মিত সদস্যদের চাঁদা সংগ্রহ',
    Amount: 38500,
    Received_From: 'মসজিদের নিয়মিত সদস্যবৃন্দ',
    Payment_Method: 'নগদ / এমএফএস',
    Created_By: 'ajariful520@gmail.com',
    Created_At: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    Income_ID: 'INC-002',
    Date: '2026-03-05',
    Category: 'ভাড়া আয়',
    Description: 'মসজিদ সংলগ্ন ওয়াকফ দোকানের মাসিক ভাড়া (দোকান নং ১ ও ২)',
    Amount: 14000,
    Received_From: 'দোকান বরাদ্দ গ্রহীতাগণ',
    Payment_Method: 'ব্যাংক হিসাব',
    Created_By: 'ajariful520@gmail.com',
    Created_At: new Date(Date.now() - 16 * 86400000).toISOString(),
  },
  {
    Income_ID: 'INC-003',
    Date: '2026-02-28',
    Category: 'বিশেষ অনুদান',
    Description: 'শবে বরাত উপলক্ষে সাধারণ তবাররুক ফান্ড',
    Amount: 12500,
    Received_From: 'এলাকাবাসী ও মুসল্লিবৃন্দ',
    Payment_Method: 'নগদ',
    Created_By: 'ajariful520@gmail.com',
    Created_At: new Date(Date.now() - 22 * 86400000).toISOString(),
  },
];

const INITIAL_EXPENSES: Expense[] = [
  {
    Expense_ID: 'EXP-001',
    Date: '2026-03-01',
    Category: 'সম্মানী ও বেতন',
    Description: 'ইমাম, খতিব ও মুয়াজ্জিন সাহেবের ফেব্রুয়ারি মাসের সম্মানী',
    Amount: 32000,
    Payee: 'মসজিদের সম্মানিত খতিব ও স্টাফবৃন্দ',
    Approval_Status: 'Approved',
    Approved_By: 'ajariful520@gmail.com',
    Created_By: 'ajariful520@gmail.com',
    Created_At: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    Expense_ID: 'EXP-002',
    Date: '2026-03-08',
    Category: 'ইউটিলিটি ও বিদ্যুৎ বিল',
    Description: 'নেসকোর ফেব্রুয়ারি মাসের বিদ্যুৎ বিল পরিশোধ',
    Amount: 8450,
    Payee: 'নেসকো (NESCO), নীলফামারী',
    Approval_Status: 'Approved',
    Approved_By: 'ajariful520@gmail.com',
    Created_By: 'ajariful520@gmail.com',
    Created_At: new Date(Date.now() - 13 * 86400000).toISOString(),
  },
  {
    Expense_ID: 'EXP-003',
    Date: '2026-03-12',
    Category: 'রক্ষণাবেক্ষণ ও মাইক মেরামত',
    Description: 'মিনারের নতুন সাউন্ড ইউনিট এবং মসজিদের ২টি সিলিং ফ্যান সার্ভিসিং',
    Amount: 5600,
    Payee: 'মডার্ন ইলেকট্রনিক্স, স্টেশন রোড',
    Approval_Status: 'Approved',
    Approved_By: 'ajariful520@gmail.com',
    Created_By: 'ajariful520@gmail.com',
    Created_At: new Date(Date.now() - 9 * 86400000).toISOString(),
  },
  {
    Expense_ID: 'EXP-004',
    Date: '2026-03-18',
    Category: 'পরিষ্কার-পরিচ্ছন্নতা',
    Description: 'রমজান পূর্ববর্তী গালিচা ধোলাই, ফিনাইল ও হারপিক সামগ্রী ক্রয়',
    Amount: 4200,
    Payee: 'আল-মদিনা ক্লিনিং স্টোর',
    Approval_Status: 'Pending',
    Approved_By: '',
    Created_By: 'ajariful520@gmail.com',
    Created_At: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

const INITIAL_PROJECTS: Project[] = [
  {
    Project_ID: 'PRJ-01',
    Name: 'দ্বিতীয় তলা সম্প্রসারণ কাজ',
    Description: 'মসজিদের দ্বিতীয় তলার ছাদ ঢালাই, ফ্লোর টাইলস ও রঙকরণ কাজ',
    Budget: 500000,
    Spent: 265000,
    Status: 'In Progress',
    Start_Date: '2026-01-01',
    End_Date: '2026-06-30',
    Created_At: new Date(Date.now() - 80 * 86400000).toISOString(),
  },
  {
    Project_ID: 'PRJ-02',
    Name: 'নতুন ওজুখানা কমপ্লেক্স নির্মাণ',
    Description: 'আধুনিক টাইলসযুক্ত ওজুখানা এবং সার্বক্ষণিক পানির ফিল্টার বসানো',
    Budget: 200000,
    Spent: 125000,
    Status: 'In Progress',
    Start_Date: '2026-01-15',
    End_Date: '2026-04-15',
    Created_At: new Date(Date.now() - 65 * 86400000).toISOString(),
  },
];

const INITIAL_COMMITTEE: CommitteeMember[] = [
  {
    Committee_ID: 'COM-01',
    Name: 'আলহাজ্ব মোঃ তৌফিকুল ইসলাম',
    Position: 'সভাপতি',
    Phone_Public: '০১৮১৯-৮৭৬৫৪৩',
    Sort_Order: 1,
    Status: 'Active',
  },
  {
    Committee_ID: 'COM-02',
    Name: 'মোঃ শফিকুল আলম খোকন',
    Position: 'সাধারণ সম্পাদক',
    Phone_Public: '০১৭১২-৩৩৪৪৫৫',
    Sort_Order: 2,
    Status: 'Active',
  },
  {
    Committee_ID: 'COM-03',
    Name: 'হাজী বশির উদ্দিন আহমেদ',
    Position: 'কোষাধ্যক্ষ',
    Phone_Public: '০১৭৩৩-৪৪৫৫৬৬',
    Sort_Order: 3,
    Status: 'Active',
  },
  {
    Committee_ID: 'COM-04',
    Name: 'মাওলানা মোঃ আব্দুর রহিম',
    Position: 'সম্মানিত খতিব ও পেশ ইমাম',
    Phone_Public: '০১৭১১-২৩৪৫৬৭',
    Sort_Order: 4,
    Status: 'Active',
  },
];

const INITIAL_PRAYER_TIMES: PrayerTime = {
  Date: 'আজকের সময়সূচি (Asia/Dhaka)',
  Fajr: '০৪:৪৮ মি.',
  Sunrise: '০৬:০৩ মি.',
  Dhuhr: '১২:০৮ মি.',
  Asr: '০৪:২৯ মি.',
  Maghrib: '০৬:১২ মি.',
  Isha: '০৭:২৭ মি.',
  Updated_At: new Date().toISOString(),
};

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    Log_ID: 'LOG-001',
    Actor: 'ajariful520@gmail.com',
    Action: 'INIT_DATABASE',
    Entity: 'System',
    Entity_ID: 'ALL_SHEETS',
    Timestamp: new Date(Date.now() - 30 * 86400000).toISOString(),
    Details: '১৮টি ডাটাবেস শিট ও প্রাথমিক কাঠামো সফলভাবে প্রস্তুত হয়েছে।',
  },
  {
    Log_ID: 'LOG-002',
    Actor: 'ajariful520@gmail.com',
    Action: 'APPROVE',
    Entity: 'Expenses',
    Entity_ID: 'EXP-001',
    Timestamp: new Date(Date.now() - 20 * 86400000).toISOString(),
    Details: 'ইমাম ও মুয়াজ্জিন সাহেবের সম্মানী অনুমোদন করা হয়েছে।',
  },
];

class MosqueStorage {
  private get<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage write error', e);
    }
  }

  constructor() {
    this.ensureInitialized();
  }

  public ensureInitialized(): void {
    if (!localStorage.getItem(STORAGE_KEY_PREFIX + 'initialized')) {
      this.resetToDefaults();
    }
  }

  public resetToDefaults(): void {
    this.set('Members', INITIAL_MEMBERS);
    this.set('Notices', INITIAL_NOTICES);
    this.set('Campaigns', INITIAL_CAMPAIGNS);
    this.set('Donations', INITIAL_DONATIONS);
    this.set('Income', INITIAL_INCOME);
    this.set('Expenses', INITIAL_EXPENSES);
    this.set('Projects', INITIAL_PROJECTS);
    this.set('Committee', INITIAL_COMMITTEE);
    this.set('Prayer_Times', INITIAL_PRAYER_TIMES);
    this.set('Audit_Logs', INITIAL_AUDIT_LOGS);
    this.set('Admin_Email', 'ajariful520@gmail.com');
    this.set('initialized', 'true');
  }

  public getAdminEmail(): string {
    return this.get<string>('Admin_Email', 'ajariful520@gmail.com');
  }

  public setAdminEmail(email: string): void {
    this.set('Admin_Email', email);
  }

  public getSheet<T>(name: string): T[] {
    return this.get<T[]>(name, []);
  }

  public setSheet<T>(name: string, data: T[]): void {
    this.set(name, data);
  }

  public getPublicData(): PublicData {
    const incomeItems = this.getSheet<Income>('Income');
    const donationItems = this.getSheet<Donation>('Donations');
    const expenseItems = this.getSheet<Expense>('Expenses');
    const noticeItems = this.getSheet<Notice>('Notices');
    const campaignItems = this.getSheet<Campaign>('Campaigns');

    // Rule from Code.gs:
    // income = sumColumn(ss.getSheetByName('Income'), 'Amount')
    // donations = sumColumn(ss.getSheetByName('Donations'), 'Amount', 'Status', ['Received','Approved','Completed'])
    // expenses = sumColumn(ss.getSheetByName('Expenses'), 'Amount', 'Approval_Status', ['Approved','Paid'])
    const income = incomeItems.reduce((acc, cur) => acc + (Number(cur.Amount) || 0), 0);

    const validDonationStatuses = ['Received', 'Approved', 'Completed'];
    const donations = donationItems.reduce((acc, cur) => {
      if (validDonationStatuses.includes(cur.Status)) {
        return acc + (Number(cur.Amount) || 0);
      }
      return acc;
    }, 0);

    const validExpenseStatuses = ['Approved', 'Paid'];
    const expenses = expenseItems.reduce((acc, cur) => {
      if (validExpenseStatuses.includes(cur.Approval_Status)) {
        return acc + (Number(cur.Amount) || 0);
      }
      return acc;
    }, 0);

    const totalIncomeAndDonations = income + donations;
    const balance = totalIncomeAndDonations - expenses;

    // Published notices & campaigns
    const publishedNotices = noticeItems
      .filter((n) => n.Status.toLowerCase() === 'published')
      .slice(0, 10);

    const activeCampaigns = campaignItems
      .filter((c) => c.Status.toLowerCase() === 'active')
      .slice(0, 10);

    return {
      mosqueName: 'এলএসডি পাড়া জামে মসজিদ',
      address: 'পুরাতন রেলওয়ে স্টেশন, নীলফামারী, বাংলাদেশ',
      currency: 'BDT',
      summary: {
        income: totalIncomeAndDonations,
        donations: donations,
        expenses: expenses,
        balance: balance,
      },
      notices: publishedNotices,
      campaigns: activeCampaigns,
      updatedAt: new Date().toISOString(),
    };
  }

  public adminGetDashboard(currentUser: string): {
    ok: boolean;
    counts: Record<string, number>;
    publicData: PublicData;
    recentAuditLogs: AuditLog[];
  } {
    this.requireAdmin(currentUser);
    const counts: Record<string, number> = {
      Members: this.getSheet('Members').length,
      Contributions: 0,
      Donations: this.getSheet('Donations').length,
      Income: this.getSheet('Income').length,
      Expenses: this.getSheet('Expenses').length,
      Notices: this.getSheet('Notices').length,
      Campaigns: this.getSheet('Campaigns').length,
      Projects: this.getSheet('Projects').length,
    };

    return {
      ok: true,
      counts,
      publicData: this.getPublicData(),
      recentAuditLogs: this.getSheet<AuditLog>('Audit_Logs').slice(-10).reverse(),
    };
  }

  public requireAdmin(userEmail: string): boolean {
    const adminEmail = this.getAdminEmail().toLowerCase();
    const candidate = (userEmail || '').trim().toLowerCase();
    if (!candidate || candidate !== adminEmail) {
      this.audit('ACCESS_DENIED', 'System', 'admin endpoint', { email: userEmail });
      throw new Error(`অনুমোদিত অ্যাডমিন অ্যাক্সেস প্রয়োজন। বর্তমানে সক্রিয় ইমেইল: ${userEmail || 'অননুমোদিত'}`);
    }
    return true;
  }

  public adminAddRecord(sheetName: string, record: any, currentUser: string): { ok: boolean; message: string } {
    this.requireAdmin(currentUser);
    const existing: any[] = this.getSheet(sheetName);
    const now = new Date().toISOString();

    const newRecord = {
      ...record,
      Created_At: record.Created_At || now,
      Created_By: record.Created_By || currentUser,
    };

    // Auto-generate ID if not provided
    const idKeyMap: Record<string, string> = {
      Members: 'Member_ID',
      Donations: 'Donation_ID',
      Income: 'Income_ID',
      Expenses: 'Expense_ID',
      Notices: 'Notice_ID',
      Campaigns: 'Campaign_ID',
      Projects: 'Project_ID',
    };

    const idKey = idKeyMap[sheetName];
    if (idKey && !newRecord[idKey]) {
      const prefix = idKey.slice(0, 3).toUpperCase();
      newRecord[idKey] = `${prefix}-${Date.now().toString().slice(-4)}`;
    }

    existing.unshift(newRecord);
    this.setSheet(sheetName, existing);
    this.audit('CREATE', sheetName, newRecord[idKey] || 'GENERIC', { record: newRecord });

    return { ok: true, message: 'রেকর্ড সংরক্ষিত হয়েছে।' };
  }

  public adminApproveExpense(expenseId: string, currentUser: string): { ok: boolean } {
    this.requireAdmin(currentUser);
    const expenses = this.getSheet<Expense>('Expenses');
    let found = false;

    const updated = expenses.map((exp) => {
      if (String(exp.Expense_ID) === String(expenseId)) {
        found = true;
        return {
          ...exp,
          Approval_Status: 'Approved' as const,
          Approved_By: currentUser,
        };
      }
      return exp;
    });

    if (!found) {
      throw new Error('ব্যয়ের রেকর্ড পাওয়া যায়নি');
    }

    this.setSheet('Expenses', updated);
    this.audit('APPROVE', 'Expenses', expenseId, { approvedBy: currentUser });
    return { ok: true };
  }

  public addPublicDonation(donation: Omit<Donation, 'Donation_ID' | 'Created_At'>): { ok: boolean; donationId: string } {
    const donations = this.getSheet<Donation>('Donations');
    const donationId = `DON-${Date.now().toString().slice(-5)}`;
    const newDonation: Donation = {
      ...donation,
      Donation_ID: donationId,
      Created_At: new Date().toISOString(),
    };

    donations.unshift(newDonation);
    this.setSheet('Donations', donations);

    // If donation was for a specific campaign, update campaign collected amount
    if (donation.Purpose) {
      const campaigns = this.getSheet<Campaign>('Campaigns');
      const updatedCampaigns = campaigns.map((c) => {
        if (donation.Purpose.includes(c.Title) || c.Title.includes(donation.Purpose)) {
          return {
            ...c,
            Collected_Amount: c.Collected_Amount + Number(donation.Amount),
          };
        }
        return c;
      });
      this.setSheet('Campaigns', updatedCampaigns);
    }

    this.audit('PUBLIC_DONATION', 'Donations', donationId, { amount: donation.Amount, donor: donation.Donor_Name });
    return { ok: true, donationId };
  }

  public audit(action: string, entity: string, entityId: string, details: any): void {
    try {
      const logs = this.getSheet<AuditLog>('Audit_Logs');
      const newLog: AuditLog = {
        Log_ID: `LOG-${Date.now()}`,
        Actor: this.getAdminEmail(),
        Action: action,
        Entity: entity,
        Entity_ID: String(entityId),
        Timestamp: new Date().toISOString(),
        Details: typeof details === 'string' ? details : JSON.stringify(details),
      };
      logs.unshift(newLog);
      // Keep last 100 logs
      this.setSheet('Audit_Logs', logs.slice(0, 100));
    } catch (e) {
      console.error('Audit write failed', e);
    }
  }
}

export const mosqueStorage = new MosqueStorage();

// Number to Bengali digits and currency helper
export const formatMoney = (n: number | string | undefined | null): string => {
  const num = Number(n) || 0;
  return '৳ ' + num.toLocaleString('bn-BD', { maximumFractionDigits: 2 });
};

export const formatBengaliDate = (isoString?: string): string => {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return isoString;
  }
};
