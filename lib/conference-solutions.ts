import { approachStages, type ApproachStage } from "@/app/conference-production/conferenceData";
import { getEquipmentItem, type EquipmentItem } from "@/lib/technology-catalog";

export interface EventSolution {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  coverImage: string;
  coverAlt: string;
  whatWeCoordinate: { title: string; detail: string; image: string }[];
  recommendedLayoutIds: string[];
  equipmentCategorySlugs: string[];
  equipmentRefs: { categorySlug: string; equipmentSlug: string }[];
  gallery: { src: string; alt: string; caption: string }[];
  seoTitle: string;
  seoDescription: string;
}

export interface EventLayout {
  id: string;
  name: string;
  shortDescription: string;
  suitableFor: string[];
  typicalTechnology: string[];
  image: string;
  imageAlt: string;
}

export interface EventSetupConfig {
  id: string;
  name: string;
  audience: string;
  summary: string;
  components: string[];
  prefillServices: string[];
  eventTypeLabel: string;
  image: string;
  imageAlt: string;
}

export interface PlanningPhase {
  id: string;
  phaseNumber: string;
  name: string;
  summary: string;
  stageSteps: string[];
  coverImage: string;
  coverAlt: string;
}

export interface StageHotspot {
  id: string;
  number: string;
  label: string;
  role: string;
  categorySlug: string;
  categoryName: string;
  image: string;
  equipmentRefs: { categorySlug: string; equipmentSlug: string }[];
}

