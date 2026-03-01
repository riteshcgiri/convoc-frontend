import linkifyIt from 'linkify-it'

const linkify = linkifyIt()

export const parseAbout = (text) => {
  const lines = text?.split('\n');
  const results = [];

  lines.forEach(line => {
    const trimmed = line?.trim();
    if (!trimmed) return;

    // Links — check first before anything else
    const links = linkify?.match(trimmed);
    if (links) {
      links?.forEach(link => results?.push({ type: 'link', value: link.url }))
      return;
    }

    // Hashtags — return after pushing so line doesn't also become text
    const hashtags = trimmed?.match(/#\w+/g)
    if (hashtags) {
      hashtags?.forEach(tag => { results.push({ type: 'hashtag', value: tag }) })
      return;
    }

    // Company
    if (/working at|works at|at\s+[A-Z]/i?.test(trimmed)) {
      results?.push({ type: "company", value: trimmed });
      return;
    }

    // Education
    if (/studied at|university|college/i?.test(trimmed)) {
      results?.push({ type: "education", value: trimmed });
      return;
    }

    // Location
    if (/based in|from\s+[A-Z]/i?.test(trimmed)) {
      results?.push({ type: "location", value: trimmed });
      return;
    }

    // Default text
    results?.push({ type: "text", value: trimmed });
  });

  return results;
};


export const detectPlatform = (url) => {
  const host = new URL(url)?.hostname;

  if (host?.includes("instagram")) return "instagram";
  if (host?.includes("x.com") || host?.includes("twitter")) return "twitter";
  if (host?.includes("github")) return "github";
  if (host?.includes("spotify")) return "spotify";
  if (host?.includes("steam")) return "steam";
  if (host?.includes("linkedin")) return "linkedin";
  if (host?.includes("youtube")) return "youtube";

  return "website";
};

// Per-platform: which path segment is the actual username
const usernameSegmentIndex = {
  instagram: 0,   
  twitter: 0,     
  github: 0,      
  linkedin: 1,    
  spotify: 1,     
  steam: 1,       
  youtube: 1,     
  website: 0,
};

export const extractUsername = (url) => {
  try {
    const platform = detectPlatform(url);
    const segments = new URL(url).pathname.split("/").filter(Boolean);
    const idx = usernameSegmentIndex[platform] ?? 0;
    return segments[idx] || platform;
  } catch {
    return "link";
  }
};