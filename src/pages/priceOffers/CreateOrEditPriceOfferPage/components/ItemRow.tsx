import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Button from "../../../../components/ui/Button";
import { PriceOfferItem } from "../../../../interfaces/StorePriceOffers";
import { IProduct } from "../../../../interfaces/ProductInterface";

interface ItemRowProps {
  item: PriceOfferItem;
  index: number;
  products: IProduct[];
  onRemove: (id: number) => void;
  onChange: (id: number, field: keyof PriceOfferItem, value: number | string) => void;
  calculateItemTotal: (item: PriceOfferItem) => number;
}

const ItemRow: React.FC<ItemRowProps> = ({
  item,
  index,
  products,
  onRemove,
  onChange,
  calculateItemTotal,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-gray-50 rounded-md p-4 flex flex-col md:flex-row items-center gap-3 shadow-sm border border-gray-200">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-3 w-full">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {t("priceOffers.product")}
          </label>
          <select
            className={`w-full border rounded-md px-2 py-2 focus:ring-1 focus:ring-primary-500 focus:border-transparent shadow-sm text-sm ${
              !item.productId || item.productId === 0 
                ? 'border-red-300 bg-red-50' 
                : 'border-gray-300'
            }`}
            value={item.productId}
            onChange={(e) =>
              onChange(
                item.id,
                "productId",
                Number(e.target.value)
              )
            }>
            <option value="">
              {t("priceOffers.selectProduct")}
            </option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {t("priceOffers.quantity")}
          </label>
          <input
            type="number"
            min={1}
            className="w-full border border-gray-300 rounded-md px-2 py-2 focus:ring-1 focus:ring-primary-500 focus:border-transparent shadow-sm text-sm"
            value={item.quantity}
            onChange={(e) =>
              onChange(
                item.id,
                "quantity",
                Number(e.target.value)
              )
            }
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {t("priceOffers.unitPrice")}
          </label>
          <input
            type="number"
            min={0}
            className="w-full border border-gray-300 rounded-md px-2 py-2 focus:ring-1 focus:ring-primary-500 focus:border-transparent shadow-sm text-sm"
            value={item.unitPrice}
            onChange={(e) =>
              onChange(
                item.id,
                "unitPrice",
                Number(e.target.value)
              )
            }
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {t("priceOffers.discount")}
          </label>
          <input
            type="number"
            min={0}
            className="w-full border border-gray-300 rounded-md px-2 py-2 focus:ring-1 focus:ring-primary-500 focus:border-transparent shadow-sm text-sm"
            value={item.discount}
            onChange={(e) =>
              onChange(
                item.id,
                "discount",
                Number(e.target.value)
              )
            }
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {t("priceOffers.itemTotal")}
          </label>
          <div className="font-medium text-primary-600 p-1 bg-primary-50 rounded-md text-center shadow-sm text-sm">
            {calculateItemTotal(item).toFixed(2)}{" "}
            {t("common.currency")}
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        className="text-red-500 hover:bg-red-100 h-8 w-8 rounded-full flex items-center justify-center"
        onClick={() => onRemove(item.id)}>
        <X size={16} />
      </Button>
    </motion.div>
  );
};

export default ItemRow; 