import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Button from "../../../../components/ui/Button";
import { PriceOfferItem } from "../../../../interfaces/StorePriceOffers";
import { IProduct } from "../../../../interfaces/ProductInterface";
import ItemRow from "./ItemRow";

interface ItemsSectionProps {
  items: PriceOfferItem[];
  products: IProduct[];
  onAddItem: () => void;
  onRemoveItem: (id: number) => void;
  onItemChange: (id: number, field: keyof PriceOfferItem, value: number | string) => void;
  calculateItemTotal: (item: PriceOfferItem) => number;
}

const ItemsSection: React.FC<ItemsSectionProps> = ({
  items,
  products,
  onAddItem,
  onRemoveItem,
  onItemChange,
  calculateItemTotal,
}) => {
  const { t } = useTranslation();

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-primary-600 flex items-center">
          {t("priceOffers.items")}
        </h2>
        <Button
          leftIcon={<Plus size={16} />}
          onClick={onAddItem}
          variant="primary"
          size="md">
          {t("priceOffers.addItem")}
        </Button>
      </div>
      <motion.div layout className="space-y-3">
        {items.map((item, idx) => (
          <ItemRow
            key={item.id}
            item={item}
            index={idx}
            products={products}
            onRemove={onRemoveItem}
            onChange={onItemChange}
            calculateItemTotal={calculateItemTotal}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default ItemsSection; 