from flask import Flask
import json

app = Flask(__name__)

@app.route("/")
def hello_world():
    baarit_json = open('baarit.json')
    baarit_lista = json.load(baarit_json)
    
    for baari in baarit_lista:
        print(baari["nimi"])

    return "<p>Hello, World!</p>"