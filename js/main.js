(function() {
  var am_pm;
  var time_hr;
  var time_min;
  var go_to_time_button;
  var animate_button;
  var data_accessor = null;
  var map;
  var circle_for_lat_lon = {};
  var animate_inverval = null;

  var am_pm_handler = function() {
    if (am_pm.text() == "PM") {
      am_pm.text("AM");
    } else {
      am_pm.text("PM");
    }
  };

  var draw_circles_for_data = function(access_data) {
    var wifi_point;
    var lat;
    var lon;
    var num_connected;
    for (var i = 0; i < access_data.length; i++) {
      wifi_point = access_data[i];
      lat = wifi_point.lat;
      lon = wifi_point.lon;
      num_connected = wifi_point.num_connected;
      if (!circle_for_lat_lon.hasOwnProperty([lat, lon])) {
        circle_for_lat_lon[[lat, lon]] = L.circle([lat, lon], 100).addTo(map);
      }
      circle_for_lat_lon[[lat, lon]].setRadius(num_connected * 2);
    }
  }; 

  var animate_handler = function() {
    if (animate_button.text() === "Stop") {
      clearInterval(animate_inverval);
      animate_button.text("Animate");
      go_to_time_button.removeClass("disabled");
      go_to_time_button.prop("disabled", false);
      animate_button.removeClass("red");
      return;
    }
    go_to_time_button.addClass("disabled");
    go_to_time_button.prop("disabled", true);
    animate_button.addClass("red");
    animate_button.text("Stop");
    clearInterval(animate_inverval);
    animate_inverval = setInterval(function() {
      var hr = parseInt(time_hr.val(), 10);
      var min = parseInt(time_min.val(), 10);
      var am_pm_string = am_pm.text();
      min += 5;
      if (min >= 60) {
        min = min % 60;
        if (hr === 11 && am_pm_string === "PM") {
          hr = 11;
          min = 59;
          am_pm_string = "PM";
          clearInterval(animate_inverval);
        } else {
          hr += 1;
          if (hr > 12) {
            hr = 1;
            am_pm_string = "PM";
          }
        }
      }
      min = pad_string(min);
      hr = pad_string(hr);
      time_hr.val(hr);
      time_min.val(min);
      am_pm.text(am_pm_string);
      go_to_time_handler(hr, min, am_pm_string);
    }, 100);
  };

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

  var go_to_time_handler = function(hour, minute, am_or_pm) {
    var hr = hour;
    var min = minute;
    var am_pm_string = am_or_pm;
    if (am_or_pm === undefined) {
      hr = Number(time_hr.val());
      min = Number(time_min.val());
      am_pm_string = am_pm.text();
    }
    if (data_accessor !== null) {
      var access_data = data_accessor.data_for_time(hr, min, am_pm_string);
      draw_circles_for_data(access_data);
    }
  };


  $(document).ready(function() {
    am_pm = $("#am-pm");
    time_hr = $("#time-hr");
    time_min = $("#time-min");
    go_to_time_button = $("#go-to-time");
    animate_button = $("#animate");

    am_pm.click(am_pm_handler);
    go_to_time_button.click(go_to_time_handler);
    animate_button.click(animate_handler);

    $.get("util/output.csv", function(data) {
      data_accessor = Global.DataAccessor(data);
    });

    map = L.map('map').setView([42.360183,-71.090469], 17);

    // add an OpenStreetMap tile layer
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  });
})();
