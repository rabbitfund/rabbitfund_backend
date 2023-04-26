import { Response } from "express";

/* reply format:
{
  ok: boolean,  // true: success, false: error
  msg: string, // supplementary message
  data: string | array | object  // reply data depends on the request
}
*/

const handleSuccess = (
  res: Response,
  data: String | Array<any> | Object,
  msg: string = "success"
) => {
  res
    .send({
      ok: true,
      msg: msg,
      data,
    })
    .end();
};
// deprecated use createError instead
const handleError = (res: Response, err?: Error) => {
  let message = "error";
  if (err) {
    message = err.message;
  }

  res
    .status(400)
    .send({
      ok: false,
      msg: message,
    })
    .end();
};
// deprecated use createError instead
const handle401Error = (res: Response, msg: string = "Unauthorized") => {
  res
    .status(401)
    .send({
      ok: false,
      msg: msg,
    })
    .end();
};

export { handleSuccess, handleError, handle401Error };
