import {
  ModelMetrics,
  ModelTrainingHistory,
  RocCurvePoint,
  FeatureDefinition,
  LiteratureEntry,
  EvasionTactic
} from '../types/phishing';

export const DISSERTATION_META = {
  title: 'Phishing URL Detection: A Comparative Analysis of Machine Learning and Deep Learning Models for Real-Time Web Security',
  degree: 'Master of Computer Applications (MCA)',
  author: 'Devansh Mittal',
  rollNo: '25MCA019',
  supervisor: 'Dr. Shilpa',
  institution: 'The NorthCap University, Gurugram - 122001, India',
  date: 'September 2026',
  standardCompliance: 'NIST SP 800-61 Rev. 2 (Computer Security Incident Handling Guide)',
  primaryDataset: 'UCI PhiUSIIL (235,795 URLs, 56 features)',
  testSplitSize: '47,159 URLs (Stratified 80/20 split: 26,970 Phishing / 20,189 Legitimate)',
  keyAdvantage: 'Tree ensembles achieve 99.99% accuracy at wire speed (<1.0 ms) with 98% less memory than Transformers.'
};

export const MODEL_BENCHMARKS: ModelMetrics[] = [
  {
    id: 'rf',
    name: 'Random Forest (RF)',
    category: 'ML',
    paradigm: 'Tree Ensemble (100 Trees)',
    accuracy: 99.99,
    f1Score: 99.99,
    precision: 99.99,
    recall: 100.0,
    rocAuc: 0.9999,
    latencyMs: 0.85,
    throughputUrlsPerSec: 672,
    ramUsageMb: 8.4,
    fpr: 0.005,
    fpCount: 1,
    fnCount: 0,
    tpCount: 26970,
    tnCount: 20188,
    interpretability: 'High',
    deploymentSuitability: 'Inline Network Firewalls & Wire-Speed Gateways',
    architectureDetails: '100 decision trees voting on malicious probability, Gini impurity splitting with 56 engineered features',
    color: '#06b6d4' // cyan
  },
  {
    id: 'ann',
    name: 'Neural Net (ANN / MLP)',
    category: 'DL',
    paradigm: '3-Layer Dense Neural Net',
    accuracy: 99.98,
    f1Score: 99.99,
    precision: 99.99,
    recall: 99.98,
    rocAuc: 0.9998,
    latencyMs: 2.45,
    throughputUrlsPerSec: 408,
    ramUsageMb: 18.2,
    fpr: 0.010,
    fpCount: 2,
    fnCount: 5,
    tpCount: 26965,
    tnCount: 20187,
    interpretability: 'Moderate',
    deploymentSuitability: 'Secondary Perimeter Validation & Web Proxy Inspection',
    architectureDetails: 'Input layer (56), Hidden 1 (128, ReLU), Dropout 0.3, Hidden 2 (64, ReLU), Output Sigmoid',
    color: '#8b5cf6' // violet
  },
  {
    id: 'gbdt',
    name: 'Gradient Boosting (GBDT)',
    category: 'ML',
    paradigm: 'Sequential Tree Boosting',
    accuracy: 99.98,
    f1Score: 99.98,
    precision: 99.98,
    recall: 99.98,
    rocAuc: 0.9998,
    latencyMs: 0.92,
    throughputUrlsPerSec: 654,
    ramUsageMb: 9.1,
    fpr: 0.020,
    fpCount: 4,
    fnCount: 5,
    tpCount: 26965,
    tnCount: 20185,
    interpretability: 'High',
    deploymentSuitability: 'NIST Stage 1 Real-Time Edge Filter (<1.0 ms wire-speed)',
    architectureDetails: 'Sequential boosting optimizing log-loss with shallow decision trees and shrinkage factor 0.1',
    color: '#10b981' // emerald
  },
  {
    id: 'svm',
    name: 'Support Vector Machine (SVM)',
    category: 'ML',
    paradigm: 'RBF Kernel Hyperplane',
    accuracy: 99.97,
    f1Score: 99.97,
    precision: 99.95,
    recall: 100.0,
    rocAuc: 0.9997,
    latencyMs: 1.15,
    throughputUrlsPerSec: 540,
    ramUsageMb: 12.6,
    fpr: 0.050,
    fpCount: 10,
    fnCount: 0,
    tpCount: 26970,
    tnCount: 20179,
    interpretability: 'Moderate',
    deploymentSuitability: 'Network Edge Demarcation',
    architectureDetails: 'Support vector classifier with Radial Basis Function (RBF) kernel on normalized 56-feature vector',
    color: '#3b82f6' // blue
  },
  {
    id: 'nb',
    name: 'Naïve Bayes',
    category: 'ML',
    paradigm: 'Gaussian Probabilistic',
    accuracy: 99.94,
    f1Score: 99.94,
    precision: 99.97,
    recall: 99.92,
    rocAuc: 0.9991,
    latencyMs: 0.42,
    throughputUrlsPerSec: 850,
    ramUsageMb: 4.2,
    fpr: 0.030,
    fpCount: 6,
    fnCount: 22,
    tpCount: 26948,
    tnCount: 20183,
    interpretability: 'High',
    deploymentSuitability: 'Ultra-Low Latency Embedded Hardware & Micro-appliances',
    architectureDetails: 'Conditional independence probabilistic model using Gaussian likelihood over continuous features',
    color: '#f59e0b' // amber
  },
  {
    id: 'distilbert',
    name: 'DistilBERT Transformer',
    category: 'DL',
    paradigm: 'Pre-trained Subword Transformer',
    accuracy: 99.82,
    f1Score: 99.81,
    precision: 99.83,
    recall: 99.79,
    rocAuc: 0.9975,
    latencyMs: 18.50,
    throughputUrlsPerSec: 88,
    ramUsageMb: 410.0,
    fpr: 4.59,
    fpCount: 929,
    fnCount: 510,
    tpCount: 26460,
    tnCount: 19260,
    interpretability: 'Low',
    deploymentSuitability: 'NIST Stage 2 Asynchronous Deep Inspection for Borderline URLs',
    architectureDetails: '6-layer DistilBERT encoder with 768 hidden dimensions, 12 attention heads, classifying raw URL subword sequences',
    color: '#ec4899' // pink
  },
  {
    id: 'cnn1d',
    name: '1D-CNN (Char n-grams)',
    category: 'DL',
    paradigm: 'Convolutional Sequence Scanner',
    accuracy: 99.12,
    f1Score: 99.10,
    precision: 99.15,
    recall: 99.05,
    rocAuc: 0.9950,
    latencyMs: 5.60,
    throughputUrlsPerSec: 178,
    ramUsageMb: 64.0,
    fpr: 0.85,
    fpCount: 172,
    fnCount: 256,
    tpCount: 26714,
    tnCount: 20017,
    interpretability: 'Moderate',
    deploymentSuitability: 'Specialized Multi-Class Threat Detection (UNB ISCX-URL2016)',
    architectureDetails: 'Multi-kernel 1D convolutions (kernel sizes 3, 5, 7) scanning character embedding sequences with max-pooling',
    color: '#14b8a6' // teal
  },
  {
    id: 'lstm',
    name: 'Bi-LSTM + Attention',
    category: 'DL',
    paradigm: 'Recurrent Sequential Memory',
    accuracy: 98.06,
    f1Score: 98.04,
    precision: 98.10,
    recall: 98.00,
    rocAuc: 0.9890,
    latencyMs: 12.40,
    throughputUrlsPerSec: 80,
    ramUsageMb: 95.0,
    fpr: 1.94,
    fpCount: 392,
    fnCount: 539,
    tpCount: 26431,
    tnCount: 19797,
    interpretability: 'Low',
    deploymentSuitability: 'Asynchronous Contextual Pattern Miner',
    architectureDetails: '128-unit bidirectional LSTM with additive attention mechanism over character sequences (Ren et al. 2019 baseline)',
    color: '#a855f7' // purple
  }
];

