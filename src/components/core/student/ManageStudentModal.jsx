import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createStudent,
  updateStudent,
} from "../../../services/operations/studentAPI";
import CustomButton from "../../common/CustomButton";
import CustomInputField from "../../common/CustomInputField";
import Icon from "../../common/Icon";
import { studentSchema } from "../../../schemas/user.schema";

const Form = ({ formData, setFormData, errors, setErrors }) => {
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
          label="Phone"
          isMandatory={true}
          name="phone"
          value={formData.phone}
          onChange={handleOnChange}
          maxLength={10}
          placeholder="e.g. 7079476635"
          error={errors.phone}
          type="tel"
        />
        <CustomInputField
          label="Target Year"
          name="targetYear"
          value={formData.targetYear}
          onChange={handleOnChange}
          maxLength={4}
          placeholder="e.g. 2025"
          error={errors.targetYear}
          type="number"
        />
        <CustomInputField
          label="School Name"
          name="schoolName"
          value={formData.schoolName}
          onChange={handleOnChange}
          maxLength={100}
          placeholder="e.g. ABC School"
          error={errors.schoolName}
        />
        <CustomInputField
          label="City"
          name="city"
          value={formData.city}
          onChange={handleOnChange}
          maxLength={100}
          placeholder="e.g. New York"
          error={errors.city}
        />
      </div>
    </div>
  );
};

// Mounted only while open, so form state starts fresh every time
const ModalContent = ({ onClose, data }) => {
  const queryClient = useQueryClient();
  const isEditMode = !!data;

  const [formData, setFormData] = useState(() => ({
    name: data?.name || "",
    phone: data?.phone || "",
    targetYear: data?.targetYear || "",
    schoolName: data?.schoolName || "",
    city: data?.city || "",
  }));
  const [errors, setErrors] = useState({});

  const onSuccess = (message) => () => {
    toast.success(message);
    queryClient.invalidateQueries({ queryKey: ["students"] });
    onClose();
  };

  const { mutate: createStudentMutation, isPending: isCreating } = useMutation({
    mutationFn: createStudent,
    onSuccess: onSuccess("Student created successfully"),
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Could not create student");
    },
  });

  const { mutate: updateStudentMutation, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, payload }) => updateStudent(id, payload),
    onSuccess: onSuccess("Student updated successfully"),
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Could not update student");
    },
  });

  const loading = isCreating || isUpdating;

  const handleSubmit = () => {
    const result = studentSchema.safeParse({
      ...formData,
      targetYear: formData.targetYear ? Number(formData.targetYear) : undefined,
    });

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (isEditMode) {
      updateStudentMutation({ id: data.id, payload: result.data });
    } else {
      createStudentMutation(result.data);
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
            {isEditMode ? "Edit Student" : "Add Student"}
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

const ManageStudentModal = ({ isOpen, ...props }) => {
  if (!isOpen) return null;
  return <ModalContent {...props} />;
};

export default ManageStudentModal;
