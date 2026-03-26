// src/utils/fileValidation.js

export const ALLOWED_TYPES = [
    "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
    "video/mp4", "video/webm", "video/ogg",
    "audio/mpeg", "audio/ogg", "audio/wav", "audio/webm", "audio/mp4",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
];

export const DANGEROUS_EXTENSIONS = [
    "exe", "sh", "bat", "cmd", "php", "py", "js", "vbs",
    "ps1", "msi", "dll", "jar", "rb", "pl", "cgi", "asp",
    "aspx", "htaccess", "env", "pem", "key"
];

export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export const validateFile = (file) => {
    // size check
    if (file.size > MAX_FILE_SIZE)
        return { valid: false, reason: `File too large. Max ${MAX_FILE_SIZE / 1024 / 1024}MB allowed.` };

    // empty file
    if (file.size === 0)
        return { valid: false, reason: "File is empty." };

    // MIME type check
    if (!ALLOWED_TYPES.includes(file.type))
        return { valid: false, reason: `File type "${file.type}" is not allowed.` };

    // extension check
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || DANGEROUS_EXTENSIONS.includes(ext))
        return { valid: false, reason: `File extension ".${ext}" is not allowed.` };

    // filename check — no path traversal
    if (file.name.includes("..") || file.name.includes("/") || file.name.includes("\\"))
        return { valid: false, reason: "Invalid file name." };

    return { valid: true };
};

export const getFileCategory = (type = "") => {
    if (!type) return "other";
    if (type.startsWith("image/")) return "image";
    if (type.startsWith("video/")) return "video";
    if (type.startsWith("audio/")) return "audio";
    if (type === "application/pdf") return "pdf";
    if (["application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document",].includes(type)) return "document";
    if (["application/vnd.ms-excel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",].includes(type)) return "spreadsheet";
    if ([ "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation",].includes(type)) return "presentation";
    return "other";
};

export const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};