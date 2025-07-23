
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../Store/Store";
import { useTranslation } from "react-i18next";

export default function OrderDetailsPage() {
  const { t } = useTranslation();
  const { orderId } = useParams<{ orderId: string }>();
  
  const orders = useSelector((state: RootState) => state.currentStore.orders.orders);
  const order = orders.find(order => order.id === orderId);
  console.log(order);

  return (
    <div>
      <h1>{t('orders.order_details')}</h1>
      <p>{t('orders.order_id')}: {order?.id}</p>
      <p>{t('orders.order_date')}: {order?.createdAt}</p>
      <p>{t('orders.order_status')}: {order?.customersStore}</p>
      <p>{t('orders.order_total')}: {order?.isPaid ? t('orders.paid') : t('orders.not_paid')}</p>
    </div>
  );
}