import { useState } from "react";
import toast from "react-hot-toast";
import { quizQuestionSchema } from "../../../../schemas/quizQuestion.schema";
import { normalizeMarkdown } from "../../../../utils/markdown";
import CustomButton from "../../../common/CustomButton";
import FileDropzone from "../../../common/FileDropzone";
import Icon from "../../../common/Icon";
import MarkdownEditor from "../../../common/MarkdownEditor";
import Radio from "../../../common/Radio";

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 6;
const MAX_IMAGE_SIZE_MB = 5;
// Defined once so the dropzone doesn't see a new object every render
const IMAGE_ACCEPT = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

const newOption = () => ({
  text: "",
  isCorrect: false,
  imageUrl: null,
  imageFile: null,
});

const emptyOptions = () => Array.from({ length: 4 }, newOption);

// Turn a saved question into editable form state
const toFormState = (question) => ({
  question: normalizeMarkdown(question?.question ?? ""),
  explanation: normalizeMarkdown(question?.explanation ?? ""),
  options: question?.options?.length
    ? question.options.map(({ id, text, isCorrect, imageUrl }) => ({
        id,
        text: normalizeMarkdown(text),
        isCorrect,
        imageUrl: imageUrl ?? null,
        imageFile: null,
      }))
    : emptyOptions(),
  image: null,
  explanationImageUrl: question?.explanationImageUrl ?? null,
  explanationImage: null,
});

// Saved images are referenced by option id; a cleared one is flagged for removal
const toPayload = ({
  question,
  explanation,
  options,
  explanationImageUrl,
  explanationImage,
}, saved) => ({
  question,
  explanation: explanation.trim() || null,
  options: options.map(({ id, text, isCorrect, imageUrl, imageFile }) => {
    const hadImage = !!saved?.options?.find((o) => o.id === id)?.imageUrl;
    return {
      ...(id && { id }),
      text,
      isCorrect,
      ...(hadImage && !imageUrl && !imageFile && { removeImage: true }),
      hasImage: !!(imageUrl || imageFile),
    };
  }),
  ...(saved?.explanationImageUrl &&
    !explanationImageUrl &&
    !explanationImage && { removeExplanationImage: true }),
});

// Compact image picker with a remove control, shared by options and explanation
const ImageField = ({ label, file, url, onChange, onRemove }) => (
  <div className="mt-2 space-y-1">
    <FileDropzone
      label={label}
      // A freshly picked file wins; otherwise show the saved image
      value={file || url}
      onChange={onChange}
      accept={IMAGE_ACCEPT}
      maxFileSize={MAX_IMAGE_SIZE_MB}
      helperText={`JPG, PNG or WEBP, up to ${MAX_IMAGE_SIZE_MB}MB`}
      invalidTypeMessage="Only JPG, PNG and WEBP images are allowed"
    />
    {(file || url) && (
      <button
        type="button"
        onClick={onRemove}
        className="text-error cursor-pointer text-xs font-semibold hover:underline"
      >
        Remove image
      </button>
    )}
  </div>
);

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
      options: [...prev.options, newOption()],
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

    const payload = toPayload(formData, question);
    const result = quizQuestionSchema.safeParse(payload);
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
    // hasImage only drives validation; the backend doesn't take it.
    // The schema strips removeExplanationImage, so carry it over from payload
    const body = {
      ...result.data,
      options: result.data.options.map((option) => {
        const { hasImage, ...rest } = option; // eslint-disable-line no-unused-vars
        return rest;
      }),
      ...(payload.removeExplanationImage && { removeExplanationImage: true }),
    };
    const optionImages = Object.fromEntries(
      formData.options
        .map((option, index) => [index, option.imageFile])
        .filter(([, file]) => file),
    );
    const success = await onSubmit(body, {
      image: formData.image,
      explanationImage: formData.explanationImage,
      optionImages,
    });
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
          <MarkdownEditor
            label="Question"
            isMandatory={true}
            value={formData.question}
            onChange={(value) => setField("question", value)}
            placeholder="Type the question. Use $x^2$ for formulas, $$...$$ for block formulas, and | pipes | for tables."
            error={errors.question}
          />

          <FileDropzone
            label="Question Image"
            // A freshly picked file wins; otherwise show the saved image
            value={formData.image || question?.imageUrl}
            onChange={(file) => setField("image", file)}
            accept={IMAGE_ACCEPT}
            maxFileSize={MAX_IMAGE_SIZE_MB}
            helperText={`JPG, PNG or WEBP, up to ${MAX_IMAGE_SIZE_MB}MB`}
            invalidTypeMessage="Only JPG, PNG and WEBP images are allowed"
            error={errors.image}
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
              <p className="text-error text-xs">{errors.options}</p>
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
                  <MarkdownEditor
                    value={option.text}
                    onChange={(text) => updateOption(index, { text })}
                    placeholder={`${String.fromCharCode(65 + index)}.`}
                    error={errors[`options.${index}`]}
                    height={90}
                    hideToolbar
                  />
                  <ImageField
                    label={`Option ${String.fromCharCode(65 + index)} Image`}
                    file={option.imageFile}
                    url={option.imageUrl}
                    onChange={(imageFile) => updateOption(index, { imageFile })}
                    onRemove={() =>
                      updateOption(index, { imageFile: null, imageUrl: null })
                    }
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

          <MarkdownEditor
            label="Explanation"
            value={formData.explanation}
            onChange={(value) => setField("explanation", value)}
            placeholder="Why the answer is correct (optional)"
            error={errors.explanation}
            height={160}
          />
          <ImageField
            label="Explanation Image"
            file={formData.explanationImage}
            url={formData.explanationImageUrl}
            onChange={(file) => setField("explanationImage", file)}
            onRemove={() =>
              setFormData((prev) => ({
                ...prev,
                explanationImage: null,
                explanationImageUrl: null,
              }))
            }
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
