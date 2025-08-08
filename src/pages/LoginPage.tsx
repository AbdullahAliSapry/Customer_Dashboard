import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Lock, Store } from "lucide-react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { ApiRepository } from "../Api/ApiRepository";
import { EndPoints } from "../Api/EndPoints";
import { login } from "../Store/DashBoardSlice/AuthSlice";
import { AuthModel, LoginInput } from "../interfaces/AuthInterface";

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
  const apiRepository = new ApiRepository();

  // Login schema validation (moved inside component to access t)
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email(t("common.invalid_email"))
      .required(t("common.email_required")),
    password: Yup.string()
      .min(6, t("common.password_min"))
      .required(t("common.password_required")),
  });

  const handleSubmit = async (
    values: LoginInput,
    { setSubmitting }: FormikHelpers<LoginInput>
  ) => {
    try {
      await apiRepository.create<LoginInput, AuthModel>(
        EndPoints.login,
        values,
        login
      );
      navigate("/");
    } catch {
      setLoginError(t("common.login_error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg border border-primary-100">
        <div className="text-center flex flex-col items-center gap-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center shadow">
            <Store className="text-primary-600" size={36} />
          </motion.div>
          <h2 className="mt-4 text-2xl font-bold text-primary-700">
            {t("common.welcome_to_dashboard")}
          </h2>
          <p className="text-neutral-600 text-sm mt-1">
            {t("common.sign_in_prompt")}
          </p>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}>
          {({ isSubmitting, errors, touched }) => (
            <Form className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-neutral-700">
                    {t("common.email_label")}
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-neutral-400" />
                    </div>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.email && touched.email
                          ? "border-red-500"
                          : "border-neutral-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                      placeholder={t("common.email_placeholder")}
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-neutral-700">
                    {t("common.password_label")}
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-neutral-400" />
                    </div>
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        errors.password && touched.password
                          ? "border-red-500"
                          : "border-neutral-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                      placeholder={t("common.password_placeholder")}
                    />
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>
              </div>

              {loginError && (
                <div className="text-sm text-red-600 text-center">
                  {loginError}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-neutral-700">
                    {t("common.remember_me")}
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-primary-600 hover:text-primary-500">
                    {t("common.forgot_password")}
                  </a>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70">
                {isSubmitting ? t("common.signing_in") : t("common.sign_in")}
              </motion.button>
            </Form>
          )}
        </Formik>

        <div className="text-center">
          <p className="text-sm text-neutral-600">
            {t("common.no_account")}{" "}
            <a
              href="#"
              className="font-medium text-primary-600 hover:text-primary-500">
              {t("common.sign_up")}
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
