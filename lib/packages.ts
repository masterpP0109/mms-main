/** Editorial configuration. MMS must approve names, inclusions and commercial terms.
 * Options describe a brief to discuss, never an offer or confirmed booking. */
export type PackageCategory = "weddings" | "drone" | "podcasts";
export type PackageOption = { id: string; name: string; for: string; coverage: string; finish: string; planning: string };
export type PackageExperience = {
  slug: PackageCategory; title: string; service: string; tagline: string; description: string;
  headline: string; intro: string; image: string; imageAlt: string; imagePosition?: string;
  valueTitle: string; value: string; benefits: { title: string; text: string }[];
  examples: { image: string; alt: string; title: string; text: string }[];
  options: PackageOption[]; enhancements: string[];
  process: { title: string; text: string }[];
  faqs: { question: string; answer: string }[];
  note?: string; serviceHref?: string;
  // Add only client-approved quotes or projects with documented permission.
  approvedProof: { title: string; text: string; href: string }[];
};

export const packageExperiences: PackageExperience[] = [
  {
    slug: "weddings", title: "Wedding Packages", service: "Wedding Photography & Film",
    tagline: "Your love. Your story. Beautifully remembered.",
    description: "From quiet vows to a room full of your favourite people, shape photography and film around the moments that matter.",
    headline: "The day passes.\nThe feeling stays.",
    intro: "The glance before the vows. The voices you know by heart. Let’s plan a way to return to the people, places and feelings that make this day yours.",
    image: "/mms/wedding%2012.jpg", imageAlt: "A couple walking hand in hand beside Victoria Falls", imagePosition: "center 45%",
    valueTitle: "Remember how it felt.",
    value: "Start with the memories you want to keep. We’ll discuss photography, film and a practical coverage plan that fits the rhythm of your celebration.",
    benefits: [
      { title: "Your people, in focus", text: "Share your key people, traditions and moments so the brief reflects your celebration." },
      { title: "Space to be together", text: "Plan portraits and filming around your schedule, setting and comfort in front of the camera." },
      { title: "A story to revisit", text: "Discuss the photographs, film edits and sharing formats you would like to take away." },
    ],
    examples: [
      { image: "/mms/wedding%2012.jpg", alt: "Couple portraits in the Victoria Falls landscape", title: "Just the two of you", text: "A portrait-led approach for an intimate ceremony and a setting that means something." },
      { image: "/mms/wedding1.jpg", alt: "Wedding inspiration from the MMS image library", title: "Together with your people", text: "Consider the ceremony, speeches and shared moments as chapters of a wider celebration." },
    ],
    options: [
      { id: "intimate", name: "Intimate Story", for: "Elopements and smaller celebrations", coverage: "Ceremony and couple portraits", finish: "Discuss a photograph selection or a focused film", planning: "One setting and your priority moments" },
      { id: "celebration", name: "Celebration Story", for: "A day shared with family and friends", coverage: "Preparation, ceremony and celebration highlights", finish: "Discuss photography, a highlight film or both", planning: "A coordinated timeline across your day" },
      { id: "complete", name: "Fuller Story", for: "Celebrations with more chapters to tell", coverage: "Multiple moments or locations across the celebration", finish: "Discuss a broader edit and sharing versions", planning: "Additional coverage and travel reviewed together" },
    ],
    enhancements: ["Additional coverage time", "A second location or celebration", "Speech or ceremony edits", "Social sharing versions", "Aerial sequences, subject to a separate feasibility review"],
    process: [
      { title: "Share your day", text: "Tell us your preferred date, locations and the moments you want to keep." },
      { title: "Shape the story", text: "Discuss coverage, creative direction and the finished work you have in mind." },
      { title: "Agree the plan", text: "Confirm availability, scope, quotation and booking terms with MMS." },
      { title: "Celebrate", text: "Work to the agreed schedule, with room for venue and weather arrangements." },
      { title: "Return to it", text: "Review the agreed selections and edits, with delivery timing set in your quotation." },
    ],
    faqs: [
      { question: "Are these fixed wedding packages?", answer: "These options are starting points for a tailored quotation. Coverage hours, crew, photographs, film length, revisions, pricing and booking terms must be confirmed by MMS." },
      { question: "Can we choose photography and film?", answer: "Yes, you can enquire about either or both. Tell us your priorities so MMS can discuss a suitable combination and check availability." },
      { question: "Can you cover an intimate elopement?", answer: "Share your preferred date, exact location and ceremony plans. Access, travel and the scale of coverage can then be discussed." },
      { question: "Is our date reserved when we send an enquiry?", answer: "No. An enquiry requests a conversation. Availability and the steps to secure a booking are confirmed directly with MMS." },
      { question: "When will we receive our photographs or film?", answer: "Selections, edit lengths, formats, revisions and delivery timing are agreed in your quotation. Please include any important deadline in your enquiry." },
    ],
    serviceHref: "/services/weddings-elopements", approvedProof: [],
  },
  {
    slug: "drone", title: "Drone Packages", service: "Drone Photography & Videography",
    tagline: "Discover the extraordinary from above.",
    description: "Bring scale, setting and movement to a destination, property or event story with thoughtfully planned aerial coverage.",
    headline: "A different view.\nA bigger story.",
    intro: "A place is more than a point on a map. Reveal its setting, its scale and the way it connects to the world around it.",
    image: "/victoria_falls_banner.png", imageAlt: "A panoramic landscape across Victoria Falls",
    valueTitle: "Let the setting speak.",
    value: "Discuss aerial stills and moving sequences that help people understand a place before they arrive. Every brief begins with a location and feasibility review.",
    benefits: [
      { title: "Show the whole picture", text: "Introduce the landscape around a venue, destination or property." },
      { title: "Add a sense of movement", text: "Discuss aerial sequences that connect naturally with a wider production." },
      { title: "Plan for the platform", text: "Shape the brief around your website, campaign or social publishing needs." },
    ],
    examples: [
      { image: "/victoria_falls_banner.png", alt: "Victoria Falls and its surrounding landscape", title: "A sense of place", text: "Consider establishing views for tourism, hospitality or a location-led story." },
      { image: "/mms/vic%20falls%20bridge.jpg", alt: "Landscape and bridge near Victoria Falls", title: "Context beyond the frame", text: "Discuss how an aerial sequence could connect a subject to its wider surroundings." },
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
    serviceHref: "/services/drone", approvedProof: [],
  },
  {
    slug: "podcasts", title: "Podcast Packages", service: "Podcast Production",
    tagline: "Powerful conversations deserve professional production.",
    description: "Turn an idea, an interview or an ongoing conversation into audio and video content shaped for your audience.",
    headline: "Your voice.\nWorth listening to.",
    intro: "A good conversation can change a perspective. Give your ideas the space, sound and visual treatment to reach the people who need to hear them.",
    image: "/mms/audio1.jpg", imageAlt: "Microphone and audio mixing desk in a production setting",
    valueTitle: "Make room for the conversation.",
    value: "Focus on what you want to say. Discuss recording, editing and publishing formats with a production team, from a first conversation to a recurring series.",
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

export const getPackageExperience = (slug: string) => packageExperiences.find(item => item.slug === slug);
export const packagePath = (slug: PackageCategory) => `/packages/${slug}`;
export function packageEnquiryHref(slug: PackageCategory, option = "tailored") {
  return `${packagePath(slug)}?${new URLSearchParams({ package: option })}#package-enquiry`;
}
