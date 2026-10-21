export interface Member {
  Member_ID: string;
  Name: string;
  Phone: string;
  Email: string;
  Address: string;
  Join_Date: string;
  Status: 'Active' | 'Inactive';
  Role: 'General' | 'Life' | 'Committee' | 'Donor';
  Created_At: string;
}

export interface Contribution {
  Contribution_ID: string;
  Member_ID: string;
  Member_Name: string;
  Month: string;
  Year: string;
  Amount: number;
  Payment_Method: string;
  Status: 'Received' | 'Pending';
  Received_By: string;
  Created_At: string;
}

export interface Donation {
  Donation_ID: string;
  Donor_Name: string;
  Phone: string;
  Amount: number;
  Purpose: string;
  Payment_Method: string;
  Status: 'Received' | 'Approved' | 'Completed' | 'Pending';
  Received_By: string;
  Created_At: string;
}

export interface Expense {
  Expense_ID: string;
  Date: string;
  Category: string;
  Description: string;
  Amount: number;
  Payee: string;
  Approval_Status: 'Approved' | 'Pending' | 'Paid' | 'Rejected';
  Approved_By: string;
  Created_By: string;
  Created_At: string;
}

export interface Income {
  Income_ID: string;
  Date: string;
  Category: string;
  Description: string;
  Amount: number;
  Received_From: string;
  Payment_Method: string;
  Created_By: string;
  Created_At: string;
}

export interface Notice {
  Notice_ID: string;
  Title: string;
  Body: string;
  Publish_Date: string;
  Status: 'Published' | 'Draft' | 'Archived';
  Created_By: string;
  Created_At: string;
}

export interface Campaign {
  Campaign_ID: string;
  Title: string;
  Description: string;
  Target_Amount: number;
  Collected_Amount: number;
  Start_Date: string;
  End_Date: string;
  Status: 'Active' | 'Completed' | 'Upcoming';
  Created_At: string;
}

export interface Project {
  Project_ID: string;
  Name: string;
  Description: string;
  Budget: number;
  Spent: number;
  Status: 'Planning' | 'In Progress' | 'Completed';
  Start_Date: string;
  End_Date: string;
  Created_At: string;
}

export interface PrayerTime {
  Date: string;
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Updated_At: string;
}

export interface CommitteeMember {
  Committee_ID: string;
  Name: string;
  Position: string;
  Phone_Public: string;
  Sort_Order: number;
  Status: 'Active' | 'Inactive';
}

export interface AuditLog {
  Log_ID: string;
  Actor: string;
  Action: string;
  Entity: string;
  Entity_ID: string;
  Timestamp: string;
  Details: string;
}

export interface SystemLog {
  Log_ID: string;
  Level: 'INFO' | 'WARN' | 'ERROR';
  Message: string;
  Timestamp: string;
  Context: string;
}

export interface SummaryData {
  income: number;
  donations: number;
  expenses: number;
  balance: number;
}

export interface PublicData {
  mosqueName: string;
  address: string;
  currency: string;
  summary: SummaryData;
  notices: Notice[];
  campaigns: Campaign[];
  updatedAt: string;
}
