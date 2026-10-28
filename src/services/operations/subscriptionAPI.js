import { apiConnector } from "../apiconnector";
import { subscriptionEndpoints } from "../apis";

const {
  GET_SUBSCRIPTIONS_API,
  CREATE_SUBSCRIPTION_API,
  UPDATE_SUBSCRIPTION_API,
  DELETE_SUBSCRIPTION_API,
  UPDATE_SUBSCRIPTION_STATUS_API,
} = subscriptionEndpoints;

export const getSubscriptions = async (params) => {
  const response = await apiConnector({
    method: "GET",
    url: GET_SUBSCRIPTIONS_API,
    params,
  });

  return response.data;
};

export const createSubscription = async (body) => {
  const response = await apiConnector({
    method: "POST",
    url: CREATE_SUBSCRIPTION_API,
    bodyData: body,
  });

  return response.data;
};

export const updateSubscription = async (id, body) => {
  const response = await apiConnector({
    method: "PATCH",
    url: `${UPDATE_SUBSCRIPTION_API}/${id}`,
    bodyData: body,
  });

  return response.data;
};

export const deleteSubscription = async (id) => {
  const response = await apiConnector({
    method: "DELETE",
    url: `${DELETE_SUBSCRIPTION_API}/${id}`,
  });

  return response.data;
};

export const toggleSubscriptionStatus = async (id, body) => {
  const response = await apiConnector({
    method: "PATCH",
    url: `${UPDATE_SUBSCRIPTION_STATUS_API}/${id}/status`,
    bodyData: body,
  });

  return response.data;
};
