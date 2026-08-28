
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import joblib
import os

app = Flask(
    __name__,
    template_folder="templates",
    static_folder="static"
)

CORS(app)

model = joblib.load("flight_delay_model.pkl")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    try:
        prediction = model.predict([[
            data["op_unique_carrier"],
            data["op_carrier_fl_num"],
            data["origin"],
            data["dest"],
            data["crs_dep_time"],
            data["crs_arr_time"],
            data["cancelled"],
            data["diverted"],
            data["crs_elapsed_time"],
            data["distance"],
            data["flight_year"],
            data["flight_month"],
            data["flight_day"],
            data["flight_dayofweek"]
        ]])

        probability = model.predict_proba([[
            data["op_unique_carrier"],
            data["op_carrier_fl_num"],
            data["origin"],
            data["dest"],
            data["crs_dep_time"],
            data["crs_arr_time"],
            data["cancelled"],
            data["diverted"],
            data["crs_elapsed_time"],
            data["distance"],
            data["flight_year"],
            data["flight_month"],
            data["flight_day"],
            data["flight_dayofweek"]
        ]])[0][1]

        result = "Delayed" if prediction[0] == 1 else "On Time"

        return jsonify({
            "prediction": result,
            "probability": round(float(probability) * 100, 2)
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 400


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
