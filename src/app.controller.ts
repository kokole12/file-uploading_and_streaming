import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/thumbnails',
        filename: (req, file, callback) => {
          const uniqSuff =
            Date.now() +
            '-' +
            Math.random().toFixed(9).toString().replace('.', '');
          const ext = extname(file.originalname);
          const filename = `${file.originalname}-${uniqSuff}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  upload(title: string, @UploadedFile() file: Express.Multer.File) {
    return this.appService.upload(title, file);
  }

  @Get('image/:filename')
  getImage(
    @Res({ passthrough: true }) res: Response,
    @Param('filename') filename: string,
  ): StreamableFile {
    return this.appService.getFile(res, filename);
  }
}
