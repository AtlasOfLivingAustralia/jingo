var express = require("express"),
  router = express.Router(),
  app = require("../lib/app").getInstance(),
  renderer = require('../lib/renderer'),
  fs = require("fs"),
  models = require("../lib/models"),
  multer = require("multer");

models.use(Git);

// File Uploads handler
var fileDestinationSubdir = '/assets';
var fileDestinationDir = app.locals.config.get("application").repository + fileDestinationSubdir;
var upload = multer({dest: fileDestinationDir});

router.get("/misc/syntax-reference", _getSyntaxReference);
router.post("/misc/preview", _postPreview);
router.get("/misc/existence", _getExistence);
router.get("/misc/upload-form", _getUploadForm);
router.post("/misc/upload-file", upload.single('file'), _postUploadFile);
app.use('/assets', express.static(fileDestinationDir));

function _getSyntaxReference(req, res) {
  res.render('syntax');
}

function _postPreview(req, res) {
  res.render('preview', {
    content: renderer.render(req.body.data)
  });
}

function _getExistence(req, res) {

  if (!req.query.data) {
    res.send(JSON.stringify({data: []}));
    return;
  }

  var result = [],
    page,
    n = req.query.data.length;

  req.query.data.forEach(function (pageName, idx) {
    (function (name, index) {
      page = new models.Page(name);
      if (!fs.existsSync(page.pathname)) {
        result.push(name);
      }
      if (index == (n - 1)) {
        res.send(JSON.stringify({data: result}));
      }
    })(pageName, idx);
  });
}

function _getUploadForm(req, res) {
  res.render('upload-form');
}

function _postUploadFile(req, res, next) {
  if (!res.locals.user) {
    res.redirect('/login');
  }

  var fileName = req.file.originalname;
  var newFile = app.locals.config.get("application").repository + fileDestinationSubdir + '/' + fileName;
  var tempFile = req.file.path;

  //TODO validate file does not already exist

  fs.readFile(tempFile, function (err, data) {
    fs.writeFile(newFile, data, function (err) {
      fs.unlink(tempFile, function () {
        var git_msg = req.body.fileMessage;
        Git.add('..' + fileDestinationSubdir + '/' + fileName, git_msg, req.user.asGitAuthor, function (err) {
        });
        var responseMessage = 'File uploaded to: <pre>' + fileDestinationSubdir + '/' + fileName + '</pre>';
        res.render('upload-form', {message: responseMessage});
      });
    });
  });

}

router.all('*', function (req, res) {
  res.locals.title = "404 - Not found";
  res.statusCode = 404;
  res.render('404.jade');
});

module.exports = router;
