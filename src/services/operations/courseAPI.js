import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { courseEndpoints } from "../apis";
import { setLoading, setCourses } from "../../slices/courseSlice";

const {
    GET_ALL_COURSES_API,
    CREATE_COURSE_API,
    UPDATE_COURSE_API,
    UPDATE_COURSE_STATUS_API,
    DELETE_COURSE_API,
} = courseEndpoints;

export function getCourses(token, params, showLoading = true) {
    return async (dispatch) => {
        showLoading && dispatch(setLoading(true));
        try {
            const response = await apiConnector(
                "GET",
                GET_ALL_COURSES_API,
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
                setCourses({
                    data: response?.data?.data?.courses || [],
                    pagination: response?.data?.data?.pagination,
                })
            );
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to fetch courses");
        }
        dispatch(setLoading(false));
    };
}

export function createCourse(token, body, params, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Creating course...");
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("POST", CREATE_COURSE_API, body, {
                Authorization: `Bearer ${token}`,
            },);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message);
            }

            toast.success("Course created successfully");
            dispatch(getCourses(token, params));
            if (navigate) navigate(-1);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Could not create course");
        }
        toast.dismiss(toastId);
        dispatch(setLoading(false));
    };
}

export function updateCourse(token, id, body, params, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Updating course...");
        dispatch(setLoading(true));
        try {
            const response = await apiConnector("PATCH", UPDATE_COURSE_API + "/" + id, body, {
                Authorization: `Bearer ${token}`,
            },);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message);
            }

            toast.success("Course updated successfully");
            dispatch(getCourses(token, params));
            if (navigate) navigate(-1);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Could not update course");
        }
        toast.dismiss(toastId);
        dispatch(setLoading(false));
    };
}

export function updateCourseStatus(token, id, body, params) {
    return async (dispatch) => {
        const toastId = toast.loading("Updating course status...");
        try {
            const response = await apiConnector("PATCH", `${UPDATE_COURSE_STATUS_API}/${id}/status`, body, {
                Authorization: `Bearer ${token}`,
            },);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message);
            }

            toast.success("Course status updated successfully");
            dispatch(getCourses(token, params, false));
        } catch (error) {
            toast.error(error?.response?.data?.message || "Could not update course status");
        }
        toast.dismiss(toastId);
    };
}

export function deleteCourse(token, id, params) {
    return async (dispatch) => {
        const toastId = toast.loading("Deleting course...");
        try {
            const response = await apiConnector("DELETE", DELETE_COURSE_API + "/" + id, null, {
                Authorization: `Bearer ${token}`,
            },);

            if (!response?.data?.success) {
                throw new Error(response?.data?.message);
            }

            toast.success("Course deleted successfully");
            dispatch(getCourses(token, params));
        } catch (error) {
            toast.error(error?.response?.data?.message || "Could not delete course");
        }
        toast.dismiss(toastId);
    };
}