# make sure python is 3.7.something
# good tutorial for flask:
# https://www.tutorialspoint.com/flask/flask_url_building.htm

from flask import Flask, Response, redirect, url_for, render_template, request, make_response, jsonify, abort
from mongoengine import *
import os
import csv
import json

app = Flask(__name__)
app.config.from_object('config')


# Mongo #

connect('Web_3_db')

class Country(Document):
    name = StringField()
    data = DictField()




# Routes #

@app.route('/')
@app.route('/index')
@app.route('/home')
def index():
    title = "SITE TITLE"
    return render_template('index.html', title=title), 200


@app.route('/inspiration')
def inspiration():
    return render_template('inspiration.html')


@app.route('/post')
def TestingPage():
    return render_template('testing.html')


# Adds the csv data to the database
@app.route('/data_raw_add')
def add_data():
    for file in os.listdir(app.config['FILES_FOLDER']):
        filename = os.fsdecode(file)
        path = os.path.join(app.config['FILES_FOLDER'], filename)
        f = open(path)
        r = csv.DictReader(f)
        d = list(r)
        for data in d:
            country = Country()  # a blank placeholder country
            dataDict = {}  # a blank placeholder data dict
            for key in data:  # iterate through the header keys
                # check if this country already exists in the db
                if key == "country":
                    print(data[key])
                    # if the country already exists, replace the blank country with the existing country from the db, and replace the blank dict with the current country's data
                    if Country.objects(name=data[key]):
                        country = Country.objects(name=data[key]).first()
                        dataDict = country['data']
                    else:
                        country['name'] = data[key]
                else:
                    # we want to trim off the ".csv" as we can't save anything with a "." as a mongodb field name
                    fn = filename.replace(".csv", "")
                    if fn in dataDict:  # check if this filename is already a field in the dict
                        # if it is, just add a new subfield which is key : data[key] (value)
                        dataDict[fn][key] = data[key]
                    else:
                        # if it is not, create a new object and assign it to the dict
                        print(data[key])
                        dataDict[fn] = {key: data[key]}

                # add the data dict to the country
                country.data = dataDict
            # save the country
            country.save()
    return 'done'


# APIs #

# Gets
@app.route('/api/countries', methods=['GET'])
@app.route('/api/countries/<country_name>', methods=['GET'])
def getCountries(country_name=None):
    if country_name == None:
        countries = Country.objects().to_json()
        return Response(countries, mimetype="application/json", status=200)
    else:
        country = Country.objects.get(name=country_name).to_json()
        if len(country) == 0:
            abort(404)
        return Response(country, mimetype="application/json", status=200)

# Post
@app.route('/api/countries', methods=['POST'])
def add_country():
    # make this line more efficient
    if not request.json or not 'name' in request.json:
        abort(400)
    newName = request.json["name"]
    newAbbreviation = request.json["abbreviation"]
    newPopulation = request.json["population"]
    Country(name=newName, abbreviation=newAbbreviation,
            population=newPopulation).save()
    return redirect('/api/countries'), 201

# Delete
@app.route('/api/countries/<country_name>', methods=['DELETE'])
def delete_country(country_name):
    # checks to see if country exists
    countryJSON = Country.objects.get(name=country_name).to_json()
    if len(countryJSON) == 0:
        abort(404)
    country = Country.objects.get(name=country_name)
    country.delete()



# display 404 when abort(404)
@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)



if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=8080)
