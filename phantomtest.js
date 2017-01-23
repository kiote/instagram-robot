var webPage = require('webpage');
var page = webPage.create();
var fs = require('fs');

page.onLoadFinished = function(msg) {
  console.log('page load finished');
  page.render('export.png');
  fs.write('1.html', page.content, 'w');
  phantom.exit();
};

page.open('http://instagram.com', function() {
  page.evaluate(function(){
  });
});