export const CONFERENCE_SOLUTIONS: EventSolution[] = [
  {
    id: "sol-international",
    slug: "international-conferences",
    title: "International Conferences & Summits",
    shortTitle: "International Conferences",
    tagline: "Bring global audiences together.",
    description:
      "End-to-end planning, simultaneous interpretation, plenary AV production and delegate logistics for international summits and association gatherings.",
    coverImage: "/conference%20and%20Events/13887116.jpg.jpeg",
    coverAlt: "International conference plenary hall with stage and LED screens",
    whatWeCoordinate: [
      {
        title: "Venue & Setup",
        detail: "Identify plenary and breakout halls and plan room layouts.",
        image: "/conference%20and%20Events/Conference-Venue-Victoria-Falls.jpg.jpeg",
      },
      {
        title: "Technical Production",
        detail: "LED screens, sound engineering, stage lighting and digital podiums.",
        image: "/services%20images/LED%20Screen%20Rental.jpg",
      },
      {
        title: "Language Interpretation",
        detail: "Sound-isolated booths, delegate headsets and multi-language audio.",
        image: "/mms/conferenceServicesImagesGallery/How-To-Choose-A-Wireless-Interpretation-System-For-Large-Venues.jpg.jpeg",
      },
      {
        title: "Delegate Management",
        detail: "Registration desks, accreditation and on-site delegate support.",
        image: "/conference%20and%20Events/WhatsApp%20Image%202026-11-21%20at%2012.43.33.jpeg",
      },
      {
        title: "Travel & Logistics",
        detail: "Airport transfers, hotel shuttles and partner hospitality coordination.",
        image: "/conference%20and%20Events/elephant-hills-resort-142002.webp",
      },
      {
        title: "Media & Documentation",
        detail: "Multi-camera live streaming, photography and highlight films.",
        image: "/mms/mms/video%20production/IMG_2306.jpg",
      },
    ],
    recommendedLayoutIds: ["theatre", "classroom", "u-shape"],
    equipmentCategorySlugs: [
      "conference-microphone-interpretation-equipment",
      "led-screen-rental",
      "digital-podiums",
      "live-streaming-production",
    ],
    equipmentRefs: [
      { categorySlug: "conference-microphone-interpretation-equipment", equipmentSlug: "conference-microphones" },
      { categorySlug: "conference-microphone-interpretation-equipment", equipmentSlug: "interpretation-booths" },
      { categorySlug: "conference-microphone-interpretation-equipment", equipmentSlug: "receivers-and-headsets" },
      { categorySlug: "led-screen-rental", equipmentSlug: "indoor-led-video-walls" },
      { categorySlug: "digital-podiums", equipmentSlug: "smart-digital-podium" },
      { categorySlug: "live-streaming-production", equipmentSlug: "multi-camera-live-streaming" },
    ],
    gallery: [
      {
        src: "/conference%20and%20Events/13887116.jpg.jpeg",
        alt: "Plenary hall conference production",
        caption: "Plenary staging with wide-format screens and balanced room audio.",
      },
      {
        src: "/mms/mms/conference%20and%20corporates/DSC_9244.jpg",
        alt: "Keynote speaker at branded conference stage",
        caption: "Branded keynote stage with live speaker support.",
      },
      {
        src: "/conference%20and%20Events/WhatsApp%20Image%202026-11-21%20at%2017.47.34.jpeg",
        alt: "Conference room audience and AV setup",
        caption: "Coordinated delegate seating and technical production.",
      },
    ],
    seoTitle: "International Conferences & Summits | MMS Conference Solutions",
    seoDescription:
      "Plan international conferences and summits in Victoria Falls with simultaneous interpretation, plenary AV, delegate logistics and live streaming.",
  },
  {
    id: "sol-executive",
    slug: "executive-meetings",
    title: "Corporate Meetings & Executive Retreats",
    shortTitle: "Executive Meetings",
    tagline: "Focused meetings with seamless coordination.",
    description:
      "Boardrooms, leadership strategy sessions and executive workshops supported with clear tabletop microphones, displays and private hospitality.",
    coverImage: "/conference%20and%20Events/Conference-Venue-Victoria-Falls.jpg.jpeg",
    coverAlt: "Executive U-shape conference room setup in Victoria Falls",
    whatWeCoordinate: [
      {
        title: "Boardroom & Venue Setup",
        detail: "Private meeting rooms configured in boardroom or U-shape layouts.",
        image: "/conference%20and%20Events/Conference-Venue-Victoria-Falls.jpg.jpeg",
      },
      {
        title: "Conference Audio",
        detail: "Delegate tabletop microphones for clear, structured discussion.",
        image: "/services%20images/5e3c3df339009497f72d40842dd6c19b.jpg",
      },
      {
        title: "Interactive Displays",
        detail: "Touchscreens and presentation monitors for strategy workshops.",
        image: "/mms/interactiveScreens/OEM-ODM-86-Inch-Business-Meeting-Presentation-Interactive-LED-Touch-Screen-Monitor-White-Board.avif",
      },
      {
        title: "VIP Transfers & Stays",
        detail: "Executive airport transfers and lodge accommodation coordination.",
        image: "/conference%20and%20Events/Elephant-Hills.jpg.jpeg",
      },
    ],
    recommendedLayoutIds: ["boardroom", "u-shape"],
    equipmentCategorySlugs: [
      "conference-microphone-interpretation-equipment",
      "interactive-screens",
      "professional-sound-systems",
    ],
    equipmentRefs: [
      { categorySlug: "conference-microphone-interpretation-equipment", equipmentSlug: "conference-microphones" },
      { categorySlug: "interactive-screens", equipmentSlug: "interactive-touch-displays" },
      { categorySlug: "professional-sound-systems", equipmentSlug: "digital-mixing-and-wireless-mics" },
    ],
    gallery: [
      {
        src: "/conference%20and%20Events/Conference-Venue-Victoria-Falls.jpg.jpeg",
        alt: "Executive U-shape meeting room",
        caption: "U-shape executive meeting layout with clear sightlines.",
      },
      {
        src: "/services%20images/5e3c3df339009497f72d40842dd6c19b.jpg",
        alt: "Tabletop delegate microphones",
        caption: "Clean tabletop microphone placement for boardroom sessions.",
      },
    ],
    seoTitle: "Executive Meetings & Boardrooms | MMS Conference Solutions",
    seoDescription:
      "Executive board meetings and leadership retreats in Victoria Falls with delegate microphones, interactive displays and VIP coordination.",
  },
  {
    id: "sol-business",
    slug: "business-conferences",
    title: "AGMs & Business Conferences",
    shortTitle: "AGMs & Business Conferences",
    tagline: "Professional presentations and discussions.",
    description:
      "Annual general meetings, shareholder briefings and corporate conferences with reliable audio, LED displays, digital podiums and media capture.",
    coverImage: "/mms/mms/conference%20and%20corporates/DSC_9244.jpg",
    coverAlt: "Business conference speaker with stage screen",
    whatWeCoordinate: [
      {
        title: "Stage & Podium",
        detail: "Branded digital podiums, staging and clean speaker lighting.",
        image: "/mms/mms/podium/WhatsApp%20Image%202026-11-20%20at%2014.19.00.jpeg",
      },
      {
        title: "Presentation Screens",
        detail: "High-brightness LED walls for financial slides and live video.",
        image: "/services%20images/LED%20Screen%20Rental.jpg",
      },
      {
        title: "Audience Q&A Audio",
        detail: "Wireless handheld and lapel mics with balanced room sound.",
        image: "/mms/PaSystem/WhatsApp%20Image%202026-10-03%20at%2010.42.11%20AM.jpeg",
      },
      {
        title: "Documentation & Stream",
        detail: "Session recording and live streaming for remote stakeholders.",
        image: "/mms/mms/dj%20services%20and%20entertainment/live%20streaming%20.jpeg",
      },
    ],
    recommendedLayoutIds: ["theatre", "classroom"],
    equipmentCategorySlugs: [
      "led-screen-rental",
      "digital-podiums",
      "professional-sound-systems",
      "live-streaming-production",
    ],
    equipmentRefs: [
      { categorySlug: "led-screen-rental", equipmentSlug: "indoor-led-video-walls" },
      { categorySlug: "digital-podiums", equipmentSlug: "smart-digital-podium" },
      { categorySlug: "professional-sound-systems", equipmentSlug: "pa-and-line-array-systems" },
      { categorySlug: "live-streaming-production", equipmentSlug: "multi-camera-live-streaming" },
    ],
    gallery: [
      {
        src: "/mms/mms/conference%20and%20corporates/DSC_9244.jpg",
        alt: "Corporate conference presentation",
        caption: "Keynote speaker supported by branded stage visuals.",
      },
      {
        src: "/mms/mms/podium/WhatsApp%20Image%202026-11-20%20at%2014.19.00.jpeg",
        alt: "Digital podium on stage",
        caption: "Digital podium displaying corporate event identity.",
      },
    ],
    seoTitle: "AGMs & Business Conferences | MMS Conference Solutions",
    seoDescription:
      "Annual general meetings and business conferences with LED displays, digital podiums, clear audio and stakeholder live streaming.",
  },
  {
    id: "sol-launches",
    slug: "product-launches",
    title: "Product Launches & Brand Activations",
    shortTitle: "Product Launches",
    tagline: "Introduce your brand with impact.",
    description:
      "High-impact visual reveals combining LED walls, dynamic stage lighting, vertical digital signage and same-day brand photography and film.",
    coverImage: "/mms/eventlght/modern-stage-setup-with-large-screen-chairs-conference-event_1187703-176862.avif",
    coverAlt: "Modern stage setup with large screen and lighting for product launch",
    whatWeCoordinate: [
      {
        title: "Visual Stage & LED",
        detail: "Large LED backdrops and vertical digital screens for brand reveals.",
        image: "/mms/mms/dj%20services%20and%20entertainment/vertical%20screens.jpeg",
      },
      {
        title: "Atmospheric Lighting",
        detail: "Brand-colour lighting washes and moving beams for reveal moments.",
        image: "/mms/eventlght/stage-lights-illuminate-a-smoky-atmosphere-with-purple-and-white-beams-on-a-wooden-floor-photo.jpeg",
      },
      {
        title: "Campaign Media",
        detail: "Event photography and same-day highlight reels for press and social.",
        image: "/mms/mms/video%20production/IMG_2300.jpg",
      },
    ],
    recommendedLayoutIds: ["theatre", "banquet"],
    equipmentCategorySlugs: [
      "led-screen-rental",
      "event-lighting-stage-setup",
      "interactive-screens",
      "videography-photography",
    ],
    equipmentRefs: [
      { categorySlug: "led-screen-rental", equipmentSlug: "indoor-led-video-walls" },
      { categorySlug: "event-lighting-stage-setup", equipmentSlug: "intelligent-stage-lighting" },
      { categorySlug: "interactive-screens", equipmentSlug: "interactive-touch-displays" },
      { categorySlug: "videography-photography", equipmentSlug: "event-videography-and-photography" },
    ],
    gallery: [
      {
        src: "/mms/eventlght/modern-stage-setup-with-large-screen-chairs-conference-event_1187703-176862.avif",
        alt: "Launch stage with LED wall",
        caption: "Stage and screen framing for product unveilings.",
      },
      {
        src: "/mms/mms/dj%20services%20and%20entertainment/vertical%20screens.jpeg",
        alt: "Vertical brand screens",
        caption: "Vertical digital totems for brand storytelling.",
      },
    ],
    seoTitle: "Product Launches & Brand Activations | MMS Conference Solutions",
    seoDescription:
      "Product launches and brand activations with LED walls, dynamic stage lighting, interactive displays and campaign media.",
  },
  {
    id: "sol-galas",
    slug: "gala-dinners",
    title: "Awards Ceremonies & Gala Dinners",
    shortTitle: "Awards & Gala Dinners",
    tagline: "Celebrate achievements in style.",
    description:
      "Elegant formal evenings featuring stage lighting, awards-ready LED screens, digital podiums, professional DJ entertainment and event photography.",
    coverImage: "/mms/eventlght/stage-lights-illuminate-a-smoky-atmosphere-with-purple-and-white-beams-on-a-wooden-floor-photo.jpeg",
    coverAlt: "Stage lighting for awards ceremony and gala dinner",
    whatWeCoordinate: [
      {
        title: "Awards Stage & Lighting",
        detail: "Warm gala washes, spotlights and branded winner graphics.",
        image: "/mms/eventlght/stage-lights-illuminate-a-smoky-atmosphere-with-purple-and-white-beams-on-a-wooden-floor-photo.jpeg",
      },
      {
        title: "Sound & Entertainment",
        detail: "Balanced speech audio and DJ sets for evening celebrations.",
        image: "/mms/mms/dj%20services%20and%20entertainment/DSC_7080.jpg",
      },
      {
        title: "Photography & Film",
        detail: "Stage winner portraits, guest arrivals and celebration highlights.",
        image: "/mms/mms/video%20production/IMG_2306.jpg",
      },
    ],
    recommendedLayoutIds: ["banquet", "theatre"],
    equipmentCategorySlugs: [
      "event-lighting-stage-setup",
      "professional-sound-systems",
      "led-screen-rental",
      "dj-services",
    ],
    equipmentRefs: [
      { categorySlug: "event-lighting-stage-setup", equipmentSlug: "intelligent-stage-lighting" },
      { categorySlug: "digital-podiums", equipmentSlug: "smart-digital-podium" },
      { categorySlug: "dj-services", equipmentSlug: "professional-dj-setup" },
      { categorySlug: "videography-photography", equipmentSlug: "event-videography-and-photography" },
    ],
    gallery: [
      {
        src: "/mms/eventlght/stage-lights-illuminate-a-smoky-atmosphere-with-purple-and-white-beams-on-a-wooden-floor-photo.jpeg",
        alt: "Awards ceremony lighting",
        caption: "Atmospheric stage lighting for formal awards evenings.",
      },
      {
        src: "/mms/mms/dj%20services%20and%20entertainment/DSC_7080.jpg",
        alt: "Gala dinner entertainment",
        caption: "Evening entertainment coordinated with stage lighting.",
      },
    ],
    seoTitle: "Awards Ceremonies & Gala Dinners | MMS Conference Solutions",
    seoDescription:
      "Formal awards ceremonies and gala dinners with stage lighting, sound, digital podiums, DJs and photography.",
  },
  {
    id: "sol-exhibitions",
    slug: "exhibitions",
    title: "Exhibitions & Trade Shows",
    shortTitle: "Exhibitions & Trade Shows",
    tagline: "Create engaging brand experiences.",
    description:
      "Exhibition display screens, interactive touchpoints, branded signage and technical booth support for trade shows and sponsor showcases.",
    coverImage: "/mms/interactiveScreens/IMG_9264.jpeg",
    coverAlt: "Exhibition digital display setup",
    whatWeCoordinate: [
      {
        title: "Interactive Booth Displays",
        detail: "Touchscreens and digital totems for exhibitor showcases.",
        image: "/mms/interactiveScreens/OEM-ODM-86-Inch-Business-Meeting-Presentation-Interactive-LED-Touch-Screen-Monitor-White-Board.avif",
      },
      {
        title: "LED Video Walls",
        detail: "High-visibility screens for main exhibition halls and sponsor zones.",
        image: "/services%20images/LED%20Screen%20Rental.jpg",
      },
      {
        title: "On-Site Technical Support",
        detail: "Setup, content testing and live support across exhibition days.",
        image: "/mms/interactiveScreens/IMG_9264.jpeg",
      },
    ],
    recommendedLayoutIds: ["classroom", "theatre"],
    equipmentCategorySlugs: [
      "interactive-screens",
      "led-screen-rental",
      "professional-sound-systems",
    ],
    equipmentRefs: [
      { categorySlug: "interactive-screens", equipmentSlug: "interactive-touch-displays" },
      { categorySlug: "led-screen-rental", equipmentSlug: "indoor-led-video-walls" },
      { categorySlug: "led-screen-rental", equipmentSlug: "outdoor-led-displays" },
    ],
    gallery: [
      {
        src: "/mms/interactiveScreens/IMG_9264.jpeg",
        alt: "Exhibition display screen",
        caption: "Digital display supporting exhibitor messaging.",
      },
      {
        src: "/mms/mms/dj%20services%20and%20entertainment/vertical%20screens.jpeg",
        alt: "Vertical exhibition totems",
        caption: "Vertical signage for wayfinding and sponsor visibility.",
      },
    ],
    seoTitle: "Exhibitions & Trade Shows | MMS Conference Solutions",
    seoDescription:
      "Exhibition and trade show display technology, interactive touchscreens and technical support.",
  },
  {
    id: "sol-retreats",
    slug: "corporate-retreats",
    title: "Corporate Retreats & Team-Building Events",
    shortTitle: "Corporate Retreats",
    tagline: "Connect teams beyond the boardroom.",
    description:
      "Coordinated Victoria Falls retreats combining meeting room AV, lodge hospitality, group transfers, destination experiences and evening entertainment.",
    coverImage: "/conference%20and%20Events/elephant-hills-resort-142002.webp",
    coverAlt: "Victoria Falls resort for corporate retreats",
    whatWeCoordinate: [
      {
        title: "Accommodation & Dining",
        detail: "Lodge room allocations, group dining and private receptions.",
        image: "/conference%20and%20Events/elephant-hills-resort-142002.webp",
      },
      {
        title: "Transfers & Activities",
        detail: "Airport transfers and excursions coordinated with local partners.",
        image: "/mms/Zambia-Zimbabwe-Victoria-Falls-Impressive-View-1.jpg",
      },
      {
        title: "Workshop & Evening AV",
        detail: "Portable sound, screens and photography for daytime and evening sessions.",
        image: "/mms/PaSystem/WhatsApp%20Image%202026-10-03%20at%2010.42.11%20AM.jpeg",
      },
    ],
    recommendedLayoutIds: ["u-shape", "boardroom", "banquet"],
    equipmentCategorySlugs: [
      "professional-sound-systems",
      "videography-photography",
      "dj-services",
    ],
    equipmentRefs: [
      { categorySlug: "professional-sound-systems", equipmentSlug: "pa-and-line-array-systems" },
      { categorySlug: "videography-photography", equipmentSlug: "event-videography-and-photography" },
      { categorySlug: "dj-services", equipmentSlug: "professional-dj-setup" },
    ],
    gallery: [
      {
        src: "/conference%20and%20Events/elephant-hills-resort-142002.webp",
        alt: "Victoria Falls retreat venue",
        caption: "Destination retreat coordination in Victoria Falls.",
      },
      {
        src: "/mms/Zambia-Zimbabwe-Victoria-Falls-Impressive-View-1.jpg",
        alt: "Victoria Falls destination view",
        caption: "Memorable destination experiences around your programme.",
      },
    ],
    seoTitle: "Corporate Retreats & Team Building | MMS Conference Solutions",
    seoDescription:
      "Corporate retreats in Victoria Falls combining meeting AV, hospitality coordination, transfers and destination experiences.",
  },
  {
    id: "sol-hybrid",
    slug: "hybrid-events",
    title: "Hybrid & Virtual Conferences",
    shortTitle: "Hybrid & Virtual Events",
    tagline: "Connect audiences across locations.",
    description:
      "Multi-camera switching, remote speaker integration, live graphics and synced room audio connecting in-person delegates with online audiences.",
    coverImage: "/mms/mms/dj%20services%20and%20entertainment/live%20streaming%20.jpeg",
    coverAlt: "Multi-camera live streaming desk for hybrid conferences",
    whatWeCoordinate: [
      {
        title: "Multi-Camera Broadcast",
        detail: "Live camera switching, speaker graphics and slide integration.",
        image: "/mms/mms/dj%20services%20and%20entertainment/live%20streaming%20.jpeg",
      },
      {
        title: "Remote Speaker Feeds",
        detail: "Bring remote panellists into the room LED wall and room audio.",
        image: "/services%20images/LED%20Screen%20Rental.jpg",
      },
      {
        title: "Clean Audio Routing",
        detail: "Dedicated broadcast audio mix separated from room PA speakers.",
        image: "/mms/PaSystem/vlcsnap-2026-10-03-10h06m45s223.png",
      },
    ],
    recommendedLayoutIds: ["theatre", "classroom"],
    equipmentCategorySlugs: [
      "live-streaming-production",
      "led-screen-rental",
      "professional-sound-systems",
      "conference-microphone-interpretation-equipment",
    ],
    equipmentRefs: [
      { categorySlug: "live-streaming-production", equipmentSlug: "multi-camera-live-streaming" },
      { categorySlug: "led-screen-rental", equipmentSlug: "indoor-led-video-walls" },
      { categorySlug: "professional-sound-systems", equipmentSlug: "digital-mixing-and-wireless-mics" },
    ],
    gallery: [
      {
        src: "/mms/mms/dj%20services%20and%20entertainment/live%20streaming%20.jpeg",
        alt: "Live streaming production desk",
        caption: "Broadcast switching desk for hybrid conference delivery.",
      },
      {
        src: "/mms/mms/dj%20services%20and%20entertainment/WhatsApp%20Image%202026-11-20%20at%2014.34.08.jpeg",
        alt: "Hybrid conference control",
        caption: "Coordinated audio and video monitoring on site.",
      },
    ],
    seoTitle: "Hybrid & Virtual Conferences | MMS Conference Solutions",
    seoDescription:
      "Hybrid conference production with multi-camera live streaming, remote speaker integration and clean broadcast audio.",
  },
];

