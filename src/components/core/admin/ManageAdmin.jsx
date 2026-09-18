import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createAdmin,
  updateAdmin,
} from "../../../services/operations/adminAPI";
import CustomButton from "../../common/CustomButton";
import CustomInputField from "../../common/CustomInputField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAdminSchema, updateAdminSchema } from "../../../schemas/user.schema";

const Form = ({ formData, setFormData, errors, setErrors, isEditMode }) => {
  const handleOnChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4">
      <div className="border-primary rounded-lg border p-4 md:p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <CustomInputField
            label="Name"
            isMandatory={true}
            name="name"
            value={formData.name}
            onChange={handleOnChange}
            maxLength={100}
            placeholder="e.g. John Smith"
            error={errors.name}
          />
          <CustomInputField
            label="Email"
            isMandatory={true}
            name="email"
            value={formData.email}
            onChange={handleOnChange}
            maxLength={100}
            placeholder="e.g. admin@example.com"
            error={errors.email}
            type="email"
          />
          {!isEditMode && (
            <>
              <CustomInputField
                label="Password"
                isMandatory={true}
                name="password"
                value={formData.password}
                onChange={handleOnChange}
                maxLength={100}
                placeholder={"e.g. Password@123"}
                error={errors.password}
                secureTextEntry={true}
              />
              <CustomInputField
                label="Confirm Password"
                isMandatory={true}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleOnChange}
                maxLength={100}
                placeholder="Re-enter password"
                error={errors.confirmPassword}
                secureTextEntry={true}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

function ManageAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const isEditMode = !!location.state;
  const editData = isEditMode ? location.state : null;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode && editData) {
      setFormData({
        name: editData.name || "",
        email: editData.email || "",
      });
    }
  }, [isEditMode, editData]);

  const { mutate: createAdminMutation, isPending: isCreating } = useMutation({
    mutationFn: createAdmin,

    onSuccess: () => {
      toast.success("Admin created successfully");

      queryClient.invalidateQueries({
        queryKey: ["admins"],
      });

      navigate(-1);
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Could not create admin");
    },
  });

  const { mutate: updateAdminMutation, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, payload }) => updateAdmin(id, payload),

    onSuccess: () => {
      toast.success("Admin updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["admins"],
      });

      navigate(-1);
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Could not update admin");
    },
  });

  const handleSubmit = async () => {
    const payload = {
      ...formData,
    };

    if (!isEditMode && payload.password !== payload.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    const schema = isEditMode ? updateAdminSchema : createAdminSchema;
    const result = schema.safeParse(payload);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];

        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    if (isEditMode) {
      const cleanPayload = {
        ...result.data,
      };

      delete cleanPayload.password;
      delete cleanPayload.confirmPassword;

      updateAdminMutation({
        id: editData?.id,
        payload: cleanPayload,
      });
    } else {
      const { confirmPassword, ...adminPayload } = result.data;
      createAdminMutation(adminPayload);
    }
  };

  return (
    <div>
      <div className="mb-8 text-center text-2xl font-medium text-zinc-900">
        {isEditMode ? "Edit Admin" : "Add Admin"}
      </div>

      <Form
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        isEditMode={isEditMode}
      />
      <div className="mx-auto mt-8 flex max-w-4xl flex-row items-center justify-center space-x-4 px-4">
        <CustomButton
          title="Cancel"
          onClick={() => navigate(-1)}
          className="text-primary! border-primary flex-1 border bg-transparent py-3"
        />
        <CustomButton
          title={isEditMode ? "Update" : "Submit"}
          disabled={isUpdating || isCreating}
          loading={isUpdating || isCreating}
          onClick={handleSubmit}
          className="bg-primary! border-primary! flex-1 border py-3"
        />
      </div>
    </div>
  );
}

export default ManageAdmin;
