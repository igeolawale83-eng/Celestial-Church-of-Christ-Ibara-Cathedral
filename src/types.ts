export type Department =
  | 'main_dashboard'   // Parish Central Dashboard / Church Secretary Monitoring Hub
  | 'parochial'        // Parish Council Executive
  | 'shepherd'         // Shepherd & Church Workers
  | 'evangelist'       // Council of Honorary Evangelists
  | 'prophets'         // Council of Prophet & Prophetess
  | 'side_men_women'   // Council of Sidesmen & Sideswomen
  | 'choir'            // The Model Choir
  | 'youth'            // Youth Council
  | 'security'         // Security Enforcement Team
  | 'media'            // Media Team
  | 'medical'          // Medical Team
  | 'bible_fellowship' // MC & Women Bible Fellowship
  | 'secretariat_dispatch'; // Parochial Secretary Dissemination Platform

export type ExecutiveRole = 'Chairman' | 'Secretary' | 'Treasurer';

export interface DepartmentFeedback {
  id: string;
  department: Department;
  departmentName: string;
  senderName: string;
  senderRole: string; // 'Chairman' | 'Secretary' | 'Treasurer' | 'Unit Officer'
  category: 'Operational Report' | 'Urgent Alert' | 'Logistics & Requisition' | 'Welfare & Pastoral' | 'Event Summary' | 'Spiritual & Intercessory' | 'General Feedback';
  priority: 'Routine' | 'Important' | 'Urgent' | 'Emergency';
  subject: string;
  details: string;
  dateSubmitted: string;
  status: 'Pending Review' | 'Acknowledged' | 'Action Taken' | 'Resolved';
  secretaryRemarks?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  kpiMetricsSummary?: string;
}

export interface DepartmentAuthAccount {
  id: string;
  department: Department;
  departmentName: string;
  shortName: string;
  email: string;
  password: string;
  officerName: string;
  officerRole: string;
  badgeCategory: string;
  defaultTab: Department;
}

export interface DepartmentAuthSession {
  department: Department;
  departmentName: string;
  shortName: string;
  email: string;
  officerName: string;
  officerRole: string;
  badgeCategory: string;
  loginTime: string;
}

export interface DepartmentExecutiveCredential {
  department: Department;
  role: ExecutiveRole;
  username: string;
  name: string;
  rank: string;
  phone: string;
  email: string;
}

export interface ChairmanExecutiveCredentialsUpdate {
  department: Department;
  targetRole: ExecutiveRole;
  officerName: string;
  officerRank: string;
  officerEmail: string;
  officerPhone: string;
  executivePassword: string;
  departmentLoginPassword?: string;
  updatedAt: string;
  updatedByChairmanName: string;
}

export interface DepartmentExecutiveRecord {
  id: string;
  department: Department;
  role: ExecutiveRole;
  title: string;
  description: string;
  date: string;
  status: 'Approved' | 'Pending Sign-off' | 'Action Required' | 'Recorded';
  author: string;
  amount?: number;
  tags?: string[];
}

export interface DepartmentSecretaryRecord {
  id: string;
  department: Department;
  title: string;
  meetingType: 'Statutory Council' | 'Emergency Session' | 'Inter-Unit Caucus' | 'General Assembly' | 'Secretariat Circular';
  date: string;
  time: string;
  quorumCount: number;
  secretaryAuthor: string;
  keyResolutions: string;
  attendees: string;
  archivedStatus: 'Official Recorded' | 'Pending Review' | 'Transmitted to Parish Council';
}

export interface DepartmentTreasurerRecord {
  id: string;
  department: Department;
  voucherCode: string;
  category: 'Imprest Reimbursement' | 'Logistics & Requisition' | 'Sacramental Supplies' | 'Honorarium & Benevolence' | 'Equipment Maintenance' | 'Remittance to Parochial Purse';
  description: string;
  amount: number;
  date: string;
  payee: string;
  paymentMethod: 'Bank Transfer' | 'Petty Cash Cashier' | 'Cheque';
  treasurerSignee: string;
  auditStatus: 'Audited & Cleared' | 'Pending Sign-off' | 'Reconciled';
}

export interface SecretariatDispatch {
  id: string;
  memoNumber: string;
  title: string;
  category: 'Parish Council Resolution' | 'Urgent Executive Directive' | 'Statutory Assembly Notice' | 'Financial & Audit Call' | 'Liturgical & Event Order';
  priority: 'Emergency' | 'High Priority' | 'Routine' | 'Statutory';
  dateDispatched: string;
  deadline?: string;
  author: string;
  summary: string;
  fullBody: string;
  targetDepartments: Department[] | 'ALL';
  acknowledgments: {
    department: Department;
    departmentLabel: string;
    secretaryName: string;
    acknowledged: boolean;
    acknowledgedAt?: string;
    remarks?: string;
  }[];
  replies: {
    id: string;
    department: Department;
    secretaryName: string;
    date: string;
    message: string;
  }[];
}