export const CONFERENCE_LAYOUTS: EventLayout[] = [
  {
    id: "theatre",
    name: "Theatre",
    shortDescription:
      "Rows of forward-facing seating focused on a central stage, podium and main screen.",
    suitableFor: ["Keynote speeches", "International summits", "AGMs", "Product launches"],
    typicalTechnology: ["Indoor LED video wall", "Digital podium", "PA sound system", "Wireless mics"],
    image: "/conference%20and%20Events/13887116.jpg.jpeg",
    imageAlt: "Theatre style conference hall with central screen",
  },
  {
    id: "classroom",
    name: "Classroom",
    shortDescription:
      "Forward-facing tables and chairs giving delegates writing and laptop space during sessions.",
    suitableFor: ["Training seminars", "Technical workshops", "Multi-day conferences"],
    typicalTechnology: ["Main LED or projection screen", "Lapel or handheld mics", "PA audio"],
    image: "/conference%20and%20Events/WhatsApp%20Image%202026-11-21%20at%2017.47.34.jpeg",
    imageAlt: "Classroom style conference room seating",
  },
  {
    id: "boardroom",
    name: "Boardroom",
    shortDescription:
      "Delegates seated around one central table for direct, focused leadership discussion.",
    suitableFor: ["Executive meetings", "Board briefings", "Diplomatic roundtables"],
    typicalTechnology: ["Tabletop delegate microphones", "Presentation display", "Video conferencing"],
    image: "/services%20images/5e3c3df339009497f72d40842dd6c19b.jpg",
    imageAlt: "Boardroom table with delegate microphones",
  },
  {
    id: "u-shape",
    name: "U-shape",
    shortDescription:
      "An open-ended table arrangement supporting presenter interaction and face-to-face dialogue.",
    suitableFor: ["Interactive workshops", "Strategy retreats", "Policy consultations"],
    typicalTechnology: ["Delegate microphones", "Front presentation screen", "Interactive display"],
    image: "/conference%20and%20Events/Conference-Venue-Victoria-Falls.jpg.jpeg",
    imageAlt: "U-shape executive conference layout in Victoria Falls",
  },
  {
    id: "banquet",
    name: "Banquet",
    shortDescription:
      "Round dining tables arranged with clear sightlines to a central awards or entertainment stage.",
    suitableFor: ["Gala dinners", "Awards ceremonies", "Corporate celebrations"],
    typicalTechnology: ["Stage & decorative lighting", "PA sound & DJ", "LED screens", "Photography"],
    image: "/mms/eventlght/stage-lights-illuminate-a-smoky-atmosphere-with-purple-and-white-beams-on-a-wooden-floor-photo.jpeg",
    imageAlt: "Banquet and gala evening stage lighting",
  },
];

