import { v2 as clouds } from 'cloudinary';

export const CloudsProvider = {
  provide: 'Cloudinary',
  useFactory: () =>
    clouds.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    }),
};
