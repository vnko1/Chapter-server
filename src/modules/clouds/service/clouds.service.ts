import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import {
  ConfigAndUrlOptions,
  TransformationOptions,
  UploadApiOptions,
  v2 as clouds,
} from 'cloudinary';

import { AppService } from 'src/common/services';

import { CloudsResponse, DeleteOptions } from './clouds.type';

@Injectable()
export class CloudsService extends AppService {
  private getPublicIdFromUrl(url: string, sliceValue: number = -4) {
    return url.split('/').slice(sliceValue).join('/').split('.')[0];
  }

  async upload(
    filePath: string,
    options?: Partial<UploadApiOptions>,
  ): Promise<CloudsResponse> {
    try {
      return clouds.uploader.upload(filePath, options);
    } catch (error) {
      throw new ServiceUnavailableException(error.message);
    }
  }

  async delete(url: string, options?: Partial<DeleteOptions>) {
    try {
      const publicId = this.getPublicIdFromUrl(url, options?.sliceValue);
      console.log('🚀 ~ CloudsService ~ delete ~ publicId:', publicId);

      return await clouds.uploader.destroy(publicId, options);
    } catch (error) {
      throw new ServiceUnavailableException(error.message);
    }
  }

  async edit(
    url: string,
    options?: TransformationOptions | ConfigAndUrlOptions,
    sliceValue = -4,
  ) {
    const publicId = this.getPublicIdFromUrl(url, sliceValue);
    return clouds.url(publicId, options);
  }
}
