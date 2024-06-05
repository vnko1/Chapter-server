import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

export type CloudsResponse = UploadApiResponse | UploadApiErrorResponse;

export type DeleteOptions = {
  sliceValue?: number;
  resource_type?: string;
  type?: string;
  notification_url: string;
  invalidate?: boolean;
};
