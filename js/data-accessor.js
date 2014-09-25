(function() {
  var DataAccessor = function(csv_data) {
    var lines = csv_data.split("\n");
    var data = 0;
    var data_for_timestamp = {};

    var tuple;
    var timestamp;
    var num_connected;
    var id;
    var lon;
    var lat;
    for (var i = 0; i < lines.length; i++) {
      tuple = lines[i].split(",");
      timestamp = parseInt(tuple[0], 10);
      num_connected = parseInt(tuple[1], 10);
      id = parseInt(tuple[2], 10);
      lon = parseFloat(tuple[3], 10);
      lat = parseFloat(tuple[4], 10);

      timestamp *= 1000;
      timestamp = new Date(timestamp);
      timestamp = timestamp.getHours() * 60 + timestamp.getMinutes();
      if (isNaN(timestamp)) {
        continue;
      }

      if (!data_for_timestamp.hasOwnProperty(timestamp)) {
        data_for_timestamp[timestamp] = [];
      }

      if (isNaN(num_connected)) {
        continue;
      }

      data_for_timestamp[timestamp].push({
        "lat": lat,
        "lon": lon,
        "num_connected": num_connected
      });
    }
    console.log(data_for_timestamp);

    var data_for_time = function(hr, min, am_pm) {
      hr = parseInt(hr, 10);
      min = parseInt(min, 10);
      if (hr == 12) {
        hr = 0;
      }
      if (am_pm == 'PM') {
        hr += 12;
      }
      var timestamp = hr * 60 + min;
      console.log(timestamp);
      return data_for_timestamp[timestamp];
    };

    var that = {};
    that.data_for_time = data_for_time;
    return that;
  };

  Global.DataAccessor = DataAccessor;
})();
