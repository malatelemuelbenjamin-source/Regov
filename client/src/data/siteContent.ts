import {
  Accessibility, Archive, Award, Baby, Banknote, Beef, Bell, BookOpen, BriefcaseBusiness,
  Building2, BusFront, CarFront, FileBadge2, FileSearch, FileText, Fingerprint,
  Handshake, HeartHandshake, HeartPulse, House, KeyRound, Languages, Map, MapPinned,
  Megaphone, Mic2, Package, PackageOpen, PackageSearch, PawPrint, Plane, Printer,
  QrCode, Radar, Route, ScanSearch, ShieldAlert, ShieldCheck, Sparkles, Smartphone,
  Trophy, UsersRound, WifiOff, type LucideIcon,
} from "lucide-react";

export type IconCard = { title: string; description: string; icon: LucideIcon };
export const directoryCategories = [
  "Personal Belongings",
  "Documents and Identification",
  "Pets and Animals",
  "People and Community Assistance",
  "Transportation and Vehicles",
  "Education and Business",
  "Disaster and Emergency Recovery",
] as const;
export type DirectoryCategory = (typeof directoryCategories)[number];
export type DirectoryCard = IconCard & { category: DirectoryCategory };

export const directories: DirectoryCard[] = [
  { category: "Personal Belongings", title: "Lost Personal Belongings", description: "A future directory for everyday items misplaced at home, work, or out in the community.", icon: PackageSearch },
  { category: "Personal Belongings", title: "Found Personal Belongings", description: "A planned place to help found belongings make their way back to their rightful owners.", icon: PackageOpen },
  { category: "Documents and Identification", title: "Lost and Found Documents and IDs", description: "Planned assistance for identification cards and important personal papers.", icon: FileBadge2 },
  { category: "Pets and Animals", title: "Lost and Found Pets", description: "A future community resource for sharing information about lost and found pets.", icon: PawPrint },
  { category: "People and Community Assistance", title: "Missing Persons Assistance", description: "Planned, responsible signposting to support information sharing for missing-person cases.", icon: UsersRound },
  { category: "People and Community Assistance", title: "Missing Children Assistance", description: "A future child-safety-first information pathway, designed with privacy in mind.", icon: Baby },
  { category: "People and Community Assistance", title: "Elderly Assistance", description: "Planned community support for helping reconnect older adults with their loved ones.", icon: Accessibility },
  { category: "Transportation and Vehicles", title: "Lost and Found Vehicles", description: "A future directory for information about missing and recovered vehicles.", icon: CarFront },
  { category: "Transportation and Vehicles", title: "Transport Lost and Found", description: "Planned support for belongings misplaced while traveling on public transport.", icon: BusFront },
  { category: "Education and Business", title: "Lost School Belongings", description: "A future resource for items left behind in schools, campuses, or learning spaces.", icon: BookOpen },
  { category: "People and Community Assistance", title: "Lost Medical Equipment", description: "Planned help for locating essential medical devices and mobility equipment.", icon: HeartPulse },
  { category: "Education and Business", title: "Lost Business Property", description: "A future directory for business equipment, tools, and work-related belongings.", icon: BriefcaseBusiness },
  { category: "Documents and Identification", title: "Lost Travel Documents", description: "Planned signposting for travel documents misplaced during a journey.", icon: Plane },
  { category: "Personal Belongings", title: "Found Cash and Valuables", description: "A future, safety-minded directory for reporting found valuables.", icon: Banknote },
  { category: "Personal Belongings", title: "Lost Keys", description: "A planned way to organize information about lost keys and key sets.", icon: KeyRound },
  { category: "Personal Belongings", title: "Found Electronics", description: "A future directory for phones, tablets, laptops, and other found devices.", icon: Smartphone },
  { category: "Personal Belongings", title: "Lost and Found Delivery Parcels", description: "Planned support for parcels that may have gone missing or been found.", icon: Package },
  { category: "Disaster and Emergency Recovery", title: "Disaster Recovery and Lost Belongings", description: "A future community resource for reconnecting people with belongings after disasters.", icon: House },
  { category: "Documents and Identification", title: "Lost Certificates and Records", description: "Planned information support for certificates and other important records.", icon: FileText },
  { category: "Pets and Animals", title: "Lost and Found Livestock", description: "A future directory to help communities share information about missing livestock.", icon: Beef },
  { category: "Personal Belongings", title: "Lost Sports Equipment", description: "Planned support for sports gear misplaced at schools, venues, and events.", icon: Trophy },
  { category: "People and Community Assistance", title: "Community Recovery Assistance", description: "A future starting point for neighbors seeking local recovery guidance.", icon: Handshake },
  { category: "People and Community Assistance", title: "Barangay Recovery Directory", description: "Planned local directory concept for barangay-level recovery information.", icon: Building2 },
  { category: "People and Community Assistance", title: "Nationwide Recovery Directory", description: "A long-term vision for connecting recovery information across the Philippines.", icon: Map },
];

