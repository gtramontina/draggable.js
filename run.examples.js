!(function () {
  var examples = document.getElementById('examples');
  examples = examples.getElementsByTagName('code');
  for (var i = examples.length - 1; i >= 0; i--) {
    var example = examples[i];
    eval(example.textContent || example.innerText);
  };
})();