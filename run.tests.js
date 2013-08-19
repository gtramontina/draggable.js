!(function () {
  var testPage = 'https://rawgithub.com/gtramontina/draggable.js/master/test/test.html';
  var testSpec = 'https://rawgithub.com/gtramontina/draggable.js/master/test/draggable.test.js';
  var source = 'https://rawgithub.com/gtramontina/draggable.js/master/draggable.js';
  reqwest({
    url: 'http://anyorigin.com/get?url='+testPage+'&callback=?', type: 'jsonp',
    success: function(data) {
      var body = data.contents;
      body = body
        .replace('src="../draggable.js"', 'src="'+source+'"')
        .replace('src="draggable.test.js"', 'src="'+testSpec+'"');

      var iframe = document.getElementById('tests').appendChild(document.createElement('iframe'));
      var iframeDocument = iframe.contentWindow.document;
      iframeDocument.open().write(body);
      iframeDocument.close();
    }
  });
})();