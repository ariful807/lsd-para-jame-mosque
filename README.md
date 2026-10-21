# এলএসডি পাড়া জামে মসজিদ — Smart Mosque Management System

A Bengali-first mosque management starter built with HTML/CSS/JavaScript and Google Apps Script + Google Sheets.

## Features
- Public mosque homepage, notices, campaigns and financial summaries
- Members, contributions, donations, income and expenses
- Admin dashboard and server-side role checks
- Sheet setup helper for the 18 required worksheets
- Bengali interface, BDT currency, Asia/Dhaka timezone
- CSV-friendly structured records and audit logging

## Repository files
- `index.html` — responsive web interface
- `Code.gs` — Google Apps Script backend and sheet setup
- `appsscript.json` — Apps Script manifest
- `SETUP-BN.md` — Bengali deployment guide

## Quick setup
1. Create a Google Sheet for the database.
2. Open **Extensions → Apps Script**.
3. Copy `Code.gs` into the Apps Script project and add the HTML file from `index.html` as an HTML file named `index`.
4. Set Script Property `SPREADSHEET_ID` to the Google Sheet ID.
5. Run `setupDatabase` once and authorize the requested permissions.
6. Set Script Property `ADMIN_EMAILS` to the trusted administrator email(s), comma-separated.
7. Deploy as **Web app**. Choose an execution identity and access scope appropriate for your organization; test with a non-admin account.
8. Use the deployment URL. For changes, create a new deployment version.

## Important security notes
- Never publish passwords, payment secrets, private member details or API keys in the frontend or repository.
- Admin access is checked server-side against `ADMIN_EMAILS`; do not rely on hiding dashboard buttons.
- This starter does not claim that bKash/Nagad/Rocket/SSLCommerz payments are live. Merchant credentials, verified server callbacks and reconciliation are required before enabling real transactions.
- Review privacy, accounting and access requirements before using this for real mosque funds.

## Initial admin
No default password is embedded. Configure the trusted admin email in Script Properties and deploy with an account-access policy suitable for your Google Workspace / Google account environment.
