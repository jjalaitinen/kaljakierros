from flask import Flask, render_template, jsonify
import json
import random

app = Flask(__name__)

@app.route("/")
def etusivu():
    return render_template("index.html")

@app.route("/testi", methods=['GET'])
def testi():
    print("toimii!")
    baarit_json = open('baarit.json')
    baarit_lista = json.load(baarit_json)
    arvottavien_lkm = 5
    arvotut_baarit = random.choices(baarit_lista, k=arvottavien_lkm)
    #for baari in arvotut_baarit:
    #    print(baari["nimi"])
    tulostus = jsonify(arvotut_baarit)
    print(tulostus)

    return tulostus