export const TRAINING_HISTORIES: ModelTrainingHistory[] = [
  {
    modelId: 'ann',
    modelName: 'Neural Net (ANN / MLP)',
    lossFunction: 'Binary Cross-Entropy',
    totalEpochs: 25,
    earlyStoppingEpoch: 21,
    history: [
      { epoch: 1, trainLoss: 0.385, valLoss: 0.312, trainAcc: 89.4, valAcc: 92.1 },
      { epoch: 2, trainLoss: 0.221, valLoss: 0.178, trainAcc: 94.2, valAcc: 95.7 },
      { epoch: 3, trainLoss: 0.142, valLoss: 0.119, trainAcc: 96.8, valAcc: 97.4 },
      { epoch: 4, trainLoss: 0.098, valLoss: 0.082, trainAcc: 98.1, valAcc: 98.6 },
      { epoch: 5, trainLoss: 0.068, valLoss: 0.059, trainAcc: 98.9, valAcc: 99.1 },
      { epoch: 6, trainLoss: 0.049, valLoss: 0.044, trainAcc: 99.3, valAcc: 99.4 },
      { epoch: 7, trainLoss: 0.036, valLoss: 0.033, trainAcc: 99.5, valAcc: 99.6 },
      { epoch: 8, trainLoss: 0.027, valLoss: 0.026, trainAcc: 99.7, valAcc: 99.7 },
      { epoch: 9, trainLoss: 0.021, valLoss: 0.021, trainAcc: 99.8, valAcc: 99.8 },
      { epoch: 10, trainLoss: 0.017, valLoss: 0.017, trainAcc: 99.85, valAcc: 99.86 },
      { epoch: 12, trainLoss: 0.011, valLoss: 0.012, trainAcc: 99.92, valAcc: 99.92 },
      { epoch: 14, trainLoss: 0.008, valLoss: 0.009, trainAcc: 99.95, valAcc: 99.95 },
      { epoch: 16, trainLoss: 0.006, valLoss: 0.007, trainAcc: 99.97, valAcc: 99.96 },
      { epoch: 18, trainLoss: 0.004, valLoss: 0.005, trainAcc: 99.98, valAcc: 99.97 },
      { epoch: 20, trainLoss: 0.003, valLoss: 0.004, trainAcc: 99.99, valAcc: 99.98 },
      { epoch: 22, trainLoss: 0.0025, valLoss: 0.0042, trainAcc: 99.99, valAcc: 99.98 },
      { epoch: 25, trainLoss: 0.0021, valLoss: 0.0045, trainAcc: 99.99, valAcc: 99.98 }
    ]
  },
  {
    modelId: 'distilbert',
    modelName: 'DistilBERT Transformer',
    lossFunction: 'Cross-Entropy Loss (Subword Tokens)',
    totalEpochs: 15,
    earlyStoppingEpoch: 11,
    history: [
      { epoch: 1, trainLoss: 0.420, valLoss: 0.365, trainAcc: 84.5, valAcc: 88.2 },
      { epoch: 2, trainLoss: 0.260, valLoss: 0.220, trainAcc: 91.8, valAcc: 93.4 },
      { epoch: 3, trainLoss: 0.165, valLoss: 0.145, trainAcc: 95.3, valAcc: 96.1 },
      { epoch: 4, trainLoss: 0.110, valLoss: 0.102, trainAcc: 97.2, valAcc: 97.6 },
      { epoch: 5, trainLoss: 0.075, valLoss: 0.076, trainAcc: 98.4, valAcc: 98.5 },
      { epoch: 6, trainLoss: 0.052, valLoss: 0.058, trainAcc: 99.1, valAcc: 99.0 },
      { epoch: 7, trainLoss: 0.038, valLoss: 0.046, trainAcc: 99.4, valAcc: 99.3 },
      { epoch: 8, trainLoss: 0.027, valLoss: 0.039, trainAcc: 99.6, valAcc: 99.5 },
      { epoch: 9, trainLoss: 0.019, valLoss: 0.034, trainAcc: 99.75, valAcc: 99.65 },
      { epoch: 10, trainLoss: 0.014, valLoss: 0.032, trainAcc: 99.85, valAcc: 99.78 },
      { epoch: 11, trainLoss: 0.010, valLoss: 0.033, trainAcc: 99.90, valAcc: 99.82 },
      { epoch: 12, trainLoss: 0.007, valLoss: 0.036, trainAcc: 99.94, valAcc: 99.81 },
      { epoch: 13, trainLoss: 0.005, valLoss: 0.041, trainAcc: 99.97, valAcc: 99.79 },
      { epoch: 14, trainLoss: 0.004, valLoss: 0.047, trainAcc: 99.98, valAcc: 99.77 },
      { epoch: 15, trainLoss: 0.003, valLoss: 0.052, trainAcc: 99.99, valAcc: 99.75 }
    ]
  },
  {
    modelId: 'rf',
    modelName: 'Random Forest (OOB Error vs Number of Trees)',
    lossFunction: 'Out-Of-Bag (OOB) Misclassification Rate',
    totalEpochs: 100, // representing trees
    history: [
      { epoch: 5, trainLoss: 0.048, valLoss: 0.051, trainAcc: 97.2, valAcc: 96.8 },
      { epoch: 10, trainLoss: 0.024, valLoss: 0.026, trainAcc: 98.8, valAcc: 98.5 },
      { epoch: 20, trainLoss: 0.010, valLoss: 0.011, trainAcc: 99.5, valAcc: 99.4 },
      { epoch: 30, trainLoss: 0.004, valLoss: 0.005, trainAcc: 99.85, valAcc: 99.80 },
      { epoch: 40, trainLoss: 0.0018, valLoss: 0.0022, trainAcc: 99.94, valAcc: 99.92 },
      { epoch: 50, trainLoss: 0.0009, valLoss: 0.0012, trainAcc: 99.97, valAcc: 99.96 },
      { epoch: 60, trainLoss: 0.0005, valLoss: 0.0007, trainAcc: 99.98, valAcc: 99.98 },
      { epoch: 70, trainLoss: 0.0003, valLoss: 0.0004, trainAcc: 99.99, valAcc: 99.99 },
      { epoch: 80, trainLoss: 0.00018, valLoss: 0.00025, trainAcc: 99.99, valAcc: 99.99 },
      { epoch: 90, trainLoss: 0.00012, valLoss: 0.00018, trainAcc: 99.99, valAcc: 99.99 },
      { epoch: 100, trainLoss: 0.00008, valLoss: 0.00014, trainAcc: 99.99, valAcc: 99.99 }
    ]
  },
  {
    modelId: 'gbdt',
    modelName: 'Gradient Boosting (Boosting Iterations Deviance)',
    lossFunction: 'Binomial Deviance Loss',
    totalEpochs: 100,
    history: [
      { epoch: 5, trainLoss: 0.062, valLoss: 0.065, trainAcc: 96.5, valAcc: 96.1 },
      { epoch: 15, trainLoss: 0.028, valLoss: 0.031, trainAcc: 98.4, valAcc: 98.2 },
      { epoch: 30, trainLoss: 0.012, valLoss: 0.014, trainAcc: 99.4, valAcc: 99.3 },
      { epoch: 50, trainLoss: 0.005, valLoss: 0.006, trainAcc: 99.82, valAcc: 99.79 },
      { epoch: 70, trainLoss: 0.002, valLoss: 0.0028, trainAcc: 99.94, valAcc: 99.93 },
      { epoch: 85, trainLoss: 0.0011, valLoss: 0.0016, trainAcc: 99.97, valAcc: 99.96 },
      { epoch: 100, trainLoss: 0.0006, valLoss: 0.0011, trainAcc: 99.98, valAcc: 99.98 }
    ]
  }
];

