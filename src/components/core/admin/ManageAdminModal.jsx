import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAdmin,
  updateAdmin,
} from "../../../services/operations/adminAPI";
import CustomButton from "../../common/CustomButton";
import CustomInputField from "../../common/CustomInputField";
import Icon from "../../common/Icon";
import {
  createAdminSchema,
  updateAdminSchema,
} from "../../../schemas/user.schema";

const Form = ({ formData, setFormData, errors, setErrors, isEditMode }) => {
  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  return (
    <div className="border-primary rounded-lg border p-4 md:p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              placeholder="e.g. Password@123"
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
  );
};

// Mounted only while open, so form state starts fresh every time
const ModalContent = ({ onClose, data }) => {
  const queryClient = useQueryClient();
  const isEditMode = !!data;

  const [formData, setFormData] = useState(() =>
    data
      ? { name: data.name || "", email: data.email || "" }
      : { name: "", email: "", password: "", confirmPassword: "" },
  );
  const [errors, setErrors] = useState({});

  const onSuccess = (message) => () => {
    toast.success(message);
    queryClient.invalidateQueries({ queryKey: ["admins"] });
    onClose();
  };

  const { mutate: createAdminMutation, isPending: isCreating } = useMutation({
    mutationFn: createAdmin,
    onSuccess: onSuccess("Admin created successfully"),
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Could not create admin");
    },
  });

  const { mutate: updateAdminMutation, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, payload }) => updateAdmin(id, payload),
    onSuccess: onSuccess("Admin updated successfully"),
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Could not update admin");
    },
  });

  const loading = isCreating || isUpdating;

  const handleSubmit = () => {
    if (!isEditMode && formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    const schema = isEditMode ? updateAdminSchema : createAdminSchema;
    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // eslint-disable-next-line no-unused-vars
    const { password, confirmPassword, ...rest } = result.data;

    if (isEditMode) {
      updateAdminMutation({ id: data.id, payload: rest });
    } else {
      createAdminMutation({ ...rest, password });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-8 flex flex-row items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <h1 className="text-text text-xl font-semibold">
            {isEditMode ? "Edit Admin" : "Add Admin"}
          </h1>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="cursor-pointer rounded-full p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-700"
          >
            <Icon name="X" size={18} />
          </button>
        </div>

        <Form
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          isEditMode={isEditMode}
        />
        <div className="mt-8 flex flex-row items-center justify-end space-x-4 px-4">
          <CustomButton
            title="Cancel"
            onClick={onClose}
            className="text-primary! border-primary border bg-white"
          />
          <CustomButton
            title={isEditMode ? "Update" : "Submit"}
            disabled={loading}
            loading={loading}
            onClick={handleSubmit}
            className="bg-primary! border-primary! border"
          />
        </div>
      </div>
    </div>
  );
};

const ManageAdminModal = ({ isOpen, ...props }) => {
  if (!isOpen) return null;
  return <ModalContent {...props} />;
};

export default ManageAdminModal;
