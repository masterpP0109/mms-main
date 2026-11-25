export type FilterCategory =
  | "All Services"
  | "Conference Technology"
  | "Visual Displays"
  | "Audio"
  | "Lighting & Stage"
  | "Media Production"
  | "Entertainment";

export const TECHNOLOGY_FILTER_CATEGORIES: FilterCategory[] = [
  "All Services",
  "Conference Technology",
  "Visual Displays",
  "Audio",
  "Lighting & Stage",
  "Media Production",
  "Entertainment",
];

export type DemonstrationType =
  | "podium-branding"
  | "lighting-atmosphere"
  | "led-applications"
  | "interpretation-flow"
  | "interactive-display";

export interface WorkflowStep {
  step: string;
  title: string;
  detail: string;
}

export interface EquipmentSpec {
  label: string;
  value: string;
}

export interface EquipmentCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  displayOrder: number;
  published: boolean;
}

export interface EquipmentType {
  id: string;
  categorySlug: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  displayOrder: number;
}

export interface EquipmentComparisonAttributes {
  environment?: string;
  pixelPitch?: string;
  brightness?: string;
  dimensions?: string;
  microphoneType?: string;
  connectivity?: string;
  pickupPattern?: string;
  handsFree?: string;
  fixtureType?: string;
  lightSource?: string;
  colourMixing?: string;
  beamCharacteristics?: string;
  applicationFocus?: string;
}

export interface EquipmentItem {
  id: string;
  slug: string;
  name: string;
  manufacturer: string;
  model: string;
  equipmentTypeSlug: string;
  equipmentTypeName: string;
  parentCategorySlug: string;
  parentCategoryTitle: string;
  shortDescription: string;
  whatItDoes: string;
  benefits: string[];
  primaryImage: string;
  primaryImageAlt: string;
  gallery: { src: string; alt: string; caption: string }[];
  eventApplications: string[];
  specs: EquipmentSpec[];
  comparison?: EquipmentComparisonAttributes;
  howItWorks?: WorkflowStep[];
  demonstrationType?: DemonstrationType;
  relatedSlugs: { categorySlug: string; equipmentSlug: string; name: string; image: string }[];
  verificationStatus: "mms-verified" | "draft";
  availabilityClassification: "owned" | "partner-sourced" | "on-request";
  published: boolean;
  seoTitle: string;
  seoDescription: string;
}

export interface CategoryPresentation {
  slug: string;
  displayTitle: string;
  filterCategories: FilterCategory[];
  cardSummary: string;
  categoryIntro: string;
  demonstrationType?: DemonstrationType;
  howItWorks?: {
    title: string;
    subtitle: string;
    steps: WorkflowStep[];
  };
  eventApplications: string[];
  equipmentSlugs: string[];
  pixelPitchNote?: string;
}

export const EQUIPMENT_CATEGORIES: EquipmentCategory[] = [
  {
    id: "cat-conference-interpretation",
    name: "Conference & Interpretation",
    slug: "conference-microphone-interpretation-equipment",
    description: "Connect audiences across languages with clear delegate microphones and live interpretation.",
    coverImage: "/services%20images/5e3c3df339009497f72d40842dd6c19b.jpg",
    displayOrder: 1,
    published: true,
  },
  {
    id: "cat-led-screens",
    name: "LED Screens & Displays",
    slug: "led-screen-rental",
    description: "Bring presentations, live camera feeds and event branding to life at any scale.",
    coverImage: "/services%20images/LED%20Screen%20Rental.jpg",
    displayOrder: 2,
    published: true,
  },
  {
    id: "cat-sound",
    name: "Professional Sound",
    slug: "professional-sound-systems",
    description: "Make every word and musical cue heard clearly across any indoor or outdoor venue.",
    coverImage: "/mms/PaSystem/WhatsApp%20Image%202026-10-03%20at%2010.42.11%20AM.jpeg",
    displayOrder: 3,
    published: true,
  },
  {
    id: "cat-lighting-stage",
    name: "Lighting & Stage",
    slug: "event-lighting-stage-setup",
    description: "Transform your venue with intelligent stage lighting, truss rigging and branded backdrops.",
    coverImage: "/mms/eventlght/modern-stage-setup-with-large-screen-chairs-conference-event_1187703-176862.avif",
    displayOrder: 4,
    published: true,
  },
  {
    id: "cat-digital-podiums",
    name: "Digital Podiums",
    slug: "digital-podiums",
    description: "Give every presenter a modern lectern displaying your event branding on stage.",
    coverImage: "/mms/mms/podium/WhatsApp%20Image%202026-11-20%20at%2014.19.00.jpeg",
    displayOrder: 5,
    published: true,
  },
  {
    id: "cat-interactive-displays",
    name: "Interactive Displays",
    slug: "interactive-screens",
    description: "Turn spectators into participants with touchscreens, vertical signage and live Q&A.",
    coverImage:
      "/mms/interactiveScreens/OEM-ODM-86-Inch-Business-Meeting-Presentation-Interactive-LED-Touch-Screen-Monitor-White-Board.avif",
    displayOrder: 6,
    published: true,
  },
  {
    id: "cat-live-streaming",
    name: "Live Streaming",
    slug: "live-streaming-production",
    description: "Reach remote delegates beyond the venue with multi-camera switching and live graphics.",
    coverImage: "/mms/mms/dj%20services%20and%20entertainment/live%20streaming%20.jpeg",
    displayOrder: 7,
    published: true,
  },
  {
    id: "cat-photography-film",
    name: "Photography & Film",
    slug: "videography-photography",
    description: "Capture the moments that matter with cinematic highlight films and event photography.",
    coverImage: "/mms/mms/video%20production/IMG_2306.jpg",
    displayOrder: 8,
    published: true,
  },
  {
    id: "cat-entertainment",
    name: "Entertainment & Effects",
    slug: "dj-services",
    description: "Create memorable evening celebrations with professional DJs, sound and curated energy.",
    coverImage: "/mms/mms/dj%20services%20and%20entertainment/DSC_7080.jpg",
    displayOrder: 9,
    published: true,
  },
];

