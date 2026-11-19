import type { Metadata } from "next";

const contactEmail = "consult.ai@vikramgarg.in";
const contactMailto = `mailto:${contactEmail}?subject=Legal%20and%20patent%20intelligence%20inquiry`;

export const metadata: Metadata = {
  title: "Contact Us | Legal Thread",
  description:
    "Contact Legal Thread about legal and patent intelligence solutions.",
};

export default function ContactPage() {
  return (
    <div className="site-shell contact-page">
      <div className="topline">
        <div className="container topline-inner">
          <span>Legal &amp; patent intelligence</span>
          <div className="topline-links">
            <a href={contactMailto}>Contact us</a>
            <a href="/about">About us</a>
          </div>
        </div>
      </div>

      <header className="site-header about-header contact-header">
        <div className="container about-header-inner">
          <a className="brand" href="/" aria-label="Legal Thread home">
            <span className="brand-mark">LT</span>
            <span className="brand-copy">
              <strong>LEGAL THREAD</strong>
              <small>DESIGN REGISTRY</small>
            </span>
          </a>
          <nav className="main-nav" aria-label="Main navigation">
            <a href="/#registry">Registry</a>
            <a href="/how-it-works">How it works</a>
            <a href="/about">About us</a>
            <a className="nav-active" href="/contact-us" aria-current="page">Contact us</a>
          </nav>
          <a className="about-header-contact" href={contactMailto}>
            Email us <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <main>
        <section className="contact-hero">
          <div className="container contact-hero-inner">
            <div className="contact-hero-copy">
              <div className="eyebrow">
                <span className="eyebrow-line" /> CONTACT LEGAL THREAD
              </div>
              <h1>Let’s talk about <em>what you’re working on.</em></h1>
              <p>
                Get in touch to discuss legal and patent intelligence, our
                solutions, or a general inquiry.
              </p>
              <a className="contact-email-link" href={contactMailto}>
                <span className="contact-email-icon" aria-hidden="true">@</span>
                <span>
                  <small>EMAIL US</small>
                  <strong>{contactEmail}</strong>
                </span>
                <span className="contact-email-arrow" aria-hidden="true">↗</span>
              </a>
            </div>
            <div className="contact-visual" aria-hidden="true">
              <div className="contact-visual-orbit contact-visual-orbit-outer" />
              <div className="contact-visual-orbit contact-visual-orbit-inner" />
              <div className="contact-note contact-note-back">
                <span>LET’S CONNECT</span>
                <i />
                <i />
                <i />
              </div>
              <div className="contact-note contact-note-front">
                <span>LEGAL THREAD</span>
                <div className="contact-note-mark">@</div>
                <b>Ideas start<br />with a conversation.</b>
                <small>LEGAL · PATENT · INTELLIGENCE</small>
              </div>
              <span className="contact-visual-caption">WE’RE LISTENING</span>
            </div>
            <div className="about-hero-foot">
              <span>START A CONVERSATION</span>
              <span>LEGAL THREAD <b>·</b> INDIA</span>
            </div>
          </div>
        </section>

        <section className="contact-details">
          <div className="container contact-details-inner">
            <div>
              <span className="section-index">01 <span>/ GET IN TOUCH</span></span>
              <h2>One direct way to reach us.</h2>
            </div>
            <div className="contact-details-copy">
              <p>
                Send us an email and tell us a little about your inquiry. We’ll
                be glad to hear from you.
              </p>
              <a className="button-primary" href={contactMailto}>
                Email Legal Thread <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-main">
          <a className="brand footer-brand" href="/" aria-label="Legal Thread home">
            <span className="brand-mark">LT</span>
            <span className="brand-copy">
              <strong>LEGAL THREAD</strong>
              <small>DESIGN REGISTRY</small>
            </span>
          </a>
          <p>Giving every good idea<br />the clarity it deserves.</p>
          <div className="footer-links">
            <a href={contactMailto}>Contact us</a>
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
