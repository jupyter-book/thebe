window.onload = function() {
  thebelab.on("status", function(evt, data) {
    console.log("Status changed:", data.status, data.message);
    $(".thebe-status-button")
      .attr("class", "thebe-status-button thebe-status-" + data.status)
      .text(data.status);
  });
  thebelab.bootstrap();
};
