import { useState } from "react";
import toast from "react-hot-toast";
import {
  createSubscriptionSchema,
  updateSubscriptionSchema,
} from "../../../schemas/subscription.schema";
import CustomButton from "../../common/CustomButton";
import CustomInputField from "../../common/CustomInputField";
import Icon from "../../common/Icon";
import ToggleSwitch from "../../common/ToggleSwitch";

const initialState = {
  name: "",
  description: "",
  price: "",
  durationInDays: "",
  isActive: true,
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Form Component ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const Form = ({ formData, setFormData, errors, setErrors }) => {
  function handleOnChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  return (
    <div className="border-primary rounded-lg border p-4 md:p-6">
      <div className="space-y-4">
        <CustomInputField
          label="Name"
          isMandatory={true}
          name="name"
          value={formData.name}
          onChange={handleOnChange}
          maxLength={50}
          placeholder="e.g. NEET Premium"
          error={errors.name}
          showLength
        />
        <CustomInputField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleOnChange}
          maxLength={250}
          placeholder="What does this plan include?"
          error={errors.description}
          multiline
          showLength
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CustomInputField
            label="Price"
            isMandatory={true}
            type="number"
            name="price"
            value={formData.price}
            onChange={handleOnChange}
            placeholder="e.g. 999"
            indicatorText="INR"
            error={errors.price}
          />
          <CustomInputField
            label="Duration"
            isMandatory={true}
            type="number"
            name="durationInDays"
            value={formData.durationInDays}
            onChange={handleOnChange}
            placeholder="e.g. 365"
            indicatorText="Days"
            error={errors.durationInDays}
          />
        </div>
        <ToggleSwitch
          label="Active"
          name="isActive"
          checked={formData.isActive}
          onChange={handleOnChange}
        />
      </div>
    </div>
  );
};

// Mounted only while open, so form state starts fresh every time
const ModalContent = ({ onClose, data, loading, onSubmit }) => {
  const isEditMode = !!data;

  const [formData, setFormData] = useState(() =>
    data
      ? {
          name: data.name || "",
          description: data.description || "",
          price: data.price ?? "",
          durationInDays: data.durationInDays ?? "",
          isActive: data.isActive ?? true,
        }
      : initialState,
  );
  const [errors, setErrors] = useState({});

  const handleClose = onClose;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const schema = isEditMode
      ? updateSubscriptionSchema
      : createSubscriptionSchema;
    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};

      result.error.issues.forEach((err) => {
        fieldErrors[err.path.join(".")] = err.message;
      });

      setErrors(fieldErrors);
      toast.error("Please fix the errors in the form.");

      return;
    }

    setErrors({});

    const success = await onSubmit(result.data);

    if (success) {
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      {/* Modal content box */}
      <div
        className="mx-4 w-full max-w-xl rounded-2xl bg-white p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-8 flex flex-row items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <h1 className="text-text text-xl font-semibold">
            {isEditMode ? "Edit Subscription" : "Add Subscription"}
          </h1>
          <button
            type="button"
            aria-label="Close"
            onClick={handleClose}
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
        />
        <div className="mt-8 flex flex-row items-center justify-end space-x-4 px-4">
          <CustomButton
            title={"Cancel"}
            onClick={handleClose}
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

const ManageSubscriptionModal = ({ isOpen, ...props }) => {
  if (!isOpen) {
    return null;
  }

  return <ModalContent {...props} />;
};

export default ManageSubscriptionModal;
