/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutGrid, ArrowLeft, CheckCircle } from "lucide-react";
import PageTransition from "../components/FormsComponents/PageTransition";
import ProgressBar from "../components/FormsComponents/ProgressBar";
import Card from "../components/FormsComponents/Card";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Store/Store";
import {
  prevStep,
  createStoreSuccess,
  StoreResponseData
} from "../Store/StoreSlice/CreateStoreSlice";
import { useTranslation } from "react-i18next";
import { EndPoints } from "../Api/EndPoints";
import { ApiClient } from "../Api/ApiClient";
import { IResponseData } from "../interfaces/ResponseInterface";

const SectionCustomization = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { storeData, currentStep, loading, success } = useSelector(
    (state: RootState) => state.createStore
  );
  const ownerid = useSelector((state: RootState) => state.customer.customerData?.id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    dispatch(prevStep());
    navigate("/colors");
  };

  const handleCreateStore = async () => {
    setIsSubmitting(true);
    setError(null);
    console.log("Starting store creation with data:", storeData);
    
    // التحقق من وجود جميع البيانات المطلوبة
    const validationErrors = [];
    if (!storeData.dominName || storeData.dominName.trim() === "") {
      validationErrors.push(t("storeCreation.errors.domain_name_required"));
    }
    
    if (!storeData.phoneContact || storeData.phoneContact.trim() === "") {
      validationErrors.push(t("storeCreation.errors.phone_required"));
    }
    
    if (!storeData.emailContact || storeData.emailContact.trim() === "") {
      validationErrors.push(t("storeCreation.errors.email_required"));
    }
    
    if (!storeData.primaryColor || storeData.primaryColor.trim() === "") {
      validationErrors.push(t("storeCreation.errors.primary_color_required"));
    }
    
    if (!storeData.secondaryColor || storeData.secondaryColor.trim() === "") {
      validationErrors.push(t("storeCreation.errors.secondary_color_required"));
    }
    
    if (!storeData.accentColor || storeData.accentColor.trim() === "") {
      validationErrors.push(t("storeCreation.errors.accent_color_required"));
    }
    
    if (!storeData.font || storeData.font.trim() === "") {
      validationErrors.push(t("storeCreation.errors.font_required"));
    }
    
    if (!storeData.templateId) {
      validationErrors.push(t("storeCreation.errors.template_required"));
    }
    
    if (!storeData.logo) {
      validationErrors.push(t("storeCreation.errors.logo_required"));
    }
    
    if (storeData.socialMediaLinks.length === 0) {
      validationErrors.push(t("storeCreation.errors.social_media_required"));
    }
    
    if (!storeData.ownerId || storeData.ownerId === 0) {
      if (!ownerid) {
        validationErrors.push(t("storeCreation.errors.owner_id_required"));
      }
    }
    
    // إذا كان هناك أخطاء في التحقق، عرض رسالة خطأ وإيقاف عملية الإرسال
    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "));
      setIsSubmitting(false);
      return;
    }
    
    const formData = new FormData();

    formData.append("dominName", storeData.dominName);
    formData.append("phoneContact", storeData.phoneContact);
    formData.append("emailContact", storeData.emailContact);
    formData.append("businessType", storeData.businessType?.toString() || "0");
    formData.append("primaryColor", storeData.primaryColor);
    formData.append("secondaryColor", storeData.secondaryColor);
    formData.append("accentColor", storeData.accentColor);
    formData.append("font", storeData.font);
    formData.append("templateId", storeData.templateId?.toString() || "0");
    formData.append("typeStore", storeData.typeStore?.toString() || "0");
    
    // Only append logo if it exists
    if (storeData.logo) {
      formData.append("logo", storeData.logo);
    }
    
    // Use ownerid from customer state if available, otherwise use the one from storeData
    const effectiveOwnerId = ownerid || storeData.ownerId;
    formData.append("ownerId", effectiveOwnerId.toString());

    // socialMediaLinks كمصفوفة
    storeData.socialMediaLinks.forEach((link, idx) => {
      formData.append(`socialMediaLinks[${idx}][platform]`, link.platform);
      formData.append(`socialMediaLinks[${idx}][url]`, link.url);
    });

    try {
      console.log("Sending API request to:", EndPoints.createStore);
      console.log("Form data content:", {
        dominName: storeData.dominName,
        phoneContact: storeData.phoneContact,
        emailContact: storeData.emailContact,
        businessType: storeData.businessType?.toString() || "0",
        primaryColor: storeData.primaryColor,
        secondaryColor: storeData.secondaryColor,
        accentColor: storeData.accentColor,
        font: storeData.font,
        templateId: storeData.templateId?.toString() || "0",
        typeStore: storeData.typeStore?.toString() || "0",
        effectiveOwnerId: ownerid || storeData.ownerId,
        socialMediaLinks: storeData.socialMediaLinks
      });
      
      // When using FormData, the content type should be automatically set to multipart/form-data
      // but we'll make an explicit API call to ensure proper headers
      try {
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
      } catch (axiosError) {
        console.error("Axios request failed:", axiosError);
        throw axiosError;
      }
    } catch (err: unknown) {
      console.error("Store creation error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("حدث خطأ أثناء إنشاء المتجر");
      }
      
      
    } finally {
      setIsSubmitting(false);
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card title={t("storeCreation.store_details")}>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-neutral-500">
                  {t("storeCreation.domain_name")}
                </span>
                <p className="font-medium">{storeData.dominName}</p>
              </div>

              <div>
                <span className="text-sm text-neutral-500">
                  {t("storeCreation.business_type")}
                </span>
                <p className="font-medium">{storeData.businessType}</p>
              </div>

              <div>
                <span className="text-sm text-neutral-500">
                  {t("storeCreation.store_type")}
                </span>
                <p className="font-medium">
                  {storeData.typeStore === 0 
                    ? t("storeCreation.store_types.products") 
                    : t("storeCreation.store_types.services")}
                </p>
              </div>

              <div>
                <span className="text-sm text-neutral-500">
                  {t("storeCreation.contact_email")}
                </span>
                <p className="font-medium">{storeData.emailContact}</p>
              </div>

              <div>
                <span className="text-sm text-neutral-500">
                  {t("storeCreation.contact_phone")}
                </span>
                <p className="font-medium">{storeData.phoneContact}</p>
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
                  style={{ fontFamily: storeData.font }}>
                  {storeData.font}
                </p>
              </div>

              <div>
                <span className="text-sm text-neutral-500">
                  {t("storeCreation.color_scheme")}
                </span>
                <div className="flex space-x-2 mt-1">
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: storeData.primaryColor }}
                    title={t("storeCreation.primary_color")}
                  />
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: storeData.secondaryColor }}
                    title={t("storeCreation.secondary_color")}
                  />
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: storeData.accentColor }}
                    title={t("storeCreation.accent_color")}
                  />
                </div>
              </div>

              <div>
                <span className="text-sm text-neutral-500">
                  {t("storeCreation.template_id")}
                </span>
                <p className="font-medium">{storeData.templateId}</p>
              </div>
            </div>
          </Card>
        </div>

        <Card title={t("storeCreation.social_media_links")} className="mt-8">
          {storeData.socialMediaLinks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {storeData.socialMediaLinks.map((link, index) => (
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
            onClick={handleBack}
            className="btn btn-outline flex items-center"
            disabled={isSubmitting}>
            <ArrowLeft size={16} className="mr-2" />
            {t("storeCreation.back_to_colors")}
          </button>

          <button
            onClick={handleCreateStore}
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
      </div>
    </PageTransition>
  );
};

export default SectionCustomization;
