import cloudinary, {UploadApiErrorResponse, UploadApiResponse} from 'cloudinary';


export  async function upload(file: string, public_id?: string, overwrite?: boolean, invalidate?: boolean ):  Promise<UploadApiErrorResponse | UploadApiResponse> {
    return new Promise((resolve)=>{
      cloudinary.v2.uploader.upload(file, {
        public_id,
        overwrite,
        invalidate
      },(error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined)=>{
        if(error) {
          resolve(error);
        };
        if(result) resolve(result);
      });
    });
}
