import mailUtils from '@/includes/nodemailer/nodemailer';
import {checkReqErrors} from '@/includes/status';

export default (req, res) => {
  if (req.method === 'GET') {
    mailUtils
      .testMail(req, res)
      .then(msg => {
        checkReqErrors(msg, res);
      })
      .catch(error => {
        checkReqErrors(error, res);
      });
  } else {
    checkReqErrors({error: 'No End Point to this Request'}, res);
  }
};

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};