export const EQUIPMENT_TYPES: EquipmentType[] = [
  {
    id: "type-delegate-mics",
    categorySlug: "conference-microphone-interpretation-equipment",
    name: "Conference Microphones",
    slug: "conference-microphones",
    description: "Tabletop delegate and chairperson units for structured discussions.",
    image: "/services%20images/5e3c3df339009497f72d40842dd6c19b.jpg",
    displayOrder: 1,
  },
  {
    id: "type-interpretation-booths",
    categorySlug: "conference-microphone-interpretation-equipment",
    name: "Interpretation Booths",
    slug: "interpretation-booths",
    description: "Sound-isolated interpreter workspaces for live translation.",
    image: "/mms/conferenceServicesImagesGallery/How-To-Choose-A-Wireless-Interpretation-System-For-Large-Venues.jpg.jpeg",
    displayOrder: 2,
  },
  {
    id: "type-receivers-headsets",
    categorySlug: "conference-microphone-interpretation-equipment",
    name: "Receivers & Headsets",
    slug: "receivers-and-headsets",
    description: "Wireless delegate receivers and headsets for multilingual listening.",
    image: "/mms/conferenceServicesImagesGallery/istockphoto-1141955531-612x612.jpg.jpeg",
    displayOrder: 3,
  },
  {
    id: "type-indoor-led",
    categorySlug: "led-screen-rental",
    name: "Indoor LED",
    slug: "indoor-led",
    description: "High-contrast modular LED walls for conference halls and stages.",
    image: "/services%20images/LED%20Screen%20Rental.jpg",
    displayOrder: 1,
  },
  {
    id: "type-outdoor-led",
    categorySlug: "led-screen-rental",
    name: "Outdoor LED",
    slug: "outdoor-led",
    description: "High-brightness LED screens for daylight and open-air events.",
    image: "/mms/ledScreens/billo.png",
    displayOrder: 2,
  },
  {
    id: "type-pa-speakers",
    categorySlug: "professional-sound-systems",
    name: "PA & Line Arrays",
    slug: "pa-and-line-arrays",
    description: "Main speaker systems sized for clear coverage across any venue.",
    image: "/mms/PaSystem/WhatsApp%20Image%202026-10-03%20at%2010.42.11%20AM.jpeg",
    displayOrder: 1,
  },
  {
    id: "type-mixing-wireless",
    categorySlug: "professional-sound-systems",
    name: "Audio Control & Wireless Mics",
    slug: "audio-control-and-wireless-mics",
    description: "Digital mixing consoles and wireless handheld or lapel microphones.",
    image: "/mms/PaSystem/vlcsnap-2026-10-03-10h06m45s223.png",
    displayOrder: 2,
  },
  {
    id: "type-lighting",
    categorySlug: "event-lighting-stage-setup",
    name: "Stage Lighting",
    slug: "stage-lighting",
    description: "Moving-head, wash and spotlight fixtures for stage atmosphere.",
    image: "/mms/eventlght/stage-lights-illuminate-a-smoky-atmosphere-with-purple-and-white-beams-on-a-wooden-floor-photo.jpeg",
    displayOrder: 1,
  },
  {
    id: "type-staging",
    categorySlug: "event-lighting-stage-setup",
    name: "Stage & Rigging",
    slug: "stage-and-rigging",
    description: "Modular stage platforms, structural trussing and branded backdrops.",
    image: "/mms/eventlght/modern-stage-setup-with-large-screen-chairs-conference-event_1187703-176862.avif",
    displayOrder: 2,
  },
  {
    id: "type-podiums",
    categorySlug: "digital-podiums",
    name: "Branded Digital Podiums",
    slug: "branded-digital-podiums",
    description: "Modern lecterns with integrated front-facing event branding displays.",
    image: "/mms/mms/podium/WhatsApp%20Image%202026-11-20%20at%2014.19.00.jpeg",
    displayOrder: 1,
  },
  {
    id: "type-interactive",
    categorySlug: "interactive-screens",
    name: "Touchscreens & Digital Totems",
    slug: "touchscreens-and-totems",
    description: "Interactive touch displays and vertical digital signage.",
    image:
      "/mms/interactiveScreens/OEM-ODM-86-Inch-Business-Meeting-Presentation-Interactive-LED-Touch-Screen-Monitor-White-Board.avif",
    displayOrder: 1,
  },
  {
    id: "type-streaming",
    categorySlug: "live-streaming-production",
    name: "Streaming Systems",
    slug: "streaming-systems",
    description: "Multi-camera switching, encoding and live broadcast graphics.",
    image: "/mms/mms/dj%20services%20and%20entertainment/live%20streaming%20.jpeg",
    displayOrder: 1,
  },
  {
    id: "type-video-photo",
    categorySlug: "videography-photography",
    name: "Cameras & Production",
    slug: "cameras-and-production",
    description: "Cinema cameras and photography kits for event storytelling.",
    image: "/mms/mms/video%20production/IMG_2306.jpg",
    displayOrder: 1,
  },
  {
    id: "type-dj",
    categorySlug: "dj-services",
    name: "DJ & Entertainment",
    slug: "dj-and-entertainment",
    description: "Professional DJ consoles, sound and lighting integration.",
    image: "/mms/mms/dj%20services%20and%20entertainment/DSC_7080.jpg",
    displayOrder: 1,
  },
];

export const CATEGORY_PRESENTATIONS: Record<string, CategoryPresentation> = {
  "conference-microphone-interpretation-equipment": {
    slug: "conference-microphone-interpretation-equipment",
    displayTitle: "Conference & Interpretation",
    filterCategories: ["Conference Technology", "Audio"],
    cardSummary: "Connect audiences across languages with clear delegate microphones and live interpretation.",
    categoryIntro:
      "Professional conference technology that helps delegates speak clearly, listen in their preferred language and participate without barriers.",
    demonstrationType: "interpretation-flow",
    howItWorks: {
      title: "How Simultaneous Interpretation Works",
      subtitle: "One event. Multiple languages. A shared experience.",
      steps: [
        {
          step: "01",
          title: "Speaker",
          detail: "A delegate or keynote speaker speaks into a conference microphone at the table or podium.",
        },
        {
          step: "02",
          title: "Interpreter",
          detail: "Live interpreters inside a sound-isolated booth hear the floor audio and translate in real time.",
        },
        {
          step: "03",
          title: "Audio Transmission",
          detail: "Central control equipment transmits each language channel clearly across the room.",
        },
        {
          step: "04",
          title: "Delegate",
          detail: "Participants select their preferred language channel on wireless receivers and headsets.",
        },
      ],
    },
    eventApplications: [
      "International Summits",
      "Government & Ministry Meetings",
      "NGO & Diplomatic Forums",
      "Board & Plenary Sessions",
    ],
    equipmentSlugs: [
      "conference-microphones",
      "interpretation-booths",
      "receivers-and-headsets",
    ],
  },
  "led-screen-rental": {
    slug: "led-screen-rental",
    displayTitle: "LED Screens & Displays",
    filterCategories: ["Visual Displays"],
    cardSummary: "Bring presentations, live camera feeds and event branding to life at any scale.",
    categoryIntro:
      "High-brightness indoor and outdoor LED video walls configured for keynote stages, exhibitions and live event storytelling.",
    pixelPitchNote:
      "Smaller pixel pitch generally provides finer image detail for audiences viewing the screen from closer distances. Indoor or outdoor suitability depends on weather sealing and brightness as well as pixel pitch.",
    demonstrationType: "led-applications",
    eventApplications: [
      "Keynote Stages",
      "Corporate Conferences",
      "Outdoor Public Events",
      "Brand Activations & Awards",
    ],
    equipmentSlugs: [
      "indoor-led-video-walls",
      "outdoor-led-displays",
    ],
  },
  "professional-sound-systems": {
    slug: "professional-sound-systems",
    displayTitle: "Professional Sound",
    filterCategories: ["Audio"],
    cardSummary: "Make every word and musical cue heard clearly across any indoor or outdoor venue.",
    categoryIntro:
      "Balanced PA speakers, line arrays, digital mixing and wireless microphones tailored to your room acoustics and audience size.",
    eventApplications: [
      "Plenary Halls",
      "Outdoor Ceremonies",
      "Corporate Galas",
      "Live Performances",
    ],
    equipmentSlugs: [
      "pa-and-line-array-systems",
      "digital-mixing-and-wireless-mics",
    ],
  },
  "event-lighting-stage-setup": {
    slug: "event-lighting-stage-setup",
    displayTitle: "Lighting & Stage",
    filterCategories: ["Lighting & Stage"],
    cardSummary: "Transform your venue with intelligent stage lighting, truss rigging and branded backdrops.",
    categoryIntro:
      "Stage platforms, intelligent lighting fixtures and clean rigging that shape atmosphere and keep speakers clearly lit for cameras and guests.",
    demonstrationType: "lighting-atmosphere",
    eventApplications: [
      "Awards Ceremonies",
      "Conference Keynotes",
      "Gala Dinners",
      "Product Launches",
    ],
    equipmentSlugs: [
      "intelligent-stage-lighting",
      "stage-platforms-truss-backdrops",
    ],
  },
  "digital-podiums": {
    slug: "digital-podiums",
    displayTitle: "Digital Podiums",
    filterCategories: ["Conference Technology", "Visual Displays"],
    cardSummary: "Give every presenter a modern lectern displaying your event branding on stage.",
    categoryIntro:
      "A modern lectern with an integrated front LED display that showcases event logos, speaker names and sponsor branding directly from the stage.",
    demonstrationType: "podium-branding",
    eventApplications: [
      "International Conferences",
      "Corporate Summits",
      "Awards Ceremonies",
      "Executive Briefings",
    ],
    equipmentSlugs: ["smart-digital-podium"],
  },
  "interactive-screens": {
    slug: "interactive-screens",
    displayTitle: "Interactive Displays",
    filterCategories: ["Visual Displays", "Conference Technology"],
    cardSummary: "Turn spectators into participants with touchscreens, vertical signage and live Q&A.",
    categoryIntro:
      "Touch-enabled displays and digital signage that invite guests to explore schedules, maps, product stories and live audience polls.",
    demonstrationType: "interactive-display",
    eventApplications: [
      "Exhibitions & Expo Booths",
      "Breakout Workshops",
      "Registration & Wayfinding",
      "Executive Boardrooms",
    ],
    equipmentSlugs: ["interactive-touch-displays"],
  },
  "live-streaming-production": {
    slug: "live-streaming-production",
    displayTitle: "Live Streaming",
    filterCategories: ["Media Production", "Conference Technology"],
    cardSummary: "Reach remote delegates beyond the venue with multi-camera switching and live graphics.",
    categoryIntro:
      "End-to-end broadcast production capabilities combining multi-camera capture, live switching, speaker graphics and remote platform integration.",
    eventApplications: [
      "Hybrid Conferences",
      "Virtual Town Halls",
      "Public Broadcasts",
      "Panel Discussions",
    ],
    equipmentSlugs: ["multi-camera-live-streaming"],
  },
  "videography-photography": {
    slug: "videography-photography",
    displayTitle: "Photography & Film",
    filterCategories: ["Media Production"],
    cardSummary: "Capture the moments that matter with cinematic highlight films and event photography.",
    categoryIntro:
      "Dedicated camera and photography production teams delivering same-day edits, corporate documentaries and full event archives.",
    eventApplications: [
      "Corporate Conferences",
      "Brand Campaigns",
      "Weddings & Celebrations",
      "Documentaries",
    ],
    equipmentSlugs: ["event-videography-and-photography"],
  },
  "dj-services": {
    slug: "dj-services",
    displayTitle: "Entertainment & Effects",
    filterCategories: ["Entertainment", "Audio"],
    cardSummary: "Create memorable evening celebrations with professional DJs, sound and curated energy.",
    categoryIntro:
      "Experienced event DJs paired with club-grade decks, synchronized sound and lighting for gala dinners, receptions and celebrations.",
    eventApplications: [
      "Corporate Gala Dinners",
      "Wedding Receptions",
      "VIP After-Parties",
      "Social Celebrations",
    ],
    equipmentSlugs: ["professional-dj-setup"],
  },
};

