import { AppDispatch } from "../Store/Store";
import { ApiClient } from "./ApiClient";
import { AnyAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { store } from "../Store/Store";
import { IResponseData } from "../interfaces/ResponseInterface";
import { setError } from "../Store/ErrorSlice";
import React from "react";

interface ApiError {
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
    status?: number;
  };
  message?: string;
}

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as ApiError).response === "object" &&
    (error as ApiError).response !== null &&
    "data" in (error as ApiError).response!
  );
}

function formatValidationErrors(errorObj: {
  errors?: Record<string, string[]>;
}): string {
  if (!errorObj.errors) return "";
  const messages: string[] = [];
  for (const [field, errors] of Object.entries(errorObj.errors)) {
    errors.forEach((msg) => {
      messages.push(`${field}: ${msg}`);
    });
  }
  return messages.join("\n");
}

// Error types for better categorization
export enum ErrorType {
  NETWORK = "NETWORK",
  VALIDATION = "VALIDATION",
  AUTHENTICATION = "AUTHENTICATION",
  AUTHORIZATION = "AUTHORIZATION",
  NOT_FOUND = "NOT_FOUND",
  SERVER_ERROR = "SERVER_ERROR",
  UNKNOWN = "UNKNOWN",
}

export interface ErrorInfo {
  type: ErrorType;
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

function categorizeError(error: ApiError): ErrorInfo {
  const statusCode = error.response?.status;
  const message =
    error.response?.data?.message || error.message || "An error occurred";
  const errors = error.response?.data?.errors;

  if (!statusCode) {
    return {
      type: ErrorType.NETWORK,
      message: "Network connection error",
      errors,
    };
  }

  switch (statusCode) {
    case 400:
      return {
        type: ErrorType.VALIDATION,
        message,
        errors,
        statusCode,
      };
    case 401:
      return {
        type: ErrorType.AUTHENTICATION,
        message: "Authentication required",
        errors,
        statusCode,
      };
    case 403:
      return {
        type: ErrorType.AUTHORIZATION,
        message: "Access denied",
        errors,
        statusCode,
      };
    case 404:
      return {
        type: ErrorType.NOT_FOUND,
        message: message,
        errors,
        statusCode,
      };
    case 500:
    case 502:
    case 503:
      return {
        type: ErrorType.SERVER_ERROR,
        message: "Server error occurred",
        errors,
        statusCode,
      };
    default:
      return {
        type: ErrorType.UNKNOWN,
        message,
        errors,
        statusCode,
      };
  }
}

export interface IApiRepository {
  getAll<T>(
    endpoint: string,
    successAction: (payload: T[] | T) => AnyAction,
    errorAction?: (payload: ErrorInfo) => AnyAction,
    showToast?: boolean
  ): Promise<void>;

  getById<T>(
    endpoint: string,
    id: string,
    successAction: (payload: T) => AnyAction,
    errorAction?: (payload: ErrorInfo) => AnyAction,
    showToast?: boolean
  ): Promise<void>;

  create<TRequest, TResponse>(
    endpoint: string,
    data: TRequest,
    successAction: (payload?: TResponse) => AnyAction,
    errorAction?: (payload: ErrorInfo) => AnyAction,
    showToast?: boolean
  ): Promise<void>;

  update<T>(
    endpoint: string,
    id: string,
    data: Partial<T>,
    successAction: (payload: T) => AnyAction,
    errorAction?: (payload: ErrorInfo) => AnyAction,
    showToast?: boolean
  ): Promise<void>;

  updatewithpatch<T>(
    endpoint: string,
    data: Partial<T>,
    successAction: (payload: T) => AnyAction,
    errorAction?: (payload: ErrorInfo) => AnyAction,
    showToast?: boolean
  ): Promise<void>;

  delete(
    endpoint: string,
    id: string,
    successAction: (payload: string) => AnyAction,
    errorAction?: (payload: ErrorInfo) => AnyAction,
    showToast?: boolean
  ): Promise<void>;
}

export class ApiRepository implements IApiRepository {
  private dispatch: AppDispatch;
  private showToasts: boolean;
  private static instance: ApiRepository | null = null;

  constructor(showToasts: boolean = true) {
    this.dispatch = store.dispatch;
    this.showToasts = showToasts;
  }

  // Singleton pattern to ensure only one instance
  static getInstance(showToasts: boolean = true): ApiRepository {
    if (!ApiRepository.instance) {
      ApiRepository.instance = new ApiRepository(showToasts);
    }
    return ApiRepository.instance;
  }

  // Method to create a new instance with different toast settings
  static createInstance(showToasts: boolean = true): ApiRepository {
    return new ApiRepository(showToasts);
  }

  // Method to disable toasts for this instance
  disableToasts(): void {
    this.showToasts = false;
  }

