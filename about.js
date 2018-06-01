const electron = require('electron')
var $ = require('jquery');
const shell = require('electron').shell;
let appVersion = require('electron').remote.app.getVersion();
let version_text = document.getElementById('version');
version_text.textContent = 'Version: ' + appVersion;


// open external link
$('body').on('click', 'a[href]', function(event) {
  console.log('click')
  event.preventDefault();
  shell.openExternal(this.href);
});