// Activate button function hook
function thebe_activate_button_function() {
  // Load the Thebe library
  $.getScript("https://unpkg.com/thebe@latest")
    .done(function (script, textStatus) {
      thebe_remove_activate_button();
      thebe_place_status_field();
      thebe_activate_cells();
    })
    .fail(function (jqxhr, settings, exception) {
      $("div.log").text("Could not fetch Thebe library.");
    });
}
