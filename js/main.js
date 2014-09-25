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
    for (var k in access_data) {
      wifi_point = k.split(",");
      lat = parseFloat(wifi_point[0]); 
      lon = parseFloat(wifi_point[1]);
      num_connected = access_data[k];
      if (!circle_for_lat_lon.hasOwnProperty([lat, lon])) {
        circle_for_lat_lon[[lat, lon]] = L.circle([lat, lon], 100).addTo(map);
      }
      circle_for_lat_lon[[lat, lon]].setRadius(num_connected / 2);
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
    var data = go_to_time_handler();
    var timestamp;
    var index;
    var hr;
    var min;
    var am_or_pm;

    go_to_time_button.addClass("disabled");
    go_to_time_button.prop("disabled", true);
    animate_button.addClass("red");
    animate_button.text("Stop");
    clearInterval(animate_inverval);
    animate_inverval = setInterval(function() {
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
      hr = parseInt(time_hr.val(), 10);
      min = parseInt(time_min.val(), 10);
      am_pm_string = am_pm.text();
    }
    if (data_accessor !== null) {
      var index = data_accessor.index_for_time(hr, min, am_pm_string);
      var data = data_accessor.data_for_index(index);
      console.log(data);
      draw_circles_for_data(data.data.accesses);
      return data;
    }
    return null;
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

    $.get("util/data.csv", function(data) {
      data_accessor = Global.DataAccessor(data);
    });

    map = L.map('map').setView([42.360183,-71.090469], 17);

    // add an OpenStreetMap tile layer
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  });
})();
