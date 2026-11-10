import { directories, features, type DirectoryCard, type IconCard } from "./siteContent";

export const directoryExplorerCategories = [
  "Personal Belongings",
  "Documents and Identification",
  "Pets and Animals",
  "People and Family Assistance",
  "Vehicles and Transportation",
  "Education and Schools",
  "Business and Establishments",
  "Agriculture and Fisheries",
  "Travel and Tourism",
  "Medical and Assistive Equipment",
  "Disaster and Emergency Recovery",
  "Community and Public Property",
  "Digital and Electronic Property",
] as const;

export type DirectoryExplorerCategory = (typeof directoryExplorerCategories)[number];
export type DirectoryCategoryFilter = DirectoryExplorerCategory | "All Categories";

export const directoryCategoryDescriptions: Record<DirectoryExplorerCategory, string> = {
  "Personal Belongings": "Planned information pathways for everyday possessions that may be lost or found in homes, workplaces, schools, and communities.",
  "Documents and Identification": "Planned signposting for identification cards, travel documents, certificates, and other records that matter to their holders.",
  "Pets and Animals": "Future community information for lost and found pets and livestock, with animal welfare and safe reunions in mind.",
  "People and Family Assistance": "Carefully scoped future information for family reconnection and missing-person assistance; RECOVPH is not an emergency reporting service.",
  "Vehicles and Transportation": "Planned topics related to vehicles and belongings misplaced during a public-transport journey.",
  "Education and Schools": "Future recovery information for belongings and equipment associated with schools, campuses, learning spaces, and sports.",
  "Business and Establishments": "Planned guidance for misplaced business property and delivery parcels without implying participating establishments.",
  "Agriculture and Fisheries": "A planned topic for livestock recovery information; this category does not imply coverage or active agricultural services.",
  "Travel and Tourism": "Planned signposting for travel documents and information needs that can arise during a journey.",
  "Medical and Assistive Equipment": "A future information pathway for essential medical devices and mobility or assistive equipment.",
  "Disaster and Emergency Recovery": "Planned community information for belongings affected by disasters; urgent emergencies require appropriate official channels.",
  "Community and Public Property": "A long-term directory concept for community recovery guidance and future local or nationwide information.",
  "Digital and Electronic Property": "Planned guidance for found electronic devices and the privacy considerations attached to them.",
};

