import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  createChapterSchema,
  updateChapterSchema,
} from "../../../schemas/chapter.schema";
import { getClasses } from "../../../services/operations/classAPI";
import { getSubjects } from "../../../services/operations/subjectAPI";
import CustomButton from "../../common/CustomButton";
import CustomInputField from "../../common/CustomInputField";
import Dropdown from "../../common/Dropdown";
import Icon from "../../common/Icon";

const initialState = {
  name: "",
  order: "1",
  classId: "",
  subjectId: "",
};

// Large limit so the dropdowns list every option on one page
const OPTIONS_QUERY = { page: 1, limit: 100 };

const toOptions = (items = []) =>
  items.map((item) => ({ id: item.id, value: item.id, label: item.name }));

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Form Component ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const Form = ({ formData, setFormData, errors, setErrors, isEditMode }) => {
  const { data: classesResponse, isLoading: isClassesLoading } = useQuery({
    queryKey: ["classes", OPTIONS_QUERY],
    queryFn: () => getClasses(OPTIONS_QUERY),
    enabled: !isEditMode,
  });
  const { data: subjectsResponse, isLoading: isSubjectsLoading } = useQuery({
    queryKey: ["subjects", OPTIONS_QUERY],
    queryFn: () => getSubjects(OPTIONS_QUERY),
    enabled: !isEditMode,
  });
  const classOptions = toOptions(classesResponse?.data?.classes);
  const subjectOptions = toOptions(subjectsResponse?.data?.subjects);

  function handleOnChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleSelect(name) {
    return (item) => {
      setFormData((prev) => ({ ...prev, [name]: item?.value || "" }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    };
  }

  return (
    <div className="border-primary rounded-lg border p-4 md:p-6">
      <div className="space-y-4">
        {/* Class & subject are only chosen when creating a chapter */}
        {!isEditMode && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Dropdown
              label="Class"
              isMandatory={true}
              data={classOptions}
              placeholder="Select class"
              searchable
              value={formData.classId}
              loading={isClassesLoading}
              onSelect={handleSelect("classId")}
              error={errors.classId}
            />
            <Dropdown
              label="Subject"
              isMandatory={true}
              data={subjectOptions}
              placeholder="Select subject"
              searchable
              value={formData.subjectId}
              loading={isSubjectsLoading}
              onSelect={handleSelect("subjectId")}
              error={errors.subjectId}
            />
          </div>
        )}
        <CustomInputField
          label="Name"
          isMandatory={true}
          name="name"
          value={formData.name}
          onChange={handleOnChange}
          maxLength={50}
          placeholder="e.g. Laws of Motion"
          error={errors.name}
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
const ModalContent = ({ onClose, data, loading, onSubmit }) => {
  const isEditMode = !!data;

  const [formData, setFormData] = useState(() =>
    data ? { name: data.name || "", order: data.order ?? "" } : initialState,
  );
  const [errors, setErrors] = useState({});

  const handleClose = onClose;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const schema = isEditMode ? updateChapterSchema : createChapterSchema;
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

  return (
    <div
      className="bg-secondary/50 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={handleClose}
    >
      {/* Modal content box */}
      <div
        className="bg-surface mx-4 w-full max-w-xl rounded-2xl p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-border mb-8 flex flex-row items-center justify-between gap-4 border-b pb-4">
          <h1 className="text-text text-xl font-semibold">
            {isEditMode ? "Edit Chapter" : "Add Chapter"}
          </h1>
          <button
            type="button"
            aria-label="Close"
            onClick={handleClose}
            className="text-textMuted hover:bg-background hover:text-text cursor-pointer rounded-full p-2 transition-all"
          >
            <Icon name="X" size={18} />
          </button>
        </div>

        <Form
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          isEditMode={isEditMode}
        />
        <div className="mt-8 flex flex-row items-center justify-end space-x-4 px-4">
          <CustomButton
            title={"Cancel"}
            onClick={handleClose}
            className="text-primary! border-primary border bg-transparent"
          />
          <CustomButton
            title={isEditMode ? "Update" : "Submit"}
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

const ManageChapterModal = ({ isOpen, ...props }) => {
  if (!isOpen) {
    return null;
  }

  return <ModalContent {...props} />;
};

export default ManageChapterModal;
