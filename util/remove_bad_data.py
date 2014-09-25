output_file = open("data.csv", "w")
input_file = open("raw_data.csv", "r")
for line in input_file:
  if "None" in line or '"""' in line:
    continue
  split_line = line.split(",")
  lon = float(split_line[3])
  lat = float(split_line[4])
  if int(lon) != -71 or int(lat) != 42:
    continue
  output_file.write(line)
input_file.close()
output_file.close()

