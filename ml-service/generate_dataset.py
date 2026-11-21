import os
import numpy as np
import pandas as pd

# Benchmark crop profiles (Mean and Standard Deviation for N, P, K, Temp, Humidity, pH, Rainfall)
# Derived from ICAR research benchmarks and Kaggle/GitHub crop recommendation datasets
CROP_PROFILES = {
    'rice':        {'N': (80, 10), 'P': (48, 8),  'K': (40, 6),  'temperature': (23.7, 2.5), 'humidity': (82.3, 4.0), 'ph': (6.4, 0.4), 'rainfall': (236.2, 25.0)},
    'maize':       {'N': (78, 11), 'P': (48, 9),  'K': (20, 4),  'temperature': (22.4, 3.0), 'humidity': (65.1, 5.0), 'ph': (6.2, 0.5), 'rainfall': (84.8, 15.0)},
    'chickpea':    {'N': (40, 8),  'P': (68, 7),  'K': (80, 8),  'temperature': (18.9, 2.0), 'humidity': (16.9, 3.0), 'ph': (7.3, 0.4), 'rainfall': (80.1, 10.0)},
    'kidneybeans': {'N': (21, 5),  'P': (67, 8),  'K': (20, 3),  'temperature': (20.2, 2.0), 'humidity': (21.6, 3.5), 'ph': (5.7, 0.3), 'rainfall': (105.9, 12.0)},
    'pigeonpeas':  {'N': (21, 4),  'P': (68, 6),  'K': (20, 3),  'temperature': (27.7, 3.0), 'humidity': (48.1, 6.0), 'ph': (5.8, 0.4), 'rainfall': (149.5, 20.0)},
    'mothbeans':   {'N': (21, 5),  'P': (48, 6),  'K': (20, 3),  'temperature': (28.2, 2.5), 'humidity': (53.2, 5.0), 'ph': (6.8, 0.5), 'rainfall': (51.2, 8.0)},
    'mungbean':    {'N': (21, 4),  'P': (48, 7),  'K': (20, 4),  'temperature': (28.5, 2.0), 'humidity': (85.5, 4.0), 'ph': (6.7, 0.4), 'rainfall': (48.5, 7.0)},
    'blackgram':   {'N': (40, 6),  'P': (68, 6),  'K': (19, 3),  'temperature': (29.9, 2.0), 'humidity': (65.0, 5.0), 'ph': (7.1, 0.4), 'rainfall': (67.9, 10.0)},
    'lentil':      {'N': (19, 4),  'P': (68, 7),  'K': (19, 3),  'temperature': (24.5, 2.5), 'humidity': (64.8, 5.0), 'ph': (6.9, 0.4), 'rainfall': (45.7, 8.0)},
    'pomegranate': {'N': (19, 5),  'P': (19, 4),  'K': (40, 6),  'temperature': (21.8, 2.5), 'humidity': (90.1, 3.0), 'ph': (6.4, 0.4), 'rainfall': (107.5, 12.0)},
    'banana':      {'N': (100, 10),'P': (73, 8),  'K': (50, 7),  'temperature': (27.4, 2.0), 'humidity': (80.4, 4.0), 'ph': (5.9, 0.4), 'rainfall': (104.6, 12.0)},
    'mango':       {'N': (20, 5),  'P': (27, 4),  'K': (30, 4),  'temperature': (31.2, 2.5), 'humidity': (50.2, 6.0), 'ph': (5.8, 0.4), 'rainfall': (94.7, 12.0)},
    'grapes':      {'N': (23, 5),  'P': (133, 10),'K': (200, 10), 'temperature': (23.8, 3.0), 'humidity': (81.9, 4.0), 'ph': (6.0, 0.4), 'rainfall': (69.6, 9.0)},
    'watermelon':  {'N': (99, 10), 'P': (17, 3),  'K': (50, 6),  'temperature': (25.6, 2.0), 'humidity': (85.2, 4.0), 'ph': (6.5, 0.3), 'rainfall': (50.8, 8.0)},
    'muskmelon':   {'N': (100, 10),'P': (18, 4),  'K': (50, 6),  'temperature': (28.6, 2.0), 'humidity': (92.3, 3.0), 'ph': (6.4, 0.3), 'rainfall': (24.7, 4.0)},
    'apple':       {'N': (21, 4),  'P': (134, 10),'K': (199, 10), 'temperature': (22.6, 2.5), 'humidity': (92.3, 3.0), 'ph': (5.9, 0.3), 'rainfall': (112.7, 15.0)},
    'orange':      {'N': (20, 4),  'P': (16, 3),  'K': (10, 2),  'temperature': (22.8, 3.0), 'humidity': (92.2, 3.0), 'ph': (7.0, 0.4), 'rainfall': (110.4, 15.0)},
    'papaya':      {'N': (50, 7),  'P': (59, 6),  'K': (50, 6),  'temperature': (33.7, 3.0), 'humidity': (92.4, 3.0), 'ph': (6.7, 0.4), 'rainfall': (142.6, 18.0)},
    'coconut':     {'N': (22, 4),  'P': (17, 3),  'K': (30, 4),  'temperature': (27.4, 2.0), 'humidity': (94.8, 2.0), 'ph': (6.0, 0.4), 'rainfall': (175.7, 20.0)},
    'cotton':      {'N': (118, 12),'P': (46, 7),  'K': (20, 3),  'temperature': (24.0, 2.5), 'humidity': (79.8, 5.0), 'ph': (6.9, 0.5), 'rainfall': (80.4, 10.0)},
    'jute':        {'N': (78, 10), 'P': (47, 7),  'K': (40, 5),  'temperature': (25.0, 2.5), 'humidity': (79.6, 5.0), 'ph': (6.7, 0.4), 'rainfall': (174.7, 20.0)},
    'coffee':      {'N': (101, 10),'P': (29, 4),  'K': (30, 4),  'temperature': (25.5, 2.5), 'humidity': (58.9, 6.0), 'ph': (6.8, 0.4), 'rainfall': (158.1, 20.0)}
}

def generate_crop_dataset(samples_per_crop=100, seed=42):
    np.random.seed(seed)
    records = []
    
    for crop_name, profile in CROP_PROFILES.items():
        for _ in range(samples_per_crop):
            n = max(0, int(np.random.normal(profile['N'][0], profile['N'][1])))
            p = max(5, int(np.random.normal(profile['P'][0], profile['P'][1])))
            k = max(5, int(np.random.normal(profile['K'][0], profile['K'][1])))
            temp = round(float(np.random.normal(profile['temperature'][0], profile['temperature'][1])), 2)
            hum = min(100.0, max(10.0, round(float(np.random.normal(profile['humidity'][0], profile['humidity'][1])), 2)))
            ph = min(9.5, max(3.5, round(float(np.random.normal(profile['ph'][0], profile['ph'][1])), 2)))
            rain = max(10.0, round(float(np.random.normal(profile['rainfall'][0], profile['rainfall'][1])), 2))
            
            records.append({
                'N': n,
                'P': p,
                'K': k,
                'temperature': temp,
                'humidity': hum,
                'ph': ph,
                'rainfall': rain,
                'label': crop_name
            })
            
    df = pd.DataFrame(records)
    out_dir = os.path.join(os.path.dirname(__file__), 'datasets')
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, 'crop_recommendation.csv')
    df.to_csv(out_path, index=False)
    print(f"Dataset generated successfully: {df.shape[0]} rows, {df.shape[1]} columns -> {out_path}")
    return df

if __name__ == '__main__':
    generate_crop_dataset()
