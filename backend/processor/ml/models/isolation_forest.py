import numpy as np
from sklearn.ensemble import IsolationForest
import pickle
import os

class MLDetector:
    def __init__(self, model_path: str = None):
        self.model = None
        self.scaler = None
        
        if model_path and os.path.exists(model_path):
            self.load_model(model_path)
        else:
            self.initialize_default_model()

    def initialize_default_model(self):
        # In a real scenario, this model would be pre-trained on historical data.
        # For the sake of this prototype, we initialize an untrained model 
        # that will start flagging extremes immediately.
        self.model = IsolationForest(
            contamination=0.05,
            n_estimators=100,
            random_state=42,
            n_jobs=-1
        )
        # Dummy fit so it can predict (not ideal, but works for the demo)
        dummy_data = np.random.normal(0, 1, (100, 2)) # mean, std
        self.model.fit(dummy_data)

    def load_model(self, path: str):
        with open(path, 'rb') as f:
            data = pickle.load(f)
            self.model = data['model']
            self.scaler = data['scaler']

    def predict(self, features: dict) -> tuple[bool, float]:
        """
        Returns (is_anomaly, score)
        """
        # Feature vector: [mean, std]
        x = np.array([[features['mean'], features['std']]])
        
        # score_samples returns negative anomaly score (lower is more anomalous)
        score = self.model.score_samples(x)[0]
        
        # Threshold for our demo
        is_anomaly = score < -0.6
        
        return is_anomaly, score