// Medical Team
export interface MedicalPersonnel {
  id: string;
  name: string;
  profession: 'Medical Doctor' | 'Registered Nurse' | 'Pharmacist' | 'Paramedic' | 'First Aider';
  rank: string;
  role: 'Chief Medical Officer' | 'Nurse Lead' | 'Pharmacy Lead' | 'Triage Responder';
  contact: string;
  dutyStatus: 'On Duty' | 'Standby' | 'Off Duty';
}

export interface ClinicLog {
  id: string;
  date: string;
  service: string;
  patientName: string;
  gender: 'Male' | 'Female' | 'Child';
  symptoms: string;
  vitals: { bp: string; pulse: string; temp: string; bloodSugar?: string };
  treatmentAdministered: string;
  outcome: 'Discharged & Stabilized' | 'Referred to Hospital' | 'Resting in Clinic';
  attendingMedic: string;
}

export interface MedicalSupply {
  id: string;
  itemName: string;
  category: 'Diagnostic' | 'Emergency Consumable' | 'First Aid' | 'Medication';
  quantity: number;
  unit: string;
  expiryDate: string;
  status: 'Sufficient' | 'Low Stock' | 'Critical';
  location: string;
}

export interface HealthOutreachProgram {
  id: string;
  title: string;
  targetAudience: string;
  date: string;
  beneficiariesTarget: number;
  leadCoordinator: string;
  status: 'Upcoming' | 'Active' | 'Completed';
}

// MC & Women Bible Fellowship
export interface FellowshipLeader {
  id: string;
  name: string;
  rank: string;
  office: 'Fellowship President / Chairman' | 'Women Coordinator / Vice Chair' | 'General Secretary' | 'Treasurer' | 'Welfare Secretary' | 'Bible Study Director' | 'Elder Patron / Matron';
  wing: 'Men Christian Fellowship' | 'Women Bible Fellowship' | 'Joint Executive';
  contact: string;
  status: 'Active' | 'Honorary';
}

export interface BibleStudySyllabus {
  id: string;
  weekNumber: number;
  topic: string;
  biblePassage: string;
  memoryVerse: string;
  dateScheduled: string;
  facilitator: string;
  wing: 'Joint Fellowship' | 'Men Fellowship' | 'Women Fellowship';
}

export interface WelfareBeneficiaryCase {
  id: string;
  caseId: string;
  title: string;
  recipientCategory: 'Widow Welfare' | 'Elderly Member Support' | 'Newborn / Naming Gift' | 'Bereavement Relief' | 'Educational Support';
  dateAssisted: string;
  amountOrSupplies: string;
  coordinator: string;
  status: 'Disbursed' | 'Approved' | 'Review';
}

export interface FellowshipEvent {
  id: string;
  title: string;
  date: string;
  venue: string;
  theme: string;
  wing: 'Joint' | 'Men' | 'Women';
  budget: number;
  status: 'Upcoming' | 'Completed';
}

// Parochial Committee
export interface FinancialTransaction {
  id: string;
  date: string;
  category: 'Tithe' | 'Thanksgiving' | 'Building Fund' | 'Special Seed';
  amount: number;
  status: 'Cleared' | 'Pending' | 'Flagged';
}

export interface Project {
  id: string;
  title: string;
  budget: number;
  completion: number; // percentage
  lead: string;
  status: 'In Progress' | 'Completed' | 'Not Started';
}

export interface MeetingMinute {
  id: string;
  title: string;
  date: string;
  format: 'PDF' | 'DOCX';
  summary?: string;
}

export interface WeeklyService {
  id: string;
  date: string;
  day: string;
  serviceName: string;
  conductor: string;
  firstLesson: string;
  firstLessonReader: string;
  secondLesson: string;
  secondLessonReader: string;
  sermoner: string;
}

