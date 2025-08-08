import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "./Modal";
import { IShippingData } from "../../../interfaces/ShippingInterface";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store/Store";
import { useParams } from "react-router-dom";
import { ApiRepository } from "../../../Api/ApiRepository";
import { EndPoints } from "../../../Api/EndPoints";
import { ActivateShipping } from "../../../Store/StoreSlice/ShippingSlice";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MapPin,
  TruckIcon,
  Home,
  Navigation,
  Info,
  Check,
  Loader2,
  Mail,
  Phone
} from "lucide-react";

interface ShippingModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => void;
}

const ShippingModal: React.FC<ShippingModalProps> = ({
  setIsOpen,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const userid = useSelector((state: RootState) => state.Auth.user?.userId || "");
  const { storeId } = useParams();
  const apirepository = new ApiRepository();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const validationSchema = Yup.object({
    address: Yup.object({
      streetInfo: Yup.string().required(
        "shippingModal.errors.streetInfo_required"
      ),
      city: Yup.string().required("shippingModal.errors.city_required"),
      district: Yup.string().required("shippingModal.errors.district_required"),
      flatFloor: Yup.string().required(
        "shippingModal.errors.flatFloor_required"
      ),
      splInstructions: Yup.string(),
    }),
    location: Yup.object({
      latitude: Yup.number().required("shippingModal.errors.latitude_required"),
      longitude: Yup.number().required(
        "shippingModal.errors.longitude_required"
      ),
    }),
    contact: Yup.object({
      email: Yup.string()
        .email("shippingModal.errors.email_invalid")
        .required("shippingModal.errors.email_required"),
      phoneNumber: Yup.string()
        .required("shippingModal.errors.phone_required")
        .matches(/^\+[0-9]+/, "shippingModal.errors.phone_format"),
    }),
  });

  const formik = useFormik<IShippingData>({
    initialValues: {
      address: {
        streetInfo: "",
        city: "",
        district: "",
        flatFloor: "",
        splInstructions: "",
      },
      location: {
        latitude: 0,
        longitude: 0,
      },
      contact: {
        email: "",
        phoneNumber: "+966",
      },
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        // إعادة تشكيل البيانات لتتوافق مع متطلبات الخادم
        const dataToSend = {
          ...values,
          // رفع بيانات الاتصال إلى المستوى الرئيسي
          email: values.contact.email,
          phoneNumber: values.contact.phoneNumber
        };
        
        console.log("Sending data to server:", dataToSend);
        
        const response = await apirepository.create(
          EndPoints.createShippingToStore(storeId?.toString() ?? "", userid),
          dataToSend,
          ActivateShipping
        );

        if (response != null) {
          setIsSubmitting(false);
          if (onSuccess) {
            onSuccess();
          }
          setIsOpen(false);
        } else {
          setIsSubmitting(false);
        }
      } catch (error) {
        console.error("Error activating shipping:", error);
        setIsSubmitting(false);
      }
    },
  });

  const isAddressComplete = () => {
    const { address } = formik.values;
    return (
      !!address.streetInfo &&
      !!address.city &&
      !!address.district &&
      !!address.flatFloor &&
      !formik.errors.address
    );
  };

  const isContactComplete = () => {
    const { contact } = formik.values;
    return (
      !!contact.email &&
      !!contact.phoneNumber &&
      !formik.errors.contact
    );
  };

  // التحقق فقط من صحة بيانات العنوان والاتصال قبل الانتقال للخطوة التالية، لكن لا يتم إرسالها للخادم
  const handleNextStep = () => {
    // التحقق من اكتمال بيانات العنوان والاتصال
    formik.validateField("address");
    formik.validateField("contact");

    // الانتقال للخطوة التالية فقط إذا كانت البيانات مكتملة
    if (isAddressComplete() && isContactComplete()) {
      setStep(2);
    }
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  return (
    <Modal setIsOpen={setIsOpen}>
      <div className="p-6 max-w-3xl mx-auto">
        {/* Header with animation */}
        <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
          <div className="bg-primary-50 p-3 rounded-full mr-4">
            <TruckIcon className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary-800">
              {t("shippingModal.title")}
            </h2>
            <p className="text-gray-600 text-sm">
              {t("shippingModal.description")}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1
                    ? "bg-primary-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}>
                {step > 1 ? <Check className="h-5 w-5" /> : "1"}
              </div>
              <span className="text-xs mt-1 text-gray-600">
                {t("shippingModal.address_step")}
              </span>
            </div>

            {/* Connecting line */}
            <div className="h-1 flex-1 mx-2 bg-gray-200 rounded">
              <div
                className="h-full bg-primary-600 rounded transition-all duration-300"
                style={{ width: step === 1 ? "0%" : "100%" }}
              />
            </div>

            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2
                    ? "bg-primary-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}>
                {step > 2 ? <Check className="h-5 w-5" /> : "2"}
              </div>
              <span className="text-xs mt-1 text-gray-600">
                {t("shippingModal.location_step")}
              </span>
            </div>
          </div>
        </div>

        <div className="animate-fade-in">
          {step === 1 && (
            <div className="space-y-4 mb-6">
              <div className="flex items-center mb-2">
                <Home className="h-5 w-5 text-primary-600 mr-2" />
                <h3 className="font-medium text-lg text-gray-700">
                  {t("shippingModal.address_title")}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="streetInfo"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    {t("shippingModal.streetInfo_label")} *
                  </label>
                  <input
                    type="text"
                    id="streetInfo"
                    name="address.streetInfo"
                    value={formik.values.address.streetInfo}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder={t("shippingModal.streetInfo_placeholder")}
                  />
                  {formik.touched.address?.streetInfo &&
                    formik.errors.address?.streetInfo && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <Info className="h-3 w-3 mr-1" />
                        {t(formik.errors.address.streetInfo)}
                      </p>
                    )}
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    {t("shippingModal.city_label")} *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="address.city"
                    value={formik.values.address.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder={t("shippingModal.city_placeholder")}
                  />
                  {formik.touched.address?.city &&
                    formik.errors.address?.city && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <Info className="h-3 w-3 mr-1" />
                        {t(formik.errors.address.city)}
                      </p>
                    )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="district"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    {t("shippingModal.district_label")} *
                  </label>
                  <input
                    type="text"
                    id="district"
                    name="address.district"
                    value={formik.values.address.district}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder={t("shippingModal.district_placeholder")}
                  />
                  {formik.touched.address?.district &&
                    formik.errors.address?.district && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <Info className="h-3 w-3 mr-1" />
                        {t(formik.errors.address.district)}
                      </p>
                    )}
                </div>

                <div>
                  <label
                    htmlFor="flatFloor"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    {t("shippingModal.flatFloor_label")} *
                  </label>
                  <input
                    type="text"
                    id="flatFloor"
                    name="address.flatFloor"
                    value={formik.values.address.flatFloor}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder={t("shippingModal.flatFloor_placeholder")}
                  />
                  {formik.touched.address?.flatFloor &&
                    formik.errors.address?.flatFloor && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <Info className="h-3 w-3 mr-1" />
                        {t(formik.errors.address.flatFloor)}
                      </p>
                    )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="splInstructions"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  {t("shippingModal.splInstructions_label")}
                </label>
                <textarea
                  id="splInstructions"
                  name="address.splInstructions"
                  value={formik.values.address.splInstructions}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  rows={3}
                  placeholder={t(
                    "shippingModal.splInstructions_placeholder"
                  )}></textarea>
              </div>

              <div className="mt-8">
                <div className="flex items-center mb-4">
                  <Mail className="h-5 w-5 text-primary-600 mr-2" />
                  <h3 className="font-medium text-lg text-gray-700">
                    {t("shippingModal.contact_title")}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1">
                      {t("shippingModal.email_label")} *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="contact.email"
                        value={formik.values.contact.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder={t("shippingModal.email_placeholder")}
                      />
                      <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-2" />
                    </div>
                    {formik.touched.contact?.email &&
                      formik.errors.contact?.email && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <Info className="h-3 w-3 mr-1" />
                          {t(formik.errors.contact.email)}
                        </p>
                      )}
                  </div>

                                      <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1">
                        {t("shippingModal.phone_label")} *
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          id="phone"
                          name="contact.phoneNumber"
                          value={formik.values.contact.phoneNumber}
                          onChange={(e) => {
                            let value = e.target.value;
                            // تأكد من أن القيمة تبدأ دائماً بـ +
                            if (!value.startsWith("+")) {
                              value = "+" + value.replace(/^\+*/g, "");
                            }
                            // تحديث القيمة
                            formik.setFieldValue("contact.phoneNumber", value);
                          }}
                          onBlur={formik.handleBlur}
                          className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                          placeholder="+966XXXXXXXXX"
                          dir="ltr"
                        />
                        <Phone className="h-5 w-5 text-gray-400 absolute left-3 top-2" />
                      </div>
                      {formik.touched.contact?.phoneNumber && formik.errors.contact?.phoneNumber && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <Info className="h-3 w-3 mr-1" />
                          {t(formik.errors.contact.phoneNumber)}
                        </p>
                      )}
                    </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 mb-6">
              <div className="flex items-center mb-2">
                <MapPin className="h-5 w-5 text-primary-600 mr-2" />
                <h3 className="font-medium text-lg text-gray-700">
                  {t("shippingModal.location_title")}
                </h3>
              </div>

              <div className="bg-primary-50 p-4 rounded-md mb-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-primary-600 mr-2 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    {t("shippingModal.location_info")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="latitude"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    {t("shippingModal.latitude_label")} *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      id="latitude"
                      name="location.latitude"
                      value={formik.values.location.latitude}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="0.0000"
                    />
                    <Navigation className="h-5 w-5 text-gray-400 absolute left-3 top-2" />
                  </div>
                  {formik.touched.location?.latitude &&
                    formik.errors.location?.latitude && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <Info className="h-3 w-3 mr-1" />
                        {t(formik.errors.location.latitude)}
                      </p>
                    )}
                </div>

                <div>
                  <label
                    htmlFor="longitude"
                    className="block text-sm font-medium text-gray-700 mb-1">
                    {t("shippingModal.longitude_label")} *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      id="longitude"
                      name="location.longitude"
                      value={formik.values.location.longitude}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="0.0000"
                    />
                    <Navigation className="h-5 w-5 text-gray-400 absolute left-3 top-2" />
                  </div>
                  {formik.touched.location?.longitude &&
                    formik.errors.location?.longitude && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <Info className="h-3 w-3 mr-1" />
                        {t(formik.errors.location.longitude)}
                      </p>
                    )}
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                <h4 className="font-medium text-gray-700 mb-2">
                  {t("shippingModal.address_summary")}
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">
                      {t("shippingModal.streetInfo_label")}:
                    </span>{" "}
                    {formik.values.address.streetInfo}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("shippingModal.city_label")}:
                    </span>{" "}
                    {formik.values.address.city}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("shippingModal.district_label")}:
                    </span>{" "}
                    {formik.values.address.district}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("shippingModal.flatFloor_label")}:
                    </span>{" "}
                    {formik.values.address.flatFloor}
                  </p>
                  {formik.values.address.splInstructions && (
                    <p>
                      <span className="font-medium">
                        {t("shippingModal.splInstructions_label")}:
                      </span>{" "}
                      {formik.values.address.splInstructions}
                    </p>
                  )}
                </div>

                <h4 className="font-medium text-gray-700 mb-2 mt-4">
                  {t("shippingModal.contact_summary")}
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="flex items-center">
                    <Mail className="h-4 w-4 text-primary-500 mr-2" />
                    <span className="font-medium">
                      {t("shippingModal.email_label")}:
                    </span>
                    <span className="ml-1">{formik.values.contact.email}</span>
                  </p>
                  <p className="flex items-center">
                    <Phone className="h-4 w-4 text-primary-500 mr-2" />
                    <span className="font-medium">
                      {t("shippingModal.phone_label")}:
                    </span>
                    <span className="ml-1">
                      {formik.values.contact.phoneNumber}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step === 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  disabled={isSubmitting}>
                  {t("shippingModal.cancel")}
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-4 py-2 bg-primary-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                  {t("shippingModal.next")}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  disabled={isSubmitting}>
                  {t("shippingModal.back")}
                </button>
                <button
                  type="button"
                  onClick={() => formik.handleSubmit()}
                  className="px-6 py-2 bg-primary-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors flex items-center"
                  disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t("shippingModal.activating")}
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      {t("shippingModal.activate")}
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ShippingModal;