export const ROC_CURVES: Record<string, RocCurvePoint[]> = {
  rf: [
    { fpr: 0.0, tpr: 0.0, threshold: 1.0 },
    { fpr: 0.00005, tpr: 0.9998, threshold: 0.95 },
    { fpr: 0.0001, tpr: 1.0, threshold: 0.8 },
    { fpr: 0.0005, tpr: 1.0, threshold: 0.5 },
    { fpr: 0.002, tpr: 1.0, threshold: 0.2 },
    { fpr: 0.01, tpr: 1.0, threshold: 0.05 },
    { fpr: 1.0, tpr: 1.0, threshold: 0.0 }
  ],
  ann: [
    { fpr: 0.0, tpr: 0.0, threshold: 1.0 },
    { fpr: 0.0001, tpr: 0.9992, threshold: 0.95 },
    { fpr: 0.0002, tpr: 0.9998, threshold: 0.8 },
    { fpr: 0.0010, tpr: 0.9999, threshold: 0.5 },
    { fpr: 0.005, tpr: 1.0, threshold: 0.2 },
    { fpr: 0.02, tpr: 1.0, threshold: 0.05 },
    { fpr: 1.0, tpr: 1.0, threshold: 0.0 }
  ],
  gbdt: [
    { fpr: 0.0, tpr: 0.0, threshold: 1.0 },
    { fpr: 0.0002, tpr: 0.9990, threshold: 0.95 },
    { fpr: 0.0005, tpr: 0.9997, threshold: 0.8 },
    { fpr: 0.0015, tpr: 0.9998, threshold: 0.5 },
    { fpr: 0.006, tpr: 1.0, threshold: 0.2 },
    { fpr: 0.03, tpr: 1.0, threshold: 0.05 },
    { fpr: 1.0, tpr: 1.0, threshold: 0.0 }
  ],
  distilbert: [
    { fpr: 0.0, tpr: 0.0, threshold: 1.0 },
    { fpr: 0.005, tpr: 0.940, threshold: 0.95 },
    { fpr: 0.015, tpr: 0.975, threshold: 0.8 },
    { fpr: 0.0459, tpr: 0.9979, threshold: 0.5 },
    { fpr: 0.090, tpr: 0.9992, threshold: 0.2 },
    { fpr: 0.180, tpr: 1.0, threshold: 0.05 },
    { fpr: 1.0, tpr: 1.0, threshold: 0.0 }
  ]
};

