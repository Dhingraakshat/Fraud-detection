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

