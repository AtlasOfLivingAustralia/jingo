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
var docSubdir = app.locals.config.get("application").docSubdir;
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

  if (req.file) {
    var fileName = req.file.originalname;
    var newFile = app.locals.config.get("application").repository + fileDestinationSubdir + '/' + fileName;
    var tempFile = req.file.path;

    // TODO validate file extension

    //Validate file does not already exist
    var overwriteFlag = req.body.overwriteFlag ? Boolean(req.body.overwriteFlag) : false;
    if (overwriteFlag) {
      // If the user has requested to overwrite the file
      saveFileOnDisk();
    } else {
      fs.stat(newFile, function (err, stat) {
        if (err == null) {
          // If file exist
          var responseMessage = 'There is already a file with the same name in the system.<br/><i class="fa fa-warning"></i> Please introduce the file details again and confirm that you want to overwrite the existing file.';
          res.render('upload-form', {message: responseMessage, success: false, overwriteConfirmation: true});
        } else if (err.code == 'ENOENT') {
          // If file does not exist
          saveFileOnDisk();
        }
      });
    }
  } else {
    // No file attached to form submission
    var responseMessage = 'Please make sure that you select a file to upload.';
    res.render('upload-form', {message: responseMessage, success: false});
  }
  function saveFileOnDisk() {
    fs.readFile(tempFile, function (err, data) {
      fs.writeFile(newFile, data, function (err) {
        fs.unlink(tempFile, function () {
          var git_msg = req.body.fileMessage;
          // TODO this code assumes that if the administrator chose to use a docs subdir, this will be one subdirectory level only
          Git.add(docSubdir ? '..' : '' + fileDestinationSubdir + '/' + fileName, git_msg, req.user.asGitAuthor, function (err) {
          });
          var responseMessage = 'File uploaded to: <pre>' + fileDestinationSubdir + '/' + fileName + '</pre>';
          res.render('upload-form', {message: responseMessage, success: true});
        });
      });
    });
  }



}

router.all('*', function (req, res) {
  res.locals.title = "404 - Not found";
  res.statusCode = 404;
  res.render('404.jade');
});

module.exports = router;