// Shepherd Unit
export interface CounselingSession {
  id: string;
  time: string;
  date: string;
  memberName: string;
  topic: 'Spiritual' | 'Family' | 'Guidance' | 'Grief';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface SacramentalRegistry {
  id: string;
  type: 'Baptism' | 'Naming' | 'Confirmation' | 'Matrimony';
  candidateName: string;
  date: string;
  status: 'Pending' | 'Performed';
}

export interface SpiritualLogistic {
  id: string;
  name: string;
  status: 'Prepared' | 'Pending' | 'Scheduled' | 'Action Needed';
  detail: string;
}

export interface ChurchWorker {
  id: string;
  name: string;
  rank: string;
  role: string;
  contact: string;
  status: 'Active' | 'On Leave' | 'Retired';
}

// Prophets & Prophetesses
export interface ServiceRoster {
  id: string;
  date: string;
  serviceType: string;
  assignedProphets: { name: string; initials: string; isPrimary: boolean }[];
  status: 'Confirmed' | 'Pending';
}

export interface FastingSchedule {
  id: string;
  title: string;
  dateRange: string;
  type: 'Current Week' | 'Next Week' | 'Planned';
  isActive: boolean;
}

export interface ObservationLog {
  id: string;
  category: 'Parish Preservation' | 'Youth Guidance' | 'General Welfare' | 'Spiritual Alert';
  date: string;
  title: string;
  content: string;
  author: string;
  authorInitials: string;
  severity: 'low' | 'medium' | 'high';
}

// Side Men/Women
export interface ServiceAttendanceLog {
  id: string;
  date: string;
  serviceType: string;
  men: number;
  women: number;
  children: number;
  total: number;
  offertoryBoxes: number;
}

export interface SideRoster {
  id: string;
  name: string;
  initials: string;
  aisle: string;
  arrivalTime: string;
  status: 'On Duty' | 'Standby' | 'Break';
}

// Choir Unit
export interface Hymn {
  id: string;
  hymnNo: string;
  title: string;
  language: 'Yoruba' | 'English';
  theme: 'Praise' | 'Adoration' | 'Thanksgiving' | 'Passion' | 'Supplication';
  servicesUsed: number;
}

export interface RobeInventory {
  total: number;
  assigned: number;
  inWash: number;
  repairsNeeded: number;
}

export interface ChoirMemberAttendance {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  voicePart: 'Soprano' | 'Alto' | 'Tenor' | 'Bass';
  status: 'Present' | 'Excused' | 'Absent';
}

// Youth Wing
export interface YouthEvent {
  id: string;
  date: string;
  month: string;
  day: string;
  title: string;
  location: string;
  eventId: string;
  registered: number;
  capacity: number;
}

export interface SkillProgram {
  id: string;
  title: string;
  duration: string;
  enrolled: number;
  status: 'Active' | 'Upcoming' | 'Completed';
  progress: number; // percentage
  progressLabel: string;
}

// Security Unit
export interface SecurityRoster {
  id: string;
  name: string;
  initials: string;
  guardId: string;
  shift: 'Morning Shift' | 'Evening Shift' | 'Night Watch';
  assignedGear: string;
  status: 'On Patrol' | 'Stationed' | 'Perimeter' | 'Off Duty';
}

export interface PatrolLog {
  id: string;
  incId: string;
  title: string;
  location: string;
  time: string;
  status: 'Clear' | 'Suspicious Vehicle' | 'Unlocked Gate' | 'Intruder Spotted' | 'Resolved';
  severity: 'low' | 'medium' | 'high';
}

// Media Unit
export interface LiveStreamSession {
  id: string;
  title: string;
  platform: 'YouTube' | 'Facebook Live' | 'Instagram Live' | 'Mixed Stream';
  status: 'Live' | 'Scheduled' | 'Ended';
  viewers: number;
  date: string;
  time: string;
}

export interface MediaEquipment {
  id: string;
  name: string;
  category: 'Video' | 'Audio' | 'Lighting' | 'Computing' | 'Accessories';
  status: 'Operational' | 'In Use' | 'Needs Service' | 'Damaged';
  assignedCrew: string;
}

export interface MediaPublication {
  id: string;
  title: string;
  date: string;
  type: 'Video Sermon' | 'Audio Sermon' | 'Audio Podcast' | 'Newsletter' | 'Social Clip';
  platform: string;
  status: 'Published' | 'Draft' | 'Scheduled';
  downloadsOrViews: number;
}

export interface MediaCrew {
  id: string;
  name: string;
  initials: string;
  role: 'Camera Operator' | 'Sound Engineer' | 'Stream Director' | 'Presenter' | 'Projectionist';
  status: 'Active' | 'On Call' | 'Off Duty';
  contact: string;
}

export interface UnitExecutive {
  id: string;
  name: string;
  rank: string;
  office: string;
  contact: string;
  status: 'Active' | 'On Leave' | 'Retired';
}

export interface ParishDignitary {
  id: string;
  title: string;
  name: string;
  contact: string;
  appointedDate?: string;
}

export interface HarvestCommitteeMember {
  id: string;
  name: string;
  role: string;
  contact: string;
  status: 'Active' | 'On Leave';
  responsibility: string;
}

// Evangelist Unit
export interface EvangelistMission {
  id: string;
  title: string;
  theme: string;
  date: string;
  time: string;
  location: string;
  leadSpeaker: string;
  status: 'Upcoming' | 'In Progress' | 'Completed';
  targetSouls: number;
  soulsWon: number;
}

export interface SermonRosterItem {
  id: string;
  date: string;
  service: string;
  evangelist: string;
  rank: string;
  topic: string;
  scripture: string;
  status: 'Scheduled' | 'Delivered' | 'Reassigned';
}

export interface ConvertRecord {
  id: string;
  name: string;
  contact: string;
  outreachEvent: string;
  dateJoined: string;
  assignedCounselor: string;
  spiritualStage: 'New Convert' | 'In Bible Doctrine Class' | 'Baptism Candidate' | 'Full Member';
  notes: string;
}

export interface OrdainedEvangelist {
  id: string;
  name: string;
  rank: 'Superior Evangelist' | 'Most Senior Evangelist' | 'Senior Evangelist' | 'Evangelist' | 'Honorary Evangelist';
  anointingYear: number;
  assignedZone: string;
  contact: string;
  status: 'Active' | 'On Itinerant Mission' | 'Elder Statesman';
}


