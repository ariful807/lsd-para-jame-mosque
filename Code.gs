/** এলএসডি পাড়া জামে মসজিদ — Apps Script backend
 * Configure Script Properties:
 * SPREADSHEET_ID = Google Sheet ID
 * ADMIN_EMAILS = trusted admin emails separated by commas
 */
const APP = {
  name: 'এলএসডি পাড়া জামে মসজিদ',
  timezone: 'Asia/Dhaka',
  currency: 'BDT',
  sheets: {
    Settings: ['Key','Value','Updated_At'],
    Members: ['Member_ID','Name','Phone','Email','Address','Join_Date','Status','Role','Created_At'],
    Contributions: ['Contribution_ID','Member_ID','Member_Name','Month','Year','Amount','Payment_Method','Status','Received_By','Created_At'],
    Donations: ['Donation_ID','Donor_Name','Phone','Amount','Purpose','Payment_Method','Status','Received_By','Created_At'],
    Transactions: ['Transaction_ID','Date','Type','Category','Description','Amount','Reference_ID','Created_By','Created_At'],
    Income: ['Income_ID','Date','Category','Description','Amount','Received_From','Payment_Method','Created_By','Created_At'],
    Expenses: ['Expense_ID','Date','Category','Description','Amount','Payee','Approval_Status','Approved_By','Created_By','Created_At'],
    Notices: ['Notice_ID','Title','Body','Publish_Date','Status','Created_By','Created_At'],
    Campaigns: ['Campaign_ID','Title','Description','Target_Amount','Collected_Amount','Start_Date','End_Date','Status','Created_At'],
    Projects: ['Project_ID','Name','Description','Budget','Spent','Status','Start_Date','End_Date','Created_At'],
    Prayer_Times: ['Date','Fajr','Sunrise','Dhuhr','Asr','Maghrib','Isha','Updated_At'],
    Committee: ['Committee_ID','Name','Position','Phone_Public','Sort_Order','Status'],
    Receipts: ['Receipt_ID','Transaction_Type','Reference_ID','Payer_Name','Amount','Issued_At','Issued_By'],
    Audit_Logs: ['Log_ID','Actor','Action','Entity','Entity_ID','Timestamp','Details'],
    Payment_Configurations: ['Provider','Enabled','Public_Instructions','Updated_At'],
    Fund_Allocations: ['Allocation_ID','Project_ID','Fund_Name','Allocated_Amount','Spent_Amount','Updated_At'],
    Categories: ['Category_ID','Type','Name','Status'],
    System_Logs: ['Log_ID','Level','Message','Timestamp','Context']
  }
};

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle(APP.name + ' | Smart Mosque Management')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function setupDatabase() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('Script Properties-এ SPREADSHEET_ID সেট করুন।');
  const ss = SpreadsheetApp.openById(id);
  Object.keys(APP.sheets).forEach(function(name) {
    let sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    if (sh.getLastRow() === 0) {
      sh.getRange(1, 1, 1, APP.sheets[name].length).setValues([APP.sheets[name]]);
      sh.setFrozenRows(1);
      sh.getRange(1,1,1,APP.sheets[name].length).setFontWeight('bold');
    }
  });
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('ADMIN_EMAILS')) props.setProperty('ADMIN_EMAILS', Session.getActiveUser().getEmail() || '');
  logSystem_('INFO', 'Database setup completed', {spreadsheetId:id});
  return {ok:true, message:'১৮টি প্রয়োজনীয় শিট প্রস্তুত হয়েছে।', sheets:Object.keys(APP.sheets)};
}

function getPublicData() {
  const ss = getSpreadsheet_();
  const income = sumColumn_(ss.getSheetByName('Income'), 'Amount');
  const donations = sumColumn_(ss.getSheetByName('Donations'), 'Amount', 'Status', ['Received','Approved','Completed']);
  const expenses = sumColumn_(ss.getSheetByName('Expenses'), 'Amount', 'Approval_Status', ['Approved','Paid']);
  return {
    mosqueName: APP.name,
    address: 'পুরাতন রেলওয়ে স্টেশন, নীলফামারী, বাংলাদেশ',
    currency: APP.currency,
    summary: {income:income + donations, donations:donations, expenses:expenses, balance:income + donations - expenses},
    notices: readPublished_('Notices', 10),
    campaigns: readPublished_('Campaigns', 10),
    updatedAt: new Date().toISOString()
  };
}

function adminGetDashboard() {
  requireAdmin_();
  const ss = getSpreadsheet_();
  const counts = {};
  ['Members','Contributions','Donations','Income','Expenses','Notices','Campaigns','Projects'].forEach(function(n) {
    const sh = ss.getSheetByName(n);
    counts[n] = Math.max(0, sh.getLastRow() - 1);
  });
  return {ok:true, counts:counts, publicData:getPublicData(), recentTransactions:readRows_('Transactions', 20)};
}

