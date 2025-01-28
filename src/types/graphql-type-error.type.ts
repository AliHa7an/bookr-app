export interface OriginalError {
    message: { constraints: string, property: string, value: any }[];
    statusCode: number;
    error: string;
  }
  
  interface FormattedErrorExtensions {
    code: string;
    originalError?: OriginalError;
  }
  
 export interface FormattedError {
    message: string;
    extensions: FormattedErrorExtensions;
  }