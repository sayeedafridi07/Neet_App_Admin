import { useState } from "react";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Checkbox from "../components/common/CheckBox";
import CustomButton from "../components/common/CustomButton";
import CustomInputField from "../components/common/CustomInputField";

import { login } from "../services/operations/authAPI";
import logo from "../assets/images/logo.png";
import backgroundImage from "../assets/images/bg.webp";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const savedInfo = localStorage.getItem("savedInfo")
    ? JSON.parse(localStorage.getItem("savedInfo"))
    : {};

  const [formData, setFormData] = useState({
    email: savedInfo.email || "",
    password: savedInfo.password || "",
    rememberMe: savedInfo.rememberMe || false,
  });

  const [errors, setErrors] = useState({});

  const loginMutation = useMutation({
    mutationFn: login,

    onSuccess: (data) => {
      const token = data?.data?.accessToken;
      const user = data?.data?.user;

      if (!token || !user) {
        toast.error("Login failed. User details not received.");
        return;
      }

      localStorage.setItem("accessToken", token);
      localStorage.setItem("profile", JSON.stringify(user));

      if (formData.rememberMe) {
        localStorage.setItem(
          "savedInfo",
          JSON.stringify({
            email: formData.email,
            password: formData.password,
            rememberMe: true,
          }),
        );
      } else {
        localStorage.removeItem("savedInfo");
      }

      toast.success("Login successful!");

      // navigate to dashboard
      navigate("/dashboard");
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";

      toast.error(message);
    },
  });

  const handleOnChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const validateForm = (values) => {
    const errors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(values.email)) {
      errors.email = "Invalid Email";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  const handleLogin = () => {
    const validationErrors = validateForm(formData);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const errorMessages = Object.values(validationErrors).join("\n");

      toast.error(errorMessages);

      return;
    }

    loginMutation.mutate({
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <div className="font-roboto relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center brightness-50"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-background rounded-2xl px-8 py-10 shadow-2xl sm:px-10">
            <img
              src={logo}
              className="mx-auto block h-16 w-auto cursor-pointer object-cover"
            />

            <div className="text-center">
              <h1 className="text-text font-serif text-3xl leading-tight">
                Admin console
              </h1>

              <p className="font-inter text-textSecondary mt-2 text-sm">
                Sign in to manage courses, students and content for the NEET
                App.
              </p>
            </div>

            <div className="mt-8 space-y-5 select-none">
              {[
                {
                  leftIconName: "Mail",
                  label: "Email",
                  name: "email",
                  value: formData.email,
                  error: errors.email,
                  onChange: handleOnChange,
                  placeholder: "johndoe@gmail.com",
                },
                {
                  leftIconName: "Lock",
                  label: "Password",
                  name: "password",
                  value: formData.password,
                  error: errors.password,
                  secureTextEntry: true,
                  onChange: handleOnChange,
                  placeholder: "Enter your password",
                },
              ].map((field) => (
                <CustomInputField key={field.name} {...field} />
              ))}

              <div className="flex items-center justify-between pt-1">
                <label className="flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        rememberMe: e.target.checked,
                      }))
                    }
                    className="hidden"
                  />

                  <Checkbox checked={formData.rememberMe} />

                  <span className="font-inter text-textSecondary ml-2 text-sm">
                    Remember me
                  </span>
                </label>
              </div>

              <CustomButton
                title="Sign in"
                loading={loginMutation.isPending}
                disabled={loginMutation.isPending}
                className="w-full px-4 py-3"
                onClick={handleLogin}
              />
            </div>

            <p className="font-inter text-textMuted mt-8 text-center text-xs">
              Trouble signing in? Contact the platform team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
