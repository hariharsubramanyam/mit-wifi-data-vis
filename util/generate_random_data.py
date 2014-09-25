from random import *

# The random locations we generate data for.
locations = ((42.358757,-71.095694),
    (42.359018,-71.094707),
    (42.35993,-71.092572),
    (42.358725,-71.092304),
    (42.359962,-71.08974),
    (42.360588,-71.087455))

# These are the resultant data.
# The data are tuples of the form (timestamp, lat, lon, num_connected_clients)
results = []

# Generate data for 5 minute interval of the day.
for i in range(288):
  # Begin each location with 10 connected clients.
  if i == 0:
    for loc in locations:
      result = (0, loc[0], loc[1], 10)
      result = tuple([str(x) for x in result])
      result = ", ".join(result)
      result += "\n"
      results.append(result)
  else:
    for loc in locations:
      result = (i * 5, loc[0], loc[1], randint(1, 20))
      result = tuple([str(x) for x in result])
      result = ", ".join(result)
      result += "\n"
      results.append(result)

open("output.csv", "w").writelines(results)
