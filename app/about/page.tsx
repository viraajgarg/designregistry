import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Legal Thread",
  description:
    "Learn how Legal Thread brings enterprise architecture and AI to legal and patent intelligence.",
};

const capabilities = [
  {
    number: "01",
    title: "Deep learning & neural networks",
    description:
      "Research with recurrent neural networks (RNNs) and convolutional neural networks (CNNs) to interpret complex legal texts and technical patent drawings.",
  },
  {
    number: "02",
    title: "Computer vision & image intelligence",
    description:
      "Object detection, image identification and segmentation help automate prior-art searches and analyze intricate patent diagrams.",
  },
  {
    number: "03",
    title: "Semantic search",
    description:
      "Context-aware search moves beyond keyword matching to better understand legal and technical intent.",
  },
];

const principles = [
  {
    number: "01",
    title: "Enterprise-grade security",
    description:
      "We apply rigorous data-protection practices to sensitive intellectual property and legal filings.",
  },
  {
    number: "02",
    title: "Scalable solution design",
    description:
      "We build resilient systems designed to process large volumes of unstructured patent data.",
  },
  {
    number: "03",
    title: "Precision under pressure",
    description:
      "Financial-services experience informs the analytical discipline behind tools for consequential legal work.",
  },
];

export default function AboutPage() {
  return (
    <div className="site-shell about-page">
      <div className="topline">
        <div className="container topline-inner">
          <span>Legal &amp; patent intelligence</span>
          <div className="topline-links">
            <a href="/contact-us">Contact us</a>
            <a href="/about" aria-current="page">About us</a>
          </div>
        </div>
      </div>

      <header className="site-header about-header">
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
            <a href="/how-it-works">How it works</a>
            <a className="nav-active" href="/about" aria-current="page">About us</a>
            <a href="/contact-us">Contact us</a>
          </nav>
          <a className="about-header-contact" href="/contact-us">
            Get in touch <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <main>
        <section className="about-hero">
          <div className="container about-hero-inner">
            <div className="about-hero-copy">
              <div className="eyebrow">
                <span className="eyebrow-line" /> ABOUT LEGAL THREAD
              </div>
              <h1>Redefining <em>legal &amp; patent intelligence.</em></h1>
              <p className="about-hero-subtitle">
                Where enterprise rigor meets deep-tech innovation.
              </p>
              <p className="about-hero-description">
                We build intelligent, precision-driven software for the patent
                and legal industry. By bringing together enterprise
                architecture and artificial intelligence, we help legal teams,
                patent attorneys and IP professionals analyze, protect and
                manage intellectual property.
              </p>
              <a className="about-text-link" href="/#registry">
                Explore our solutions <span aria-hidden="true">→</span>
              </a>
            </div>
            <div className="about-hero-art" aria-hidden="true">
              <div className="about-orbit about-orbit-outer" />
              <div className="about-orbit about-orbit-inner" />
              <div className="about-doc about-doc-back">
                <span>LEGAL INTELLIGENCE</span>
                <i />
                <i />
                <i />
              </div>
              <div className="about-doc about-doc-front">
                <span>IDEA → INSIGHT</span>
                <img className="about-doc-mark" src="/icon.png" alt="" />
                <b>Patent &amp;<br />legal intelligence</b>
                <small>RESEARCH · ANALYSIS · DISCOVERY</small>
              </div>
              <span className="about-art-label">BUILT WITH CARE IN BANGALORE</span>
            </div>
            <div className="about-hero-foot">
              <span>INTELLIGENCE FOR COMPLEX WORK</span>
              <span>LEGAL THREAD <b>·</b> INDIA</span>
            </div>
          </div>
        </section>

        <section className="about-origin section-pad" id="origin">
          <div className="container about-origin-grid">
            <div className="about-section-intro">
              <span className="section-index">01 <span>/ OUR ORIGIN</span></span>
              <h2>From a small room in Bangalore <em>to global IP solutions.</em></h2>
              <p>
                Every transformative technology begins with curiosity and a
                determination to solve difficult problems.
              </p>
            </div>
            <div className="about-origin-content">
              <p className="about-lead">
                Our journey began in a small room in a rented apartment in
                Bangalore: whiteboards, research papers, books on artificial
                intelligence and machine learning, and a bold vision to
                modernize the legal landscape.
              </p>
              <p>
                While legal and patent work often relied on manual reviews and
                legacy workflows, we spent long hours researching and
                experimenting with computer vision and natural language
                processing. The researcher behind the work also wrote a book
                on RAG and Agentic RAG, after delivering a couple of products
                built on these approaches.
              </p>
              <p>
                What began as late-night brainstorming has grown into a
                dedicated platform intended to give legal professionals more
                speed, accuracy and analytical depth.
              </p>
            </div>
          </div>
          <div className="container about-capability-wrap">
            <div className="about-capability-heading">
              <span className="mini-kicker">AREAS OF RESEARCH</span>
              <span>01 — 03</span>
            </div>
            <div className="about-capabilities">
              {capabilities.map((capability) => (
                <article className="about-capability" key={capability.number}>
                  <span>{capability.number}</span>
                  <h3>{capability.title}</h3>
                  <p>{capability.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="about-foundation">
          <div className="container about-foundation-grid">
            <div className="about-foundation-intro">
              <span className="section-index">02 <span>/ OUR FOUNDATION</span></span>
              <h2>Built on global banking &amp; finance <em>discipline.</em></h2>
              <p>
                Innovation without reliability is a risk the legal industry
                cannot afford. Our solutions are shaped by governance, data
                security and high-stakes system design.
              </p>
              <div className="about-institutions">
                <span>EXPERIENCE ALONGSIDE</span>
                <p>UBS <i /> RBS <i /> DBS <i /> Standard Chartered <i /> Standard Bank Offshore</p>
              </div>
            </div>
            <div className="about-foundation-content">
              <p className="about-lead">
                Our founder is a Solution Architect whose career is rooted in
                global banking and financial services, designing and
                delivering mission-critical solutions alongside tier-one
                financial institutions.
              </p>
              <div className="about-principles">
                {principles.map((principle) => (
                  <article className="about-principle" key={principle.number}>
                    <span>{principle.number}</span>
                    <div>
                      <h3>{principle.title}</h3>
                      <p>{principle.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="about-mission section-pad" id="mission">
          <div className="container about-mission-grid">
            <div>
              <span className="section-index">03 <span>/ OUR MISSION</span></span>
              <h2>Bridge legal expertise and <em>modern AI.</em></h2>
            </div>
            <div className="about-mission-copy">
              <p className="about-lead">
                We exist to bridge the gap between complex legal expertise and
                modern artificial intelligence.
              </p>
              <p>
                By helping with patent analysis, image recognition and
                semantic discovery, we aim to take on repetitive research
                work—so legal minds can focus on strategy, advocacy, protecting
                innovation and acting against patent infringement.
              </p>
            </div>
          </div>
        </section>

        <section className="about-cta">
          <div className="container about-cta-inner">
            <div>
              <span className="mini-kicker">LET’S MOVE THE WORK FORWARD</span>
              <h2>Ready to transform your legal and patent workflows?</h2>
            </div>
            <div className="about-cta-actions">
              <a className="button-primary" href="/#registry">
                Explore our solutions <span aria-hidden="true">→</span>
              </a>
              <a className="about-cta-contact" href="/contact-us">
                Get in touch <span aria-hidden="true">↗</span>
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
            <a href="/about" aria-current="page">About us</a>
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
