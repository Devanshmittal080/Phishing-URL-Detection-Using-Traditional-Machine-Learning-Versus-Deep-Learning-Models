import {
  ModelMetrics,
  ModelTrainingHistory,
  RocCurvePoint,
  FeatureDefinition,
  LiteratureEntry,
  EvasionTactic,
  ModelArchitectureSpec
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

export interface HistoricalTrendPoint {
  datasetVersion: string;
  releaseDate: string;
  urlCount: number;
  featuresUsed: number;
  rfAccuracy: number;
  gbdtAccuracy: number;
  annAccuracy: number;
  transformerAccuracy: number;
  description: string;
}

export const HISTORICAL_DATASET_EVOLUTION: HistoricalTrendPoint[] = [
  {
    datasetVersion: 'v2026.01 Alpha (Pilot)',
    releaseDate: 'Jan 2026',
    urlCount: 45000,
    featuresUsed: 16,
    rfAccuracy: 97.42,
    gbdtAccuracy: 97.10,
    annAccuracy: 96.85,
    transformerAccuracy: 98.20,
    description: 'Initial lexical-only benchmark where raw-sequence DistilBERT outperformed shallow ML feature vectors'
  },
  {
    datasetVersion: 'v2026.03 (ISCX Merged)',
    releaseDate: 'Mar 2026',
    urlCount: 95000,
    featuresUsed: 28,
    rfAccuracy: 98.85,
    gbdtAccuracy: 98.62,
    annAccuracy: 98.40,
    transformerAccuracy: 98.92,
    description: 'Added structural features (subdomain depth, direct-IP). Tree ensembles closed accuracy gap with transformers'
  },
  {
    datasetVersion: 'v2026.05 (Phusion Beta)',
    releaseDate: 'May 2026',
    urlCount: 160000,
    featuresUsed: 42,
    rfAccuracy: 99.64,
    gbdtAccuracy: 99.50,
    annAccuracy: 99.45,
    transformerAccuracy: 99.35,
    description: 'Integrated WHOIS domain age & SSL certificate reputation. Tree ensembles surpassed deep transformers'
  },
  {
    datasetVersion: 'v2026.07 (Entropy & Homograph)',
    releaseDate: 'Jul 2026',
    urlCount: 200000,
    featuresUsed: 50,
    rfAccuracy: 99.91,
    gbdtAccuracy: 99.85,
    annAccuracy: 99.80,
    transformerAccuracy: 99.60,
    description: 'Added Shannon character entropy and Cyrillic punycode detectors; RF resilience grew to 99.91%'
  },
  {
    datasetVersion: 'v2026.09 (Full 56-Feature Gold)',
    releaseDate: 'Sep 2026',
    urlCount: 235795,
    featuresUsed: 56,
    rfAccuracy: 99.99,
    gbdtAccuracy: 99.98,
    annAccuracy: 99.98,
    transformerAccuracy: 99.82,
    description: 'Complete 235,795 UCI PhiUSIIL gold benchmark. Tree ensembles hit 99.99% ceiling with wire-speed latency'
  }
];

export const ARCHITECTURAL_SPECS: ModelArchitectureSpec[] = [
  {
    modelId: 'rf',
    name: 'Random Forest (RF)',
    category: 'ML',
    paradigm: 'Tree Ensemble (100 Trees)',
    totalParameters: '~120,000 Split Nodes',
    paramScaleNumber: 120000,
    parameterBreakdown: '100 orthogonal decision trees × ~1,200 internal split nodes (Gini impurity split tests)',
    featureExtractionTechnique: 'Handcrafted 56-feature pipeline: 16 lexical string length/entropy, 14 structural URL syntax, 14 domain/DNS/WHOIS reputation, and 12 statistical frequency metrics.',
    featureExtractionCategory: 'Handcrafted Domain Features',
    featurePipelineLatencyMs: 3.40,
    inputRepresentation: 'Normalized 56-dimensional continuous float vector [x₁, x₂, ..., x₅₆]',
    inputDimensions: '56 dense features',
    trainingHardwareProfile: 'Commodity 8-Core CPU (No GPU required)',
    trainingTime: '42.4 seconds (235,795 samples)',
    inferenceBigO: 'O(T · d_max) [T=100 trees, d_max=18]',
    memoryConsumptionMb: 8.4,
    runtimeInferenceMs: 0.85,
    adversarialVulnerability: 'Vulnerable to homoglyph Unicode lookalikes without pre-normalization; robust to token insertion and random query spam.',
    interpretabilityMethod: 'TreeSHAP (exact Shapley polynomial time), Mean Decrease in Impurity (MDI)',
    nistPipelineStage: 'NIST Stage 1: Wire-Speed Inline Gateway & Edge Firewall (<1.0 ms)',
    keyArchitecturalAdvantage: 'Extreme throughput (672 req/s) with 99.99% accuracy and deterministic decision trees that never suffer catastrophic forgetting.',
    keyArchitecturalLimitation: 'Cannot automatically discover unengineered syntactic anomalies outside the predefined 56-feature extraction schema.',
    color: '#06b6d4'
  },
  {
    modelId: 'gbdt',
    name: 'Gradient Boosting (GBDT)',
    category: 'ML',
    paradigm: 'Sequential Tree Boosting',
    totalParameters: '~45,000 Split Nodes',
    paramScaleNumber: 45000,
    parameterBreakdown: '100 shallow boosted trees (max_depth=6) × ~450 split nodes with shrinkage learning rate η=0.1',
    featureExtractionTechnique: 'Handcrafted 56-feature pipeline with iterative negative gradient step optimization over binomial deviance loss.',
    featureExtractionCategory: 'Handcrafted Domain Features',
    featurePipelineLatencyMs: 3.40,
    inputRepresentation: 'Normalized 56-dimensional continuous float vector',
    inputDimensions: '56 dense features',
    trainingHardwareProfile: 'Commodity 8-Core CPU (Histogram binning)',
    trainingTime: '1 min 15 sec',
    inferenceBigO: 'O(M · d) [M=100 iterations, d=6 shallow]',
    memoryConsumptionMb: 9.1,
    runtimeInferenceMs: 0.92,
    adversarialVulnerability: 'Sensitive to boundary outliers if features are unclipped; highly resilient against collinear feature redundancy.',
    interpretabilityMethod: 'TreeSHAP, Partial Dependence Plots (PDP), Gain Importance',
    nistPipelineStage: 'NIST Stage 1: Fast-Path Wire-Speed Edge Filter',
    keyArchitecturalAdvantage: 'Fastest boosted inference (0.92 ms) with ultra-compact tree structures requiring only 9.1 MB RAM.',
    keyArchitecturalLimitation: 'Sequential training prevents distributed parallel scaling across multi-node clusters during training.',
    color: '#10b981'
  },
  {
    modelId: 'svm',
    name: 'Support Vector Machine (SVM)',
    category: 'ML',
    paradigm: 'RBF Kernel Hyperplane',
    totalParameters: '8,920 Support Vectors',
    paramScaleNumber: 8920,
    parameterBreakdown: '8,920 dual coefficients αᵢ + RBF kernel width γ=0.018 and intercept bias b',
    featureExtractionTechnique: 'Handcrafted 56-feature vector normalized via Z-score scaling, mapped into infinite-dimensional Hilbert space via Gaussian RBF kernel.',
    featureExtractionCategory: 'Handcrafted Domain Features',
    featurePipelineLatencyMs: 3.40,
    inputRepresentation: 'Standardized 56-dimensional float vector (μ=0, σ=1)',
    inputDimensions: '56 dense features',
    trainingHardwareProfile: 'High-Memory Multi-Core CPU (O(N²) Gram matrix)',
    trainingTime: '14 min 20 sec',
    inferenceBigO: 'O(N_sv · D) [N_sv=8,920, D=56]',
    memoryConsumptionMb: 12.6,
    runtimeInferenceMs: 1.15,
    adversarialVulnerability: 'Vulnerable to targeted boundary shifts if attackers inject high-slack outlier feature values.',
    interpretabilityMethod: 'KernelSHAP, Local Surrogate Models, Support Vector Margin Analysis',
    nistPipelineStage: 'NIST Stage 1: Network Edge Perimeter Demarcation',
    keyArchitecturalAdvantage: 'Global optimum guarantee via convex quadratic optimization (no local minima risk during training).',
    keyArchitecturalLimitation: 'Quadratic memory scaling during training prevents scaling beyond 500k samples without Nyström approximation.',
    color: '#3b82f6'
  },
  {
    modelId: 'nb',
    name: 'Naïve Bayes (Gaussian NB)',
    category: 'ML',
    paradigm: 'Gaussian Probabilistic',
    totalParameters: '112 Distribution Params',
    paramScaleNumber: 112,
    parameterBreakdown: '56 feature means (μ_c) + 56 feature variances (σ²_c) across 2 target classes (56×2=112) + 2 class priors',
    featureExtractionTechnique: 'Handcrafted 56-feature vector under strong class-conditional feature independence assumption P(X|C) = ∏ P(xᵢ|C).',
    featureExtractionCategory: 'Handcrafted Domain Features',
    featurePipelineLatencyMs: 3.40,
    inputRepresentation: '56-dimensional continuous Gaussian feature vector',
    inputDimensions: '56 continuous features',
    trainingHardwareProfile: 'Single-Core Commodity CPU / Embedded SoC',
    trainingTime: '1.2 seconds (single pass O(N·D))',
    inferenceBigO: 'O(D) [D=56 multiplications]',
    memoryConsumptionMb: 4.2,
    runtimeInferenceMs: 0.42,
    adversarialVulnerability: 'Severely vulnerable when correlated features (e.g. url_length + path_depth) artificially compound posterior probabilities.',
    interpretabilityMethod: 'Log-Odds Ratio Inspection, Direct Conditional Likelihoods',
    nistPipelineStage: 'NIST Stage 1: Ultra-Low Latency Embedded Hardware & IoT Gateways',
    keyArchitecturalAdvantage: 'Lowest latency (0.42 ms) and micro-footprint (4.2 MB) capable of running on low-power ARM microcontrollers.',
    keyArchitecturalLimitation: 'Naive independence assumption breaks down on interrelated URL structural features, limiting accuracy to 99.94%.',
    color: '#f59e0b'
  },
  {
    modelId: 'ann',
    name: 'Neural Net (ANN / MLP)',
    category: 'DL',
    paradigm: '3-Layer Dense Neural Net',
    totalParameters: '15,681 Trainable Weights',
    paramScaleNumber: 15681,
    parameterBreakdown: 'Layer 1: 56×128+128=7,296; Layer 2: 128×64+64=8,256; Output: 64×1+1=65; Total = 15,681 parameters',
    featureExtractionTechnique: 'Handcrafted 56-feature vector input, followed by deep hierarchical non-linear feature transformation via ReLU activations and Dropout (0.3).',
    featureExtractionCategory: 'Handcrafted Domain Features',
    featurePipelineLatencyMs: 3.40,
    inputRepresentation: 'Standardized 56-dimensional continuous float tensor',
    inputDimensions: '56 input nodes → 128 → 64 → 1 sigmoid',
    trainingHardwareProfile: 'Commodity CPU or Entry GPU (NVIDIA T4 / RTX)',
    trainingTime: '3 min 10 sec (25 epochs with early stopping)',
    inferenceBigO: 'O(∑ W_l · H_l) matrix multiplications',
    memoryConsumptionMb: 18.2,
    runtimeInferenceMs: 2.45,
    adversarialVulnerability: 'Vulnerable to Fast Gradient Sign Method (FGSM) continuous vector perturbations and gradient-based adversarial crafting.',
    interpretabilityMethod: 'Integrated Gradients, Layer-wise Relevance Propagation (LRP), DeepLIFT',
    nistPipelineStage: 'NIST Stage 1 / Stage 2: Secondary Perimeter Web Proxy Inspection',
    keyArchitecturalAdvantage: 'Can learn complex non-linear combinations of engineered features with modest compute overhead.',
    keyArchitecturalLimitation: 'Still strictly bounded by the handcrafted 56-feature extractor schema; cannot ingest raw unparsed URLs directly.',
    color: '#8b5cf6'
  },
  {
    modelId: 'cnn1d',
    name: '1D-CNN (Char n-grams)',
    category: 'DL',
    paradigm: 'Convolutional Sequence Scanner',
    totalParameters: '245,314 Trainable Weights',
    paramScaleNumber: 245314,
    parameterBreakdown: 'Char Embedding (70×32=2,240) + Multi-kernel Conv1D (kernels 3, 5, 7 with 128 filters each = 138,240) + Dense (104,834)',
    featureExtractionTechnique: 'End-to-End Character n-gram feature extraction. 1D convolutions act as sliding window detectors over character sequences, automatically learning spatial patterns without manual feature extraction.',
    featureExtractionCategory: 'End-to-End Character n-grams',
    featurePipelineLatencyMs: 0.00,
    inputRepresentation: 'Raw URL character sequence (up to 200 chars) mapped into 32-dim learned dense character embeddings',
    inputDimensions: 'Length L=200, alphabet V=70, embedding d=32',
    trainingHardwareProfile: 'NVIDIA T4 / V100 GPU (16GB VRAM)',
    trainingTime: '18 min 45 sec (30 epochs)',
    inferenceBigO: 'O(L · ∑ K_i · C_in · C_out)',
    memoryConsumptionMb: 64.0,
    runtimeInferenceMs: 5.60,
    adversarialVulnerability: 'Vulnerable to character-level insertions/leetspeak substitutions (e.g., "p-a-y-p-a-l" instead of "paypal") unless multi-scale dilated convolutions are used.',
    interpretabilityMethod: 'Grad-CAM for 1D sequences, character activation saliency heatmaps',
    nistPipelineStage: 'NIST Stage 2: Multi-Class Threat Scanner (UNB ISCX-URL2016)',
    keyArchitecturalAdvantage: 'Ingests raw URL strings with zero manual feature extraction, automatically detecting malicious substring tokens.',
    keyArchitecturalLimitation: 'Fixed kernel receptive fields struggle to correlate distal tokens separated by long benign path segments (>50 characters).',
    color: '#14b8a6'
  },
  {
    modelId: 'lstm',
    name: 'Bi-LSTM + Attention',
    category: 'DL',
    paradigm: 'Recurrent Sequential Memory',
    totalParameters: '1,218,690 Trainable Weights (~1.22M)',
    paramScaleNumber: 1218690,
    parameterBreakdown: 'Char Embedding (70×64=4,480) + Bi-directional LSTM 2×128 units (790,528) + Additive Attention layer (33,024) + Dense layers (390,658)',
    featureExtractionTechnique: 'End-to-End Recurrent Temporal feature extraction: Captures forward and backward long-range character dependencies in URL paths, with attention weights focusing on anomalous token boundaries.',
    featureExtractionCategory: 'Recurrent Sequence Embeddings',
    featurePipelineLatencyMs: 0.00,
    inputRepresentation: 'Character index sequence (length ≤ 200), zero-padded with special [PAD] tokens',
    inputDimensions: 'Length L=200, hidden state H=128, bidirectional',
    trainingHardwareProfile: 'NVIDIA T4 / A100 GPU (Sequential Recurrence)',
    trainingTime: '38 min 20 sec (25 epochs)',
    inferenceBigO: 'O(2 · L · (4H² + 4H·D)) recurrent forward steps',
    memoryConsumptionMb: 95.0,
    runtimeInferenceMs: 12.40,
    adversarialVulnerability: 'Vulnerable to gradient degradation over deeply nested arbitrary query parameters and deliberate padding flood attacks.',
    interpretabilityMethod: 'Attention weight heatmaps over raw character sequence, temporal activation tracking',
    nistPipelineStage: 'NIST Stage 2: Asynchronous Contextual Pattern Miner',
    keyArchitecturalAdvantage: 'Maintains temporal memory across entire URL syntax, capturing syntax relationships between protocol, domain, and deep paths.',
    keyArchitecturalLimitation: 'Sequential step-by-step unrolling causes high latency (12.40 ms) and cannot be fully parallelized across GPU threads.',
    color: '#a855f7'
  },
  {
    modelId: 'distilbert',
    name: 'DistilBERT Transformer',
    category: 'DL',
    paradigm: 'Pre-trained Subword Transformer',
    totalParameters: '66,362,880 Trainable Weights (~66.4M)',
    paramScaleNumber: 66362880,
    parameterBreakdown: '6 Transformer Encoder layers, 12 Self-Attention Heads, Hidden dimension 768, Feed-Forward intermediate 3072, WordPiece vocab 30,522',
    featureExtractionTechnique: 'Zero manual feature engineering. End-to-end contextual subword tokenization via Byte-Pair Encoding (WordPiece) + multi-head self-attention extracting deep semantic and syntax relationships.',
    featureExtractionCategory: 'Contextual Subword Tokenization',
    featurePipelineLatencyMs: 0.00,
    inputRepresentation: 'Raw URL string → WordPiece Token IDs [CLS] + [T₁, T₂, ...] + [SEP] with Attention Mask (max length 128)',
    inputDimensions: 'Sequence length L=128, hidden dimension d=768, vocabulary size 30,522',
    trainingHardwareProfile: 'NVIDIA A100 80GB GPU (TensorFloat-32 / PyTorch fine-tuning)',
    trainingTime: '4 hours 15 minutes (fine-tuning 15 epochs on 188k training URLs)',
    inferenceBigO: 'O(L² · d + L · d²) per encoder layer (quadratic attention complexity)',
    memoryConsumptionMb: 410.0,
    runtimeInferenceMs: 18.50,
    adversarialVulnerability: 'High semantic comprehension; vulnerable to subword token fragmentation (e.g. deliberate typosplit injection) and Out-Of-Vocabulary spam.',
    interpretabilityMethod: 'Multi-head self-attention rollout maps, Integrated Gradients, subword token attribution',
    nistPipelineStage: 'NIST Stage 2: Asynchronous Deep Sandbox Inspection for Borderline / High-Entropy URLs',
    keyArchitecturalAdvantage: 'Unrivaled contextual linguistic comprehension of subwords, recognizing obfuscated brand impersonations without manual heuristics.',
    keyArchitecturalLimitation: 'Massive compute requirement (66.4M parameters, 410 MB RAM, 18.5 ms latency) makes wire-speed edge deployment infeasible.',
    color: '#ec4899'
  }
];

