import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import CustomInputField from "../../common/CustomInputField";
import CustomButton from "../../common/CustomButton";
import { z } from "zod";
import {
  createProgram,
  updateProgram,
} from "../../../services/operations/programAPI";

const generateSlug = (value = "") =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Form Component ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const Form = ({ formData, setFormData, errors, setErrors, isEditMode }) => {
  // Handle input changes
  function handleOnChange(event) {
    const { name, value } = event.target;

    if (name === "name") {
      const slug = generateSlug(value);
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug,
      }));
      setErrors((prev) => ({
        ...prev,
        name: "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border border-sky-500">
        <div className="space-y-4">
          <CustomInputField
            label="Program Name"
            isMandatory={true}
            name="name"
            value={formData.name}
            onChange={handleOnChange}
            maxLength={100}
            placeholder="e.g. Assistant Pharmacist"
            error={errors.name}
          />
          <CustomInputField
            label="Slug"
            name="slug"
            value={formData.slug}
            placeholder="e.g. assistant_pharmacist"
            disabled
          />
        </div>
      </div>
    </div>
  );
};

// ~~~~~~~~~~~~~~~~~~~~~~ Main ManageProgram Component ~~~~~~~~~~~~~~~~~~~~~~
function ManageProgram() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.program);
  const location = useLocation();
  const isEditMode = !!location.state;
  const editData = isEditMode ? location.state : null;

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode && editData) {
      setFormData({
        name: editData.name || "",
        slug: editData.slug || generateSlug(editData.name || ""),
      });
    }
  }, [isEditMode, editData]);

  const submitHandler = async () => {
    const schema = z.object({
      name: z.string().min(1, "Program name is required"),
      slug: z.string().min(1, "Program slug is required"),
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

    const defaultParams = {
      page: 1,
      limit: 10,
      search: "",
    };

    const payload = {
      name: formData.name,
      slug: formData.slug,
    };

    if (isEditMode) {
      dispatch(updateProgram(token, editData?._id, payload, defaultParams, navigate));
    } else {
      dispatch(createProgram(token, payload, defaultParams, navigate));
    }
  };

  return (
    <div>
      <div className="text-zinc-900 text-2xl text-center font-medium mb-8">
        {isEditMode ? "Edit Program" : "Add Program"}
      </div>

      <Form
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        isEditMode={isEditMode}
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

export default ManageProgram;