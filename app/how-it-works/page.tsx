import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works | Legal Thread",
  description:
    "Explore a four-step architecture for AI-assisted legal and patent research, analysis and review.",
};

const stages = [
  {
    number: "01",
    title: "Omnichannel ingestion & controlled access",
    intro:
      "A matter begins with its source material. Depending on supported formats and deployment configuration, intake may include lengthy patent PDFs, hand-drawn designs, trademark logos, scanned exhibits or case files.",
    capabilities: [
      {
        title: "Multi-format intake",
        description:
          "Workflows can be designed around text, scanned documents, design images, CAD drawings, audio transcripts and multi-jurisdictional filings where those inputs are supported.",
      },
      {
        title: "Security boundaries",
        description:
          "Access controls, encryption and matter separation should be configured and verified against the organization’s security requirements before sensitive data is processed.",
      },
    ],
  },
  {
    number: "02",
    title: "Neural decomposition & visual analysis",
    intro:
      "Language and vision methods can help organize a matter’s text and images, bringing relevant structures and relationships into focus for review.",
    capabilities: [
      {
        title: "Semantic & contextual mapping",
        description:
          "Language models can help map concepts and relationships in patent claims, statutes and case precedents beyond simple keyword matching.",
      },
      {
        title: "Computer vision for intellectual property",
        description:
          "Convolutional neural networks, object detection and segmentation can help isolate shapes, design contours and brand marks for visual comparison.",
      },
    ],
  },
  {
    number: "03",
    title: "Cross-source research & verification",
    intro:
      "Configured data sources can be searched and compared to help teams find relevant material. Coverage depends on the sources connected to the workflow.",
    capabilities: [],
  },
  {
    number: "04",
    title: "Human review & next steps",
    intro:
      "AI-assisted findings are there to support professional judgment—not replace it. Reviewers assess the source material, validate results and decide what to do next.",
    capabilities: [
      {
        title: "Traceable findings",
        description:
          "Where source references are available, link results back to the underlying document, passage or image so reviewers can check the context.",
      },
      {
        title: "Review and handoff",
        description:
          "Prepare material for review and export. Filing and document-management handoffs depend on the integrations configured for the organization.",
      },
    ],
  },
];

