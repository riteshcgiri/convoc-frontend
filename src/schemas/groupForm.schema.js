import { z } from "zod";

const groupFormSchema = z.object({
  groupName: z
    .string()
    .min(3, "Group name must be at least 3 characters")
    .max(50, "Group name must be less than 50 characters")
    .trim(),

  groupAbout: z
    .string()
    .max(200, "About must be less than 200 characters")
    .trim()
    .optional(),

  groupType: z.enum([
    "study",
    "entertainment",
    "exploration",
    "work",
    "family",
    "friends",
    "custom",
  ], {
    errorMap: () => ({ message: "Please select a valid group type" }),
  }),

  groupTypeLabel: z
    .string()
    .max(30, "Custom label must be less than 30 characters")
    .trim()
    .optional(),

  groupBannerColor: z
    .string()
    .default("#6366f1")
    .optional(),

  onlyAdminsCanMessage: z.boolean().default(false),
  onlyAdminsCanAddMembers: z.boolean().default(false),

  selectedMembers: z
    .array(z.string())
    .min(2, "Please add at least 2 members"),

}).refine((data) => {
  // If groupType is custom, groupTypeLabel is required
  if (data.groupType === "custom" && !data.groupTypeLabel?.trim()) {
    return false;
  }
  return true;
}, {
  message: "Please enter a custom group type label",
  path: ["groupTypeLabel"],
});

export default groupFormSchema;