  // Method to enable toasts for this instance
  enableToasts(): void {
    this.showToasts = true;
  }

  private handleError(
    error: unknown,
    errorAction?: (payload: ErrorInfo) => AnyAction,
    showToast?: boolean
  ): void {
    let errorInfo: ErrorInfo;

    if (isApiError(error)) {
      errorInfo = categorizeError(error);
    } else {
      errorInfo = {
        type: ErrorType.UNKNOWN,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    }

    // Show toast based on error type only if toasts are enabled
    if (this.showToasts && showToast !== false) {
      switch (errorInfo.type) {
        case ErrorType.VALIDATION: {
          const validationMessages = formatValidationErrors({
            errors: errorInfo.errors,
          });
          const fullMessage = validationMessages
            ? `${errorInfo.message}\n${validationMessages}`
            : errorInfo.message;
          toast.error(fullMessage);
          break;
        }
        case ErrorType.AUTHENTICATION:
          toast.error("Please login again");
          break;
        case ErrorType.AUTHORIZATION:
          toast.error("You don't have permission to perform this action");
          break;
        case ErrorType.NETWORK:
          toast.error(
            "Network connection error. Please check your internet connection"
          );
          break;
        case ErrorType.SERVER_ERROR:
          toast.error("Server error. Please try again later");
          break;
        default:
          toast.error(errorInfo.message);
      }
    }

    // Dispatch custom error action if provided
    if (errorAction) {
      this.dispatch(errorAction(errorInfo));
    } else {
      // Fallback to default error handling
      this.dispatch(
        setError({
          message: errorInfo.message,
          errors: errorInfo.errors,
        })
      );
    }
  }

  async getAll<T>(
    endpoint: string,
    successAction: (payload: T[]) => AnyAction,
    errorAction?: (payload: ErrorInfo) => AnyAction,
    showToast?: boolean
  ): Promise<void> {
    try {
      const response = await ApiClient.get<IResponseData<T[]>>(endpoint);
      
      if (response.data.isSuccess) {
        this.dispatch(successAction(response.data.data));
        if (this.showToasts && showToast !== false) {
          toast.success(response.data.message || "Data fetched successfully");
        }
      } else {
        const errorInfo: ErrorInfo = {
          type: ErrorType.UNKNOWN,
          message: response.data.message || "Failed to fetch data",
        };
        if (errorAction) {
          this.dispatch(errorAction(errorInfo));
        } else {
          this.handleError({
            response: { data: { message: errorInfo.message } },
          }, errorAction, showToast);
        }
      }
    } catch (error) {
      console.error("ApiRepository.getAll - Error:", error);
      this.handleError(error, errorAction, showToast);
    }
  }

  async getById<T>(
    endpoint: string,
    id: string,
    successAction: (payload: T) => AnyAction,
    errorAction?: (payload: ErrorInfo) => AnyAction,
    showToast?: boolean
  ): Promise<void> {
    try {
      const response = await ApiClient.get<IResponseData<T>>(
        `${endpoint}/${id}`
      );
      if (response.data.isSuccess && response.data.data) {
        console.log(response.data.data);
        this.dispatch(successAction(response.data.data));
        if (this.showToasts && showToast !== false) {
          toast.success(response.data.message || "Item fetched successfully");
        }
      } else {
        const errorInfo: ErrorInfo = {
          type: ErrorType.NOT_FOUND,
          message: response.data.message || "Failed to fetch item",
        };
        if (errorAction) {
          this.dispatch(errorAction(errorInfo));
        } else {
          this.handleError({
            response: { data: { message: errorInfo.message } },
          }, errorAction, showToast);
        }
      }
    } catch (error) {
      this.handleError(error, errorAction, showToast);
    }
  }

  async create<TRequest, TResponse>(
    endpoint: string,
    data: TRequest,
    successAction: (payload?: TResponse) => AnyAction,
    errorAction?: (payload: ErrorInfo) => AnyAction,
    showToast?: boolean
  ): Promise<void> {
    try {
      console.log(`Creating item at endpoint: ${endpoint}`);
      console.log("Request payload:", data);
      const response = await ApiClient.post<IResponseData<TResponse>>(
        endpoint,
        data
      );

      if (response.data.isSuccess) {
        if (response.data.data) {
          console.log(
            "Dispatching success action with data:",
            response.data.data
          );
          this.dispatch(successAction(response.data.data));
        }
        if (this.showToasts && showToast !== false) {
          toast.success(response.data.message || "Item created successfully");
        }
      } else {
        const errorInfo: ErrorInfo = {
          type: ErrorType.VALIDATION,
          message: response.data.message || "Failed to create item",
        };
        if (errorAction) {
          this.dispatch(errorAction(errorInfo));
        } else {
          this.handleError({
            response: { data: { message: errorInfo.message } },
          }, errorAction, showToast);
        }
      }
    } catch (error) {
      console.error("Error in create method:", error);
      this.handleError(error, errorAction, showToast);
    }
  }

  async update<T>(
    endpoint: string,
    id: string,
    data: Partial<T>,
    successAction: (payload: T) => AnyAction,
    errorAction?: (payload: ErrorInfo) => AnyAction,
    showToast?: boolean
  ): Promise<void> {
    try {
      const response = await ApiClient.put<IResponseData<T>>(
        `${endpoint}/${id}`,
        data
      );
      if (response.data.isSuccess && response.data.data) {
        this.dispatch(successAction(response.data.data));
        if (this.showToasts && showToast !== false) {
          toast.success(response.data.message || "Item updated successfully");
        }
      } else {
        const errorInfo: ErrorInfo = {
          type: ErrorType.VALIDATION,
          message: response.data.message || "Failed to update item",
        };
        if (errorAction) {
          this.dispatch(errorAction(errorInfo));
        } else {
          this.handleError({
            response: { data: { message: errorInfo.message } },
          }, errorAction, showToast);
        }
      }
    } catch (error) {
      this.handleError(error, errorAction, showToast);
    }
  }

  async updatewithpatch<T>(
    endpoint: string,
    data: Partial<T>,
    successAction: (payload: T) => AnyAction,
    errorAction?: (payload: ErrorInfo) => AnyAction,
    showToast?: boolean
  ): Promise<void> {
    try {
      const response = await ApiClient.patch<IResponseData<T>>(endpoint, data);
      if (response.data.isSuccess && response.data.data) {
        this.dispatch(successAction(response.data.data));
        if (this.showToasts && showToast !== false) {
          toast.success(response.data.message || "Item updated successfully");
        }
      } else {
        const errorInfo: ErrorInfo = {
          type: ErrorType.VALIDATION,
          message: response.data.message || "Failed to update item",
        };
        if (errorAction) {
          this.dispatch(errorAction(errorInfo));
        } else {
          this.handleError({
            response: { data: { message: errorInfo.message } },
          }, errorAction, showToast);
        }
      }
    } catch (error) {
      this.handleError(error, errorAction, showToast);
    }
  }

  async delete(
    endpoint: string,
    id: string,
    successAction: (payload: string) => AnyAction,
    errorAction?: (payload: ErrorInfo) => AnyAction,
    showToast?: boolean
  ): Promise<void> {
    try {
      const response = await ApiClient.delete<IResponseData<void>>(
        `${endpoint}/${id}`
      );
      if (response.data.isSuccess) {
        this.dispatch(successAction(id));
        if (this.showToasts && showToast !== false) {
          toast.success(response.data.message || "Item deleted successfully");
        }
      } else {
        const errorInfo: ErrorInfo = {
          type: ErrorType.UNKNOWN,
          message: response.data.message || "Failed to delete item",
        };
        if (errorAction) {
          this.dispatch(errorAction(errorInfo));
        } else {
          this.handleError({
            response: { data: { message: errorInfo.message } },
          }, errorAction, showToast);
        }
      }
    } catch (error) {
      this.handleError(error, errorAction, showToast);
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: T = await response.json();
      return result;
    } catch (error) {
      console.error("Error in get:", error);
      throw error;
    }
  }
}

// Utility functions for managing API calls and toasts
export class ApiManager {
  private static apiRepository: ApiRepository | null = null;

