import { Response } from 'express';

const handleError = (res: Response, err?: any) => {
  let message = '';
  if (err) {
    message = err.message;
  } else {
    message = "欄位未填寫正確或無此 id";
  }
  res
    .status(400)
    .send({
      status: true,
      message
    });
}

export default handleError;