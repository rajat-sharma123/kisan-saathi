import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report, confusion_matrix

def train_and_evaluate():
    data_path = os.path.join(os.path.dirname(__file__), 'datasets', 'crop_recommendation.csv')
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"Dataset not found at {data_path}. Run generate_dataset.py first.")

    print("=" * 60)
    print("KISAN SAATHI ML PIPELINE - CROP RECOMMENDATION")
    print("Team INNOVIX (IIIT Bhagalpur)")
    print("=" * 60)

    # 1. Dataset Exploration
    df = pd.read_csv(data_path)
    print(f"\n[1] Dataset Shape: {df.shape}")
    print(f"Features: {list(df.columns[:-1])}")
    print(f"Target Labels ({len(df['label'].unique())} crops): {sorted(df['label'].unique())}")

    # 2. Data Cleaning & Duplicate/Null Handling
    null_counts = df.isnull().sum().sum()
    dup_counts = df.duplicated().sum()
    print(f"\n[2] Data Quality Check: Missing values = {null_counts}, Duplicates = {dup_counts}")
    if dup_counts > 0:
        df = df.drop_duplicates()

    # 3. Feature Selection & Train-Test Split (80% train / 20% test)
    X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
    y = df['label']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"\n[3] Train Set: {X_train.shape[0]} samples | Test Set: {X_test.shape[0]} samples")

    # 4. Multi-Model Training and Benchmarking
    models = {
        'Decision Tree': DecisionTreeClassifier(random_state=42),
        'K-Nearest Neighbors': KNeighborsClassifier(n_neighbors=5),
        'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
        'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, random_state=42)
    }

    results = {}
    print("\n[4] Training & Comparing Models...")
    print("-" * 60)

    for name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)

        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, average='weighted', zero_division=0)
        rec = recall_score(y_test, y_pred, average='weighted', zero_division=0)
        f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)

        results[name] = {
            'model': model,
            'accuracy': acc,
            'precision': prec,
            'recall': rec,
            'f1': f1,
            'y_pred': y_pred
        }

        print(f"• {name:20s} | Acc: {acc:.4f} | Prec: {prec:.4f} | Rec: {rec:.4f} | F1: {f1:.4f}")

    # 5. Select Best Model
    best_name = max(results, key=lambda k: results[k]['accuracy'])
    best_info = results[best_name]
    best_model = best_info['model']

    print("-" * 60)
    print(f"★ BEST PERFORMING MODEL: {best_name} (Test Accuracy: {best_info['accuracy'] * 100:.2f}%)")

    # Detailed Classification Report
    print(f"\n[5] Classification Report for {best_name}:")
    print(classification_report(y_test, best_info['y_pred'], zero_division=0))

    # Confusion Matrix shape
    cm = confusion_matrix(y_test, best_info['y_pred'])
    print(f"Confusion Matrix Computed: Shape {cm.shape} (Trace / Correct Predictions: {np.trace(cm)} / {len(y_test)})")

    # 6. Model Serialization with Joblib
    models_dir = os.path.join(os.path.dirname(__file__), 'models')
    os.makedirs(models_dir, exist_ok=True)
    model_output_path = os.path.join(models_dir, 'crop_recommendation_model.joblib')
    
    # Save model and metadata together
    payload = {
        'model': best_model,
        'model_name': best_name,
        'features': list(X.columns),
        'classes': list(best_model.classes_),
        'metrics': {
            'accuracy': best_info['accuracy'],
            'precision': best_info['precision'],
            'recall': best_info['recall'],
            'f1': best_info['f1']
        }
    }
    joblib.dump(payload, model_output_path)
    print(f"\n[6] Best Model successfully serialized using Joblib -> {model_output_path}")

    return payload

if __name__ == '__main__':
    train_and_evaluate()
