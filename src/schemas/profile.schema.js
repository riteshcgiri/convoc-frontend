import { z } from 'zod'

const profileSchema = z.object({
    name: z.string().min(2).max(50),
    username: z.string().min(3).max(30).regex(/^[a-z0-9_]+$/),
    about: z.string().max(500).optional(),
    allowBrowserNotifications: z.boolean().default(true),
    muteNotifications: z.boolean().default(false),
    agreeTerms: z.boolean(),
    agreePrivacy: z.boolean(),
});

export default profileSchema