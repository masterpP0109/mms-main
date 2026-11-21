export type StageGroup = {
  heading?: string;
  items: string[];
};

export type ApproachStage = {
  step: string;
  shortTitle: string;
  title: string;
  lead: string;
  image: string;
  imageAlt: string;
  paragraphs: string[];
  listIntro?: string;
  groups: StageGroup[];
  outro?: string;
};

export const approachStages: ApproachStage[] = [
  {
    step: "01",
    shortTitle: "Consultation & Strategy",
    title: "Consultation, Concept Development & Event Strategy",
    lead: "Every successful event starts with understanding your vision.",
    image: "/conference%20and%20Events/13887116.jpg.jpeg",
    imageAlt: "Large conference plenary hall with stage and LED screens",
    paragraphs: [
      "We begin by engaging with your organisation to understand the purpose, objectives, audience, expectations and desired outcomes of your event.",
      "Our team works with you to develop a comprehensive event concept that reflects your organisation's identity and creates a memorable experience for your delegates.",
    ],
    listIntro: "Our planning includes:",
    groups: [
      {
        items: [
          "Initial client consultation and needs assessment.",
          "Understanding event objectives and target audience.",
          "Event concept development and creative direction.",
          "Theme selection and event identity development.",
          "Event format and programme recommendations.",
          "Budget development and resource allocation.",
          "Venue and destination recommendations.",
          "Preliminary event planning and implementation timelines.",
        ],
      },
    ],
  },
  {
    step: "02",
    shortTitle: "Venue & Hospitality",
    title: "Venue Selection, Accommodation & Hospitality",
    lead: "The right venue and accommodation arrangements are essential to a successful corporate event.",
    image: "/conference%20and%20Events/Conference-Venue-Victoria-Falls.jpg.jpeg",
    imageAlt: "U-shape executive conference venue setup in Victoria Falls",
    paragraphs: [
      "We assist clients in identifying suitable venues and accommodation facilities based on the event's size, nature, location, budget and hospitality requirements.",
      "Whether you are hosting a board meeting, an international conference or a multi-day corporate retreat, we coordinate the necessary arrangements to ensure a comfortable and convenient experience for all delegates.",
    ],
    listIntro: "Our services include:",
    groups: [
      {
        items: [
          "Conference venue sourcing and coordination.",
          "Hotel and lodge accommodation arrangements.",
          "Delegate room allocation and booking coordination.",
          "VIP and executive accommodation arrangements.",
          "Conference room inspections and site visits.",
          "Dining arrangements and catering coordination.",
          "Welcome receptions and hospitality services.",
          "Gala dinner and networking venue arrangements.",
          "Special dietary and guest hospitality requirements.",
        ],
      },
    ],
  },
  {
    step: "03",
    shortTitle: "Travel & Logistics",
    title: "Travel, Transport & Logistics Management",
    lead: "We understand that bringing delegates together, particularly for international conferences, requires careful logistical coordination.",
    image: "/conference%20and%20Events/elephant-hills-resort-142002.webp",
    imageAlt: "Victoria Falls resort and delegate hospitality destination",
    paragraphs: [
      "Our team assists with the movement of delegates, event personnel, speakers, equipment and other essential resources to ensure that everything arrives at the right place and at the right time.",
    ],
    listIntro: "Our logistics solutions include:",
    groups: [
      {
        items: [
          "Airport transfers and delegate transportation.",
          "Shuttle services between hotels and conference venues.",
          "VIP transport and executive transfers.",
          "Group transportation for excursions and activities.",
          "Equipment transportation and mobilisation.",
          "Supplier and service provider coordination.",
          "Travel itinerary and movement scheduling.",
          "Delegate registration and arrival coordination.",
          "On-site logistics and operational support.",
        ],
      },
    ],
    outro:
      "For international events, we can also coordinate with relevant travel and hospitality partners to assist with accommodation, travel arrangements and destination experiences.",
  },
  {
    step: "04",
    shortTitle: "Branding & Design",
    title: "Event Theme, Branding & Creative Design",
    lead: "An event should communicate a message, reflect an identity and create an experience.",
    image: "/mms/mms/conference%20and%20corporates/DSC_9244.jpg",
    imageAlt: "Speaker presenting with branded backdrop and LED screen",
    paragraphs: [
      "At Mosi Media Solutions, we transform event concepts into visually engaging environments through creative design, professional branding and digital technology.",
      "From corporate conference themes to sophisticated gala dinner concepts, we ensure that the event's visual identity is consistent across all touchpoints.",
    ],
    listIntro: "Our creative and branding services include:",
    groups: [
      {
        items: [
          "Event theme and concept development.",
          "Corporate event branding and visual identity.",
          "Event logos, graphics and promotional materials.",
          "Stage backdrops and branded conference environments.",
          "LED screen content and digital presentations.",
          "Directional signage and delegate information displays.",
          "Digital welcome screens and registration displays.",
          "Branded podiums and panel discussion setups.",
          "Exhibition and display booth branding.",
          "Social media promotional graphics.",
          "Digital invitations and event announcements.",
        ],
      },
    ],
    outro: "We work to ensure that every visual element reinforces your organisation's brand and creates a cohesive event experience.",
  },
  {
    step: "05",
    shortTitle: "Technical Production",
    title: "Conference Production & Technical Event Solutions",
    lead: "Technology is at the heart of modern conferences and corporate events.",
    image: "/mms/mms/dj%20services%20and%20entertainment/digital%20podium.jpeg",
    imageAlt: "Digital podium and conference audiovisual production",
    paragraphs: [
      "Our technical team provides professional audio, visual, staging and digital solutions to ensure that every presentation, discussion and performance is delivered with clarity and precision.",
    ],
    listIntro: "Our technical production services include:",
    groups: [
      {
        heading: "Audio Solutions",
        items: [
          "Professional conference sound systems and PA.",
          "Wireless microphones and lapel microphone systems.",
          "Desktop conference microphone systems.",
          "Panel discussion and boardroom audio setups.",
          "Professional DJ systems and entertainment audio.",
          "Simultaneous interpretation equipment and systems.",
        ],
      },
      {
        heading: "Visual & Display Solutions",
        items: [
          "LED screens and large-format digital displays.",
          "Interactive touchscreen displays.",
          "Digital podiums and presentation systems.",
          "Professional projectors and projection screens.",
          "Vertical digital advertising screens.",
          "Multi-camera video production systems.",
          "PTZ camera systems for conference recording.",
          "Live presentation and content management.",
        ],
      },
      {
        heading: "Stage & Event Infrastructure",
        items: [
          "Professional stage design and construction coordination.",
          "Stage carpeting and furniture.",
          "Panel discussion furniture and configurations.",
          "Lecterns and branded podiums.",
          "Lighting and stage illumination.",
          "Exhibition and activation infrastructure.",
          "Special effects and event enhancements.",
        ],
      },
    ],
  },
  {
    step: "06",
    shortTitle: "Registration & Admin",
    title: "Delegate Registration & Conference Administration",
    lead: "A professional delegate experience begins at registration.",
    image: "/mms/mms/podium/interactive%20screens%20.jpeg",
    imageAlt: "Digital welcome and delegate registration display",
    paragraphs: [
      "We assist with establishing an organised registration process that makes guest arrival, identification and participation convenient and efficient.",
    ],
    listIntro: "Our services include:",
    groups: [
      {
        items: [
          "Online and physical registration coordination.",
          "Delegate database and attendance management.",
          "Registration desks and reception setup.",
          "Delegate badges and identification cards.",
          "Conference programmes and information packs.",
          "Speaker and VIP coordination.",
          "Conference ushers and guest assistance.",
          "Delegate seating and room management.",
          "Attendance tracking and registration reporting.",
        ],
      },
    ],
  },
  {
    step: "07",
    shortTitle: "Programme & Experiences",
    title: "Conference Programme, Activities & Destination Experiences",
    lead: "A memorable conference extends beyond the meeting room.",
    image: "/conference%20and%20Events/Elephant-Hills.jpg.jpeg",
    imageAlt: "Elephant Hills Victoria Falls resort grounds and destination experience",
    paragraphs: [
      "We help organisations create engaging programmes that combine business, networking, entertainment, recreation and destination experiences.",
      "For events hosted in Victoria Falls, we can coordinate experiences that allow delegates to explore one of Africa's most remarkable destinations while building professional and personal connections.",
    ],
    groups: [
      {
        heading: "Corporate & Team-Building Activities",
        items: [
          "Team-building exercises and challenges.",
          "Leadership development experiences.",
          "Corporate wellness activities.",
          "Networking sessions and business mixers.",
          "Interactive group activities.",
          "Corporate retreats and executive experiences.",
        ],
      },
      {
        heading: "Victoria Falls Destination Experiences",
        items: [
          "Victoria Falls Rainforest tours.",
          "Zambezi River sunset cruises.",
          "Helicopter scenic flights.",
          "Guided cultural and heritage experiences.",
          "Game drives and wildlife experiences.",
          "Golf and recreational activities.",
          "Zambezi River dining experiences.",
          "Adventure and outdoor activities.",
        ],
      },
      {
        heading: "Corporate Entertainment",
        items: [
          "Live bands and musical performances.",
          "DJs and professional entertainment.",
          "Traditional dance and cultural performances.",
          "Marimba bands and local music experiences.",
          "Gala dinners and awards ceremonies.",
          "Cocktail receptions and themed evenings.",
          "Special event performances and experiences.",
        ],
      },
    ],
    outro:
      "We coordinate these activities according to your conference programme, delegate preferences, available time and budget, working with relevant tourism and activity operators where required.",
  },
  {
    step: "08",
    shortTitle: "Catering & Dining",
    title: "Catering, Dining & Special Event Experiences",
    lead: "Food and hospitality play an important role in creating a welcoming and memorable corporate event.",
    image: "/conference%20and%20Events/WhatsApp%20Image%202026-11-21%20at%2012.43.33.jpeg",
    imageAlt: "Outdoor networking reception and corporate hospitality",
    paragraphs: [
      "We assist in coordinating catering and dining experiences that complement the event's theme, programme and guest expectations.",
    ],
    listIntro: "Our arrangements can include:",
    groups: [
      {
        items: [
          "Conference tea and coffee breaks.",
          "Working lunches and business lunches.",
          "Breakfast meetings.",
          "Cocktail receptions.",
          "Formal dinners and gala dinners.",
          "Outdoor dining and themed dinners.",
          "Executive dining experiences.",
          "Networking refreshments.",
          "Special dietary arrangements.",
        ],
      },
    ],
    outro: "We work with hospitality and catering partners to ensure that dining arrangements are professionally coordinated.",
  },
  {
    step: "09",
    shortTitle: "Media Production",
    title: "Photography, Videography & Media Production",
    lead: "Every important moment deserves to be captured.",
    image: "/mms/mms/video%20production/IMG_2300.jpg",
    imageAlt: "Professional photography and videography coverage",
    paragraphs: [
      "Our media production team documents your event through professional photography, videography and digital content creation, ensuring that your organisation has quality media for communication, marketing and future reference.",
    ],
    listIntro: "Our services include:",
    groups: [
      {
        items: [
          "Professional conference photography.",
          "Event videography and documentation.",
          "Conference highlight and recap videos.",
          "Speaker and delegate interviews.",
          "Corporate testimonial videos.",
          "Panel discussion recording.",
          "Multi-camera conference recording.",
          "Live event streaming and hybrid event production.",
          "Social media content creation.",
          "Same-day photo and video highlights, where scheduled.",
          "Post-event promotional video production.",
        ],
      },
    ],
    outro: "We create professional visual content that extends the value of your event long after it has ended.",
  },
  {
    step: "10",
    shortTitle: "On-Site Management",
    title: "On-Site Event Management & Coordination",
    lead: "Our team remains actively involved throughout the event to ensure that all planned activities and services are delivered according to the agreed programme.",
    image: "/mms/mms/conference%20and%20corporates/_DSC8272.jpg",
    imageAlt: "Formal corporate event hosts and on-site coordination",
    paragraphs: [
      "We coordinate the different service providers, technical teams, hospitality arrangements and event personnel to maintain a smooth flow of operations.",
    ],
    listIntro: "Our on-site management includes:",
    groups: [
      {
        items: [
          "Event management and coordination.",
          "Technical production management.",
          "Programme and agenda coordination.",
          "Speaker and VIP management.",
          "Supplier and contractor supervision.",
          "Stage management and programme timing.",
          "Delegate assistance and guest relations.",
          "Audio-visual troubleshooting.",
          "Event logistics and operational support.",
          "Quality control and real-time problem resolution.",
        ],
      },
    ],
    outro: "Our objective is to ensure that every part of the event works together seamlessly.",
  },
  {
    step: "11",
    shortTitle: "Post-Event & Reporting",
    title: "Event Breakdown, Post-Event Production & Reporting",
    lead: "Our commitment does not end when the last speaker leaves the stage.",
    image: "/mms/mms/conference%20and%20corporates/_DSC8303.jpg",
    imageAlt: "Completed conference production and post-event delivery",
    paragraphs: [
      "Following the event, we coordinate the breakdown of equipment and infrastructure, oversee the completion of outstanding operational requirements and provide post-event media and reporting services.",
    ],
    listIntro: "Our post-event services include:",
    groups: [
      {
        items: [
          "Professional dismantling and equipment removal.",
          "Venue restoration and handover coordination.",
          "Supplier and service provider close-out.",
          "Photography and video editing.",
          "Production of official event highlight videos.",
          "Compilation of event photographs.",
          "Post-event social media content.",
          "Conference recording and media delivery.",
          "Event performance and implementation reports.",
          "Recommendations for future events.",
        ],
      },
    ],
    outro: "We help you preserve the memories, communicate the outcomes and maximise the long-term value of your event.",
  },
];