export const CONFERENCE_SETUPS: EventSetupConfig[] = [
  {
    id: "executive-meeting",
    name: "Executive Meeting Setup",
    audience: "Board meetings, workshops & private discussions",
    summary: "Structured tabletop audio and crisp presentation screens for focused decision-making.",
    components: ["Conference microphones", "Presentation display", "Video conferencing", "Room audio"],
    prefillServices: ["Sound and microphones", "Screens and projection"],
    eventTypeLabel: "Corporate Meetings & Executive Retreats",
    image: "/conference%20and%20Events/Conference-Venue-Victoria-Falls.jpg.jpeg",
    imageAlt: "Executive meeting conference setup",
  },
  {
    id: "professional-conference",
    name: "Professional Conference Setup",
    audience: "Corporate conferences, seminars & business presentations",
    summary: "Complete plenary staging with bright LED visuals, digital podium and full media coverage.",
    components: ["LED screens", "Digital podium", "Professional audio", "Stage lighting", "Media coverage"],
    prefillServices: [
      "Sound and microphones",
      "Screens and projection",
      "Event lighting and stage setup",
      "Photography",
      "Video recording",
    ],
    eventTypeLabel: "AGMs & Business Conferences",
    image: "/mms/mms/conference%20and%20corporates/DSC_9244.jpg",
    imageAlt: "Professional conference stage setup",
  },
  {
    id: "international-summit",
    name: "International Summit Setup",
    audience: "Complex, multi-session & multilingual events",
    summary: "Simultaneous interpretation, multi-camera hybrid broadcast and full delegate coordination.",
    components: ["Interpretation booths & headsets", "Delegate microphones", "Multi-camera live streaming", "Large LED walls"],
    prefillServices: [
      "Sound and microphones",
      "Screens and projection",
      "Multi-camera production",
      "Live streaming",
      "Event branding",
    ],
    eventTypeLabel: "International Conferences & Summits",
    image: "/conference%20and%20Events/13887116.jpg.jpeg",
    imageAlt: "International summit plenary hall",
  },
  {
    id: "gala-awards",
    name: "Gala & Awards Setup",
    audience: "Corporate celebrations & formal evening events",
    summary: "Atmospheric stage lighting, balanced sound, entertainment and awards photography.",
    components: ["Stage & decorative lighting", "Professional sound & DJ", "LED displays", "Photography & film"],
    prefillServices: [
      "Sound and microphones",
      "Screens and projection",
      "Event lighting and stage setup",
      "Photography",
      "Highlight video",
    ],
    eventTypeLabel: "Awards Ceremonies & Gala Dinners",
    image: "/mms/eventlght/stage-lights-illuminate-a-smoky-atmosphere-with-purple-and-white-beams-on-a-wooden-floor-photo.jpeg",
    imageAlt: "Gala dinner and awards lighting setup",
  },
];

