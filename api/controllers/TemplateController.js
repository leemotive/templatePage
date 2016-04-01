var fs = require('fs');
var Archiver = require('archiver');
var copyDir = require('copy-dir');
var del = require('delete');
var templates;
var templateDir = 'template/';
var activityDir = 'activity/';
var placeholderRgx = /{{({.+?})}}/g;

fs.readdir(templateDir, function (err, files) {
    templates = files;
});
module.exports = {

    find: function (req, res) {
        
        return res.json({
            success: true,
            message: '',
            code: '',
            data: templates
        })
    },

    findOne: function (req, res) {
        var templateName = req.params.name;
        var template = fs.readFileSync(templateDir + templateName + '/index.html', {encoding: 'utf-8'});
        var cssTemplate = fs.readFileSync(templateDir + templateName + '/css/index.css', {encoding: 'utf-8'});

        var placeholders = [];

        cssTemplate.replace(placeholderRgx, function (match, sub) {
            var placeholder = JSON.parse(sub);
            if (!placeholder.parseIgnore) {
                placeholders.push(placeholder);
            }
        });
        template.replace(placeholderRgx, function (match, sub) {
            var placeholder = JSON.parse(sub);
            if (!placeholder.parseIgnore) {
                placeholders.push(placeholder);
            }
        });
        return res.json({
            success: true,
            message: '',
            code: '',
            data: {
                template: template,
                placeholders: placeholders
            }
        });
    }

}