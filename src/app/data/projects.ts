export const projects = [
  {
    id: "cardiosense",
    slug: "cardiosense",
    demo: "ecg",
    tagline: "Atrial fibrillation detection on a $30 wrist device, no cloud.",
    stack: ["PyTorch", "NumPy", "SciPy", "SwiftUI", "Streamlit", "BLE"],
    metrics: [
      { label: "Accuracy", value: "91%", note: "95% with safety gate" },
      { label: "Inference", value: "10 ms", note: "on-device" },
      { label: "Model", value: "200 KB", note: "43K params" },
      { label: "Built in", value: "24 h", note: "end to end" }
    ],
    title: "CardioSense",
    category: "Embedded ML / Health",
    image: "https://images.unsplash.com/photo-1682706841289-9d7ddf5eb999?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxFQ0clMjBoZWFydCUyMHJhdGUlMjBtb25pdG9yJTIwZWxlY3Ryb25pY3MlMjBjaXJjdWl0fGVufDF8fHx8MTc4NTc5OTUwN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    year: "2026",
    client: "UC Davis",
    role: "PyTorch, DSP, SwiftUI, BLE",
    description:
      "A sub-$30 wearable ECG that continuously detects atrial fibrillation entirely on-device — no cloud — returning a rhythm verdict in under 10 seconds. Built end-to-end in 24 hours.",
    highlights: [
      "Trained a 43K-parameter 1D CNN (PyTorch) on MIT-BIH clinical ECG data to classify 10-second windows as Normal or Arrhythmia, reaching ~91% accuracy — 95% with a strict \"Uncertain\" safety gate.",
      "~10 ms inference from a 200 KB model, small enough to run continuously on constrained hardware.",
      "Built the full signal-processing pipeline: bandpass/notch filtering, Pan-Tompkins R-peak detection, and HRV feature extraction.",
      "Shipped real-time SwiftUI patient and Streamlit clinician interfaces streaming over BLE."
    ]
  },
  {
    id: "infracopilot-ai",
    slug: "infracopilot-ai",
    demo: "grid",
    tagline: "Predictive maintenance that flags a charger before it strands a driver.",
    stack: ["scikit-learn", "SMOTE", "FastAPI", "Next.js", "Pandas"],
    metrics: [
      { label: "Failure recall", value: "90%", note: "cost-aware threshold" },
      { label: "Simulated savings", value: "$300K+", note: "per network / yr" },
      { label: "Scoring", value: "Real time", note: "FastAPI" },
      { label: "Surface", value: "Dashboard", note: "root-cause insights" }
    ],
    title: "InfraCopilot AI",
    category: "Full-Stack / Predictive ML",
    image: "https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBjaGFyZ2luZyUyMHN0YXRpb258ZW58MXx8fHwxNzg1Nzk5NTA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    year: "2026",
    client: "UC Davis",
    role: "scikit-learn, FastAPI, Next.js",
    description:
      "A full-stack predictive-maintenance platform for EV charging networks that flags failing chargers before they strand a driver.",
    highlights: [
      "Developed a cost-aware ML model (scikit-learn, SMOTE) achieving ~90% failure recall and $300K+ in simulated savings.",
      "Engineered a FastAPI backend serving real-time risk scores across the network.",
      "Built a Next.js dashboard surfacing root-cause insights and actionable maintenance recommendations.",
      "Tuned the decision threshold around the real cost asymmetry between a missed failure and a false alarm."
    ]
  },
  {
    id: "fake-news-classifier",
    slug: "fake-news-classifier",
    demo: "nlp",
    tagline: "Credibility scoring that is allowed to say it isn't sure.",
    stack: ["DistilBERT", "TF-IDF", "scikit-learn", "Pandas"],
    metrics: [
      { label: "Test accuracy", value: "99%", note: "held-out" },
      { label: "Corpus", value: "44K", note: "real articles" },
      { label: "Models", value: "2", note: "classical + transformer" },
      { label: "Output", value: "Probabilistic", note: "not binary" }
    ],
    title: "Fake News Classifier",
    category: "NLP / Machine Learning",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXdzcGFwZXIlMjBzdGFjayUyMHJlYWRpbmclMjBuZXdzfGVufDF8fHx8MTc4NTc5OTUxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    year: "2025",
    client: "UC Davis",
    role: "NLP, DistilBERT, scikit-learn",
    description:
      "An end-to-end NLP pipeline that assesses news credibility, trained on ~44K real-world articles across classical and transformer approaches.",
    highlights: [
      "Compared TF-IDF + Logistic Regression against a fine-tuned DistilBERT transformer on the same corpus.",
      "Achieved ~99% test accuracy with rigorous held-out evaluation.",
      "Designed probabilistic credibility scoring that goes beyond binary real/fake labels.",
      "Emphasized ethical model outputs — calibrated confidence instead of false certainty."
    ]
  }
];
