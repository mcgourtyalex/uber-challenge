#Description
I chose the SF Food Trucks application from the Uber Coding Challenges. To create this, I made a simple RESTful backend with Python Flask to collect the foodtruck location data and operate on it to eliminate redundancies and broken data points. The backend also has an entrypoint for the closest 20 foodtrucks to a lat/long pair.
On the front end I used JQuery to request from the server and to display a list of the closest 20 foodtrucks. The rest is pieced together with the Google Maps API!

# Running the app
To run the app, follow these steps:
- grab the repo
- visit the uber folder
- create a new virtualenv (> virtualenv env)
- run app.py (> python app.py)
- visit http://localhost:5000/static/index.html