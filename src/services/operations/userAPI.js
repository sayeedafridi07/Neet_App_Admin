import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { userEndpoints } from "../apis";
import { setLoading, setUsers } from "../../slices/userSlice";

const {
    GET_ALL_USERS_API,
    CREATE_USER_API,
    UPDATE_USER_API,
    UPDATE_USER_STATUS_API,
    DELETE_USER_API,
    RESET_DEVICE_API
} = userEndpoints;

export function getUsers(token, params, showLoading = true) {
    return async (dispatch) => {
        showLoading && dispatch(setLoading({ role: params?.role, loading: true }));
        try {
            const response = await apiConnector(
                "GET",
                GET_ALL_USERS_API,
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
                setUsers({
                    role: params?.role,
                    data: response?.data?.data?.users || [],
                    pagination: response?.data?.data?.pagination,
                })
            );
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to fetch users");
        }
        dispatch(setLoading({ role: params?.role, loading: false }));
    };
}

export function createUser(token, body, params, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Creating user...");
        dispatch(setLoading({ role: params?.role, loading: true }));
        try {
            const response = await apiConnector("POST", CREATE_USER_API, body, {
                Authorization: `Bearer ${token}`,
            },);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message);
            }

            toast.success("User created successfully");
            // dispatch(getUsers(token, params));
            if (navigate) navigate(-1);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Could not create user");
        }
        toast.dismiss(toastId);
        dispatch(setLoading({ role: params?.role, loading: false }));
    };
}

export function updateUser(token, id, body, params, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Updating user...");
        dispatch(setLoading({ role: params?.role, loading: true }));
        try {
            const response = await apiConnector("PATCH", UPDATE_USER_API + "/" + id, body, {
                Authorization: `Bearer ${token}`,
            },);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message);
            }

            toast.success("User updated successfully");
            // dispatch(getUsers(token, params));
            if (navigate) navigate(-1);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Could not update user");
        }
        toast.dismiss(toastId);
        dispatch(setLoading({ role: params?.role, loading: false }));
    };
}

export function updateUserStatus(token, id, body, params) {
    return async (dispatch) => {
        const toastId = toast.loading("Updating user status...");
        try {
            const response = await apiConnector("PATCH", `${UPDATE_USER_STATUS_API}/${id}/status`, body, {
                Authorization: `Bearer ${token}`,
            },);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message);
            }

            toast.success("User status updated successfully");
            dispatch(getUsers(token, params, false));
        } catch (error) {
            toast.error(error?.response?.data?.message || "Could not update user status");
        }
        toast.dismiss(toastId);
    };
}

export function deleteUser(token, id, params) {
    return async (dispatch) => {
        const toastId = toast.loading("Deleting user...");
        try {
            const response = await apiConnector("DELETE", DELETE_USER_API + "/" + id, null, {
                Authorization: `Bearer ${token}`,
            },);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message);
            }

            toast.success("User deleted successfully");
            dispatch(getUsers(token, params));
        } catch (error) {
            toast.error(error?.response?.data?.message || "Could not delete user");
        }
        toast.dismiss(toastId);
    };
}

export function resetDevice(token, id, params) {
    return async (dispatch) => {
        const toastId = toast.loading("Resetting user device...");
        try {
            const response = await apiConnector("PATCH", `${RESET_DEVICE_API}/${id}/reset-device`, null, {
                Authorization: `Bearer ${token}`,
            },);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message);
            }

            toast.success("User device reset successfully");
            dispatch(getUsers(token, params));
        } catch (error) {
            toast.error(error?.response?.data?.message || "Could not reset user device");
        }
        toast.dismiss(toastId);
    };
}