export const PLANNING_PHASES: PlanningPhase[] = [
  {
    id: "phase-planning",
    phaseNumber: "Phase 01",
    name: "Planning",
    summary: "Establish objectives, select the venue and map delegate travel and hospitality.",
    stageSteps: ["01", "02", "03"],
    coverImage: "/conference%20and%20Events/Conference-Venue-Victoria-Falls.jpg.jpeg",
    coverAlt: "Conference planning and venue inspection",
  },
  {
    id: "phase-preparation",
    phaseNumber: "Phase 02",
    name: "Preparation",
    summary: "Design event branding, confirm technical production, registration, programme and catering.",
    stageSteps: ["04", "05", "06", "07", "08"],
    coverImage: "/mms/mms/conference%20and%20corporates/DSC_9244.jpg",
    coverAlt: "Conference stage branding and technical preparation",
  },
  {
    id: "phase-delivery",
    phaseNumber: "Phase 03",
    name: "Event Delivery",
    summary: "Coordinate live event operations, speakers, media capture and real-time technical support.",
    stageSteps: ["09", "10"],
    coverImage: "/mms/mms/dj%20services%20and%20entertainment/live%20streaming%20.jpeg",
    coverAlt: "Live conference production and on-site management",
  },
  {
    id: "phase-post-event",
    phaseNumber: "Phase 04",
    name: "Post-Event",
    summary: "Deliver edited photography, highlight films, equipment strike and post-event wrap-up.",
    stageSteps: ["11"],
    coverImage: "/mms/mms/video%20production/IMG_2300.jpg",
    coverAlt: "Post-event media production and reporting",
  },
];

