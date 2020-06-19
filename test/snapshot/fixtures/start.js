var interval = setTimeout(function() {
  if (window.idpcStart) {
    window.idpcStart();
    clearInterval(interval);
  }
}, 1000);
