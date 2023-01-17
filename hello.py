from flask import Flask
import json
import random

app = Flask(__name__)

@app.route("/")
def hello_world():
    baarit_json = open('baarit.json')
    baarit_lista = json.load(baarit_json)
    arvottavien_lkm = 5
    arvotut_baarit = random.choices(baarit_lista, k=5)
    for baari in arvotut_baarit:
        print(baari["nimi"])

    return "<p>Hello, World!</p>"