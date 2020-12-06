import mailUtils from '@/includes/nodemailer/nodemailer';
import {checkReqErrors} from '@/includes/status';

export default (req, res) => {
  checkReqErrors({error: 'Access denied'}, res);
  if (req.method === 'GET') {
    mailUtils
      .findTemplates('./includes/nodemailer/template/')
      .then(files => {
        checkReqErrors({msg: files}, res);
      })
      .catch(error => checkReqErrors({error: error}, res));
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
