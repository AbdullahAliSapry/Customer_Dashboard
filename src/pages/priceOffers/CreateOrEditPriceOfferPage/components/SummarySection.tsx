import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { PriceOfferItem } from "../../../../interfaces/StorePriceOffers";

interface SummarySectionProps {
  items: PriceOfferItem[];
  calculateTotal: () => number;
  calculateTax: (total: number) => number;
  calculateGrandTotal: (total: number) => number;
}

const SummarySection: React.FC<SummarySectionProps> = ({
  items,
  calculateTotal,
  calculateTax,
  calculateGrandTotal,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gray-50 rounded-md p-4 mb-6 border border-gray-200 shadow-sm">
      <div className="text-sm font-medium text-gray-500 mb-1">
        {t("priceOffers.itemsCount")}: {items.length}
      </div>
      <div className="space-y-2 divide-y divide-gray-200">
        <div className="flex justify-between items-center py-1">
          <span className="text-gray-700">
            {t("priceOffers.subtotal")}:
          </span>
          <span className="font-medium">
            {calculateTotal().toFixed(2)} {t("common.currency")}
          </span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-gray-700">
            {t("priceOffers.taxRate")}:
          </span>
          <span className="font-medium">
            {calculateTax(calculateTotal()).toFixed(2)}{" "}
            {t("common.currency")}
          </span>
        </div>
        <div className="flex justify-between items-center pt-2">
          <span className="text-base font-bold text-primary-700">
            {t("priceOffers.grandTotal")}:
          </span>
          <span className="text-lg font-bold text-primary-700">
            {calculateGrandTotal(calculateTotal()).toFixed(2)}{" "}
            {t("common.currency")}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default SummarySection; 