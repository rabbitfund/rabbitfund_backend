import { Router } from 'express'
import { handleErrorAsync } from '../service/handleErrorAsync'
import { needAuth } from '../middleware/needAuth'
import imageValidation from '../service/image'
import {
  getImages,
  getImage,
  uploadImage,
  deleteImage,
} from '../controllers/upload'

const router = Router()

// 取得所有圖片
router.get('/Image', needAuth, handleErrorAsync(getImages))
// 取得特定圖片
router.get('/Image/:pid', handleErrorAsync(getImage))
// 上傳圖片
router.post('/Image', needAuth, imageValidation, handleErrorAsync(uploadImage))
// 刪除圖片
router.delete('/Image/:pid', needAuth, handleErrorAsync(deleteImage))

export default router
