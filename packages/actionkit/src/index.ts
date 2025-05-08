import { ZodError } from "zod";

export const HttpStatus = {
  // 1xx Informational
  CONTINUE: 100,
  SWITCHING_PROTOCOLS: 101,
  PROCESSING: 102,
  EARLY_HINTS: 103,

  // 2xx Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NON_AUTHORITATIVE_INFORMATION: 203,
  NO_CONTENT: 204,
  RESET_CONTENT: 205,
  PARTIAL_CONTENT: 206,
  MULTI_STATUS: 207,
  ALREADY_REPORTED: 208,
  IM_USED: 226,

  // 3xx Redirection
  MULTIPLE_CHOICES: 300,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  SEE_OTHER: 303,
  NOT_MODIFIED: 304,
  USE_PROXY: 305,
  TEMPORARY_REDIRECT: 307,
  PERMANENT_REDIRECT: 308,

  // 4xx Client Error
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  IM_A_TEAPOT: 418,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_ENTITY: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  TOO_EARLY: 425,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,

  // 5xx Server Error
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  VARIANT_ALSO_NEGOTIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  LOOP_DETECTED: 508,
  NOT_EXTENDED: 510,
  NETWORK_AUTHENTICATION_REQUIRED: 511,
} as const;

type HttpStatusCode = (typeof HttpStatus)[keyof typeof HttpStatus];

export class HttpException extends Error {
  status: HttpStatusCode;
  override message: string;
  error?: any;

  constructor(message: string, status: HttpStatusCode, error?: any) {
    super(message);
    this.status = status;
    this.message = message;
    this.error = error;
    this.name = "HttpException";
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string = "Bad Request", error?: any) {
    super(message, 400, error);
    this.name = "BadRequestException";
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message: string = "Internal Server Error", error?: any) {
    super(message, 500, error);
    this.name = "InternalServerErrorException";
  }
}

export type ServerActionError = string | object | ZodError | HttpException;

export interface ServerActionResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: ServerActionError;
}

export async function handleAction<T, Args extends any[] = any[]>(
  fn: (...args: Args) => Promise<T>,
  ...args: Args
): Promise<ServerActionResponse<T>> {
  try {
    const data: T = await fn(...args);
    return {
      success: true,
      message: "Operation successful",
      data,
    };
  } catch (error: any) {
    if (error instanceof ZodError) {
      return {
        success: false,
        message: "Validation Error",
        error: error,
      };
    }

    if (error instanceof HttpException) {
      return {
        success: false,
        message: error.message,
        error: {
          status: error.status,
          message: error.message,
          error: error.error,
        },
      };
    }

    return {
      success: false,
      message: error?.message || "Internal Server Error",
      error,
    };
  }
}
