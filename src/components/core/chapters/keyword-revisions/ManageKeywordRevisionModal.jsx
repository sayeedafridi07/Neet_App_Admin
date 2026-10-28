import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  createKeywordRevisionSchema,
  updateKeywordRevisionSchema,
} from "../../../../schemas/keywordRevision.schema";
import CustomButton from "../../../common/CustomButton";
import CustomInputField from "../../../common/CustomInputField";
import FileDropzone from "../../../common/FileDropzone";
import Icon from "../../../common/Icon";
import MiniAudioPlayer from "../../../common/players/MiniAudioPlayer";

// Keyword revisions are short clips
const MAX_AUDIO_SIZE_MB = 20;
const MAX_IMAGE_SIZE_MB = 5;
// Defined once so the dropzone doesn't see a new object every render
const IMAGE_ACCEPT = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

const initialState = {
  title: "",
  description: "",
  order: "1",
  duration: "",
  audio: null,
  image: null,
};

// The API expects duration in seconds, so read it from the file's metadata
const getFileDuration = (file) =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    audio.preload = "metadata";
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(
        Number.isFinite(audio.duration) ? Math.round(audio.duration) : null,
      );
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    audio.src = url;
  });

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Form Component ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const Form = ({
  formData,
  setFormData,
  errors,
  setErrors,
  isEdit,
  existingAudioUrl,
  existingImageUrl,
}) => {
  // Preview the newly picked file; fall back to the saved audio when editing
  const previewUrl = useMemo(
    () => (formData.audio ? URL.createObjectURL(formData.audio) : null),
    [formData.audio],
  );
  useEffect(() => {
    if (previewUrl) return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);
  const playerSrc =
    previewUrl || (formData.existingRemoved ? null : existingAudioUrl);

  function handleOnChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  return (
    <div className="border-primary rounded-lg border p-4 md:p-6">
      <div className="space-y-4">
        {/* Show either the player or the picker, never both */}
        {playerSrc ? (
          <div>
            <p className="text-text mb-2 text-sm font-medium">
              Audio File{!isEdit && <span className="text-error"> *</span>}
            </p>
            <MiniAudioPlayer
              // Remount resets playback when a different file is picked
              key={playerSrc}
              src={playerSrc}
              title={formData.audio?.name || formData.title || "Current audio"}
              subtitle={
                formData.audio
                  ? `${(formData.audio.size / (1024 * 1024)).toFixed(2)} MB`
                  : "Current audio"
              }
              onRemove={() =>
                setFormData((prev) => ({
                  ...prev,
                  audio: null,
                  duration: "",
                  existingRemoved: true,
                }))
              }
            />
          </div>
        ) : (
          <FileDropzone
            label="Audio File"
            required
            value={formData.audio}
            onChange={async (file) => {
              setFormData((prev) => ({
                ...prev,
                audio: file,
                duration: "",
              }));
              setErrors((prev) => ({ ...prev, audio: "", duration: "" }));
              if (!file) return;

              const duration = await getFileDuration(file);
              // Ignore the result if another file was picked meanwhile
              setFormData((prev) =>
                prev.audio === file
                  ? { ...prev, duration: duration ? String(duration) : "" }
                  : prev,
              );
            }}
            accept={{
              "audio/mpeg": [".mp3"],
              "audio/mp4": [".m4a"],
              "audio/x-m4a": [".m4a"],
            }}
            maxFileSize={MAX_AUDIO_SIZE_MB}
            helperText={`MP3 or M4A, up to ${MAX_AUDIO_SIZE_MB}MB`}
            invalidTypeMessage="Only MP3 and M4A files are allowed"
            error={errors.audio}
          />
        )}
        <FileDropzone
          label="Cover Image"
          // A freshly picked file wins; otherwise show the saved image
          value={formData.image || existingImageUrl}
          onChange={(file) => {
            setFormData((prev) => ({ ...prev, image: file }));
            setErrors((prev) => ({ ...prev, image: "" }));
          }}
          accept={IMAGE_ACCEPT}
          maxFileSize={MAX_IMAGE_SIZE_MB}
          helperText={`JPG, PNG or WEBP, up to ${MAX_IMAGE_SIZE_MB}MB`}
          invalidTypeMessage="Only JPG, PNG and WEBP images are allowed"
          error={errors.image}
        />
        <CustomInputField
          label="Title"
          isMandatory={true}
          name="title"
          value={formData.title}
          onChange={handleOnChange}
          maxLength={100}
          placeholder="e.g. Mitochondria"
          error={errors.title}
          showLength
        />
        <CustomInputField
          label="Description"
          name="description"
          multiline
          value={formData.description}
          onChange={handleOnChange}
          maxLength={500}
          placeholder="Keywords covered in this clip"
          error={errors.description}
          showLength
        />
        <CustomInputField
          label="Order"
          isMandatory={true}
          name="order"
          type="number"
          value={formData.order}
          onChange={handleOnChange}
          placeholder="e.g. 1"
          error={errors.order}
        />
      </div>
    </div>
  );
};

// Mounted only while open, so form state starts fresh every time
const ModalContent = ({ onClose, chapterId, loading, onSubmit, revision }) => {
  const isEdit = !!revision;
  const [formData, setFormData] = useState(
    isEdit
      ? {
          title: revision.title ?? "",
          description: revision.description ?? "",
          order: revision.order != null ? String(revision.order) : "",
          duration: "",
          audio: null,
          image: null,
        }
      : initialState,
  );
  const [errors, setErrors] = useState({});

  const handleClose = onClose;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { audio, image, description, duration, existingRemoved, ...rest } =
      formData;
    const result = isEdit
      ? updateKeywordRevisionSchema.safeParse({
          ...rest,
          description: description.trim(),
          // Only sent when the audio file is replaced
          duration: audio ? duration : undefined,
        })
      : createKeywordRevisionSchema.safeParse({
          ...rest,
          duration,
          description: description.trim(),
          chapterId,
        });

    const fieldErrors = {};
    if (!result.success) {
      result.error.issues.forEach((err) => {
        fieldErrors[err.path.join(".")] = err.message;
      });
    }
    // Removing the saved audio means a replacement must be picked
    if (!audio && (!isEdit || existingRemoved)) {
      fieldErrors.audio = "Audio file is required";
    } else if (audio && fieldErrors.duration) {
      // Duration isn't a visible field, so report it against the file
      fieldErrors.audio = "Could not read the audio duration, try another file";
    }

    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      toast.error("Please fix the errors in the form.");

      return;
    }

    setErrors({});

    const success = await onSubmit(result.data, audio, image);

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
            {isEdit ? "Edit Keyword Revision" : "Add Keyword Revision"}
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
          existingAudioUrl={revision?.audioUrl}
          existingImageUrl={revision?.imageUrl}
        />
        <div className="mt-8 flex flex-row items-center justify-end space-x-4 px-4">
          <CustomButton
            title={"Cancel"}
            onClick={handleClose}
            disabled={loading}
            className="text-primary! border-primary border bg-white"
          />
          <CustomButton
            title={isEdit ? "Update" : "Upload"}
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

const ManageKeywordRevisionModal = ({ isOpen, ...props }) => {
  if (!isOpen) {
    return null;
  }

  return <ModalContent {...props} />;
};

export default ManageKeywordRevisionModal;