const categoryGuidance: Record<DirectoryExplorerCategory, { beneficiaries: string; process: string; safety: string; relatedFeatures: string[] }> = {
  "Personal Belongings": {
    beneficiaries: "People, families, and community members looking for a planned information pathway about an everyday possession.",
    process: "If developed, this directory could help a visitor identify the right topic, share appropriate item information through a future service, review possible matches, and use verification guidance before any handover. RECOVPH does not accept reports today.",
    safety: "Avoid publishing full names, home addresses, access codes, complete serial numbers, or other details that could expose a person or make an item easy to claim fraudulently.",
    relatedFeatures: ["RECOVPH AI Match", "Smart Recovery QR", "Reverse Matching Alerts", "Recovery Journey Tracker"],
  },
  "Documents and Identification": {
    beneficiaries: "Individuals and families seeking future informational guidance about personal identity papers, travel documents, certificates, or records.",
    process: "A future information pathway could help people identify the document topic and find guidance about appropriate next steps. RECOVPH will not collect document images or identity numbers through this website.",
    safety: "Do not post unredacted ID images, full identity numbers, signatures, birth details, or other sensitive personal data in public spaces. Use authorized channels for official document replacement.",
    relatedFeatures: ["Lost Document Assistance Center", "Proof of Ownership Challenge", "Recovery Scam Shield"],
  },
  "Pets and Animals": {
    beneficiaries: "Pet owners, families, and animal-care communities who may need a planned way to share responsible recovery information.",
    process: "If introduced in a future phase, this directory could guide a person toward an appropriate topic, safe information-sharing, possible sightings, and a careful reunification process. No pet listings or reports are available here.",
    safety: "Protect private home and contact details, verify claims carefully, and prioritize animal welfare. No animal rescue organization is represented as a RECOVPH partner.",
    relatedFeatures: ["RECOVPH AI Match", "Community Sighting Network", "Bayanihan Recovery Volunteers", "Smart Recovery QR"],
  },
  "People and Family Assistance": {
    beneficiaries: "Families and individuals seeking responsible information about future community assistance and family-reconnection concepts.",
    process: "RECOVPH does not receive missing-person reports. If developed, this directory could provide carefully reviewed signposting and guidance toward suitable authorized channels; urgent concerns should be brought to appropriate local emergency or official services.",
    safety: "Do not publish sensitive identifying information, private locations, or allegations. Any future handling of cases involving missing people or children would require careful safeguards and appropriate authorized oversight.",
    relatedFeatures: ["Family Recovery Circle", "Bayanihan Recovery Volunteers", "RECOVPH AI Assistant"],
  },
  "Vehicles and Transportation": {
    beneficiaries: "Vehicle owners, passengers, and families looking for future information about a missing vehicle or an item misplaced during a journey.",
    process: "A planned pathway could help a visitor identify whether a topic concerns a vehicle or a trip, then locate guidance for appropriate verification and a safe handover. No vehicle, route, or transport reports are searchable today.",
    safety: "Keep exact vehicle locations, registration details, keys, travel plans, and other security-sensitive information private. Use appropriate official channels for vehicle theft or emergencies.",
    relatedFeatures: ["Last Ride Recovery", "Nationwide Recovery Radar", "Safe Recovery Hubs", "Recovery Journey Tracker"],
  },
  "Education and Schools": {
    beneficiaries: "Students, families, and school or campus communities looking for a future informational pathway for misplaced belongings or sports equipment.",
    process: "If developed, the directory could help visitors identify the relevant school-related topic and review future sharing, matching, verification, and return guidance. No school submissions are accepted.",
    safety: "Protect children’s identities, schedules, school locations, and contact details. Any future information involving minors would require age-appropriate privacy safeguards.",
    relatedFeatures: ["RECOVPH AI Match", "Smart Recovery QR", "Community Sighting Network"],
  },
  "Business and Establishments": {
    beneficiaries: "Individuals, families, and future participating establishments seeking organized information about work property or delivery parcels.",
    process: "A future informational pathway could help identify whether an item relates to workplace property or a delivery and explain possible verification and return steps. No business or courier is currently a RECOVPH participant.",
    safety: "Avoid exposing confidential business information, internal access details, addresses, or parcel tracking credentials. Do not assume an establishment is an official RECOVPH partner.",
    relatedFeatures: ["Organization Partner Portal", "Digital Lost Property Custody", "Safe Recovery Hubs"],
  },
  "Agriculture and Fisheries": {
    beneficiaries: "Livestock owners, families, and local communities seeking a future information pathway about missing animals.",
    process: "If developed, this topic could help organize relevant livestock information and point people toward careful verification and safe contact. There are no active animal records or local recovery services here.",
    safety: "Share only information appropriate for public viewing, take care with exact locations and ownership evidence, and verify any claims before arranging a handover.",
    relatedFeatures: ["Community Sighting Network", "Bayanihan Recovery Volunteers", "Barangay Recovery Bulletin"],
  },
  "Travel and Tourism": {
    beneficiaries: "Travelers and families seeking planned guidance about documents misplaced while travelling.",
    process: "A future directory could help identify a travel-document topic and direct visitors to informational next steps. RECOVPH does not provide emergency travel assistance, official document replacement, or active transport information.",
    safety: "Avoid sharing itinerary details, passport images, document numbers, live locations, or other sensitive travel information in a public post.",
    relatedFeatures: ["Lost Document Assistance Center", "Multilingual Recovery Network", "Last Ride Recovery"],
  },
  "Medical and Assistive Equipment": {
    beneficiaries: "People who rely on medical or mobility equipment, their families, and caregivers seeking future information about misplaced devices.",
    process: "If launched, the directory could help visitors identify the equipment topic and find future guidance for describing, verifying, and safely returning an item. It does not provide medical advice or equipment replacement.",
    safety: "Health and disability information is sensitive. Avoid publicly disclosing diagnoses, care routines, personal addresses, or device identifiers that could create a security risk.",
    relatedFeatures: ["Offline Recovery Reporting", "Multilingual Recovery Network", "Voice-to-Report"],
  },
  "Disaster and Emergency Recovery": {
    beneficiaries: "Individuals, families, and communities seeking future information about belongings affected by a disaster.",
    process: "A future informational pathway could help organize recovery topics once it is safe to do so. RECOVPH is not an emergency-response service; follow official safety instructions and urgent local channels first.",
    safety: "Do not enter unsafe locations or publish precise details that could expose displaced people. Sensitive disaster-related information would need careful review and privacy safeguards.",
    relatedFeatures: ["Offline Recovery Reporting", "Bayanihan Recovery Volunteers", "Family Recovery Circle"],
  },
  "Community and Public Property": {
    beneficiaries: "Residents, families, and community groups looking for planned local guidance or a future nationwide directory concept.",
    process: "If developed, a directory could help visitors find the relevant informational topic and understand how future, verified community guidance might be shared. No barangay directory or recovery hub is active through RECOVPH today.",
    safety: "A listing must not be mistaken for an endorsement or confirmed government service. Any future public information would need clear ownership, current review, and appropriate privacy controls.",
    relatedFeatures: ["Barangay Recovery Bulletin", "Organization Partner Portal", "Bayanihan Recovery Volunteers"],
  },
  "Digital and Electronic Property": {
    beneficiaries: "People and families seeking information about a found electronic device and a safe route for a possible return.",
    process: "A planned directory could help identify the device topic and explain future verification and handover guidance. It does not collect or search live device reports, account credentials, or location data.",
    safety: "Never share a password, one-time code, private account details, or a device’s complete serial number publicly. Do not access or reset a device that may belong to someone else.",
    relatedFeatures: ["Item Identity Fingerprint", "Smart Recovery QR", "Digital Lost Property Custody", "Recovery Scam Shield"],
  },
};

