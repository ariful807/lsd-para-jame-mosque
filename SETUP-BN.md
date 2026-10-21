# সেটআপ নির্দেশিকা (বাংলা)

## ১. Google Sheet তৈরি
1. Google Drive থেকে একটি নতুন Google Sheet তৈরি করুন।
2. URL থেকে Sheet ID কপি করুন। উদাহরণ: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit` — এখানে `SHEET_ID` অংশটি প্রয়োজন।

## ২. Apps Script সেটআপ
1. Sheet থেকে **Extensions → Apps Script** খুলুন।
2. ডিফল্ট কোড মুছে `Code.gs`-এর কোড বসান।
3. **+ → HTML** নির্বাচন করে ফাইলের নাম `index` দিন; রিপোজিটরির `index.html`-এর কোড বসান।
4. **Project Settings → Script Properties**-এ যোগ করুন:
   - `SPREADSHEET_ID` = আপনার Google Sheet ID
   - `ADMIN_EMAILS` = অ্যাডমিনের Google account email; একাধিক হলে কমা দিয়ে আলাদা করুন
5. `setupDatabase` নির্বাচন করে Run চাপুন এবং অনুমতি দিন। এতে ১৮টি শিট ও হেডার তৈরি হবে।

## ৩. Web App ডিপ্লয়
1. **Deploy → New deployment → Web app** নির্বাচন করুন।
2. Execute as এবং Who has access সেটিং আপনার প্রতিষ্ঠানের নীতি অনুযায়ী নির্বাচন করুন। অ্যাডমিনের `Session.getActiveUser().getEmail()` নির্ভরযোগ্যভাবে পাওয়া যায় কি না, আপনার অ্যাকাউন্ট/ডোমেইনে পরীক্ষা করুন।
3. Deploy করে পাওয়া URL খুলে পরীক্ষা করুন।
4. কোড পরিবর্তন করলে Manage deployments থেকে নতুন version deploy করুন।

## ৪. গুরুত্বপূর্ণ নিরাপত্তা
- কোনো ডিফল্ট পাসওয়ার্ড নেই; সোর্স কোডে পাসওয়ার্ড রাখা হয়নি।
- অ্যাডমিন API সার্ভার-সাইডে অনুমোদিত ইমেইল যাচাই করে। ইমেইল ফাঁকা ফেরত এলে অ্যাডমিন endpoint কাজ করবে না; deployment/account policy ঠিক করুন।
- প্রকৃত সদস্যের ফোন, ঠিকানা, অনুদান বা আর্থিক নথি পাবলিক পেজে প্রকাশ করবেন না।
- bKash, Nagad, Rocket বা SSLCommerz-এর বাস্তব পেমেন্ট এখনো সংযুক্ত নয়। অনুমোদিত মার্চেন্ট অ্যাকাউন্ট, সার্ভার-সাইড callback signature/transaction verification এবং reconciliation ছাড়া payment “successful” দেখাবেন না।
- বাস্তব ব্যবহারের আগে অনুমতি, গোপনীয়তা, ব্যাকআপ, আর্থিক অনুমোদন ও রিপোর্ট যাচাই করুন।

## ৫. তৈরি হওয়া শিট
Settings, Members, Contributions, Donations, Transactions, Income, Expenses, Notices, Campaigns, Projects, Prayer_Times, Committee, Receipts, Audit_Logs, Payment_Configurations, Fund_Allocations, Categories, System_Logs.

## ৬. বর্তমান সীমাবদ্ধতা
এটি কার্যকর প্রাথমিক সংস্করণ/স্টার্টার, সম্পূর্ণ production-certified accounting বা payment platform নয়। Member self-registration/login, receipt PDF generation, scheduled notifications, payment gateway callbacks এবং detailed report export পরবর্তী পর্যায়ে নিরাপত্তা ও পরীক্ষাসহ যোগ করতে হবে।
