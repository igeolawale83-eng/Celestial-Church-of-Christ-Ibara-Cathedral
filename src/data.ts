import {
  Department,
  FinancialTransaction,
  Project,
  MeetingMinute,
  WeeklyService,
  CounselingSession,
  SacramentalRegistry,
  SpiritualLogistic,
  ChurchWorker,
  ServiceRoster,
  FastingSchedule,
  ObservationLog,
  ServiceAttendanceLog,
  SideRoster,
  Hymn,
  RobeInventory,
  ChoirMemberAttendance,
  YouthEvent,
  SkillProgram,
  SecurityRoster,
  PatrolLog,
  LiveStreamSession,
  MediaEquipment,
  MediaPublication,
  MediaCrew,
  UnitExecutive,
  ParishDignitary,
  HarvestCommitteeMember,
  EvangelistMission,
  SermonRosterItem,
  ConvertRecord,
  OrdainedEvangelist,
  DepartmentExecutiveCredential,
  DepartmentExecutiveRecord,
  DepartmentSecretaryRecord,
  DepartmentTreasurerRecord,
  SecretariatDispatch,
  MedicalPersonnel,
  ClinicLog,
  MedicalSupply,
  HealthOutreachProgram,
  FellowshipLeader,
  BibleStudySyllabus,
  WelfareBeneficiaryCase,
  FellowshipEvent,
  DepartmentFeedback,
  DepartmentAuthAccount
} from './types';

// Parochial Committee Initial Data
export const initialTransactions: FinancialTransaction[] = [
  { id: 'TXN-001', date: '2023-10-24', category: 'Tithe', amount: 1500.00, status: 'Cleared' },
  { id: 'TXN-002', date: '2023-10-22', category: 'Thanksgiving', amount: 450.50, status: 'Cleared' },
  { id: 'TXN-003', date: '2023-10-18', category: 'Building Fund', amount: 2000.00, status: 'Pending' },
  { id: 'TXN-004', date: '2023-10-15', category: 'Tithe', amount: 800.00, status: 'Cleared' },
  { id: 'TXN-005', date: '2023-10-10', category: 'Thanksgiving', amount: 120.00, status: 'Cleared' },
  { id: 'TXN-006', date: '2023-10-05', category: 'Building Fund', amount: 5000.00, status: 'Cleared' },
  { id: 'TXN-007', date: '2023-10-01', category: 'Tithe', amount: 1250.00, status: 'Cleared' },
];

export const initialProjects: Project[] = [
  { id: 'PRJ-A', title: 'Parish Extension Painting', budget: 4500, completion: 75, lead: 'Bro. Thomas', status: 'In Progress' },
  { id: 'PRJ-B', title: 'New Sound System Install', budget: 12000, completion: 100, lead: 'Sis. Mary', status: 'Completed' },
  { id: 'PRJ-C', title: 'Roof Repair Phase 1', budget: 8500, completion: 0, lead: 'Eld. John', status: 'Not Started' },
  { id: 'PRJ-D', title: 'Altar Renovation', budget: 3000, completion: 40, lead: 'Bro. James', status: 'In Progress' },
];

export const initialMeetingMinutes: MeetingMinute[] = [
  { id: 'DOC-001', title: 'Q3 Budget Review', date: 'October 12, 2023', format: 'PDF', summary: 'Detailed review of parish revenues, departmental expenditures, and budget provisions for the upcoming harvest celebration.' },
  { id: 'DOC-002', title: 'Building Committee Meet', date: 'September 28, 2023', format: 'DOCX', summary: 'Decisions on general painting materials procurement, acoustic adjustments, and scaffolding setup schedule.' },
  { id: 'DOC-003', title: 'Annual Planning Session', date: 'August 05, 2023', format: 'PDF', summary: 'Broad strategic vision for parish membership outreach, sacramental schedules, and physical facility renovations.' },
];

export const initialWeeklyServices: WeeklyService[] = [
  {
    id: 'SRV-001',
    date: '2026-07-19',
    day: 'Sunday',
    serviceName: 'Sunday Devotional Service',
    conductor: 'Sup. Evang. J. Olamide',
    firstLesson: 'Genesis 1:1-15',
    firstLessonReader: 'Bro. Samuel Adebiyi',
    secondLesson: 'John 1:1-14',
    secondLessonReader: 'Sis. Deborah Olatunji',
    sermoner: 'Shepherd-in-Charge'
  },
  {
    id: 'SRV-002',
    date: '2026-07-22',
    day: 'Wednesday',
    serviceName: 'Mercy/Seeker Service',
    conductor: 'Evang. S. Adebayo',
    firstLesson: 'Exodus 15:20-27',
    firstLessonReader: 'Sis. Rebecca Sowemimo',
    secondLesson: 'Matthew 5:1-12',
    secondLessonReader: 'Bro. Emmanuel Falola',
    sermoner: 'Prophetess M. Sodipo'
  },
  {
    id: 'SRV-003',
    date: '2026-07-24',
    day: 'Friday',
    serviceName: 'Power & Mercy Hour Vigil',
    conductor: 'Leader F. Falola',
    firstLesson: 'Psalm 51:1-19',
    firstLessonReader: 'Bro. Joseph Alao',
    secondLesson: 'Luke 18:1-14',
    secondLessonReader: 'Sis. Grace Adeniran',
    sermoner: 'Evang. A. Ajayi'
  }
];

// Shepherd Unit Initial Data
export const initialCounselingSessions: CounselingSession[] = [
  { id: 'CNS-001', time: '09:00 AM', date: 'Today', memberName: 'Sarah Jenkins', topic: 'Spiritual', status: 'Scheduled' },
  { id: 'CNS-002', time: '11:30 AM', date: 'Today', memberName: 'Marcus Rowe', topic: 'Family', status: 'Scheduled' },
  { id: 'CNS-003', time: '02:00 PM', date: 'Oct 26, 2023', memberName: 'Eleanor Davis', topic: 'Guidance', status: 'Scheduled' },
  { id: 'CNS-004', time: '04:00 PM', date: 'Oct 24, 2023', memberName: 'John Doe', topic: 'Spiritual', status: 'Completed' },
];

export const initialSacramentalRegistries: SacramentalRegistry[] = [
  { id: 'BPT-8942', type: 'Baptism', candidateName: 'Elias Thorne', date: 'Oct 29, 2023', status: 'Pending' },
  { id: 'NAM-3310', type: 'Naming', candidateName: 'Aria Vance', date: 'Nov 05, 2023', status: 'Pending' },
  { id: 'BPT-8941', type: 'Baptism', candidateName: 'Julian Mercer', date: 'Oct 15, 2023', status: 'Performed' },
];

export const initialSpiritualLogistics: SpiritualLogistic[] = [
  { id: 'LOG-01', name: 'Altar Arrangements', status: 'Prepared', detail: 'Prepared for Sunday Service' },
  { id: 'LOG-02', name: 'Service Liturgies', status: 'Pending', detail: 'Needs Printing (50 copies)' },
  { id: 'LOG-03', name: 'Baptismal Font', status: 'Scheduled', detail: 'Scheduled for detailed cleaning on Friday' },
];

export const initialChurchWorkers: ChurchWorker[] = [
  { id: 'WRK-001', name: 'Sup. Evang. J. Olamide', rank: 'Superior Evangelist', role: 'Parish Shepherd', contact: '+234 803 111 2222', status: 'Active' },
  { id: 'WRK-002', name: 'Evang. S. Adebayo', rank: 'Evangelist', role: 'Assistant Shepherd', contact: '+234 802 333 4444', status: 'Active' },
  { id: 'WRK-003', name: 'Leader F. Falola', rank: 'Leader', role: 'Altar Server Coordinator', contact: '+234 815 555 6666', status: 'Active' },
  { id: 'WRK-004', name: 'Wolader J. Kayode', rank: 'Wolader', role: 'Parish Warden', contact: '+234 809 777 8888', status: 'Active' },
  { id: 'WRK-005', name: 'Elder Sister M. Sodipo', rank: 'Elder Sister', role: 'Women Council rep', contact: '+234 811 999 0000', status: 'On Leave' }
];

// Prophets & Prophetesses Initial Data
export const initialServiceRosters: ServiceRoster[] = [
  {
    id: 'RST-001',
    date: 'Oct 25, 2023',
    serviceType: 'Wednesday Mercy Service',
    assignedProphets: [
      { name: 'Prophet John', initials: 'PJ', isPrimary: true },
      { name: 'Prophetess Mary', initials: 'PM', isPrimary: false }
    ],
    status: 'Confirmed'
  },
  {
    id: 'RST-002',
    date: 'Oct 27, 2023',
    serviceType: 'Friday Power Clinic',
    assignedProphets: [
      { name: 'Prophet Samuel', initials: 'PS', isPrimary: true },
      { name: 'Prophetess Sarah', initials: 'PS', isPrimary: false }
    ],
    status: 'Pending'
  },
  {
    id: 'RST-003',
    date: 'Oct 29, 2023',
    serviceType: 'Sunday Glorious Service',
    assignedProphets: [
      { name: 'Prophet David', initials: 'PD', isPrimary: true },
      { name: 'Prophetess Ruth', initials: 'PR', isPrimary: false }
    ],
    status: 'Confirmed'
  }
];

export const initialFastingSchedules: FastingSchedule[] = [
  { id: 'FST-01', title: '3-Day Dry Fast for Parish Preservation', dateRange: 'Oct 23 - Oct 25', type: 'Current Week', isActive: true },
  { id: 'FST-02', title: 'General Thanksgiving Prayer Chain', dateRange: 'Starts Nov 1, 6:00 AM', type: 'Next Week', isActive: false },
];

export const initialObservationLogs: ObservationLog[] = [
  {
    id: 'OBS-01',
    category: 'Parish Preservation',
    date: 'Oct 24',
    title: 'Vigilance during harvest season',
    content: 'Observed a strong spiritual prompting for increased spiritual fortification around the church premises leading up to the annual harvest thanksgiving. Recommended dedicated corporate prayer slots during Wednesday service.',
    author: 'Prophetess Mary',
    authorInitials: 'PM',
    severity: 'high'
  },
  {
    id: 'OBS-02',
    category: 'Youth Guidance',
    date: 'Oct 22',
    title: 'Direction for Youth Wing',
    content: 'Received quiet message concerning the upcoming youth leadership transition. Suggesting 3 days of localized seeking to clarify nominations before the general parish announcement is made.',
    author: 'Prophet John',
    authorInitials: 'PJ',
    severity: 'medium'
  },
  {
    id: 'OBS-03',
    category: 'General Welfare',
    date: 'Oct 20',
    title: 'Healing service preparation',
    content: 'Spiritual guidelines for the purification of the primary sanctuary ahead of next month\'s special healing service. Selected anointing oils are to be blessed by the Shepherd in charge.',
    author: 'Prophet Samuel',
    authorInitials: 'PS',
    severity: 'low'
  }
];

// Side Men/Women Initial Data
export const initialAttendanceLogs: ServiceAttendanceLog[] = [
  { id: 'ATT-01', date: 'Oct 22, 2023', serviceType: 'Sunday Devotional', men: 145, women: 180, children: 95, total: 420, offertoryBoxes: 6 },
  { id: 'ATT-02', date: 'Oct 18, 2023', serviceType: 'Wednesday Seeking', men: 45, women: 62, children: 12, total: 119, offertoryBoxes: 2 },
  { id: 'ATT-03', date: 'Oct 15, 2023', serviceType: 'Sunday Devotional', men: 152, women: 195, children: 110, total: 457, offertoryBoxes: 6 },
  { id: 'ATT-04', date: 'Oct 13, 2023', serviceType: 'Friday Night Vigil', men: 85, women: 112, children: 5, total: 202, offertoryBoxes: 3 },
];

export const initialSideRosters: SideRoster[] = [
  { id: 'SDR-01', name: 'John Doe', initials: 'JD', aisle: 'Center Main', arrivalTime: '08:30 AM', status: 'On Duty' },
  { id: 'SDR-02', name: 'Sarah Ojo', initials: 'SO', aisle: 'Left Wing', arrivalTime: '08:30 AM', status: 'On Duty' },
  { id: 'SDR-03', name: 'Michael Ade', initials: 'MA', aisle: 'Gallery', arrivalTime: '08:45 AM', status: 'On Duty' },
];

