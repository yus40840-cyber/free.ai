import { AcademicDocument, UserState, WritingProfile } from '../types';

export const defaultWritingProfile: WritingProfile = {
  tone: 'Analytical, reflective, and professional',
  formality: 'Medium-High',
  vocabulary: 'Sophisticated',
  sentenceLength: 'Medium',
  personalVoice: 'Strong',
  complexity: "Master's",
  firstPerson: 'Balanced first-person for intent, passive for empirical methodology',
  keyPhrases: [
    'Critical synthesis of empirical findings',
    'Bridge theoretical abstraction with applied implementation',
    'Systematic evaluation across parameters'
  ],
  summary: 'Your writing exhibits a measured analytical cadence with authentic personal conviction. Arguments are supported through structured topic sentences followed by concrete experiential evidence.',
  rawSamples: `During my undergraduate research in distributed computing, I was intrigued by the latency trade-offs inherent in consensus protocols. Rather than accepting classical assumptions at face value, my honors project scrutinized how edge network volatility disrupts peer discovery. Through systematic benchmarking across thirty simulated micro-nodes, I demonstrated a 24% reduction in packet retransmissions. This experience solidified my ambition to pursue graduate research where theoretical rigor directly informs resilient infrastructure design.`
};

export const defaultUser: UserState = {
  id: 'usr-1',
  name: 'Raheel Khan',
  email: 'raheel.k@alumni.edu',
  institution: 'Department of Computer Science & Engineering',
  fieldOfStudy: 'Artificial Intelligence & Systems',
  academicLevel: "Master's",
  role: 'STUDENT',
  aiUnits: 2000,
  plan: 'Student',
  planBillingCycle: 'monthly',
  nextBillingDate: '12 Nov 2026',
  writingProfile: defaultWritingProfile
};

