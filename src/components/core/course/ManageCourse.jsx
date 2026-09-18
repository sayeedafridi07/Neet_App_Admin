import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { createCourse, updateCourse } from "../../../services/operations/courseAPI";
import { getPrograms } from "../../../services/operations/programAPI";
import CustomButton from "../../common/CustomButton";
import Dropdown from "../../common/Dropdown";
import CustomInputField from "../../common/CustomInputField";
import PdfDropzone from "../../common/PdfDropzone";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Form Component ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const Form = ({
  formData,
  setFormData,
  errors,
  setErrors,
  isEditMode,
  programOptions,
}) => {
  function handleOnChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleFileChange(file) {
    if (file) {
      setFormData((prev) => ({ ...prev, pdf: file }));
      setErrors((prev) => ({ ...prev, pdf: "" }));
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border border-sky-500">
        <div className="space-y-4">
          <CustomInputField
            label="Title"
            isMandatory={true}
            name="title"
            value={formData.title}
            onChange={handleOnChange}
            maxLength={50}
            placeholder="e.g. React"
            error={errors.title}
            showLength
          />
          <CustomInputField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleOnChange}
            maxLength={100}
            showLength
            placeholder="e.g. A comprehensive guide to React"
            error={errors.description}
          />
          {!isEditMode && (
            <Dropdown
              label="Program"
              isMandatory={true}
              data={programOptions}
              placeholder="Select program"
              value={formData.programId}
              onSelect={(item) => {
                setFormData((prev) => ({ ...prev, programId: item?.value || "" }));
                setErrors((prev) => ({ ...prev, programId: "" }));
              }}
              error={errors.programId}
            />
          )}
          <PdfDropzone
            value={formData.pdf}
            onChange={handleFileChange}
            error={errors.pdf}
          />
        </div>
      </div>
    </div>
  );
};

// ~~~~~~~~~~~~~~~~~~~~~~ Main ManageCourse Component ~~~~~~~~~~~~~~~~~~~~~~
function ManageCourse() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.course);
  const { programs } = useSelector((state) => state.program);
  const location = useLocation();
  const isEditMode = !!location.state;
  const editData = isEditMode ? location.state : null;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    programId: "",
    pdf: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode && editData) {
      setFormData({
        title: editData.title || "",
        description: editData.description || "",
        programId: "",
        pdf: editData.pdfUrl || "",
      });
    }
  }, [isEditMode, editData]);

  useEffect(() => {
    if (!isEditMode) {
      dispatch(getPrograms(token, { page: 1, limit: 1000, search: "" }, false));
    }
  }, [dispatch, token, isEditMode]);

  const programOptions = (programs || []).map((program) => ({
    label: program.name,
    value: program._id,
  }));

  const submitHandler = async () => {
    const baseSchema = z.object({
      title: z.string().min(3, "Title must be at least 3 characters"),
      pdf: isEditMode
        ? z.union([z.instanceof(File), z.string()]).optional()
        : z.instanceof(File, { message: "PDF is required" }),
    });

    const schema = isEditMode
      ? baseSchema
      : baseSchema.extend({
          programId: z.string().min(1, "Program is required"),
        });

    const validationResult = schema.safeParse(formData);

    if (!validationResult.success) {
      toast.error("Please fix the errors");
      const newErrors = {};
      validationResult.error.issues.forEach((issue) => {
        if (!newErrors[issue.path[0]]) {
          newErrors[issue.path[0]] = issue.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    // File ke saath FormData banana zaroori hai
    const data = new FormData();
    data.append("title", formData.title);
    if (formData.description) data.append("description", formData.description);
    if (!isEditMode) data.append("programId", formData.programId);
    if (formData.pdf instanceof File) data.append("pdf", formData.pdf);

    const defaultParams = { page: 1, limit: 10, search: "" };

    if (isEditMode) {
      dispatch(updateCourse(token, editData?._id, data, defaultParams, navigate));
    } else {
      dispatch(createCourse(token, data, defaultParams, navigate));
    }
  };

  return (
    <div>
      <div className="text-text text-2xl text-center font-medium mb-8">
        {isEditMode ? "Edit Course" : "Add Course"}
      </div>

      <Form
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        isEditMode={isEditMode}
        programOptions={programOptions}
      />
      <div className="flex flex-row items-center justify-center space-x-4 mt-8 px-4 max-w-4xl mx-auto">
        <CustomButton
          title={"Cancel"}
          onClick={() => navigate(-1)}
          className="bg-white text-primary! border border-primary flex-1 py-3"
        />
        <CustomButton
          title={isEditMode ? "Update" : "Submit"}
          disabled={loading}
          loading={loading}
          onClick={submitHandler}
          className="bg-primary! border border-primary! flex-1 py-3"
        />
      </div>
    </div>
  );
}

export default ManageCourse;