export const STAGE_HOTSPOTS: StageHotspot[] = [
  {
    id: "led-screens",
    number: "1",
    label: "LED Screens",
    role: "Display presentations, videos, sponsor branding and remote speakers clearly across the hall.",
    categorySlug: "led-screen-rental",
    categoryName: "LED Screens & Displays",
    image: "/services%20images/LED%20Screen%20Rental.jpg",
    equipmentRefs: [
      { categorySlug: "led-screen-rental", equipmentSlug: "indoor-led-video-walls" },
      { categorySlug: "led-screen-rental", equipmentSlug: "outdoor-led-displays" },
    ],
  },
  {
    id: "digital-podium",
    number: "2",
    label: "Digital Podium",
    role: "Showcase event logos and speaker titles directly on the front of the stage lectern.",
    categorySlug: "digital-podiums",
    categoryName: "Digital Podiums",
    image: "/mms/mms/podium/WhatsApp%20Image%202026-11-20%20at%2014.19.00.jpeg",
    equipmentRefs: [{ categorySlug: "digital-podiums", equipmentSlug: "smart-digital-podium" }],
  },
  {
    id: "stage-lighting",
    number: "3",
    label: "Stage Lighting",
    role: "Keep speakers naturally lit for cameras and shift room atmosphere for evening programmes.",
    categorySlug: "event-lighting-stage-setup",
    categoryName: "Lighting & Stage",
    image: "/mms/eventlght/stage-lights-illuminate-a-smoky-atmosphere-with-purple-and-white-beams-on-a-wooden-floor-photo.jpeg",
    equipmentRefs: [
      { categorySlug: "event-lighting-stage-setup", equipmentSlug: "intelligent-stage-lighting" },
      { categorySlug: "event-lighting-stage-setup", equipmentSlug: "stage-platforms-truss-backdrops" },
    ],
  },
  {
    id: "sound-systems",
    number: "4",
    label: "Sound Systems",
    role: "Deliver clear, balanced speech and music from the front row to the back of the venue.",
    categorySlug: "professional-sound-systems",
    categoryName: "Professional Sound",
    image: "/mms/PaSystem/WhatsApp%20Image%202026-10-03%20at%2010.42.11%20AM.jpeg",
    equipmentRefs: [
      { categorySlug: "professional-sound-systems", equipmentSlug: "pa-and-line-array-systems" },
      { categorySlug: "professional-sound-systems", equipmentSlug: "digital-mixing-and-wireless-mics" },
    ],
  },
  {
    id: "conference-mics",
    number: "5",
    label: "Conference Microphones",
    role: "Enable delegates to speak from their seats and connect multilingual interpretation booths.",
    categorySlug: "conference-microphone-interpretation-equipment",
    categoryName: "Conference & Interpretation",
    image: "/services%20images/5e3c3df339009497f72d40842dd6c19b.jpg",
    equipmentRefs: [
      { categorySlug: "conference-microphone-interpretation-equipment", equipmentSlug: "conference-microphones" },
      { categorySlug: "conference-microphone-interpretation-equipment", equipmentSlug: "interpretation-booths" },
      { categorySlug: "conference-microphone-interpretation-equipment", equipmentSlug: "receivers-and-headsets" },
    ],
  },
  {
    id: "video-production",
    number: "6",
    label: "Live Streaming & Video",
    role: "Connect remote participants with multi-camera switching, live graphics and event filming.",
    categorySlug: "live-streaming-production",
    categoryName: "Live Streaming",
    image: "/mms/mms/dj%20services%20and%20entertainment/live%20streaming%20.jpeg",
    equipmentRefs: [
      { categorySlug: "live-streaming-production", equipmentSlug: "multi-camera-live-streaming" },
      { categorySlug: "videography-photography", equipmentSlug: "event-videography-and-photography" },
    ],
  },
];

