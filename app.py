from flask import Flask, render_template, jsonify
import json
import random

app = Flask(__name__)

@app.route("/")
def etusivu():
    arvotut_baarit = arvo_baarit(5)
    return render_template("index.html",baarit=arvotut_baarit)

@app.route("/testi", methods=["GET"])
def testi():
    print("toimii!")
    return tulostus

def arvo_baarit(lkm):
    baarit_json = open("baarit.json")
    baarit_lista = json.load(baarit_json)
    baarit_json.close()
    arvotut_baarit = random.sample(baarit_lista, k=lkm)
    return arvotut_baarit
    