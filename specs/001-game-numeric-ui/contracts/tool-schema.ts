import { z } from "zod";

/**
 * Tool definition for displayGameNumericalSetting.
 * This defines the schema expected by the assistant tool.
 */
export const displayGameNumericalSettingSchema = z.object({
  initialData: z.record(z.string(), z.unknown()).describe("The initial game numerical configuration to display and edit."),
});

export type DisplayGameNumericalSettingArgs = z.infer<typeof displayGameNumericalSettingSchema>;
