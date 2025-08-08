/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutGrid, ArrowLeft, CheckCircle } from "lucide-react";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import PageTransition from "../components/FormsComponents/PageTransition";
import ProgressBar from "../components/FormsComponents/ProgressBar";
import Card from "../components/FormsComponents/Card";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Store/Store";
import {
  prevStep,
  createStoreSuccess,
  StoreResponseData,
  setStoreBasicInfo
} from "../Store/StoreSlice/CreateStoreSlice";
import { useTranslation } from "react-i18next";
import { EndPoints } from "../Api/EndPoints";
import { ApiClient } from "../Api/ApiClient";
import { IResponseData } from "../interfaces/ResponseInterface";
import { ICreateStore } from "../interfaces/CreateStoreInterface";

const validationSchema = Yup.object().shape({
  dominName: Yup.string()
    .required("storeCreation.errors.domain_name_required")
    .min(3, "storeCreation.errors.domain_name_min"),
  phoneContact: Yup.string()
    .required("storeCreation.errors.phone_required")
    .matches(/^[0-9+\-\s()]+$/, "storeCreation.errors.phone_invalid"),
  emailContact: Yup.string()
    .required("storeCreation.errors.email_required")
    .email("storeCreation.errors.email_invalid"),
  businessType: Yup.number()
    .required("storeCreation.errors.business_type_required"),
  primaryColor: Yup.string()
    .required("storeCreation.errors.primary_color_required")
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "storeCreation.errors.color_invalid"),
  secondaryColor: Yup.string()
    .required("storeCreation.errors.secondary_color_required")
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "storeCreation.errors.color_invalid"),
  accentColor: Yup.string()
    .required("storeCreation.errors.accent_color_required")
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "storeCreation.errors.color_invalid"),
  font: Yup.string()
    .required("storeCreation.errors.font_required"),
  templateId: Yup.number()
    .required("storeCreation.errors.template_required")
    .min(1, "storeCreation.errors.template_required"),
  logo: Yup.mixed()
    .required("storeCreation.errors.logo_required"),
  socialMediaLinks: Yup.array().of(
    Yup.object().shape({
      platform: Yup.string().required("storeCreation.errors.social_media_platform_required"),
      url: Yup.string()
        .required("storeCreation.errors.social_media_url_required")
        .url("storeCreation.errors.social_media_url_invalid")
    })
  ).min(1, "storeCreation.errors.social_media_required"),
  typeStore: Yup.number()
    .required("storeCreation.errors.store_type_required")
});

