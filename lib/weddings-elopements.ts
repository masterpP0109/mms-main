export interface WeddingDestination {
  name: string;
  description: string;
  perfectFor: string;
}

export interface WeddingElopementPackage {
  number: number;
  name: string;
  badge?: string;
  price: string;
  priceNote: string;
  description: string;
  inclusions: string[];
  recommendedLocations: string;
}

export interface WeddingAddon {
  title: string;
  description: string;
}

export interface SignatureStage {
  stage: string;
  title: string;
  description: string;
}

export const weddingDestinations: WeddingDestination[] = [
  {
    name: "Victoria Falls Rainforest",
    description:
      "A magical natural setting surrounded by lush greenery, mist and the extraordinary atmosphere of one of the world's greatest natural wonders.",
    perfectFor: "Intimate ceremonies, romantic portraits and nature-inspired elopements.",
  },
  {
    name: "Batoka Gorge",
    description:
      "A dramatic and adventurous destination with spectacular gorge landscapes, offering a striking backdrop for couples seeking something bold and extraordinary.",
    perfectFor: "Adventure elopements, dramatic photography and exclusive proposals.",
  },
  {
    name: "Zambezi Islands",
    description:
      "An intimate natural escape surrounded by the beauty of the Zambezi River. A private island atmosphere creates an exceptional setting for romantic celebrations.",
    perfectFor: "Private proposals, barefoot weddings and intimate elopements.",
  },
  {
    name: "Zambezi Shores",
    description:
      "Celebrate love beside the beautiful Zambezi River, with spectacular sunsets and the tranquillity of the African wilderness.",
    perfectFor: "Sunset weddings, romantic dinners and luxury proposals.",
  },
  {
    name: "National Park Vleis",
    description:
      "A beautiful wilderness-inspired setting for couples who appreciate nature, open landscapes and the authentic African outdoor experience.",
    perfectFor: "Rustic weddings, intimate ceremonies and nature-inspired photography.",
  },
];

export const exclusiveWeddingPackages: WeddingElopementPackage[] = [
  {
    number: 1,
    name: "The African Romance",
    badge: "Intimate celebration",
    price: "$850",
    priceNote: "Starting package price · Subject to quotation",
    description:
      "Designed for couples who want a beautiful, intimate wedding experience surrounded by nature.",
    inclusions: [
      "Exclusive outdoor ceremony setup.",
      "Elegant wedding arch and basic floral décor.",
      "Bridal bouquet and groom's boutonnière.",
      "Ceremony seating for up to 10 guests.",
      "Romantic aisle styling.",
      "Background music and portable sound system.",
      "Professional wedding photography.",
      "30 professionally edited photographs.",
      "Short wedding highlight video.",
      "Dedicated event coordinator.",
      "Basic bridal and groom preparation assistance.",
      "Romantic post-ceremony photo session.",
    ],
    recommendedLocations:
      "Victoria Falls Rainforest, Zambezi Shores and National Park Vleis.",
  },
  {
    number: 2,
    name: "The Destination Love Experience",
    badge: "Most versatile",
    price: "$1,650",
    priceNote: "Starting package price · Subject to quotation",
    description:
      "A more elaborate wedding experience for couples who want to celebrate with their closest family and friends in a beautiful destination.",
    inclusions: [
      "Premium outdoor wedding ceremony setup.",
      "Customised wedding arch and floral arrangements.",
      "Bridal bouquet and groom's boutonnière.",
      "Elegant aisle and seating décor for up to 25 guests.",
      "Professional PA system and wireless microphones.",
      "Curated wedding music.",
      "Professional wedding photography.",
      "Full wedding videography coverage.",
      "60 professionally edited photographs.",
      "Cinematic 3–5-minute wedding highlight film.",
      "Drone photography and aerial footage, where permitted.",
      "Wedding coordinator and event technical support.",
      "Romantic couple's photo session.",
      "Personalised welcome signage.",
      "Champagne or non-alcoholic celebration toast.",
    ],
    recommendedLocations:
      "Zambezi Islands, Zambezi Shores and Batoka Gorge.",
  },
  {
    number: 3,
    name: "The Royal African Wedding",
    badge: "Premium experience",
    price: "$3,500",
    priceNote: "Starting package price · Subject to quotation",
    description:
      "An exclusive destination wedding experience designed for couples who want luxury, elegance and a professionally produced celebration.",
    inclusions: [
      "Premium destination ceremony setup.",
      "Bespoke wedding décor and floral styling.",
      "Designer wedding arch and aisle arrangement.",
      "Ceremony and reception styling for up to 50 guests.",
      "Premium seating and cocktail furniture.",
      "Professional sound system and wireless microphones.",
      "DJ and entertainment setup.",
      "Professional wedding photography team.",
      "Dedicated videography team.",
      "Cinematic wedding film.",
      "100 professionally edited photographs.",
      "Drone aerial photography and video, where permitted.",
      "LED screen for personalised wedding visuals.",
      "Digital welcome signage.",
      "Personalised couple's video montage.",
      "Romantic sunset couple's photoshoot.",
      "Cold spark special effects, subject to venue approval.",
      "Dedicated wedding planner and event coordinator.",
      "On-site technical support.",
      "Premium wedding presentation and digital delivery of media.",
    ],
    recommendedLocations:
      "Zambezi Shores, Zambezi Islands and selected Batoka Gorge locations.",
  },
];

