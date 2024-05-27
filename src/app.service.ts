import { Injectable, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class AppService {
  private readonly images: any[] = [];
  getHello(): string {
    return 'Hello World!';
  }

  upload(title: string, file: Express.Multer.File) {
    const upload = this.images.push({ title: title, file: file.path });
    return upload;
  }

  getFile(res: Response, filename: string): StreamableFile {
    const filePath = join(__dirname, './uploads/thumbnails', filename);

    if (!existsSync(filePath)) {
      res.status(404).json({ message: 'File not found' });
      return;
    }

    const file = createReadStream(filePath);
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    return new StreamableFile(file);
  }
}
