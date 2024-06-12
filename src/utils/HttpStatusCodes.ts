class HttpStatusCodes {
  // Informational responses (100–199)
  static readonly CONTINUE = 100;
  static readonly SWITCHING_PROTOCOLS = 101;
  static readonly PROCESSING = 102;

  // Successful responses (200–299)
  static readonly OK = 200;
  static readonly CREATED = 201;
  static readonly ACCEPTED = 202;
  static readonly NON_AUTHORITATIVE_INFORMATION = 203;
  static readonly NO_CONTENT = 204;
  static readonly RESET_CONTENT = 205;
  static readonly PARTIAL_CONTENT = 206;
  static readonly MULTI_STATUS = 207;
  static readonly ALREADY_REPORTED = 208;
  static readonly IM_USED = 226;

  // Redirection messages (300–399)
  static readonly MULTIPLE_CHOICES = 300;
  static readonly MOVED_PERMANENTLY = 301;
  static readonly FOUND = 302;
  static readonly SEE_OTHER = 303;
  static readonly NOT_MODIFIED = 304;
  static readonly USE_PROXY = 305;
  static readonly TEMPORARY_REDIRECT = 307;
  static readonly PERMANENT_REDIRECT = 308;

  // Client error responses (400–499)
  static readonly BAD_REQUEST = 400;
  static readonly UNAUTHORIZED = 401;
  static readonly PAYMENT_REQUIRED = 402;
  static readonly FORBIDDEN = 403;
  static readonly NOT_FOUND = 404;
  static readonly METHOD_NOT_ALLOWED = 405;
  static readonly NOT_ACCEPTABLE = 406;
  static readonly PROXY_AUTHENTICATION_REQUIRED = 407;
  static readonly REQUEST_TIMEOUT = 408;
  static readonly CONFLICT = 409;
  static readonly GONE = 410;
  static readonly LENGTH_REQUIRED = 411;
  static readonly PRECONDITION_FAILED = 412;
  static readonly PAYLOAD_TOO_LARGE = 413;
  static readonly URI_TOO_LONG = 414;
  static readonly UNSUPPORTED_MEDIA_TYPE = 415;
  static readonly RANGE_NOT_SATISFIABLE = 416;
  static readonly EXPECTATION_FAILED = 417;
  static readonly I_AM_A_TEAPOT = 418;
  static readonly MISDIRECTED_REQUEST = 421;
  static readonly UNPROCESSABLE_ENTITY = 422;
  static readonly LOCKED = 423;
  static readonly FAILED_DEPENDENCY = 424;
  static readonly TOO_EARLY = 425;
  static readonly UPGRADE_REQUIRED = 426;
  static readonly PRECONDITION_REQUIRED = 428;
  static readonly TOO_MANY_REQUESTS = 429;
  static readonly REQUEST_HEADER_FIELDS_TOO_LARGE = 431;
  static readonly UNAVAILABLE_FOR_LEGAL_REASONS = 451;

  // Server error responses (500–599)
  static readonly INTERNAL_SERVER_ERROR = 500;
  static readonly NOT_IMPLEMENTED = 501;
  static readonly BAD_GATEWAY = 502;
  static readonly SERVICE_UNAVAILABLE = 503;
  static readonly GATEWAY_TIMEOUT = 504;
  static readonly HTTP_VERSION_NOT_SUPPORTED = 505;
  static readonly VARIANT_ALSO_NEGOTIATES = 506;
  static readonly INSUFFICIENT_STORAGE = 507;
  static readonly LOOP_DETECTED = 508;
  static readonly NOT_EXTENDED = 510;
  static readonly NETWORK_AUTHENTICATION_REQUIRED = 511;
}

export default HttpStatusCodes;