export const specialisations = [
  {
    title: "International Conferences & Summits",
    desc: "Comprehensive planning and production for international conferences, industry summits, association meetings and professional gatherings.",
  },
  {
    title: "Corporate Meetings & Executive Retreats",
    desc: "Professional arrangements for board meetings, executive strategy sessions, leadership retreats and management workshops.",
  },
  {
    title: "AGMs & Business Conferences",
    desc: "Technical production, delegate coordination and event management for annual general meetings, shareholder meetings and business conferences.",
  },
  {
    title: "Product Launches & Brand Activations",
    desc: "Creative concepts, digital displays, branded environments and professional production for product launches and corporate brand experiences.",
  },
  {
    title: "Awards Ceremonies & Gala Dinners",
    desc: "Sophisticated event concepts, entertainment, staging, lighting, photography and audiovisual production for formal corporate celebrations.",
  },
  {
    title: "Exhibitions & Trade Shows",
    desc: "Exhibition infrastructure, display solutions, branding, interactive technology and technical event support.",
  },
  {
    title: "Corporate Retreats & Team-Building Events",
    desc: "Coordinated corporate experiences combining accommodation, destination activities, team-building and hospitality.",
  },
  {
    title: "Hybrid & Virtual Conferences",
    desc: "Integrated technical solutions connecting physical and virtual audiences through multi-camera production, livestreaming, remote speakers and digital participation.",
  },
];

export const whyChooseBenefits = [
  {
    title: "End-to-End Event Solutions",
    desc: "From initial planning and concept development to execution and post-event delivery.",
  },
  {
    title: "Integrated Technical Expertise",
    desc: "Professional audio, visual, staging, digital display and media production capabilities.",
  },
  {
    title: "Creative Event Experiences",
    desc: "Tailored themes, branding and creative concepts that bring your event vision to life.",
  },
  {
    title: "Destination Knowledge",
    desc: "Victoria Falls-based event solutions with access to local hospitality, tourism and activity partners.",
  },
  {
    title: "Professional Coordination",
    desc: "A dedicated team overseeing the different elements of your event.",
  },
  {
    title: "Flexible Solutions",
    desc: "Event services designed around your objectives, requirements and budget.",
  },
  {
    title: "Quality & Reliability",
    desc: "A commitment to professionalism, innovation and exceptional service delivery.",
  },
];
