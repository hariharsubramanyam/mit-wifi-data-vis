(function() {
  var DataAccessor = function(csv_data) {
    var lines = csv_data.split("\n");
    console.log(lines);
    var data_for_timestamp = {};

    var tuple;
    var timestamp;
    var lat;
    var lon;
    var num_connected;
    for (var i = 0; i < lines.length; i++) {
      tuple = lines[i].split(",");
      timestamp = Number(tuple[0]);
      lat = Number(tuple[1]);
      lon = Number(tuple[2]);
      num_connected = Number(tuple[3]);

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

    var data_for_time = function(hr, min, am_pm) {
      if (am_pm == 'PM') {
        hr += 12;
      }
      min = Math.round(min / 5) * 5;
      var timestamp = hr * 60 + min;
      return data_for_timestamp[timestamp];
    };

    var that = {};
    that.data_for_time = data_for_time;
    return that;
  };

  Global.DataAccessor = DataAccessor;
})();
