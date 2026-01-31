/**
 * Function used to modify a request before it is sent.
 */
export type RequestInterceptor = (
  config: HttpRequestConfig,
) => Promise<HttpRequestConfig> | HttpRequestConfig;

/**
 * Function used to transform a response before returning it.
 */
export type ResponseInterceptor<T = unknown> = (
  response: HttpResponse<T>,
) => Promise<HttpResponse<T>> | HttpResponse<T>;

/**
 * Function used to handle errors.
 */
export type ErrorInterceptor = (error: unknown) => Promise<unknown> | unknown;

/**
 * Extended request configuration.
 */
export interface HttpRequestConfig extends RequestInit {
  /** Override base URL */
  baseUrl?: string;

  /** Query parameters */
  params?: Record<string, string | number | boolean | undefined>;

  /** Disable JSON serialization */
  rawBody?: boolean;

  /** Skip auth header */
  skipAuth?: boolean;

  /** Abort controller signal */
  signal?: AbortSignal | null;

  /** Next.js fetch options */
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

/**
 * Normalized HTTP response.
 */
export interface HttpResponse<T> {
  data: T;
  status: number;
  headers: Headers;
  raw: Response;
}

// const api = createServerHttpClient();

// const { data, status } = await api.get<User[]>("/users", {
//   params: { page: 1, limit: 20 },
//   next: { tags: ["users"] },
// });
