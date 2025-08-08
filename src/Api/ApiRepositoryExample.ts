import { ApiRepository, ErrorType, ErrorInfo } from './ApiRepository';
import { AnyAction } from '@reduxjs/toolkit';

// Example of how to use the updated ApiRepository with custom error actions

// Example 1: Using getAll with custom error handling
export const fetchCustomersWithCustomError = () => {
  const apiRepo = new ApiRepository();
  
  // Custom error action for customers
  const customerErrorAction = (errorInfo: ErrorInfo): AnyAction => ({
    type: 'customers/setError',
    payload: {
      message: errorInfo.message,
      type: errorInfo.type,
      errors: errorInfo.errors
    }
  });

  return apiRepo.getAll(
    '/customers',
    (customers) => ({ type: 'customers/setCustomers', payload: customers }),
    customerErrorAction
  );
};

// Example 2: Using create with validation error handling
export const createProductWithValidation = (productData: any) => {
  const apiRepo = new ApiRepository();
  
  const productErrorAction = (errorInfo: ErrorInfo): AnyAction => {
    switch (errorInfo.type) {
      case ErrorType.VALIDATION:
        return {
          type: 'products/setValidationErrors',
          payload: errorInfo.errors
        };
      case ErrorType.AUTHORIZATION:
        return {
          type: 'auth/requirePermission',
          payload: 'product_creation'
        };
      default:
        return {
          type: 'products/setError',
          payload: errorInfo.message
        };
    }
  };

  return apiRepo.create(
    '/products',
    productData,
    (product) => ({ type: 'products/addProduct', payload: product }),
    productErrorAction
  );
};

// Example 3: Using update with specific error handling
export const updateOrderWithStatusHandling = (orderId: string, orderData: any) => {
  const apiRepo = new ApiRepository();
  
  const orderErrorAction = (errorInfo: ErrorInfo): AnyAction => {
    if (errorInfo.type === ErrorType.NOT_FOUND) {
      return {
        type: 'orders/orderNotFound',
        payload: orderId
      };
    }
    
    if (errorInfo.statusCode === 409) {
      return {
        type: 'orders/conflictError',
        payload: 'Order has been modified by another user'
      };
    }
    
    return {
      type: 'orders/setError',
      payload: errorInfo.message
    };
  };

  return apiRepo.update(
    '/orders',
    orderId,
    orderData,
    (order) => ({ type: 'orders/updateOrder', payload: order }),
    orderErrorAction
  );
};

// Example 4: Using delete with confirmation error handling
export const deleteStoreWithConfirmation = (storeId: string) => {
  const apiRepo = new ApiRepository();
  
  const deleteErrorAction = (errorInfo: ErrorInfo): AnyAction => {
    if (errorInfo.type === ErrorType.AUTHORIZATION) {
      return {
        type: 'stores/deletePermissionDenied',
        payload: 'You need admin permissions to delete stores'
      };
    }
    
    if (errorInfo.message.includes('has active orders')) {
      return {
        type: 'stores/cannotDeleteWithOrders',
        payload: 'Cannot delete store with active orders'
      };
    }
    
    return {
      type: 'stores/setError',
      payload: errorInfo.message
    };
  };

  return apiRepo.delete(
    '/stores',
    storeId,
    (id) => ({ type: 'stores/removeStore', payload: id }),
    deleteErrorAction
  );
};

// Example 5: Using getById with not found handling
export const fetchProductById = (productId: string) => {
  const apiRepo = new ApiRepository();
  
  const productNotFoundAction = (errorInfo: ErrorInfo): AnyAction => {
    if (errorInfo.type === ErrorType.NOT_FOUND) {
      return {
        type: 'products/productNotFound',
        payload: {
          id: productId,
          message: 'Product not found or has been removed'
        }
      };
    }
    
    return {
      type: 'products/setError',
      payload: errorInfo.message
    };
  };

  return apiRepo.getById(
    '/products',
    productId,
    (product) => ({ type: 'products/setCurrentProduct', payload: product }),
    productNotFoundAction
  );
};

// Example 6: Using updatewithpatch with network error handling
export const updateUserProfile = (profileData: any) => {
  const apiRepo = new ApiRepository();
  
  const profileErrorAction = (errorInfo: ErrorInfo): AnyAction => {
    if (errorInfo.type === ErrorType.NETWORK) {
      return {
        type: 'profile/networkError',
        payload: 'Please check your internet connection and try again'
      };
    }
    
    if (errorInfo.type === ErrorType.VALIDATION) {
      return {
        type: 'profile/validationError',
        payload: errorInfo.errors
      };
    }
    
    return {
      type: 'profile/setError',
      payload: errorInfo.message
    };
  };

  return apiRepo.updatewithpatch(
    '/profile',
    profileData,
    (profile) => ({ type: 'profile/updateProfile', payload: profile }),
    profileErrorAction
  );
}; 