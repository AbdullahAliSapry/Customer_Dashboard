import { AppDispatch } from "../Store/Store";
import { ApiClient } from "./ApiClient";
import { AnyAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { store } from "../Store/Store";
import { IResponseData } from "../interfaces/ResponseInterface";
import { setError } from "../Store/ErrorSlice";

interface ApiError {
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
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

export interface IApiRepository {
  getAll<T>(
    endpoint: string,
    successAction: (payload: T[] | T) => AnyAction
  ): Promise<void>;

  getById<T>(
    endpoint: string,
    id: string,
    successAction: (payload: T) => AnyAction
  ): Promise<void>;

  create<T>(
    endpoint: string,
    data: T,
    successAction: (payload?: T) => AnyAction
  ): Promise<void>;

  update<T>(
    endpoint: string,
    id: string,
    data: Partial<T>,
    successAction: (payload: T) => AnyAction
  ): Promise<void>;

  updatewithpatch<T>(
    endpoint: string,
    data: Partial<T>,
    successAction: (payload: T) => AnyAction
  ): Promise<void>;

  delete(
    endpoint: string,
    id: string,
    successAction: (payload: string) => AnyAction
  ): Promise<void>;
}

export class ApiRepository implements IApiRepository {
  private dispatch: AppDispatch;

  constructor() {
    this.dispatch = store.dispatch;
  }

  private handleError(error: unknown): void {
    if (isApiError(error)) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      const validationMessages = formatValidationErrors(
        error.response?.data || {}
      );
      console.log(`error ${error.response}`);

      const fullMessage = validationMessages
        ? `${errorMessage}\n${validationMessages}`
        : errorMessage;
      toast.error(fullMessage);
      // Dispatch error to store
      this.dispatch(
        setError({
          message: errorMessage,
          errors: error.response?.data?.errors,
        })
      );
    } else {
      const errorMessage = "An unexpected error occurred";
      toast.error(errorMessage);
      this.dispatch(setError({ message: errorMessage }));
    }
  }

  async getAll<T>(
    endpoint: string,
    successAction: (payload: T[] | T) => AnyAction
  ): Promise<void> {
    try {
      const response = await ApiClient.get<IResponseData<T[]>>(endpoint);
      console.log(response.data);
      if (response.data.data) {
        console.log(response.data.data);
        this.dispatch(successAction(response.data.data));
        toast.success(response.data.message || "Data fetched successfully");
      } else {
        const errorMessage = response.data.message || "Failed to fetch data";
        this.handleError({ response: { data: { message: errorMessage } } });
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async getById<T>(
    endpoint: string,
    id: string,
    successAction: (payload: T) => AnyAction
  ): Promise<void> {
    try {
      const response = await ApiClient.get<IResponseData<T>>(
        `${endpoint}/${id}`
      );
      if (response.data.isSuccess && response.data.data) {
        console.log(response.data.data);
        this.dispatch(successAction(response.data.data));
        toast.success(response.data.message || "Item fetched successfully");
      } else {
        const errorMessage = response.data.message || "Failed to fetch item";
        this.handleError({ response: { data: { message: errorMessage } } });
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async create<TRequest, TResponse>(
    endpoint: string,
    data: TRequest,
    successAction: (payload?: TResponse) => AnyAction
  ): Promise<void> {
    try {
      console.log(`Creating item at endpoint: ${endpoint}`);
      console.log("Request payload:", data);

      const response = await ApiClient.post<IResponseData<TResponse>>(endpoint, data);
      console.log("Create response received:", response);

      if (response.data.isSuccess) {
        if (response.data.data) {
          console.log("Dispatching success action with data:", response.data.data);
          this.dispatch(successAction(response.data.data));
        } else {
          console.log("Dispatching success action without data");
          this.dispatch(successAction());
        }
        toast.success(response.data.message || "Item created successfully");
      } else {
        const errorMessage = response.data.message || "Failed to create item";
        console.error("API reported failure:", errorMessage);
        this.handleError({ response: { data: { message: errorMessage } } });
      }
    } catch (error) {
      console.error("Error in create method:", error);
      this.handleError(error);
    }
  }

  async update<T>(
    endpoint: string,
    id: string,
    data: Partial<T>,
    successAction: (payload: T) => AnyAction
  ): Promise<void> {
    try {
      const response = await ApiClient.put<IResponseData<T>>(
        `${endpoint}/${id}`,
        data
      );
      if (response.data.isSuccess && response.data.data) {
        this.dispatch(successAction(response.data.data));
        toast.success(response.data.message || "Item updated successfully");
      } else {
        const errorMessage = response.data.message || "Failed to update item";
        this.handleError({ response: { data: { message: errorMessage } } });
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async updatewithpatch<T>(
    endpoint: string,
    data: Partial<T>,
    successAction: (payload: T) => AnyAction
  ): Promise<void> {
    try {
      const response = await ApiClient.patch<IResponseData<T>>(endpoint, data);
      if (response.data.isSuccess && response.data.data) {
        this.dispatch(successAction(response.data.data));
        toast.success(response.data.message || "Item updated successfully");
      } else {
        const errorMessage = response.data.message || "Failed to update item";
        this.handleError({ response: { data: { message: errorMessage } } });
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(
    endpoint: string,
    id: string,
    successAction: (payload: string) => AnyAction
  ): Promise<void> {
    try {
      const response = await ApiClient.delete<IResponseData<void>>(
        `${endpoint}/${id}`
      );
      if (response.data.isSuccess) {
        this.dispatch(successAction(id));
        toast.success(response.data.message || "Item deleted successfully");
      } else {
        const errorMessage = response.data.message || "Failed to delete item";
        this.handleError({ response: { data: { message: errorMessage } } });
      }
    } catch (error) {
      this.handleError(error);
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