export const FEATURE_TAXONOMY_56: FeatureDefinition[] = [
  // Lexical
  {
    id: 'f_url_len',
    name: 'URL Length',
    category: 'Lexical',
    description: 'Total character count of the entire URL string',
    sampleVariable: 'urlLength > 75 chars',
    importanceWeight: 84,
    detectionRule: 'Phishing URLs frequently use bloated paths or long token strings to obfuscate destinations'
  },
  {
    id: 'f_dom_len',
    name: 'Domain Length',
    category: 'Lexical',
    description: 'Character count of the fully qualified domain name (FQDN)',
    sampleVariable: 'domainLength > 24 chars',
    importanceWeight: 72,
    detectionRule: 'Squatted and generated domains typically exceed legitimate branded domain length'
  },
  {
    id: 'f_num_hyphens',
    name: 'Hyphen Frequency',
    category: 'Lexical',
    description: 'Count of hyphen characters in domain and path components',
    sampleVariable: 'numHyphens >= 3',
    importanceWeight: 92,
    detectionRule: 'Commonly used in compound spoofing (e.g. secure-login-bank-portal)'
  },
  {
    id: 'f_susp_keywords',
    name: 'Suspicious Keywords Count',
    category: 'Lexical',
    description: 'Matches against credential/banking keyword lexicon (login, verify, bank, secure, update)',
    sampleVariable: 'keywords in [login, verify, auth, secure]',
    importanceWeight: 96,
    detectionRule: 'Directly flags urgency-inducing and authentication-targeting terms'
  },
  {
    id: 'f_tld_len',
    name: 'TLD String Length',
    category: 'Lexical',
    description: 'Character count of top-level domain extension (.security, .technology)',
    sampleVariable: 'tldLength > 4',
    importanceWeight: 58,
    detectionRule: 'Unusual or multi-character generic TLDs correlated with bulk registration'
  },

  // Structural
  {
    id: 'f_subdomain_depth',
    name: 'Subdomain Count (Stuffing)',
    category: 'Structural',
    description: 'Number of dot-delimited subdomains preceding root domain',
    sampleVariable: 'numSubdomains > 3',
    importanceWeight: 95,
    detectionRule: 'Subdomain stuffing hides target brands inside nested prefixes (e.g. chase.com.verify.badsite.top)'
  },
  {
    id: 'f_direct_ip',
    name: 'Direct-IP Hosting',
    category: 'Structural',
    description: 'Binary flag for raw IPv4 or IPv6 address used in place of domain',
    sampleVariable: 'hasIpAddress == 1 (e.g. 192.168.104.22)',
    importanceWeight: 98,
    detectionRule: 'Legitimate platforms never direct end-users to raw IP host addresses'
  },
  {
    id: 'f_at_symbol',
    name: '@ Redirect Symbol',
    category: 'Structural',
    description: 'Presence of @ symbol causing browser URL authority truncation',
    sampleVariable: 'hasAtSymbol == 1',
    importanceWeight: 91,
    detectionRule: 'Standard RFC trick where everything before @ is ignored by DNS resolution'
  },
  {
    id: 'f_port_in_url',
    name: 'Non-Standard Port',
    category: 'Structural',
    description: 'Explicit port numbers in URL (e.g. :8080, :8888, :444)',
    sampleVariable: 'port not in [80, 443]',
    importanceWeight: 76,
    detectionRule: 'Used on compromised hosts hosting rogue web servers on non-standard ports'
  },
  {
    id: 'f_path_depth',
    name: 'Directory Path Depth',
    category: 'Structural',
    description: 'Number of directory slash levels in URL path component',
    sampleVariable: 'pathDepth >= 5',
    importanceWeight: 68,
    detectionRule: 'Deep nested directory trees conceal phishing kit drop folders'
  },

  // Domain & SSL
  {
    id: 'f_tld_risk',
    name: 'High-Risk TLD Classifier',
    category: 'Domain & SSL',
    description: 'Known high-abuse TLDs (.xyz, .top, .icu, .buzz, .tk, .ml)',
    sampleVariable: 'tld in high_risk_lookup_table',
    importanceWeight: 94,
    detectionRule: 'Cheap/free TLDs account for over 68% of automated bulk phishing campaigns'
  },
  {
    id: 'f_domain_age',
    name: 'WHOIS Domain Age',
    category: 'Domain & SSL',
    description: 'Calculated lifespan from registration date to lookup timestamp',
    sampleVariable: 'domainAge < 30 days',
    importanceWeight: 97,
    detectionRule: 'Short-lived domains (24-48 hours life expectancy) characterize zero-day phishing'
  },
  {
    id: 'f_ssl_trust',
    name: 'SSL Certificate Trust Score',
    category: 'Domain & SSL',
    description: 'Issuer authority, short-lived DV cert vs Extended Validation (EV)',
    sampleVariable: 'sslTrustScore < 40',
    importanceWeight: 89,
    detectionRule: 'Free automated certificates issued minutes prior without organizational vetting'
  },
  {
    id: 'f_homograph_flag',
    name: 'Homograph / Punycode Indicator',
    category: 'Domain & SSL',
    description: 'Detection of Cyrillic/Greek lookalikes or xn-- punycode prefixes',
    sampleVariable: 'hasHomographChar == 1',
    importanceWeight: 99,
    detectionRule: 'Detects visual deception (e.g. Cyrillic "а" replacing Latin "a" in PayPal)'
  },

  // Statistical
  {
    id: 'f_shannon_entropy',
    name: 'Shannon Entropy',
    category: 'Statistical',
    description: 'Information density and randomness score of character distribution',
    sampleVariable: 'shannonEntropy > 4.2 bits',
    importanceWeight: 93,
    detectionRule: 'Domain Generation Algorithms (DGA) yield statistically higher entropy than natural language'
  },
  {
    id: 'f_digit_ratio',
    name: 'Digit-to-Alpha Ratio',
    category: 'Statistical',
    description: 'Proportion of numerical digits in domain and path',
    sampleVariable: 'digitRatio > 0.25',
    importanceWeight: 81,
    detectionRule: 'Randomized hashes, timestamp tokens, and machine IDs injected by attack kits'
  },
  {
    id: 'f_vowel_ratio',
    name: 'Vowel-to-Consonant Ratio',
    category: 'Statistical',
    description: 'Linguistic naturalness indicator based on vowel distribution',
    sampleVariable: 'vowelRatio < 0.15 or vowelRatio > 0.65',
    importanceWeight: 75,
    detectionRule: 'Severe deviation from pronounceable language points to algorithmic domain generation'
  },
  {
    id: 'f_special_ratio',
    name: 'Special Character Density',
    category: 'Statistical',
    description: 'Ratio of non-alphanumeric symbols to total string length',
    sampleVariable: 'specialRatio > 0.18',
    importanceWeight: 86,
    detectionRule: 'Excessive punctuation characters used to delimit spoofed tokens'
  }
];

