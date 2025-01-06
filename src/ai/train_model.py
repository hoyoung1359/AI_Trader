import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

class StockPredictor:
    def __init__(self, stock_code):
        self.stock_code = stock_code
        self.model = None
        self.scaler = MinMaxScaler()
        
    def prepare_data(self, data, lookback=60):
        # 데이터 전처리
        scaled_data = self.scaler.fit_transform(data[['close_price', 'volume', 'ma5', 'ma20', 'rsi']])
        X, y = [], []
        
        for i in range(lookback, len(scaled_data)):
            X.append(scaled_data[i-lookback:i])
            y.append(scaled_data[i, 0])
            
        return np.array(X), np.array(y)
    
    def build_model(self, input_shape):
        model = Sequential([
            LSTM(50, return_sequences=True, input_shape=input_shape),
            Dropout(0.2),
            LSTM(50, return_sequences=False),
            Dropout(0.2),
            Dense(25),
            Dense(1)
        ])
        
        model.compile(optimizer='adam', loss='mse')
        return model
    
    def train(self, data):
        X, y = self.prepare_data(data)
        self.model = self.build_model((X.shape[1], X.shape[2]))
        self.model.fit(X, y, epochs=50, batch_size=32, validation_split=0.2)
        
    def predict(self, data):
        X, _ = self.prepare_data(data)
        predictions = self.model.predict(X)
        return self.scaler.inverse_transform(predictions.reshape(-1, 1)) 