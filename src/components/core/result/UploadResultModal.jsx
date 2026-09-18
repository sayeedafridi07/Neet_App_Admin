import React, { useEffect, useState } from "react";
import Icon from "../../common/Icon";
import CustomButton from "../../common/CustomButton";
import CustomInputField from "../../common/CustomInputField";
import FileDropzone from "../../common/FileDropzone";
import toast from "react-hot-toast";
import fileIcon from "../../../assets/images/file.png";
import { uploadResultSchema, updateUploadResultSchema } from "../../../schemas/result.schema";

const UploadResultModal = ({ isOpen, onClose, data, loading, onSubmit }) => {
  const isEditMode = !!data;

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && data) {
      setTitle(data.title || "");
      setFile(data.fileUrl || null);
    } else {
      setTitle("");
      setFile(null);
    }
    setErrors({});
  }, [isOpen, data]);

  const handleClose = () => {
    setTitle("");
    setFile(null);
    setErrors({});
    onClose();
  };

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      setErrors((prev) => ({ ...prev, file: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const schema = isEditMode ? updateUploadResultSchema : uploadResultSchema;
    const result = schema.safeParse({ title, file });

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((err) => {
        fieldErrors[err.path.join(".")] = err.message;
      });

      setErrors(fieldErrors);
      toast.error("Please fill all required fields correctly.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    if (file) {
      formData.append("file", file);
    }

    const success = await onSubmit(formData);

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
      <div
        className="mx-4 w-full max-w-2xl rounded-2xl bg-white p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-8 flex flex-row items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <h1 className="text-text text-xl font-semibold">
            {isEditMode ? "Edit Result" : "Upload Result"}
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

        <div className="space-y-4">
          <CustomInputField
            label="Student Name"
            isMandatory={true}
            name="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors((prev) => ({ ...prev, title: "" }));
            }}
            maxLength={100}
            placeholder="e.g. John Doe"
            error={errors.title}
          />

          <div>
            <FileDropzone
              value={file}
              onChange={handleFileChange}
              error={errors.file}
              accept={{
                "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
              }}
              maxFileSize={10} // 10MB
              label="Upload Image"
              helperText="PNG, JPG, GIF max 10MB"
              required
              icon={fileIcon}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-row items-center justify-end space-x-4 px-4">
          <CustomButton
            title={"Cancel"}
            onClick={handleClose}
            className="!text-primary border-primary border bg-white"
          />
          <CustomButton
            title={isEditMode ? "Update" : "Submit"}
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

export default UploadResultModal;
