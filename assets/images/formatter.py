from PIL import Image
import os
from os import listdir
from os.path import splitext

directory = './assets/images/'
target = '.png'

for file in listdir(directory):
    filename, extension = splitext(file)
    try:
        if extension not in ['.py', target]:
            im = Image.open(directory+filename + extension)
            im.save(directory+filename + target)
            os.remove(directory+filename + extension)
    except OSError:
        print('Cannot convert %s' % file)