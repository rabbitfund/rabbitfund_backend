import createError from 'http-errors'
import File from '../model/fileModels'

type ImageCreate = {
  url: string
  path: string
}

async function doGetFiles() {
  const files = await File.find({})
  return files
}

async function doGetFile(fileId: string) {
  const file = await File.findById(fileId)
  if (!!file) {
    return file
  }
  throw createError(400, '找不到檔案')
}

async function doImageCreate(data: ImageCreate) {
  const file = await File.create({
    file_url: data.url,
    file_path: data.path,
  })
  return file
}

type ImageDelete = {
  file_Id: string
}

async function doImageDelete(data: ImageDelete) {
  const result = await File.deleteOne({
    _id: data.file_Id,
  })
  if (result.deletedCount === 1) {
    return result
  }
  throw createError(400, '找不到檔案')
}

function verifyFileId(fileId: string): boolean {
  // not sure if there is more restrictions
  return fileId.length === 24
}

export {
  doGetFiles,
  doGetFile,
  ImageCreate,
  doImageCreate,
  ImageDelete,
  doImageDelete,
  verifyFileId,
}
