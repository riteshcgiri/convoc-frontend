import LinkifyIt from "linkify-it";

const linkify = new LinkifyIt();

// ✅ optionally add more schemas
linkify.add("ftp:", "http:");

// ✅ detect if text contains links
export const containsLink = (text = "") => {
    if (!text) return false;
    return linkify.test(text);
};

// ✅ parse text into parts — text and links
export const parseMessageContent = (text = "") => {
    if (!text) return [{ type: "text", content: "" }];

    const matches = linkify.match(text);
    if (!matches) return [{ type: "text", content: text }];

    const parts = [];
    let lastIndex = 0;

    matches.forEach(match => {
        // text before link
        if (match.index > lastIndex) {
            parts.push({ 
                type: "text", 
                content: text.slice(lastIndex, match.index) 
            });
        }

        // link
        parts.push({
            type: "link",
            content: match.raw,   // original text user typed e.g. "google.com"
            href: match.url,      // normalized url e.g. "http://google.com"
        });

        lastIndex = match.lastIndex;
    });

    // remaining text
    if (lastIndex < text.length) {
        parts.push({ 
            type: "text", 
            content: text.slice(lastIndex) 
        });
    }

    return parts;
};