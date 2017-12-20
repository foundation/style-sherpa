var assert = require('assert');
var sherpa = require('../index');

// Using the XY-Grid layout in Foundation 6.4.1?
describe('Style Sherpa with XY Grid and Foundation 6.4.1', function() {
  it('generates an HTML style guide from a Markdown file with XY Grid', function(done) {
    sherpa('./test/fixtures/test.md', {
      output: './test/fixtures/test-xy.html',
      template: './template-xy.hbs'
    }, done);
  });
});

// Using the Flex-Grid layout in Foundation 6.3.1?
describe('Style Sherpa with Flex Grid & Foudation 6.3.1', function() {
  it('generates an HTML style guide from a Markdown file with Flex Grid', function(done) {
    sherpa('./test/fixtures/test.md', {
      output: './test/fixtures/test-flex.html',
      template: './template-flex.hbs'
    }, done);
  });
});