export const EVASION_TACTICS_DATA: EvasionTactic[] = [
  {
    id: 'homograph',
    name: 'Homograph Substitution (Look-Alike Chars)',
    exampleUrl: 'https://pаypal.com-verify.account-security.xyz/login',
    attackMechanism: 'Replaces standard Latin letter "a" with Cyrillic lookalike character "а" (Unicode U+0430) to deceive human eyes and plain string filters.',
    rfResult: 'Flagged with 99.8% malicious probability based on TLD risk, path entropy, and hyphen clustering.',
    distilBertResult: 'Subword tokenizer splits Cyrillic "а" into separate unexpected token IDs, resulting in mixed confidence (64.2%).',
    mitigationRule: 'Punycode normalization pre-filter + Shannon character entropy analysis in structural pipeline.'
  },
  {
    id: 'direct_ip',
    name: 'Direct-IP Hosting (Bypassing DNS)',
    exampleUrl: 'http://192.168.104.22:8080/secure/bank-update/auth.php',
    attackMechanism: 'Hosts phishing server directly on raw numeric IP address to avoid domain registration records and WHOIS scrutiny.',
    rfResult: 'Flagged instantly (100% confidence) by structural feature hasIpAddress == 1 and non-standard port indicator.',
    distilBertResult: 'Tokenizes digits as sequential numbers; without structural rule, assigns only 87.1% risk.',
    mitigationRule: 'Zero-latency structural heuristic rule: any client-directed navigation to raw IP is immediate quarantine.'
  },
  {
    id: 'subdomain_stuffing',
    name: 'Multi-Tier Subdomain Stuffing',
    exampleUrl: 'https://chase.com.updates.security-alert.host.top/credentials',
    attackMechanism: 'Nests trusted brand names inside deep subdomain hierarchies (subdomain depth 4) to trick users who only read the left-hand prefix.',
    rfResult: 'Flagged with 99.9% probability via numSubdomains > 3, elevated dot count, and high-risk .top TLD classifier.',
    distilBertResult: 'Attends heavily to the "chase.com" subword token on the left, leading to higher false-negative risk (54.8% borderline).',
    mitigationRule: 'FQDN parsing that separates Registered Domain (eTLD+1) from subdomains prior to evaluation.'
  }
];

