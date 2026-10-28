import { apiConnector } from "../apiconnector";
import { keywordRevisionEndpoints } from "../apis";

const {
  GET_KEYWORD_REVISIONS_API,
  CREATE_KEYWORD_REVISION_API,
  UPDATE_KEYWORD_REVISION_API,
  UPDATE_KEYWORD_REVISION_STATUS_API,
  DELETE_KEYWORD_REVISION_API,
} = keywordRevisionEndpoints;

export const getKeywordRevisions = async (chapterId, params) => {
  const response = await apiConnector({
    method: "GET",
    url: GET_KEYWORD_REVISIONS_API,
    params: { ...params, chapterId },
  });

  return response.data;
};

// Multipart upload: revision fields + the audio file under "audio", optional cover under "image"
export const createKeywordRevision = async (body, audioFile, imageFile) => {
  const formData = new FormData();
  Object.entries(body).forEach(([key, value]) => {
    if (value !== undefined) formData.append(key, value);
  });
  formData.append("audio", audioFile);
  if (imageFile) formData.append("image", imageFile);

  const response = await apiConnector({
    method: "POST",
    url: CREATE_KEYWORD_REVISION_API,
    bodyData: formData,
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 0,
  });

  return response.data;
};

// Multipart update: audio and image are optional (only sent when replaced)
export const updateKeywordRevision = async (id, body, audioFile, imageFile) => {
  const formData = new FormData();
  Object.entries(body).forEach(([key, value]) => {
    if (value !== undefined) formData.append(key, value);
  });
  if (audioFile) formData.append("audio", audioFile);
  if (imageFile) formData.append("image", imageFile);

  const response = await apiConnector({
    method: "PATCH",
    url: `${UPDATE_KEYWORD_REVISION_API}/${id}`,
    bodyData: formData,
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 0,
  });

  return response.data;
};

// Server flips isActive itself, so no body is needed
export const toggleKeywordRevisionStatus = async (id) => {
  const response = await apiConnector({
    method: "PATCH",
    url: `${UPDATE_KEYWORD_REVISION_STATUS_API}/${id}/status`,
  });

  return response.data;
};

export const deleteKeywordRevision = async (id) => {
  const response = await apiConnector({
    method: "DELETE",
    url: `${DELETE_KEYWORD_REVISION_API}/${id}`,
  });

  return response.data;
};
