import { z } from 'zod'

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    username: z.string().min(3, "Username must be at least 3 characters").max(30).regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers and underscores"),
    email: z.string().email().optional(),
    phone: z.coerce.string().optional(),
    about: z.string().max(500).optional(),
    allowBroswerNotifications: z.boolean().default(false),
    muteNotifications: z.boolean().default(false),
    showPopups: z.boolean().default(false),
    offerLetter: z.boolean().default(false),
    tncAccepted: z.boolean().default(true),
    agreePrivacy: z.boolean().default(true),
});

export default profileSchema