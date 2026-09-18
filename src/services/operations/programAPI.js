import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { programEndpoints } from "../apis";
import { setLoading, setPrograms } from "../../slices/ProgramSlice";

const {
    GET_ALL_PROGRAMS_API,
    CREATE_PROGRAM_API,
    UPDATE_PROGRAM_API,
    UPDATE_PROGRAM_STATUS_API,
    DELETE_PROGRAM_API,
} = programEndpoints;

export function getPrograms(token, params, showLoading = true) {
    return async (dispatch) => {
        showLoading && dispatch(setLoading(true));
        try {
            const response = await apiConnector(
                "GET",
                GET_ALL_PROGRAMS_API,
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
                setPrograms({
                    data: response?.data?.data?.programs || [],
                    pagination: response?.data?.data?.pagination,
                })
            );
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to fetch programs");
        }
        dispatch(setLoading(false));
    };
}

export function createProgram(token, body, params, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Creating program...");
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("POST", CREATE_PROGRAM_API, body, {
                Authorization: `Bearer ${token}`,
            },);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message);
            }

            toast.success("Program created successfully");
            dispatch(getPrograms(token, params));
            if (navigate) navigate(-1);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Could not create program");
        }
        toast.dismiss(toastId);
        dispatch(setLoading(false));
    };
}

export function updateProgram(token, id, body, params, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Updating program...");
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("PATCH", UPDATE_PROGRAM_API + "/" + id, body, {
                Authorization: `Bearer ${token}`,
            },);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message);
            }

            toast.success("Program updated successfully");
            dispatch(getPrograms(token, params));
            if (navigate) navigate(-1);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Could not update program");
        }
        toast.dismiss(toastId);
        dispatch(setLoading(false));
    };
}

export function updateProgramStatus(token, id, body, params) {
    return async (dispatch) => {
        const toastId = toast.loading("Updating program status...");
        try {
            const response = await apiConnector("PATCH", `${UPDATE_PROGRAM_STATUS_API}/${id}/status`, body, {
                Authorization: `Bearer ${token}`,
            },);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message);
            }

            toast.success("Program status updated successfully");
            dispatch(getPrograms(token, params, false));
        } catch (error) {
            toast.error(error?.response?.data?.message || "Could not update program status");
        }
        toast.dismiss(toastId);
    };
}

export function deleteProgram(token, id, params) {
    return async (dispatch) => {
        const toastId = toast.loading("Deleting program...");
        try {
            const response = await apiConnector("DELETE", DELETE_PROGRAM_API + "/" + id, null, {
                Authorization: `Bearer ${token}`,
            },);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message);
            }

            toast.success("Program deleted successfully");
            dispatch(getPrograms(token, params));
        } catch (error) {
            toast.error(error?.response?.data?.message || "Could not delete program");
        }
        toast.dismiss(toastId);
    };
}