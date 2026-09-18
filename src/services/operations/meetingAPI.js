import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { meetingEndpoints } from "../apis";
import { setLoading, setMeetings } from "../../slices/meetingSlice";

const {
    GET_ALL_MEETINGS_API,
    CREATE_MEETING_API,
    UPDATE_MEETING_API,
    UPDATE_MEETING_STATUS_API,
    DELETE_MEETING_API,
} = meetingEndpoints;

export function getMeetings(token, params, showLoading = true) {
    return async (dispatch) => {
        showLoading && dispatch(setLoading(true));
        try {
            const response = await apiConnector(
                "GET",
                GET_ALL_MEETINGS_API,
                null,
                {
                    Authorization: `Bearer ${token}`,
                },
                params
            );

            if (!response?.data?.success) {
                throw new Error(response?.data?.message);
            }

            dispatch(
                setMeetings({
                    data: response?.data?.data?.meetings || [],
                    pagination: response?.data?.data?.pagination,
                })
            );
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to fetch meetings");
        }
        dispatch(setLoading(false));
    };
}

export function createMeeting(token, body, params, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Creating meeting...");
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("POST", CREATE_MEETING_API, body, {
                Authorization: `Bearer ${token}`,
            },);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message);
            }

            toast.success("Meeting created successfully");
            dispatch(getMeetings(token, params));
            if (navigate) navigate(-1);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Could not create meeting");
        }
        toast.dismiss(toastId);
        dispatch(setLoading(false));
    };
}

export function updateMeeting(token, id, body, params, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Updating meeting...");
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("PATCH", UPDATE_MEETING_API + "/" + id, body, {
                Authorization: `Bearer ${token}`,
            },);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message);
            }

            toast.success("Meeting updated successfully");
            dispatch(getMeetings(token, params));
            if (navigate) navigate(-1);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Could not update meeting");
        }
        toast.dismiss(toastId);
        dispatch(setLoading(false));
    };
}

export function updateMeetingStatus(token, id, body, params) {
    return async (dispatch) => {
        const toastId = toast.loading("Updating meeting status...");
        try {
            const response = await apiConnector("PATCH", `${UPDATE_MEETING_STATUS_API}/${id}/status`, body, {
                Authorization: `Bearer ${token}`,
            },);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message);
            }

            toast.success("Meeting status updated successfully");
            dispatch(getMeetings(token, params, false));
        } catch (error) {
            toast.error(error?.response?.data?.message || "Could not update meeting status");
        }
        toast.dismiss(toastId);
    };
}

export function deleteMeeting(token, id, params) {
    return async (dispatch) => {
        const toastId = toast.loading("Deleting meeting...");
        try {
            const response = await apiConnector("DELETE", DELETE_MEETING_API + "/" + id, null, {
                Authorization: `Bearer ${token}`,
            },);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message);
            }

            toast.success("Meeting deleted successfully");
            dispatch(getMeetings(token, params));
        } catch (error) {
            toast.error(error?.response?.data?.message || "Could not delete meeting");
        }
        toast.dismiss(toastId);
    };
}