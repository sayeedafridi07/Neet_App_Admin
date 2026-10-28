import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  createAudioLectureSchema,
  updateAudioLectureSchema,
} from "../../../../schemas/audioLecture.schema";
import CustomButton from "../../../common/CustomButton";
import CustomInputField from "../../../common/CustomInputField";
import FileDropzone from "../../../common/FileDropzone";
import Icon from "../../../common/Icon";
import MiniAudioPlayer from "../../../common/players/MiniAudioPlayer";

const MAX_AUDIO_SIZE_MB = 100;

const initialState = {
  title: "",
  description: "",
  order: "1",
  audio: null,
};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Form Component ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const Form = ({
  formData,
  setFormData,
  errors,
  setErrors,
  isEdit,
  existingAudioUrl,
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
            onChange={(file) => {
              setFormData((prev) => ({
                ...prev,
                audio: file,
              }));
              setErrors((prev) => ({ ...prev, audio: "" }));
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
        {/* New lectures take the chapter name; it can be renamed later */}
        {isEdit && (
          <CustomInputField
            label="Title"
            isMandatory={true}
            name="title"
            value={formData.title}
            onChange={handleOnChange}
            maxLength={100}
            placeholder="e.g. Introduction to Cell Biology"
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
          placeholder="Short summary of the lecture"
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
const ModalContent = ({
  onClose,
  chapterId,
  chapterName,
  loading,
  onSubmit,
  lecture,
}) => {
  const isEdit = !!lecture;
  const [formData, setFormData] = useState(
    isEdit
      ? {
          title: lecture.title ?? "",
          description: lecture.description ?? "",
          order: lecture.order != null ? String(lecture.order) : "",
          audio: null,
        }
      : { ...initialState, title: chapterName ?? "" },
  );
  const [errors, setErrors] = useState({});

  const handleClose = onClose;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { audio, description, existingRemoved, ...rest } = formData;
    const result = isEdit
      ? updateAudioLectureSchema.safeParse({
          ...rest,
          description: description.trim(),
        })
      : createAudioLectureSchema.safeParse({
          ...rest,
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
    }

    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      toast.error("Please fix the errors in the form.");

      return;
    }

    setErrors({});

    const success = await onSubmit(result.data, audio);

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
            {isEdit ? "Edit Audio Lecture" : "Add Audio Lecture"}
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
          existingAudioUrl={lecture?.audioUrl}
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

const ManageAudioLectureModal = ({ isOpen, ...props }) => {
  if (!isOpen) {
    return null;
  }

  return <ModalContent {...props} />;
};

export default ManageAudioLectureModal;
