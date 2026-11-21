import os
import sys
import joblib
import pandas as pd

def predict_crop(N, P, K, temperature, humidity, ph, rainfall):
    model_path = os.path.join(os.path.dirname(__file__), 'models', 'crop_recommendation_model.joblib')
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at {model_path}. Run train.py first.")

    payload = joblib.load(model_path)
    model = payload['model']
    features = payload['features']

    input_df = pd.DataFrame([{
        'N': float(N),
        'P': float(P),
        'K': float(K),
        'temperature': float(temperature),
        'humidity': float(humidity),
        'ph': float(ph),
        'rainfall': float(rainfall)
    }])[features]

    pred = model.predict(input_df)[0]
    
    # Predict probabilities if supported
    confidence = None
    if hasattr(model, 'predict_proba'):
        probs = model.predict_proba(input_df)[0]
        max_idx = probs.argmax()
        confidence = round(float(probs[max_idx]) * 100, 2)

    return {
        'recommended_crop': pred,
        'confidence_percentage': confidence,
        'model_name': payload['model_name'],
        'input_features': input_df.to_dict(orient='records')[0]
    }

if __name__ == '__main__':
    # Default test sample for Rice
    sample = (80, 45, 40, 24.5, 82.0, 6.4, 220.0)
    if len(sys.argv) == 8:
        sample = tuple(sys.argv[1:8])
    
    result = predict_crop(*sample)
    print("\n--- INFERENCE RESULT ---")
    print(f"Recommended Crop : {result['recommended_crop'].upper()}")
    print(f"Confidence       : {result['confidence_percentage']}%")
    print(f"Evaluator Model  : {result['model_name']}")
    print(f"Inputs           : {result['input_features']}")
