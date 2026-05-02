# from flask import Flask, request, jsonify
# from recruiter_engine import recruiter_engine

# app = Flask(__name__)

# @app.route("/predict", methods=["POST"])
# def predict():
#     try:
#         data = request.get_json()

#         if not data:
#             return jsonify({"error": "Invalid JSON input"}), 400

#         result = recruiter_engine(data)
#         return jsonify(result), 200

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


# @app.route("/", methods=["GET"])
# def health():
#     return jsonify({"message": "Recruiter Engine API is running"})


# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5003)

from flask import Flask, request, jsonify
from recruiter_engine_ml import recruiter_engine_ml

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    result = recruiter_engine_ml(data)
    return jsonify(result)

@app.route("/")
def health():
    return {"message": "ML Recruiter Engine Running"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5004)
