import { useState } from "react";
import toast from "react-hot-toast";
import {
  subscriptionPlanSchema,
  toRupees,
} from "../../../schemas/subscription.schema";
import CustomButton from "../../common/CustomButton";
import CustomDatePicker from "../../common/CustomDatePicker";
import CustomInputField from "../../common/CustomInputField";
import FilterTabs from "../../common/FilterTabs";
import Icon from "../../common/Icon";

const initialState = {
  name: "",
  description: "",
  price: "",
  originalPrice: "",
  validityType: "DURATION",
  durationDays: "",
  expiresAt: null,
  offerValidTill: null,
  features: "",
  order: 0,
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

  function setField(name, value) {
    setFormData((prev) => ({ ...prev, [name]: value }));
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
            placeholder="e.g. 499"
            indicatorText="INR"
            error={errors.price}
          />
          <CustomInputField
            label="Original Price"
            type="number"
            name="originalPrice"
            value={formData.originalPrice}
            onChange={handleOnChange}
            placeholder="e.g. 999 (shown struck-through)"
            indicatorText="INR"
            error={errors.originalPrice}
          />
          <CustomInputField
            label="Display Order"
            type="number"
            name="order"
            value={formData.order}
            onChange={handleOnChange}
            placeholder="e.g. 0"
            error={errors.order}
          />
          <CustomDatePicker
            label="Offer Valid Till"
            value={formData.offerValidTill}
            onChange={(date) =>
              setField("offerValidTill", date ? date.toDate() : null)
            }
            minDate={new Date()}
            placeholder="No offer deadline"
            error={errors.offerValidTill}
          />
        </div>

        {/* Validity */}
        <div>
          <div className="mb-2 text-sm font-medium text-gray-700">
            Validity <span className="text-red-500">*</span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <FilterTabs
              options={[
                { value: "DURATION", label: "Duration" },
                { value: "FIXED_DATE", label: "Fixed Date" },
              ]}
              selectedFilter={formData.validityType}
              onFilterChange={(value) => setField("validityType", value)}
            />
            <div className="min-w-0 flex-1">
              {formData.validityType === "DURATION" ? (
                <CustomInputField
                  type="number"
                  name="durationDays"
                  value={formData.durationDays}
                  onChange={handleOnChange}
                  placeholder="e.g. 365"
                  indicatorText="Days"
                  error={errors.durationDays}
                />
              ) : (
                <CustomDatePicker
                  value={formData.expiresAt}
                  onChange={(date) =>
                    setField("expiresAt", date ? date.toDate() : null)
                  }
                  minDate={new Date()}
                  placeholder="Plan expires on"
                  error={errors.expiresAt}
                />
              )}
            </div>
          </div>
        </div>
        <CustomInputField
          label="Features (one per line)"
          name="features"
          value={formData.features}
          onChange={handleOnChange}
          placeholder={"Audio lectures\nTest series"}
          error={errors.features}
          multiline
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
          price: data.price != null ? toRupees(data.price) : "",
          originalPrice:
            data.originalPrice != null ? toRupees(data.originalPrice) : "",
          validityType: data.validityType || "DURATION",
          durationDays: data.durationDays ?? "",
          expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
          offerValidTill: data.offerValidTill
            ? new Date(data.offerValidTill)
            : null,
          features: (data.features || []).join("\n"),
          order: data.order ?? 0,
        }
      : initialState,
  );
  const [errors, setErrors] = useState({});

  const handleClose = onClose;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = subscriptionPlanSchema.safeParse({
      ...formData,
      features: formData.features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
    });

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
        className="mx-4 max-h-[95vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex flex-row items-center justify-between gap-4 border-b border-gray-200 pb-4 sm:mb-8">
          <h1 className="text-text text-xl font-semibold">
            {isEditMode ? "Edit Plan" : "Add Plan"}
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

        <div>
          <Form
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
          />
        </div>
        <div className="mt-4 flex sm:mt-8 flex-row items-center justify-end space-x-4 px-4">
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

const ManagePlanModal = ({ isOpen, ...props }) => {
  if (!isOpen) {
    return null;
  }

  return <ModalContent {...props} />;
};

export default ManagePlanModal;
