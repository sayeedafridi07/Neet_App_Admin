import { toast } from "react-hot-toast";

import { apiConnector } from "../apiconnector";
import { quizEndpoints } from "../apis";
import {
  setIsSubmitting,
  setLoading,
  setQuestions,
} from "../../slices/quizSlice";

const {
  GET_QUIZ_API,
  GET_QUIZ_BY_COURSE_ID_API,
  CREATE_QUIZ_API,
  UPDATE_QUIZ_API,
  DELETE_QUIZ_API,
  UPDATE_QUIZ_STATUS_API,

  GET_QUESTIONS_API,
  CREATE_QUESTION_API,
  UPLOAD_QUESTION_API,
  UPDATE_QUESTION_API,
  DELETE_QUESTION_API,
  BULK_DELETE_QUESTION_API,
} = quizEndpoints;

export const getQuiz = async (token, params) => {
  let result = null;
  try {
    const response = await apiConnector(
      "GET",
      GET_QUIZ_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      },
      params,
    );

    if (!response?.data?.success) {
      throw new Error(response?.data?.message);
    }

    result = response?.data;
  } catch (error) {
    console.error(error?.status, error?.data?.message);
    toast.error(error?.response?.data?.message || "Failed to fetch quiz");
  }
  return result;
};

export const getQuizByCourseId = async (token, id) => {
  let result = null;
  try {
    const response = await apiConnector(
      "GET",
      GET_QUIZ_BY_COURSE_ID_API + "/" + id,
      null,
      {
        Authorization: `Bearer ${token}`,
      },
    );

    if (!response?.data?.success) {
      throw new Error(response?.data?.message);
    }

    result = response?.data;
  } catch (error) {
    console.error(error?.status, error?.data?.message);
    toast.error(error?.response?.data?.message || "Failed to fetch quiz");
  }
  return result;
};

