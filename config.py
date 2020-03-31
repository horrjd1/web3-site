import os

# basically get me the base directory of this application
basedir = os.path.abspath(os.path.dirname(__file__))
# path to our files folder (<basedir>/files) (/s are different between windows and linux)
# Caps because const not going to change
FILES_FOLDER = os.path.join(basedir, 'files')

