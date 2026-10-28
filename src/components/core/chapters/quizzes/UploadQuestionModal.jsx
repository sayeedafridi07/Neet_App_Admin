import { useState } from "react";
import Icon from "../../../common/Icon";
import CustomButton from "../../../common/CustomButton";
import FileDropzone from "../../../common/FileDropzone";
import excelIcon from "../../../../assets/images/file.png";
import toast from "react-hot-toast";

const UploadQuestionModal = ({ isOpen, onClose, loading, onSubmit }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleClose = () => {
    setFile(null);
    setError("");
    onClose();
  };

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("File is required");
      toast.error("Please upload a file");
      return;
    }

    const success = await onSubmit(file);

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
        className="mx-4 w-full max-w-2xl rounded-2xl bg-white p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
          <h1 className="text-text text-xl font-semibold">Upload Questions</h1>

          <button
            type="button"
            aria-label="Close"
            onClick={handleClose}
            className="cursor-pointer rounded-full p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-700"
          >
            <Icon name="X" size={18} />
          </button>
        </div>
        {/* Sample Download CTA */}
        {/* <div className="border-primary/20 bg-primary/5 mb-4 flex items-center justify-between rounded-xl border p-4">
          <div>
            <h3 className="text-text text-sm font-semibold">
              Download Sample File
            </h3>

            <p className="text-primary mt-1 text-xs">
              Use the sample Excel format to upload questions correctly.
            </p>
          </div>
          <a href="/sample/sample_question.xlsx" download>
            <div>
              <CustomButton
                title="Download"
                leftIcon={<Icon name="Download" size={16} />}
                className="border-primary !text-primary border bg-white"
              />
            </div>
          </a>
        </div>
        */}

        {/* File Upload */}
        <div className="rounded-xl border border-primary p-4 shadow-md md:p-6">
          <FileDropzone
            label="Upload File"
            required
            value={file}
            onChange={handleFileChange}
            error={error}
            icon={excelIcon}
            accept={{
              "text/csv": [".csv"],
              "application/vnd.ms-excel": [".xls"],
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                [".xlsx"],
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                [".docx"],
            }}
            maxFileSize={10}
            invalidTypeMessage="Only Excel, CSV and WORD files are accepted"
            helperText="CSV, XLS, XLSX, DOCX files only · Max size 10 MB"
          />
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-end gap-4">
          <CustomButton
            title="Cancel"
            onClick={handleClose}
            className="border-primary !text-primary border bg-white"
          />

          <CustomButton
            title="Upload"
            disabled={loading}
            loading={loading}
            onClick={handleSubmit}
            className="border-primary !bg-primary border"
          />
        </div>
      </div>
    </div>
  );
};

export default UploadQuestionModal;
