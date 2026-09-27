import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  DISSERTATION_META,
  MODEL_BENCHMARKS,
  HISTORICAL_DATASET_EVOLUTION,
  LITERATURE_SYNTHESIS
} from '../data/dissertationData';

export interface PdfReportOptions {
  includeAbstract?: boolean;
  includeBenchmarkTable?: boolean;
  includeHistoricalEvolution?: boolean;
  includeTaxonomySummary?: boolean;
  includeLiteratureMatrix?: boolean;
  includeArchitectureAnalysis?: boolean;
  includeSignatureBlock?: boolean;
  customNotes?: string;
}

export function generateAcademicPdfReport(options: PdfReportOptions = {}): jsPDF {
  const {
    includeAbstract = true,
    includeBenchmarkTable = true,
    includeHistoricalEvolution = true,
    includeTaxonomySummary = true,
    includeLiteratureMatrix = true,
    includeArchitectureAnalysis = true,
    includeSignatureBlock = true,
    customNotes = ''
  } = options;

  // Initialize jsPDF in portrait A4 format (210mm x 297mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Helper colors (academic navy, cyan accent, slate)
  const primaryColor: [number, number, number] = [15, 23, 42]; // Slate 900
  const secondaryColor: [number, number, number] = [8, 145, 178]; // Cyan 600
  const mutedColor: [number, number, number] = [100, 116, 139]; // Slate 500

  let currentY = margin;

  const checkPageOverflow = (requiredHeight: number) => {
    if (currentY + requiredHeight > pageHeight - margin - 12) {
      doc.addPage();
      currentY = margin;
      drawHeaderFooter();
    }
  };

  const drawHeaderFooter = () => {
    const pageCount = (doc.internal as unknown as { pages: unknown[] }).pages.length - 1;
    // Running header (on pages > 1)
    if (pageCount > 1) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
      doc.text(
        'PhishGuard Benchmark · ML vs. DL Phishing URL Detection · Academic Submission Report',
        margin,
        9
      );
      doc.text(`Author: ${DISSERTATION_META.author} (${DISSERTATION_META.rollNo})`, pageWidth - margin, 9, {
        align: 'right'
      });
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, 10.5, pageWidth - margin, 10.5);
    }

    // Running footer on all pages
    const totalPagesExp = '{total_pages_count_string}';
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);

    doc.text(
      `The NorthCap University · ${DISSERTATION_META.degree} · ${DISSERTATION_META.standardCompliance}`,
      margin,
      pageHeight - 6.5
    );
    doc.text(`Page ${pageCount}`, pageWidth - margin, pageHeight - 6.5, { align: 'right' });
  };

  // =========================================================================
  // COVER / ACADEMIC HEADER BLOCK (Page 1)
  // =========================================================================
  
  // Decorative top banner bar
  doc.setFillColor(15, 23, 42); // slate 900
  doc.rect(0, 0, pageWidth, 5, 'F');
  doc.setFillColor(8, 145, 178); // cyan 600
  doc.rect(0, 5, pageWidth, 1.5, 'F');

  currentY = 16;

  // University & Institutional Super-title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('THE NORTHCAP UNIVERSITY, GURUGRAM', margin, currentY);
  currentY += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
  doc.text('Department of Multidisciplinary Engineering · Master of Computer Applications (MCA)', margin, currentY);
  currentY += 6;

  // Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  const splitTitle = doc.splitTextToSize(
    'A Comparative Analysis of Phishing URL Detection: Traditional Machine Learning Versus Deep Learning Models for Real-Time Web Security',
    contentWidth
  );
  doc.text(splitTitle, margin, currentY);
  currentY += splitTitle.length * 5.5 + 2;

  // Metadata Card / Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, currentY, contentWidth, 23, 2, 2, 'FD');

  doc.setFontSize(7.8);
  const col1X = margin + 4;
  const col2X = margin + 68;
  const col3X = margin + 128;
  let metaY = currentY + 5;

  // Col 1: Author & Roll
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Author / Candidate:', col1X, metaY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${DISSERTATION_META.author} (${DISSERTATION_META.rollNo})`, col1X + 27, metaY);

  metaY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.text('Supervisor:', col1X, metaY);
  doc.setFont('helvetica', 'normal');
  doc.text(DISSERTATION_META.supervisor, col1X + 27, metaY);

  metaY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.text('Submission Period:', col1X, metaY);
  doc.setFont('helvetica', 'normal');
  doc.text(DISSERTATION_META.date, col1X + 27, metaY);

  // Col 2: Dataset & Sample Split
  metaY = currentY + 5;
  doc.setFont('helvetica', 'bold');
  doc.text('Benchmark Dataset:', col2X, metaY);
  doc.setFont('helvetica', 'normal');
  doc.text('UCI PhiUSIIL (235,795 URLs)', col2X + 28, metaY);

  metaY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.text('Test Split Size:', col2X, metaY);
  doc.setFont('helvetica', 'normal');
  doc.text('47,159 URLs (80/20 Stratified)', col2X + 28, metaY);

  metaY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.text('Features Evaluated:', col2X, metaY);
  doc.setFont('helvetica', 'normal');
  doc.text('56-Feature Comprehensive Taxonomy', col2X + 28, metaY);

  // Col 3: Standard & Hash
  metaY = currentY + 5;
  doc.setFont('helvetica', 'bold');
  doc.text('Security Standard:', col3X, metaY);
  doc.setFont('helvetica', 'normal');
  doc.text('NIST SP 800-61 Rev. 2', col3X + 26, metaY);

  metaY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.text('Evaluation Mode:', col3X, metaY);
  doc.setFont('helvetica', 'normal');
  doc.text('Offline & Real-Time Edge Stream', col3X + 26, metaY);

  metaY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.text('Report ID:', col3X, metaY);
  doc.setFont('helvetica', 'normal');
  doc.text('NCU-MCA-2026-DIS-019', col3X + 26, metaY);

  currentY += 27;

  // =========================================================================
  // SECTION 1: EXECUTIVE ABSTRACT
  // =========================================================================
  if (includeAbstract) {
    checkPageOverflow(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('1. Executive Abstract', margin, currentY);
    currentY += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    doc.setTextColor(51, 65, 85);

    const abstractText =
      'Phishing attacks continue to represent one of the primary threat vectors targeting enterprise networks and consumer digital identities. This research conducts an empirical comparative benchmark evaluating Traditional Machine Learning (Random Forest, Gradient Boosted Decision Trees, Support Vector Machines, and Naïve Bayes) versus Deep Learning architectures (Deep Artificial Neural Networks, 1D-CNN, Bidirectional LSTM with Attention, and fine-tuned DistilBERT Transformers). Evaluated across 235,795 URLs using a 56-feature multidimensional vector and raw token sequence analysis under NIST SP 800-61 Rev. 2 guidelines, empirical results demonstrate that Tree-Ensemble algorithms achieve optimal wire-speed classification (Random Forest: 99.99% accuracy, 0.85 ms latency, 8.4 MB RAM footprint), substantially outperforming deep sequence models in operational throughput and hardware efficiency. To reconcile deep contextual attention with wire-speed throughput, a Two-Stage Hybrid Cascade Architecture is validated, executing sub-millisecond edge pre-filtering with asynchronous transformer inspection for borderline cases.';

    const splitAbstract = doc.splitTextToSize(abstractText, contentWidth);
    doc.text(splitAbstract, margin, currentY);
    currentY += splitAbstract.length * 3.8 + 5;
  }

  // =========================================================================
  // SECTION 2: PRIMARY MODEL BENCHMARK TABLE
  // =========================================================================
  if (includeBenchmarkTable) {
    checkPageOverflow(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('2. Primary Model Performance Benchmark (UCI PhiUSIIL 47,159 Test Split)', margin, currentY);
    currentY += 3;

    const benchmarkRows = MODEL_BENCHMARKS.map((m) => [
      m.name,
      m.category,
      `${m.accuracy.toFixed(2)}%`,
      `${m.f1Score.toFixed(2)}%`,
      `${m.precision.toFixed(2)}%`,
      `${m.recall.toFixed(2)}%`,
      m.rocAuc.toFixed(4),
      `${m.latencyMs.toFixed(2)} ms`,
      `${m.throughputUrlsPerSec} u/s`,
      `${m.ramUsageMb.toFixed(1)} MB`,
      `${m.fpr.toFixed(3)}%`
    ]);

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [
        [
          'Model Architecture',
          'Cat',
          'Acc (%)',
          'F1 (%)',
          'Prec (%)',
          'Recall',
          'ROC-AUC',
          'Latency',
          'Throughput',
          'RAM',
          'FPR (%)'
        ]
      ],
      body: benchmarkRows,
      theme: 'grid',
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontSize: 7.2,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 6.8,
        textColor: [30, 41, 59],
        halign: 'center'
      },
      columnStyles: {
        0: { halign: 'left', fontStyle: 'bold', cellWidth: 38 },
        1: { cellWidth: 10 },
        2: { fontStyle: 'bold', textColor: [8, 145, 178] },
        7: { fontStyle: 'bold' }
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      }
    });

    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
    currentY = finalY + 6;
  }

  // =========================================================================
  // SECTION 3: ARCHITECTURAL EFFICIENCY & TRADE-OFF ANALYSIS
  // =========================================================================
  if (includeArchitectureAnalysis) {
    checkPageOverflow(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('3. Comparative Computational Efficiency & Trade-Off Analysis', margin, currentY);
    currentY += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    doc.setTextColor(51, 65, 85);

    const findingsParagraphs = [
      '• Latency & Hardware Disparity: Random Forest and GBDT achieve an inference latency of 0.85 ms and 0.92 ms respectively, operating at wire-speed on commodity CPU hardware with minimal memory footprints (<10 MB RAM). In contrast, DistilBERT requires 18.5 ms per URL and 410 MB of memory—a 21.7x latency penalty and a 48.8x memory inflation that restricts inline firewall deployment.',
      '• False Positive Impact on SOC Overhead: In enterprise security operations, false alarms induce severe alert fatigue. Tree ensembles achieved near-zero false positive rates (RF: 0.005% FPR, 1 false alarm per 20,000 URLs), whereas raw sequence transformers without structural feature guards exhibited higher false alarm counts on complex benign URLs.',
      '• NIST Two-Stage Hybrid Cascade: To resolve this architectural trade-off, this research validates a two-stage cascade architecture: Stage 1 executes sub-millisecond edge filtering via Random Forest/GBDT, immediately approving high-confidence benign URLs and blocking explicit malicious URLs. Only borderline candidates (confidence score between 0.35 and 0.70) are escalated to Stage 2 DistilBERT deep inspection.'
    ];

    findingsParagraphs.forEach((p) => {
      checkPageOverflow(15);
      const splitP = doc.splitTextToSize(p, contentWidth);
      doc.text(splitP, margin, currentY);
      currentY += splitP.length * 3.8 + 2.5;
    });

    currentY += 2;
  }

  // =========================================================================
  // SECTION 4: HISTORICAL DATASET REVISION TRAJECTORY (2026)
  // =========================================================================
  if (includeHistoricalEvolution) {
    checkPageOverflow(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('4. Historical Dataset Benchmark Evolution (2026 Releases)', margin, currentY);
    currentY += 3;

    const histRows = HISTORICAL_DATASET_EVOLUTION.map((h) => [
      h.datasetVersion,
      h.releaseDate,
      h.urlCount.toLocaleString(),
      `${h.featuresUsed} features`,
      `${h.rfAccuracy.toFixed(2)}%`,
      `${h.gbdtAccuracy.toFixed(2)}%`,
      `${h.annAccuracy.toFixed(2)}%`,
      `${h.transformerAccuracy.toFixed(2)}%`,
      h.description
    ]);

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [
        [
          'Dataset Release',
          'Date',
          'URL Volume',
          'Taxonomy',
          'RF Acc',
          'GBDT',
          'ANN',
          'Transf.',
          'Milestone Focus'
        ]
      ],
      body: histRows,
      theme: 'grid',
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontSize: 6.8,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 6.4,
        textColor: [30, 41, 59],
        halign: 'center'
      },
      columnStyles: {
        0: { halign: 'left', fontStyle: 'bold', cellWidth: 28 },
        8: { halign: 'left', cellWidth: 55 }
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      }
    });

    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
    currentY = finalY + 6;
  }

  // =========================================================================
  // SECTION 5: 56-FEATURE TAXONOMY CLASSIFICATION
  // =========================================================================
  if (includeTaxonomySummary) {
    checkPageOverflow(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('5. 56-Feature Extraction Pipeline & Taxonomy Overview', margin, currentY);
    currentY += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.0);
    doc.setTextColor(51, 65, 85);

    const taxonomyClasses = [
      {
        name: 'Lexical & Character Features (22 Attributes, Weight: 35%)',
        desc: 'URL total length, character count, dot count, hyphen count, Shannon character entropy, vowel-to-consonant ratios, Cyrillic/Greek homoglyph unicode detection, brand token presence.'
      },
      {
        name: 'Structural & Syntactic Architecture (14 Attributes, Weight: 25%)',
        desc: 'Subdomain depth nesting (>3 levels), direct IPv4/IPv6 address in authority, @ symbol browser truncation, non-standard TCP ports (:8080, :444), deep directory path depth.'
      },
      {
        name: 'Domain, DNS & WHOIS Reputation (12 Attributes, Weight: 25%)',
        desc: 'Domain lifespan (<30 days registration), high-abuse TLDs (.xyz, .top, .icu, .buzz, .tk), DNS TTL duration, Tranco/Alexa global rank, nameserver reputation.'
      },
      {
        name: 'Cryptographic & Protocol Integrity (8 Attributes, Weight: 15%)',
        desc: 'HTTPS protocol enforcement, SSL certificate lifespan, issuer trust authority validation, self-signed certificate detection, mixed content indicators.'
      }
    ];

    taxonomyClasses.forEach((tc) => {
      checkPageOverflow(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(`• ${tc.name}`, margin + 2, currentY);
      currentY += 3.5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      const splitD = doc.splitTextToSize(tc.desc, contentWidth - 4);
      doc.text(splitD, margin + 4, currentY);
      currentY += splitD.length * 3.5 + 2;
    });

    currentY += 2;
  }

  // =========================================================================
  // SECTION 6: LITERATURE COMPARISON MATRIX (TABLE 2.1)
  // =========================================================================
  if (includeLiteratureMatrix) {
    checkPageOverflow(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('6. State-of-the-Art Literature Comparison (Dissertation Table 2.1 Synthesis)', margin, currentY);
    currentY += 3;

    const litRows = [
      ...LITERATURE_SYNTHESIS.map((lit) => [
        lit.citation,
        lit.studyYear.toString(),
        lit.datasetName,
        lit.reportedModels,
        lit.rfAccuracy,
        lit.keyFindings
      ]),
      [
        `Present Study (Mittal & Shilpa, 2026)`,
        '2026',
        'UCI PhiUSIIL (235,795 URLs)',
        'RF, GBDT, ANN, SVM, DistilBERT, LSTM',
        '99.99% (RF) / 99.82% (DistilBERT)',
        'Tree models lead wire-speed latency (<1ms); 2-stage cascade provides optimal enterprise defense.'
      ]
    ];

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['Author / Citation', 'Year', 'Evaluated Dataset', 'Model Scope', 'Leading Accuracy', 'Key Findings']],
      body: litRows,
      theme: 'grid',
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontSize: 6.8,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 6.2,
        textColor: [30, 41, 59]
      },
      columnStyles: {
        0: { halign: 'left', fontStyle: 'bold', cellWidth: 32 },
        1: { halign: 'center', cellWidth: 10 },
        4: { fontStyle: 'bold', textColor: [8, 145, 178], cellWidth: 26 },
        5: { cellWidth: 55 }
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      }
    });

    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
    currentY = finalY + 6;
  }

  // =========================================================================
  // CUSTOM NOTES (IF SPECIFIED)
  // =========================================================================
  if (customNotes.trim().length > 0) {
    checkPageOverflow(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('7. Submission Addenda & Examiner Notes', margin, currentY);
    currentY += 4;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    const splitNotes = doc.splitTextToSize(customNotes, contentWidth);
    doc.text(splitNotes, margin, currentY);
    currentY += splitNotes.length * 3.8 + 4;
  }

  // =========================================================================
  // SIGNATURE & ACADEMIC ENDORSEMENT BLOCK
  // =========================================================================
  if (includeSignatureBlock) {
    checkPageOverflow(38);
    currentY += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Academic Certification & Endorsement Sign-Off', margin, currentY);
    currentY += 5;

    const boxWidth = (contentWidth - 8) / 2;
    const boxHeight = 26;

    // Box 1: Candidate Sign-off
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, currentY, boxWidth, boxHeight, 1.5, 1.5, 'D');

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('CANDIDATE DECLARATION:', margin + 3, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('I hereby certify the benchmark metrics submitted represent authentic empirical runs.', margin + 3, currentY + 9, {
      maxWidth: boxWidth - 6
    });

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`${DISSERTATION_META.author} · Roll No: ${DISSERTATION_META.rollNo}`, margin + 3, currentY + 22);

    // Box 2: Supervisor Endorsement
    const box2X = margin + boxWidth + 8;
    doc.roundedRect(box2X, currentY, boxWidth, boxHeight, 1.5, 1.5, 'D');

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text('SUPERVISOR APPROVAL:', box2X + 3, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('Approved for MCA Dissertation examination and repository archiving.', box2X + 3, currentY + 9, {
      maxWidth: boxWidth - 6
    });

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`${DISSERTATION_META.supervisor} · Department of Multidisciplinary Eng.`, box2X + 3, currentY + 22);
  }

  // Draw headers and footers across all generated pages
  const totalPages = (doc.internal as unknown as { pages: unknown[] }).pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    // Running header (on pages > 1)
    if (i > 1) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
      doc.text(
        'PhishGuard Benchmark · ML vs. DL Phishing URL Detection · Academic Submission Report',
        margin,
        9
      );
      doc.text(`Author: ${DISSERTATION_META.author} (${DISSERTATION_META.rollNo})`, pageWidth - margin, 9, {
        align: 'right'
      });
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, 10.5, pageWidth - margin, 10.5);
    }

    // Running footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);

    doc.text(
      `The NorthCap University · ${DISSERTATION_META.degree} · ${DISSERTATION_META.standardCompliance}`,
      margin,
      pageHeight - 6.5
    );
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 6.5, { align: 'right' });
  }

  return doc;
}
