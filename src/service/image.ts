import multer, { Options, FileFilterCallback } from 'multer';
import path from 'path';

interface File {
  originalname: string;
}

const imageValidation = multer({
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req: Express.Request, file: File, cb: FileFilterCallback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
      return cb(new Error('檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。'));
    }
    cb(null, true);
  },
});

export default imageValidation;
