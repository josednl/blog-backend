import fs from 'fs/promises';
import path from 'path';

interface UploadResult {
  url: string;
  originalName: string;
}

export class StorageService {
  private uploadDir = path.join(__dirname, '../../..');

  async upload(file: Express.Multer.File): Promise<UploadResult> {
    return { url: `/uploads/${file.filename}`, originalName: file.originalname };
  }

  async uploadExternal(file: Buffer, filename: string): Promise<UploadResult> {
    const url = `/${filename}`;
    return { url, originalName: filename };
  }

  async deleteFile(filePath: string) {
    try {
      await fs.unlink(path.join(this.uploadDir, filePath));
    } catch (err: any) {
      if (err.code !== 'ENOENT') {
        console.error('Error deleting file:', err);
      }
    }
  }
  
  // async delete(fileUrl: string) {
  //   const key = extractKeyFromUrl(fileUrl);
  //   await s3.deleteObject({ Bucket: 'my-bucket', Key: key }).promise();
  // }
}
