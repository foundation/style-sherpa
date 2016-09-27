var extend = require('util')._extend;
var fs = require('fs');
var handlebars = require('handlebars');
var hljs = require('highlight.js');
var marked = require('marked');
var path = require('path');
var renderer = require('./lib/marked');

module.exports = function(input, options, cb) {
  options = extend({
    template: path.join(__dirname, 'template.html')
  }, options);

  // Read input file
  var inputFile = fs.readFileSync(path.join(process.cwd(), input));
  // The divider for pages is four newlines
  var pages = inputFile.toString().replace(/(?:\r\n)/mg, "\n").split('\n\n\n\n');

  // Process each page
  pages = pages.map(function(page, i) {
    // Convert Markdown to HTML
    var body = marked(page, { renderer: renderer });

    // Find the title of the page by identifying the <h1>
    // The second match is the inner group
    var foundHeadings = body.match('<h1.*>(.*)</h1>');
    var title = foundHeadings && foundHeadings[1] || 'Page ' + (i + 1);
    var anchor = title.toLowerCase().replace(/[^\w]+/g, '-');

    var subheadings = null;
    if(options.includeSubheadings) {
      var subheadRe = /(<h2.*?>(.*?)<\/h2>)/g;

      var foundSubheadings = [];
      var match;
      var i = 0;
      while((match = subheadRe.exec(body)) !== null) {
        i = i + 1;
        var subTitle = match[2];
        var subAnchor = anchor + '-sub-' + i;
        foundSubheadings.push({title: subTitle, anchor: subAnchor, content: match[1]});
      }
      if(foundSubheadings.length) {
        subheadings = foundSubheadings.map(function(subheading) {
          body = body.replace(subheading.content, '<section id="' + subheading.anchor +'"></section>' + subheading.content);
          return {title: subheading.title, anchor: subheading.anchor};
        });
      }
    }

    var results = { title: title, anchor: anchor, body: body};
    if(subheadings) {results.subheadings = subheadings};

    return results;
  });

  // Write file to disk
  var templateFile = fs.readFileSync(path.join(process.cwd(), options.template));
  var template = handlebars.compile(templateFile.toString(), { noEscape: true });
  var outputPath = path.join(process.cwd(), options.output);

  fs.writeFile(outputPath, template({ pages: pages }), cb);
}
