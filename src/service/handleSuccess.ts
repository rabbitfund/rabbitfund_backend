import { Response } from 'express';

const handleSuccess = (res: Response, data: String | Array<any> | Object) => { 
  res.send({
    status: true,
    data
  }).end();
}

export default handleSuccess;