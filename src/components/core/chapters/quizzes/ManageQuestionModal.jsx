import { useState } from "react";
import toast from "react-hot-toast";
import { quizQuestionSchema } from "../../../../schemas/quizQuestion.schema";
import CustomButton from "../../../common/CustomButton";
import CustomInputField from "../../../common/CustomInputField";
import Icon from "../../../common/Icon";
import Radio from "../../../common/Radio";

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 6;

const emptyOptions = () =>
  Array.from({ length: 4 }, () => ({ text: "", isCorrect: false }));

// Turn a saved question into editable form state
const toFormState = (question) => ({
  question: question?.question ?? "",
  explanation: question?.explanation ?? "",
  options: question?.options?.length
    ? question.options.map(({ text, isCorrect }) => ({ text, isCorrect }))
    : emptyOptions(),
});

const toPayload = ({ question, explanation, options }) => ({
  question,
  explanation: explanation.trim() || null,
  options,
});

// Map zod paths onto the fields the form actually shows
const fieldForPath = ([root, index]) =>
  root === "options" && index !== undefined ? `options.${index}` : root;

const ModalContent = ({ onClose, loading, onSubmit, question }) => {
  const isEdit = !!question;
  const [formData, setFormData] = useState(() => toFormState(question));
  const [errors, setErrors] = useState({});

  const setField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleOnChange = (event) =>
    setField(event.target.name, event.target.value);

  const updateOption = (index, changes) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((option, i) =>
        i === index ? { ...option, ...changes } : option,
      ),
    }));
    setErrors((prev) => ({ ...prev, options: "", [`options.${index}`]: "" }));
  };

  const markCorrect = (index) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((option, i) => ({
        ...option,
        isCorrect: i === index,
      })),
    }));
    setErrors((prev) => ({ ...prev, options: "" }));
  };

  const addOption = () =>
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, { text: "", isCorrect: false }],
    }));

  const removeOption = (index) => {
    if (formData.options.length <= MIN_OPTIONS) {
      toast.error(`A question must have at least ${MIN_OPTIONS} options.`);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = quizQuestionSchema.safeParse(toPayload(formData));
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((err) => {
        const field = fieldForPath(err.path);
        fieldErrors[field] ??= err.message;
      });
      setErrors(fieldErrors);
      toast.error("Please fix the errors in the form.");
      return;
    }

    setErrors({});
    const success = await onSubmit(result.data);
    if (success) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={loading ? undefined : onClose}
    >
      <div
        className="mx-4 max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex flex-row items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <h1 className="text-text text-xl font-semibold">
            {isEdit ? "Edit Question" : "Add Question"}
          </h1>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer rounded-full p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-700"
          >
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="border-primary space-y-5 rounded-lg border p-4 md:p-6">
          <CustomInputField
            label="Question"
            isMandatory={true}
            name="question"
            multiline
            value={formData.question}
            onChange={handleOnChange}
            placeholder="Type the question"
            error={errors.question}
          />

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-text text-sm font-medium">
                Options <span className="text-error">*</span> (Select the
                correct one)
              </p>
              {formData.options.length < MAX_OPTIONS && (
                <button
                  type="button"
                  onClick={addOption}
                  className="text-primary cursor-pointer text-sm font-semibold hover:underline"
                >
                  + Add Option
                </button>
              )}
            </div>
            {errors.options && (
              <p className="text-xs text-red-500">{errors.options}</p>
            )}

            {formData.options.map((option, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="pt-2">
                  <Radio
                    checked={option.isCorrect}
                    onChange={() => markCorrect(index)}
                  />
                </div>
                <div className="flex-1">
                  <CustomInputField
                    value={option.text}
                    onChange={(e) =>
                      updateOption(index, { text: e.target.value })
                    }
                    placeholder={`${String.fromCharCode(65 + index)}.`}
                    error={errors[`options.${index}`]}
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
            multiline
            value={formData.explanation}
            onChange={handleOnChange}
            placeholder="Why the answer is correct (optional)"
            error={errors.explanation}
          />
        </div>

        <div className="mt-8 flex flex-row items-center justify-end space-x-4 px-4">
          <CustomButton
            title="Cancel"
            onClick={onClose}
            disabled={loading}
            className="text-primary! border-primary border bg-white"
          />
          <CustomButton
            title={isEdit ? "Update" : "Add"}
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

// Mounted only while open, so form state starts fresh every time
const ManageQuestionModal = ({ isOpen, ...props }) => {
  if (!isOpen) return null;
  return <ModalContent {...props} />;
};

export default ManageQuestionModal;
