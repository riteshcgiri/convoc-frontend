import { parseMessageContent } from "../../utils/linkUtils";
import { ExternalLink } from "lucide-react";
const MessageContent = ({ content }) => {


    if (!content) return null;

    const parts = parseMessageContent(content);

    // ✅ if no links just return plain text
    if (parts.every(p => p.type === "text")) {
        return <span>{content}</span>;
    }

    return (
        <span>
            {parts.map((part, i) => {
                if (part.type === "text") {
                    return <span key={i}>{part.content}</span>;
                }

                return (
                        <a
                        key={i}
                        href={part.href}
                        target="_blank"
                        rel="noopener noreferrer"   
                        onClick={e => e.stopPropagation()}
                        className="inline-flex items-center gap-0.5 underline-offset-2 text-blue-300 hover:text-white transition-colors break-all">
                        {part.content}
                    </a>
                );
            })}
        </span>
    );
};

export default MessageContent;