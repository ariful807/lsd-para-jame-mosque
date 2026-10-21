# এলএসডি পাড়া জামে মসজিদ — Smart Mosque Management Portal

A modern Bengali-first smart mosque management and transparency web application rewritten in **React 19, TypeScript, and Vite**, preserving the original design language, color palette, and business logic.

## Features
- **পাবলিক ড্যাশবোর্ড ও আর্থিক সারসংক্ষেপ (Public Overview)**: মোট আয় ও অনুদান, অনুদান, অনুমোদিত ব্যয় ও অবশিষ্ট তহবিলের লাইভ হিসাব।
- **নোটিশ বোর্ড (Notices)**: অনুসন্ধানযোগ্য নোটিশ তালিকা, বিস্তারিত বিজ্ঞপ্তি দেখার মোডাল।
- **অনুদান কার্যক্রম (Campaigns & Donations)**: চলমান উন্নয়ন প্রকল্প (যেমন: দ্বিতীয় তলার ফিনিশিং, আধুনিক ওজুখানা), লক্ষ্যমাত্রা ও সংগৃহীত অগ্রগতি ট্র্যাকিং, অনলাইন অনুদান ও রসিদ তৈরি।
- **নামাজের সময়সূচি ও পরিচালনা কমিটি (Prayer Times & Committee)**: স্থানীয় সময়সূচি (Asia/Dhaka) ও সম্মানিত কমিটির পদবী এবং যোগাযোগের তথ্য।
- **অ্যাডমিন ড্যাশবোর্ড (Admin Control Panel)**:
  - সার্ভার-সাইড স্টাইল রোল ভ্যালিডেশন (অ্যাডমিন ইমেইল অথেন্টিকেশন)
  - সদস্য তালিকা (Members), অনুদান (Donations), ব্যয় (Expenses), আয় (Income), নোটিশ (Notices), প্রজেক্ট (Projects), এবং অডিট লগ (Audit_Logs)
  - সরাসরি ১-ক্লিকে বকেয়া ব্যয় অনুমোদন (Expense Approval)
  - নতুন রেকর্ড এন্ট্রি ফর্ম (Generic Sheet Record Insert)
  - ইন্টারেক্টিভ টেবিল ভিউ ও কাঁচা JSON ভিউ
  - অডিট ট্রেইল ও লগিং

## Tech Stack
- **Framework**: React 19, TypeScript, Vite
- **Styling**: Native CSS conforming to original aesthetic, colors (`--deep`, `--green`, `--gold`, `--paper`), and 'Hind Siliguri' font
- **Icons**: Lucide React
- **Persistence**: LocalStorage with realistic seed database for LSD Para Jame Mosque, Nilphamari

## Development
```bash
npm install
npm run dev
```
Dev server listens on port 3000 at `http://0.0.0.0:3000`.

## Production Build
```bash
npm run build
```