export const exclusiveElopementPackages: WeddingElopementPackage[] = [
  {
    number: 4,
    name: "Just The Two Of Us",
    price: "$550",
    priceNote: "Starting package price · Subject to quotation",
    description:
      "An intimate and simple elopement designed for two people who want to exchange their vows in a beautiful natural setting.",
    inclusions: [
      "Private-style ceremony arrangement.",
      "Minimalist wedding décor.",
      "Bridal bouquet and boutonnière.",
      "Romantic ceremony music.",
      "Professional wedding photography.",
      "25 edited photographs.",
      "Short romantic video.",
      "Couple's portrait session.",
      "Personalised digital wedding keepsake.",
      "Dedicated event coordinator.",
    ],
    recommendedLocations: "Victoria Falls Rainforest and Zambezi Shores.",
  },
  {
    number: 5,
    name: "The Luxury Elopement",
    price: "$1,200",
    priceNote: "Starting package price · Subject to quotation",
    description:
      "An elevated elopement experience for couples seeking exclusivity, beautiful styling and cinematic memories.",
    inclusions: [
      "Exclusive destination ceremony setup.",
      "Premium floral and wedding décor.",
      "Personalised ceremony backdrop.",
      "Bridal bouquet and groom's boutonnière.",
      "Professional sound and romantic music.",
      "Premium wedding photography.",
      "50 edited photographs.",
      "Cinematic 3–5-minute elopement film.",
      "Drone photography and aerial footage, where permitted.",
      "Romantic sunset photoshoot.",
      "Personalised wedding video message.",
      "Romantic picnic or celebration setup.",
      "Champagne or non-alcoholic toast.",
      "Dedicated wedding coordinator.",
      "Digital wedding memories package.",
    ],
    recommendedLocations:
      "Zambezi Islands, Batoka Gorge and Zambezi Shores.",
  },
];

export const marriageProposalPackages: WeddingElopementPackage[] = [
  {
    number: 6,
    name: "The Perfect Question",
    price: "$250",
    priceNote: "Starting package price · Subject to quotation",
    description:
      "A beautifully styled and intimate proposal for couples who prefer simplicity with a romantic touch.",
    inclusions: [
      "Romantic proposal setup.",
      "Decorative floral arrangement.",
      "Personalised proposal message.",
      "Decorative candles and romantic styling.",
      "Rose petals.",
      "Background romantic music.",
      "Professional proposal photography.",
      "20 edited photographs.",
      "Proposal coordination and surprise assistance.",
    ],
    recommendedLocations: "Victoria Falls Rainforest and Zambezi Shores.",
  },
  {
    number: 7,
    name: "The Romantic Escape",
    price: "$550",
    priceNote: "Starting package price · Subject to quotation",
    description:
      "A private and luxurious proposal experience designed around romance, beautiful scenery and unforgettable memories.",
    inclusions: [
      "Premium romantic proposal setup.",
      "Personalised floral arrangements.",
      "Custom proposal signage.",
      "Luxury picnic or romantic dining setup.",
      "Candles, lanterns and decorative lighting.",
      "Romantic music and portable sound system.",
      "Professional proposal photographer.",
      "Dedicated videographer.",
      "30 edited photographs.",
      "Cinematic proposal highlight video.",
      "Champagne or non-alcoholic celebration toast.",
      "Dedicated proposal coordinator.",
    ],
    recommendedLocations:
      "Zambezi Shores, Zambezi Islands and National Park Vleis.",
  },
  {
    number: 8,
    name: "The Ultimate Yes Experience",
    badge: "Exclusive experience",
    price: "$950",
    priceNote: "Starting package price · Subject to quotation",
    description:
      "For those who want to turn their proposal into a spectacular and unforgettable occasion.",
    inclusions: [
      "Bespoke luxury proposal design.",
      "Custom floral installation and proposal backdrop.",
      "Personalised LED illuminated proposal signage.",
      "Decorative lighting and candles.",
      "Personalised message or video presentation.",
      "Professional sound system and curated music.",
      "Professional photography and videography.",
      "50 edited photographs.",
      "Cinematic proposal film.",
      "Drone footage, where permitted.",
      "Romantic dining or luxury picnic setup.",
      "Special celebration toast.",
      "Cold spark effects, subject to location approval.",
      "Dedicated proposal planner and coordinator.",
      "Surprise reveal coordination.",
      "Personalised digital keepsake.",
    ],
    recommendedLocations:
      "Zambezi Islands, Batoka Gorge and selected Zambezi Shores locations.",
  },
];

