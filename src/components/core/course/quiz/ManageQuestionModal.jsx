import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  createQuestionSchema,
  updateQuestionSchema,
} from "../../../../schemas/question.schema";
import CheckBox from "../../../common/CheckBox";
import CustomButton from "../../../common/CustomButton";
import CustomInputField from "../../../common/CustomInputField";
import Icon from "../../../common/Icon";
import Radio from "../../../common/Radio";
import FileDropzone from "../../../common/FileDropzone";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Form Component ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const Form = ({ formData, setFormData, errors, setErrors }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index].text = value;
    setFormData((prev) => ({ ...prev, options: newOptions }));
    setErrors((prev) => ({ ...prev, [`options.${index}.text`]: "" }));
  };

  const toggleCorrectAnswer = (index) => {
    let updatedAnswers = [];
    if (formData.type === "single") {
      // For single choice, only one can be active
      updatedAnswers = [index];
    } else {
      // For multiple choice (if you expand later)
      updatedAnswers = formData.correctAnswers.includes(index)
        ? formData.correctAnswers.filter((i) => i !== index)
        : [...formData.correctAnswers, index];
    }
    setFormData((prev) => ({ ...prev, correctAnswers: updatedAnswers }));
    setErrors((prev) => ({ ...prev, correctAnswers: "" }));
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, { text: "", image: null }],
    }));
  };

  const removeOption = (index) => {
    if (formData.options.length <= 2) {
      toast.error("A question must have at least 2 options.");
      return;
    }
    const newOptions = formData.options.filter((_, i) => i !== index);
    // Reset correct answers if the removed index was selected
    setFormData((prev) => ({
      ...prev,
      options: newOptions,
      correctAnswers: [],
    }));
  };

  return (
    <div className="max-h-[60vh] overflow-y-auto rounded-xl border border-sky-500 bg-white p-4 shadow-md md:p-6">
      <div className="space-y-6">
        <CustomInputField
          label="Question Text"
          isMandatory={true}
          name="questionText"
          value={formData.questionText}
          onChange={handleInputChange}
          placeholder="e.g. Which method converts a JSON string..."
          error={errors.questionText}
          multiline
        />

        <FileDropzone
          label="Question Image (Optional)"
          value={formData.questionImage}
          error={errors.questionImage}
          onChange={(file) => {
            setFormData((prev) => ({ ...prev, questionImage: file }));
            setErrors((prev) => ({ ...prev, questionText: "", questionImage: "" }));
          }}
          accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
          maxFileSize={5}
        />

        <div>
          <p className="text-text mb-2 text-sm font-medium">Question Type</p>
          <div className="flex gap-4">
            <div
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  type: "single",
                  correctAnswers: [],
                }));
              }}
              className="flex cursor-pointer items-center gap-2"
            >
              <Radio checked={formData.type === "single"} />
              <span className="text-sm font-medium">Single Choice</span>
            </div>

            <div
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  type: "multi",
                  correctAnswers: [],
                }));
              }}
              className="flex cursor-pointer items-center gap-2"
            >
              <Radio checked={formData.type === "multi"} />
              <span className="text-sm font-medium">Multiple Choice</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-text text-sm font-medium">
              Options (Select the correct one)
            </p>
            <button
              type="button"
              onClick={addOption}
              className="text-primary cursor-pointer text-sm font-semibold hover:underline"
            >
              + Add Option
            </button>
          </div>
          {errors.correctAnswers && (
            <p className="text-xs text-red-500">{errors.correctAnswers}</p>
          )}

          {formData.options.map((option, index) => (
            <div key={index} className="mb-14 flex items-start gap-3">
              <div className="pt-2">
                {formData.type === "single" ? (
                  <Radio
                    checked={formData.correctAnswers.includes(index)}
                    onChange={() => toggleCorrectAnswer(index)}
                  />
                ) : (
                  <CheckBox
                    checked={formData.correctAnswers.includes(index)}
                    onChange={() => toggleCorrectAnswer(index)}
                  />
                )}
              </div>
              <div className="flex-1 space-y-4">
                <CustomInputField
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`${String.fromCharCode(65 + index)}.`}
                  error={errors[`options.${index}.text`]}
                />

                <FileDropzone
                  label="Option Image (Optional)"
                  value={option.image}
                  error={errors[`options.${index}.image`]}
                  onChange={(file) => {
                    const newOptions = [...formData.options];
                    newOptions[index].image = file;
                    setFormData((prev) => ({ ...prev, options: newOptions }));
                    setErrors((prev) => ({ 
                      ...prev, 
                      [`options.${index}.text`]: "",
                      [`options.${index}.image`]: "" 
                    }));
                  }}
                  accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
                  helperText="Max 2MB"
                  maxFileSize={2}
                />
              </div>
              <button
                type="button"
                onClick={() => removeOption(index)}
                className="group cursor-pointer rounded-full p-2 text-red-400 transition hover:bg-red-50"
                title="Remove Option"
              >
                <Icon
                  name="Trash"
                  size={18}
                  className="group-hover:text-red-500"
                />
              </button>
            </div>
          ))}
        </div>

        <CustomInputField
          label="Explanation"
          name="explanation"
          value={formData.explanation}
          onChange={handleInputChange}
          placeholder="Explain why this answer is correct..."
          error={errors.explanation}
          multiline
        />
      </div>
    </div>
  );
};

const ManageQuestionModal = ({
  isOpen,
  onClose,
  loading,
  onSubmit,
  editData,
}) => {
  const initialState = {
    questionText: "",
    type: "single",
    options: [
      { text: "", image: null },
      { text: "", image: null },
      { text: "", image: null },
      { text: "", image: null },
    ],
    correctAnswers: [],
    explanation: "",
    questionImage: null,
  };

  const [formData, setFormData] = useState(initialState);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && editData) {
      const correctIndices = editData.options
        .map((opt, i) => (editData.correctAnswers.includes(opt._id) ? i : -1))
        .filter((i) => i !== -1);

      setFormData({
        questionText: editData.questionText || "",
        type: editData.type || "single",
        options: editData.options.map((opt) => ({
          text: opt.text,
          _id: opt._id,
          image: opt.image?.url || null,
        })),
        correctAnswers: correctIndices,
        explanation: editData.explanation || "",
        questionImage: editData.questionImage?.url || null,
      });
    } else {
      setFormData(initialState);
    }
    setErrors({});
  }, [isOpen, editData]);

  const handleClose = () => {
    setFormData(initialState);
    setErrors({});
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const schema = editData ? updateQuestionSchema : createQuestionSchema;

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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="mx-4 w-full max-w-3xl rounded-2xl bg-white p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex flex-row items-center justify-between border-b border-gray-200 pb-4">
          <h1 className="text-xl font-semibold text-gray-800">
            {editData ? "Edit Question" : "Add New Question"}
          </h1>
          <button
            onClick={handleClose}
            type="button"
            className="cursor-pointer rounded-full p-2 hover:bg-gray-100"
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

        <div className="mt-8 flex justify-end space-x-4">
          <CustomButton
            title={"Cancel"}
            onClick={handleClose}
            className="!text-primary border-primary border bg-white"
          />
          <CustomButton
            title={editData ? "Update Question" : "Save Question"}
            disabled={loading}
            loading={loading}
            onClick={handleSubmit}
            className="!bg-primary !border-primary border"
          />
        </div>
      </div>
    </div>
  );
};

export default ManageQuestionModal;
