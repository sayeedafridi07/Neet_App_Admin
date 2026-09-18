// components/common/PdfDropzone.jsx
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import CustomButton from "./CustomButton";
import pdfIcon from "../../assets/images/pdf.png";
import toast from "react-hot-toast";

const MAX_FILE_SIZE = 10; // 10 MB

const PdfDropzone = ({ value, onChange, error }) => {
  const [fileName, setFileName] = useState(null);
  const [fileSize, setFileSize] = useState(null);

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? `${(bytes / 1024).toFixed(2)} KB` : `${mb.toFixed(2)} MB`;
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFileName(file.name);
        setFileSize(file.size);
        onChange(file);
      }
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxSize: MAX_FILE_SIZE * 1024 * 1024,
    multiple: false,
    onDropRejected: (fileRejections) => {
      const err = fileRejections[0]?.errors[0];
      if (err?.code === "file-too-large")
        toast.error(`File size should be less than ${MAX_FILE_SIZE} MB`);
      else if (err?.code === "file-invalid-type")
        toast.error("Only PDF files are accepted");
    },
  });

  return (
    <div className="flex flex-col gap-1">
      <div className="text-sm font-medium text-gray-700">
        PDF <span className="text-red-500"> *</span>
      </div>

      <div
        {...getRootProps()}
        className={`
          flex flex-col items-center justify-center gap-3 p-10
          border-2 border-dashed rounded-2xl cursor-pointer
          transition-all duration-200
          ${isDragActive ? "border-primary bg-primary/10 scale-[1.01]" : "border-zinc-300 hover:border-primary/50 hover:bg-primary/5"}
          ${error ? "border-red-500" : ""}
        `}
      >
        <input {...getInputProps()} />

        {/* PDF Icon */}
        <img
          src={pdfIcon}
          alt="PDF Icon"
          className="w-16 h-16 object-contain"
        />

        {fileName || (typeof value === "string" && value) ? (
          <>
            <p className="text-sm font-semibold text-zinc-800 text-center max-w-[90%] truncate">
              {fileName || value.split("/").pop()}
            </p>
            {fileSize && (
              <p className="text-xs text-zinc-500 font-medium">
                {formatFileSize(fileSize)}
              </p>
            )}
          </>
        ) : (
          <>
            <p className="text-base font-bold text-zinc-700 text-center">
              {isDragActive
                ? "Drop it here!"
                : "Drop PDF here or click to browse"}
            </p>
            <p className="text-sm text-zinc-400">
              PDF files only · Max size {MAX_FILE_SIZE} MB
            </p>
          </>
        )}

        <div className="mt-1 text-primary text-sm font-semibold underline underline-offset-2">
          {fileName || (typeof value === "string" && value)
            ? "Click to replace"
            : "Browse Files"}
        </div>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default PdfDropzone;