type DirectoryMetadata = {
  explorerCategory: DirectoryExplorerCategory;
  keywords: string[];
  itemTypes: string[];
  purpose: string;
  relatedFeatures?: string[];
  relatedGuidance?: string[];
};

const directoryMetadata: Record<DirectoryCard["title"], DirectoryMetadata> = {
  "Lost Personal Belongings": { explorerCategory: "Personal Belongings", keywords: ["wallet", "cellphone", "mobile phone", "phone", "bag", "keys", "umbrella", "watch", "everyday item"], itemTypes: ["Everyday personal items", "Bags and personal effects", "Other belongings described by the visitor"], purpose: "Offer a future, organized information pathway for everyday personal items that have been misplaced." },
  "Found Personal Belongings": { explorerCategory: "Personal Belongings", keywords: ["found item", "wallet", "bag", "purse", "keys", "personal property"], itemTypes: ["Found personal belongings", "Items left in homes, workplaces, or community spaces"], purpose: "Help people understand how found belongings might be described and safely returned through a future recovery network." },
  "Lost and Found Documents and IDs": { explorerCategory: "Documents and Identification", keywords: ["national id", "national identification", "government id", "identification card", "lost documents", "personal papers"], itemTypes: ["Identification cards and IDs", "Important personal papers", "Documents that need privacy-conscious handling"], purpose: "Provide planned information and signposting for lost or found identity documents and personal papers." },
  "Lost and Found Pets": { explorerCategory: "Pets and Animals", keywords: ["dog", "cat", "puppy", "kitten", "lost pet", "found pet", "animal"], itemTypes: ["Lost pets", "Found pets", "Information that may help guide a safe reunion"], purpose: "Create a future community information pathway for people trying to reconnect pets with their families." },
  "Missing Persons Assistance": { explorerCategory: "People and Family Assistance", keywords: ["missing person", "missing relative", "family assistance", "family reunification", "authorized reporting"], itemTypes: ["Missing-person assistance information", "Responsible signposting and family-support concepts"], purpose: "Offer carefully scoped future signposting for missing-person support without replacing emergency services or authorized reporting." , relatedFeatures: ["Family Recovery Circle", "Bayanihan Recovery Volunteers"], relatedGuidance: ["Authorized-reporting safeguards", "Secure case coordination (a future design concept only)"] },
  "Missing Children Assistance": { explorerCategory: "People and Family Assistance", keywords: ["missing child", "child safety", "family assistance", "child protection"], itemTypes: ["Child-safety-first assistance information", "Future privacy-minded family support"], purpose: "Describe a future, carefully safeguarded information pathway for child-related assistance." },
  "Elderly Assistance": { explorerCategory: "People and Family Assistance", keywords: ["elderly", "older adult", "senior", "family support", "reconnection"], itemTypes: ["Older-adult assistance information", "Community support for reconnecting loved ones"], purpose: "Help outline future community information for reconnecting older adults with their loved ones." },
  "Lost and Found Vehicles": { explorerCategory: "Vehicles and Transportation", keywords: ["motorcycle", "motorbike", "car", "vehicle", "bicycle", "registration", "plate"], itemTypes: ["Cars and motorcycles", "Other missing or recovered vehicles described in the existing concept"], purpose: "Organize future information about missing and recovered vehicles with careful ownership verification." },
  "Transport Lost and Found": { explorerCategory: "Vehicles and Transportation", keywords: ["public transport", "bus", "jeepney", "train", "taxi", "commute", "transit", "last ride"], itemTypes: ["Belongings misplaced during public-transport journeys", "Transport-related lost-and-found guidance"], purpose: "Help passengers find a future information pathway for belongings misplaced during a public-transport journey.", relatedFeatures: ["Last Ride Recovery", "Nationwide Recovery Radar", "Safe Recovery Hubs"] },
  "Lost School Belongings": { explorerCategory: "Education and Schools", keywords: ["school", "campus", "student", "school bag", "notebook", "book", "uniform", "learning space"], itemTypes: ["Items left in schools, campuses, or learning spaces", "Student belongings"], purpose: "Provide a planned starting point for belongings left behind in schools, campuses, and learning spaces." },
  "Lost Medical Equipment": { explorerCategory: "Medical and Assistive Equipment", keywords: ["wheelchair", "walker", "crutches", "cane", "medical device", "assistive equipment", "mobility aid"], itemTypes: ["Essential medical devices", "Mobility equipment and assistive devices"], purpose: "Offer future information that may help people locate essential medical or mobility equipment." },
  "Lost Business Property": { explorerCategory: "Business and Establishments", keywords: ["business property", "work equipment", "tools", "office equipment", "workplace", "laptop"], itemTypes: ["Business equipment", "Tools", "Work-related belongings"], purpose: "Organize future information about business equipment, tools, and work-related belongings." },
  "Lost Travel Documents": { explorerCategory: "Travel and Tourism", keywords: ["passport", "visa", "travel document", "travel id", "lost documents", "trip"], itemTypes: ["Travel documents", "Papers misplaced during a journey"], purpose: "Provide future signposting for travel documents misplaced during a journey." },
  "Found Cash and Valuables": { explorerCategory: "Personal Belongings", keywords: ["wallet", "cash", "money", "jewelry", "valuables", "found valuables"], itemTypes: ["Found cash", "Valuables and personal effects"], purpose: "Outline a future, safety-minded information pathway for found cash and valuables." },
  "Lost Keys": { explorerCategory: "Personal Belongings", keywords: ["key", "keys", "house key", "car key", "keychain", "lost keys"], itemTypes: ["Lost keys and key sets", "Personal keychains"], purpose: "Make it easier to find planned information about lost keys and key sets." },
  "Found Electronics": { explorerCategory: "Digital and Electronic Property", keywords: ["cellphone", "mobile phone", "phone", "laptop", "tablet", "computer", "electronics", "smartphone", "device"], itemTypes: ["Phones", "Tablets", "Laptops", "Other electronic devices"], purpose: "Provide future guidance for found devices while emphasizing privacy and safe handling." },
  "Lost and Found Delivery Parcels": { explorerCategory: "Business and Establishments", keywords: ["delivery parcel", "parcel", "package", "delivery", "courier", "shipment"], itemTypes: ["Delivery parcels and packages", "Items described in the planned parcel directory"], purpose: "Offer planned informational support for parcels that may have gone missing or been found." },
  "Disaster Recovery and Lost Belongings": { explorerCategory: "Disaster and Emergency Recovery", keywords: ["disaster", "typhoon", "flood", "earthquake", "calamity", "emergency", "belongings after disaster"], itemTypes: ["Belongings affected by disasters", "Community recovery information"], purpose: "Help shape a future community information resource for belongings affected by a disaster." },
  "Lost Certificates and Records": { explorerCategory: "Documents and Identification", keywords: ["certificate", "birth certificate", "diploma", "school record", "official record", "lost documents"], itemTypes: ["Certificates", "Records and other important personal documents"], purpose: "Provide planned information support for locating certificates and other important records." },
  "Lost and Found Livestock": { explorerCategory: "Agriculture and Fisheries", keywords: ["livestock", "cattle", "carabao", "goat", "animal", "missing livestock"], itemTypes: ["Livestock described in the existing directory concept", "Community information about missing animals"], purpose: "Help communities share future information about missing livestock with careful verification." },
  "Lost Sports Equipment": { explorerCategory: "Education and Schools", keywords: ["sports equipment", "sports gear", "ball", "racket", "sports venue", "school sports"], itemTypes: ["Sports gear misplaced at schools, venues, or events"], purpose: "Offer planned support for sports equipment misplaced at schools, venues, and events." },
  "Community Recovery Assistance": { explorerCategory: "Community and Public Property", keywords: ["community assistance", "community recovery", "barangay help", "local guidance", "neighbors"], itemTypes: ["Local recovery guidance", "Community assistance information"], purpose: "Create a future starting point for neighbors seeking local recovery guidance." },
  "Barangay Recovery Directory": { explorerCategory: "Community and Public Property", keywords: ["barangay", "barangay directory", "local recovery information", "municipal", "community"], itemTypes: ["Future barangay-level recovery information", "Local directory concepts"], purpose: "Describe a future local directory concept for barangay-level recovery information without implying participating barangays." },
  "Nationwide Recovery Directory": { explorerCategory: "Community and Public Property", keywords: ["nationwide", "philippines", "nationwide recovery network", "national directory", "regions"], itemTypes: ["Recovery information envisioned across the Philippines", "Nationwide directory concepts"], purpose: "Present the long-term vision of connecting recovery information across the Philippines." },
};

