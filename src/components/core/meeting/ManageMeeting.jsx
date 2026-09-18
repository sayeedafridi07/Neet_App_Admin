import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import CustomInputField from "../../common/CustomInputField";
import CustomButton from "../../common/CustomButton";
import { z } from "zod";
import { createUser, updateUser } from "../../../services/operations/userAPI";
import { ROLES } from "../../../data/roles";
import { createMeeting, updateMeeting } from "../../../services/operations/meetingAPI";
import moment from "moment";

import CustomTimePicker from "../../common/CustomTimePicker";
import CustomDatePicker from "../../common/CustomDatePicker";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Form Component ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const Form = ({ formData, setFormData, errors, setErrors, isEditMode }) => {
  // Handle input changes
  function handleOnChange(event) {
    const { name, value } = event.target;
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
          <CustomInputField
            label="Meeting Link"
            isMandatory={true}
            name="meetingLink"
            value={formData.meetingLink}
            onChange={handleOnChange}
            placeholder="e.g. https://zoom.us/j/1234567890"
            error={errors.meetingLink}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CustomDatePicker
              label="Date"
              isMandatory={true}
              name="date"
              value={formData.date}
              onChange={(m, dateStr) => {
                setFormData((prev) => ({ ...prev, date: dateStr }));
                setErrors((prev) => ({ ...prev, date: "" }));
              }}
              error={errors.date}
              className="w-full"
            />
            <CustomTimePicker
              label="Start Time"
              isMandatory={true}
              name="startTime"
              value={formData.startTime}
              onChange={(m, timeStr) => {
                setFormData((prev) => ({ ...prev, startTime: timeStr }));
                setErrors((prev) => ({ ...prev, startTime: "" }));
              }}
              error={errors.startTime}
              className="w-full"
            />
            <CustomTimePicker
              label="End Time"
              isMandatory={true}
              name="endTime"
              value={formData.endTime}
              onChange={(m, timeStr) => {
                setFormData((prev) => ({ ...prev, endTime: timeStr }));
                setErrors((prev) => ({ ...prev, endTime: "" }));
              }}
              error={errors.endTime}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ~~~~~~~~~~~~~~~~~~~~~~ Main ManageMeeting Component ~~~~~~~~~~~~~~~~~~~~~~
function ManageMeeting() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.meeting);
  const location = useLocation();
  const isEditMode = !!location.state;
  const editData = isEditMode ? location.state : null;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    meetingLink: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode && editData) {
      let parsedDate = editData.date || "";
      let parsedStart = editData.startTime || "";
      let parsedEnd = editData.endTime || "";

      // If startTime is a valid ISO/UTC string, parse it to extract local date and time
      if (editData.startTime && moment(editData.startTime, moment.ISO_8601, true).isValid()) {
        const startMoment = moment(editData.startTime).local();
        parsedDate = startMoment.format("YYYY-MM-DD");
        parsedStart = startMoment.format("h:mm A");
      }

      // Do the same for endTime if it exists
      if (editData.endTime && moment(editData.endTime, moment.ISO_8601, true).isValid()) {
        const endMoment = moment(editData.endTime).local();
        parsedEnd = endMoment.format("h:mm A");
      }

      setFormData({
        title: editData.title || "",
        description: editData.description || "",
        meetingLink: editData.meetingLink || "",
        date: parsedDate,
        startTime: parsedStart,
        endTime: parsedEnd,
      });
    }
  }, [isEditMode, editData]);

  const submitHandler = async () => {
    const baseSchema = z.object({
      title: z.string().min(3, "Title must be at least 3 characters"),
      meetingLink: z.string().min(1, "Meeting link is required").url("Invalid URL format"),
      date: z.string().min(1, "Date is required"),
      startTime: z.string().min(1, "Start time is required"),
      endTime: z.string().min(1, "End time is required"),
    });

    const validationResult = baseSchema.safeParse(formData);

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
      title: formData.title,
      description: formData.description,
      meetingLink: formData.meetingLink,
      date: formData.date,
      startTime: formData.startTime ? moment(`${formData.date} ${formData.startTime}`, "YYYY-MM-DD h:mm A").utc().format() : "",
    };

    if (formData.endTime) {
      payload.endTime = moment(`${formData.date} ${formData.endTime}`, "YYYY-MM-DD h:mm A").utc().format();
    }

    if (isEditMode) {
      dispatch(updateMeeting(token, editData?._id, payload, defaultParams, navigate));
    } else {
      dispatch(createMeeting(token, payload, defaultParams, navigate));
    }
  };

  return (
    <div>
      <div className="text-zinc-900 text-2xl text-center font-medium mb-8">
        {isEditMode ? "Reschedule Meeting" : "Schedule Meeting"}
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
          className="bg-white !text-primary border border-primary flex-1 py-3"
        />
        <CustomButton
          title={isEditMode ? "Update" : "Submit"}
          disabled={loading}
          loading={loading}
          onClick={submitHandler}
          className="!bg-primary border !border-primary flex-1 py-3"
        />
      </div>
    </div>
  );
}

export default ManageMeeting;