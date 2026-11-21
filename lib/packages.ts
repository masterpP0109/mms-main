import {
  weddingPackages,
  socialEventOptionalAddOns,
  legacyWeddingLocations,
  legacyWeddingPackageIds,
} from "./wedding-packages";

/** Editorial configuration. MMS must approve names, inclusions and commercial terms.
 * Options describe a brief to discuss, never an offer or confirmed booking. */
export type PackageCategory =
  | "conferences"
  | "weddings"
  | "video-production"
  | "drone"
  | "podcasts";

export type HomePackageCategory = "conferences" | "weddings" | "video-production";

export type PackageOption = {
  id: string;
  name: string;
  badge?: "BASIC" | "STANDARD" | "PREMIUM";
  tierLabel?: string;
  for: string;
  highlights?: string[];
  comparison?: {
    scale: string;
    audioAv: string;
    visuals: string;
    effects: string;
    support: string;
  };
  inclusions?: string[];
  suitableFor?: string[];
  coverage?: string;
  finish?: string;
  planning?: string;
  location?: string;
};

export type PackageExperience = {
  slug: PackageCategory;
  title: string;
  homeTitle?: string;
  homeLabel?: string;
  homeDescription?: string;
  homeCta?: string;
  service: string;
  tagline: string;
  description: string;
  designedFor?: string;
  headline: string;
  intro: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  valueTitle: string;
  value: string;
  benefits: { title: string; text: string }[];
  examples: { image: string; alt: string; title: string; text: string }[];
  options: PackageOption[];
  optionalAddOns?: string[];
  enhancements: string[];
  process: { title: string; text: string }[];
  faqs: { question: string; answer: string }[];
  note?: string;
  serviceHref?: string;
  // Add only client-approved quotes or projects with documented permission.
  approvedProof: { title: string; text: string; href: string }[];
};

export const additionalSpecialisedServices = [
  {
    category: "Audio Solutions",
    services: "PA systems, DJ equipment, conference microphones, interpretation systems",
  },
  {
    category: "Visual Solutions",
    services: "Photography, videography, drone filming, livestreaming, PTZ cameras",
  },
  {
    category: "AV & Staging",
    services: "LED screens, interactive screens, digital podiums, projectors",
  },
  {
    category: "Digital Displays",
    services: "Vertical LED screens, digital signage and advertising displays",
  },
  {
    category: "Special Effects",
    services: "Cold sparks, low-lying clouds and bubble machines",
  },
  {
    category: "Interactive Experiences",
    services: "Overhead 360 video booth and interactive displays",
  },
  {
    category: "Digital Marketing",
    services: "Social media management, promotional content and digital advertising",
  },
] as const;

export const importantPackageInformation = [
  "All packages are customisable according to the client's event requirements, budget, venue and number of attendees.",
  "Equipment quantities and production crew sizes are determined by the scale and technical requirements of each project.",
  "Accommodation, transport, meals and other logistical requirements for events outside Victoria Falls are quoted separately where applicable.",
  "Drone services are subject to applicable aviation regulations, permissions, weather and site conditions.",
  "Additional editing, extended coverage and specialised production requirements may attract additional charges.",
  "All prices are available on request and are open for discussion depending on the scope of work.",
  "A detailed quotation will be provided following a client consultation and assessment of the project requirements.",
] as const;