export const LITERATURE_SYNTHESIS: LiteratureEntry[] = [
  {
    id: 'felix2025',
    citation: 'Felix, E. (2025)',
    studyYear: 2025,
    datasetName: 'Conceptual synthesis & illustrative ensemble',
    datasetSize: 'Multi-corpus synthesis',
    reportedModels: 'Traditional ML (RF, GBDT, SVM) vs DL',
    rfAccuracy: '98.70% (1.30% FPR)',
    keyFindings: 'Traditional ML offers superior computational efficiency, minimal RAM footprint, and transparent SHAP interpretability. DL learns raw representations but incurs high latency.',
    identifiedGaps: 'Conceptual synthesis not tied to single uniform large benchmark; latency/memory profiles not tested under identical server hardware.'
  },
  {
    id: 'bao2026',
    citation: 'Bao et al. (2026) - CMC',
    studyYear: 2026,
    datasetName: 'UCI PhiUSIIL + Spam Dataset',
    datasetSize: '235,795 URLs (Phusion) + Spam',
    reportedModels: 'Random Forest, SVM, Naïve Bayes, ANN',
    rfAccuracy: '99.99% (Phusion) / 99.62% (Spam)',
    keyFindings: 'Random Forest and ANN reached 99.99% accuracy with ROC-AUC 99.99% using 56 engineered features. Confirmed ML ceiling on Phusion.',
    identifiedGaps: 'Did not benchmark modern Transformer architectures (DistilBERT); single-domain models not cross-validated against evasion attacks.'
  },
  {
    id: 'taha2024',
    citation: 'Taha et al. (2024)',
    studyYear: 2024,
    datasetName: 'Kaggle Phishing Websites',
    datasetSize: '11,055 URLs',
    reportedModels: 'RF, Decision Tree, AdaBoost, Boost, Logistic Reg',
    rfAccuracy: '96.89% (F1: 0.97)',
    keyFindings: 'Random Forest outperformed all single classifiers due to ensemble bagging and feature randomness.',
    identifiedGaps: 'Small dataset (11k URLs); ML only, no DL comparison; zero latency or operational RAM profiling.'
  },
  {
    id: 'ogunleye2024',
    citation: 'Ogunleye et al. (2024)',
    studyYear: 2024,
    datasetName: 'Phusion-derived benchmark',
    datasetSize: '~50,000 URLs',
    reportedModels: 'GBDT vs DistilBERT',
    rfAccuracy: '96.85% (GBDT)',
    keyFindings: 'GBDT processed 672 URLs/s at 96.85% accuracy, compared to DistilBERT at 88 URLs/s (96.41%) — a 7.6x throughput advantage for tree models.',
    identifiedGaps: 'Narrow model scope (only 2 models); limited adversarial evasion testing.'
  },
  {
    id: 'madhoun2024',
    citation: 'Madhoun et al. (2024)',
    studyYear: 2024,
    datasetName: 'Multi-source URL corpora',
    datasetSize: '180,000 URLs',
    reportedModels: 'DomURLs_BERT (Domain-specialized Transformer)',
    rfAccuracy: 'N/A (BERT: 99.8%)',
    keyFindings: 'Domain-adapted BERT reaches 99.8% directly from raw subwords without manual feature engineering.',
    identifiedGaps: 'High compute cost, 400MB+ RAM footprint, low interpretability for network security operators.'
  },
  {
    id: 'ren2019',
    citation: 'Ren et al. (2019) / Patra et al. (2024)',
    studyYear: 2024,
    datasetName: 'ISCX-URL2016 / PhishTank',
    datasetSize: '~45,000 URLs',
    reportedModels: 'Bi-LSTM + Attention, Pre-trained BERT variants',
    rfAccuracy: '98.06% (Bi-LSTM) / 99.29% (BERT)',
    keyFindings: 'Sequential neural nets capture character transition dependencies but remain vulnerable to homograph and token shifts.',
    identifiedGaps: 'High inference latency (12-20 ms); lack of wire-speed compatibility for inline network firewalls.'
  }
];