export const EQUIPMENT_CATALOG: EquipmentItem[] = [
  {
    id: "eq-conference-mics",
    slug: "conference-microphones",
    name: "Conference Microphones",
    manufacturer: "MMS Inventory",
    model: "Delegate & Chairperson System",
    equipmentTypeSlug: "conference-microphones",
    equipmentTypeName: "Conference Microphones",
    parentCategorySlug: "conference-microphone-interpretation-equipment",
    parentCategoryTitle: "Conference & Interpretation",
    shortDescription:
      "Tabletop delegate and chairperson microphones that let participants speak clearly from their seats.",
    whatItDoes:
      "Delegates press a button on their tabletop unit to speak without passing handheld microphones around the room, keeping boardrooms, summits and plenary discussions structured and clear.",
    benefits: [
      "Delegates speak clearly from their seat without waiting for a roving mic",
      "Chairperson priority control keeps formal meetings on schedule",
      "Clean, tidy table layout suitable for government and diplomatic rooms",
      "Direct audio feed for recording, live streaming and interpreters",
    ],
    primaryImage: "/services%20images/5e3c3df339009497f72d40842dd6c19b.jpg",
    primaryImageAlt: "Conference tabletop microphone systems arranged for a meeting",
    gallery: [
      {
        src: "/services%20images/5e3c3df339009497f72d40842dd6c19b.jpg",
        alt: "Conference delegate microphones on table",
        caption: "Delegate tabletop units positioned for clear voice pickup.",
      },
      {
        src: "/mms/conferenceServicesImagesGallery/images%20(62).jpg.jpeg",
        alt: "Conference room audio and interpretation setup",
        caption: "Integrated room audio for formal roundtables and summits.",
      },
      {
        src: "/mms/mms/dj%20services%20and%20entertainment/WhatsApp%20Image%202026-11-20%20at%2014.25.39%20(1).jpeg",
        alt: "Live conference hall with audio and visual production",
        caption: "Full conference hall production supported by MMS audio technicians.",
      },
    ],
    eventApplications: [
      "Government & Ministry Meetings",
      "Diplomatic Summits",
      "Boardrooms & Roundtables",
      "Panel Discussions",
    ],
    specs: [
      { label: "Configuration", value: "Wired or wireless delegate & chairperson units (confirmed per room layout)" },
      { label: "System Integration", value: "Connects directly to PA audio, recording and interpretation booths" },
      { label: "Technical Support", value: "On-site MMS audio technician for setup and live operation" },
    ],
    comparison: {
      microphoneType: "Delegate Tabletop",
      connectivity: "Wired / Wireless",
      handsFree: "Yes",
      applicationFocus: "Boardrooms & Summits",
    },
    howItWorks: CATEGORY_PRESENTATIONS["conference-microphone-interpretation-equipment"].howItWorks?.steps,
    demonstrationType: "interpretation-flow",
    relatedSlugs: [
      {
        categorySlug: "conference-microphone-interpretation-equipment",
        equipmentSlug: "interpretation-booths",
        name: "Interpretation Booths",
        image: "/mms/conferenceServicesImagesGallery/How-To-Choose-A-Wireless-Interpretation-System-For-Large-Venues.jpg.jpeg",
      },
      {
        categorySlug: "conference-microphone-interpretation-equipment",
        equipmentSlug: "receivers-and-headsets",
        name: "Receivers & Headsets",
        image: "/mms/conferenceServicesImagesGallery/istockphoto-1141955531-612x612.jpg.jpeg",
      },
      {
        categorySlug: "digital-podiums",
        equipmentSlug: "smart-digital-podium",
        name: "Digital Podium",
        image: "/mms/mms/podium/WhatsApp%20Image%202026-11-20%20at%2014.19.00.jpeg",
      },
    ],
    verificationStatus: "mms-verified",
    availabilityClassification: "owned",
    published: true,
    seoTitle: "Conference Microphones | MMS Technology Catalogue",
    seoDescription:
      "Delegate and chairperson conference microphone systems for clear meetings, summits and multilingual conferences in Victoria Falls and Zimbabwe.",
  },
  {
    id: "eq-interpretation-booths",
    slug: "interpretation-booths",
    name: "Interpretation Booths",
    manufacturer: "MMS Inventory",
    model: "Sound-Isolated Booth",
    equipmentTypeSlug: "interpretation-booths",
    equipmentTypeName: "Interpretation Booths",
    parentCategorySlug: "conference-microphone-interpretation-equipment",
    parentCategoryTitle: "Conference & Interpretation",
    shortDescription:
      "Sound-isolated booths where live interpreters translate speeches in real time without disturbing the room.",
    whatItDoes:
      "Enclosed acoustic booths give professional interpreters a quiet, focused workspace with clear sightlines to the stage so they can translate simultaneously for multilingual delegates.",
    benefits: [
      "Isolates interpreter voices from the main conference floor",
      "Supports real-time multi-language translation without pausing speakers",
      "Positioned for clear sightlines to stage screens and presenters",
      "Managed end-to-end by MMS audio and conference technicians",
    ],
    primaryImage: "/mms/conferenceServicesImagesGallery/How-To-Choose-A-Wireless-Interpretation-System-For-Large-Venues.jpg.jpeg",
    primaryImageAlt: "Simultaneous interpretation booth setup for a conference",
    gallery: [
      {
        src: "/mms/conferenceServicesImagesGallery/How-To-Choose-A-Wireless-Interpretation-System-For-Large-Venues.jpg.jpeg",
        alt: "Interpretation booth in conference venue",
        caption: "Dedicated interpreter workspace inside the conference hall.",
      },
      {
        src: "/mms/conferenceServicesImagesGallery/images%20(62).jpg.jpeg",
        alt: "Multilingual conference setup",
        caption: "Coordinated audio routing between stage, booth and audience.",
      },
    ],
    eventApplications: [
      "International Conferences",
      "UN & NGO Forums",
      "Cross-Border Summits",
      "Bilingual Workshops",
    ],
    specs: [
      { label: "Language Channels", value: "Configured per event language brief (confirmed on quotation)" },
      { label: "Placement", value: "Rear or side of hall with direct sightline to stage" },
      { label: "Note", value: "Interpreter staffing is coordinated separately or via client-appointed interpreters" },
    ],
    howItWorks: CATEGORY_PRESENTATIONS["conference-microphone-interpretation-equipment"].howItWorks?.steps,
    demonstrationType: "interpretation-flow",
    relatedSlugs: [
      {
        categorySlug: "conference-microphone-interpretation-equipment",
        equipmentSlug: "conference-microphones",
        name: "Conference Microphones",
        image: "/services%20images/5e3c3df339009497f72d40842dd6c19b.jpg",
      },
      {
        categorySlug: "conference-microphone-interpretation-equipment",
        equipmentSlug: "receivers-and-headsets",
        name: "Receivers & Headsets",
        image: "/mms/conferenceServicesImagesGallery/istockphoto-1141955531-612x612.jpg.jpeg",
      },
    ],
    verificationStatus: "mms-verified",
    availabilityClassification: "owned",
    published: true,
    seoTitle: "Simultaneous Interpretation Booths | MMS Technology Catalogue",
    seoDescription:
      "Sound-isolated simultaneous interpretation booths for multilingual conferences and international summits.",
  },
  {
    id: "eq-receivers-headsets",
    slug: "receivers-and-headsets",
    name: "Receivers & Headsets",
    manufacturer: "MMS Inventory",
    model: "Wireless Delegate Receiver",
    equipmentTypeSlug: "receivers-and-headsets",
    equipmentTypeName: "Receivers & Headsets",
    parentCategorySlug: "conference-microphone-interpretation-equipment",
    parentCategoryTitle: "Conference & Interpretation",
    shortDescription:
      "Lightweight wireless receivers and headsets so every delegate can listen in their preferred language.",
    whatItDoes:
      "Delegates pick up a pocket-sized receiver with a comfortable headset at registration and switch channels to hear live translated audio clearly anywhere in the venue.",
    benefits: [
      "Simple channel selection so every delegate chooses their language",
      "Lightweight, comfortable headsets for full-day conference sessions",
      "Clear audio reception across plenary and breakout halls",
      "Distribution and collection support available on site",
    ],
    primaryImage: "/mms/conferenceServicesImagesGallery/istockphoto-1141955531-612x612.jpg.jpeg",
    primaryImageAlt: "Wireless interpretation headsets and receivers for delegates",
    gallery: [
      {
        src: "/mms/conferenceServicesImagesGallery/istockphoto-1141955531-612x612.jpg.jpeg",
        alt: "Delegate receivers and headsets",
        caption: "Wireless delegate receivers prepared for multilingual sessions.",
      },
      {
        src: "/mms/conferenceServicesImagesGallery/images%20(62).jpg.jpeg",
        alt: "Conference room audio distribution",
        caption: "Seamless language distribution across the conference floor.",
      },
    ],
    eventApplications: [
      "Multilingual Plenaries",
      "International Delegations",
      "Breakout Sessions",
      "Public Consultations",
    ],
    specs: [
      { label: "Quantity", value: "Scaled to confirmed delegate count" },
      { label: "Hygiene & Prep", value: "Cleaned, charged and channel-tested prior to session start" },
      { label: "Distribution", value: "Managed handover desk support available on request" },
    ],
    howItWorks: CATEGORY_PRESENTATIONS["conference-microphone-interpretation-equipment"].howItWorks?.steps,
    demonstrationType: "interpretation-flow",
    relatedSlugs: [
      {
        categorySlug: "conference-microphone-interpretation-equipment",
        equipmentSlug: "interpretation-booths",
        name: "Interpretation Booths",
        image: "/mms/conferenceServicesImagesGallery/How-To-Choose-A-Wireless-Interpretation-System-For-Large-Venues.jpg.jpeg",
      },
      {
        categorySlug: "conference-microphone-interpretation-equipment",
        equipmentSlug: "conference-microphones",
        name: "Conference Microphones",
        image: "/services%20images/5e3c3df339009497f72d40842dd6c19b.jpg",
      },
    ],
    verificationStatus: "mms-verified",
    availabilityClassification: "owned",
    published: true,
    seoTitle: "Interpretation Receivers & Headsets | MMS Technology Catalogue",
    seoDescription:
      "Wireless delegate receivers and headsets for simultaneous interpretation at conferences and multilingual events.",
  },
  {
    id: "eq-indoor-led",
    slug: "indoor-led-video-walls",
    name: "Indoor LED Video Walls",
    manufacturer: "MMS Inventory",
    model: "Modular Indoor LED",
    equipmentTypeSlug: "indoor-led",
    equipmentTypeName: "Indoor LED",
    parentCategorySlug: "led-screen-rental",
    parentCategoryTitle: "LED Screens & Displays",
    shortDescription:
      "Seamless, high-brightness LED walls that replace dim projectors on conference and gala stages.",
    whatItDoes:
      "Modular LED panels join together into a crisp, bright stage backdrop that stays vivid even with room lights on — ideal for slides, sponsor loops, videos and live camera feeds.",
    benefits: [
      "Remains bright and readable in fully lit conference halls",
      "Customisable width and height to fit your stage and room sightlines",
      "Supports split-screen layouts for speakers, slides and remote guests",
      "Installed, calibrated and operated by MMS display engineers",
    ],
    primaryImage: "/services%20images/LED%20Screen%20Rental.jpg",
    primaryImageAlt: "Large indoor LED video wall on a conference stage",
    gallery: [
      {
        src: "/services%20images/LED%20Screen%20Rental.jpg",
        alt: "Indoor LED video wall stage setup",
        caption: "Wide-format LED backdrop for keynote presentations.",
      },
      {
        src: "/mms/ledScreens/vlcsnap-2026-10-03-10h06m32s158.png",
        alt: "LED screen displaying live event visuals",
        caption: "High-contrast visuals visible from the back of the hall.",
      },
      {
        src: "/mms/ledScreens/istockphoto-2170871481-612x612.jpg.jpeg",
        alt: "Corporate stage with LED wall",
        caption: "Seamless stage integration for conferences and awards.",
      },
    ],
    eventApplications: [
      "Conference Keynotes",
      "Awards & Gala Dinners",
      "Exhibitions",
      "Product Launches",
    ],
    specs: [
      { label: "Dimensions", value: "Modular sizing tailored to venue ceiling height and viewing distance" },
      { label: "Playback & Switching", value: "Supports presentations, video playback and live camera feeds" },
      { label: "Support", value: "Full rigging, power coordination and on-site operator included" },
    ],
    comparison: {
      environment: "Indoor",
      pixelPitch: "Confirmed on brief",
      brightness: "Indoor high-contrast",
      dimensions: "Modular / Custom",
      applicationFocus: "Keynotes & Conferences",
    },
    demonstrationType: "led-applications",
    relatedSlugs: [
      {
        categorySlug: "led-screen-rental",
        equipmentSlug: "outdoor-led-displays",
        name: "Outdoor LED Displays",
        image: "/mms/ledScreens/billo.png",
      },
      {
        categorySlug: "digital-podiums",
        equipmentSlug: "smart-digital-podium",
        name: "Digital Podium",
        image: "/mms/mms/podium/WhatsApp%20Image%202026-11-20%20at%2014.19.00.jpeg",
      },
    ],
    verificationStatus: "mms-verified",
    availabilityClassification: "owned",
    published: true,
    seoTitle: "Indoor LED Video Walls | MMS Technology Catalogue",
    seoDescription:
      "High-brightness indoor LED video walls for conferences, awards ceremonies and corporate stages.",
  },
  {
    id: "eq-outdoor-led",
    slug: "outdoor-led-displays",
    name: "Outdoor LED Displays",
    manufacturer: "MMS Inventory",
    model: "Daylight Outdoor LED",
    equipmentTypeSlug: "outdoor-led",
    equipmentTypeName: "Outdoor LED",
    parentCategorySlug: "led-screen-rental",
    parentCategoryTitle: "LED Screens & Displays",
    shortDescription:
      "High-brightness outdoor LED screens and digital billboards built for daylight visibility.",
    whatItDoes:
      "Designed for open-air venues, festivals and public campaigns, outdoor LED displays keep announcements, sponsor branding and live video sharp even in direct sunlight.",
    benefits: [
      "High brightness engineered for daytime outdoor viewing",
      "Weather-resistant enclosures suited to open-air venues",
      "Flexible staging for concerts, sports and public activations",
      "Full structural support and technical supervision on site",
    ],
    primaryImage: "/mms/ledScreens/billo.png",
    primaryImageAlt: "Outdoor LED digital display and advertising screen",
    gallery: [
      {
        src: "/mms/ledScreens/billo.png",
        alt: "Outdoor LED display",
        caption: "High-visibility outdoor LED display for public and corporate campaigns.",
      },
      {
        src: "/mms/ledScreens/bill.jpg",
        alt: "Outdoor digital signage LED screen",
        caption: "Daylight-readable display for brand activations and events.",
      },
      {
        src: "/mms/ledScreens/images (63).jpg (1).jpeg",
        alt: "Outdoor event LED wall",
        caption: "Large-format outdoor screen for open-air audiences.",
      },
    ],
    eventApplications: [
      "Outdoor Festivals",
      "Public Campaigns",
      "Sporting Events",
      "Brand Activations",
    ],
    specs: [
      { label: "Environment", value: "Rated for outdoor event conditions (confirmed per site survey)" },
      { label: "Power & Rigging", value: "Site power and wind/ground-support plan confirmed before setup" },
    ],
    comparison: {
      environment: "Outdoor",
      pixelPitch: "Confirmed on brief",
      brightness: "Daylight-visible",
      dimensions: "Modular / Custom",
      applicationFocus: "Outdoor Events & Billboards",
    },
    demonstrationType: "led-applications",
    relatedSlugs: [
      {
        categorySlug: "led-screen-rental",
        equipmentSlug: "indoor-led-video-walls",
        name: "Indoor LED Video Walls",
        image: "/services%20images/LED%20Screen%20Rental.jpg",
      },
      {
        categorySlug: "professional-sound-systems",
        equipmentSlug: "pa-and-line-array-systems",
        name: "PA & Line Array Systems",
        image: "/mms/PaSystem/WhatsApp%20Image%202026-10-03%20at%2010.42.11%20AM.jpeg",
      },
    ],
    verificationStatus: "mms-verified",
    availabilityClassification: "owned",
    published: true,
    seoTitle: "Outdoor LED Displays | MMS Technology Catalogue",
    seoDescription:
      "Daylight-visible outdoor LED screens and digital advertising displays for events and campaigns.",
  },
  {
    id: "eq-pa-line-array",
    slug: "pa-and-line-array-systems",
    name: "PA & Line Array Systems",
    manufacturer: "MMS Inventory",
    model: "PA & Line Array Rig",
    equipmentTypeSlug: "pa-and-line-arrays",
    equipmentTypeName: "PA & Line Arrays",
    parentCategorySlug: "professional-sound-systems",
    parentCategoryTitle: "Professional Sound",
    shortDescription:
      "Main speaker systems sized to deliver even, distortion-free sound from the front row to the back.",
    whatItDoes:
      "Whether it's a 60-person executive briefing or a 1,000-guest outdoor celebration, properly positioned PA speakers and line arrays ensure every guest hears speech and music without harsh volume.",
    benefits: [
      "Balanced sound coverage from front seats to back rows",
      "Clear speech intelligibility for keynotes and panels",
      "Scalable speaker setups for indoor halls or outdoor grounds",
      "Tuned on site to prevent echo and microphone feedback",
    ],
    primaryImage: "/mms/PaSystem/WhatsApp%20Image%202026-10-03%20at%2010.42.11%20AM.jpeg",
    primaryImageAlt: "Professional PA speaker and line array sound system setup",
    gallery: [
      {
        src: "/mms/PaSystem/WhatsApp%20Image%202026-10-03%20at%2010.42.11%20AM.jpeg",
        alt: "MMS PA system setup",
        caption: "Live PA speaker deployment at an event venue.",
      },
      {
        src: "/mms/PaSystem/vlcsnap-2026-10-03-10h05m49s490.png",
        alt: "Line array audio equipment",
        caption: "Focused speaker coverage for larger rooms and outdoor spaces.",
      },
      {
        src: "/services%20images/Professional%20Sound%20Systems.jpg",
        alt: "Event sound system speakers",
        caption: "Clean speaker placement matched to room acoustics.",
      },
    ],
    eventApplications: [
      "Plenary Conferences",
      "Outdoor Ceremonies",
      "Corporate Galas",
      "Live Entertainment",
    ],
    specs: [
      { label: "Sizing", value: "Matched to guest count, ceiling height and indoor/outdoor acoustics" },
      { label: "Operation", value: "Includes sound check and dedicated sound engineer" },
    ],
    relatedSlugs: [
      {
        categorySlug: "professional-sound-systems",
        equipmentSlug: "digital-mixing-and-wireless-mics",
        name: "Digital Mixing & Wireless Mics",
        image: "/mms/PaSystem/vlcsnap-2026-10-03-10h06m45s223.png",
      },
      {
        categorySlug: "dj-services",
        equipmentSlug: "professional-dj-setup",
        name: "Professional DJ Setup",
        image: "/mms/mms/dj%20services%20and%20entertainment/DSC_7080.jpg",
      },
    ],
    verificationStatus: "mms-verified",
    availabilityClassification: "owned",
    published: true,
    seoTitle: "PA & Line Array Sound Systems | MMS Technology Catalogue",
    seoDescription:
      "Professional PA speakers and line array sound systems for clear conference speech and live event audio.",
  },
  {
    id: "eq-mixing-wireless",
    slug: "digital-mixing-and-wireless-mics",
    name: "Digital Mixing & Wireless Mics",
    manufacturer: "MMS Inventory",
    model: "Digital Console & Wireless Mics",
    equipmentTypeSlug: "audio-control-and-wireless-mics",
    equipmentTypeName: "Audio Control & Wireless Mics",
    parentCategorySlug: "professional-sound-systems",
    parentCategoryTitle: "Professional Sound",
    shortDescription:
      "Digital sound consoles and wireless handheld or lapel mics that keep presenters moving freely.",
    whatItDoes:
      "Our sound engineers balance microphones, laptop audio and music in real time on a digital console, while reliable wireless handheld and lapel mics let speakers move naturally on stage.",
    benefits: [
      "Hands-free lapel mics and wireless handhelds for Q&A and panels",
      "Smooth transitions between presenters, videos and background music",
      "Clean audio feeds for recording and live streaming",
      "Proactive frequency coordination to avoid dropouts",
    ],
    primaryImage: "/mms/PaSystem/vlcsnap-2026-10-03-10h06m45s223.png",
    primaryImageAlt: "Digital audio mixing console operated by sound engineer",
    gallery: [
      {
        src: "/mms/PaSystem/vlcsnap-2026-10-03-10h06m45s223.png",
        alt: "Digital mixing console",
        caption: "Multi-channel digital mixing for crisp, controlled sound.",
      },
      {
        src: "/mms/PaSystem/WhatsApp%20Image%202026-10-03%20at%2010.42.11%20AM%20(1).jpeg",
        alt: "Live audio control setup",
        caption: "On-site audio engineering throughout your programme.",
      },
    ],
    eventApplications: [
      "Keynote Speeches",
      "Panel Discussions",
      "Moderator Q&A",
      "Hybrid Broadcasts",
    ],
    specs: [
      { label: "Microphone Options", value: "Handheld, lapel (lavalier) and headset mics confirmed per speaker list" },
      { label: "Recording", value: "Multitrack or stereo room recording available on request" },
    ],
    comparison: {
      microphoneType: "Handheld / Lapel",
      connectivity: "Wireless",
      handsFree: "Lapel: Yes / Handheld: No",
      applicationFocus: "Keynotes & Q&A",
    },
    relatedSlugs: [
      {
        categorySlug: "professional-sound-systems",
        equipmentSlug: "pa-and-line-array-systems",
        name: "PA & Line Array Systems",
        image: "/mms/PaSystem/WhatsApp%20Image%202026-10-03%20at%2010.42.11%20AM.jpeg",
      },
      {
        categorySlug: "conference-microphone-interpretation-equipment",
        equipmentSlug: "conference-microphones",
        name: "Conference Microphones",
        image: "/services%20images/5e3c3df339009497f72d40842dd6c19b.jpg",
      },
    ],
    verificationStatus: "mms-verified",
    availabilityClassification: "owned",
    published: true,
    seoTitle: "Digital Mixing & Wireless Microphones | MMS Technology Catalogue",
    seoDescription:
      "Digital mixing consoles and wireless handheld and lapel microphones with dedicated sound engineering.",
  },
  {
    id: "eq-stage-lighting",
    slug: "intelligent-stage-lighting",
    name: "Intelligent Stage Lighting",
    manufacturer: "MMS Inventory",
    model: "Wash, Spot & Beam Fixtures",
    equipmentTypeSlug: "stage-lighting",
    equipmentTypeName: "Stage Lighting",
    parentCategorySlug: "event-lighting-stage-setup",
    parentCategoryTitle: "Lighting & Stage",
    shortDescription:
      "Colour-wash and moving-head fixtures that shift the mood from daytime conference to evening gala.",
    whatItDoes:
      "Controlled lighting transforms a plain room — keeping presenters naturally lit for cameras during the day, then shifting to rich brand colours and dynamic beams for awards or receptions.",
    benefits: [
      "Changes stage colour and atmosphere throughout your event schedule",
      "Keeps speakers well-lit for both the audience and event cameras",
      "Highlights branding, backdrops and architectural features",
      "Programmed and operated live by an MMS lighting technician",
    ],
    primaryImage: "/mms/eventlght/stage-lights-illuminate-a-smoky-atmosphere-with-purple-and-white-beams-on-a-wooden-floor-photo.jpeg",
    primaryImageAlt: "Stage lighting beams illuminating an event space",
    gallery: [
      {
        src: "/mms/eventlght/stage-lights-illuminate-a-smoky-atmosphere-with-purple-and-white-beams-on-a-wooden-floor-photo.jpeg",
        alt: "Moving-head beam lighting on stage",
        caption: "Atmospheric beams and colour washes for evening programmes.",
      },
      {
        src: "/mms/eventlght/modern-stage-setup-with-large-screen-chairs-conference-event_1187703-176862.avif",
        alt: "Conference stage with clean front lighting",
        caption: "Balanced conference stage lighting paired with wide LED screens.",
      },
      {
        src: "/mms/eventlght/WhatsApp%20Image%202026-10-03%20at%2012.40.56%20PM.jpeg",
        alt: "Event lighting setup",
        caption: "Custom-programmed lighting matched to your event palette.",
      },
    ],
    eventApplications: [
      "Awards Ceremonies",
      "Gala Dinners",
      "Conference Stages",
      "Product Launches",
    ],
    specs: [
      { label: "Control", value: "Live DMX lighting control cues synced to your event run-of-show" },
      { label: "Fixture Mix", value: "Wash, spotlight and beam fixtures selected per venue height and brief" },
    ],
    comparison: {
      fixtureType: "Wash / Spot / Beam",
      colourMixing: "Full-spectrum colour wash",
      beamCharacteristics: "Focused & wide stage coverage",
      applicationFocus: "Awards, Galas & Stages",
    },
    demonstrationType: "lighting-atmosphere",
    relatedSlugs: [
      {
        categorySlug: "event-lighting-stage-setup",
        equipmentSlug: "stage-platforms-truss-backdrops",
        name: "Stage Platforms, Truss & Backdrops",
        image: "/mms/eventlght/modern-stage-setup-with-large-screen-chairs-conference-event_1187703-176862.avif",
      },
      {
        categorySlug: "led-screen-rental",
        equipmentSlug: "indoor-led-video-walls",
        name: "Indoor LED Video Walls",
        image: "/services%20images/LED%20Screen%20Rental.jpg",
      },
    ],
    verificationStatus: "mms-verified",
    availabilityClassification: "owned",
    published: true,
    seoTitle: "Intelligent Stage Lighting | MMS Technology Catalogue",
    seoDescription:
      "Dynamic stage lighting, wash fixtures and spotlighting for conferences, awards and gala events.",
  },
  {
    id: "eq-stage-platforms",
    slug: "stage-platforms-truss-backdrops",
    name: "Stage Platforms, Truss & Backdrops",
    manufacturer: "MMS Inventory",
    model: "Modular Stage & Truss",
    equipmentTypeSlug: "stage-and-rigging",
    equipmentTypeName: "Stage & Rigging",
    parentCategorySlug: "event-lighting-stage-setup",
    parentCategoryTitle: "Lighting & Stage",
    shortDescription:
      "Modular stage decking, structural trussing and branded backdrops that anchor your event room.",
    whatItDoes:
      "Elevates speakers so every guest has a clear line of sight, safely supports overhead lighting and screens, and frames the stage with clean, custom-branded backdrops.",
    benefits: [
      "Gives speakers clear visibility across large conference rooms",
      "Safely supports lighting rigs, banners and LED walls",
      "Creates a polished, camera-ready backdrop for photos and video",
      "Built and inspected on site by our staging crew",
    ],
    primaryImage: "/mms/eventlght/modern-stage-setup-with-large-screen-chairs-conference-event_1187703-176862.avif",
    primaryImageAlt: "Conference stage platform with backdrop and seating",
    gallery: [
      {
        src: "/mms/eventlght/modern-stage-setup-with-large-screen-chairs-conference-event_1187703-176862.avif",
        alt: "Stage platform and backdrop",
        caption: "Complete conference stage layout with clean sightlines.",
      },
      {
        src: "/mms/eventlght/WhatsApp%20Image%202026-10-03%20at%2012.40.56%20PM.jpeg",
        alt: "Truss and stage lighting structure",
        caption: "Structural trussing supporting event lighting and audio.",
      },
    ],
    eventApplications: [
      "Conference Plenaries",
      "Panel Stages",
      "Awards Stages",
      "Press Briefings",
    ],
    specs: [
      { label: "Dimensions", value: "Modular stage footprints tailored to room size and panel seating" },
      { label: "Safety", value: "Load-checked rigging and neat cable management as standard" },
    ],
    relatedSlugs: [
      {
        categorySlug: "event-lighting-stage-setup",
        equipmentSlug: "intelligent-stage-lighting",
        name: "Intelligent Stage Lighting",
        image: "/mms/eventlght/stage-lights-illuminate-a-smoky-atmosphere-with-purple-and-white-beams-on-a-wooden-floor-photo.jpeg",
      },
      {
        categorySlug: "digital-podiums",
        equipmentSlug: "smart-digital-podium",
        name: "Digital Podium",
        image: "/mms/mms/podium/WhatsApp%20Image%202026-11-20%20at%2014.19.00.jpeg",
      },
    ],
    verificationStatus: "mms-verified",
    availabilityClassification: "owned",
    published: true,
    seoTitle: "Stage Platforms, Truss & Backdrops | MMS Technology Catalogue",
    seoDescription:
      "Modular staging, truss rigging and branded conference backdrops installed by Mosi Media Solutions.",
  },
  {
    id: "eq-digital-podium",
    slug: "smart-digital-podium",
    name: "Digital Podium",
    manufacturer: "MMS Inventory",
    model: "Branded LED Lectern",
    equipmentTypeSlug: "branded-digital-podiums",
    equipmentTypeName: "Branded Digital Podiums",
    parentCategorySlug: "digital-podiums",
    parentCategoryTitle: "Digital Podiums",
    shortDescription:
      "A modern lectern that displays your event branding, speaker names and graphics right from the stage.",
    whatItDoes:
      "Instead of printing static banners for every session, a digital podium features a crisp front-facing display that updates instantly for each speaker, sponsor or award category.",
    benefits: [
      "Displays event logos, speaker titles and sponsor graphics dynamically",
      "Eliminates printed lectern boards between sessions",
      "Gives keynote speakers a clean, modern stage presence",
      "Integrates smoothly with stage microphones and LED walls",
    ],
    primaryImage: "/mms/mms/podium/WhatsApp%20Image%202026-11-20%20at%2014.19.00.jpeg",
    primaryImageAlt: "MMS branded digital podium on a conference stage",
    gallery: [
      {
        src: "/mms/mms/podium/WhatsApp%20Image%202026-11-20%20at%2014.19.00.jpeg",
        alt: "Digital podium front display",
        caption: "Front-facing digital display showing crisp event branding.",
      },
      {
        src: "/mms/mms/dj%20services%20and%20entertainment/digital%20podium.jpeg",
        alt: "Digital podium in conference setup",
        caption: "Clean stage presence for keynotes and executive announcements.",
      },
      {
        src: "/mms/mms/dj%20services%20and%20entertainment/WhatsApp%20Image%202026-11-20%20at%2014.25.39.jpeg",
        alt: "Conference hall featuring digital podium",
        caption: "Integrated alongside conference microphones and stage displays.",
      },
    ],
    eventApplications: [
      "International Conferences",
      "Corporate Summits",
      "Awards Ceremonies",
      "Government Briefings",
    ],
    specs: [
      { label: "Front Display", value: "High-visibility front screen for logos, titles and motion graphics" },
      { label: "Audio Integration", value: "Pairs with gooseneck or wireless stage microphones" },
      { label: "Content Support", value: "Graphics formatted and tested by MMS technical crew prior to doors open" },
    ],
    demonstrationType: "podium-branding",
    relatedSlugs: [
      {
        categorySlug: "led-screen-rental",
        equipmentSlug: "indoor-led-video-walls",
        name: "Indoor LED Video Walls",
        image: "/services%20images/LED%20Screen%20Rental.jpg",
      },
      {
        categorySlug: "conference-microphone-interpretation-equipment",
        equipmentSlug: "conference-microphones",
        name: "Conference Microphones",
        image: "/services%20images/5e3c3df339009497f72d40842dd6c19b.jpg",
      },
    ],
    verificationStatus: "mms-verified",
    availabilityClassification: "owned",
    published: true,
    seoTitle: "Digital Podium | MMS Technology Catalogue",
    seoDescription:
      "Branded digital podiums with front-facing LED displays for conferences, summits and awards ceremonies.",
  },
  {
    id: "eq-interactive-displays",
    slug: "interactive-touch-displays",
    name: "Interactive Touch Displays",
    manufacturer: "MMS Inventory",
    model: "Touchscreen & Vertical Totem",
    equipmentTypeSlug: "touchscreens-and-totems",
    equipmentTypeName: "Touchscreens & Digital Totems",
    parentCategorySlug: "interactive-screens",
    parentCategoryTitle: "Interactive Displays",
    shortDescription:
      "Touch-enabled screens and vertical digital totems that invite guests to explore schedules and content.",
    whatItDoes:
      "Placed in foyers, exhibition booths or breakout rooms, interactive displays let delegates tap through agendas, venue maps, product showcases or live audience Q&A.",
    benefits: [
      "Turns passive waiting areas into engaging touchpoints",
      "Ideal for digital agendas, wayfinding and exhibitor showcases",
      "Supports live polling and interactive workshop collaboration",
      "Clean, modern floor-standing or wall-mounted formats",
    ],
    primaryImage:
      "/mms/interactiveScreens/OEM-ODM-86-Inch-Business-Meeting-Presentation-Interactive-LED-Touch-Screen-Monitor-White-Board.avif",
    primaryImageAlt: "Interactive touchscreen display for meetings and exhibitions",
    gallery: [
      {
        src: "/mms/interactiveScreens/OEM-ODM-86-Inch-Business-Meeting-Presentation-Interactive-LED-Touch-Screen-Monitor-White-Board.avif",
        alt: "Large interactive touch display",
        caption: "Interactive touchscreen for collaborative briefings and demos.",
      },
      {
        src: "/mms/mms/dj%20services%20and%20entertainment/vertical%20screens.jpeg",
        alt: "Vertical digital signage screens",
        caption: "Vertical digital totems for schedules, branding and wayfinding.",
      },
      {
        src: "/mms/interactiveScreens/IMG_9264.jpeg",
        alt: "Digital display at event",
        caption: "High-clarity digital signage in a live event foyer.",
      },
    ],
    eventApplications: [
      "Exhibitions & Trade Shows",
      "Foyer Wayfinding",
      "Executive Workshops",
      "Live Audience Polling",
    ],
    specs: [
      { label: "Formats", value: "Large-format touch displays and vertical digital signage totems" },
      { label: "Content", value: "Supports interactive slides, schedules, media and live polling tools" },
    ],
    demonstrationType: "interactive-display",
    relatedSlugs: [
      {
        categorySlug: "digital-podiums",
        equipmentSlug: "smart-digital-podium",
        name: "Digital Podium",
        image: "/mms/mms/podium/WhatsApp%20Image%202026-11-20%20at%2014.19.00.jpeg",
      },
      {
        categorySlug: "led-screen-rental",
        equipmentSlug: "indoor-led-video-walls",
        name: "Indoor LED Video Walls",
        image: "/services%20images/LED%20Screen%20Rental.jpg",
      },
    ],
    verificationStatus: "mms-verified",
    availabilityClassification: "owned",
    published: true,
    seoTitle: "Interactive Touch Displays | MMS Technology Catalogue",
    seoDescription:
      "Interactive touchscreen displays and vertical digital signage for conferences, exhibitions and workshops.",
  },
  {
    id: "eq-live-streaming",
    slug: "multi-camera-live-streaming",
    name: "Multi-Camera Live Streaming",
    manufacturer: "MMS Production",
    model: "Broadcast Switching & Streaming",
    equipmentTypeSlug: "streaming-systems",
    equipmentTypeName: "Streaming Systems",
    parentCategorySlug: "live-streaming-production",
    parentCategoryTitle: "Live Streaming",
    shortDescription:
      "Broadcast-style multi-camera capture, live switching and speaker graphics for hybrid audiences.",
    whatItDoes:
      "Our live production desk combines multiple camera angles, presentation slides and speaker name overlays into one polished stream — connecting remote attendees seamlessly to the room.",
    benefits: [
      "Multiple camera angles keep remote viewers engaged",
      "Clean picture-in-picture views for speakers and slides",
      "Branded lower-thirds and holding graphics during breaks",
      "Full session recording delivered for post-event replay",
    ],
    primaryImage: "/mms/mms/dj%20services%20and%20entertainment/live%20streaming%20.jpeg",
    primaryImageAlt: "Multi-camera live streaming production control desk",
    gallery: [
      {
        src: "/mms/mms/dj%20services%20and%20entertainment/live%20streaming%20.jpeg",
        alt: "Live streaming control setup",
        caption: "Dedicated live switching and broadcast monitoring desk.",
      },
      {
        src: "/mms/mms/dj%20services%20and%20entertainment/WhatsApp%20Image%202026-11-20%20at%2014.34.08.jpeg",
        alt: "Event production control station",
        caption: "Coordinated audio and video routing for hybrid events.",
      },
      {
        src: "/mms/livestreaming/photo-1607968565043-36af90dde238.jpg.jpeg",
        alt: "Camera operator capturing live event",
        caption: "Professional camera coverage integrated into the live feed.",
      },
    ],
    eventApplications: [
      "Hybrid Conferences",
      "International Webinars",
      "Executive Town Halls",
      "Public Broadcasts",
    ],
    specs: [
      { label: "Production Scope", value: "Production capability — cameras, switching and crew scoped to event run-of-show" },
      { label: "Connectivity", value: "Venue internet bandwidth tested in advance; redundancy options discussed at scoping" },
    ],
    relatedSlugs: [
      {
        categorySlug: "videography-photography",
        equipmentSlug: "event-videography-and-photography",
        name: "Event Videography & Photography",
        image: "/mms/mms/video%20production/IMG_2306.jpg",
      },
      {
        categorySlug: "conference-microphone-interpretation-equipment",
        equipmentSlug: "conference-microphones",
        name: "Conference Microphones",
        image: "/services%20images/5e3c3df339009497f72d40842dd6c19b.jpg",
      },
    ],
    verificationStatus: "mms-verified",
    availabilityClassification: "owned",
    published: true,
    seoTitle: "Multi-Camera Live Streaming | MMS Technology Catalogue",
    seoDescription:
      "Multi-camera live streaming, switching and live graphics for hybrid conferences and broadcasts.",
  },
  {
    id: "eq-videography-photography",
    slug: "event-videography-and-photography",
    name: "Event Videography & Photography",
    manufacturer: "MMS Production",
    model: "Cinema & Stills Production",
    equipmentTypeSlug: "cameras-and-production",
    equipmentTypeName: "Cameras & Production",
    parentCategorySlug: "videography-photography",
    parentCategoryTitle: "Photography & Film",
    shortDescription:
      "Cinematic filming and event photography capturing keynotes, candid moments and same-day highlight reels.",
    whatItDoes:
      "Our camera and photography crew document your event unobtrusively — delivering crisp press-ready photographs, social highlight edits and polished documentary films.",
    benefits: [
      "Press-ready event photography for immediate communications",
      "Same-day highlight reels for closing ceremonies or social media",
      "Synchronised audio from stage mixers for crystal-clear interviews",
      "Coordinated seamlessly with live streaming and drone teams",
    ],
    primaryImage: "/mms/mms/video%20production/IMG_2306.jpg",
    primaryImageAlt: "MMS videography and photography team filming on location",
    gallery: [
      {
        src: "/mms/mms/video%20production/IMG_2306.jpg",
        alt: "MMS video production crew",
        caption: "On-location cinema camera production.",
      },
      {
        src: "/mms/mms/video%20production/IMG_2300.jpg",
        alt: "Event filming and photography",
        caption: "Capturing speakers, guests and atmosphere.",
      },
      {
        src: "/services%20images/videography-photography.jpg",
        alt: "Professional camera production",
        caption: "Polished visual storytelling for brands and conferences.",
      },
    ],
    eventApplications: [
      "Corporate Conferences",
      "Brand Campaigns",
      "Weddings & Celebrations",
      "Documentary Stories",
    ],
    specs: [
      { label: "Deliverables", value: "Same-day selects, highlight films and full archives agreed per brief" },
      { label: "Optional Add-On", value: "Aerial drone sequences available subject to CAAZ permissions" },
    ],
    relatedSlugs: [
      {
        categorySlug: "live-streaming-production",
        equipmentSlug: "multi-camera-live-streaming",
        name: "Multi-Camera Live Streaming",
        image: "/mms/mms/dj%20services%20and%20entertainment/live%20streaming%20.jpeg",
      },
    ],
    verificationStatus: "mms-verified",
    availabilityClassification: "owned",
    published: true,
    seoTitle: "Event Videography & Photography | MMS Technology Catalogue",
    seoDescription:
      "Professional event photography, highlight films and corporate video production by Mosi Media Solutions.",
  },
  {
    id: "eq-dj-setup",
    slug: "professional-dj-setup",
    name: "Professional DJ Setup",
    manufacturer: "MMS Inventory",
    model: "DJ Console & Sound Rig",
    equipmentTypeSlug: "dj-and-entertainment",
    equipmentTypeName: "DJ & Entertainment",
    parentCategorySlug: "dj-services",
    parentCategoryTitle: "Entertainment & Effects",
    shortDescription:
      "Experienced event DJs with club-grade decks, sound and lighting integration for memorable celebrations.",
    whatItDoes:
      "From welcome drinks and background dinner music to packed dancefloors, our DJs read the room and coordinate smoothly with MCs, sound engineers and special effects.",
    benefits: [
      "Curated playlists tailored to corporate galas or private celebrations",
      "Seamless handoff from formal conference or wedding speeches to music",
      "Paired with balanced PA sound and atmospheric lighting",
      "Can be combined with Cold Sparks and Low-Lying Cloud effects",
    ],
    primaryImage: "/mms/mms/dj%20services%20and%20entertainment/DSC_7080.jpg",
    primaryImageAlt: "MMS DJ performing at an event with lighting",
    gallery: [
      {
        src: "/mms/mms/dj%20services%20and%20entertainment/DSC_7080.jpg",
        alt: "Live DJ performance",
        caption: "High-energy DJ set integrated with event lighting.",
      },
      {
        src: "/mms/djServices/firstImg.png",
        alt: "DJ booth and console",
        caption: "Clean, professional DJ booth setup.",
      },
      {
        src: "/mms/mms/dj%20services%20and%20entertainment/DSC_7044.jpg",
        alt: "Evening celebration music and lighting",
        caption: "Coordinated sound and lighting for evening receptions.",
      },
    ],
    eventApplications: [
      "Corporate Gala Dinners",
      "Wedding Receptions",
      "Awards After-Parties",
      "Private Celebrations",
    ],
    specs: [
      { label: "Included", value: "DJ booth, controller/decks, sound integration and music consultation" },
      { label: "Add-Ons", value: "Cold Sparks, Low-Lying Cloud and 360° Booth available (venue approval required)" },
    ],
    relatedSlugs: [
      {
        categorySlug: "professional-sound-systems",
        equipmentSlug: "pa-and-line-array-systems",
        name: "PA & Line Array Systems",
        image: "/mms/PaSystem/WhatsApp%20Image%202026-10-03%20at%2010.42.11%20AM.jpeg",
      },
      {
        categorySlug: "event-lighting-stage-setup",
        equipmentSlug: "intelligent-stage-lighting",
        name: "Intelligent Stage Lighting",
        image: "/mms/eventlght/stage-lights-illuminate-a-smoky-atmosphere-with-purple-and-white-beams-on-a-wooden-floor-photo.jpeg",
      },
    ],
    verificationStatus: "mms-verified",
    availabilityClassification: "owned",
    published: true,
    seoTitle: "Professional DJ Setup | MMS Technology Catalogue",
    seoDescription:
      "Professional DJ services with integrated sound and lighting for corporate galas, weddings and celebrations.",
  },

  // Draft / Pending MMS Inventory Confirmation (NOT published publicly)
  {
    id: "draft-adj-focus-cmy-compact",
    slug: "adj-focus-cmy-compact",
    name: "Focus CMY Compact",
    manufacturer: "ADJ",
    model: "Focus CMY Compact",
    equipmentTypeSlug: "stage-lighting",
    equipmentTypeName: "Moving Head Spot",
    parentCategorySlug: "event-lighting-stage-setup",
    parentCategoryTitle: "Lighting & Stage",
    shortDescription: "Moving head lighting fixture for dynamic stage colour mixing and projected patterns.",
    whatItDoes: "Awaiting MMS inventory confirmation before publication.",
    benefits: ["CMY colour mixing", "Projected patterns", "Dynamic stage movement"],
    primaryImage: "/mms/eventlght/stage-lights-illuminate-a-smoky-atmosphere-with-purple-and-white-beams-on-a-wooden-floor-photo.jpeg",
    primaryImageAlt: "Stage lighting fixture",
    gallery: [],
    eventApplications: ["Conferences", "Awards", "Concerts"],
    specs: [{ label: "Inventory Status", value: "Pending MMS brand/model confirmation" }],
    relatedSlugs: [],
    verificationStatus: "draft",
    availabilityClassification: "on-request",
    published: false,
    seoTitle: "ADJ Focus CMY Compact | Draft",
    seoDescription: "Draft equipment record awaiting MMS inventory confirmation.",
  },
  {
    id: "draft-p26-indoor-led",
    slug: "p2-6-indoor-led-screen",
    name: "P2.6 Indoor LED Screen",
    manufacturer: "To confirm",
    model: "P2.6 Indoor",
    equipmentTypeSlug: "indoor-led",
    equipmentTypeName: "Indoor LED",
    parentCategorySlug: "led-screen-rental",
    parentCategoryTitle: "LED Screens & Displays",
    shortDescription: "Fine-pitch indoor LED screen for conferences and close-viewing audiences.",
    whatItDoes: "Awaiting MMS pixel-pitch and model confirmation before publication.",
    benefits: ["Fine detail for close viewing"],
    primaryImage: "/services%20images/LED%20Screen%20Rental.jpg",
    primaryImageAlt: "Indoor LED screen",
    gallery: [],
    eventApplications: ["Conferences", "Exhibitions"],
    specs: [{ label: "Pixel Pitch", value: "2.6 mm (awaiting MMS confirmation)" }],
    relatedSlugs: [],
    verificationStatus: "draft",
    availabilityClassification: "on-request",
    published: false,
    seoTitle: "P2.6 Indoor LED Screen | Draft",
    seoDescription: "Draft equipment record awaiting MMS inventory confirmation.",
  },
  {
    id: "draft-wireless-handheld-mic",
    slug: "wireless-handheld-microphone",
    name: "Wireless Handheld Microphone",
    manufacturer: "To confirm",
    model: "Wireless Handheld",
    equipmentTypeSlug: "audio-control-and-wireless-mics",
    equipmentTypeName: "Wireless Handheld",
    parentCategorySlug: "professional-sound-systems",
    parentCategoryTitle: "Professional Sound",
    shortDescription: "Handheld wireless microphone for keynote speakers, MCs and audience Q&A.",
    whatItDoes: "Awaiting MMS brand/model confirmation before publication.",
    benefits: ["Ideal for MCs and Q&A"],
    primaryImage: "/mms/PaSystem/WhatsApp%20Image%202026-10-03%20at%2010.42.11%20AM.jpeg",
    primaryImageAlt: "Wireless handheld microphone",
    gallery: [],
    eventApplications: ["Keynotes", "Q&A"],
    specs: [{ label: "Inventory Status", value: "Pending MMS brand/model confirmation" }],
    relatedSlugs: [],
    verificationStatus: "draft",
    availabilityClassification: "on-request",
    published: false,
    seoTitle: "Wireless Handheld Microphone | Draft",
    seoDescription: "Draft equipment record awaiting MMS inventory confirmation.",
  },
];

export function getCategoryPresentation(slug: string): CategoryPresentation | undefined {
  return CATEGORY_PRESENTATIONS[slug];
}

export function getEquipmentForCategory(categorySlug: string): EquipmentItem[] {
  return EQUIPMENT_CATALOG.filter(
    (item) => item.published && item.parentCategorySlug === categorySlug
  );
}

export function getEquipmentItem(categorySlug: string, equipmentSlug: string): EquipmentItem | undefined {
  return EQUIPMENT_CATALOG.find(
    (item) => item.published && item.parentCategorySlug === categorySlug && item.slug === equipmentSlug
  );
}

export function getAllPublishedEquipment(): EquipmentItem[] {
  return EQUIPMENT_CATALOG.filter((item) => item.published);
}

export function getDraftEquipment(): EquipmentItem[] {
  return EQUIPMENT_CATALOG.filter((item) => !item.published || item.verificationStatus === "draft");
}
