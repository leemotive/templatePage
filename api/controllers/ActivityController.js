var fs = require('fs');
var Archiver = require('archiver');
var copyDir = require('copy-dir');
var del = require('delete');
var doT = require('dot');
var templateDir = 'template/';
var activityDir = 'activity/';
var placeholderRgx = /{{({.+?})}}/g;
var loopPlaceholderRgx = /\[\[(?:.|\s)*?{{({.+?})}}((?:.|\s)*?)\]\]/g;
var loopPlaceholderRgxN = /\[\[({.+})(\[.+\])((?:.|\s)*?)\]\]/g;
var crossPlaceholderRgx = /{{({.+?})}}|\[\[({.+})(\[.+\])((?:.|\s)*?)\]\]/g;

module.exports = {

    generate: function (req, res) {
        var params = req.body;
        var activityName = params.activityName;
        var templateName = params.templateName;
        delete params.activityName;
        delete params.templateName;

        copyTemplate(templateName, activityName);

        var files = JSON.parse(fs.readFileSync(templateDir + templateName + '/config.json', {encoding: 'utf-8'})).templates;
        files.forEach(function (filepath) {
            var placeholder;
            page = fs.readFileSync(templateDir + templateName + filepath, {encoding: 'utf-8'});
            page = page.replace(crossPlaceholderRgx, function (match, sub, key, holders, template) {
                if (match.charAt(0) === '[') {
                    placeholder = JSON.parse(key);
                    var model = params[placeholder.key];
                    doT.templateSettings.strip = false;
                    var factory = doT.template(template);
                    return factory({data: model});
                } else {
                    placeholder = JSON.parse(sub);
                    return params[placeholder.key];
                }
            });
            fs.writeFileSync(activityDir + activityName + filepath, page, {encoding: 'utf-8'});
        });

        /*var pageHTML = fs.readFileSync(templateDir + templateName + '/index.html', {encoding: 'utf-8'});
        var styleSheet = fs.readFileSync(templateDir + templateName + '/css/index.css', {encoding: 'utf-8'});

        styleSheet = styleSheet.replace(placeholderRgx, function (match, sub) {
            var placeholder = JSON.parse(sub);
            if (placeholder.type === 'loop') {
                return match;
            }
            return params[placeholder.key];
        });

        pageHTML = pageHTML.replace(placeholderRgx, function (match, sub) {
            var placeholder = JSON.parse(sub);
            if (placeholder.type === 'loop') {
                return match;
            }
            return params[placeholder.key];
        });
        pageHTML = pageHTML.replace(loopPlaceholderRgxN, function (match, key, holders, template) {
            var placeholder =JSON.parse(key);
            var model = params[placeholder.key];
            doT.templateSettings.strip = false;
            var factory = doT.template(template);
            return factory({data: model});
        });

        fs.writeFileSync(activityDir + activityName + '/css/index.css', styleSheet, {encoding: 'utf-8'});
        fs.writeFileSync(activityDir + activityName + '/index.html', pageHTML, {encoding: 'utf-8'});*/

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
        zip.directory(activityDir + activityName, activityName);
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

        if (fs.existsSync('./.tmp/public/preview/' + activityName)) {
            del.sync('./.tmp/public/preview/' + activityName + '/*');
        }
        copyDir.sync(activityDir + activityName, './.tmp/public/preview/' + activityName);

        return res.json({
            success: true,
            message: '',
            code: '',
            data: undefined
        });
    },

    activityExists: function (req, res) {
        var activityName = req.params.activityName;
        if (!fs.existsSync(activityDir + activityName)) {
            return res.json({
                success: false,
                message: '请生成活动页后再下载',
                code: '',
                data: false
            });
        } else {
            return res.json({
                success: true,
                message: '',
                code: '',
                data: true
            });
        }
    }
}

function copyTemplate (templateName, activityName, notCopyWhenExist) {
    if (!fs.existsSync(activityDir + activityName) || !notCopyWhenExist){
        copyDir.sync(templateDir + templateName, activityDir + activityName);
    }
}