import {
  HttpRequestConfig,
  HttpResponse,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
} from "./types";

/**
 * Configuration for HttpClient instance.
 */
export interface HttpClientConfig {
  /** Default base URL */
  baseUrl: string;

  /** Returns auth token */
  getToken?: () => string | null | Promise<string | null>;

  /** Default headers */
  headers?: HeadersInit;

  /** Default fetch options */
  fetchOptions?: RequestInit;

  /** Serialize request body */
  serializeBody?: (body: unknown) => BodyInit;

  /** Parse response body */
  parseResponse?: <T>(res: Response) => Promise<T>;

  /** Interceptors */
  interceptors?: {
    request?: RequestInterceptor[];
    response?: ResponseInterceptor[];
    error?: ErrorInterceptor[];
  };
}

/**
 * Fully generic HTTP client.
 */
export class HttpClient {
  private config: HttpClientConfig;

  constructor(config: HttpClientConfig) {
    this.config = {
      serializeBody: JSON.stringify,
      parseResponse: async <T>(res: Response) => {
        if (res.status === 204) return null as T;
        return res.json();
      },
      ...config,
    };
  }

  /**
   * Execute an HTTP request.
   *
   * @template T Expected response data
   * @param url Relative or absolute URL
   * @param requestConfig Per-request configuration
   */
  async request<T>(
    url: string,
    requestConfig: HttpRequestConfig = {},
  ): Promise<HttpResponse<T>> {
    try {
      let config: HttpRequestConfig = {
        ...this.config.fetchOptions,
        ...requestConfig,
      };

      // Apply request interceptors
      for (const interceptor of this.config.interceptors?.request ?? []) {
        config = await interceptor(config);
      }

      const baseUrl = config.baseUrl ?? this.config.baseUrl;

      const query = config.params
        ? `?${new URLSearchParams(
            Object.entries(config.params)
              .filter(([, v]) => v !== undefined)
              .map(([k, v]) => [k, String(v)]),
          )}`
        : "";

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(this.config.headers as Record<string, string>),
        ...(config.headers as Record<string, string>),
      };

      if (!config.skipAuth) {
        const token = await this.config.getToken?.();
        if (token) headers["Authorization"] = `Bearer ${token}`;
      }

      const body =
        config.body && !config.rawBody
          ? this.config.serializeBody!(config.body)
          : config.body;

      const res = await fetch(`${baseUrl}${url}${query}`, {
        ...config,
        headers,
        body,
        credentials: config.credentials ?? "include",
      });

      if (!res.ok) {
        throw res;
      }

      let response: HttpResponse<T> = {
        data: await this.config.parseResponse!<T>(res),
        status: res.status,
        headers: res.headers,
        raw: res,
      };

      for (const interceptor of this.config.interceptors?.response ?? []) {
        response = (await interceptor(response)) as HttpResponse<T>;
      }

      return response;
    } catch (error) {
      for (const interceptor of this.config.interceptors?.error ?? []) {
        error = await interceptor(error);
      }
      throw error;
    }
  }

  get<T>(url: string, config?: HttpRequestConfig) {
    return this.request<T>(url, { ...config, method: "GET" });
  }

  post<T>(
    url: string,
    body?: unknown extends BodyInit ? unknown : BodyInit,
    config?: HttpRequestConfig,
  ) {
    return this.request<T>(url, { ...config, method: "POST", body });
  }

  put<T>(
    url: string,
    body?: unknown extends BodyInit ? unknown : BodyInit,
    config?: HttpRequestConfig,
  ) {
    return this.request<T>(url, { ...config, method: "PUT", body });
  }

  patch<T>(
    url: string,
    body?: unknown extends BodyInit ? unknown : BodyInit,
    config?: HttpRequestConfig,
  ) {
    return this.request<T>(url, { ...config, method: "PATCH", body });
  }

  delete<T>(url: string, config?: HttpRequestConfig) {
    return this.request<T>(url, { ...config, method: "DELETE" });
  }
}
