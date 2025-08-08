import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Truck,
  Package,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../Store/Store";
import ShippingModal from "../components/forms/modals/ShippingModal";
import { ApiRepository } from "../Api/ApiRepository";
import { EndPoints } from "../Api/EndPoints";
import { useParams } from "react-router-dom";
import {
  checkShippingIsActive,
  setError,
} from "../Store/StoreSlice/ShippingSlice";

type OrderStatus = "delivered" | "in_transit" | "pending" | "failed";

interface ShippingOrder {
  id: string;
  trackingNumber: string;
  customer: string;
  date: string;
  status: OrderStatus;
  company: string;
  address: string;
}

const ShippingCompanyPage: React.FC = () => {
  const { t } = useTranslation();
  const isActivated = useSelector(
    (state: RootState) => state.currentStore.shipping.isActive
  );

  // This state will hold shipping orders when API integration is implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [orders, setOrders] = useState<ShippingOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const { storeId } = useParams();

 

  const api = new ApiRepository();
  const handleActivate = (): void => {
    setShowModal(true);
  };

  const handleShippingSuccess = () => {
    // API call would go here
    // Example: fetchShippingOrders().then(data => {
    //   setOrders(data);
    //   setIsLoading(false);
    // });
  };

  const handleRefresh = (): void => {
    setIsLoading(true);

  };

  useEffect(() => {
    if (storeId) {
      api.getById(
        EndPoints.checkShippingIsActive(storeId),
        "",
        checkShippingIsActive,
        setError
      );
    }
  }, [api, storeId]);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  const filteredOrders: ShippingOrder[] = orders.filter(
    (order) =>
      order.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: OrderStatus): JSX.Element => {
    switch (status) {
      case "delivered":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            {t("shipping.delivered")}
          </span>
        );
      case "in_transit":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700 flex items-center">
            <Truck className="w-3 h-3 mr-1" />
            {t("shipping.in_transit")}
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {t("shipping.pending")}
          </span>
        );
      case "failed":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 flex items-center">
            <XCircle className="w-3 h-3 mr-1" />
            {t("shipping.failed")}
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {t("shipping.unknown")}
          </span>
        );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-800 flex items-center">
          <Truck className="mr-2" /> {t("shipping.shipping_company")}
        </h1>
        <p className="text-gray-600 mt-1">
          {t("shipping.manage_shipping_providers")}
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md p-6 animate-slide-up">
        {/* Activation Section */}
        <div className="mb-8 border-b pb-6">
          <h2 className="text-lg font-semibold mb-4">
            {t("shipping.shipping_providers")}
          </h2>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="bg-gray-50 p-4 rounded-lg flex-grow">
              <div className="text-sm text-gray-700 mb-2">
                {t("shipping.activate_shipping_companies")}
              </div>
              <div className="text-sm text-gray-500">
                {isActivated ? (
                  <span className="text-primary-600 font-medium flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {t("shipping.shipping_providers_active")}
                  </span>
                ) : (
                  <span className="text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {t("shipping.shipping_providers_inactive")}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleActivate}
              disabled={isLoading || isActivated}
              className={`px-4 py-2 rounded-md text-white font-medium flex items-center transition-colors duration-200
                ${
                  isActivated
                    ? "bg-primary-500 cursor-not-allowed"
                    : "bg-primary-600 hover:bg-primary-700"
                }`}>
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {t("shipping.processing")}
                </>
              ) : isActivated ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {t("shipping.activated")}
                </>
              ) : (
                t("shipping.activate_shipping")
              )}
            </button>
          </div>

          {isActivated && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Shipping companies will be fetched from API and displayed here */}
            </div>
          )}
        </div>

        {/* Orders Section */}
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h2 className="text-lg font-semibold">
              {t("shipping.shipping_orders")}
            </h2>

            <div className="flex items-center mt-2 md:mt-0 space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t("shipping.search_orders")}
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-8 pr-4 py-2 border rounded-md text-sm w-full md:w-64"
                />
                <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
              </div>

              <button
                onClick={handleRefresh}
                className="p-2 rounded-md bg-gray-100 hover:bg-gray-200">
                <RefreshCw className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {isActivated ? (
            <>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="flex flex-col items-center">
                    <RefreshCw className="w-8 h-8 text-primary-500 animate-spin" />
                    <span className="mt-2 text-gray-600">
                      {t("shipping.loading_orders")}
                    </span>
                  </div>
                </div>
              ) : filteredOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t("shipping.order_id")}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t("shipping.tracking_number")}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t("shipping.customer")}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t("shipping.shipping_date")}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t("shipping.shipping_company")}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t("shipping.status")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                            {order.trackingNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <div>{order.customer}</div>
                            <div className="text-xs text-gray-500">
                              {order.address}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {order.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {order.company}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(order.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <div className="bg-primary-50 p-3 rounded-full mb-4">
                    <Package className="w-14 h-14 text-primary-500" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    {t("shipping.no_shipping_orders")}
                  </h3>
                  <p className="text-gray-600 text-center max-w-md mb-2">
                    {searchQuery
                      ? t("shipping.no_orders_match_search")
                      : t("shipping.shipping_active_no_orders")}
                  </p>
                  <p className="text-gray-500 text-sm text-center max-w-md">
                    {t("shipping.orders_will_appear_here")}
                  </p>
                  <button
                    onClick={handleRefresh}
                    className="mt-6 px-4 py-2 bg-primary-600 text-white rounded-md flex items-center hover:bg-primary-700 transition-colors">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {t("shipping.refresh")}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
              <Truck className="w-12 h-12 text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-700">
                {t("shipping.no_shipping_data")}
              </h3>
              <p className="text-gray-500 mt-1">
                {t("shipping.activate_to_view_orders")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Shipping Activation Modal */}
      {showModal && (
        <ShippingModal
          setIsOpen={setShowModal}
          onSuccess={handleShippingSuccess}
        />
      )}
    </div>
  );
};

export default ShippingCompanyPage;
