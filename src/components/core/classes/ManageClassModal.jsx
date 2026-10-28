import { useState } from "react";
import toast from "react-hot-toast";
import {
  createClassSchema,
  updateClassSchema,
} from "../../../schemas/class.schema";
import CustomButton from "../../common/CustomButton";
import CustomInputField from "../../common/CustomInputField";
import Icon from "../../common/Icon";

const initialState = {
  name: "",
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Form Component ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const Form = ({ formData, setFormData, errors, setErrors }) => {
  function handleOnChange(event) {
    const { name, value } = event.target;
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
          placeholder="e.g. Class 11"
          error={errors.name}
          showLength
        />
      </div>
    </div>
  );
};

// Mounted only while open, so form state starts fresh every time
const ModalContent = ({ onClose, data, loading, onSubmit }) => {
  const isEditMode = !!data;

  const [formData, setFormData] = useState(() =>
    data ? { name: data.name || "" } : initialState,
  );
  const [errors, setErrors] = useState({});

  const handleClose = onClose;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const schema = isEditMode ? updateClassSchema : createClassSchema;
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
            {isEditMode ? "Edit Class" : "Add Class"}
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

const ManageClassModal = ({ isOpen, ...props }) => {
  if (!isOpen) {
    return null;
  }

  return <ModalContent {...props} />;
};

export default ManageClassModal;
