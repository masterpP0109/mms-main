import { Briefcase, Camera, Globe, MessageSquare, PenTool, Play, Users, Video, Volume2, type LucideIcon } from "lucide-react";

export const serviceFeatureIcons: Record<string, Record<string, LucideIcon>> = {
  "conference-microphone-interpretation-equipment": { "Microphone Systems": Users, "Interpretation Booths": Globe, "Receivers & Headsets": Play, "Conference Audio": Video, "Multi-language Support": MessageSquare },
  "led-screen-rental": { "LED Screens": Globe, "Indoor & Outdoor": Play, "Video Walls": Video, "Custom Content": PenTool, "On-site Support": Briefcase },
  "professional-sound-systems": { "PA Systems": Play, "Line Arrays": Users, "Mixing Consoles": Video, "Wireless Mics": Globe, "Acoustics": MessageSquare },
  "live-streaming-production": { "Multi-camera Streaming": Video, "Platform Integration": Play, "Virtual Backdrops": Globe, "Live Graphics": Camera, "Replay & Editing": PenTool },
  "videography-photography": { "Event Videography": Camera, "Photography": Video, "Highlight Reels": Play, "Same-day Edit": PenTool, "Post-production": Globe },
  "event-lighting-stage-setup": { "Stage Design": Play, "Lighting Design": Globe, "Truss & Rigging": Video, "LED Walls": PenTool, "Backdrops": Users },
  "interactive-screens": { "Touch Displays": Globe, "Digital Podiums": Play, "Live Polling": Video, "Interactive Content": PenTool, "Audience Engagement": Briefcase },
  "dj-services": { "DJ Performances": Play, "Sound Systems": Volume2, "Lighting Integration": Globe, "Music Curation": MessageSquare, "Event Coordination": Briefcase },
};
