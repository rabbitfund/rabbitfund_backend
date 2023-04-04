import { Router } from 'express';
import PostsControllers from '../controllers/post';


const router = Router();

router.get('/', PostsControllers.getPosts);

router.post('/', PostsControllers.createdPosts);

router.get('/:id', PostsControllers.getPost);

router.delete('/:id', PostsControllers.deletePost);

export default router;