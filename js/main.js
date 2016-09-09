(function() {
  /**
   * This is the logic for displaying the map, animating the map, and responding to user input.
   */

  // The button indicating AM or PM.
  var am_pm;

  // The textbox displaying the hour of the day.
  var time_hr;

  // The textbox displaying the number of minutes into the hour.
  var time_min;

  // The button that allows the user to jump to the selected time.
  var go_to_time_button;

  // The button that animates the map.
  var animate_button;

  // The data accessor object.
  var data_accessor = null;

  // The OpenStreetMap map.
  var map;

  // Maps from [lat, lon] to an OpenStreetMap Circle.
  var circle_for_lat_lon = {};

  // The JavaScript interval that handles animation. 
  var animate_inverval = null;

  /**
   * Given a map from "lat, lon" to num_connected, draw
   * the circles.
   */
  var draw_circles_for_data = function(access_data) {
    Object.keys(access_data).forEach(function(key) {
      // Get the (lat, lon) pair.
      var wifi_point = key.split(",");
      var lat = parseFloat(wifi_point[0]); 
      var lon = parseFloat(wifi_point[1]);

      // Figure out the number connected.
      var num_connected = access_data[key];

      // Create a circle if one does not already exist.
      if (!circle_for_lat_lon.hasOwnProperty([lat, lon])) {
        circle_for_lat_lon[[lat, lon]] = L.circle([lat, lon], 100).addTo(map);
      }

      // Set the radius so that the area of the circle is proportional to the num_connected.
      // We use the square root because
      // A = pi * r^2
      circle_for_lat_lon[[lat, lon]].setRadius(Math.sqrt(num_connected) * 2);
    });
  }; 

  /**
   * Handle the click of the "Animate" button.
   */
  var animate_handler = function() {
    // If we need to stop animation, do so.
    if (animate_button.text() === "Stop") {
      clearInterval(animate_inverval);
      animate_button.text("Animate");
      go_to_time_button.removeClass("disabled");
      go_to_time_button.prop("disabled", false);
      animate_button.removeClass("red");
      return;
    }

    // Otherwise, get the data at the given time.
    var data = go_to_time_handler();
    var timestamp;
    var index;
    var hr;
    var min;
    var am_or_pm;

    // Set the UI.
    go_to_time_button.addClass("disabled");
    go_to_time_button.prop("disabled", true);
    animate_button.addClass("red");
    animate_button.text("Stop");
    clearInterval(animate_inverval);

    // Run every 100 ms.
    animate_inverval = setInterval(function() {
      // Parse the data and draw circles.
      index = data.new_index;
      data = data_accessor.data_for_index(index);
      timestamp = data.data.timestamp;
      hr = Math.floor(timestamp / 24);
      min = timestamp % 60;
      if (hr > 11) {
        am_or_pm = "PM";
        hr -= 12;
      } else {
        am_or_pm = "AM";
      }
      if (hr == 0) {
        hr = 12;
      }
      am_pm.text(am_or_pm);
      time_hr.val(pad_string(hr));
      time_min.val(pad_string(min));

      draw_circles_for_data(data.data.accesses);
    }, 100);
  };

  // Pads a number so that it is 2 digits.
  var pad_string = function(s) {
    s = "" + s;
    if (s.length == 0) {
      return "00";
    }
    if (s.length == 1) {
      return "0" + s;
    }
    return s;
  };

  /**
   * Handle the click of the "Jump to Time" button.
   */
  var go_to_time_handler = function(hour, minute, am_or_pm) {
    var hr = hour;
    var min = minute;
    var am_pm_string = am_or_pm;
    
    // Parse the time.
    if (am_or_pm === undefined) {
      hr = parseInt(time_hr.val(), 10);
      min = parseInt(time_min.val(), 10);
      am_pm_string = am_pm.text();
    }

    // Get the next time and get the data at that time.
    if (data_accessor !== null) {
      var index = data_accessor.index_for_time(hr, min, am_pm_string);
      var data = data_accessor.data_for_index(index);
      draw_circles_for_data(data.data.accesses);
      return data;
    }
    return null;
  };


  $(document).ready(function() {
    // Bind to the DOM nodes.
    am_pm = $("#am-pm");
    time_hr = $("#time-hr");
    time_min = $("#time-min");
    go_to_time_button = $("#go-to-time");
    animate_button = $("#animate");

    // Toggle AM/PM when it is clicked.
    am_pm.click(function() {
      am_pm.text(am_pm.text() === "PM" ? "AM" : "PM");
    });

    // Set the handlers for the "Animate" and "Jump to Time" buttons.
    go_to_time_button.click(go_to_time_handler);
    animate_button.click(animate_handler);

    // Create the data accessor by loading the data.
    $.get("util/data.csv", function(data) {
      data_accessor = Global.DataAccessor(data);
    });

    // Create the map and zoom in on MIT.
    map = L.map('map').setView([42.360183,-71.090469], 17);

    // Add an OpenStreetMap tile layer
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  });
})();
