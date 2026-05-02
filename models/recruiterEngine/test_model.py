import pickle

with open("model.pkl", "rb") as f:
    model = pickle.load(f)

sample = [[1, 1, 3, 0.33, 0.33]]
print(model.predict(sample))
