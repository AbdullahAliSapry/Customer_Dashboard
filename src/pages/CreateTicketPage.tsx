import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Ticket,
  CreateTicketInput,
  ticketPriority,
} from "../interfaces/ticketInterface";
import { ApiRepository, ErrorInfo } from "../Api/ApiRepository";
import { EndPoints } from "../Api/EndPoints";
import { addTicket, setError } from "../Store/DashBoardSlice/ticketSlice";
import { useSelector } from "react-redux";
import { RootState } from "../Store/Store";

const CreateTicketPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const {user} = useSelector((state: RootState) => state.Auth);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Yup validation schema
  const validationSchema = Yup.object({
    title: Yup.string()
      .min(3, t("Title must be at least 3 characters"))
      .max(100, t("Title must be less than 100 characters"))
      .required(t("Title is required")),
    description: Yup.string()
      .min(10, t("Description must be at least 10 characters"))
      .max(1000, t("Description must be less than 1000 characters"))
      .required(t("Description is required")),
    priority: Yup.number()
      .oneOf(
        [ticketPriority.Low, ticketPriority.Medium, ticketPriority.High],
        t("Please select a valid priority")
      )
      .required(t("Priority is required")),
  });

  const initialValues = {
    title: "",
    description: "",
    priority: ticketPriority.Medium,
  };

  const handleSubmit = async (
    values: typeof initialValues,
    {
      setSubmitting,
      setFieldError,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      setFieldError: (field: string, message: string) => void;
    }
  ) => {
    setLoading(true);

    try {
      const api = new ApiRepository();
      let isSuccess = false;
      
      await api.create<CreateTicketInput, Ticket>(
        EndPoints.createTicket,
        {
          title: values.title.trim(),
          description: values.description.trim(),
          priority: values.priority,
          createdByUserId: user?.userId || "",
        },
        (payload) => {
          addTicket(payload as Ticket);
          isSuccess = true;
          return addTicket(payload as Ticket);
        },
        (payload) => {
          setError(payload as ErrorInfo);
          setFieldError("general", payload.message || t("Failed to create ticket. Please try again."));
          return setError(payload as ErrorInfo);
        }
      );

      // Only redirect if the ticket was created successfully
      if (isSuccess) {
        navigate("/tickets");
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      setFieldError("general", t("Failed to create ticket. Please try again."));
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const priorityConfig = {
    [ticketPriority.Low]: {
      color: "emerald",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
      gradient: "from-emerald-400 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100",
    },
    [ticketPriority.Medium]: {
      color: "amber",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
      gradient: "from-amber-400 to-orange-500",
      bgGradient: "from-amber-50 to-orange-100",
    },
    [ticketPriority.High]: {
      color: "red",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
      gradient: "from-red-400 to-red-600",
      bgGradient: "from-red-50 to-red-100",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div
        className={`max-w-4xl mx-auto transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
        {/* Creative Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 rounded-lg blur opacity-25 animate-pulse"></div>
            <h1 className="relative text-4xl font-bold text-gray-800">
              {t("Create New Ticket")}
            </h1>
          </div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            {t("Fill in the details below to create a new support ticket")}
          </p>

          {/* Decorative Elements */}
          <div className="flex justify-center mt-6 space-x-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}></div>
            <div
              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {t("Ticket Information")}
                </h2>
                <p className="text-emerald-100">
                  {t("Provide detailed information about your issue")}
                </p>
              </div>
            </div>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({ values, errors, touched, setFieldValue, isSubmitting }) => (
              <Form className="p-8 space-y-8">
                {/* Title Input with Floating Label */}
                <div className="relative group">
                  <div className="relative">
                    <Field
                      as="input"
                      type="text"
                      name="title"
                      id="title"
                      className={`w-full px-6 py-4 text-lg border-2 rounded-xl focus:outline-none focus:border-transparent focus:ring-0 bg-white/50 backdrop-blur-sm transition-all duration-300 ${
                        errors.title && touched.title
                          ? "border-red-300"
                          : "border-gray-200"
                      }`}
                      placeholder=" "
                      disabled={loading}
                    />
                    <label
                      htmlFor="title"
                      className="absolute left-6 top-4 text-gray-500 transition-all duration-300 pointer-events-none group-focus-within:-top-2 group-focus-within:left-4 group-focus-within:text-sm group-focus-within:text-emerald-600 bg-white px-2">
                      {t("Title")} <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="mt-2 text-sm text-red-600 flex items-center gap-2">
                    {(msg) => (
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>
                </div>

                {/* Description Input with Floating Label */}
                <div className="relative group">
                  <div className="relative">
                    <Field
                      as="textarea"
                      name="description"
                      id="description"
                      rows={6}
                      className={`w-full px-6 py-4 text-lg border-2 rounded-xl focus:outline-none focus:border-transparent focus:ring-0 bg-white/50 backdrop-blur-sm resize-none transition-all duration-300 ${
                        errors.description && touched.description
                          ? "border-red-300"
                          : "border-gray-200"
                      }`}
                      placeholder=" "
                      disabled={loading}
                    />
                    <label
                      htmlFor="description"
                      className="absolute left-6 top-4 text-gray-500 transition-all duration-300 pointer-events-none group-focus-within:-top-2 group-focus-within:left-4 group-focus-within:text-sm group-focus-within:text-blue-600 bg-white px-2">
                      {t("Description")} <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="mt-2 text-sm text-red-600 flex items-center gap-2">
                    {(msg) => (
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>
                </div>

                {/* Priority Selection with Creative Cards */}
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-gray-700 mb-4">
                    {t("Priority Level")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(
                      [
                        ticketPriority.Low,
                        ticketPriority.Medium,
                        ticketPriority.High,
                      ] as const
                    ).map((level) => {
                      const config = priorityConfig[level];
                      const isSelected = values.priority === level;

                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setFieldValue("priority", level)}
                          className={`relative group p-6 rounded-2xl border-2 transition-all duration-500 transform hover:scale-105 ${
                            isSelected
                              ? `border-${config.color}-500 bg-gradient-to-br ${config.bgGradient} shadow-lg`
                              : "border-gray-200 hover:border-gray-300 bg-white/50 hover:bg-white/80"
                          }`}
                          disabled={loading}>
                          {/* Animated Background */}
                          {isSelected && (
                            <div
                              className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-10 rounded-2xl animate-pulse`}></div>
                          )}

                          <div className="relative flex flex-col items-center gap-4">
                            <div
                              className={`p-4 rounded-full transition-all duration-300 ${
                                isSelected
                                  ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg`
                                  : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                              }`}>
                              {config.icon}
                            </div>

                            <div className="text-center">
                              <span
                                className={`font-bold text-lg capitalize ${
                                  isSelected
                                    ? `text-${config.color}-700`
                                    : "text-gray-700"
                                }`}>
                                {level === ticketPriority.Low && t("Low")}
                                {level === ticketPriority.Medium && t("Medium")}
                                {level === ticketPriority.High && t("High")}
                              </span>
                              <p
                                className={`text-sm mt-1 ${
                                  isSelected
                                    ? `text-${config.color}-600`
                                    : "text-gray-500"
                                }`}>
                                {level === ticketPriority.Low &&
                                  t("Normal response time")}
                                {level === ticketPriority.Medium &&
                                  t("Quick response needed")}
                                {level === ticketPriority.High &&
                                  t("Urgent attention required")}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <ErrorMessage
                    name="priority"
                    component="div"
                    className="mt-2 text-sm text-red-600 flex items-center gap-2">
                    {(msg) => (
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {msg}
                      </div>
                    )}
                  </ErrorMessage>
                </div>

                {/* General Error Message */}
                <ErrorMessage
                  name="general"
                  component="div"
                  className="animate-shake p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl text-red-700 flex items-center space-x-3">
                  {(msg) => (
                    <div className="flex items-center space-x-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{msg}</span>
                    </div>
                  )}
                </ErrorMessage>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => navigate("/tickets")}
                    className="px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105 font-medium"
                    disabled={loading}>
                    {t("Cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={loading || isSubmitting}
                    className="relative px-8 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl hover:from-emerald-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-medium flex items-center gap-3 overflow-hidden group">
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative flex items-center gap-3">
                      {loading || isSubmitting ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      )}
                      {t("Create Ticket")}
                    </div>
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Decorative Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div
            className="absolute top-40 right-10 w-32 h-32 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"
            style={{ animationDelay: "2s" }}></div>
          <div
            className="absolute bottom-20 left-1/2 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"
            style={{ animationDelay: "4s" }}></div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
      `}</style>
    </div>
  );
};

export default CreateTicketPage;
