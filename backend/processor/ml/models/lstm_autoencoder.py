import tensorflow as tf
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense, RepeatVector, TimeDistributed
import numpy as np

class LSTMAutoencoderDetector:
    def __init__(self, sequence_length: int = 10, num_features: int = 1):
        self.sequence_length = sequence_length
        self.num_features = num_features
        self.model = self._build_model()
        
    def _build_model(self):
        model = Sequential([
            # Encoder
            LSTM(32, activation='relu', input_shape=(self.sequence_length, self.num_features), return_sequences=False),
            RepeatVector(self.sequence_length),
            # Decoder
            LSTM(32, activation='relu', return_sequences=True),
            TimeDistributed(Dense(self.num_features))
        ])
        model.compile(optimizer='adam', loss='mse')
        return model

    def predict(self, sequence: np.ndarray) -> tuple[bool, float]:
        """
        Calculates reconstruction error and determines if anomaly.
        Input shape should be (1, sequence_length, num_features)
        """
        # Ensure correct shape
        if sequence.shape != (1, self.sequence_length, self.num_features):
            return False, 0.0
            
        reconstruction = self.model.predict(sequence, verbose=0)
        mse = np.mean(np.power(sequence - reconstruction, 2))
        
        # Simple threshold
        is_anomaly = mse > 0.1
        return is_anomaly, mse