export const featuredWeddingAddons: WeddingAddon[] = [
  {
    title: "Premium floral styling",
    description: "Custom bouquets, flower arrangements and ceremony décor.",
  },
  {
    title: "Licensed drone services",
    description:
      "Aerial photography and cinematic footage, subject to aviation and location approvals.",
  },
  {
    title: "DJ and entertainment",
    description: "Professional DJ, sound and entertainment solutions.",
  },
  {
    title: "LED and digital displays",
    description:
      "Personalised welcome messages, proposal displays and wedding slideshows.",
  },
  {
    title: "Luxury picnic experiences",
    description: "Private picnic arrangements and romantic dining setups.",
  },
  {
    title: "Special effects",
    description:
      "Cold sparks, low-lying clouds and bubbles, subject to safety and venue approvals.",
  },
  {
    title: "360° video experience",
    description:
      "Interactive 360° video booth for guests and wedding celebrations.",
  },
  {
    title: "Private romantic dining",
    description:
      "Custom dining experiences with décor and personalised touches.",
  },
];

export const additionalWeddingServices: string[] = [
  "Wedding invitation design and digital invitations.",
  "Personalised wedding websites.",
  "Same-day wedding highlight edits.",
  "Live streaming for family and friends overseas.",
  "Wedding guest photography.",
  "Wedding ceremony audio recording.",
  "Pre-wedding engagement photoshoots.",
  "Honeymoon welcome arrangements.",
  "Custom wedding signage and branding.",
  "Transport and destination coordination through suitable service partners.",
];

export const signatureJourneyStages: SignatureStage[] = [
  {
    stage: "Stage 1",
    title: "The Proposal",
    description:
      "We secretly plan and coordinate the proposal, including the location, decorations, photography, videography and surprise reveal.",
  },
  {
    stage: "Stage 2",
    title: "The Elopement or Wedding",
    description:
      "Once the answer is YES, we help plan an intimate ceremony or a full destination wedding at one of our selected locations.",
  },
  {
    stage: "Stage 3",
    title: "The Celebration and Memories",
    description:
      "We capture the special moments through professional photography, cinematic wedding films, drone footage and personalised digital keepsakes.",
  },
];

export const importantPackageInformation: string[] = [
  "All prices are indicative starting prices in United States Dollars (USD).",
  "Final quotations depend on the selected location, guest numbers, décor requirements and additional services.",
  "Packages cover the listed Mosi Media Solutions services and do not automatically include venue hire, statutory marriage registration, marriage officiants, catering, accommodation, travel, park entry or transport unless specifically stated in the quotation.",
  "Civil and legally recognised marriage ceremonies must be arranged with the appropriate authorised marriage officer and relevant authorities.",
  "Access to national parks, islands, gorges and other protected or privately managed locations is subject to permission, applicable fees and safety requirements.",
  "Drone operations are subject to applicable aviation regulations and location-specific permissions.",
  "Special effects are subject to environmental and venue safety approval.",
  "International clients are encouraged to book in advance to allow adequate destination and event coordination.",
  "Custom packages are available for couples with unique requirements.",
];
