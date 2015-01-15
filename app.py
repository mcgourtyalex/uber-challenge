import json, urllib, math
from flask import Flask, jsonify, make_response

app = Flask(__name__)

# keep only relevant truck data:
#   remove incomplete data
#   remove requested applicants
#   prevent duplicates from being shown
def get_data():
    # read truck data
    url = "https://data.sfgov.org/resource/rqzj-sfat.json"
    response = urllib.urlopen(url);
    inp = json.loads(response.read())
    
    data = []
    seen = set()
    
    for row in inp:
        if ('address' not in row or 'status' not in row or 'approved' not in row or 'location' not in row):
            continue
        if (row['status'] == 'REQUESTED'):
            continue;
        if (row['applicant'] in seen):
            continue;
        seen.add(row['applicant'])
        temp = {}    
    
        temp['address'] = row['address']
        temp['date'] = row['approved']
        temp['location'] = row['location']
        temp['applicant'] = row['applicant']
        temp['food'] = row['fooditems']

        data.append(temp);
        
    return data

trucks = get_data()

# get the distance between two points on the map
def distance(lat1,long1,lat2,long2):
    return math.sqrt(math.pow((lat1 - lat2),2) + math.pow((long1 - long2),2))

# get /trucks will return the truck list
@app.route('/trucks', methods=['GET'])
def get_trucks():
    return jsonify({'trucks': trucks})
    
# get /closest/lat/long will return the closest 20 trucks to the point given
@app.route('/closest/<string:lat>/<string:lon>', methods=['GET'])
def get_closest(lat,lon):
    if (lat == "" or lon == ""):
        return
        
    lat1 = float(lat)
    lon1 = float(lon)
    
    distances = []
    
    i = 0
    for truck in trucks:
        lat2 = float(truck['location']['latitude'])
        lon2 = float(truck['location']['longitude'])
        
        dist = distance(lat1,lon1, lat2, lon2)
        distances.append((dist,i))
        i += 1
    
    sort = sorted(distances)
    
    topTwenty = []
    
    for num in sort[0:20]:
        topTwenty.append(trucks[num[1]])
     
    return jsonify({'min': topTwenty})
    
# handle nonsense requests
@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

if __name__ == '__main__':
    app.run(debug=True)