// Choir Unit Initial Data
export const initialHymns: Hymn[] = [
  { id: 'HYM-01', hymnNo: '001', title: 'Olorun Mimo, Eleda Ohun Gbogbo', language: 'Yoruba', theme: 'Praise', servicesUsed: 142 },
  { id: 'HYM-02', hymnNo: '045', title: 'Holy, Holy, Holy! Lord God Almighty!', language: 'English', theme: 'Adoration', servicesUsed: 89 },
  { id: 'HYM-03', hymnNo: '176', title: 'Eyin Eniyan Mimo, E Ho Ayo', language: 'Yoruba', theme: 'Thanksgiving', servicesUsed: 56 },
  { id: 'HYM-04', hymnNo: '302', title: 'When I Survey the Wondrous Cross', language: 'English', theme: 'Passion', servicesUsed: 24 },
  { id: 'HYM-05', hymnNo: '412', title: 'Oluwa, Eleda Wa', language: 'Yoruba', theme: 'Supplication', servicesUsed: 112 },
];

export const initialRobeInventory: RobeInventory = {
  total: 124,
  assigned: 93,
  inWash: 18,
  repairsNeeded: 13
};

export const initialChoirAttendance: ChoirMemberAttendance[] = [
  { id: 'CH-01', name: 'Sarah O.', initials: 'SO', voicePart: 'Soprano', status: 'Present', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDkgK8NquF7LpHVgT-PAeNYxWQHBjHSG-dmi42shY5VjUNRiVdU35RANiENdBq72h-YEF-MXiWo3hcEJSP6Akn2aDTkC-uBHcmVl-UR-Bu-fk91JURqA86Mp9z-LYWexRuZOZ8NI_UsVOAIO3Sii5f7RiytbzY-8gdRQsPi3Umhjos9Cjk28B1UKWrwjWZMBh9Q3ZLCuzwElla_dmnxIh25ZJ-SjfX6XH0LGtkb43MkII-7H5lq41Ck_Vv4-z3JQbdPEXSaTVsHKjg' },
  { id: 'CH-02', name: 'Ezekiel A.', initials: 'EA', voicePart: 'Tenor', status: 'Excused' },
  { id: 'CH-03', name: 'Matthew D.', initials: 'MD', voicePart: 'Bass', status: 'Absent', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfFf_KCx9kWDWAX3SG3BweuTtwagfbBsw9L8PtimgmSfhoHwoh__hHBOERsV-pmod4H_Fm-oQJK4XgAaiGFhtcCZJtFySAtBPkm8gzD_h2FbRpgCy9opH718_IHCmcbDUcxE8xtuwQm72TmzFOffHPqSJgfoX4yKgtRZl2ch8E2c-baqSisYTmt8r3Z8018oQ-YL0FGdShBLv_XP1v6Ut6AmMceLQ7tqCcjR30zecj3yHidwGimQBmy0hhZBmSDAg88FXE4enJbt5-' },
  { id: 'CH-04', name: 'Florence J.', initials: 'FJ', voicePart: 'Alto', status: 'Present' },
];

// Youth Wing Initial Data
export const initialYouthEvents: YouthEvent[] = [
  { id: 'YEV-01', month: 'Oct', day: '15', date: 'Oct 15', title: 'Annual Youth Retreat 2024', location: 'Main Sanctuary', eventId: 'YW-1042', registered: 120, capacity: 150 },
  { id: 'YEV-02', month: 'Oct', day: '22', date: 'Oct 22', title: 'Praise & Worship Night', location: 'Parish Hall', eventId: 'YW-1043', registered: 85, capacity: 200 },
];

export const initialSkillPrograms: SkillProgram[] = [
  { id: 'SKP-01', title: 'Web Development Basics', duration: '8 Weeks', enrolled: 24, status: 'Active', progress: 62.5, progressLabel: 'Week 5 of 8' },
  { id: 'SKP-02', title: 'Graphic Design Masterclass', duration: 'Starts Nov 1st', enrolled: 15, status: 'Upcoming', progress: 0, progressLabel: 'Not started' },
];

// Security Unit Initial Data
export const initialSecurityRoster: SecurityRoster[] = [
  { id: 'SEC-01', name: 'John Doe', initials: 'JD', guardId: '042', shift: 'Morning Shift', assignedGear: 'Radio, Keys (Main)', status: 'On Patrol' },
  { id: 'SEC-02', name: 'Mary Smith', initials: 'MS', guardId: '019', shift: 'Morning Shift', assignedGear: 'Radio, Tablet', status: 'Stationed' },
  { id: 'SEC-03', name: 'Robert Jones', initials: 'RJ', guardId: '088', shift: 'Morning Shift', assignedGear: 'Radio, Vehicle', status: 'Perimeter' },
];

export const initialPatrolLogs: PatrolLog[] = [
  { id: 'PLG-01', incId: 'INC-2023-11A', title: 'Clear', location: 'Main Sanctuary East Gate', time: 'Today, 08:30 AM', status: 'Clear', severity: 'low' },
  { id: 'PLG-02', incId: 'INC-2023-11B', title: 'Suspicious Vehicle', location: 'North Parking Lot', time: 'Today, 09:15 AM', status: 'Suspicious Vehicle', severity: 'high' },
  { id: 'PLG-03', incId: 'INC-2023-11C', title: 'Clear', location: 'Youth Wing Perimeter', time: 'Today, 10:00 AM', status: 'Clear', severity: 'low' },
];

// Media Unit Initial Data
export const initialStreams: LiveStreamSession[] = [
  { id: 'STR-001', title: 'Sunday Glorious Service Live Stream', platform: 'YouTube', status: 'Scheduled', viewers: 0, date: 'Next Sunday', time: '09:00 AM' },
  { id: 'STR-002', title: 'Friday Power Clinic - Prophetic Hour', platform: 'YouTube', status: 'Live', viewers: 342, date: 'Today', time: '06:00 PM' },
  { id: 'STR-003', title: 'Wednesday Mercy Midweek Service', platform: 'Facebook Live', status: 'Ended', viewers: 189, date: 'Yesterday', time: '05:30 PM' },
];

export const initialMediaEquipment: MediaEquipment[] = [
  { id: 'EQP-01', name: 'Blackmagic Pocket Cinema Camera 6K', category: 'Video', status: 'In Use', assignedCrew: 'Bro. Elijah' },
  { id: 'EQP-02', name: 'Behringer X32 Digital Mixer Console', category: 'Audio', status: 'Operational', assignedCrew: 'Sis. Esther' },
  { id: 'EQP-03', name: 'Aputure LS 300d II LED Studio Light', category: 'Lighting', status: 'Operational', assignedCrew: 'Bro. David' },
  { id: 'EQP-04', name: 'Live Stream Encoding PC (RTX 4070)', category: 'Computing', status: 'In Use', assignedCrew: 'Sis. Grace' },
  { id: 'EQP-05', name: 'Wireless Shure SLXD Lavalier Mic (Pair)', category: 'Audio', status: 'Needs Service', assignedCrew: 'None' },
];

export const initialMediaPublications: MediaPublication[] = [
  { id: 'PUB-001', title: 'Spiritual Fortification Sermon Clip', date: 'Yesterday', type: 'Social Clip', platform: 'Instagram / TikTok', status: 'Published', downloadsOrViews: 1250 },
  { id: 'PUB-002', title: 'Celestial Weekly Parish Newsletter - Issue 42', date: 'Today', type: 'Newsletter', platform: 'Email / Web', status: 'Published', downloadsOrViews: 420 },
  { id: 'PUB-003', title: 'Power Clinic: Spiritual Alert Audio Sermon', date: 'Oct 12, 2023', type: 'Audio Sermon', platform: 'Spotify / Apple Podcasts', status: 'Published', downloadsOrViews: 750 },
  { id: 'PUB-004', title: 'Annual Harvest Thanksgiving Trailer', date: 'In 2 days', type: 'Video Sermon', platform: 'YouTube / Facebook', status: 'Scheduled', downloadsOrViews: 0 },
];

export const initialMediaCrew: MediaCrew[] = [
  { id: 'CRW-01', name: 'Bro. Elijah', initials: 'BE', role: 'Camera Operator', status: 'Active', contact: '+1 (555) 102-3921' },
  { id: 'CRW-02', name: 'Sis. Esther', initials: 'SE', role: 'Sound Engineer', status: 'Active', contact: '+1 (555) 102-3922' },
  { id: 'CRW-03', name: 'Bro. David', initials: 'BD', role: 'Presenter', status: 'On Call', contact: '+1 (555) 102-3923' },
  { id: 'CRW-04', name: 'Sis. Grace', initials: 'SG', role: 'Stream Director', status: 'Active', contact: '+1 (555) 102-3924' },
];

export const initialProphetExecutives: UnitExecutive[] = [
  { id: 'PEX-01', name: 'Prophetess Mary Sodipo', rank: 'Senior Prophetess', office: 'President', contact: '+234 803 111 2221', status: 'Active' },
  { id: 'PEX-02', name: 'Prophet John Alao', rank: 'Senior Prophet', office: 'General Secretary', contact: '+234 802 333 4441', status: 'Active' },
  { id: 'PEX-03', name: 'Prophetess Sarah Cole', rank: 'Prophetess', office: 'Treasurer', contact: '+234 815 555 6661', status: 'Active' },
];

export const initialSideMenWomenExecutives: UnitExecutive[] = [
  { id: 'SEX-01', name: 'Bro. Samuel Adebiyi', rank: 'Senior Leader', office: 'Chairman', contact: '+234 803 111 2222', status: 'Active' },
  { id: 'SEX-02', name: 'Sis. Deborah Olatunji', rank: 'Elder Sister', office: 'Vice Chairperson', contact: '+234 802 333 4442', status: 'Active' },
  { id: 'SEX-03', name: 'Bro. Joseph Alao', rank: 'Leader', office: 'General Secretary', contact: '+234 815 555 6662', status: 'Active' },
];

export const initialChoirExecutives: UnitExecutive[] = [
  { id: 'CEX-01', name: 'Bro. Ebenezer Fabiyi', rank: 'Senior Leader', office: 'Choirmaster', contact: '+234 803 111 2223', status: 'Active' },
  { id: 'CEX-02', name: 'Sis. Rebecca Sowemimo', rank: 'Elder Sister', office: 'Assistant Choirmistress', contact: '+234 802 333 4443', status: 'Active' },
  { id: 'CEX-03', name: 'Bro. Emmanuel Falola', rank: 'Leader', office: 'Organist & Secretary', contact: '+234 815 555 6663', status: 'Active' },
];

export const initialYouthExecutives: UnitExecutive[] = [
  { id: 'YEX-01', name: 'Bro. Timothy Adebayo', rank: 'Brother', office: 'Youth Coordinator', contact: '+234 803 111 2224', status: 'Active' },
  { id: 'YEX-02', name: 'Sis. Grace Adeniran', rank: 'Sister', office: 'Assistant Coordinator', contact: '+234 802 333 4444', status: 'Active' },
  { id: 'YEX-03', name: 'Bro. Samson Olatunji', rank: 'Brother', office: 'Financial Secretary', contact: '+234 815 555 6664', status: 'Active' },
];

export const initialSecurityExecutives: UnitExecutive[] = [
  { id: 'SECEX-01', name: 'Bro. Gabriel Sodipo', rank: 'Senior Leader', office: 'Chief Security Officer', contact: '+234 803 111 2225', status: 'Active' },
  { id: 'SECEX-02', name: 'Bro. Peter Alao', rank: 'Leader', office: 'Patrol Supervisor', contact: '+234 802 333 4445', status: 'Active' },
  { id: 'SECEX-03', name: 'Sis. Ruth Adebiyi', rank: 'Sister', office: 'Intelligence & Roster Officer', contact: '+234 815 555 6665', status: 'Active' },
];

export const initialMediaExecutives: UnitExecutive[] = [
  { id: 'MEX-01', name: 'Bro. Elijah Sowemimo', rank: 'Leader', office: 'Media Director', contact: '+234 803 111 2226', status: 'Active' },
  { id: 'MEX-02', name: 'Sis. Esther Olamide', rank: 'Sister', office: 'Broadcasting Head', contact: '+234 802 333 4446', status: 'Active' },
  { id: 'MEX-03', name: 'Bro. David Cole', rank: 'Brother', office: 'Technical Supervisor', contact: '+234 815 555 6666', status: 'Active' },
];

export const initialParochialDignitaries: ParishDignitary[] = [
  { id: 'DIG-01', title: 'Church Matron (Baba Ijo)', name: 'Elder Chief Dr. J. O. Alao', contact: '+234 803 444 5555' },
  { id: 'DIG-02', title: 'Church Patron (Iya Ijo)', name: 'Elder Sister Chief Mrs. M. A. Adebayo', contact: '+234 802 555 6666' },
  { id: 'DIG-03', title: 'Father for the Children (Baba Eso)', name: 'Brother Chief S. O. Sowemimo', contact: '+234 815 666 7777' },
  { id: 'DIG-04', title: 'Mother for the Children (Iya Eso)', name: 'Sister Chief Mrs. E. O. Olatunji', contact: '+234 811 777 8888' },
];

export const initialHarvestCommittee: HarvestCommitteeMember[] = [
  { id: 'HCV-01', name: 'Evang. Moses Sodipo', role: 'Harvest Chairman', contact: '+234 809 123 4567', status: 'Active', responsibility: 'General administration and planning' },
  { id: 'HCV-02', name: 'Sis. Grace Adeniran', role: 'Harvest Secretary', contact: '+234 803 987 6543', status: 'Active', responsibility: 'Meeting minutes and correspondences' },
  { id: 'HCV-03', name: 'Bro. Emmanuel Falola', role: 'Harvest Treasurer', contact: '+234 815 456 7890', status: 'Active', responsibility: 'Bazaar sales & donation ledger' },
];

export const initialEvangelistExecutives: UnitExecutive[] = [
  { id: 'EVEX-01', name: 'Most Senior Evang. Samson Adeleke', rank: 'Most Senior Evangelist', office: 'Chairman', contact: '+234 803 234 5671', status: 'Active' },
  { id: 'EVEX-02', name: 'Senior Evang. John Dosunmu', rank: 'Senior Evangelist', office: 'Vice Chairman', contact: '+234 802 345 6782', status: 'Active' },
  { id: 'EVEX-03', name: 'Evang. Emmanuel Bamidele', rank: 'Evangelist', office: 'Secretary', contact: '+234 815 456 7893', status: 'Active' },
  { id: 'EVEX-04', name: 'Evang. Samuel Ogundipe', rank: 'Evangelist', office: 'PRO', contact: '+234 803 567 8904', status: 'Active' },
  { id: 'EVEX-05', name: 'Evang. Matthew Akinyemi', rank: 'Evangelist', office: 'Assistant Secretary', contact: '+234 811 678 9015', status: 'Active' },
  { id: 'EVEX-06', name: 'Evang. David Abioye', rank: 'Senior Evangelist', office: 'Financial Secretary', contact: '+234 809 789 0126', status: 'Active' },
  { id: 'EVEX-07', name: 'Evang. Timothy Olubode', rank: 'Evangelist', office: 'Treasurer', contact: '+234 802 890 1237', status: 'Active' },
  { id: 'EVEX-08', name: 'Evang. Peter Falana', rank: 'Most Senior Evangelist', office: 'Evangelism Coordinator', contact: '+234 816 901 2348', status: 'Active' },
  { id: 'EVEX-09', name: 'Evang. Michael Babatunde', rank: 'Evangelist', office: 'Welfare Officer', contact: '+234 805 012 3459', status: 'Active' },
];

export const initialEvangelistMissions: EvangelistMission[] = [
  {
    id: 'MSN-01',
    title: 'Great City-Wide Revival & Healing Crusade',
    theme: 'Light Out of Darkness (John 1:5)',
    date: '2026-09-18',
    time: '17:30 WAT',
    location: 'Ibara Central Square & Open Arena',
    leadSpeaker: 'Most Senior Evang. Samson Adeleke',
    status: 'Upcoming',
    targetSouls: 500,
    soulsWon: 0
  },
  {
    id: 'MSN-02',
    title: 'Hospital & Prison Evangelical Visitation',
    theme: 'Setting the Captives Free (Isaiah 61:1)',
    date: '2026-09-12',
    time: '10:00 WAT',
    location: 'State General Hospital & Correctional Annex',
    leadSpeaker: 'Senior Evang. John Dosunmu',
    status: 'Upcoming',
    targetSouls: 150,
    soulsWon: 0
  },
  {
    id: 'MSN-03',
    title: 'Rural Outstation Gospel Outreach',
    theme: 'Go Ye Into All The World (Mark 16:15)',
    date: '2026-08-28',
    time: '16:00 WAT',
    location: 'Wasimi Village Parish Field',
    leadSpeaker: 'Evang. Peter Falana',
    status: 'Completed',
    targetSouls: 200,
    soulsWon: 142
  }
];

export const initialSermonRoster: SermonRosterItem[] = [
  {
    id: 'SRM-01',
    date: '2026-09-13',
    service: 'Sunday Devotional Service',
    evangelist: 'Most Senior Evang. Samson Adeleke',
    rank: 'Most Senior Evangelist',
    topic: 'Walking in Holy Spiritual Obedience',
    scripture: '1 Samuel 15:22; James 1:22-25',
    status: 'Scheduled'
  },
  {
    id: 'SRM-02',
    date: '2026-09-16',
    service: 'Wednesday Mercy Service',
    evangelist: 'Evang. Emmanuel Bamidele',
    rank: 'Evangelist',
    topic: 'The Mercy of God in Times of Trouble',
    scripture: 'Psalm 103:1-12; Lamentations 3:22',
    status: 'Scheduled'
  },
  {
    id: 'SRM-03',
    date: '2026-09-18',
    service: 'Friday Power & Healing',
    evangelist: 'Senior Evang. John Dosunmu',
    rank: 'Senior Evangelist',
    topic: 'The Power of Divine Deliverance',
    scripture: 'Obadiah 1:17; Mark 16:17-18',
    status: 'Scheduled'
  },
  {
    id: 'SRM-04',
    date: '2026-09-06',
    service: 'Sunday Devotional Service',
    evangelist: 'Evang. Samuel Ogundipe',
    rank: 'Evangelist',
    topic: 'The Fruit of Righteousness in the Sanctuary',
    scripture: 'Galatians 5:22-26; Matthew 5:14-16',
    status: 'Delivered'
  }
];

export const initialConverts: ConvertRecord[] = [
  {
    id: 'CVT-01',
    name: 'Babatunde Joshua',
    contact: '+234 803 765 4321',
    outreachEvent: 'Rural Outstation Gospel Outreach',
    dateJoined: '2026-08-28',
    assignedCounselor: 'Evang. Michael Babatunde',
    spiritualStage: 'In Bible Doctrine Class',
    notes: 'Desires water baptism and dedicated to Sunday worship.'
  },
  {
    id: 'CVT-02',
    name: 'Kemi Blessing Adebisi',
    contact: '+234 812 345 6789',
    outreachEvent: 'Rural Outstation Gospel Outreach',
    dateJoined: '2026-08-28',
    assignedCounselor: 'Evang. Emmanuel Bamidele',
    spiritualStage: 'Baptism Candidate',
    notes: 'Completed foundational doctrine class; approved for baptism immersion.'
  },
  {
    id: 'CVT-03',
    name: 'Olumide Segun Williams',
    contact: '+234 809 112 2334',
    outreachEvent: 'Mid-Year Revival Outreach',
    dateJoined: '2026-07-14',
    assignedCounselor: 'Senior Evang. John Dosunmu',
    spiritualStage: 'Full Member',
    notes: 'Baptized, actively attending weekly services, joining Bible study group.'
  }
];

export const initialOrdainedEvangelists: OrdainedEvangelist[] = [
  { id: 'ORD-01', name: 'Most Senior Evang. Samson Adeleke', rank: 'Most Senior Evangelist', anointingYear: 2008, assignedZone: 'Cathedral Central / Main Pulpit', contact: '+234 803 234 5671', status: 'Active' },
  { id: 'ORD-02', name: 'Senior Evang. John Dosunmu', rank: 'Senior Evangelist', anointingYear: 2012, assignedZone: 'District Outreach & Hospital Missions', contact: '+234 802 345 6782', status: 'Active' },
  { id: 'ORD-03', name: 'Most Senior Evang. Peter Falana', rank: 'Most Senior Evangelist', anointingYear: 2005, assignedZone: 'Crusade & Church Planting Field', contact: '+234 816 901 2348', status: 'On Itinerant Mission' },
  { id: 'ORD-04', name: 'Evang. Emmanuel Bamidele', rank: 'Evangelist', anointingYear: 2018, assignedZone: 'Doctrinal Class & In-House Discipleship', contact: '+234 815 456 7893', status: 'Active' },
  { id: 'ORD-05', name: 'Evang. Samuel Ogundipe', rank: 'Evangelist', anointingYear: 2019, assignedZone: 'Public Relations & Street Evangelism', contact: '+234 803 567 8904', status: 'Active' },
  { id: 'ORD-06', name: 'Superior Evang. Felix Oladipo (Rtd)', rank: 'Superior Evangelist', anointingYear: 1994, assignedZone: 'Council of Elders / Advisory', contact: '+234 802 100 2000', status: 'Elder Statesman' }
];

// ==========================================
// 11 DEPARTMENTS - 3 KEY EXECUTIVES DIRECTORY
// (Chairman, Secretary, Treasurer)
// ==========================================
export const departmentKeyExecutives: Record<string, DepartmentExecutiveCredential[]> = {
  parochial: [
    { department: 'parochial', role: 'Chairman', username: 'Chairman', name: 'Ven. Superior Evang. O. A. Soyemi', rank: 'Venerable Superior Evangelist', phone: '+234 803 111 0001', email: 'chairman.council@ibaracathedral.org' },
    { department: 'parochial', role: 'Secretary', username: 'Secretary', name: 'Evang. Olusegun Faleti', rank: 'Evangelist', phone: '+234 803 222 0002', email: 'secretary.council@ibaracathedral.org' },
    { department: 'parochial', role: 'Treasurer', username: 'Treasurer', name: 'Mother in Celestial B. A. Adebiyi', rank: 'Mother in Celestial', phone: '+234 803 333 0003', email: 'treasurer.council@ibaracathedral.org' },
  ],
  shepherd: [
    { department: 'shepherd', role: 'Chairman', username: 'Chairman', name: 'Superior Evang. I. O. Akande', rank: 'Shepherd-in-Charge', phone: '+234 803 444 0004', email: 'shepherd@ibaracathedral.org' },
    { department: 'shepherd', role: 'Secretary', username: 'Secretary', name: 'Bro. Emmanuel Adeleke', rank: 'Senior Leader', phone: '+234 803 555 0005', email: 'shepherd.sec@ibaracathedral.org' },
    { department: 'shepherd', role: 'Treasurer', username: 'Treasurer', name: 'Mother Celestial Victoria Odu', rank: 'Mother Celestial', phone: '+234 803 666 0006', email: 'shepherd.treasurer@ibaracathedral.org' },
  ],
  evangelist: [
    { department: 'evangelist', role: 'Chairman', username: 'Chairman', name: 'Most Senior Evang. Samson Adeleke', rank: 'Most Senior Evangelist', phone: '+234 803 234 5671', email: 'evangelist.chair@ibaracathedral.org' },
    { department: 'evangelist', role: 'Secretary', username: 'Secretary', name: 'Senior Evang. John Dosunmu', rank: 'Senior Evangelist', phone: '+234 802 345 6782', email: 'evangelist.sec@ibaracathedral.org' },
    { department: 'evangelist', role: 'Treasurer', username: 'Treasurer', name: 'Evang. Samuel Ogundipe', rank: 'Evangelist', phone: '+234 803 567 8904', email: 'evangelist.treasurer@ibaracathedral.org' },
  ],
  prophets: [
    { department: 'prophets', role: 'Chairman', username: 'Chairman', name: 'Most Superior Pro. Michael Ogunbiyi', rank: 'Most Superior Prophet', phone: '+234 803 777 0007', email: 'prophets.chair@ibaracathedral.org' },
    { department: 'prophets', role: 'Secretary', username: 'Secretary', name: 'Prophetess Mary Olatunji', rank: 'Senior Prophetess', phone: '+234 803 888 0008', email: 'prophets.sec@ibaracathedral.org' },
    { department: 'prophets', role: 'Treasurer', username: 'Treasurer', name: 'Prophet Isaac Oladipupo', rank: 'Prophet', phone: '+234 803 999 0009', email: 'prophets.treasurer@ibaracathedral.org' },
  ],
  side_men_women: [
    { department: 'side_men_women', role: 'Chairman', username: 'Chairman', name: 'Bro. Samuel Adekunle', rank: 'Honorary Senior Leader', phone: '+234 805 111 2233', email: 'sidesmen.chair@ibaracathedral.org' },
    { department: 'side_men_women', role: 'Secretary', username: 'Secretary', name: 'Sis. Dorcas Oladele', rank: 'Lace Superior Elder Sister', phone: '+234 805 222 3344', email: 'sidesmen.sec@ibaracathedral.org' },
    { department: 'side_men_women', role: 'Treasurer', username: 'Treasurer', name: 'Bro. Kayode Ogundele', rank: 'Leader', phone: '+234 805 333 4455', email: 'sidesmen.treasurer@ibaracathedral.org' },
  ],
  choir: [
    { department: 'choir', role: 'Chairman', username: 'Chairman', name: 'Bro. David Babalola', rank: 'Choir Master / Chairman', phone: '+234 806 123 4567', email: 'choir.master@ibaracathedral.org' },
    { department: 'choir', role: 'Secretary', username: 'Secretary', name: 'Sis. Grace Awolowo', rank: 'Choir General Secretary', phone: '+234 806 234 5678', email: 'choir.sec@ibaracathedral.org' },
    { department: 'choir', role: 'Treasurer', username: 'Treasurer', name: 'Bro. Femi Adegoke', rank: 'Choir Financial Officer', phone: '+234 806 345 6789', email: 'choir.treasurer@ibaracathedral.org' },
  ],
  youth: [
    { department: 'youth', role: 'Chairman', username: 'Chairman', name: 'Bro. Ayodele Oyelakin', rank: 'Youth President', phone: '+234 807 111 2222', email: 'youth.chair@ibaracathedral.org' },
    { department: 'youth', role: 'Secretary', username: 'Secretary', name: 'Sis. Temitope Sowunmi', rank: 'Youth General Secretary', phone: '+234 807 333 4444', email: 'youth.sec@ibaracathedral.org' },
    { department: 'youth', role: 'Treasurer', username: 'Treasurer', name: 'Bro. Damilola George', rank: 'Youth Treasurer', phone: '+234 807 555 6666', email: 'youth.treasurer@ibaracathedral.org' },
  ],
  security: [
    { department: 'security', role: 'Chairman', username: 'Chairman', name: 'Capt. Oluwaseun Martins', rank: 'Chief Security Officer', phone: '+234 808 111 0000', email: 'security.cso@ibaracathedral.org' },
    { department: 'security', role: 'Secretary', username: 'Secretary', name: 'Bro. Sunday Adeyemi', rank: 'Security Operations Secretary', phone: '+234 808 222 0000', email: 'security.sec@ibaracathedral.org' },
    { department: 'security', role: 'Treasurer', username: 'Treasurer', name: 'Bro. Segun Ajayi', rank: 'Security Logistics Officer', phone: '+234 808 333 0000', email: 'security.treasurer@ibaracathedral.org' },
  ],
  media: [
    { department: 'media', role: 'Chairman', username: 'Chairman', name: 'Bro. Michael Akinwunmi', rank: 'Media Director / Chairman', phone: '+234 809 111 2222', email: 'media.director@ibaracathedral.org' },
    { department: 'media', role: 'Secretary', username: 'Secretary', name: 'Sis. Folashade Adeyemi', rank: 'Media Secretariat Lead', phone: '+234 809 333 4444', email: 'media.sec@ibaracathedral.org' },
    { department: 'media', role: 'Treasurer', username: 'Treasurer', name: 'Bro. Kunle Olatunbosun', rank: 'Media Equipment Custodian', phone: '+234 809 555 6666', email: 'media.treasurer@ibaracathedral.org' },
  ],
  medical: [
    { department: 'medical', role: 'Chairman', username: 'Chairman', name: 'Dr. Emmanuel Adeyemi (MBBS, FWACS)', rank: 'Chief Medical Director / Chairman', phone: '+234 802 777 8899', email: 'medical.cmd@ibaracathedral.org' },
    { department: 'medical', role: 'Secretary', username: 'Secretary', name: 'Nurse Olubunmi Sowande (RN, RM)', rank: 'Nurse Lead / General Secretary', phone: '+234 802 888 9900', email: 'medical.sec@ibaracathedral.org' },
    { department: 'medical', role: 'Treasurer', username: 'Treasurer', name: 'Pharm. Segun Dosunmu (B.Pharm)', rank: 'Pharmacy Director / Treasurer', phone: '+234 802 999 1122', email: 'medical.treasurer@ibaracathedral.org' },
  ],
  bible_fellowship: [
    { department: 'bible_fellowship', role: 'Chairman', username: 'Chairman', name: 'Elder Gabriel Ojo', rank: 'Fellowship Chairman / Elder', phone: '+234 803 900 1234', email: 'fellowship.chair@ibaracathedral.org' },
    { department: 'bible_fellowship', role: 'Secretary', username: 'Secretary', name: 'Sis. Deborah Alabi', rank: 'General Secretary', phone: '+234 803 900 2345', email: 'fellowship.sec@ibaracathedral.org' },
    { department: 'bible_fellowship', role: 'Treasurer', username: 'Treasurer', name: 'Mother in Celestial Funke Sowande', rank: 'Mother in Celestial / Treasurer', phone: '+234 803 900 3456', email: 'fellowship.treasurer@ibaracathedral.org' },
  ],
};

// Executive Initial Action Items & Records
export const initialExecutiveRecords: DepartmentExecutiveRecord[] = [
  { id: 'EXE-PAR-01', department: 'parochial', role: 'Chairman', title: 'Approval of 2026 Cathedral Expansion Blueprints', description: 'Formally endorsed civil architectural survey and authorized release of phase 1 mobilization funds.', date: '2026-10-02', status: 'Approved', author: 'Ven. Superior Evang. O. A. Soyemi', amount: 4500000 },
  { id: 'EXE-PAR-02', department: 'parochial', role: 'Secretary', title: 'Diocesan Secretariat Statutory Dispatch Filing', description: 'Coordinated quarterly diocesan returns and harmonized 11-department performance metrics.', date: '2026-10-04', status: 'Recorded', author: 'Evang. Olusegun Faleti' },
  { id: 'EXE-PAR-03', department: 'parochial', role: 'Treasurer', title: 'Cathedral Account Reconciliation & Audit Endorsement', description: 'Audited monthly offertory, tithe remittances, and verified bank deposit receipts with signature.', date: '2026-10-06', status: 'Approved', author: 'Mother in Celestial B. A. Adebiyi', amount: 8920500 },
  
  { id: 'EXE-CHO-01', department: 'choir', role: 'Chairman', title: 'Approval of 2026 Adult Harvest Cantata Repertoire', description: 'Approved 12 classical hymns and 3 orchestral compositions for cathedral harvest festival.', date: '2026-10-01', status: 'Approved', author: 'Bro. David Babalola' },
  { id: 'EXE-CHO-02', department: 'choir', role: 'Secretary', title: 'Quarterly Rehearsal Attendance & Discipline Sanction', description: 'Compiled 85% attendance quorum and issued circular on punctuality for 4:00 PM Friday rehearsals.', date: '2026-10-03', status: 'Recorded', author: 'Sis. Grace Awolowo' },
  { id: 'EXE-CHO-03', department: 'choir', role: 'Treasurer', title: 'Instrument Maintenance & Robe Laundering Disbursement', description: 'Disbursed quarterly maintenance fund for Hammond organ, Yamaha drumkit, and 120 cassock robes.', date: '2026-10-05', status: 'Approved', author: 'Bro. Femi Adegoke', amount: 285000 },

  { id: 'EXE-MED-01', department: 'medical', role: 'Chairman', title: 'Cathedral First Aid Post Accreditation & Protocols', description: 'Established emergency oxygen therapy and rapid ambulance transfer protocol for Sunday services.', date: '2026-09-28', status: 'Approved', author: 'Dr. Emmanuel Adeyemi' },
  { id: 'EXE-MED-02', department: 'medical', role: 'Secretary', title: 'Medical Supply Stock Audit & First Aid Inventory', description: 'Logged replenishment of 500 emergency tablets, glucometer strips, and 6 digital sphygmomanometers.', date: '2026-10-03', status: 'Recorded', author: 'Nurse Olubunmi Sowande' },
  { id: 'EXE-MED-03', department: 'medical', role: 'Treasurer', title: 'Quarterly Pharmaceutical Stock Procurement Requisition', description: 'Approved budget release for emergency medications, glucose D infusions, and oxygen cylinders.', date: '2026-10-05', status: 'Approved', author: 'Pharm. Segun Dosunmu', amount: 320000 },
];

// ==========================================
// SECRETARY OFFICIAL MINUTES & REGISTRY RECORDS
// (Dedicated records for each Department Secretary Desk)
// ==========================================
export const initialDepartmentSecretaryRecords: DepartmentSecretaryRecord[] = [
  {
    id: 'SEC-PAR-01',
    department: 'parochial',
    title: 'Parish Council Executive 142nd Statutory Assembly Minutes',
    meetingType: 'Statutory Council',
    date: '2026-10-04',
    time: '16:00 - 18:30',
    quorumCount: 16,
    secretaryAuthor: 'Evang. Olusegun Faleti',
    keyResolutions: 'Ratified harvest logistics timetable; confirmed security deployment for eastern perimeter gate; acknowledged submission of quarterly financial report by Parochial Treasurer.',
    attendees: 'Council Chairman, Shepherd-in-Charge, Parochial Secretary, Parochial Treasurer, 12 Unit Trustees',
    archivedStatus: 'Official Recorded'
  },
  {
    id: 'SEC-CHO-01',
    department: 'choir',
    title: 'The Model Choir Executive & Section Leaders Repertoire Review',
    meetingType: 'Statutory Council',
    date: '2026-10-03',
    time: '17:00 - 19:00',
    quorumCount: 12,
    secretaryAuthor: 'Sis. Grace Awolowo',
    keyResolutions: 'Finalized 12 hymns and 3 classical anthems for the Adult Harvest Cantata; set mandatory 85% attendance benchmark for choir robes allocation.',
    attendees: 'Choir Master/Chairman, Choir Secretary, Choir Treasurer, Organist Lead, 4 Voice Part Leads',
    archivedStatus: 'Official Recorded'
  },
  {
    id: 'SEC-MED-01',
    department: 'medical',
    title: 'Medical Directorate Clinical Protocols & Triage Preparedness Meeting',
    meetingType: 'Emergency Session',
    date: '2026-10-02',
    time: '14:30 - 16:00',
    quorumCount: 6,
    secretaryAuthor: 'Nurse Olubunmi Sowande',
    keyResolutions: 'Demarcated emergency ambulance bay with Security unit; audited portable oxygen cylinders and glucometer test strips; established rota for Sunday clinics.',
    attendees: 'Chief Medical Director, Nurse Lead (Secretary), Pharmacy Lead (Treasurer), 3 Triage Nurses',
    archivedStatus: 'Official Recorded'
  },
  {
    id: 'SEC-SEC-01',
    department: 'security',
    title: 'Security Enforcement Directorate Harvest Perimeter Briefing',
    meetingType: 'Statutory Council',
    date: '2026-10-04',
    time: '15:00 - 16:45',
    quorumCount: 10,
    secretaryAuthor: 'Bro. Sunday Adeyemi',
    keyResolutions: 'Approved one-way traffic routing through eastern drainage gate; mandated hourly nocturnal patrols; requested 3 high-intensity searchlights from Council.',
    attendees: 'Chief Security Officer, Operations Secretary, Logistics Officer (Treasurer), 7 Zone Wardens',
    archivedStatus: 'Official Recorded'
  },
  {
    id: 'SEC-EVG-01',
    department: 'evangelist',
    title: 'Evangelism Council Outreach Review & Discipleship Class Roster',
    meetingType: 'Statutory Council',
    date: '2026-10-01',
    time: '16:00 - 17:30',
    quorumCount: 8,
    secretaryAuthor: 'Senior Evang. John Dosunmu',
    keyResolutions: 'Registered 16 converts from Brewery junction open-air mission; assigned counselors for baptism doctrine class; designated sermon preachers for harvest revivals.',
    attendees: 'Council Chairman, Council Secretary, Council Treasurer, 5 Zone Evangelists',
    archivedStatus: 'Official Recorded'
  },
  {
    id: 'SEC-GEN-01',
    department: 'shepherd',
    title: 'Shepherd & Church Workers Sacramental Duty & Altar Vigil Roster',
    meetingType: 'Statutory Council',
    date: '2026-10-02',
    time: '11:00 - 13:00',
    quorumCount: 9,
    secretaryAuthor: 'Bro. Emmanuel Adeleke',
    keyResolutions: 'Confirmed altar washing and incense schedules for October; scheduled pastoral home visits for elderly members; ratified pastoral counseling appointments.',
    attendees: 'Shepherd-in-Charge, Unit Secretary, Unit Treasurer, 6 Senior Church Workers',
    archivedStatus: 'Official Recorded'
  }
];

// ==========================================
// TREASURER OFFICIAL FINANCIAL VOUCHERS & LEDGERS
// (Dedicated records for each Department Treasurer Desk)
// ==========================================
export const initialDepartmentTreasurerRecords: DepartmentTreasurerRecord[] = [
  {
    id: 'TREAS-PAR-01',
    department: 'parochial',
    voucherCode: 'VCH-PAR-2026-041',
    category: 'Remittance to Parochial Purse',
    description: 'Cathedral weekly tithes & thanksgiving bank remittance reconciliation',
    amount: 8920500,
    date: '2026-10-06',
    payee: 'CCC Ibara Cathedral Central Account',
    paymentMethod: 'Bank Transfer',
    treasurerSignee: 'Mother in Celestial B. A. Adebiyi',
    auditStatus: 'Audited & Cleared'
  },
  {
    id: 'TREAS-CHO-01',
    department: 'choir',
    voucherCode: 'VCH-CHO-2026-018',
    category: 'Equipment Maintenance',
    description: 'Quarterly servicing of cathedral Hammond organ, Yamaha drums, and 120 cassock robes dry cleaning',
    amount: 285000,
    date: '2026-10-05',
    payee: 'Acoustic Sound Masters & Divine Cleaners',
    paymentMethod: 'Bank Transfer',
    treasurerSignee: 'Bro. Femi Adegoke',
    auditStatus: 'Audited & Cleared'
  },
  {
    id: 'TREAS-MED-01',
    department: 'medical',
    voucherCode: 'VCH-MED-2026-009',
    category: 'Sacramental Supplies',
    description: 'Procurement of emergency clinic consumables, ORS sachets, paracetamol, and glucometer strips',
    amount: 320000,
    date: '2026-10-05',
    payee: 'Mercyview Pharmaceuticals Ltd',
    paymentMethod: 'Bank Transfer',
    treasurerSignee: 'Pharm. Segun Dosunmu',
    auditStatus: 'Audited & Cleared'
  },
  {
    id: 'TREAS-SEC-01',
    department: 'security',
    voucherCode: 'VCH-SEC-2026-014',
    category: 'Logistics & Requisition',
    description: 'Procurement of 100m perimeter warning tape, 3 high-intensity searchlights, and raincoats',
    amount: 145000,
    date: '2026-10-04',
    payee: 'Apex Safety Gear Depot',
    paymentMethod: 'Petty Cash Cashier',
    treasurerSignee: 'Bro. Segun Ajayi',
    auditStatus: 'Audited & Cleared'
  },
  {
    id: 'TREAS-EVG-01',
    department: 'evangelist',
    voucherCode: 'VCH-EVG-2026-007',
    category: 'Honorarium & Benevolence',
    description: 'Outreach vehicle fueling and public address speaker battery recharge for Brewery junction crusade',
    amount: 85000,
    date: '2026-10-01',
    payee: 'City Sound Equipment & Fuel Station',
    paymentMethod: 'Petty Cash Cashier',
    treasurerSignee: 'Evang. Samuel Ogundipe',
    auditStatus: 'Audited & Cleared'
  },
  {
    id: 'TREAS-SHP-01',
    department: 'shepherd',
    voucherCode: 'VCH-SHP-2026-022',
    category: 'Sacramental Supplies',
    description: 'Special frankincense resin, white devotional candles, altar linens, and olive oil',
    amount: 210000,
    date: '2026-10-03',
    payee: 'Cathedral Sacred Supply Guild',
    paymentMethod: 'Bank Transfer',
    treasurerSignee: 'Mother Celestial Victoria Odu',
    auditStatus: 'Audited & Cleared'
  }
];

// ==========================================
// CENTRAL SECRETARIAT DISSEMINATION DISPATCHES
// (From Parochial Secretary to All 11 Department Secretaries)
// ==========================================
export const initialSecretariatDispatches: SecretariatDispatch[] = [
  {
    id: 'DSP-2026-001',
    memoNumber: 'CCCI/SEC/2026/048',
    title: 'Submission of 2026 Annual Harvest Departmental Budgets & Duty Rosters',
    category: 'Parish Council Resolution',
    priority: 'High Priority',
    dateDispatched: '2026-10-05',
    deadline: '2026-10-18',
    author: 'Evang. Olusegun Faleti (Parochial Secretary)',
    summary: 'All Departmental Secretaries are mandated to collate and submit harmonized annual harvest budget forecasts and liturgical rosters.',
    fullBody: 'Calvary greetings in the name of our Lord Jesus Christ. By order of the Parish Council Executive presided over by the Shepherd-in-Charge and Council Chairman, all Departmental Secretaries (The Model Choir, Council of Honorary Evangelists, Council of Sidesmen & Sideswomen, Security Enforcement Team, Medical Team, Media Team, Youth Council, Council of Prophet & Prophetess, Shepherd & Church Workers, and MC & Women Bible Fellowship) are hereby instructed to submit their final Annual Adult Harvest preparations dossier no later than Monday, October 18, 2026.\n\nPlease ensure your respective Chairman and Treasurer endorse your submission before transmission to the Secretariat Registry.',
    targetDepartments: 'ALL',
    acknowledgments: [
      { department: 'parochial', departmentLabel: 'Parish Council Executive', secretaryName: 'Evang. Olusegun Faleti', acknowledged: true, acknowledgedAt: '2026-10-05 09:30', remarks: 'Originated and stamped at General Secretariat.' },
      { department: 'choir', departmentLabel: 'The Model Choir', secretaryName: 'Sis. Grace Awolowo', acknowledged: true, acknowledgedAt: '2026-10-05 11:15', remarks: 'Received. Choir cantata budget and robe roster will be uploaded ahead of deadline.' },
      { department: 'security', departmentLabel: 'Security Enforcement Team', secretaryName: 'Bro. Sunday Adeyemi', acknowledged: true, acknowledgedAt: '2026-10-05 13:40', remarks: 'Acknowledged. Traffic control, perimeter security, and parking permits logistics ready.' },
      { department: 'medical', departmentLabel: 'Medical Team', secretaryName: 'Nurse Olubunmi Sowande', acknowledged: true, acknowledgedAt: '2026-10-05 14:05', remarks: 'Acknowledged. Mobile clinic and ambulance standby team approved by CMD Dr. Adeyemi.' },
      { department: 'evangelist', departmentLabel: 'Council of Honorary Evangelists', secretaryName: 'Senior Evang. John Dosunmu', acknowledged: false },
      { department: 'prophets', departmentLabel: 'Council of Prophet & Prophetess', secretaryName: 'Prophetess Mary Olatunji', acknowledged: false },
      { department: 'side_men_women', departmentLabel: 'Council of Sidesmen & Sideswomen', secretaryName: 'Sis. Dorcas Oladele', acknowledged: false },
      { department: 'youth', departmentLabel: 'Youth Council', secretaryName: 'Sis. Temitope Sowunmi', acknowledged: false },
      { department: 'media', departmentLabel: 'Media Team', secretaryName: 'Sis. Folashade Adeyemi', acknowledged: false },
      { department: 'shepherd', departmentLabel: 'Shepherd & Church Workers', secretaryName: 'Bro. Emmanuel Adeleke', acknowledged: true, acknowledgedAt: '2026-10-05 10:00', remarks: 'Shepherd desk in full agreement.' },
      { department: 'bible_fellowship', departmentLabel: 'MC & Women Bible Fellowship', secretaryName: 'Sis. Deborah Alabi', acknowledged: false },
    ],
    replies: [
      {
        id: 'REP-01',
        department: 'choir',
        secretaryName: 'Sis. Grace Awolowo (The Model Choir Secretary)',
        date: '2026-10-05 11:20',
        message: 'Dear Parochial Secretary, we have noted the deadline. Our Choir Executive will hold emergency review on Thursday to finalize instrument sound gear line-items.'
      },
      {
        id: 'REP-02',
        department: 'medical',
        secretaryName: 'Nurse Olubunmi Sowande (Medical Team Secretary)',
        date: '2026-10-05 14:10',
        message: 'Formal acknowledgment registered. We request additional shade canopy behind the south altar for our triage stabilization unit during the Thanksgiving service.'
      }
    ]
  },
  {
    id: 'DSP-2026-002',
    memoNumber: 'CCCI/SEC/2026/049',
    title: 'Directive on Sanctuary Order, Crowd Management & Security Perimeter',
    category: 'Urgent Executive Directive',
    priority: 'Emergency',
    dateDispatched: '2026-10-07',
    deadline: '2026-10-10',
    author: 'Evang. Olusegun Faleti (Parochial Secretary)',
    summary: 'Joint operational coordination between Security Enforcement Team, Council of Sidesmen & Sideswomen, and Media Team for upcoming Diocesan Visitation.',
    fullBody: 'Notice is hereby given for immediate synchronization between the Security Enforcement Team, Sidesmen & Sideswomen, and Media Team regarding inner cathedral security corridors during the arrival of visiting Diocesan Dignitaries this Sunday. All side aisles must remain unimpeded. Camera tripods must adhere to demarcated media staging platforms.',
    targetDepartments: ['security', 'side_men_women', 'media'],
    acknowledgments: [
      { department: 'security', departmentLabel: 'Security Enforcement Team', secretaryName: 'Bro. Sunday Adeyemi', acknowledged: true, acknowledgedAt: '2026-10-07 16:30', remarks: 'Joint briefing scheduled for Saturday 7:00 AM.' },
      { department: 'side_men_women', departmentLabel: 'Council of Sidesmen & Sideswomen', secretaryName: 'Sis. Dorcas Oladele', acknowledged: true, acknowledgedAt: '2026-10-07 17:15', remarks: 'Noted. Ushers informed of aisle restrictions.' },
      { department: 'media', departmentLabel: 'Media Team', secretaryName: 'Sis. Folashade Adeyemi', acknowledged: false }
    ],
    replies: [
      {
        id: 'REP-03',
        department: 'security',
        secretaryName: 'Bro. Sunday Adeyemi (Security Enforcement Secretary)',
        date: '2026-10-07 16:45',
        message: 'Barricade ribbons and perimeter checkpoint badges have been allocated. Will liaise directly with Sis. Dorcas Oladele.'
      }
    ]
  }
];

// ==========================================
// MEDICAL TEAM INITIAL DATA
// ==========================================
export const initialMedicalPersonnel: MedicalPersonnel[] = [
  { id: 'MED-01', name: 'Dr. Emmanuel Adeyemi (MBBS, FWACS)', profession: 'Medical Doctor', rank: 'Senior Leader', role: 'Chief Medical Officer', contact: '+234 802 777 8899', dutyStatus: 'On Duty' },
  { id: 'MED-02', name: 'Nurse Olubunmi Sowande (RN, RM)', profession: 'Registered Nurse', rank: 'Lace Elder Sister', role: 'Nurse Lead', contact: '+234 802 888 9900', dutyStatus: 'On Duty' },
  { id: 'MED-03', name: 'Pharm. Segun Dosunmu (B.Pharm)', profession: 'Pharmacist', rank: 'Senior Leader', role: 'Pharmacy Lead', contact: '+234 802 999 1122', dutyStatus: 'Standby' },
  { id: 'MED-04', name: 'Dr. (Mrs.) Folake Alabi (MBBS, MPH)', profession: 'Medical Doctor', rank: 'Mother in Celestial', role: 'Chief Medical Officer', contact: '+234 803 444 5566', dutyStatus: 'Standby' },
  { id: 'MED-05', name: 'Bro. Kehinde Oladipo (EMT)', profession: 'Paramedic', rank: 'Leader', role: 'Triage Responder', contact: '+234 813 555 7788', dutyStatus: 'On Duty' },
  { id: 'MED-06', name: 'Sis. Ronke Adeleke', profession: 'First Aider', rank: 'Elder Sister', role: 'Triage Responder', contact: '+234 816 777 9900', dutyStatus: 'Off Duty' },
];

export const initialClinicLogs: ClinicLog[] = [
  {
    id: 'CLN-2026-01',
    date: '2026-10-04',
    service: 'Sunday Devotional Service',
    patientName: 'Pa Matthew Adeleke (Age 74)',
    gender: 'Male',
    symptoms: 'Mild dizziness, elevated blood pressure during extended service hymns',
    vitals: { bp: '168/98 mmHg', pulse: '88 bpm', temp: '36.7 °C', bloodSugar: '112 mg/dL' },
    treatmentAdministered: 'Administered prescribed Amlodipine 5mg, rested in recovery bay with hydration',
    outcome: 'Discharged & Stabilized',
    attendingMedic: 'Dr. Emmanuel Adeyemi'
  },
  {
    id: 'CLN-2026-02',
    date: '2026-10-04',
    service: 'Sunday Devotional Service',
    patientName: 'Child Temiloluwa Bakare (Age 6)',
    gender: 'Child',
    symptoms: 'Blunt abrasion on right knee sustained during Sunday school transition',
    vitals: { bp: 'Normal', pulse: '92 bpm', temp: '36.5 °C' },
    treatmentAdministered: 'Cleaned with antiseptic solution, wound dressing with sterile gauze and elastoplast',
    outcome: 'Discharged & Stabilized',
    attendingMedic: 'Nurse Olubunmi Sowande'
  },
  {
    id: 'CLN-2026-03',
    date: '2026-10-02',
    service: 'Friday Power & Deliverance Vigil',
    patientName: 'Sis. Yetunde Babalola (Age 29)',
    gender: 'Female',
    symptoms: 'Hyperventilation and acute dehydration following 3-day white fasting',
    vitals: { bp: '100/65 mmHg', pulse: '104 bpm', temp: '37.1 °C', bloodSugar: '62 mg/dL' },
    treatmentAdministered: 'Oral rehydration salts, glucose infusion under nursing observation, rested 45 mins',
    outcome: 'Discharged & Stabilized',
    attendingMedic: 'Nurse Olubunmi Sowande'
  }
];

export const initialMedicalSupplies: MedicalSupply[] = [
  { id: 'SUP-01', itemName: 'Digital Blood Pressure Monitors (Omron M3)', category: 'Diagnostic', quantity: 6, unit: 'Units', expiryDate: '2029-12-31', status: 'Sufficient', location: 'Triage Desk A & B' },
  { id: 'SUP-02', itemName: 'Accu-Chek Glucometer Test Strips', category: 'Diagnostic', quantity: 180, unit: 'Strips', expiryDate: '2027-08-30', status: 'Sufficient', location: 'Diagnostic Cabinet' },
  { id: 'SUP-03', itemName: 'Emergency Portable Medical Oxygen Concentrator (10L)', category: 'Emergency Consumable', quantity: 2, unit: 'Cylinders', expiryDate: '2028-06-15', status: 'Sufficient', location: 'Emergency Bay' },
  { id: 'SUP-04', itemName: 'Sterile Gauze Bandages & Cotton Wool Rolls', category: 'First Aid', quantity: 45, unit: 'Packs', expiryDate: '2028-01-20', status: 'Sufficient', location: 'Trauma Bag 1' },
  { id: 'SUP-05', itemName: 'Paracetamol 500mg Tablets (Analgesic)', category: 'Medication', quantity: 24, unit: 'Blisters', expiryDate: '2027-05-14', status: 'Low Stock', location: 'Pharmacy Safe' },
  { id: 'SUP-06', itemName: 'Oral Rehydration Salts (ORS Sachets)', category: 'Medication', quantity: 85, unit: 'Sachets', expiryDate: '2027-11-20', status: 'Sufficient', location: 'Pharmacy Safe' },
  { id: 'SUP-07', itemName: 'Heavy Duty Emergency Folding Stretcher with Straps', category: 'Emergency Consumable', quantity: 3, unit: 'Units', expiryDate: '2030-01-01', status: 'Sufficient', location: 'Corridor Post' },
];

export const initialHealthOutreaches: HealthOutreachProgram[] = [
  { id: 'OUT-01', title: 'Cathedral Annual Free Hypertension & Diabetes Screening Week', targetAudience: 'All Parishioners & Ibara Community Residents', date: '2026-11-14', beneficiariesTarget: 800, leadCoordinator: 'Dr. Emmanuel Adeyemi', status: 'Upcoming' },
  { id: 'OUT-02', title: 'Children & Youth Vision and Dental Assessment Camp', targetAudience: 'Sunday School Pupils & Youth Council', date: '2026-12-05', beneficiariesTarget: 350, leadCoordinator: 'Dr. (Mrs.) Folake Alabi', status: 'Upcoming' },
  { id: 'OUT-03', title: 'Mid-Year Elderly Members Medical Check & Medication Support', targetAudience: 'Parishioners aged 65 and above', date: '2026-06-20', beneficiariesTarget: 220, leadCoordinator: 'Nurse Olubunmi Sowande', status: 'Completed' },
];

// ==========================================
// MC & WOMEN BIBLE FELLOWSHIP INITIAL DATA
// ==========================================
export const initialFellowshipLeaders: FellowshipLeader[] = [
  { id: 'LEAD-01', name: 'Elder Gabriel Ojo', rank: 'Honorary Senior Leader', office: 'Fellowship President / Chairman', wing: 'Joint Executive', contact: '+234 803 900 1234', status: 'Active' },
  { id: 'LEAD-02', name: 'Mother Celestial Beatrice Solanke', rank: 'Mother Celestial', office: 'Women Coordinator / Vice Chair', wing: 'Women Bible Fellowship', contact: '+234 803 900 4567', status: 'Active' },
  { id: 'LEAD-03', name: 'Sis. Deborah Alabi', rank: 'Lace Senior Elder Sister', office: 'General Secretary', wing: 'Joint Executive', contact: '+234 803 900 2345', status: 'Active' },
  { id: 'LEAD-04', name: 'Mother in Celestial Funke Sowande', rank: 'Mother in Celestial', office: 'Treasurer', wing: 'Joint Executive', contact: '+234 803 900 3456', status: 'Active' },
  { id: 'LEAD-05', name: 'Bro. Olawale Adekunle', rank: 'Senior Leader', office: 'Welfare Secretary', wing: 'Men Christian Fellowship', contact: '+234 803 900 5678', status: 'Active' },
  { id: 'LEAD-06', name: 'Evang. Elijah Ogunbiyi', rank: 'Evangelist', office: 'Bible Study Director', wing: 'Joint Executive', contact: '+234 803 900 6789', status: 'Active' },
  { id: 'LEAD-07', name: 'Most Superior Pro. Samuel Ajala', rank: 'Most Superior Prophet', office: 'Elder Patron / Matron', wing: 'Joint Executive', contact: '+234 803 900 7890', status: 'Honorary' },
];

export const initialBibleStudySyllabus: BibleStudySyllabus[] = [
  { id: 'SYL-01', weekNumber: 41, topic: 'The Fruit of the Spirit in the Christian Marriage & Home', biblePassage: 'Galatians 5:22-26; Ephesians 5:21-33', memoryVerse: '“But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith...” — Galatians 5:22', dateScheduled: '2026-10-13', facilitator: 'Evang. Elijah Ogunbiyi', wing: 'Joint Fellowship' },
  { id: 'SYL-02', weekNumber: 42, topic: 'Men of Faith: Walking as Spiritual Priest of the Household', biblePassage: 'Joshua 24:14-15; 1 Peter 3:7', memoryVerse: '“...as for me and my house, we will serve the Lord.” — Joshua 24:15', dateScheduled: '2026-10-20', facilitator: 'Elder Gabriel Ojo', wing: 'Men Fellowship' },
  { id: 'SYL-03', weekNumber: 43, topic: 'Virtuous Mothers in Celestial: The Pillar of Prayer & Hospitality', biblePassage: 'Proverbs 31:10-31; Titus 2:3-5', memoryVerse: '“She openeth her mouth with wisdom; and in her tongue is the law of kindness.” — Proverbs 31:26', dateScheduled: '2026-10-27', facilitator: 'Mother Celestial Beatrice Solanke', wing: 'Women Fellowship' },
  { id: 'SYL-04', weekNumber: 44, topic: 'Sanctified Stewardship & Raising Godly Children in the Last Days', biblePassage: 'Deuteronomy 6:4-9; Proverbs 22:6', memoryVerse: '“Train up a child in the way he should go: and when he is old, he will not depart from it.” — Prov 22:6', dateScheduled: '2026-11-03', facilitator: 'Bro. Olawale Adekunle', wing: 'Joint Fellowship' },
];

export const initialWelfareCases: WelfareBeneficiaryCase[] = [
  { id: 'WEL-01', caseId: 'WLF-2026-08', title: 'Monthly Stipend & Provisions for Cathedral Widows Fellowship', recipientCategory: 'Widow Welfare', dateAssisted: '2026-10-01', amountOrSupplies: '₦250,000 + 15 Food Hampers', coordinator: 'Bro. Olawale Adekunle', status: 'Disbursed' },
  { id: 'WEL-02', caseId: 'WLF-2026-09', title: 'Medical Relief Grant for Senior Elder Mama Olubunmi (Age 82)', recipientCategory: 'Elderly Member Support', dateAssisted: '2026-09-24', amountOrSupplies: '₦120,000 for Cataract surgery support', coordinator: 'Mother in Celestial Funke Sowande', status: 'Disbursed' },
  { id: 'WEL-03', caseId: 'WLF-2026-10', title: 'Naming Ceremony Blessings & Baby Essentials Gift Pack', recipientCategory: 'Newborn / Naming Gift', dateAssisted: '2026-10-03', amountOrSupplies: 'Baby Cot, Clothing, Diapers & ₦50,000 Gift', coordinator: 'Sis. Deborah Alabi', status: 'Disbursed' },
  { id: 'WEL-04', caseId: 'WLF-2026-11', title: 'Tertiary Academic Support Fund for 3 Fellowship Youths', recipientCategory: 'Educational Support', dateAssisted: '2026-10-06', amountOrSupplies: '₦300,000 (Tuition sponsorship)', coordinator: 'Elder Gabriel Ojo', status: 'Approved' },
];

export const initialFellowshipEvents: FellowshipEvent[] = [
  { id: 'EVT-01', title: '2026 Cathedral Christian Couples & Marriage Enrichment Retreat', date: '2026-11-21', venue: 'Cathedral Fellowship Pavilion', theme: 'Building an Unshakeable Covenant Home (1 Cor 13:4-8)', wing: 'Joint', budget: 450000, status: 'Upcoming' },
  { id: 'EVT-02', title: 'Annual Christian Fathers Breakfast Prayer Summit', date: '2026-12-12', venue: 'Cathedral Lower Hall', theme: 'Standing in the Gap: Fathers as Altar Builders', wing: 'Men', budget: 200000, status: 'Upcoming' },
  { id: 'EVT-03', title: 'Annual Christian Mothers Thanksgiving & Praise Banquet', date: '2026-08-15', venue: 'Cathedral Main Hall', theme: 'Daughters of Grace Rejoicing (Psalm 113:9)', wing: 'Women', budget: 350000, status: 'Completed' },
];

// ==========================================
// 11 DEPARTMENTS METADATA & PROFILE DIRECTORY
// ==========================================
export interface DepartmentMeta {
  id: string;
  name: string;
  shortName: string;
  category: string;
  description: string;
  chairmanName: string;
  secretaryName: string;
  treasurerName: string;
  status: 'Operational' | 'High Activity' | 'Active Duty' | 'Attention Required';
  statMetric: { label: string; value: string };
  secondaryMetric: { label: string; value: string };
  color: string;
}

export const elevenDepartmentsList: DepartmentMeta[] = [
  {
    id: 'parochial',
    name: 'Parish Council Executive',
    shortName: 'Parish Council',
    category: 'Governance & Administration',
    description: 'Supreme cathedral administrative and fiduciary board managing infrastructure, finance, registries, and departmental synergy.',
    chairmanName: 'Ven. Superior Evang. O. A. Soyemi',
    secretaryName: 'Evang. Olusegun Faleti',
    treasurerName: 'Mother in Celestial B. A. Adebiyi',
    status: 'Operational',
    statMetric: { label: 'Cleared Inflows', value: '₦12.4M' },
    secondaryMetric: { label: 'Active Projects', value: '4 Projects' },
    color: 'from-blue-700 to-indigo-800'
  },
  {
    id: 'shepherd',
    name: 'Shepherd & Church Workers',
    shortName: 'Shepherd & Workers',
    category: 'Pastoral & Altar Ministry',
    description: 'Pastoral shepherding, sacramental administrations, counseling, pulpit duty schedules, and dedicated church workers fellowship.',
    chairmanName: 'Superior Evang. I. O. Akande',
    secretaryName: 'Bro. Emmanuel Adeleke',
    treasurerName: 'Mother Celestial Victoria Odu',
    status: 'Active Duty',
    statMetric: { label: 'Active Workers', value: '28 Officers' },
    secondaryMetric: { label: 'Weekly Services', value: '4 Services' },
    color: 'from-sky-700 to-blue-800'
  },
  {
    id: 'evangelist',
    name: 'Council of Honorary Evangelists',
    shortName: 'Evangelist Council',
    category: 'Missions & Church Growth',
    description: 'Pulpit sermon dissemination, revival crusades, door-to-door evangelism, prison and hospital visitation, and discipleship tracking.',
    chairmanName: 'Most Senior Evang. Samson Adeleke',
    secretaryName: 'Senior Evang. John Dosunmu',
    treasurerName: 'Evang. Samuel Ogundipe',
    status: 'High Activity',
    statMetric: { label: 'Ordained Evang.', value: '18 Ministers' },
    secondaryMetric: { label: 'Converts Monitored', value: '42 Souls' },
    color: 'from-amber-600 to-red-700'
  },
  {
    id: 'prophets',
    name: 'Council of Prophet & Prophetess',
    shortName: 'Prophets & Prophetess',
    category: 'Spiritual & Intercessory',
    description: 'Continuous prayer vigils, prophetic observation logs, spiritual counseling, nocturnal watches, and intercession for cathedral peace.',
    chairmanName: 'Most Superior Pro. Michael Ogunbiyi',
    secretaryName: 'Prophetess Mary Olatunji',
    treasurerName: 'Prophet Isaac Oladipupo',
    status: 'Active Duty',
    statMetric: { label: 'Prayer Watches', value: '24/7 Roster' },
    secondaryMetric: { label: 'Weekly Fasting', value: 'Wed & Fri' },
    color: 'from-purple-700 to-indigo-900'
  },
  {
    id: 'side_men_women',
    name: 'Council of Sidesmen & Sideswomen',
    shortName: 'Sidesmen & Sideswomen',
    category: 'Sanctuary Protocol & Order',
    description: 'Ushers of the sanctuary overseeing liturgical order, congregation seating, offering procession escort, and guest reception.',
    chairmanName: 'Bro. Samuel Adekunle',
    secretaryName: 'Sis. Dorcas Oladele',
    treasurerName: 'Bro. Kayode Ogundele',
    status: 'Operational',
    statMetric: { label: 'Active Ushers', value: '45 Stewards' },
    secondaryMetric: { label: 'Sanctuary Gates', value: '6 Entrances' },
    color: 'from-teal-700 to-cyan-900'
  },
  {
    id: 'choir',
    name: 'The Model Choir',
    shortName: 'The Model Choir',
    category: 'Music & Sacred Anthems',
    description: 'Leading angelic liturgy, choral cantatas, organist training, Yoruba hymn preservation, and sacred cassock robe stewardship.',
    chairmanName: 'Bro. David Babalola',
    secretaryName: 'Sis. Grace Awolowo',
    treasurerName: 'Bro. Femi Adegoke',
    status: 'High Activity',
    statMetric: { label: 'Active Choristers', value: '62 Vocalists' },
    secondaryMetric: { label: 'Hymns Cataloged', value: '800+ Hymns' },
    color: 'from-emerald-700 to-teal-900'
  },
  {
    id: 'youth',
    name: 'Youth Council',
    shortName: 'Youth Council',
    category: 'Next-Gen Leadership',
    description: 'Mobilizing cathedral youth through academic tutoring, vocational empowerment seminars, Christian drama, and sports fellowship.',
    chairmanName: 'Bro. Ayodele Oyelakin',
    secretaryName: 'Sis. Temitope Sowunmi',
    treasurerName: 'Bro. Damilola George',
    status: 'Operational',
    statMetric: { label: 'Enrolled Youths', value: '180 Members' },
    secondaryMetric: { label: 'Skill Cohorts', value: '5 Programs' },
    color: 'from-orange-600 to-amber-700'
  },
  {
    id: 'security',
    name: 'Security Enforcement Team',
    shortName: 'Security Team',
    category: 'Safety & Perimeter Watch',
    description: 'Safeguarding cathedral perimeter, vehicle parking control, surveillance coordination, emergency access, and night patrols.',
    chairmanName: 'Capt. Oluwaseun Martins',
    secretaryName: 'Bro. Sunday Adeyemi',
    treasurerName: 'Bro. Segun Ajayi',
    status: 'Active Duty',
    statMetric: { label: 'Security Officers', value: '22 Wardens' },
    secondaryMetric: { label: 'Perimeter Check', value: 'Hourly' },
    color: 'from-slate-700 to-slate-900'
  },
  {
    id: 'media',
    name: 'Media Team',
    shortName: 'Media Team',
    category: 'Broadcasting & Publications',
    description: 'Global live streaming, sanctuary acoustic mixing, video archival, cathedral weekly bulletins, and digital social communications.',
    chairmanName: 'Bro. Michael Akinwunmi',
    secretaryName: 'Sis. Folashade Adeyemi',
    treasurerName: 'Bro. Kunle Olatunbosun',
    status: 'High Activity',
    statMetric: { label: 'Global Viewers', value: '4.8K / wk' },
    secondaryMetric: { label: 'Broadcast Channels', value: '3 Streams' },
    color: 'from-rose-700 to-pink-900'
  },
  {
    id: 'medical',
    name: 'Medical Team',
    shortName: 'Medical Team',
    category: 'Health & Emergency Triage',
    description: 'Sunday clinical triage, vital signs screening, rapid emergency response, pharmaceutical supply safe, and free community medical outreaches.',
    chairmanName: 'Dr. Emmanuel Adeyemi (MBBS, FWACS)',
    secretaryName: 'Nurse Olubunmi Sowande (RN, RM)',
    treasurerName: 'Pharm. Segun Dosunmu (B.Pharm)',
    status: 'Active Duty',
    statMetric: { label: 'Duty Personnel', value: '6 Medics' },
    secondaryMetric: { label: 'Monthly Triage', value: '120 Patients' },
    color: 'from-red-600 to-rose-800'
  },
  {
    id: 'bible_fellowship',
    name: 'MC & Women Bible Fellowship',
    shortName: 'Bible Fellowship',
    category: 'Discipleship & Family Welfare',
    description: 'Men Christian Fellowship & Women Bible Fellowship uniting for weekly doctrinal study, marital enrichment, and benevolent widow welfare grants.',
    chairmanName: 'Elder Gabriel Ojo',
    secretaryName: 'Sis. Deborah Alabi',
    treasurerName: 'Mother in Celestial Funke Sowande',
    status: 'Operational',
    statMetric: { label: 'Fellowship Members', value: '210 Families' },
    secondaryMetric: { label: 'Welfare Grants', value: '₦720K Q3' },
    color: 'from-indigo-700 to-violet-900'
  }
];

// ==========================================
// CENTRAL MONITORING FEEDBACK DATA
// (Transmitted from Departments to Church Secretary)
// ==========================================
export const initialDepartmentFeedbacks: DepartmentFeedback[] = [
  {
    id: 'FDB-2026-001',
    department: 'choir',
    departmentName: 'The Model Choir',
    senderName: 'Sis. Grace Awolowo',
    senderRole: 'Secretary',
    category: 'Logistics & Requisition',
    priority: 'Important',
    subject: 'Urgent Replacement of 2 Microphone Stands & Harvest Robe Laundering',
    details: 'During last Friday rehearsal, two metallic microphone stands broke at the boom arm joint. We request expedited approval for ₦45,000 to replace them before the Diocesan visit this Sunday. Also submitting 120 robes for dry cleaning.',
    dateSubmitted: '2026-10-06 14:30',
    status: 'Acknowledged',
    secretaryRemarks: 'Requisition noted and forwarded to Parochial Treasurer for quick voucher release. Microphones must be tested by Saturday afternoon.',
    reviewedBy: 'Evang. Olusegun Faleti (Church Secretary)',
    reviewedAt: '2026-10-06 16:15',
    kpiMetricsSummary: 'Rehearsal attendance: 58 choristers; 12 anthems rehearsed.'
  },
  {
    id: 'FDB-2026-002',
    department: 'medical',
    departmentName: 'Medical Team',
    senderName: 'Dr. Emmanuel Adeyemi',
    senderRole: 'Chairman',
    category: 'Operational Report',
    priority: 'Important',
    subject: 'Sunday Clinic Consultation Report & Emergency Stretcher Alert',
    details: 'The Cathedral Clinic attended to 18 parishioners during last Sunday service. Three elderly members had severe hypertensive spikes and were stabilized in the clinic bay. Emergency oxygen cylinders are currently at 80% capacity. We recommend allocating a reserved parking bay for the parish emergency ambulance transfer vehicle.',
    dateSubmitted: '2026-10-07 09:15',
    status: 'Action Taken',
    secretaryRemarks: 'Ambulance bay demarcated near the South gate with the Security Enforcement Team. Thank you CMD and medical personnel for prompt care.',
    reviewedBy: 'Evang. Olusegun Faleti (Church Secretary)',
    reviewedAt: '2026-10-07 11:00',
    kpiMetricsSummary: '18 patients treated; 0 hospital transfers required.'
  },
  {
    id: 'FDB-2026-003',
    department: 'security',
    departmentName: 'Security Enforcement Team',
    senderName: 'Bro. Sunday Adeyemi',
    senderRole: 'Secretary',
    category: 'Urgent Alert',
    priority: 'Urgent',
    subject: 'Vehicular Congestion & Perimeter Security Notice for Harvest Weekend',
    details: 'Traffic flow analysis from the recent vigil indicates that the eastern drainage gate requires temporary one-way routing. Two private security guards will be deployed alongside our team. We need 100 meters of warning tape and 3 high-intensity flashlights for nocturnal watches.',
    dateSubmitted: '2026-10-07 18:20',
    status: 'Pending Review',
    kpiMetricsSummary: '24 security officers on roster; 0 security incidents logged.'
  },
  {
    id: 'FDB-2026-004',
    department: 'evangelist',
    departmentName: 'Council of Honorary Evangelists',
    senderName: 'Most Senior Evang. Samson Adeleke',
    senderRole: 'Chairman',
    category: 'Event Summary',
    priority: 'Routine',
    subject: 'Ibara Ward Outreach & Harvest Revival Converts Briefing',
    details: 'The Council conducted open-air street witness across Ibara Market and Brewery junction on Saturday. Total souls reached: 84. 16 individuals made decisions for Christ and have been enrolled in the water baptism and doctrine classes under Evang. Emmanuel Bamidele.',
    dateSubmitted: '2026-10-08 08:45',
    status: 'Acknowledged',
    secretaryRemarks: 'Glory be to God! Discipleship register updated in the parish central database. Keep following up on new converts.',
    reviewedBy: 'Evang. Olusegun Faleti (Church Secretary)',
    reviewedAt: '2026-10-08 10:20',
    kpiMetricsSummary: '84 reached, 16 registered for baptism.'
  },
  {
    id: 'FDB-2026-005',
    department: 'prophets',
    departmentName: 'Council of Prophet & Prophetess',
    senderName: 'Prophetess Mary Olatunji',
    senderRole: 'Secretary',
    category: 'Spiritual & Intercessory',
    priority: 'Important',
    subject: 'Weekly Nocturnal Prayer Watch Summary & Harvest Peace Intercession',
    details: 'Completed the 72-hour continuous prayer chain for cathedral expansion and spiritual protection. 38 spiritual counseling consultations conducted with members this week. Spiritual recommendation: general parish washing and sanctification service before the 2026 Adult Harvest.',
    dateSubmitted: '2026-10-08 11:30',
    status: 'Pending Review',
    kpiMetricsSummary: '72 hours continuous prayer; 38 counseling cases.'
  },
  {
    id: 'FDB-2026-006',
    department: 'media',
    departmentName: 'Media Team',
    senderName: 'Bro. Michael Akinwunmi',
    senderRole: 'Chairman',
    category: 'Operational Report',
    priority: 'Routine',
    subject: 'Live Stream Reach & Acoustic Mixing Console Upgrade Report',
    details: 'Sunday Divine Service live stream reached an aggregate peak of 1,640 concurrent viewers on YouTube & Facebook Live. Broadcast sound latency was zero. Requesting Church Secretary sign-off for live recording of the 2026 Harvest Cantata for archival.',
    dateSubmitted: '2026-10-08 14:10',
    status: 'Action Taken',
    secretaryRemarks: 'Signed off and approved. Provide high-resolution master copy to the Secretariat Archives on USB drive following the festival.',
    reviewedBy: 'Evang. Olusegun Faleti (Church Secretary)',
    reviewedAt: '2026-10-08 15:30',
    kpiMetricsSummary: '1,640 peak viewers; 3 cameras online.'
  },
  {
    id: 'FDB-2026-007',
    department: 'bible_fellowship',
    departmentName: 'MC & Women Bible Fellowship',
    senderName: 'Sis. Deborah Alabi',
    senderRole: 'Secretary',
    category: 'Welfare & Pastoral',
    priority: 'Routine',
    subject: 'October Widows Welfare Distribution & Couples Retreat Syllabus',
    details: 'Disbursed ₦250,000 welfare allowance along with 15 food hampers to Cathedral Widows. Completed lesson outlines for upcoming Christian Couples Retreat scheduled for November 21st. Attendance at weekly Bible fellowship stands at 165 members.',
    dateSubmitted: '2026-10-08 16:40',
    status: 'Acknowledged',
    secretaryRemarks: 'Excellent stewardship. Welfare receipts reconciled with the Parochial Treasurer.',
    reviewedBy: 'Evang. Olusegun Faleti (Church Secretary)',
    reviewedAt: '2026-10-08 17:15',
    kpiMetricsSummary: '₦250K disbursed to 15 widows; 165 attendees.'
  },
  {
    id: 'FDB-2026-008',
    department: 'side_men_women',
    departmentName: 'Council of Sidesmen & Sideswomen',
    senderName: 'Sis. Dorcas Oladele',
    senderRole: 'Secretary',
    category: 'Logistics & Requisition',
    priority: 'Important',
    subject: 'Sanctuary Seating Requisition for 60 Additional Chairs',
    details: 'With increased attendance during the Harvest revival month, the side gallery and North transept ran out of seating. Requesting 60 heavy-duty white armless plastic chairs to augment the current cathedral seating layout.',
    dateSubmitted: '2026-10-08 17:50',
    status: 'Pending Review',
    kpiMetricsSummary: '42 ushers on active Sunday duty; sanctuary seating filled to 96%.'
  }
];

// ==========================================
// 11 DEPARTMENTS + SECRETARIAT OFFICIAL LOGIN ACCOUNTS
// ==========================================
export const departmentAuthAccounts: DepartmentAuthAccount[] = [
  {
    id: 'ACC-SEC',
    department: 'main_dashboard',
    departmentName: 'General Secretariat & Monitoring Hub',
    shortName: 'Church Secretariat',
    email: 'secretary@ibaracathedral.org',
    password: 'password123',
    officerName: 'Evang. Olusegun Faleti',
    officerRole: 'Cathedral Parochial Secretary',
    badgeCategory: 'Parish Administration & Monitoring',
    defaultTab: 'main_dashboard'
  },
  {
    id: 'ACC-PAR',
    department: 'parochial',
    departmentName: 'Parish Council Executive',
    shortName: 'Parish Council',
    email: 'parochial@ibaracathedral.org',
    password: 'council2026',
    officerName: 'Ven. Superior Evang. O. A. Soyemi',
    officerRole: 'Parish Council Chairman',
    badgeCategory: 'Governance & Parochial Trustees',
    defaultTab: 'parochial'
  },
  {
    id: 'ACC-SHP',
    department: 'shepherd',
    departmentName: 'Shepherd & Church Workers',
    shortName: 'Shepherd & Workers',
    email: 'shepherd@ibaracathedral.org',
    password: 'shepherd2026',
    officerName: 'Superior Evang. I. O. Akande',
    officerRole: 'Parish Shepherd & Altar Custodian',
    badgeCategory: 'Pastoral & Sacramental Oversight',
    defaultTab: 'shepherd'
  },
  {
    id: 'ACC-EVG',
    department: 'evangelist',
    departmentName: 'Council of Honorary Evangelists',
    shortName: 'Evangelist Council',
    email: 'evangelist@ibaracathedral.org',
    password: 'evangel2026',
    officerName: 'Most Senior Evang. Samson Adeleke',
    officerRole: 'Evangelist Council Chairman',
    badgeCategory: 'Missions & Church Growth',
    defaultTab: 'evangelist'
  },
  {
    id: 'ACC-PRO',
    department: 'prophets',
    departmentName: 'Council of Prophet & Prophetess',
    shortName: 'Prophets & Prophetess',
    email: 'prophets@ibaracathedral.org',
    password: 'prophet2026',
    officerName: 'Prophetess Mary Olatunji',
    officerRole: 'Council Secretary',
    badgeCategory: 'Spiritual Duty & Prophetic Chamber',
    defaultTab: 'prophets'
  },
  {
    id: 'ACC-USH',
    department: 'side_men_women',
    departmentName: 'Council of Sidesmen & Sideswomen',
    shortName: 'Sidesmen & Sideswomen',
    email: 'sidesmen@ibaracathedral.org',
    password: 'protocol2026',
    officerName: 'Bro. Samuel Adekunle',
    officerRole: 'Chief Protocol & Ushering Officer',
    badgeCategory: 'Sanctuary Protocol & Order',
    defaultTab: 'side_men_women'
  },
  {
    id: 'ACC-CHO',
    department: 'choir',
    departmentName: 'The Model Choir',
    shortName: 'The Model Choir',
    email: 'choir@ibaracathedral.org',
    password: 'harmony2026',
    officerName: 'Sis. Grace Awolowo',
    officerRole: 'Choir Secretary & Liturgy Lead',
    badgeCategory: 'Liturgical Choral Ministry',
    defaultTab: 'choir'
  },
  {
    id: 'ACC-YOU',
    department: 'youth',
    departmentName: 'Youth Council',
    shortName: 'Youth Council',
    email: 'youth@ibaracathedral.org',
    password: 'youth2026',
    officerName: 'Bro. Ayodele Oyelakin',
    officerRole: 'Youth Council President',
    badgeCategory: 'Next-Gen Leadership & Ministry',
    defaultTab: 'youth'
  },
  {
    id: 'ACC-SEC-TEAM',
    department: 'security',
    departmentName: 'Security Enforcement Team',
    shortName: 'Security Team',
    email: 'security@ibaracathedral.org',
    password: 'vigilance2026',
    officerName: 'Capt. Oluwaseun Martins',
    officerRole: 'Chief Security Warden',
    badgeCategory: 'Perimeter Defense & Vigilance',
    defaultTab: 'security'
  },
  {
    id: 'ACC-MED-TEAM',
    department: 'media',
    departmentName: 'Media Team',
    shortName: 'Media Team',
    email: 'media@ibaracathedral.org',
    password: 'broadcast2026',
    officerName: 'Bro. Michael Akinwunmi',
    officerRole: 'Broadcasting & Audio Lead',
    badgeCategory: 'Broadcast & Communications',
    defaultTab: 'media'
  },
  {
    id: 'ACC-HLT-TEAM',
    department: 'medical',
    departmentName: 'Medical Team',
    shortName: 'Medical Team',
    email: 'medical@ibaracathedral.org',
    password: 'firstaid2026',
    officerName: 'Dr. Emmanuel Adeyemi (MBBS)',
    officerRole: 'Chief Medical Officer',
    badgeCategory: 'First Aid Post & Clinic Response',
    defaultTab: 'medical'
  },
  {
    id: 'ACC-BBL-TEAM',
    department: 'bible_fellowship',
    departmentName: 'MC & Women Bible Fellowship',
    shortName: 'Bible Fellowship',
    email: 'biblestudy@ibaracathedral.org',
    password: 'scripture2026',
    officerName: 'Elder Gabriel Ojo',
    officerRole: 'Fellowship General Coordinator',
    badgeCategory: 'Family & Discipleship Fellowship',
    defaultTab: 'bible_fellowship'
  }
];

// Helper to get active department accounts with any Chairman customized passwords applied
export const getActiveDepartmentAuthAccounts = (): DepartmentAuthAccount[] => {
  const saved = localStorage.getItem('ccc_custom_department_auth_accounts');
  if (saved) {
    try {
      const custom: DepartmentAuthAccount[] = JSON.parse(saved);
      return departmentAuthAccounts.map(defaultAcc => {
        const found = custom.find(c => c.department === defaultAcc.department);
        return found ? { ...defaultAcc, ...found } : defaultAcc;
      });
    } catch {
      return departmentAuthAccounts;
    }
  }
  return departmentAuthAccounts;
};

// Helper for Chairman to update department auth account
export const updateDepartmentAuthByChairman = (
  dept: Department,
  updates: Partial<DepartmentAuthAccount>
): DepartmentAuthAccount[] => {
  const accounts = getActiveDepartmentAuthAccounts();
  const updated = accounts.map(acc => {
    if (acc.department === dept) {
      return { ...acc, ...updates };
    }
    return acc;
  });
  localStorage.setItem('ccc_custom_department_auth_accounts', JSON.stringify(updated));
  return updated;
};