export const packageExperiences: PackageExperience[] = [
  {
    slug: "conferences",
    title: "Conference & Corporate Event Packages",
    homeTitle: "Conference & Corporate Event Packages",
    homeLabel: "01 / Corporate",
    homeDescription:
      "Corporate Essentials, Corporate Professional and Corporate Elite packages with sound, LED screens, streaming and full technical production.",
    homeCta: "Explore Conference & Corporate Packages",
    service: "Conference & Corporate Event Production",
    tagline: "AV, staging and hybrid coverage for events.",
    description:
      "Designed for conferences, seminars, workshops, AGMs, product launches, exhibitions, corporate meetings, business summits and government functions.",
    designedFor:
      "Designed for conferences, seminars, workshops, AGMs, product launches, exhibitions, corporate meetings, business summits and government functions.",
    headline: "Production built\nfor the room.",
    intro:
      "Designed for conferences, seminars, workshops, AGMs, product launches, exhibitions, corporate meetings, business summits and government functions — scaled around your venue, delegates and technical agenda.",
    image: "/mms/conference%20hero%20img.png",
    imageAlt: "Conference stage, LED screen and audiovisual production setup",
    imagePosition: "center center",
    valueTitle: "Every speaker heard. Every moment captured.",
    value:
      "Choose a starting tier from small corporate meetings to international hybrid summits, then customise crew, displays, interpretation and post-event media around your programme.",
    benefits: [
      {
        title: "Scalable AV & staging",
        text: "From PA systems and projectors to line-array sound, LED walls and interactive digital podiums.",
      },
      {
        title: "Hybrid & multilingual ready",
        text: "Integrate remote speakers, live streaming, multi-camera recording and simultaneous interpretation.",
      },
      {
        title: "End-to-end technical crew",
        text: "Dedicated setup, live technical coordination, ushers where required, and post-event media production.",
      },
    ],
    examples: [
      {
        image: "/mms/DSC_9244.jpg",
        alt: "Conference production and staging in Victoria Falls",
        title: "Summits & plenary sessions",
        text: "Coordinated sound, LED visuals, panel microphones and live camera coverage for high-level forums.",
      },
      {
        image: "/mms/DSC_7607.jpg",
        alt: "Corporate event audiovisual setup and digital display",
        title: "Corporate meetings & launches",
        text: "Clean stage presentation, digital branding and crisp photography for corporate milestones.",
      },
    ],
    options: [
      {
        id: "corporate-essentials",
        name: "Corporate Essentials",
        badge: "BASIC",
        tierLabel: "Basic Conference Package",
        for: "Ideal for small meetings, workshops, seminars and corporate presentations.",
        highlights: [
          "PA sound & wireless microphones",
          "Projector & projection screen",
          "Basic stage & branding assistance",
          "Event photography (1 photographer)",
          "Technical support throughout",
        ],
        comparison: {
          scale: "Small meetings, workshops & seminars",
          audioAv: "PA sound, wireless mics & projector/screen",
          visuals: "1 event photographer",
          effects: "Basic stage & event branding assistance",
          support: "On-site technical support",
        },
        inclusions: [
          "Professional PA sound system.",
          "Wireless microphones (handheld or lapel).",
          "Projector and projection screen.",
          "Basic stage and presentation setup.",
          "Event photography.",
          "One professional event photographer.",
          "Technical support throughout the event.",
          "Basic event branding assistance.",
        ],
        coverage: "PA sound, wireless mics, projector & screen, and event photography",
        finish: "Edited event photography coverage",
        planning: "Stage setup, branding assistance and full technical support",
      },
      {
        id: "corporate-professional",
        name: "Corporate Professional",
        badge: "STANDARD",
        tierLabel: "Standard Conference Package",
        for: "Ideal for medium-sized conferences, corporate functions, seminars and business meetings.",
        highlights: [
          "PA sound, wireless & conference mics",
          "LED screen display & stage branding",
          "Conference photography & videography",
          "Panel discussion setup & 2-camera option",
          "Event highlight video & technical team",
        ],
        comparison: {
          scale: "Medium conferences & corporate functions",
          audioAv: "PA sound, conference mics & LED screen",
          visuals: "Photography, 2-cam video & highlight reel",
          effects: "Panel setup & digital display management",
          support: "Technical support team & setup/breakdown",
        },
        inclusions: [
          "Professional PA sound system.",
          "Wireless microphones and conference microphones.",
          "LED screen display.",
          "Professional stage setup and branding.",
          "Conference photography.",
          "Conference videography.",
          "Event highlight video.",
          "Panel discussion setup with microphones and seating.",
          "Presentation and digital display management.",
          "Two-camera video coverage where required.",
          "Technical support team.",
          "Event setup and breakdown.",
        ],
        coverage: "LED display, panel setup, photography and two-camera videography",
        finish: "Conference photography plus an event highlight video",
        planning: "Stage branding, display management and technical support team",
      },
      {
        id: "corporate-elite",
        name: "Corporate Elite",
        badge: "PREMIUM",
        tierLabel: "Premium Conference & Hybrid Event Package",
        for: "Ideal for international conferences, corporate summits, high-level government functions, AGMs and major business events.",
        highlights: [
          "Line-array sound & full LED stage design",
          "Multi-camera recording & highlight film",
          "Live streaming & remote speaker integration",
          "Interpretation & translation systems",
          "Digital interactive podium & full crew",
        ],
        comparison: {
          scale: "International summits, AGMs & gov functions",
          audioAv: "Line-array sound, full LED & interactive podium",
          visuals: "Multi-cam full recording & post-event media",
          effects: "Hybrid live streaming & interpretation systems",
          support: "On-site production team & event ushers",
        },
        inclusions: [
          "Professional line-array or column-array sound system.",
          "Full LED screen setup and digital branding.",
          "Professional stage design and setup.",
          "Conference microphone systems.",
          "Panel discussion and speaker presentation setup.",
          "Professional photography and videography.",
          "Multi-camera conference recording.",
          "Live streaming and hybrid event integration.",
          "Remote speaker integration.",
          "Interpretation and translation systems.",
          "Digital interactive podium.",
          "Professional event highlight video.",
          "Full conference recording.",
          "On-site technical production team.",
          "Event ushers and technical coordination where required.",
          "Post-event media production.",
        ],
        coverage: "Line-array sound, full LED wall, multi-cam recording, hybrid & interpretation",
        finish: "Full conference recording, highlight video and post-event media",
        planning: "Full production team, interactive podium and technical coordination",
      },
    ],
    optionalAddOns: [
      "85-inch interactive display screens.",
      "Vertical digital LED displays.",
      "Desktop conference microphone systems.",
      "Simultaneous interpretation booths and equipment.",
      "Overhead 360-degree video booth.",
      "DJ and professional lighting.",
      "Cold spark special effects.",
      "Low-lying cloud effects.",
      "Cocktail furniture and event staging.",
    ],
    enhancements: [
      "85-inch interactive display screens",
      "Vertical digital LED displays & desktop conference microphone systems",
      "Simultaneous interpretation booths and equipment",
      "Overhead 360-degree video booth, DJ and professional lighting",
      "Cold spark special effects, low-lying cloud effects & cocktail furniture",
    ],
    process: [
      { title: "Consultation", text: "Share your event type, venue, delegate count and programme requirements." },
      { title: "Technical scoping", text: "We match equipment quantities, crew size and optional add-ons to your venue." },
      { title: "Quotation & plan", text: "Receive a detailed quotation covering production, logistics and timelines." },
      { title: "Setup & delivery", text: "On-site rigging, testing and seamless technical support throughout your event." },
      { title: "Post-event media", text: "Receive your photography, highlight films and full conference recordings." },
    ],
    faqs: [
      {
        question: "Can we customise a conference package for our delegate count?",
        answer: "Yes. All packages are customisable according to your event requirements, budget, venue and number of attendees.",
      },
      {
        question: "Do you handle conferences outside Victoria Falls?",
        answer: "Yes. Accommodation, transport, meals and other logistical requirements for events outside Victoria Falls are quoted separately where applicable.",
      },
      {
        question: "Can we incorporate individual specialised services?",
        answer: "Yes. You can add 85-inch interactive screens, interpretation booths, 360 video booths, vertical LED displays or other specialised services to any package.",
      },
      {
        question: "How are prices determined?",
        answer: "All prices are available on request and are open for discussion depending on the scope of work. A detailed quotation is provided after consultation.",
      },
    ],
    serviceHref: "/conference-production",
    approvedProof: [],
  },
  {
    slug: "weddings",
    title: "Weddings and Social Events Packages",
    homeTitle: "Weddings and Social Events Packages",
    homeLabel: "02 / Celebrations",
    homeDescription:
      "Celebration Starter, Celebration Plus and Celebration Luxe packages for weddings, birthdays, anniversaries and private celebrations.",
    homeCta: "Explore Weddings & Social Packages",
    service: "Wedding, Birthday & Social Event Production",
    tagline: "Your celebration, beautifully remembered.",
    description:
      "Designed for weddings, birthday celebrations, anniversaries, private parties, graduation celebrations, family gatherings, engagement parties and other social functions.",
    designedFor:
      "Designed for weddings, birthday celebrations, anniversaries, private parties, graduation celebrations, family gatherings, engagement parties and other social functions.",
    headline: "The day passes.\nThe feeling stays.",
    intro:
      "Designed for weddings, birthday celebrations, anniversaries, private parties, graduation celebrations, family gatherings, engagement parties and other social functions — combining sound, lighting, special effects, photography and cinematic film.",
    image: "/mms/wedding%2012.jpg",
    imageAlt: "A couple walking hand in hand beside Victoria Falls",
    imagePosition: "center 45%",
    valueTitle: "Every milestone, elevated.",
    value:
      "Whether you are planning an intimate gathering or a luxury destination wedding, choose a celebration tier and customise music, lighting, 360 experiences, special effects and aerial coverage.",
    benefits: [
      {
        title: "Sound, DJ & atmosphere",
        text: "Professional PA systems, DJ consoles, party lighting, dancefloor effects and stage backdrops.",
      },
      {
        title: "Photography & cinema",
        text: "Capture every speech, entrance and dance with single or multi-camera photography and highlight films.",
      },
      {
        title: "Signature visual moments",
        text: "Add cold sparks, low-lying clouds, bubble machines, LED screens and overhead 360-degree video booths.",
      },
    ],
    examples: [
      {
        image: "/mms/wedding%2012.jpg",
        alt: "Couple portraits in the Victoria Falls landscape",
        title: "Weddings & destination vows",
        text: "Romantic portraits, ceremony audio and cinematic highlight films crafted around your venue.",
      },
      {
        image: "/mms/wedding1.jpg",
        alt: "Wedding and social celebration from the MMS image library",
        title: "Birthdays, anniversaries & receptions",
        text: "Full DJ entertainment, dancefloor lighting, LED displays and cold spark grand entrances.",
      },
    ],
    options: weddingPackages.map(option => ({
      id: option.id,
      name: option.name,
      badge: option.badge,
      tierLabel: option.tierLabel,
      for: option.description,
      highlights: option.highlights,
      comparison: option.comparison,
      inclusions: option.inclusions,
      location: option.location,
      coverage: option.coverage,
      finish: option.finish,
      planning: option.planning,
    })),
    optionalAddOns: socialEventOptionalAddOns,
    enhancements: socialEventOptionalAddOns,
    process: [
      { title: "Share your celebration", text: "Tell us your event type, preferred date, venue and guest scale." },
      { title: "Select your tier", text: "Start with Celebration Starter, Plus or Luxe and choose any optional add-ons." },
      { title: "Confirm the quotation", text: "Review equipment, crew, logistics and booking terms in a tailored quotation." },
      { title: "Setup & celebration", text: "Our team handles sound, lighting, effects and capture from setup to breakdown." },
      { title: "Relive the moments", text: "Receive your curated photographs and highlight films ready to share." },
    ],
    faqs: [
      {
        question: "Are these packages only for weddings?",
        answer: "No. They are designed for weddings, birthday celebrations, anniversaries, private parties, graduation celebrations, family gatherings, engagement parties and other social functions.",
      },
      {
        question: "Can we customise what is included?",
        answer: "Yes. All packages are customisable according to your event requirements, budget, venue and number of attendees.",
      },
      {
        question: "Can we add drone filming or live streaming?",
        answer: "Yes. Live streaming and drone photography and videography are available as optional add-ons, with drone services subject to applicable aviation regulations, permissions, weather and site conditions.",
      },
      {
        question: "Is our date reserved when we send an enquiry?",
        answer: "No. An enquiry starts the consultation so MMS can confirm availability and provide a detailed quotation.",
      },
    ],
    serviceHref: "/services/weddings-elopements",
    approvedProof: [],
  },
  {
    slug: "video-production",
    title: "Video Production Packages",
    homeTitle: "Video Production Packages",
    homeLabel: "03 / Video Production",
    homeDescription:
      "Video Essentials, Video Professional and Cinematic Elite packages for commercials, documentaries and promotional visual content.",
    homeCta: "Explore Video Production Packages",
    service: "Commercial & Creative Video Production",
    tagline: "Cinematic visual storytelling for brands.",
    description:
      "Designed for companies, organisations, institutions, tourism operators, events, brands, entrepreneurs and individuals seeking professional visual content.",
    designedFor:
      "Designed for companies, organisations, institutions, tourism operators, events, brands, entrepreneurs and individuals seeking professional visual content.",
    headline: "Stories framed\nto move people.",
    intro:
      "Designed for companies, organisations, institutions, tourism operators, events, brands, entrepreneurs and individuals seeking professional visual content — from agile social clips to full cinema-grade campaigns.",
    image: "/mms/media-prodction.jpg.jpeg",
    imageAlt: "Cinema camera and studio lighting in a video production setup",
    imagePosition: "center center",
    valueTitle: "From concept to final cut.",
    value:
      "Select a production tier suited to your shoot scale, then tailor scripting, cinema cameras, aerial filming, voice-overs, motion graphics and social cut-downs.",
    benefits: [
      {
        title: "Purpose-built production",
        text: "Tailored for business introductions, tourism campaigns, company profiles, documentaries and commercials.",
      },
      {
        title: "Cinema & 4K craft",
        text: "Professional lighting, crisp audio recording, cinematic camera movement and optional drone aerial filming.",
      },
      {
        title: "Post-production polish",
        text: "Colour grading, motion graphics, sound design, audio mixing and social media-ready cut-downs.",
      },
    ],
    examples: [
      {
        image: "/mms/media-prodction.jpg.jpeg",
        alt: "Studio lighting and video production equipment",
        title: "Commercial & brand films",
        text: "Concept-driven 4K films with interviews, motion graphics and multi-platform edits.",
      },
      {
        image: "/services%20images/videography-photography.jpg",
        alt: "Videographer filming on location",
        title: "Tourism & documentary storytelling",
        text: "Authentic visual narratives combining ground cinema cameras and licensed aerial sequences.",
      },
    ],
    options: [
      {
        id: "video-essentials",
        name: "Video Essentials",
        badge: "BASIC",
        tierLabel: "Basic Video Production",
        for: "Ideal for small businesses, social media content, interviews and promotional clips.",
        highlights: [
          "1-camera production & 1 videographer",
          "Basic lighting & professional audio",
          "Editing, colour correction & music",
          "Social media-ready final video",
          "Built for promos & short interviews",
        ],
        comparison: {
          scale: "Small businesses, social clips & interviews",
          audioAv: "1-camera setup, basic lighting & pro audio",
          visuals: "Final edited video + social media format",
          effects: "Colour correction & background music",
          support: "1 videographer",
        },
        inclusions: [
          "One-camera professional video production.",
          "Professional camera and lens setup.",
          "Basic lighting setup.",
          "Professional audio recording.",
          "One videographer.",
          "Basic video editing.",
          "Colour correction.",
          "Background music.",
          "Final edited video.",
          "Social media-ready video format.",
        ],
        suitableFor: [
          "Business introductions.",
          "Short interviews.",
          "Social media videos.",
          "Basic promotional content.",
          "Personal video projects.",
        ],
        coverage: "Single-camera production with lighting and professional audio",
        finish: "Final edited video with colour correction and social format",
        planning: "One videographer scoped for interviews and social clips",
      },
      {
        id: "video-professional",
        name: "Video Professional",
        badge: "STANDARD",
        tierLabel: "Standard Commercial Production",
        for: "Ideal for businesses, tourism companies, corporate organisations and marketing campaigns.",
        highlights: [
          "4K multi-camera production where required",
          "Cinematic camera movement & lighting",
          "Interviews, testimonials & colour grading",
          "Motion graphics, titles & licensed music",
          "Social cut-downs + 2 revision rounds",
        ],
        comparison: {
          scale: "Tourism, corporate & marketing campaigns",
          audioAv: "Multi-cam 4K, cinematic movement & lighting",
          visuals: "Promo film, interviews & social cut-downs",
          effects: "Colour grading, motion graphics & titles",
          support: "2 rounds of reasonable revisions",
        },
        inclusions: [
          "Multi-camera video production where required.",
          "Professional 4K video recording.",
          "Cinematic camera movements.",
          "Professional lighting and audio recording.",
          "Interviews and testimonials.",
          "Professional video editing.",
          "Colour grading.",
          "Motion graphics and animated titles.",
          "Licensed music where applicable.",
          "Corporate promotional video.",
          "Social media cut-downs.",
          "Two rounds of reasonable revisions.",
        ],
        suitableFor: [
          "Corporate promotional videos.",
          "Company profile videos.",
          "Tourism and hospitality videos.",
          "Product advertisements.",
          "Event highlight videos.",
          "Brand storytelling.",
          "Testimonial videos.",
        ],
        coverage: "4K multi-camera production, cinematic movement and interviews",
        finish: "Graded promotional video, motion graphics and social cut-downs",
        planning: "Two rounds of reasonable revisions included in scope",
      },
      {
        id: "cinematic-elite",
        name: "Cinematic Elite",
        badge: "PREMIUM",
        tierLabel: "Premium Film & Commercial Production",
        for: "Ideal for major brands, tourism campaigns, corporate advertisements, documentaries and high-end productions.",
        highlights: [
          "Concept, creative direction & scripting",
          "Cinema cameras, 4K multi-cam & drone aerials",
          "Talent coordination & voice-over integration",
          "Cinema colour grade, VFX & sound mixing",
          "Commercial film + multi-version deliverables",
        ],
        comparison: {
          scale: "TV commercials, documentaries & campaigns",
          audioAv: "Cinema cameras, advanced lighting & drone",
          visuals: "Commercial/doc film + multi-format versions",
          effects: "Cinematic grade, VFX, animation & sound mix",
          support: "Concept, scripting & talent coordination",
        },
        inclusions: [
          "Full production planning and concept development.",
          "Creative direction and script development.",
          "Professional multi-camera production.",
          "Cinematic 4K video production.",
          "Professional cinema camera equipment.",
          "Drone aerial filming (subject to permissions and weather conditions).",
          "Advanced lighting and professional sound recording.",
          "Interviews and professional talent coordination.",
          "Professional voice-over integration.",
          "Advanced video editing.",
          "Cinematic colour grading.",
          "Motion graphics and animation.",
          "Visual effects where required.",
          "Professional sound design and audio mixing.",
          "Commercial and promotional film production.",
          "Multiple social media video versions.",
          "Final delivery in agreed digital formats.",
        ],
        suitableFor: [
          "Television commercials.",
          "Destination marketing campaigns.",
          "Tourism documentaries.",
          "Corporate documentaries.",
          "Brand campaigns.",
          "Large-scale advertising productions.",
          "Institutional and government productions.",
        ],
        coverage: "Cinema cameras, creative direction, voice-over and aerial filming",
        finish: "Master commercial/documentary film plus multi-format social edits",
        planning: "Full pre-production planning, scripting and talent coordination",
      },
    ],
    enhancements: [
      "Drone aerial filming (subject to aviation permissions and weather)",
      "Additional social media aspect-ratio cut-downs",
      "Extended filming days or multi-location travel",
      "Custom motion graphics, animation or voice-over talent",
      "Social media management and digital advertising support",
    ],
    process: [
      { title: "Creative brief", text: "Share your audience, message, locations and target platforms." },
      { title: "Concept & scope", text: "We plan shoot days, crew, equipment and scripting where required." },
      { title: "Quotation", text: "Receive a transparent quotation tailored to your production scale." },
      { title: "Production", text: "Filming with cinema-grade lighting, cameras and crisp audio." },
      { title: "Post & delivery", text: "Editing, colour grading, sound mixing and delivery in agreed formats." },
    ],
    faqs: [
      {
        question: "Does Cinematic Elite include drone filming everywhere?",
        answer: "Drone services are subject to applicable aviation regulations, permissions, weather and site conditions.",
      },
      {
        question: "Can we request additional revisions or social cut-downs?",
        answer: "Yes. Additional editing, extended coverage and specialised production requirements may attract additional charges, agreed in your quotation.",
      },
      {
        question: "Do you travel outside Victoria Falls for shoots?",
        answer: "Yes. Accommodation, transport, meals and other logistical requirements for projects outside Victoria Falls are quoted separately where applicable.",
      },
      {
        question: "How do we get pricing for a video package?",
        answer: "All prices are available on request and open for discussion depending on the scope of work. Send an enquiry to schedule a consultation.",
      },
    ],
    serviceHref: "/services/videography-photography",
    approvedProof: [],
  },
  {
    slug: "drone",
    title: "Drone Packages",
    service: "Drone Photography & Videography",
    tagline: "Discover the extraordinary from above.",
    description:
      "From the cliffs of Batoka Gorge and the winding Zambezi River to Victoria Falls landscapes, we capture remarkable aerial perspectives through professional drone photography and cinematic filming for tourism, properties and special events.",
    headline: "A different view.\nA bigger story.",
    intro:
      "A place is more than a point on a map. Reveal its setting, its scale and the way it connects to the world around it.",
    image: "/mms/drone/landscape-photography-15.webp",
    imageAlt: "Aerial view over African river and open landscape captured by drone",
    valueTitle: "Let the setting speak.",
    value:
      "Discuss aerial stills and moving sequences that help people understand a place before they arrive. Every brief begins with a location and feasibility review.",
    benefits: [
      { title: "Show the whole picture", text: "Introduce the landscape around a venue, destination or property." },
      { title: "Add a sense of movement", text: "Discuss aerial sequences that connect naturally with a wider production." },
      { title: "Plan for the platform", text: "Shape the brief around your website, campaign or social publishing needs." },
    ],
    examples: [
      { image: "/mms/drone/Untitled-design-3-scaled.webp", alt: "Cinematic drone filming and aerial videography perspective", title: "A sense of place", text: "Consider establishing views for tourism, hospitality or a location-led story." },
      { image: "/mms/drone/landscape-photography-5.webp", alt: "Dramatic landscape and terrain aerial perspective", title: "Context beyond the frame", text: "Discuss how an aerial sequence could connect a subject to its wider surroundings." },
    ],
    options: [
      { id: "aerial-stills", name: "Aerial Perspectives", for: "A place told through still images", coverage: "A location-led aerial photography brief", finish: "Discuss image selection, formats and intended use", planning: "Location, access and permission review" },
      { id: "aerial-film", name: "Moving Perspectives", for: "Destinations and promotional storytelling", coverage: "Aerial moving sequences around an agreed shot list", finish: "Discuss an edited sequence or footage requirements", planning: "Shot planning and weather contingencies" },
      { id: "aerial-production", name: "Connected Perspectives", for: "Aerial views within a wider production", coverage: "Aerial and ground-level coverage to discuss together", finish: "Discuss a combined edit and publication versions", planning: "Coordination across locations and production teams" },
    ],
    enhancements: ["Additional locations", "Ground-level photography or film", "Alternative edit formats", "Social campaign cutdowns", "Travel and access coordination, quoted for the brief"],
    process: [
      { title: "Pin the location", text: "Send exact locations, preferred dates and the purpose of the shoot." },
      { title: "Review feasibility", text: "Assess access, airspace, safety and applicable regulatory permissions." },
      { title: "Agree the scope", text: "Confirm a feasible shot plan, quotation and weather contingency." },
      { title: "Capture safely", text: "Proceed only when operating conditions and permissions allow." },
      { title: "Prepare the edit", text: "Complete agreed selections, formats and edits to the confirmed brief." },
    ],
    note: "All aerial coverage is subject to weather, exact location, safe operating conditions and applicable regulatory permissions. Venue or landowner access alone is not permission to fly. MMS must review feasibility before confirming any aerial work; discuss alternative coverage or rescheduling terms in your quotation.",
    faqs: [
      { question: "Can you fly at any location?", answer: "No. Send the exact location for review. Airspace restrictions, local rules, people, wildlife, land access and applicable regulatory permissions may prevent or limit flight. Venue access alone does not authorise a flight." },
      { question: "What happens in unsuitable weather?", answer: "Aerial work may need to change, be postponed or be cancelled. Discuss rescheduling, alternative coverage and applicable terms with MMS before confirming a booking." },
      { question: "Are flights over event guests included?", answer: "No. Flights around people require a safety and regulatory review. Do not assume overhead guest coverage is feasible or included." },
      { question: "Does a package include permits, travel or raw footage?", answer: "These are brief-specific. Permissions, access arrangements, travel, footage use, image selection, licensing and edits must be agreed in the quotation." },
      { question: "Can I request a date before permissions are reviewed?", answer: "You can share a preferred date, but an enquiry does not confirm availability, permission to fly or a booking." },
    ],
    serviceHref: "/services/drone",
    approvedProof: [],
  },
  {
    slug: "podcasts",
    title: "Podcast Packages",
    service: "Podcast Production",
    tagline: "Powerful conversations deserve professional production.",
    description:
      "From inspiring interviews and business conversations to branded podcasts and engaging video series, we turn ideas into professional productions through crystal-clear audio, multi-camera filming, studio lighting and polished editing.",
    headline: "Your voice.\nWorth listening to.",
    intro:
      "A good conversation can change a perspective. Give your ideas the space, sound and visual treatment to reach the people who need to hear them.",
    image: "/mms/audio1.jpg",
    imageAlt: "Microphone and audio mixing desk in a production setting",
    valueTitle: "Make room for the conversation.",
    value:
      "Focus on what you want to say. Discuss recording, editing and publishing formats with a production team, from a first conversation to a recurring series.",
    benefits: [
      { title: "A clear starting point", text: "Define your audience, format and the purpose of the conversation." },
      { title: "An intentional recording", text: "Discuss microphones, room conditions and camera coverage suited to your setting." },
      { title: "Content with a next step", text: "Plan the edits and versions you need for listening, watching and sharing." },
    ],
    examples: [
      { image: "/mms/audio1.jpg", alt: "Microphone beside an audio console", title: "A conversation, heard", text: "Explore an audio-led interview, discussion or first podcast episode." },
      { image: "/mms/media-prodction.jpg.jpeg", alt: "Cameras and lighting in a production studio illustration", title: "A conversation, seen", text: "Discuss filmed episodes and shorter extracts for a visual audience." },
    ],
    options: [
      { id: "audio-conversation", name: "The Conversation", for: "An audio-led episode or interview", coverage: "An agreed recording session and audio brief", finish: "Discuss an edited audio episode and file formats", planning: "Audience, participants and room requirements" },
      { id: "video-conversation", name: "Beyond Audio", for: "Conversations made to watch and hear", coverage: "Audio and camera coverage to suit your format", finish: "Discuss a video episode and audio version", planning: "Setting, lighting and participant arrangements" },
      { id: "podcast-series", name: "The Series", for: "A consistent, recurring conversation", coverage: "A proposed sequence of recording sessions", finish: "Discuss episode edits and sharing extracts", planning: "A series outline and production schedule" },
    ],
    enhancements: ["Short social extracts", "Captions or transcripts", "Intro and outro treatment", "Additional episode versions", "Location recording, subject to an agreed production plan"],
    process: [
      { title: "Find the idea", text: "Tell us who you want to reach and what you want to say." },
      { title: "Shape the format", text: "Discuss participants, audio or video, setting and episode structure." },
      { title: "Agree production", text: "Confirm scope, recording arrangements, quotation and terms." },
      { title: "Record", text: "Bring the agreed conversation to the planned recording setup." },
      { title: "Prepare to share", text: "Review agreed edits and versions for your publishing channels." },
    ],
    faqs: [
      { question: "Can you help with a first podcast?", answer: "Share your idea, audience and preferred format. MMS can discuss a recording and editing brief; episode strategy and any additional support must be agreed in scope." },
      { question: "Is a studio included?", answer: "A studio, venue, equipment setup and participant arrangements are not automatically included. Discuss the location, acoustic conditions and production requirements with MMS." },
      { question: "Can we record video as well as audio?", answer: "Ask about a video conversation brief. Camera coverage, lighting, crew, recording duration and finished versions are confirmed in your quotation." },
      { question: "Do you publish the podcast for us?", answer: "Hosting, distribution, account management, music licensing, captions and transcripts are separate items to discuss. No publishing service or audience result is promised by these options." },
      { question: "How many episodes and revisions are included?", answer: "Episode count, length, recording sessions, edits, revisions and turnaround are agreed for your production. The options shown are starting points, not fixed inclusions." },
    ],
    approvedProof: [],
  },
];