export const DESTINATION_EXPERIENCES = [
  {
    title: "Accommodation & Hospitality",
    desc: "Coordinate delegate hotel allocations, VIP stays and group dining with local hospitality partners.",
    image: "/conference%20and%20Events/elephant-hills-resort-142002.webp",
    alt: "Victoria Falls resort hospitality",
  },
  {
    title: "Travel & Transfers",
    desc: "Manage airport pickups, hotel-to-venue shuttles and VIP delegate transport schedules.",
    image: "/conference%20and%20Events/Elephant-Hills.jpg.jpeg",
    alt: "Victoria Falls conference and hotel transfers",
  },
  {
    title: "Destination Experiences",
    desc: "Coordinate Victoria Falls excursions and curated guest activities through local tourism partners.",
    image: "/mms/Zambia-Zimbabwe-Victoria-Falls-Impressive-View-1.jpg",
    alt: "Victoria Falls landscape view",
  },
  {
    title: "Team Building",
    desc: "Arrange shared group experiences and outdoor retreats tailored to your corporate schedule.",
    image: "/conference%20and%20Events/Conference-Venue-Victoria-Falls.jpg.jpeg",
    alt: "Corporate retreat and team-building setting",
  },
];

export function getEventSolution(slug: string): EventSolution | undefined {
  return CONFERENCE_SOLUTIONS.find((item) => item.slug === slug);
}

export function getSolutionEquipment(solution: EventSolution): EquipmentItem[] {
  return solution.equipmentRefs
    .map((ref) => getEquipmentItem(ref.categorySlug, ref.equipmentSlug))
    .filter((item): item is EquipmentItem => Boolean(item));
}

export function getStagesForPhase(phase: PlanningPhase): ApproachStage[] {
  return approachStages.filter((stage) => phase.stageSteps.includes(stage.step));
}