export const features: IconCard[] = [
  { title: "RECOVPH AI Match", description: "AI-powered photo matching to help identify possible lost-and-found item matches.", icon: ScanSearch },
  { title: "Nationwide Recovery Radar", description: "An interactive Philippine recovery map, envisioned for a future phase.", icon: Radar },
  { title: "Smart Recovery QR", description: "QR identification concept for helping belongings carry recovery information.", icon: QrCode },
  { title: "Reverse Matching Alerts", description: "Planned notifications when new information may match a recovery need.", icon: Bell },
  { title: "Proof of Ownership Challenge", description: "A future verification concept designed to help protect rightful ownership.", icon: ShieldCheck },
  { title: "Safe Recovery Hubs", description: "A planned directory of participating locations for safer item handovers.", icon: Building2 },
  { title: "Last Ride Recovery", description: "A future lost-item concept focused on public transportation journeys.", icon: BusFront },
  { title: "Offline Recovery Reporting", description: "Planned tools for preparing recovery information when connectivity is limited.", icon: WifiOff },
  { title: "Recovery Journey Tracker", description: "A future way to follow progress through a recovery process.", icon: Route },
  { title: "Bayanihan Recovery Volunteers", description: "A planned community volunteer network grounded in bayanihan.", icon: HeartHandshake },
  { title: "RECOVPH AI Assistant", description: "An intelligent assistant concept for guiding people through recovery information.", icon: Sparkles },
  { title: "Automatic Recovery Poster Generator", description: "A planned way to prepare clear recovery notices for community sharing.", icon: Printer },
  { title: "Family Recovery Circle", description: "A future family-centered concept for coordinating recovery information.", icon: UsersRound },
  { title: "Digital Lost Property Custody", description: "Planned digital records to support responsible property handover.", icon: Archive },
  { title: "Recovery Statistics Dashboard", description: "A future dashboard concept; no recovery statistics are available today.", icon: MapPinned },
  { title: "Lost Document Assistance Center", description: "Planned guidance for people looking for misplaced documents.", icon: FileSearch },
  { title: "Recovery Scam Shield", description: "A future safety concept to help people recognize suspicious recovery activity.", icon: ShieldAlert },
  { title: "Safe Meetup Planner", description: "Planned guidance for arranging safer item-return meetups.", icon: Handshake },
  { title: "Community Sighting Network", description: "A future way for communities to share relevant recovery sightings.", icon: Radar },
  { title: "Voice-to-Report", description: "A planned accessibility concept for preparing information by voice.", icon: Mic2 },
  { title: "Item Identity Fingerprint", description: "A future concept for recording distinguishing details about an item.", icon: Fingerprint },
  { title: "Barangay Recovery Bulletin", description: "Planned bulletin concept for sharing local recovery information.", icon: Megaphone },
  { title: "Organization Partner Portal", description: "A future information portal concept for participating organizations.", icon: Building2 },
  { title: "Multilingual Recovery Network", description: "A planned approach to making recovery information accessible in more languages.", icon: Languages },
  { title: "Recovery Hero Recognition", description: "A future way to recognize people who help return belongings safely.", icon: Award },
];

export const flagshipFeatureTitles = [
  "RECOVPH AI Match",
  "Nationwide Recovery Radar",
  "Smart Recovery QR",
  "Bayanihan Recovery Volunteers",
  "Recovery Journey Tracker",
] as const;

export const communities = [
  "Individual Filipino citizens", "Families", "Barangay offices", "Municipal and city governments",
  "Provincial governments", "Schools and universities", "Transport operators",
  "Shopping malls and establishments", "Hotels and tourism establishments",
  "Police and authorized government agencies", "NGOs and volunteer organizations",
  "Animal rescue organizations",
];

export const faqs = [
  { question: "What is RECOVPH?", answer: "RECOVPH is being developed as a nationwide lost-and-found recovery platform for the Philippines. Its long-term vision is to help people share recovery information about belongings, documents, pets, vehicles, and more." },
  { question: "Is RECOVPH already operational?", answer: "No. RECOVPH is currently under development. Its directories, tools, and recovery process are planned and are not yet operational." },
  { question: "Can I report a lost item today?", answer: "Not through RECOVPH. Online reporting and recovery submissions are not available yet. Please use appropriate local channels while the platform is being developed." },
  { question: "Will RECOVPH support all Philippine provinces?", answer: "Nationwide reach is the goal. Coverage is planned across the Philippines, but RECOVPH does not currently provide operational regional or municipal coverage." },
  { question: "Will there be an Android application?", answer: "An Android application is a possibility for a future phase. No app is available now, and release details have not yet been announced." },
  { question: "Can barangays and organizations participate?", answer: "Participation by barangays and organizations is part of the plan. Partnership opportunities will be shared later; there are no partnerships to announce at this time." },
  { question: "Will RECOVPH support lost pets?", answer: "Lost-and-found pet support is included in the planned directories. It is not available yet." },
  { question: "How will ownership verification work?", answer: "Secure ownership verification is a planned part of the platform. The verification process is still to be designed and is not currently available." },
  { question: "Is RECOVPH free to use?", answer: "The platform is not yet open, so pricing or access details have not been finalized. Any confirmed information will be shared before launch." },
  { question: "When will the platform launch?", answer: "A launch date has not been announced. RECOVPH is under development, and launch details will be shared later." },
];