const SectionCustomization = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { storeData, currentStep, loading, success } = useSelector(
    (state: RootState) => state.createStore
  );
  const customerData = useSelector((state: RootState) => state.customer.customerData);
  const [error, setError] = useState<string | null>(null);

  // Update ownerId in store when component mounts or customerData changes
  useEffect(() => {
    if (customerData?.id && (!storeData.ownerId || storeData.ownerId === 0)) {
      console.log("Setting owner ID:", customerData.id);
      dispatch(setStoreBasicInfo({ ownerId: customerData.id }));
    }
  }, [customerData?.id, storeData.ownerId, dispatch]);

  const handleBack = () => {
    dispatch(prevStep());
    navigate("/colors");
  };

  const handleSubmit = async (values: ICreateStore, { setSubmitting }: any) => {
    setError(null);
    console.log("Starting store creation with data:", values);
    
    const formData = new FormData();

    // Append all form fields to FormData
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'socialMediaLinks') {
        value.forEach((link: any, idx: number) => {
          formData.append(`socialMediaLinks[${idx}][platform]`, link.platform);
          formData.append(`socialMediaLinks[${idx}][url]`, link.url);
        });
      } else if (key === 'logo') {
        if (value instanceof File) {
          formData.append('logo', value);
        } else if (typeof value === 'string' && value.startsWith('data:')) {
          // Convert base64 to blob
          fetch(value)
            .then(res => res.blob())
            .then(blob => {
              const file = new File([blob], 'logo.png', { type: blob.type });
              formData.append('logo', file);
            });
        }
      } else {
        formData.append(key, value?.toString() || '');
      }
    });

    console.log("Form data entries:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    
    try {
      console.log("Sending API request to:", EndPoints.createStore);
      
      const response = await ApiClient.post<IResponseData<StoreResponseData>>(
        EndPoints.createStore,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      console.log("Direct API response:", response);
      
      if (response.data && response.data.isSuccess) {
        dispatch(createStoreSuccess(response.data.data as StoreResponseData));
        console.log("Store created successfully!");
        setTimeout(() => {
          navigate("/stores");
        }, 1500);
      } else {
        throw new Error(response.data?.message || "Failed to create store");
      }
    } catch (err: unknown) {
      console.error("Store creation error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t("storeCreation.errors.generic_error"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    t("storeCreation.steps.store_info"),
    t("storeCreation.steps.templates"),
    t("storeCreation.steps.colors"),
    t("storeCreation.steps.customize"),
  ];

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-primary-50 p-4 rounded-full mb-4">
            <LayoutGrid className="text-primary-600" size={32} />
          </motion.div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            {t("storeCreation.ready_to_launch")}
          </h1>
          <p className="text-neutral-600 max-w-lg">
            {t("storeCreation.ready_to_launch_description")}
          </p>
        </div>

        <ProgressBar steps={steps} currentStep={currentStep} />

        <Formik
          initialValues={storeData}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, isSubmitting }) => (
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card title={t("storeCreation.store_details")}>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-neutral-500">
                        {t("storeCreation.domain_name")}
                      </span>
                      <p className="font-medium">{values.dominName}</p>
                    </div>

                    <div>
                      <span className="text-sm text-neutral-500">
                        {t("storeCreation.business_type")}
                      </span>
                      <p className="font-medium">{values.businessType}</p>
                    </div>

                    <div>
                      <span className="text-sm text-neutral-500">
                        {t("storeCreation.store_type")}
                      </span>
                      <p className="font-medium">
                        {values.typeStore === 0 
                          ? t("storeCreation.store_types.products") 
                          : t("storeCreation.store_types.services")}
                      </p>
                    </div>

                    <div>
                      <span className="text-sm text-neutral-500">
                        {t("storeCreation.contact_email")}
                      </span>
                      <p className="font-medium">{values.emailContact}</p>
                    </div>

                    <div>
                      <span className="text-sm text-neutral-500">
                        {t("storeCreation.contact_phone")}
                      </span>
                      <p className="font-medium">{values.phoneContact}</p>
                    </div>
                  </div>
                </Card>

                <Card title={t("storeCreation.theme_settings")}>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-neutral-500">
                        {t("storeCreation.selected_font")}
                      </span>
                      <p
                        className="font-medium"
                        style={{ fontFamily: values.font }}>
                        {values.font}
                      </p>
                    </div>

                    <div>
                      <span className="text-sm text-neutral-500">
                        {t("storeCreation.color_scheme")}
                      </span>
                      <div className="flex space-x-2 mt-1">
                        <div
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: values.primaryColor }}
                          title={t("storeCreation.primary_color")}
                        />
                        <div
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: values.secondaryColor }}
                          title={t("storeCreation.secondary_color")}
                        />
                        <div
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: values.accentColor }}
                          title={t("storeCreation.accent_color")}
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-neutral-500">
                        {t("storeCreation.template_id")}
                      </span>
                      <p className="font-medium">{values.templateId}</p>
                    </div>
                  </div>
                </Card>
              </div>

              <Card title={t("storeCreation.social_media_links")} className="mt-8">
                {values.socialMediaLinks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {values.socialMediaLinks.map((link, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="font-medium capitalize">
                          {link.platform}:
                        </span>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:underline truncate">
                          {link.url}
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-500">
                    {t("storeCreation.no_social_media_links")}
                  </p>
                )}
              </Card>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="btn btn-outline flex items-center"
                  disabled={isSubmitting}>
                  <ArrowLeft size={16} className="mr-2" />
                  {t("storeCreation.back_to_colors")}
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="btn btn-primary flex items-center">
                  {isSubmitting || loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      {t("storeCreation.creating_store")}
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} className="mr-2" />
                      {t("storeCreation.create_store")}
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
                  {error}
                </div>
              )}
              {success && (
                <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
                  {t("storeCreation.store_created_success")}
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </PageTransition>
  );
};

export default SectionCustomization;
