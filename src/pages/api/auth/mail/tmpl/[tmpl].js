import mailUtils from '@/includes/nodemailer/nodemailer';
import {checkReqErrors} from '@/includes/status';

export default (req, res) => {
  const {
    query: {tmpl},
  } = req;

  if (req.method === 'POST') {
    if (!req.headers.to || !tmpl) {
      return {error: 'Kein EmpfÃ¤nger angegeben'};
    }
    mailUtils
      .loadTemplate(`./includes/nodemailer/template/${tmpl}.html`)
      .then(data => {
        mailUtils.templateMail(req, res, data).then(e => {
          checkReqErrors(e, res);
        });
      })
      .catch(error => {
        checkReqErrors({error: error}, res);
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