const researchAreas = [
  {
    title: "Patent research",
    description:
      "Compare claims with connected patent references and, where available, product information to support prior-art research and flag questions for infringement review.",
  },
  {
    title: "Design & brand review",
    description:
      "Search connected design, trademark or copyright collections for potentially similar material. Coverage depends on available sources; matches require professional assessment.",
  },
  {
    title: "Case and matter analysis",
    description:
      "Organize supplied civil or criminal case materials and surface precedents, statutory timelines or potential inconsistencies in witness statements for a legal professional to assess.",
  },
  {
    title: "Drafting support",
    description:
      "Where enabled, prepare first-draft patent claims, office-action responses, motions, briefs or contracts for qualified reviewers to verify and revise.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="site-shell how-page">
      <div className="topline">
        <div className="container topline-inner">
          <span>Legal &amp; patent intelligence</span>
          <div className="topline-links">
            <a href="/contact-us">Contact us</a>
            <a href="/about">About us</a>
          </div>
        </div>
      </div>

      <header className="site-header about-header how-header">
        <div className="container about-header-inner">
          <a className="brand" href="/" aria-label="Legal Thread home">
            <img className="brand-mark" src="/icon.png" alt="" />
            <span className="brand-copy">
              <strong>LEGAL THREAD</strong>
              <small>DESIGN REGISTRY</small>
            </span>
          </a>
          <nav className="main-nav" aria-label="Main navigation">
            <a href="/#registry">Registry</a>
            <a className="nav-active" href="/how-it-works" aria-current="page">How it works</a>
            <a href="/about">About us</a>
            <a href="/contact-us">Contact us</a>
          </nav>
          <a className="about-header-contact" href="/contact-us">
            Talk to us <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <main>
        <section className="how-hero">
          <div className="container how-hero-inner">
            <div className="how-hero-copy">
              <div className="eyebrow">
                <span className="eyebrow-line" /> A CLEARER WORKFLOW
              </div>
              <h1>The architecture of <em>legal intelligence.</em></h1>
              <p className="how-hero-subtitle">
                From source material to reviewable insight.
              </p>
              <p className="how-hero-description">
                Legal research can mean working across lengthy documents,
                separate registries and case files. This four-step overview
                shows how AI-assisted intake, text and image analysis, source
                research and human review can fit into a legal workflow—from
                intake through review and next steps.
              </p>
              <a className="how-hero-link" href="#workflow">
                Follow the workflow <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div className="how-hero-art" aria-hidden="true">
              <div className="how-art-orbit how-art-orbit-outer" />
              <div className="how-art-orbit how-art-orbit-inner" />
              <div className="how-art-card how-art-card-back">
                <span>MATTER INPUT</span>
                <i />
                <i />
                <i />
              </div>
              <div className="how-art-card how-art-card-front">
                <span>WORKFLOW 01—04</span>
                <img className="how-art-mark" src="/icon.png" alt="" />
                <b>Research.<br />Review.<br />Decide.</b>
                <small>AI ASSISTED · HUMAN REVIEW</small>
              </div>
              <span className="how-art-caption">SOURCE TO INSIGHT</span>
            </div>
            <div className="about-hero-foot">
              <span>FOUR STEPS · ONE REVIEWABLE WORKFLOW</span>
              <span>LEGAL THREAD <b>·</b> INDIA</span>
            </div>
          </div>
        </section>

        <section className="how-workflow" id="workflow">
          <div className="container how-workflow-heading">
            <div>
              <span className="section-index">01 <span>/ THE WORKFLOW</span></span>
              <h2>From intake to <em>informed review.</em></h2>
            </div>
            <p>
              Research coverage and outputs depend on the documents, data
              sources and integrations enabled for each deployment.
            </p>
          </div>

          <div className="container how-steps">
            {stages.map((stage) => (
              <article className="how-step" key={stage.number}>
                <div className="how-step-marker">
                  <span>{stage.number}</span>
                  {stage.number !== "04" && <i />}
                </div>
                <div className="how-step-content">
                  <div className="how-step-heading">
                    <span>STEP {stage.number}</span>
                    <h3>{stage.title}</h3>
                    <p>{stage.intro}</p>
                  </div>
                  {stage.capabilities.length > 0 && (
                    <div className="how-feature-grid">
                      {stage.capabilities.map((capability) => (
                        <div className="how-feature" key={capability.title}>
                          <span className="how-feature-mark" aria-hidden="true">↗</span>
                          <div>
                            <h4>{capability.title}</h4>
                            <p>{capability.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {stage.number === "03" && (
                    <div className="how-research-grid">
                      {researchAreas.map((area) => (
                        <article className="how-research-card" key={area.title}>
                          <span>RESEARCH AREA</span>
                          <h4>{area.title}</h4>
                          <p>{area.description}</p>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
          <div className="container how-caveat">
            <span aria-hidden="true">i</span>
            <p>
              Data-source coverage, security controls, drafting features and
              integrations vary by configuration. AI-generated results require
              review by a qualified professional and are not legal advice or a
              guarantee of an outcome.
            </p>
          </div>
        </section>

        <section className="how-outcome">
          <div className="container how-outcome-grid">
            <div>
              <span className="section-index">02 <span>/ THE RESULT</span></span>
              <h2>A more focused way to <em>do the work.</em></h2>
            </div>
            <div className="how-outcome-copy">
              <p className="how-outcome-lead">
                Bring research and review into a workflow that keeps source
                material and professional judgment in view.
              </p>
              <p>
                AI-assisted search and analysis can help teams organize
                repetitive research tasks, examine relevant references and
                spend more time on legal strategy. Results depend on the
                materials available and should be checked in context.
              </p>
            </div>
          </div>
        </section>

        <section className="how-cta">
          <div className="container how-cta-inner">
            <div>
              <span className="mini-kicker">SEE HOW IT COULD FIT YOUR WORKFLOW</span>
              <h2>Experience AI-assisted legal research with human review.</h2>
            </div>
            <div className="how-cta-actions">
              <a className="button-primary" href="/contact-us">
                Book an architecture demo <span aria-hidden="true">↗</span>
              </a>
              <a className="how-cta-secondary" href="/#registry">
                Explore platform modules <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-main">
          <a className="brand footer-brand" href="/" aria-label="Legal Thread home">
            <img className="brand-mark" src="/icon.png" alt="" />
            <span className="brand-copy">
              <strong>LEGAL THREAD</strong>
              <small>DESIGN REGISTRY</small>
            </span>
          </a>
          <p>Giving every good idea<br />the clarity it deserves.</p>
          <div className="footer-links">
            <a href="/contact-us">Contact us</a>
            <a href="/about">About us</a>
            <a href="/#registry">Design registry</a>
          </div>
          <div className="footer-location">
            BUILT FOR INDIA<br /><span>DESIGN · INTELLIGENCE · PROTECTION</span>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} Legal Thread Technologies Ltd. All rights reserved.</span>
          <span>Thoughtful design deserves thoughtful protection.</span>
        </div>
      </footer>
    </div>
  );
}