function adminList(sheetName) {
  requireAdmin_();
  if (!APP.sheets[sheetName]) throw new Error('অজানা শিট');
  return readRows_(sheetName, 500);
}

/** Admin-only generic insert. Header names are taken from the sheet itself. */
function adminAddRecord(sheetName, record) {
  requireAdmin_();
  if (!APP.sheets[sheetName] || !record || typeof record !== 'object') throw new Error('অবৈধ অনুরোধ');
  const allowed = ['Members','Contributions','Donations','Income','Expenses','Notices','Campaigns','Projects','Prayer_Times','Committee','Transactions','Fund_Allocations','Categories'];
  if (allowed.indexOf(sheetName) < 0) throw new Error('এই শিটে সরাসরি যোগ করা যাবে না');
  const ss = getSpreadsheet_(), sh = ss.getSheetByName(sheetName);
  const headers = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0];
  const row = headers.map(function(h) { return record[h] === undefined ? '' : record[h]; });
  const now = new Date();
  ['Created_At','Updated_At'].forEach(function(k) {
    const i = headers.indexOf(k);
    if (i >= 0 && !row[i]) row[i] = now;
  });
  sh.appendRow(row);
  audit_('CREATE', sheetName, record[headers[0]] || '', {fields:Object.keys(record)});
  return {ok:true, message:'রেকর্ড সংরক্ষিত হয়েছে।'};
}

function adminApproveExpense(expenseId) {
  requireAdmin_();
  const sh = getSpreadsheet_().getSheetByName('Expenses');
  const data = sh.getDataRange().getValues();
  const headers = data[0], idCol = headers.indexOf('Expense_ID'), statusCol = headers.indexOf('Approval_Status'), approvedCol = headers.indexOf('Approved_By');
  for (let r=1; r<data.length; r++) {
    if (String(data[r][idCol]) === String(expenseId)) {
      sh.getRange(r+1,statusCol+1).setValue('Approved');
      sh.getRange(r+1,approvedCol+1).setValue(currentUser_());
      audit_('APPROVE','Expenses',expenseId,{});
      return {ok:true};
    }
  }
  throw new Error('ব্যয়ের রেকর্ড পাওয়া যায়নি');
}

function getSpreadsheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('SPREADSHEET_ID কনফিগার করা হয়নি');
  return SpreadsheetApp.openById(id);
}
function currentUser_() {
  return Session.getActiveUser().getEmail() || 'unknown-user';
}
function requireAdmin_() {
  const email = currentUser_().toLowerCase();
  const raw = PropertiesService.getScriptProperties().getProperty('ADMIN_EMAILS') || '';
  const admins = raw.split(',').map(function(x){return x.trim().toLowerCase();}).filter(Boolean);
  if (!email || admins.indexOf(email) < 0) {
    audit_('ACCESS_DENIED','System','admin endpoint',{email:email});
    throw new Error('অনুমোদিত অ্যাডমিন অ্যাক্সেস প্রয়োজন।');
  }
}
function readRows_(name, limit) {
  const sh = getSpreadsheet_().getSheetByName(name);
  if (!sh || sh.getLastRow() < 2) return [];
  const data = sh.getDataRange().getValues(), headers = data.shift();
  return data.slice(-limit).reverse().map(function(row) {
    const o = {}; headers.forEach(function(h,i){o[h] = row[i] instanceof Date ? row[i].toISOString() : row[i];}); return o;
  });
}
function readPublished_(name, limit) {
  const rows = readRows_(name, limit);
  return rows.filter(function(r){return String(r.Status || '').toLowerCase() === 'published' || String(r.Status || '').toLowerCase() === 'active';});
}
function sumColumn_(sh, amountHeader, statusHeader, allowedStatuses) {
  if (!sh || sh.getLastRow() < 2) return 0;
  const data = sh.getDataRange().getValues(), headers = data.shift();
  const amountIndex = headers.indexOf(amountHeader), statusIndex = statusHeader ? headers.indexOf(statusHeader) : -1;
  if (amountIndex < 0) return 0;
  return data.reduce(function(total,row) {
    if (statusIndex >= 0 && allowedStatuses.indexOf(String(row[statusIndex])) < 0) return total;
    return total + (Number(row[amountIndex]) || 0);
  },0);
}
function audit_(action, entity, entityId, details) {
  try {
    const sh = getSpreadsheet_().getSheetByName('Audit_Logs');
    if (sh) sh.appendRow([Utilities.getUuid(),currentUser_(),action,entity,String(entityId),new Date(),JSON.stringify(details || {})]);
  } catch (e) { logSystem_('ERROR','Audit write failed',{error:String(e)}); }
}
function logSystem_(level, message, context) {
  try {
    const ss = getSpreadsheet_(), sh = ss.getSheetByName('System_Logs');
    if (sh) sh.appendRow([Utilities.getUuid(),level,message,new Date(),JSON.stringify(context || {})]);
  } catch (e) {}
}
