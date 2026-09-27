export interface ModelMetrics {
  id: string;
  name: string;
  category: 'ML' | 'DL';
  paradigm: string;
  accuracy: number; // percentage, e.g. 99.99
  f1Score: number;
  precision: number;
  recall: number;
  rocAuc: number;
  latencyMs: number;
  throughputUrlsPerSec: number;
  ramUsageMb: number;
  fpr: number; // false positive rate percentage
  fnCount: number;
  fpCount: number;
  tpCount: number;
  tnCount: number;
  interpretability: 'High' | 'Moderate' | 'Low';
  deploymentSuitability: string;
  architectureDetails: string;
  color: string;
}

export interface ModelArchitectureSpec {
  modelId: string;
  name: string;
  category: 'ML' | 'DL';
  paradigm: string;
  totalParameters: string;
  paramScaleNumber: number; // for visual comparison bar
  parameterBreakdown: string;
  featureExtractionTechnique: string;
  featureExtractionCategory: 'Handcrafted Domain Features' | 'End-to-End Character n-grams' | 'Contextual Subword Tokenization' | 'Recurrent Sequence Embeddings';
  featurePipelineLatencyMs: number;
  inputRepresentation: string;
  inputDimensions: string;
  trainingHardwareProfile: string;
  trainingTime: string;
  inferenceBigO: string;
  memoryConsumptionMb: number;
  runtimeInferenceMs: number;
  adversarialVulnerability: string;
  interpretabilityMethod: string;
  nistPipelineStage: string;
  keyArchitecturalAdvantage: string;
  keyArchitecturalLimitation: string;
  color: string;
}

export interface EpochLossPoint {
  epoch: number;
  trainLoss: number;
  valLoss: number;
  trainAcc: number;
  valAcc: number;
}

export interface ModelTrainingHistory {
  modelId: string;
  modelName: string;
  lossFunction: string;
  totalEpochs: number;
  earlyStoppingEpoch?: number;
  history: EpochLossPoint[];
}

export interface RocCurvePoint {
  fpr: number;
  tpr: number;
  threshold: number;
}

export interface FeatureDefinition {
  id: string;
  name: string;
  category: 'Lexical' | 'Structural' | 'Domain & SSL' | 'Statistical';
  description: string;
  sampleVariable: string;
  importanceWeight: number; // 0 - 100 relative importance from RF/SHAP
  detectionRule: string;
}

export interface ExtractedFeatures {
  url: string;
  // Lexical
  urlLength: number;
  domainLength: number;
  numDots: number;
  numHyphens: number;
  numUnderscores: number;
  numSlash: number;
  numPercent: number;
  hasHttps: boolean;
  suspiciousKeywordsCount: number;
  detectedKeywords: string[];
  longestWordLength: number;
  
  // Structural
  numSubdomains: number;
  hasIpAddress: boolean;
  hasAtSymbol: boolean;
  hasDoubleSlashRedirect: boolean;
  hasPortInUrl: boolean;
  pathDepth: number;
  numParameters: number;
  isShortened: boolean;
  
  // Domain & SSL
  tld: string;
  tldRiskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  domainAgeEstimateDays: number;
  sslTrustScore: number; // 0 - 100
  isHomographSuspicious: boolean;
  punycodeDomain: string;
  
  // Statistical
  shannonEntropy: number;
  digitRatio: number;
  vowelRatio: number;
  consonantRatio: number;
  specialCharRatio: number;
  
  // 56-feature vector representation (normalized float array preview)
  vector56Preview: number[];
}

export interface ShapContribution {
  featureName: string;
  category: string;
  value: string | number;
  impactScore: number; // positive = pushes toward phishing, negative = pushes toward safe
  description: string;
}

export interface ModelPrediction {
  modelId: string;
  modelName: string;
  category: 'ML' | 'DL';
  phishingProbability: number; // 0 to 1
  isPhishing: boolean;
  confidence: number;
  inferenceTimeMs: number;
  ramUsageMb: number;
  decisionRule: string;
  shapContributions?: ShapContribution[];
}

export interface LiteratureEntry {
  id: string;
  citation: string;
  studyYear: number;
  datasetName: string;
  datasetSize: string;
  reportedModels: string;
  rfAccuracy: string;
  keyFindings: string;
  identifiedGaps: string;
}

export interface EvasionTactic {
  id: string;
  name: string;
  exampleUrl: string;
  attackMechanism: string;
  rfResult: string;
  distilBertResult: string;
  mitigationRule: string;
}

export interface StreamPacket {
  id: string;
  timestamp: string;
  url: string;
  isSimulatedMalicious: boolean;
  tactic?: string;
  gbdtConfidence: number;
  gbdtLatencyMs: number;
  stage1Verdict: 'APPROVED_SAFE' | 'BLOCKED_PHISH' | 'ESCALATED_DEEP_INSPECTION';
  stage2Required: boolean;
  distilBertConfidence?: number;
  distilBertLatencyMs?: number;
  finalVerdict: 'SAFE' | 'BLOCKED';
  totalLatencyMs: number;
}