export type DirectoryExplorerItem = DirectoryCard & DirectoryMetadata & {
  slug: string;
  categoryDescription: string;
  beneficiaries: string;
  plannedProcess: string;
  safetyConsiderations: string;
  relatedFeatures: string[];
};

export function slugify(value: string): string {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const directoryExplorerItems: DirectoryExplorerItem[] = directories.map((directory) => {
  const metadata = directoryMetadata[directory.title];
  const guidance = categoryGuidance[metadata.explorerCategory];
  return {
    ...directory,
    ...metadata,
    slug: slugify(directory.title),
    categoryDescription: directoryCategoryDescriptions[metadata.explorerCategory],
    beneficiaries: guidance.beneficiaries,
    plannedProcess: guidance.process,
    safetyConsiderations: guidance.safety,
    relatedFeatures: metadata.relatedFeatures ?? guidance.relatedFeatures,
  };
});

export const usedDirectoryExplorerCategories = directoryExplorerCategories.filter((category) => directoryExplorerItems.some((item) => item.explorerCategory === category));

export const featureExplorerCategories = [
  "Artificial Intelligence",
  "Security and Verification",
  "Community Assistance",
  "Tracking and Notifications",
  "Transportation",
  "Government and Organization Coordination",
  "Accessibility",
] as const;

export type FeatureExplorerCategory = (typeof featureExplorerCategories)[number];
export type FeatureCategoryFilter = FeatureExplorerCategory | "All Features";

export const featureCategoryDescriptions: Record<FeatureExplorerCategory, string> = {
  "Artificial Intelligence": "Future concepts for using pattern recognition or guided assistance to make recovery information easier to understand.",
  "Security and Verification": "Planned safeguards and identity or ownership concepts that would need careful privacy and security design.",
  "Community Assistance": "Ideas for responsible community information sharing and mutual support; no volunteer activity or partners are active here.",
  "Tracking and Notifications": "Future concepts for following potential matches or recovery steps. No live alerts, cases, or statistics exist today.",
  "Transportation": "Ideas related to recovery information across journeys and an illustrative nationwide map concept—not an active tracking service.",
  "Government and Organization Coordination": "Possible information structures for future authorized organizations, without any claim of current participation or endorsement.",
  "Accessibility": "Concepts that may make future recovery information more usable across different connectivity, language, or interaction needs.",
};

const featureCategoryByTitle: Record<IconCard["title"], FeatureExplorerCategory> = {
  "RECOVPH AI Match": "Artificial Intelligence",
  "Nationwide Recovery Radar": "Transportation",
  "Smart Recovery QR": "Security and Verification",
  "Reverse Matching Alerts": "Tracking and Notifications",
  "Proof of Ownership Challenge": "Security and Verification",
  "Safe Recovery Hubs": "Government and Organization Coordination",
  "Last Ride Recovery": "Transportation",
  "Offline Recovery Reporting": "Accessibility",
  "Recovery Journey Tracker": "Tracking and Notifications",
  "Bayanihan Recovery Volunteers": "Community Assistance",
  "RECOVPH AI Assistant": "Artificial Intelligence",
  "Automatic Recovery Poster Generator": "Community Assistance",
  "Family Recovery Circle": "Community Assistance",
  "Digital Lost Property Custody": "Security and Verification",
  "Recovery Statistics Dashboard": "Tracking and Notifications",
  "Lost Document Assistance Center": "Accessibility",
  "Recovery Scam Shield": "Security and Verification",
  "Safe Meetup Planner": "Security and Verification",
  "Community Sighting Network": "Community Assistance",
  "Voice-to-Report": "Accessibility",
  "Item Identity Fingerprint": "Security and Verification",
  "Barangay Recovery Bulletin": "Government and Organization Coordination",
  "Organization Partner Portal": "Government and Organization Coordination",
  "Multilingual Recovery Network": "Accessibility",
  "Recovery Hero Recognition": "Community Assistance",
};

const featureCategoryGuidance: Record<FeatureExplorerCategory, {
  intendedUsers: string;
  potentialBenefit: string;
  problem: string;
  safety: string;
  relatedDirectories: string[];
}> = {
  "Artificial Intelligence": {
    intendedUsers: "People, families, and community members seeking help understanding or comparing future recovery information.",
    potentialBenefit: "If responsibly developed, this idea could make relevant information easier to discover or interpret; it would not guarantee a match or recovery.",
    problem: "Descriptions and images may be difficult to compare when recovery information is scattered across different places.",
    safety: "Any future automated assistance would need human oversight, privacy safeguards for submitted images or text, and clear limits; no AI matching runs on this website.",
    relatedDirectories: ["Lost Personal Belongings", "Found Personal Belongings", "Lost and Found Documents and IDs", "Lost and Found Pets"],
  },
  "Security and Verification": {
    intendedUsers: "People sharing or claiming item information, and any future authorized participants responsible for a safe handover.",
    potentialBenefit: "If developed carefully, the concept could support more deliberate ownership checks or safer information handling before an item return.",
    problem: "An item-return process may need thoughtful ways to protect privacy, discourage false claims, and reduce unsafe handovers.",
    safety: "No verification, custody record, meetup service, or scam detection is active. Future safeguards would need clear consent, limited data collection, and safe human-reviewed procedures.",
    relatedDirectories: ["Found Personal Belongings", "Lost and Found Documents and IDs", "Found Cash and Valuables", "Found Electronics"],
  },
  "Community Assistance": {
    intendedUsers: "Individuals, families, and community members who may want to share helpful recovery information in a future phase.",
    potentialBenefit: "If introduced responsibly, these concepts could make community guidance easier to find and could encourage helpful, safety-minded participation.",
    problem: "People may not know where to find relevant community information or how to coordinate assistance safely.",
    safety: "No volunteers, sightings, posters, recognition program, or participating community groups are active. Any future participation would need moderation, privacy controls, and clear role boundaries.",
    relatedDirectories: ["Lost and Found Pets", "Missing Persons Assistance", "Community Recovery Assistance", "Barangay Recovery Directory"],
  },
  "Tracking and Notifications": {
    intendedUsers: "People who may need to review future matching information or follow an eventual recovery pathway.",
    potentialBenefit: "If built, these ideas could help people notice relevant information or understand the steps in a future process; they do not represent current case status or statistics.",
    problem: "When information is shared over time, people may find it difficult to notice a potential match or follow the next planned step.",
    safety: "There are no live notifications, cases, user profiles, or recovery statistics. Any future status or alert feature would require consent, careful access controls, and transparent data handling.",
    relatedDirectories: ["Lost Personal Belongings", "Lost and Found Documents and IDs", "Transport Lost and Found", "Nationwide Recovery Directory"],
  },
  "Transportation": {
    intendedUsers: "Travelers, passengers, vehicle owners, families, and communities seeking a future transport-related information pathway.",
    potentialBenefit: "A future transport concept could help people find the right recovery topic or understand planned regional context; it would not track live trips or vehicles.",
    problem: "Items misplaced during a journey can be difficult to connect with an appropriate future transport-related information pathway.",
    safety: "No live map activity, route tracking, vehicle data, operators, or hubs are active. Future location features would need strict privacy controls and must not expose a person’s real-time whereabouts.",
    relatedDirectories: ["Transport Lost and Found", "Lost and Found Vehicles", "Lost Travel Documents", "Nationwide Recovery Directory"],
  },
  "Government and Organization Coordination": {
    intendedUsers: "Future authorized community organizations and people seeking public-facing guidance, if organizations choose to participate.",
    potentialBenefit: "If established with appropriate authorization, an information portal or bulletin could help explain where approved guidance belongs.",
    problem: "People may need clearer ways to distinguish future organization-provided guidance from unverified public information.",
    safety: "No governments, barangays, establishments, or organizations are confirmed RECOVPH partners. Any future portal would require explicit authorization, transparent attribution, and safeguards against impersonation.",
    relatedDirectories: ["Barangay Recovery Directory", "Nationwide Recovery Directory", "Community Recovery Assistance", "Lost Business Property"],
  },
  "Accessibility": {
    intendedUsers: "People who may benefit from offline preparation, voice interaction, language support, or simpler information pathways.",
    potentialBenefit: "If developed, these ideas could reduce some language, connectivity, or interaction barriers to understanding recovery information.",
    problem: "Connectivity limits, language differences, or interaction needs may make it harder to access future recovery guidance.",
    safety: "No offline reporting, voice capture, translation, or document assistance operates today. Future features would need consent, accessible alternatives, privacy-conscious handling, and clear human review.",
    relatedDirectories: ["Lost Personal Belongings", "Lost and Found Documents and IDs", "Lost Medical Equipment", "Lost and Found Pets"],
  },
};

export type FeatureExplorerItem = IconCard & {
  slug: string;
  category: FeatureExplorerCategory;
  keywords: string[];
  intendedUsers: string;
  potentialBenefit: string;
  problem: string;
  plannedApproach: string;
  overview: string;
  privacySafety: string;
  relatedDirectories: string[];
};

export const featureExplorerItems: FeatureExplorerItem[] = features.map((feature) => {
  const category = featureCategoryByTitle[feature.title];
  const guidance = featureCategoryGuidance[category];
  return {
    ...feature,
    slug: slugify(feature.title),
    category,
    keywords: [category, ...category.split(" "), ...feature.title.split(" ")],
    intendedUsers: guidance.intendedUsers,
    potentialBenefit: guidance.potentialBenefit,
    problem: guidance.problem,
    plannedApproach: `${feature.description} If developed, this would remain a future concept and would need to be designed with privacy, safety, accessibility, and appropriate review in mind. It is not available today.`,
    overview: `${feature.title} is a planned RECOVPH concept. ${feature.description}`,
    privacySafety: guidance.safety,
    relatedDirectories: guidance.relatedDirectories,
  };
});

export const usedFeatureExplorerCategories = featureExplorerCategories.filter((category) => featureExplorerItems.some((item) => item.category === category));

export function directorySearchText(item: DirectoryExplorerItem): string {
  return [item.title, item.description, item.explorerCategory, item.categoryDescription, item.purpose, ...item.itemTypes, ...item.keywords].join(" ").toLowerCase();
}

export function directoryMatchesSearch(item: DirectoryExplorerItem, query: string): boolean {
  const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return true;
  const fields = [item.title, item.description, item.explorerCategory, item.categoryDescription, item.purpose, ...item.itemTypes, ...item.keywords].map(normalize);
  const terms = normalizedQuery.split(/\s+/);
  if (terms.length === 1 && terms[0].length <= 3) return fields.some((field) => field.split(/\s+/).includes(terms[0]));
  return fields.some((field) => field.includes(normalizedQuery)) || terms.every((term) => fields.some((field) => field.split(/\s+/).includes(term)));
}

export function featureSearchText(item: FeatureExplorerItem): string {
  return [item.title, item.description, item.category, item.intendedUsers, item.potentialBenefit, ...item.keywords].join(" ").toLowerCase();
}
