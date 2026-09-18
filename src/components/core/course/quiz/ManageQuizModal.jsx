import React, { useEffect, useState } from "react";
import Icon from "../../../common/Icon";
import CustomButton from "../../../common/CustomButton";
import CustomInputField from "../../../common/CustomInputField";
import Dropdown from "../../../common/Dropdown";
import ToggleSwitch from "../../../common/ToggleSwitch";
import { useDispatch, useSelector } from "react-redux";
import {
  createQuizSchema,
  updateQuizSchema,
} from "../../../../schemas/quiz.schema";
import toast from "react-hot-toast";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Form Component ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const Form = ({
  formData,
  setFormData,
  errors,
  setErrors,
  isEditMode,
  requireProgram,
  programOptions,
}) => {
  function handleOnChange(event) {
    const { name, value, type, checked } = event.target;

    if (name.startsWith("markingScheme.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        markingScheme: { ...prev.markingScheme, [key]: value },
      }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
      return;
    }

    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  return (
    <div className="rounded-xl border border-sky-500 bg-white p-4 shadow-md md:p-6">
      <div className="space-y-4">
        <CustomInputField
          label="Title"
          isMandatory={true}
          name="title"
          value={formData.title}
          onChange={handleOnChange}
          maxLength={50}
          placeholder="e.g. React Basics Quiz"
          error={errors.title}
          showLength
        />
        <CustomInputField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleOnChange}
          maxLength={100}
          showLength
          placeholder="e.g. A quiz to test your understanding of React basics."
          error={errors.description}
          multiline
        />
        {!isEditMode && requireProgram && (
          <Dropdown
            label="Program"
            isMandatory={true}
            data={programOptions}
            placeholder="Select program"
            value={formData.programId}
            onSelect={(item) => {
              setFormData((prev) => ({ ...prev, programId: item?.value || "" }));
              setErrors((prev) => ({ ...prev, programId: "" }));
            }}
            error={errors.programId}
          />
        )}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <CustomInputField
            label="Duration (in minutes)"
            name="durationInMinutes"
            value={formData.durationInMinutes}
            onChange={handleOnChange}
            placeholder="e.g. 170"
            error={errors.durationInMinutes}
            type="number"
            maxLength={4}
            isMandatory={true}
          />
          <CustomInputField
            label="Passing Marks"
            name="passingMarks"
            value={formData.passingMarks}
            onChange={handleOnChange}
            placeholder="e.g. 10"
            error={errors.passingMarks}
            type="number"
            maxLength={3}
            isMandatory={true}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <CustomInputField
            label="Correct Marks"
            name="markingScheme.correct"
            value={formData?.markingScheme?.correct}
            onChange={handleOnChange}
            type="number"
            maxLength={3}
            placeholder="e.g. 4"
            isMandatory={true}
            error={errors["markingScheme.correct"]}
          />
          <CustomInputField
            label="Wrong Marks"
            name="markingScheme.wrong"
            value={formData?.markingScheme?.wrong}
            onChange={handleOnChange}
            type="number"
            maxLength={3}
            placeholder="e.g. -1"
            isMandatory={true}
            error={errors["markingScheme.wrong"]}
          />
          <CustomInputField
            label="Skipped Marks"
            name="markingScheme.skipped"
            value={formData?.markingScheme?.skipped}
            onChange={handleOnChange}
            type="number"
            maxLength={3}
            placeholder="e.g. 0"
            isMandatory={true}
            error={errors["markingScheme.skipped"]}
          />
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
          <div className="shrink-0">
            <ToggleSwitch
              label="Allow Retake"
              name="allowRetake"
              checked={formData.allowRetake}
              onChange={handleOnChange}
            />
          </div>
          {formData.allowRetake && (
            <div className="w-full">
              <CustomInputField
                label="Max Attempts"
                name="maxAttempts"
                value={formData.maxAttempts}
                onChange={handleOnChange}
                placeholder="e.g. 3"
                error={errors.maxAttempts}
                type="number"
                maxLength={2}
                isMandatory={formData.allowRetake}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ManageQuizModal = ({
  isOpen,
  onClose,
  data,
  loading,
  onSubmit,
  requireProgram = false,
  programOptions = [],
}) => {
  const dispatch = useDispatch();
  const isEditMode = !!data;

  const initialState = {
    title: "",
    description: "",
    programId: "",
    durationInMinutes: "10",
    markingScheme: {
      correct: "4",
      wrong: "-1",
      skipped: "0",
    },
    passingMarks: "0",
    allowRetake: true,
    maxAttempts: "0",
  };

  const [formData, setFormData] = useState(initialState);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && data) {
      setFormData({
        title: data.title || "",
        description: data.description || "",
        programId:
          typeof data.programId === "object" ? data.programId?._id || "" : data.programId || "",
        durationInMinutes: data.durationInMinutes || "10",
        markingScheme: {
          correct: data.markingScheme?.correct || "4",
          wrong: data.markingScheme?.wrong || "-1",
          skipped: data.markingScheme?.skipped || "0",
        },
        passingMarks: data.passingMarks || "0",
        allowRetake: data.allowRetake,
        maxAttempts: data.maxAttempts || "0",
      });
    } else {
      setFormData(initialState);
    }
    setErrors({});
  }, [isOpen, data]);

  const handleClose = () => {
    setFormData(initialState);
    setErrors({});
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const schema = data ? updateQuizSchema : createQuizSchema;

    const result = schema.safeParse(formData);

    if (!data && requireProgram && !formData.programId) {
      setErrors((prev) => ({ ...prev, programId: "Program is required" }));
      toast.error("Please select a program.");
      return;
    }

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

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      {/* Modal content box */}
      <div
        className="mx-4 w-full max-w-3xl rounded-2xl bg-white p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-8 flex flex-row items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <h1 className="text-text text-xl font-semibold">
            {isEditMode ? "Edit Quiz" : "Add Quiz"}
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
          isEditMode={isEditMode}
          requireProgram={requireProgram}
          programOptions={programOptions}
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

export default ManageQuizModal;
