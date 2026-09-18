import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllCategories } from "../services/operations/categoryAPI";
import { getAllProducts } from "../services/operations/productAPI";
import {
  getAllAddonItems,
  getAllAddons,
} from "../services/operations/addonAPI";
import {
  getAllOrders,
  getKitchenOrders,
} from "../services/operations/orderAPI";
import { getAllCoupons } from "../services/operations/couponAPI";
import {
  getAllBanners,
  getAllGalleries,
  getAppConfig,
  getCompanyProfile,
} from "../services/operations/settingAPI";
import { getAllUsers } from "../services/operations/userAPI";
import { getAllRoles } from "../services/operations/roleAPI";

export default function useInitialData() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  

  useEffect(() => {
    if (token) {
      dispatch(getAllCategories(token));
      dispatch(getAllProducts(token));
      dispatch(getAllAddons(token));
      dispatch(getAllAddonItems(token));

      dispatch(getAllOrders(token));
      dispatch(getKitchenOrders(token));

      dispatch(getAllCoupons(token));

      dispatch(getAppConfig(token));
      dispatch(getCompanyProfile(token));

      dispatch(getAllBanners(token));
      dispatch(getAllGalleries(token));

      dispatch(getAllUsers(token));
      dispatch(getAllRoles(token));
    }
  }, [token]);

  return null;
}
