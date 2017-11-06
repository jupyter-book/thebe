// Functions for activate button

function place_status_button(){
  $('.status_indicator_field').html('Status: <span class="thebe-status-button"></span>');
}

function remove_activate_button(){
  $('.activate_button_field').empty();
}

function activate_cells(){
  thebelab.on("status", function(evt, data) {
    console.log("Status changed:", data.status, data.message);
    $(".thebe-status-button")
      .attr("class", "thebe-status-button thebe-status-" + data.status)
      .text(data.status);
  });
  thebelab.bootstrap();
}

// Activate button function hook

function activate_button_function(){
  place_status_button();
  remove_activate_button();
  activate_cells();
}

thebe_activate_button_function = activate_button_function;

// place activate button

window.onload = function(){
  $('.activate_button_field').html('<input type="button" onclick="thebe_activate_button_function()" value="Make live!">')
}
