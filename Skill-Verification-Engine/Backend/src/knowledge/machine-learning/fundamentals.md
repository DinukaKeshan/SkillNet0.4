Machine Learning (ML) is a subset of AI where systems learn patterns from data without explicit programming.

Supervised learning trains models on labeled data: input-output pairs. Examples: classification, regression.

Unsupervised learning finds patterns in unlabeled data. Examples: clustering, dimensionality reduction, anomaly detection.

Semi-supervised learning uses a small amount of labeled data with a large amount of unlabeled data.

Reinforcement learning: an agent learns by interacting with an environment, receiving rewards or penalties.

The ML workflow: collect data → clean/preprocess → feature engineering → train → evaluate → deploy.

Training/testing split: typically 80% training, 20% testing. Cross-validation uses k folds for robust evaluation.

Overfitting: model performs well on training data but poorly on unseen data. Solutions: regularization, more data, simpler model, dropout.

Underfitting: model is too simple to capture patterns. Solutions: more features, complex model, more training.

Bias-variance tradeoff: high bias = underfitting; high variance = overfitting. Goal: balance both.

Linear Regression: predicts continuous values by fitting a line: y = mx + b. Minimizes mean squared error.

Logistic Regression: predicts probabilities for binary classification using the sigmoid function.

Decision Trees: split data based on feature values. Prone to overfitting; solved by pruning or ensembles.

Random Forest: ensemble of decision trees; reduces overfitting through bagging (bootstrap aggregation).

Gradient Boosting: sequentially builds weak learners to correct predecessors' errors. XGBoost, LightGBM.

Support Vector Machines (SVM): find the hyperplane that best separates classes with maximum margin.

K-Nearest Neighbors (KNN): classifies based on the majority class of the k closest data points.

K-Means Clustering: partitions data into k clusters by minimizing within-cluster distances.

Neural Networks: layers of interconnected neurons. Input layer → hidden layers → output layer.

Activation functions: ReLU, sigmoid, tanh, softmax. ReLU is most common for hidden layers.

Deep Learning uses neural networks with many layers. Applications: image recognition, NLP, speech.

Evaluation metrics: accuracy, precision, recall, F1-score (classification); MSE, RMSE, MAE, R² (regression).

Confusion matrix: true positives, true negatives, false positives, false negatives.

NumPy provides efficient numerical operations on arrays: np.array, np.mean, np.dot, broadcasting.

pandas provides DataFrames for data manipulation: df.head(), df.describe(), df.groupby(), df.merge().

scikit-learn: ML library with consistent API. model.fit(X_train, y_train), model.predict(X_test), model.score().

TensorFlow and PyTorch are deep learning frameworks for building and training neural networks.

Feature scaling: StandardScaler (z-score normalization), MinMaxScaler (0-1 range) improve model performance.

Principal Component Analysis (PCA) reduces dimensionality while preserving variance.
