from flask import Flask, render_template, jsonify
import json
import random

app = Flask(__name__)

@app.route("/")
def etusivu():
    arvotut_baarit = arvo_baarit(5)
    return render_template("index.html",baarit=arvotut_baarit)

@app.route("/kaikki-baarit", methods=["GET"])
def kaikki_baarit():
    baarit_json = open("baarit.json", encoding="UTF-8")
    baarit_lista = json.load(baarit_json)
    baarit_json.close()
    return jsonify(baarit_lista)

@app.route("/baarit", methods=["GET"])
def baarit():
    return jsonify(arvo_baarit(5))


def arvo_baarit(lkm):
    baarit_json = open("baarit.json")
    baarit_lista = json.load(baarit_json)
    baarit_json.close()
    arvotut_baarit = random.sample(baarit_lista, k=lkm)
    return arvotut_baarit

    