export const createQuiz = async (token, body) => {
  const toastId = toast.loading("Creating quiz...");
  let result = null;
  try {
    const response = await apiConnector("POST", CREATE_QUIZ_API, body, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error(response?.data?.message);
    }
    toast.success("Quiz created successfully");
    result = response?.data;
  } catch (error) {
    console.error(error);
    toast.error(error?.response?.data?.message || "Could not create quiz");
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

export const updateQuiz = async (token, id, body) => {
  const toastId = toast.loading("Updating quiz...");
  let result = null;
  try {
    const response = await apiConnector(
      "PATCH",
      UPDATE_QUIZ_API + "/" + id,
      body,
      {
        Authorization: `Bearer ${token}`,
      },
    );
    if (!response?.data?.success) {
      throw new Error(response?.data?.message);
    }
    toast.success("Quiz updated successfully");
    result = response?.data;
  } catch (error) {
    console.error(error);
    toast.error(error?.response?.data?.message || "Could not update quiz");
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

export const updateQuizStatus = async (token, id, body) => {
  const toastId = toast.loading("Updating quiz status...");
  let result = null;
  try {
    const response = await apiConnector(
      "PATCH",
      `${UPDATE_QUIZ_STATUS_API}/${id}/status`,
      body,
      {
        Authorization: `Bearer ${token}`,
      },
    );

    if (!response?.data?.success) {
      throw new Error(response?.data?.message);
    }
    toast.success("Quiz status updated successfully");
    result = response?.data;
  } catch (error) {
    console.error(error);
    toast.error(
      error?.response?.data?.message || "Could not update quiz status",
    );
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

export const deleteQuiz = async (token, id) => {
  const toastId = toast.loading("Deleting quiz...");
  let result = null;
  try {
    const response = await apiConnector(
      "DELETE",
      DELETE_QUIZ_API + "/" + id,
      null,
      {
        Authorization: `Bearer ${token}`,
      },
    );
    if (!response?.data?.success) {
      throw new Error(response?.data?.message);
    }
    toast.success("Quiz deleted successfully");
    result = response?.data;
  } catch (error) {
    console.error(error);
    toast.error(error?.response?.data?.message || "Could not delete quiz");
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

export function getQuestions(token, params, showLoading = true) {
  return async (dispatch) => {
    showLoading && dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "GET",
        GET_QUESTIONS_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        },
        params,
      );

      if (!response?.data?.success) {
        throw new Error(response?.data?.message);
      }

      dispatch(
        setQuestions({
          data: response?.data?.data?.questions || [],
          pagination: response?.data?.data?.pagination,
        }),
      );
      return true;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch questions",
      );
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function createQuestion(token, body, params) {
  return async (dispatch) => {
    const toastId = toast.loading("Creating question...");
    dispatch(setIsSubmitting(true));
    try {
      const response = await apiConnector("POST", CREATE_QUESTION_API, body, {
        Authorization: `Bearer ${token}`,
      });

      if (!response?.data?.success) {
        throw new Error(response?.data?.message);
      }

      toast.success("Question created successfully");
      await dispatch(getQuestions(token, params, false));
      return true;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Could not create question",
      );
      return false;
    } finally {
      toast.dismiss(toastId);
      dispatch(setIsSubmitting(false));
    }
  };
}

export function uploadQuestion(token, body, params) {
  return async (dispatch) => {
    const toastId = toast.loading("Uploading question...");
    dispatch(setIsSubmitting(true));
    try {
      const response = await apiConnector("POST", UPLOAD_QUESTION_API, body, {
        Authorization: `Bearer ${token}`,
      });

      if (!response?.data?.success) {
        throw new Error(response?.data?.message);
      }

      toast.success("Question uploaded successfully");
      await dispatch(getQuestions(token, params, false));
      return true;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Could not upload question",
      );
      return false;
    } finally {
      toast.dismiss(toastId);
      dispatch(setIsSubmitting(false));
    }
  };
}

export function updateQuestion(token, id, body, params) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating question...");
    dispatch(setIsSubmitting(true));
    try {
      const response = await apiConnector(
        "PATCH",
        UPDATE_QUESTION_API + "/" + id,
        body,
        {
          Authorization: `Bearer ${token}`,
        },
      );

      if (!response?.data?.success) {
        throw new Error(response?.data?.message);
      }

      toast.success("Question updated successfully");
      await dispatch(getQuestions(token, params, false));
      return true;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Could not update question",
      );
      return false;
    } finally {
      toast.dismiss(toastId);
      dispatch(setIsSubmitting(false));
    }
  };
}

export function deleteQuestion(token, id, params) {
  return async (dispatch) => {
    const toastId = toast.loading("Deleting question...");
    dispatch(setIsSubmitting(true));
    try {
      const response = await apiConnector(
        "DELETE",
        DELETE_QUESTION_API + "/" + id,
        null,
        {
          Authorization: `Bearer ${token}`,
        },
      );

      if (!response?.data?.success) {
        throw new Error(response?.data?.message);
      }

      toast.success("Question deleted successfully");
      await dispatch(getQuestions(token, params, false));
      return true;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Could not delete question",
      );
      return false;
    } finally {
      toast.dismiss(toastId);
      dispatch(setIsSubmitting(false));
    }
  };
}

export function bulkDeleteQuestions(token, body, params) {
  return async (dispatch) => {
    const toastId = toast.loading("Deleting questions...");
    dispatch(setIsSubmitting(true));
    try {
      const response = await apiConnector(
        "DELETE",
        BULK_DELETE_QUESTION_API,
        body,
        {
          Authorization: `Bearer ${token}`,
        },
      );

      if (!response?.data?.success) {
        throw new Error(response?.data?.message);
      }

      toast.success("Questions deleted successfully");
      await dispatch(getQuestions(token, params, false));
      return true;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Could not delete questions",
      );
      return false;
    } finally {
      toast.dismiss(toastId);
      dispatch(setIsSubmitting(false));
    }
  };
}