export const homePackageSlugs: HomePackageCategory[] = [
  "conferences",
  "weddings",
  "video-production",
];

export const homePackageExperiences = homePackageSlugs
  .map(slug => packageExperiences.find(item => item.slug === slug))
  .filter((item): item is PackageExperience => Boolean(item));

export const getPackageExperience = (slug: string) =>
  packageExperiences.find(item => item.slug === slug);

export const packagePath = (slug: PackageCategory) => `/packages/${slug}`;

/** Old coverage-tier links remain usable as custom enquiries, without inventing a destination. */
export function resolvePackageSelection(
  slug: PackageCategory,
  requested?: string | null,
  location?: string | null,
) {
  const experience = getPackageExperience(slug);
  if (!experience) return "tailored";
  const selected = experience.options.find(option => option.id === requested);
  if (selected) return selected.id;
  if (slug === "weddings" && requested && legacyWeddingLocations[requested]) {
    return "tailored";
  }
  if (slug === "weddings" && location) {
    return "tailored";
  }
  return "tailored";
}

export function isLegacyWeddingPackage(slug: PackageCategory, id: string) {
  return slug === "weddings" && legacyWeddingPackageIds.includes(id);
}

export function resolveLegacyWeddingLocation(requested?: string | null) {
  if (!requested) return "";
  return legacyWeddingLocations[requested] ?? "";
}

export function packageEnquiryHref(slug: PackageCategory, option = "tailored") {
  const packageId = resolvePackageSelection(slug, option);
  const location = getPackageExperience(slug)?.options.find(item => item.id === packageId)?.location;
  const params = new URLSearchParams({ package: packageId });
  if (location) params.set("location", location);
  return `${packagePath(slug)}?${params.toString()}#package-enquiry`;
}
