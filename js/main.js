(function() {
  var am_pm;
  var time_hr;
  var time_min;
  var go_to_time_button;
  var animate_button;
  var data_accessor = null;
  var map;
  var circle_for_lat_lon = {};

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
    console.log(access_data);
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

  var go_to_time_handler = function() {
    var hr = Number(time_hr.val());
    var min = Number(time_min.val());
    var am_pm_string = am_pm.text();
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
