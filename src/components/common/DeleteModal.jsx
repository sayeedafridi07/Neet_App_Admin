// src/components/DeleteModal.jsx

import CustomButton from "./CustomButton";
import Icon from "./Icon";

const DeleteModal = ({ isOpen, onClose, onDelete, title, children, loading }) => {
  // If the modal is not open, return null to render nothing
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal content box */}
      <div
        className="w-full max-w-md p-6 mx-4 bg-white rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center justify-center">
          {/* Centered Icon */}
          <div className="flex  items-center justify-center size-16 bg-error/20 rounded-full mb-4">
            <Icon name="AlertTriangle" className="size-8 text-error" />
          </div>
          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
            {title || "Confirm Deletion"}
          </h3>
          {/* Description */}
          <p className="text-sm text-gray-500 text-center mb-6">
            {children ||
              "Are you sure you want to delete this? This action cannot be undone."}
          </p>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-row items-center justify-center space-x-4 mt-2">
          <CustomButton
            title="Cancel"
            className="bg-transparent !text-primary border border-primary flex-1 py-2"
            onClick={onClose}
          />
          <CustomButton
            title="Delete"
            iconName="Trash2"
            className="!bg-error border !border-error flex-1 py-3"
            onClick={onDelete}
            loading={loading}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
