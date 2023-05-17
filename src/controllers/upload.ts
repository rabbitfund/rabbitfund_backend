import { NextFunction, Express, Request, RequestHandler, Response } from 'express'
// import { multer, MulterRequest } from 'multer'
import { v4 as uuidv4 } from 'uuid'
import { handleSuccess, handleError } from '../service/handleReply'
import createError from 'http-errors'
import firebaseAdmin from '../service/firebase'
import { GetSignedUrlConfig } from '@google-cloud/storage'
import {
  doGetFiles,
  doGetFile,
  doImageCreate,
  ImageCreate,
  doImageDelete,
  ImageDelete,
  verifyFileId,
} from './upload.bp'

export const getImages: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const files = await doGetFiles()
  return handleSuccess(res, files)
}

export const getImage: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const fileId = req.params.pid;
  // console.log(fileId);

  if (!verifyFileId(fileId)) {
    return next(createError(400, '找不到檔案'));
  }

  const file = await doGetFile(fileId);
  return handleSuccess(res, file);
}

export const uploadImage: RequestHandler = async (
  // req: MulterRequest,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.files) {
    throw createError(400, '尚未上傳檔案', next);
  } 
  const files = req.files as Express.Multer.File[];
  const file = files[0];

  const bucket = firebaseAdmin.storage().bucket()
  const path = `images/${uuidv4()}.${file.originalname.split('.').pop()}`
  const blob = bucket.file(path)
  const blobStream = blob.createWriteStream()

  blobStream.on('finish', () => {
    const config: GetSignedUrlConfig = {
      action: 'read',
      expires: '12-31-2500',
    }
    blob.getSignedUrl(config, async (err, fileUrl) => {
      if (fileUrl) {
        // console.log(fileUrl)
        const imageCreate: ImageCreate = {
          url: fileUrl,
          path: path,
        }
        const file = await doImageCreate(imageCreate)
        // console.log("test", file)
        res.send({
          file
        })
      } else {
        // 處理 fileUrl 為 undefined 的情況
        res.status(500).send('無效的URL')
      }
    })
  })

  blobStream.on('error', (err) => {
    res.status(500).send('上傳失敗')
    console.log(err.message)
  })

  blobStream.end(file.buffer)
}

export const deleteImage: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const fileId = req.params.pid
  // console.log(fileId);
  if (!verifyFileId(fileId)) {
    throw createError(400, '找不到檔案');
  }

  const file = await doGetFile(fileId);  
  // console.log(file);
  if (!file) {
    throw createError(400, '找不到檔案');
  }

  const bucket = firebaseAdmin.storage().bucket()
  const path: string = file.file_path
  // console.log(path)
  // try {
  const result = await bucket.file(path).delete()
  // console.log(result)
  const imageDelete: ImageDelete = {
    // file_Id: path,
    file_Id: file._id.toString(),
  }
  doImageDelete(imageDelete)
  return handleSuccess(res, `File ${path} has been deleted.`)
  // } catch (error) {
  //   const err: Error = {
  //     name: '',
  //     message: `Failed to delete file ${path}:${error.message}`,
  //   }
  //   console.error(error);
  //   return handleError(res, err)
  // }
}
