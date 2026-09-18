import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createStudent,
  updateStudent,
} from "../../../services/operations/studentAPI";
import CustomButton from "../../common/CustomButton";
import CustomInputField from "../../common/CustomInputField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { studentSchema } from "../../../schemas/user.schema";

const Form = ({ formData, setFormData, errors, setErrors }) => {
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
    </div>
  );
};

function ManageStudent() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const isEditMode = !!location.state;
  const editData = isEditMode ? location.state : null;
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    targetYear: "",
    schoolName: "",
    city: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode && editData) {
      setFormData({
        name: editData.name || "",
        phone: editData.phone || "",
        targetYear: editData.targetYear || "",
        schoolName: editData.schoolName || "",
        city: editData.city || "",
      });
    }
  }, [isEditMode, editData]);

  const { mutate: createStudentMutation, isPending: isCreating } = useMutation({
    mutationFn: createStudent,

    onSuccess: () => {
      toast.success("Student created successfully");

      queryClient.invalidateQueries({
        queryKey: ["students"],
      });

      navigate(-1);
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Could not create student");
    },
  });

  const { mutate: updateStudentMutation, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, payload }) => updateStudent(id, payload),

    onSuccess: () => {
      toast.success("Student updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["students"],
      });

      navigate(-1);
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Could not update student");
    },
  });

  const handleSubmit = async () => {
    const payload = {
      ...formData,
      targetYear: formData.targetYear ? Number(formData.targetYear) : undefined,
    };

    const result = studentSchema.safeParse(payload);

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
      updateStudentMutation({
        id: editData?.id,
        payload: result.data,
      });
    } else {
      createStudentMutation(result.data);
    }
  };

  return (
    <div>
      <div className="mb-8 text-center text-2xl font-medium text-zinc-900">
        {isEditMode ? "Edit Student" : "Add Student"}
      </div>

      <Form
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
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

export default ManageStudent;
