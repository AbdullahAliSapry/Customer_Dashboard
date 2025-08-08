import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Truck } from "lucide-react";
import ShippingModal from "./forms/modals/ShippingModal";
import { RootState } from "../Store/Store";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

interface ShippingActivationProps {
  storeId: string;
  userId: string;
  isShippingActive?: boolean;
  onShippingActivated?: () => void;
}

const ShippingActivation: React.FC<ShippingActivationProps> = ({
  storeId,
  userId,
  isShippingActive = false,
  onShippingActivated,
}) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);


  const handleActivateSuccess = () => {
    if (onShippingActivated) onShippingActivated();
  };

  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-3 rounded-full">
            <Truck className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {t("shippingActivation.title")}
            </h3>
            <p className="text-gray-600 text-sm">
              {isShippingActive
                ? t("shippingActivation.active_message")
                : t("shippingActivation.inactive_message")}
            </p>
          </div>
        </div>

        {!isShippingActive && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
            {t("shippingActivation.activate_button")}
          </button>
        )}

        {isShippingActive && (
          <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
            {t("shippingActivation.active_status")}
          </span>
        )}
      </div>

      {showModal && (
        <ShippingModal
          setIsOpen={setShowModal}
          storeId={storeId}
          userId={userId}
          onSuccess={handleActivateSuccess}
        />
      )}
    </div>
  );
};

export default ShippingActivation;
