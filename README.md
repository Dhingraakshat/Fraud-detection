# 🛡️ Fraud Detection — Stacking-Based Machine Learning System

An **end-to-end fraud detection project** built on the **IEEE-CIS Fraud Detection dataset**, using
multiple powerful base models, advanced preprocessing, and a **meta-learner (stacking ensemble)**
to achieve strong performance on highly imbalanced transaction data.

This repository focuses on:
- **Realistic time-based splits**
- **Out-of-fold (OOF) predictions**
- **Optuna hyperparameter optimization**
- **SHAP-based explainability**
- **Ensemble learning for robust fraud detection**

---

## ✨ Project Highlights

- 🔹 Designed for **extreme class imbalance** (fraud < 1%)
- 🔹 Multiple strong **base models** (LightGBM, CatBoost, Isolation Forest, Autoencoder)
- 🔹 **Stacking / Meta-learning** using XGBoost
- 🔹 Careful **data leakage prevention** via real-time splits
- 🔹 Model explainability using **SHAP**
- 🔹 Notebook-based, experiment-driven workflow

---

## 🧠 High-Level Approach

Fraud detection is not just classification — it is **risk ranking under asymmetric cost**.

This project follows a **stacking ensemble strategy**:

1. **Preprocess raw transaction data**
2. **Train multiple base models** using out-of-fold predictions
3. **Use base model outputs as features**
4. **Train a meta-learner** to combine model strengths
5. **Explain predictions** using SHAP values

This approach improves generalization and captures different fraud patterns that a single model may miss.

---

📊 Dataset
📦 IEEE-CIS Fraud Detection Dataset

Transaction-level tabular data

Anonymized numerical & categorical features

Strong temporal dependency

Severe class imbalance

⚠️ Dataset files are not included and must be placed under:
Dataset/IEEE_CIS/

⚙️ Preprocessing Pipeline
🕒 1. Real-Time Train / Validation Split

📓 01_preprocessing_real_time_split.ipynb

Time-based splitting

Prevents future information leakage

Mimics real-world production behavior

🏷️ 2. CatBoost-Optimized Dataset

📓 01b_preprocessing_catboost_dataset.ipynb

Preserves categorical features

Optimized for CatBoost’s native handling

🤖 Base Models

All base models use:

🔁 Out-of-Fold (OOF) predictions

🎯 Optuna hyperparameter optimization

🔍 SHAP explainability

🌲 LightGBM

📓 02_lightgbm_base_model_oof_optuna_shap.ipynb

Gradient boosting for tabular data

Strong baseline with fast training

🌐 Isolation Forest

📓 03_isolation_forest_base_model_oof_optuna_shap.ipynb

Unsupervised anomaly detection

Captures rare and abnormal behavior

🧠 Autoencoder

📓 04_autoencoder_base_model_oof_optuna_shap_v2.ipynb

Neural network for anomaly detection

Learns compressed representations of normal transactions

🐱 CatBoost

📓 05_catboost_base_model_oof_optuna_shap_fast.ipynb

Native categorical feature handling

Minimal preprocessing with strong performance

🧩 Meta Learner — Stacking Ensemble
🚀 XGBoost Meta-Model

📓 06_xgb_meta_learner_optuna_shap_with_cat.ipynb

Trained on OOF predictions from all base models

Learns optimal combination of model outputs

Optuna-tuned hyperparameters

SHAP used to explain ensemble decisions

🔥 This stage delivers the largest performance improvement.

📈 Evaluation Strategy

Accuracy is misleading for fraud detection.

Metrics used:

📊 ROC-AUC

📉 PR-AUC

🎯 Recall (Fraud Capture Rate)

📌 Precision

🏆 Recall@Top-K

⚖️ Threshold tuning based on business cost

🔍 Explainability (SHAP)

SHAP is applied to:

Base models

Meta learner

Provides:

🌍 Global feature importance

🔎 Local transaction-level explanations

🧾 Audit-ready decision tracing

▶️ Recommended Execution Order

1️⃣ 01_preprocessing_real_time_split.ipynb
2️⃣ 01b_preprocessing_catboost_dataset.ipynb

3️⃣ Base Models

02_lightgbm_base_model_oof_optuna_shap.ipynb

03_isolation_forest_base_model_oof_optuna_shap.ipynb

04_autoencoder_base_model_oof_optuna_shap_v2.ipynb

05_catboost_base_model_oof_optuna_shap_fast.ipynb

4️⃣ Meta Learner

06_xgb_meta_learner_optuna_shap_with_cat.ipynb

🛑 Data Leakage Prevention

Strict safeguards against:

Using future transactions

Cross-time contamination

Post-event feature leakage

✔ All splits occur before modeling

🧰 Tech Stack

Python

Pandas / NumPy

Scikit-learn

LightGBM

CatBoost

XGBoost

Optuna

SHAP

Jupyter Notebook

🗺️ Future Enhancements

🔄 Modular pipeline refactor

📐 Probability calibration

📡 Feature & prediction drift detection

🌐 Real-time inference API

📄 Model cards for compliance

📜 License

Licensed under the MIT License
See LICENSE for details.

👤 Author

Akshat
Fraud Detection & Machine Learning
GitHub: https://github.com/Dhingraakshat

## 🗂️ Repository Structure

```text
Fraud-detection/
│
├── LICENSE
├── README.md
│
├── Dataset/
│   └── IEEE_CIS/
│       └── (IEEE-CIS Fraud Detection dataset files)
│
├── Preprocessing/
│   ├── 01_preprocessing_real_time_split.ipynb
│   └── 01b_preprocessing_catboost_dataset.ipynb
│
├── Base_Models/
│   ├── 02_lightgbm_base_model_oof_optuna_shap.ipynb
│   ├── 03_isolation_forest_base_model_oof_optuna_shap.ipynb
│   ├── 04_autoencoder_base_model_oof_optuna_shap_v2.ipynb
│   └── 05_catboost_base_model_oof_optuna_shap_fast.ipynb
│
└── Meta_Learner/
    └── 06_xgb_meta_learner_optuna_shap_with_cat.ipynb
