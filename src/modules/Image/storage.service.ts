// import fs from 'fs/promises';
// import path from 'path';

// interface UploadResult {
//   url: string;
//   originalName: string;
// }

// export class StorageService {
//   private uploadDir = path.join(__dirname, '../../..');

//   async upload(file: Express.Multer.File): Promise<UploadResult> {
//     return { url: `/uploads/${file.filename}`, originalName: file.originalname };
//   }

//   async uploadExternal(file: Buffer, filename: string): Promise<UploadResult> {
//     const url = `/${filename}`;
//     return { url, originalName: filename };
//   }

//   async deleteFile(filePath: string) {
//     try {
//       await fs.unlink(path.join(this.uploadDir, filePath));
//     } catch (err: any) {
//       if (err.code !== 'ENOENT') {
//         console.error('Error deleting file:', err);
//       }
//     }
//   }
  
//   // async delete(fileUrl: string) {
//   //   const key = extractKeyFromUrl(fileUrl);
//   //   await s3.deleteObject({ Bucket: 'my-bucket', Key: key }).promise();
//   // }
// }

// --------------------------------------------------------------------------------------

import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

export class StorageService {
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  private bucket = process.env.SUPABASE_BUCKET || 'images';

  async upload(file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file provided');
    }

    const ext = file.originalname.split('.').pop();
    const fileName = `${randomUUID()}.${ext}`;
    const filePath = `${fileName}`;

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error(error);
      throw new Error('Failed to upload image to Supabase');
    }

    const { data } = this.supabase.storage
      .from(this.bucket)
      .getPublicUrl(filePath);

    return {
      url: data.publicUrl,
      originalName: file.originalname,
    };
  }

  async deleteFile(publicUrl: string) {
    const bucketUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${this.bucket}/`;
    const path = publicUrl.replace(bucketUrl, '');

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .remove([path]);

    if (error) {
      console.error('Failed to delete file from Supabase:', error);
    }
  }
}
