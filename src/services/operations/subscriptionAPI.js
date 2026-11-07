import { apiConnector } from "../apiconnector";
import { subscriptionPlanEndpoints } from "../apis";

const { SUBSCRIPTION_PLANS_API } = subscriptionPlanEndpoints;

// ─── Subscription Plans ─────────────────────────────────────────────────────
// Note: all prices are in paise on the API side.

export const getSubscriptionPlans = async (params) => {
  const response = await apiConnector({
    method: "GET",
    url: SUBSCRIPTION_PLANS_API,
    params,
  });

  return response.data;
};

export const getSubscriptionPlanById = async (id) => {
  const response = await apiConnector({
    method: "GET",
    url: `${SUBSCRIPTION_PLANS_API}/${id}`,
  });

  return response.data;
};

export const createSubscriptionPlan = async (body) => {
  const response = await apiConnector({
    method: "POST",
    url: SUBSCRIPTION_PLANS_API,
    bodyData: body,
  });

  return response.data;
};

export const updateSubscriptionPlan = async (id, body) => {
  const response = await apiConnector({
    method: "PATCH",
    url: `${SUBSCRIPTION_PLANS_API}/${id}`,
    bodyData: body,
  });

  return response.data;
};

// Flips isActive server-side; no body
export const toggleSubscriptionPlanStatus = async (id) => {
  const response = await apiConnector({
    method: "PATCH",
    url: `${SUBSCRIPTION_PLANS_API}/${id}/status`,
  });

  return response.data;
};

export const deleteSubscriptionPlan = async (id) => {
  const response = await apiConnector({
    method: "DELETE",
    url: `${SUBSCRIPTION_PLANS_API}/${id}`,
  });

  return response.data;
};
