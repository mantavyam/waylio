export interface ApiError {
  error: {
    code: string;       // Unique error code (e.g., "APPT_001", "AUTH_401")
    message: string;    // Human-readable, non-technical error description
    details?: Record<string, any>; // Optional validation/debug details
    timestamp: string;
    requestId: string;
  };
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError['error'];
  success: boolean;
}