  static getApiRepository(showToasts: boolean = true): ApiRepository {
    if (!ApiManager.apiRepository) {
      ApiManager.apiRepository = new ApiRepository(showToasts);
    }
    return ApiManager.apiRepository;
  }

  static createApiRepository(showToasts: boolean = true): ApiRepository {
    return new ApiRepository(showToasts);
  }

  // Method to execute multiple API calls with only one success toast
  static async executeWithSingleToast<T>(
    apiCalls: Array<() => Promise<T>>,
    successMessage: string = "Operation completed successfully"
  ): Promise<T[]> {
    const results: T[] = [];
    
    for (const apiCall of apiCalls) {
      const result = await apiCall();
      results.push(result);
    }
    
    // Show single success toast
    toast.success(successMessage);
    return results;
  }

  // Method to batch API calls and show only one toast
  static async batchApiCalls<T>(
    apiCalls: Array<() => Promise<T>>,
    successMessage: string = "Operations completed successfully"
  ): Promise<T[]> {
    return ApiManager.executeWithSingleToast(apiCalls, successMessage);
  }
}

// React hook for managing API repository instances
export const useApiRepository = (showToasts: boolean = true) => {
  const [apiRepository] = React.useState(() => 
    ApiManager.getApiRepository(showToasts)
  );

  return apiRepository;
};
