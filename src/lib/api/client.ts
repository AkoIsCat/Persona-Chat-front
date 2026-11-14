import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { clearAccessToken, getAccessToken } from '../auth/token';

type RequestConfig = InternalAxiosRequestConfig & {
  sentToken?: boolean;
};

export class ApiError extends Error {
  readonly status: number;
  readonly detail: unknown;

  constructor(status: number, detail: unknown) {
    super(formatApiDetail(detail));
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler;
}

function getBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL이 설정되지 않았습니다.');
  }

  return baseUrl.replace(/\/+$/, '');
}

function formatApiDetail(detail: unknown): string {
  if (typeof detail === 'string' && detail.trim()) {
    return detail;
  }

  if (Array.isArray(detail)) {
    const messages = detail.map((item) => {
      if (item && typeof item === 'object' && 'msg' in item) {
        return String(item.msg);
      }
      return String(item);
    });
    return (
      messages.filter(Boolean).join('\n') || '요청 값이 올바르지 않습니다.'
    );
  }

  return '요청을 처리하지 못했습니다.';
}

function readDetail(data: unknown) {
  if (data && typeof data === 'object' && 'detail' in data) {
    return data.detail;
  }
  return data;
}

export const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const request = config as RequestConfig;
  request.baseURL = getBaseUrl();

  const token = getAccessToken();
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
    request.sentToken = true;
  }

  if (typeof FormData !== 'undefined' && request.data instanceof FormData) {
    request.headers.delete('Content-Type');
  }

  return request;
});

apiClient.interceptors.response.use(
  (response) => {
    if (response.status === 204 || response.data === '') {
      response.data = null;
    }
    return response;
  },
  (error: AxiosError) => {
    if (!axios.isAxiosError(error) || !error.response) {
      return Promise.reject(error);
    }

    const request = error.config as RequestConfig | undefined;
    if (error.response.status === 401 && request?.sentToken) {
      clearAccessToken();
      unauthorizedHandler?.();
    }

    return Promise.reject(
      new ApiError(error.response.status, readDetail(error.response.data)),
    );
  },
);

type CallOptions = {
  signal?: AbortSignal;
};

export const api = {
  get: <T>(path: string, options?: CallOptions) =>
    apiClient.get<T>(path, options).then((response) => response.data),
  post: <T>(path: string, body?: unknown, options?: CallOptions) =>
    apiClient.post<T>(path, body, options).then((response) => response.data),
  put: <T>(path: string, body?: unknown, options?: CallOptions) =>
    apiClient.put<T>(path, body, options).then((response) => response.data),
  patch: <T>(path: string, body?: unknown, options?: CallOptions) =>
    apiClient.patch<T>(path, body, options).then((response) => response.data),
  delete: <T>(path: string, options?: CallOptions) =>
    apiClient.delete<T>(path, options).then((response) => response.data),
};
