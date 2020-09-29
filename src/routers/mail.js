const express = require("express");
const router = express.Router();

const checkReqErrors = require("../includes/status").checkReqErrors;
const checkRole = require("../includes/status").checkRole;

const mailUtils = require("../includes/nodemailer/nodemailer");

router.get("/", (req, res) => {
  checkRole(req.userData.role, "admin") ||
    checkReqErrors({ error: "Access denied" }, res);
  mailUtils
    .testMail(req, res)
    .then((msg) => {
      checkReqErrors(msg, res);
    })
    .catch((error) => {
      checkReqErrors(error, res);
    });
});

router.post("/send", (req, res) => {
  checkRole(req.userData.role, "admin") ||
    checkReqErrors({ error: "Access denied" }, res);
  if (!req.headers.to) {
    checkReqErrors({ error: "Kein Empfänger angegeben" }, res);
  }
  mailUtils
    .newMail(req, res)
    .then((msg) => {
      checkReqErrors(msg, res);
    })
    .catch((error) => {
      checkReqErrors(error, res);
    });
});

router.param("name", function (req, res, next) {
  next();
});

router.get("/tmpl/", (req, res) => {
  checkRole(req.userData.role, "admin") ||
    checkReqErrors({ error: "Access denied" }, res);
  mailUtils
    .findTemplates(__dirname + "/../includes/nodemailer/template/")
    .then((files) => {
      checkReqErrors({ msg: files }, res);
    })
    .catch((error) => checkReqErrors({ error: error }, res));
});

router.post("/tmpl/:name", (req, res) => {
  checkRole(req.userData.role, "admin") ||
    checkReqErrors({ error: "Access denied" }, res);
  if (!req.headers.to || !req.params.name) {
    return { error: "Kein Empfänger angegeben" };
  }
  mailUtils
    .loadTemplate(`./template/${req.params.name}.html`)
    .then((data) => {
      mailUtils.templateMail(req, res, data).then((e) => {
        checkReqErrors(e, res);
      });
    })
    .catch((error) => {
      checkReqErrors({ error: error }, res);
    });
});

module.exports = router;