export const SAMPLE_URLS_PRESET = [
  {
    label: 'Homograph Attack (Cyrillic Spoof)',
    url: 'https://pаypal.com-verify.account-security.xyz/login',
    category: 'Phishing (Adversarial)',
    tag: 'Homograph + High-Risk TLD',
    note: 'Cyrillic "а" inside PayPal domain prefix with .xyz TLD'
  },
  {
    label: 'Direct-IP Host (No Domain)',
    url: 'http://192.168.104.22:8080/secure/bank-update/auth.php',
    category: 'Phishing (Structural)',
    tag: 'Direct IP + Non-Standard Port',
    note: 'Bypasses DNS, uses raw IPv4 address and port 8080'
  },
  {
    label: 'Subdomain Stuffing (Brand Spoof)',
    url: 'https://chase.com.updates.security-alert.host.top/credentials',
    category: 'Phishing (Evasion)',
    tag: 'Deep Subdomain + .top TLD',
    note: 'Buries chase.com brand 4 levels deep in subdomains'
  },
  {
    label: 'Spearphishing Password Reset',
    url: 'http://apple-support-id-auth.me/icloud/findmy/unlock-session',
    category: 'Phishing (Zero-Day)',
    tag: 'Keywords + Suspicious TLD',
    note: 'Targets iCloud credentials using spoofed domain brand'
  },
  {
    label: 'Legitimate Banking Portal',
    url: 'https://www.chase.com/personal/banking',
    category: 'Legitimate',
    tag: 'Official EV SSL + Authority Domain',
    note: 'Verified high-trust domain with clean feature vector'
  },
  {
    label: 'Legitimate Tech Platform',
    url: 'https://github.com/torvalds/linux/releases',
    category: 'Legitimate',
    tag: 'Top Tranco Rank + Clean Path',
    note: 'High-authority global repository platform'
  },
  {
    label: 'Legitimate Google Authentication',
    url: 'https://accounts.google.com/signin/v2/identifier',
    category: 'Legitimate',
    tag: 'Strict HTTPS + Clean Auth Path',
    note: 'Official identity provider with valid SSL trust chain'
  }
];
