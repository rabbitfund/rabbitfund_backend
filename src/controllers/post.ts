import { Request, Response } from 'express';
import handleSuccess from '../service/handleSuccess';
import handleError from '../service/handleError';

import Posts from '../model/post'

const posts = {
  async getPosts(req: Request, res: Response) { 
    const allPosts = await Posts.find();
    handleSuccess(res, allPosts);
  },
  async createdPosts(req: Request, res: Response) {
    console.log(req)
    try {
      const { body } = req;

      if (body.content) {
        const newPost = await Posts.create({
          name: body.name,
          content: body.content,
          tags: body.tags,
          type: body.type
        })
        handleSuccess(res, newPost);
      } else {
        handleError(res);
      }
    } catch (err){
      handleError(res, err);
    }
  },
  async getPost(req: Request, res: Response) {
    const { id } = req.params;
    res.status(200).send(id);
  },
  async deletePost(req: Request, res: Response) {
    const { id } = req.params;
    if(!id) {
      res.status(400).send({
        status: false,
        message: '刪除失敗'
      });
    }
    res.status(200).send({
      status: true,
      message: '刪除成功'
    });
  }
}

export default posts;