export const initialDocuments: AcademicDocument[] = [
  {
    id: 'doc-1',
    title: 'Motivation Letter: MSc Computer Science (ETH Zurich)',
    type: 'motivation-letter',
    targetWordLimit: 850,
    citationStyle: 'APA 7',
    createdAt: '2026-09-28T14:32:00.000Z',
    updatedAt: '2026-10-04T08:15:00.000Z',
    sources: [
      {
        id: 's-1',
        title: 'Distributed Machine Learning Systems: A Survey of Architectures and Optimizations',
        author: 'Verma, S. & Chen, L.',
        year: 2024,
        publication: 'ACM Computing Surveys',
        doi: '10.1145/3618293',
        excerpt: 'Edge-coordinated decentralized training reduces backbone network saturation by up to 38% under high topology churn.',
        isCited: true
      },
      {
        id: 's-2',
        title: 'ETH Zurich Systems Group Annual Research Overview',
        author: 'Alonso, G. & Roscoe, T.',
        year: 2025,
        publication: 'ETH Zurich Technical Reports',
        excerpt: 'Our focus investigates hardware-software co-design for data-intensive processing and energy-efficient disaggregated memory architectures.',
        isCited: true
      }
    ],
    sections: [
      { id: 'sec-1', title: '1. Academic Intent & Program Alignment', targetWords: 150, currentWords: 142, completed: true },
      { id: 'sec-2', title: '2. Educational Foundation & Technical Milestones', targetWords: 250, currentWords: 260, completed: true },
      { id: 'sec-3', title: '3. Institutional Synergies at ETH Zurich', targetWords: 250, currentWords: 238, completed: true },
      { id: 'sec-4', title: '4. Post-Graduate Vision & Long-term Impact', targetWords: 150, currentWords: 135, completed: true }
    ],
    content: `# Motivation Letter

**To:** Admissions Committee, Master of Science in Computer Science  
**Institution:** ETH Zürich, Switzerland  
**Applicant:** Raheel Khan  

Dear Members of the Admissions Committee,

I am writing to express my focused motivation for the Master of Science in Computer Science at ETH Zurich, specializing in Distributed Systems and Machine Learning. Having cultivated a rigorous foundation in algorithms and systems engineering during my undergraduate tenure, I have come to recognize that the paramount bottleneck facing next-generation autonomous computing is not merely raw model capacity, but the architectural resilience and throughput of distributed systems. ETH Zurich's pioneering contributions to disaggregated operating systems and large-scale data systems make it the preeminent environment for me to advance my scholarly inquiries.

Throughout my undergraduate studies, I maintained a strict commitment to bridging theoretical principles with empirical implementation. In my senior capstone project, I led an investigation into latency variance in decentralized consensus mechanisms across volatile edge topologies. Working under faculty supervision, I implemented a prototype peer discovery algorithm that reduced unnecessary packet retransmissions by 24% under high network churn. This hands-on inquiry reinforced the insights articulated by Verma and Chen (2024), underscoring that topological optimization must be integrated directly into runtime scheduling rather than relegated to an afterthought.

What distinguishes the MSc Computer Science curriculum at ETH Zurich is its uncompromising emphasis on fundamental systems architecture. Specifically, I am eager to contribute to the ongoing investigations led by the Systems Group, whose work on Enzian and hardware-software co-design (Alonso & Roscoe, 2025) directly addresses the memory wall constraints I encountered during my research. The opportunity to study under Professor Gustavo Alonso in modules such as *Advanced Distributed Systems* and *Data Processing on Modern Hardware* will furnish the technical depth needed to engineer energy-efficient distributed processing pipelines.

Upon concluding my studies at ETH Zurich, I intend to transition into industrial research laboratories focused on decentralized data infrastructure, with the long-term goal of directing engineering initiatives that democratize large-scale compute for scientific discovery. The rigorous atmosphere and collaborative excellence of ETH Zurich will provide the catalyst for this trajectory.

Thank you for your time and thoughtful consideration of my application.

Sincerely,  
Raheel Khan`,
    auditReport: {
      scores: {
        grammar: 98,
        structure: 96,
        citations: 94,
        voiceAuthenticity: 97,
        academicRigor: 93
      },
      overallReadiness: 'Ready for submission',
      warnings: [],
      recommendations: [
        'Document exhibits strong authorial clarity and direct alignment with ETH faculty research.',
        'Word count is within the optimal 750-900 target band.'
      ],
      lastChecked: '2026-10-04T08:15:00.000Z'
    }
  },
  {
    id: 'doc-2',
    title: 'Evaluating Bias Propagation in Multimodal Embeddings for Clinical Triage',
    type: 'research-paper',
    targetWordLimit: 3200,
    citationStyle: 'APA 7',
    createdAt: '2026-09-15T10:00:00.000Z',
    updatedAt: '2026-10-03T16:45:00.000Z',
    sources: [
      {
        id: 's-3',
        title: 'Multimodal Representations in Clinical Decision Support: Opportunities and Hidden Disparities',
        author: 'Rajpurkar, P., Chen, E., & Banerjee, O.',
        year: 2023,
        publication: 'Nature Digital Medicine',
        doi: '10.1038/s41746-023-00812-z',
        excerpt: 'Cross-attention layers between clinical text and imaging notes can amplify demographic underrepresentation by up to 18% in emergency triage risk scores.',
        isCited: true
      },
      {
        id: 's-4',
        title: 'Algorithmic Fairness in Healthcare: A Comprehensive Survey',
        author: 'Obermeyer, Z., Powers, B., & Mullainathan, S.',
        year: 2022,
        publication: 'Science & Health Analytics',
        doi: '10.1126/science.aax2342',
        excerpt: 'Using healthcare expenditure as a proxy for illness severity produces systemic bias against vulnerable socioeconomic cohorts.',
        isCited: true
      },
      {
        id: 's-5',
        title: 'Counterfactual Data Augmentation for Robust Medical Diagnostics',
        author: 'Kaushik, D. & Lipton, Z. C.',
        year: 2024,
        publication: 'Journal of Biomedical Informatics',
        excerpt: 'Controlled counterfactual perturbation isolates demographic confounding without degrading overall diagnostic area under the ROC curve.',
        isCited: false
      }
    ],
    sections: [
      { id: 'sec-201', title: 'Abstract & Introduction', targetWords: 600, currentWords: 580, completed: true },
      { id: 'sec-202', title: 'Literature Review & Theoretical Framing', targetWords: 800, currentWords: 740, completed: true },
      { id: 'sec-203', title: 'Empirical Methodology & Dataset Stratification', targetWords: 900, currentWords: 650, completed: false },
      { id: 'sec-204', title: 'Findings, Counterfactual Analysis, & Discussion', targetWords: 900, currentWords: 320, completed: false }
    ],
    content: `# Evaluating Bias Propagation in Multimodal Embeddings for Clinical Triage

**Abstract**  
Multimodal machine learning architectures increasingly underpin high-acuity clinical decision support. However, joint embedding spaces frequently entangle latent patient demographics with physiological biomarkers. This study investigates the propagation of demographic bias in emergency department triage representations. Using stratified clinical datasets, we evaluate cross-attention disparities across socioeconomic cohorts. Our preliminary findings demonstrate that unconstrained multimodal fusion introduces systematic error differentials of up to 18%, highlighting the urgent need for counterfactual auditing in clinical pipelines.

---

### 1. Introduction

The integration of artificial intelligence into emergency medicine has progressed from univariate diagnostic classifiers to unified multimodal decision frameworks. By integrating unstructured physician notes, vital signs, and radiographic findings, modern clinical models promise unprecedented diagnostic precision. 

Nevertheless, deploying high-dimensional representation models in safety-critical triage introduces profound ethical dilemmas. As demonstrated in foundational work by Obermeyer et al. (2022), surrogate target formulations—such as historical hospital resource allocation—can inadvertently encode entrenched socioeconomic inequities into algorithmic predictions. When representations fuse unstructured physician commentary with numerical telemetry, linguistic heuristics frequently act as confounding proxies for socioeconomic status.

In this paper, we examine how cross-attention mechanisms between clinical notes and structured imaging tokens exacerbate representational divergence. Building on empirical baselines established by Rajpurkar et al. (2023), our investigation isolates the specific layers where demographic bias compounds before diagnostic prediction heads are invoked.

---

### 2. Literature Review & Conceptual Grounding

Algorithmic fairness literature has historically partitioned into demographic parity, equalized odds, and counterfactual fairness. In healthcare settings, statistical parity alone is often clinically counterproductive, as disease prevalence naturally exhibits epidemiologic heterogeneity across age and biological demographics. 

Recent research demonstrates that cross-modal attention mechanisms can inadvertently construct multimodal shortcuts (Rajpurkar et al., 2023). When linguistic patterns in unstructured nursing records correlate with racial or geographical descriptors, the transformer self-attention heads disproportionately attend to lexical tokens rather than physiological telemetry. 

To overcome this dilemma, researchers have proposed counterfactual perturbation protocols. While prior techniques demonstrated efficacy in isolated natural language tasks, their transferability to joint multimodal medical tensors remains underexplored.

---

### 3. Methodology & Stratification Protocol

To empirically evaluate representation drift, we deployed a retrospective cohort design utilizing anonymized emergency triage records. Records were partitioned into four demographic cohorts based on insurance status, primary spoken language, and zip-code median household income.

Embeddings were extracted from the penultimate transformer layer across three model architectures: (a) late-fusion linear projection, (b) cross-attention multimodal fusion, and (c) gated recurrent multimodal units. For each representation, we computed demographic subspace alignment scores to quantify latent cluster separation.

*[Drafting in progress: Section 3 continuation and experimental results]*`,
    auditReport: {
      scores: {
        grammar: 96,
        structure: 92,
        citations: 90,
        voiceAuthenticity: 95,
        academicRigor: 94
      },
      overallReadiness: 'Needs additional citations',
      warnings: [
        {
          severity: 'medium',
          category: 'Citations',
          message: 'Source "Kaushik & Lipton (2024)" is in your project library but has not yet been cited in the methodology section.',
          snippet: 'Section 3: Methodology'
        },
        {
          severity: 'low',
          category: 'Word Count',
          message: 'Methodology and Findings sections are currently in progress (~2,290 words remaining to reach 3,200 target).',
          snippet: 'Sections 3 & 4'
        }
      ],
      recommendations: [
        'Complete the quantitative results subsection with specific AUROC and false positive rate comparison tables.',
        'Incorporate the counterfactual data augmentation source (Kaushik & Lipton) into Section 3.'
      ],
      lastChecked: '2026-10-03T16:45:00.000Z'
    }
  }
];
