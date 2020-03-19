# make sure python is 3.7.something
# good tutorial for flask:
# https://www.tutorialspoint.com/flask/flask_url_building.htm

from flask import Flask, redirect, url_for, render_template, request
from mongoengine import *
import os
import csv
app = Flask(__name__)
app.config.from_object('config')

###########################
#
# Mongo #

connect('Lab_4-1')

# can create User objects; the argument Document passed into 
# the constructor tells the system to map this class to a 
# MongoDB document.
class User(Document):
    email = StringField()
    first_name = StringField()
    last_name = StringField()

class Country(Document):
    name = StringField()

# creating a user
# WARNING!!!!! THIS WILL RUN EVERYTIME THE SERVER IS STARTED ETC
jamie = User(first_name='Jamie', last_name='Horrell')
jamie.save()


@app.route('/data_raw')
def showData():
   for file in os.listdir(app.config['FILES_FOLDER']):
      filename = os.fsdecode(file)
      path = os.path.join(app.config['FILES_FOLDER'],filename)
      f = open(path)
      r = csv.reader(f)
      d = list(r)
      for data in d:
         print(data)




@app.route('/create_countries')
def createCountries():
   Country(name='Japan').save()
   Country(name='New Zealand').save()
   Country(name='Australia').save()
   Country(name='US').save()
   Country(name='Italy').save()

   #return redirect('/countries')


@app.route('/countries', methods=['GET'])
@app.route('/countries/<country_name>', methods=['GET'])
def getCountries(country_name = None):
   if country_name == None:
      return Country.objects.to_json()
   else:
      return Country.objects.get(name=country_name).to_json()

# remember to go pip install requests
@app.route('/countries', methods=['POST'])
def addCountry():
   name = request.form['name']
   new_country = Country(name=name)
   new_country.save()
   return new_country.to_json()
#
###########################


# Routes #

@app.route('/')
@app.route('/index')
@app.route('/home')
def index():
   title = "SITE TITLE"
   return render_template('index.html', title = title)

@app.route('/inspiration')
def inspiration():
   return render_template('inspiration.html')

@app.route('/loadData')
def loadData():
   return 'Success'






###########################
#
# returns your name on the page
#
@app.route('/hello/<name>')
def hello_name(name):
   return 'Hello %s!' % name
#
###########################


###########################
#
# redirects
#
@app.route('/admin')
def hello_admin():
   return 'You are an Admin, good job!'

@app.route('/guest/<guest>')
def hello_guest(guest):
   return 'Hello guest %s' % guest

# redirects if name is admin
@app.route('/user/<name>')
def hello_user(name):
   if name =='admin':
      return redirect(url_for('hello_admin'))
   else:
      return redirect(url_for('hello_guest',guest = name))
#
###########################


if __name__ =="__main__":
    app.run(debug=True, host='0.0.0.0', port=80)