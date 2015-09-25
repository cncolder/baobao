// Tooltip startup.

$('[data-toggle=tooltip]').tooltip();


// Wechat cannot click. Only show a barcode.

$('#wechat_barcode')
  .click(function() {
    return false;
  });


// Here is entrance for editor.

var copyrightClickTimes = 0;

$('#copyright')
  .click(function() {
    if (++copyrightClickTimes >= 7) {
      copyrightClickTimes = 0;
      alert('Welcome editor.');
    }
  });
