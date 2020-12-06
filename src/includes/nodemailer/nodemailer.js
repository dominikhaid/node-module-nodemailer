const nodemailer = require('nodemailer');
const SMTPConnection = require('nodemailer/lib/smtp-connection');
const fs = require('fs');
/**
 *
 * @param {string} mailTo - mail reciver
 * @param {string} mailSub - mail subject string
 * @param {string} mailReplay - mail replay to string
 * @param {string} mailHtmlBoy - html msg body as string
 * @param {array} attch - [{filename: 'text3.txt',content:'text'||path: '/path/to/}]
 */

async function newMail(req, res) {
  let transporter = nodemailer.createTransport({
    host: process.env.MailServer,
    port: Number(process.env.MailServerPort),
    secure: Number(process.env.MailServerTLS), // true for 465, false for other ports
    auth: {
      user: process.env.MailServerUser,
      pass: process.env.MailServerPw,
    },
  });

  async function run() {
    let info = await transporter.sendMail({
      from: process.env.MailSender,
      to: req.body.to ? req.body.to : null,
      subject: req.body.subject ? req.body.subject : 'Kein Betreff',
      replyTo: req.body.replay ? req.body.replay : null,
      html: req.body.html ? req.body.html : null,
      attachments: req.body.files ? JSON.parse(req.body.files) : null,
    });
    return info;
  }

  return run();
}

module.exports.newMail = newMail;

/**
 *
 * @param {string} mailTo - mail reciver
 * @param {string} mailSub - mail subject string
 * @param {string} mailReplay - mail replay to string
 * @param {string} mailHtmlBoy - html msg body as string
 * @param {array} attch - [{filename: 'text3.txt',content:'text'||path: '/path/to/}]
 */

async function templateMail(req, res, template) {
  let transporter = nodemailer.createTransport({
    host: process.env.MailServer,
    port: Number(process.env.MailServerPort),
    secure: Number(process.env.MailServerTLS), // true for 465, false for other ports
    auth: {
      user: process.env.MailServerUser,
      pass: process.env.MailServerPw,
    },
  });

  let info = await transporter.sendMail({
    from: process.env.MailSender,
    to: req.body.to ? req.body.to : null,
    subject: req.body.subject ? req.body.subject : 'Keinn Betreff',
    replyTo: req.body.replay ? req.body.replay : null,
    html: req.body.html ? req.body.html : null,
    attachments: req.body.files ? JSON.parse(req.body.files) : null,
  });

  return info;
}

module.exports.templateMail = templateMail;

/**
 *
 * @param {Object} req rquest
 * @param {Object} res response
 */
async function testMail(req, res) {
  let transporter = {
    host: process.env.MailServer,
    port: 587,
    secure: false,
    // debug: true,
    // logger: true,
  };

  let connection = new SMTPConnection(transporter);
  var event = connection;

  event.on('connect', function (connect) {
    connection.close();
    // return;
  });

  event.on('end', function (end) {});

  event.on('error', function (error) {
    return {error: error};
  });

  let info = await connection.connect();

  return {
    msg: {
      satage: connection.stage,
      host: connection.options.host,
      port: connection.options.port,
      secure: connection.options.secure,
    },
  };
}

module.exports.testMail = testMail;

async function findTemplates(p) {
  const files = await fs.promises.readdir(p, {});

  if (files) return files;
  return 'No Templates found';
}

module.exports.findTemplates = findTemplates;

async function loadTemplate(p) {
  const file = fs.promises.readFile(p, 'utf8', (err, data) => {
    if (err) console.debug({error: 'Template konnte nicht geladen werden'});
    return data;
  });

  if (!file) return {error: 'Template nicht gefunden'};
  return file;
}

module.exports.loadTemplate = loadTemplate;
