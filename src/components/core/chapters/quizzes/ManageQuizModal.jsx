import { useState } from "react";
import toast from "react-hot-toast";
import {
  createChapterQuizSchema,
  updateChapterQuizSchema,
} from "../../../../schemas/chapterQuiz.schema";
import CustomButton from "../../../common/CustomButton";
import CustomInputField from "../../../common/CustomInputField";
import Icon from "../../../common/Icon";

const initialState = {
  title: "",
  description: "",
  durationMinutes: "",
  correctMarks: "4",
  wrongMarks: "-1",
  skippedMarks: "0",
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Form Component ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const Form = ({ formData, setFormData, errors, setErrors, isEdit }) => {
  function handleOnChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  return (
    <div className="border-primary rounded-lg border p-4 md:p-6">
      <div className="space-y-4">
        {/* New quizzes take the chapter name; it can be renamed later */}
        {isEdit && (
          <CustomInputField
            label="Title"
            isMandatory={true}
            name="title"
            value={formData.title}
            onChange={handleOnChange}
            maxLength={100}
            placeholder="e.g. Cell Structure Practice"
            error={errors.title}
            showLength
          />
        )}
        <CustomInputField
          label="Description"
          name="description"
          multiline
          value={formData.description}
          onChange={handleOnChange}
          maxLength={500}
          placeholder="What this quiz covers"
          error={errors.description}
          showLength
        />
        <CustomInputField
          label="Duration (minutes)"
          name="durationMinutes"
          type="number"
          value={formData.durationMinutes}
          onChange={handleOnChange}
          placeholder="Leave empty for no time limit"
          error={errors.durationMinutes}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <CustomInputField
            label="Correct"
            isMandatory={true}
            name="correctMarks"
            type="number"
            value={formData.correctMarks}
            onChange={handleOnChange}
            error={errors.correctMarks}
          />
          <CustomInputField
            label="Wrong"
            isMandatory={true}
            name="wrongMarks"
            type="number"
            value={formData.wrongMarks}
            onChange={handleOnChange}
            error={errors.wrongMarks}
          />
          <CustomInputField
            label="Skipped"
            isMandatory={true}
            name="skippedMarks"
            type="number"
            value={formData.skippedMarks}
            onChange={handleOnChange}
            error={errors.skippedMarks}
          />
        </div>
      </div>
    </div>
  );
};

// Mounted only while open, so form state starts fresh every time
const ModalContent = ({
  onClose,
  chapterId,
  chapterName,
  loading,
  onSubmit,
  quiz,
}) => {
  const isEdit = !!quiz;
  const [formData, setFormData] = useState(
    isEdit
      ? {
          title: quiz.title ?? "",
          description: quiz.description ?? "",
          durationMinutes:
            quiz.durationMinutes != null ? String(quiz.durationMinutes) : "",
          correctMarks: String(quiz.correctMarks ?? 4),
          wrongMarks: String(quiz.wrongMarks ?? -1),
          skippedMarks: String(quiz.skippedMarks ?? 0),
        }
      : { ...initialState, title: chapterName ?? "" },
  );
  const [errors, setErrors] = useState({});

  const handleClose = onClose;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { description, durationMinutes, ...rest } = formData;
    const payload = {
      ...rest,
      // Empty fields are treated as not provided; an edit sends "" to clear
      description: isEdit
        ? description.trim()
        : description.trim() || undefined,
      durationMinutes: durationMinutes === "" ? undefined : durationMinutes,
    };
    const result = isEdit
      ? updateChapterQuizSchema.safeParse(payload)
      : createChapterQuizSchema.safeParse({ ...payload, chapterId });

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
      onClick={loading ? undefined : handleClose}
    >
      {/* Modal content box */}
      <div
        className="mx-4 max-h-[95vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-8 flex flex-row items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <h1 className="text-text text-xl font-semibold">
            {isEdit ? "Edit Quiz" : "Add Quiz"}
          </h1>
          <button
            type="button"
            aria-label="Close"
            onClick={handleClose}
            disabled={loading}
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
          isEdit={isEdit}
        />
        <div className="mt-8 flex flex-row items-center justify-end space-x-4 px-4">
          <CustomButton
            title={"Cancel"}
            onClick={handleClose}
            disabled={loading}
            className="text-primary! border-primary border bg-white"
          />
          <CustomButton
            title={isEdit ? "Update" : "Create"}
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

const ManageQuizModal = ({ isOpen, ...props }) => {
  if (!isOpen) {
    return null;
  }

  return <ModalContent {...props} />;
};

export default ManageQuizModal;
