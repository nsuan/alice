alice.addFilters([
  function (content) {
    var filtered = content;
    filtered = filtered.replace(
      /(<a href=\"(:?.*?\.(:?wav|mp3|ogg|aiff))")/gi,
      "<img src=\"/static/styles/default/image/play.png\" onclick=\"playAudio(this)\" class=\"audio\"/>$1");
    return filtered;
  },
  function (content) {
    var filtered = content;
    filtered = filtered.replace(
      /(<a[^>]*?>)(.*?\.(:?jpg|jpeg|gif|png))</gi,
      "$1<img src=\"$2\" onload=\"loadInlineImage(this)\" width=\"0\" alt=\"Loading Image...\" /><");
    return filtered;
  }
]);

function loadInlineImage(image) {
  var maxWidth = arguments.callee.maxWidth || 400;
  image.style.width = 'auto';
  image.style.visibility = 'hidden';
  if (image.width > maxWidth) image.style.width = maxWidth + 'px';
  image.style.visibility = 'visible';
  setTimeout(function () {
    var channel = image.up("div.channel");
    channel.scrollTop = channel.scrollHeight;
  }, 50);
}

function playAudio(image, audio) {
  image.src = '/static/styles/default/image/pause.png'; 
  if (! audio) {
    var url = image.nextSibling.href;
    audio = new Audio(url);
    audio.addEventListener('ended', function () {
      image.src = '/static/styles/default/image/play.png';
      image.onclick = function () { playAudio(image, audio) };
    });
  }
  audio.play();
  image.onclick = function() {
    audio.pause();
    this.src = '/static/styles/default/image/play.png';
    this.onclick = function () { playAudio(this, audio) };
  };
}