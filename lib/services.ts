import { Globe, MessageSquare, Users, Play, Video, Camera, PenTool, Briefcase, Volume2 } from "lucide-react";

export const contentSlug = (title: string) =>
  title.toLowerCase().replace(/&/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const services = [
  {
    title: "Conference Microphone & Interpretation Equipment",
    image: "/services%20images/5e3c3df339009497f72d40842dd6c19b.jpg",
    gallery: [
      "/mms/conferenceServicesImagesGallery/How-To-Choose-A-Wireless-Interpretation-System-For-Large-Venues.jpg.jpeg",
      "/mms/conferenceServicesImagesGallery/images%20(62).jpg.jpeg",
      "/mms/conferenceServicesImagesGallery/istockphoto-1141955531-612x612.jpg.jpeg",
    ],
    tag: "Audio & Interpretation",
    desc: "Professional conference audio, microphone systems and simultaneous interpretation booths for multilingual institutional events, government meetings and international conferences.",
    items: [
      { label: "Microphone Systems", icon: Users },
      { label: "Interpretation Booths", icon: Globe },
      { label: "Receivers & Headsets", icon: Play },
      { label: "Conference Audio", icon: Video },
      { label: "Multi-language Support", icon: MessageSquare },
    ],
    cta: "Plan Your Conference",
    href: "/conference-production",
  },
  {
    title: "LED Screen Rental",
    image: "/services%20images/LED%20Screen%20Rental.jpg",
    gallery: [
      "/mms/ledScreens/vlcsnap-2026-10-03-10h06m32s158.png",
      "/mms/ledScreens/istockphoto-2170871481-612x612.jpg.jpeg",
      "/mms/ledScreens/images (63).jpg (1).jpeg",
    ],
    tag: "Visual Display",
    desc: "High-brightness LED screens, video walls and digital displays for conferences, brand activations and outdoor events — available in any size with on-site technical support.",
    items: [
      { label: "LED Screens", icon: Globe },
      { label: "Indoor & Outdoor", icon: Play },
      { label: "Video Walls", icon: Video },
      { label: "Custom Content", icon: PenTool },
      { label: "On-site Support", icon: Briefcase },
    ],
    cta: "Build Your Event",
    href: "/contact",
  },
  {
    title: "Professional Sound Systems",
    image: "/mms/PaSystem/WhatsApp%20Image%202026-10-03%20at%2010.42.11%20AM.jpeg",
    gallery: [
      "/mms/PaSystem/vlcsnap-2026-10-03-10h05m49s490.png",
      "/mms/PaSystem/vlcsnap-2026-10-03-10h06m45s223.png",
      "/services%20images/Professional%20Sound%20Systems.jpg",
     
    ],
    tag: "Audio Engineering",
    desc: "Comprehensive PA systems, line arrays, mixing consoles and wireless microphones engineered for clear, reliable sound at every venue size.",
    items: [
      { label: "PA Systems", icon: Play },
      { label: "Line Arrays", icon: Users },
      { label: "Mixing Consoles", icon: Video },
      { label: "Wireless Mics", icon: Globe },
      { label: "Acoustics", icon: MessageSquare },
    ],
    cta: "Start a Project",
    href: "/contact",
  },
  {
    title: "Live Streaming Production",
    image: "/services%20images/Live%20Streaming%20Production.jpg",
    gallery: [
      "/mms/livestreaming/7DqC9xBqivpkVQKij53366-1706-80.jpg.jpeg",
      "/mms/livestreaming/71T8PEvLnJL._AC_SX569_.jpg.jpeg",
      "/mms/livestreaming/photo-1607968565043-36af90dde238.jpg.jpeg",
    ],
    tag: "Hybrid Events",
    desc: "Full-service live streaming with multi-camera switching, platform integration, virtual backdrops and real-time graphics for hybrid and fully virtual conferences.",
    items: [
      { label: "Multi-camera Streaming", icon: Video },
      { label: "Platform Integration", icon: Play },
      { label: "Virtual Backdrops", icon: Globe },
      { label: "Live Graphics", icon: Camera },
      { label: "Replay & Editing", icon: PenTool },
    ],
    cta: "Plan Your Conference",
    href: "/conference-production",
  },
  {
    title: "Videography & Photography",
    image: "/mms/videography/movie-camera-film-reel-clapper-board-wood-closeup-124522595.webp",
   gallery: [
      "/mms/videography/istockphoto-883163916-612x612.jpg.jpeg",
      "/services%20images/videography-photography.jpg",
      "/mms/videography/vlcsnap-2026-10-03-10h05m26s464.png",
    ],
    tag: "Creative Capture",
    desc: "Cinematic event videography and professional photography — from same-day edits and highlight reels to full event archives and brand campaign imagery.",
    items: [
      { label: "Event Videography", icon: Camera },
      { label: "Photography", icon: Video },
      { label: "Highlight Reels", icon: Play },
      { label: "Same-day Edit", icon: PenTool },
      { label: "Post-production", icon: Globe },
    ],
    cta: "Start Visual Storytelling",
    href: "/contact",
  },
  {
    title: "Event Lighting & Stage Setup",
    image: "/mms/eventlght/modern-stage-setup-with-large-screen-chairs-conference-event_1187703-176862.avif",
    gallery: [
      "/mms/eventlght/modern-stage-setup-with-large-screen-chairs-conference-event_1187703-176862.avif",
      "/mms/eventlght/stage-lights-illuminate-a-smoky-atmosphere-with-purple-and-white-beams-on-a-wooden-floor-photo.jpeg",
      "/mms/eventlght/WhatsApp%20Image%202026-10-03%20at%2012.40.56%20PM.jpeg",
    ],
    tag: "Stage Design",
    desc: "Complete stage design, theatrical lighting, truss rigging and branded backdrops that transform any venue into a professional production space.",
    items: [
      { label: "Stage Design", icon: Play },
      { label: "Lighting Design", icon: Globe },
      { label: "Truss & Rigging", icon: Video },
      { label: "LED Walls", icon: PenTool },
      { label: "Backdrops", icon: Users },
    ],
    cta: "Build Your Event",
    href: "/contact",
  },
  {
    title: "Interactive Screens",
    image: "/mms/interactiveScreens/OEM-ODM-86-Inch-Business-Meeting-Presentation-Interactive-LED-Touch-Screen-Monitor-White-Board.avif",
    gallery: [
      "/mms/interactiveScreens/IMG_9220.jpeg",
      "/mms/interactiveScreens/IMG_9264.jpeg",
      "/mms/interactiveScreens/types-of-digital-signage.webp",
    ],
    tag: "Digital Engagement",
    desc: "Interactive digital displays, touch screens and smart podiums that elevate audience engagement — from live polling and Q&A to real-time content integration and immersive audience experiences.",
    items: [
      { label: "Touch Displays", icon: Globe },
      { label: "Digital Podiums", icon: Play },
      { label: "Live Polling", icon: Video },
      { label: "Interactive Content", icon: PenTool },
      { label: "Audience Engagement", icon: Briefcase },
    ],
    cta: "Engage Your Audience",
    href: "/contact",
  },
  {
    title: "DJ Services",
    image: "/mms/djServices/0d237a704ce0b4ec067317bc1e4f8f0a.jpg",
    gallery: [
      "/mms/djServices/firstImg.png",
      "/mms/djServices/49b8034ebd2420fbd38a9309c786c635.jpg",
      "/mms/djServices/f0228365620c116f61cb2d909d7f22c6.jpg",
    ],
    tag: "Entertainment",
    desc: "Professional DJ services with state-of-the-art sound systems, lighting integration and music curation for weddings, corporate events, conferences and celebrations.",
    items: [
      { label: "DJ Performances", icon: Play },
      { label: "Sound Systems", icon: Volume2 },
      { label: "Lighting Integration", icon: Globe },
      { label: "Music Curation", icon: MessageSquare },
      { label: "Event Coordination", icon: Briefcase },
    ],
    cta: "Book Your DJ",
    href: "/contact",
  },
];

