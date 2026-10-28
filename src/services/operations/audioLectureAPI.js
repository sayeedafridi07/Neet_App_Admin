import { apiConnector } from "../apiconnector";
import { audioLectureEndpoints } from "../apis";

const {
  GET_AUDIO_LECTURES_API,
  CREATE_AUDIO_LECTURE_API,
  UPDATE_AUDIO_LECTURE_API,
  UPDATE_AUDIO_LECTURE_STATUS_API,
  DELETE_AUDIO_LECTURE_API,
} = audioLectureEndpoints;

export const getAudioLectures = async (chapterId, params) => {
  const response = await apiConnector({
    method: "GET",
    url: GET_AUDIO_LECTURES_API,
    params: { ...params, chapterId },
  });

  return response.data;
};

// Multipart upload: lecture fields + the audio file under "audio"
export const createAudioLecture = async (body, audioFile) => {
  const formData = new FormData();
  Object.entries(body).forEach(([key, value]) => {
    if (value !== undefined) formData.append(key, value);
  });
  formData.append("audio", audioFile);

  const response = await apiConnector({
    method: "POST",
    url: CREATE_AUDIO_LECTURE_API,
    bodyData: formData,
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 0, // large files can take longer than the default 10s
  });

  return response.data;
};

// Multipart update: audio file is optional (only sent when replaced)
export const updateAudioLecture = async (id, body, audioFile) => {
  const formData = new FormData();
  Object.entries(body).forEach(([key, value]) => {
    if (value !== undefined) formData.append(key, value);
  });
  if (audioFile) formData.append("audio", audioFile);

  const response = await apiConnector({
    method: "PATCH",
    url: `${UPDATE_AUDIO_LECTURE_API}/${id}`,
    bodyData: formData,
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 0,
  });

  return response.data;
};

// Server flips isActive itself, so no body is needed
export const toggleAudioLectureStatus = async (id) => {
  const response = await apiConnector({
    method: "PATCH",
    url: `${UPDATE_AUDIO_LECTURE_STATUS_API}/${id}/status`,
  });

  return response.data;
};

export const deleteAudioLecture = async (id) => {
  const response = await apiConnector({
    method: "DELETE",
    url: `${DELETE_AUDIO_LECTURE_API}/${id}`,
  });

  return response.data;
};
