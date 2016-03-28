var fs = require('fs');
var Archiver = require('archiver');
var copyDir = require('copy-dir');
var del = require('delete');
var doT = require('dot');
var templateDir = 'template/';
var activityDir = 'activity/';
var placeholderRgx = /{{({.+?})}}/g;
var loopPlaceholderRgx = /\[\[(?:.|\s)*?{{({.+?})}}((?:.|\s)*?)\]\]/g;

module.exports = {

    generate: function (req, res) {
        var params = req.body;
        var activityName = params.activityName;
        var templateName = params.templateName;
        delete params.activityName;
        delete params.templateName;

        copyTemplate(templateName, activityName);

        var pageHTML = fs.readFileSync(templateDir + templateName + '/index.html', {encoding: 'utf-8'});

        pageHTML = pageHTML.replace(placeholderRgx, function (match, sub) {
            var placeholder = JSON.parse(sub);
            if (placeholder.type === 'loop') {
                return match;
            }
            return params[placeholder.key];
        });
        pageHTML = pageHTML.replace(loopPlaceholderRgx, function (match, sub, template) {
            var placeholder = JSON.parse(sub);
            var model = params[placeholder.key];

            var factory = doT.template(template);
            return factory({data:model});
        });

        fs.writeFileSync(activityDir + activityName + '/index.html', pageHTML, {encoding: 'utf-8'});

        return res.json({
            success: true,
            message: '',
            code: '',
            data: undefined
        });
    },

    download: function (req, res) {
        var params = req.params;
        var activityName = params.activityName;

        var zip = new Archiver('zip', {});
        zip.directory(activityDir + activityName);
        zip.finalize();
        
        res.writeHead(200, {
            'Content-Type': 'application/force-download',
            'Content-Disposition': 'attachment; filename=' + activityName + '.zip'
        });

        zip.pipe(res);
    },

    uploadImage: function (req, res) {
        var activityName = req.body.activityName;
        var templateName = req.body.templateName;
        console.log(activityName + '---------' + templateName);
        console.log(req);
        copyTemplate(templateName, activityName, true);

        req.file('img').upload(function (err, uploadedImages) {
            if (err) {
                return res.negotiate(err);
            }

            // If no files were uploaded, respond with an error.
            if (uploadedImages.length === 0){
                return res.badRequest('No file was uploaded');
            }

            var readStream = fs.createReadStream(uploadedImages[0].fd);
            var writeStream = fs.createWriteStream(activityDir + activityName + '/images/' + uploadedImages[0].filename);

            readStream.pipe(writeStream);

            del.sync(uploadedImages[0].fd);

            return res.json({
                success: true,
                message: '',
                code: '',
                data: './images/' + uploadedImages[0].filename
            });
        });
    },

    preview: function (req, res) {
        var activityName = req.params.activity;

        if (fs.existsSync('./assets/preview/' + activityName)) {
            del.sync('./assets/preview/' + activityName + '/*');
        }
        copyDir.sync(activityDir + activityName, './assets/preview/' + activityName);

        return res.json({
            success: true,
            message: '',
            code: '',
            data: undefined
        });
    }
}

function copyTemplate (templateName, activityName, notCopyWhenExist) {
    if (!fs.existsSync(activityDir + activityName) || !notCopyWhenExist){
        console.log(templateDir + templateName + '--------------' + activityDir + activityName)
        copyDir.sync(templateDir + templateName, activityDir + activityName);
    }
}