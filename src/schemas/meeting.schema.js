const { z } = require("zod");

const createMeetingSchema = z.object({
    title: z.string({ required_error: "Meeting title is required" }),
    description: z.string().optional().nullable(),
    meetingLink: z.string({ required_error: "Meeting link is required" }).url("Meeting link must be a valid URL"),
    startTime: z.coerce.date({ required_error: "Start time is required", invalid_type_error: "Start time must be a valid date" }),
    endTime: z.coerce.date({ required_error: "End time is required", invalid_type_error: "End time must be a valid date" }),
    isActive: z.boolean().optional(),
}).refine(
    (data) => {
        if (data.startTime && data.endTime) {
            return new Date(data.endTime) > new Date(data.startTime);
        }
        return true;
    },
    {
        message: "End time must be after start time",
        path: ["endTime"],
    }
);

const updateMeetingSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional().nullable(),
    meetingLink: z.string().url("Meeting link must be a valid URL").optional(),
    startTime: z.coerce.date().optional(),
    endTime: z.coerce.date().optional(),
    isActive: z.boolean().optional(),
}).refine(
    (data) => {
        if (data.startTime && data.endTime) {
            return new Date(data.endTime) > new Date(data.startTime);
        }
        return true;
    },
    {
        message: "End time must be after start time",
        path: ["endTime"],
    }
);

const updateMeetingStatusSchema = z.object({
    isActive: z.boolean(),
});

module.exports = {
    createMeetingSchema,
    updateMeetingSchema,
    updateMeetingStatusSchema,
};

