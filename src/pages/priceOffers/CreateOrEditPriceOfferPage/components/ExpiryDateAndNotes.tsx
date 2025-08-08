import React from "react";
import { useTranslation } from "react-i18next";
import { Calendar } from "lucide-react";

interface ExpiryDateAndNotesProps {
  expiryDate: string;
  setExpiryDate: (date: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
}

const ExpiryDateAndNotes: React.FC<ExpiryDateAndNotesProps> = ({
  expiryDate,
  setExpiryDate,
  notes,
  setNotes,
}) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          {t("priceOffers.expiryDate")}
        </label>
        <div className="relative">
          <Calendar
            className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500"
            size={18}
          />
          <input
            type="date"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          {t("priceOffers.notes")}
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[80px] shadow-sm"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t("priceOffers.notesPlaceholder") || ""}
        />
      </div>
    </div>
  );
};

export default ExpiryDateAndNotes; 