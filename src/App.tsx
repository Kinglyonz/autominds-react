import { useState, useRef, useEffect } from 'react'
import { ErrorBoundary } from './components/ErrorBoundary'
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { SplineScene } from '@/components/ui/splite'
import { Spotlight } from '@/components/ui/spotlight'
import { GradientText } from '@/components/ui/gradient-text'
import { Mail, Zap, Clock, Shield, BarChart3, Users, Check, ArrowRight, Star, ChevronDown } from 'lucide-react'
import './App.css'

// Magnetic Button Component
function MagneticButton({ children, className, href, onClick }: { children: React.ReactNode; className?: string; href?: string; onClick?: () => void }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springConfig = { damping: 15, stiffness: 150 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.15)
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.15)
  }

  const handleMouseLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.a>
  )
}

// Animated Section Component
function AnimatedSection({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.section>
  )
}

const features = [
  { icon: Mail, title: 'Smart Sorting', desc: 'AI categorizes your inbox instantly — promotions, clients, urgent, follow-ups.' },
  { icon: Zap, title: 'Auto-Draft Replies', desc: 'Context-aware responses written in your voice. Review and send in one click.' },
  { icon: Clock, title: 'Follow-Up Scheduling', desc: 'Never forget a thread. Automatic reminders and scheduled follow-ups.' },
  { icon: Shield, title: 'Thread Summaries', desc: 'TLDR any email chain. Get the key points without reading 47 replies.' },
  { icon: BarChart3, title: 'Priority Flagging', desc: 'Urgent items surface first. VIP contacts always get your attention.' },
  { icon: Users, title: 'Analytics Dashboard', desc: 'See your email patterns, response times, and productivity trends.' },
]

const useCases = [
  { emoji: '🏠', industry: 'Real Estate', desc: 'Auto-respond to leads, schedule showings, and follow up with buyers — all hands-free.' },
  { emoji: '⚖️', industry: 'Law Firms', desc: 'Prioritize client emails, draft case updates, and never miss a filing deadline.' },
  { emoji: '📊', industry: 'Accounting', desc: 'Sort tax documents, schedule client communications, and manage seasonal surges.' },
  { emoji: '🏥', industry: 'Healthcare', desc: 'Triage patient inquiries, route referrals, and handle scheduling with care.' },
]

const faqs = [
  { q: 'Is my email data secure?', a: 'Absolutely. We use bank-level encryption, never store your email content on our servers, and are fully GDPR compliant. Your data stays yours.' },
  { q: 'Which email providers do you support?', a: 'Gmail and Microsoft Outlook (including Office 365). More providers coming soon.' },
  { q: "Can I customize the AI's writing style?", a: 'Yes! The AI learns your tone, vocabulary, and communication style. You can also set explicit rules for different types of emails.' },
  { q: 'How does the free plan work?', a: 'You get 50 AI email actions per month — sorting, drafting, summarizing. No credit card required. Upgrade anytime.' },
  { q: 'Can I cancel anytime?', a: 'Yes. No contracts, no cancellation fees. Cancel with one click from your dashboard.' },
  { q: 'Do you offer a money-back guarantee?', a: "Yes — 14-day money-back guarantee on all paid plans. If you're not saving time, we'll refund you." },
]

const testimonials = [
  { name: 'Sarah Mitchell', role: 'Real Estate Agent, Keller Williams', quote: "I used to spend 3 hours a day on email. Now it's 20 minutes. AutoMinds handles the sorting and drafts — I just review and send.", stars: 5 },
  { name: 'David Chen', role: 'Partner, Chen & Associates Law', quote: "Client emails never slip through the cracks anymore. The priority flagging alone is worth the subscription.", stars: 5 },
  { name: 'Maria Rodriguez', role: 'CPA, Rodriguez Accounting', quote: "During tax season, I was drowning in emails. AutoMinds cut my inbox time by 80%. Game changer.", stars: 5 },
]

function App() {
  // Theme
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark'
    return 'dark'
  })
  useEffect(() => { document.body.setAttribute('data-theme', theme); localStorage.setItem('theme', theme) }, [theme])
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

  // Pricing toggle
  const [annual, setAnnual] = useState(false)

  // Chat widget
  const [chatOpen, setChatOpen] = useState(false)
  const [chatStep, setChatStep] = useState<'options' | 'input' | 'done'>('options')
  const [messages, setMessages] = useState<{ type: 'bot' | 'user'; text: string }[]>([
    { type: 'bot', text: "Hi! Interested in taking back your inbox? What can I help with?" }
  ])

  const selectOption = (option: string) => {
    setMessages(prev => [...prev, { type: 'user', text: option }])
    setChatStep('input')
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text: "Great choice! Drop your email and we'll get you set up within 24 hours." }])
    }, 500)
  }

  const submitEmail = (email: string) => {
    if (email.includes('@')) {
      setMessages(prev => [...prev, { type: 'user', text: email }, { type: 'bot', text: "Perfect. We'll be in touch shortly!" }])
      setChatStep('done')
    }
  }

  // FAQ expand
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  // Calendly script
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://assets.calendly.com/assets/external/widget.js"
    script.async = true
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [])

  return (
    <div className="app" data-theme={theme}>
      <div className="mesh-gradient" />

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="logo">
            <span className="logo-auto">Auto</span>
            <span className="logo-minds">Minds</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#pricing">Pricing</a>
            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <MagneticButton href="#pricing" className="btn btn-primary btn-small">
              Get Started Free
            </MagneticButton>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero hero-split">
        <Spotlight className="animate-spotlight" fill="blue" />
        <div className="hero-content">
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Zap size={14} /> AI-Powered Email Assistant
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Your inbox.{' '}
            <GradientText>On autopilot.</GradientText>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            AutoMinds reads, sorts, drafts, and schedules your emails — so you don't have to.
          </motion.p>

          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <MagneticButton href="#pricing" className="btn btn-primary btn-large">
              Start Free <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
            </MagneticButton>
            <MagneticButton href="#how-it-works" className="btn btn-secondary btn-large">
              See How It Works
            </MagneticButton>
          </motion.div>

          <motion.div
            className="hero-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="hero-stat">
              <strong>50+</strong>
              <span>Hours Saved/mo</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <strong>99.7%</strong>
              <span>Accuracy</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <strong>2 min</strong>
              <span>Setup</span>
            </div>
          </motion.div>
        </div>

        <div className="hero-spline">
          <ErrorBoundary>
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="spline-scene"
            />
          </ErrorBoundary>
        </div>
      </section>

      {/* Social Proof Bar */}
      <AnimatedSection className="social-proof-bar">
        <div className="section-inner social-proof-inner">
          <p className="social-proof-text">
            Trusted by professionals in <strong>Real Estate</strong>, <strong>Law</strong>, <strong>Healthcare</strong>, and <strong>Accounting</strong>
          </p>
        </div>
      </AnimatedSection>

      {/* Features */}
      <AnimatedSection id="features" className="features-section">
        <div className="section-inner">
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            Everything your inbox needs.{' '}
            <span className="gradient-text">Nothing it doesn't.</span>
          </h2>
          <div className="features-grid">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="feature-icon">
                  <f.icon size={24} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* How It Works */}
      <AnimatedSection id="how-it-works" className="how-section">
        <div className="section-inner">
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            Up and running in <span className="gradient-text">three steps.</span>
          </h2>
          <div className="steps-grid">
            {[
              { num: '01', title: 'Connect Your Email', desc: 'Gmail or Outlook — two clicks and you\'re linked. No IT team needed.', icon: '🔗' },
              { num: '02', title: 'Set Your Preferences', desc: 'Tell the AI your rules, tone, and priorities. It adapts to you.', icon: '⚙️' },
              { num: '03', title: 'Watch It Work', desc: 'Sit back. Your inbox is sorted, drafted, and managed — automatically.', icon: '✨' },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                className="step-card"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
              >
                <span className="step-num">{step.num}</span>
                <span className="step-emoji">{step.icon}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Use Cases */}
      <AnimatedSection className="usecases-section">
        <div className="section-inner">
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            Built for <span className="gradient-text">every industry.</span>
          </h2>
          <div className="usecases-grid">
            {useCases.map((uc, i) => (
              <motion.div
                key={uc.industry}
                className="usecase-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              >
                <span className="usecase-emoji">{uc.emoji}</span>
                <h3>{uc.industry}</h3>
                <p>{uc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Pricing */}
      <AnimatedSection id="pricing" className="pricing-section">
        <div className="section-inner">
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            Simple, transparent <span className="gradient-text">pricing.</span>
          </h2>
          <div className="billing-toggle">
            <span className={!annual ? 'active' : ''}>Monthly</span>
            <button
              className={`toggle-switch ${annual ? 'on' : ''}`}
              onClick={() => setAnnual(!annual)}
              aria-label="Toggle annual billing"
            >
              <span className="toggle-knob" />
            </button>
            <span className={annual ? 'active' : ''}>Annual <span className="save-badge">Save 20%</span></span>
          </div>
          <div className="pricing-grid">
            {/* Free */}
            <motion.div
              className="pricing-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3>Free</h3>
              <div className="pricing-amount">
                <span className="price">$0</span>
                <span className="period">/month</span>
              </div>
              <p className="pricing-desc">Get started — no credit card required.</p>
              <ul className="pricing-features">
                <li><Check size={16} /> 50 email actions/month</li>
                <li><Check size={16} /> Basic inbox sorting</li>
                <li><Check size={16} /> 1 email account</li>
                <li><Check size={16} /> Email support</li>
              </ul>
              <MagneticButton href="https://calendly.com/admin-autominds/30min" className="btn btn-secondary btn-full">
                Get Started
              </MagneticButton>
            </motion.div>

            {/* Pro — Featured */}
            <motion.div
              className="pricing-card pricing-featured"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="popular-badge">Most Popular</div>
              <h3>Pro</h3>
              <div className="pricing-amount">
                <span className="price">${annual ? '23' : '29'}</span>
                <span className="period">/month</span>
              </div>
              <p className="pricing-desc">For professionals who live in their inbox.</p>
              <ul className="pricing-features">
                <li><Check size={16} /> Unlimited email actions</li>
                <li><Check size={16} /> AI draft replies</li>
                <li><Check size={16} /> Follow-up scheduling</li>
                <li><Check size={16} /> Thread summaries</li>
                <li><Check size={16} /> Priority flagging</li>
                <li><Check size={16} /> Priority support</li>
              </ul>
              <MagneticButton href="https://calendly.com/admin-autominds/30min" className="btn btn-primary btn-full">
                Start Pro Trial <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
              </MagneticButton>
            </motion.div>

            {/* Business */}
            <motion.div
              className="pricing-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3>Business</h3>
              <div className="pricing-amount">
                <span className="price">${annual ? '79' : '99'}</span>
                <span className="period">/month</span>
              </div>
              <p className="pricing-desc">For teams that need full control.</p>
              <ul className="pricing-features">
                <li><Check size={16} /> Everything in Pro</li>
                <li><Check size={16} /> Multi-inbox support</li>
                <li><Check size={16} /> Team collaboration</li>
                <li><Check size={16} /> Custom AI rules</li>
                <li><Check size={16} /> Analytics dashboard</li>
                <li><Check size={16} /> Dedicated support</li>
              </ul>
              <MagneticButton href="https://calendly.com/admin-autominds/30min" className="btn btn-secondary btn-full">
                Contact Sales
              </MagneticButton>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Testimonials */}
      <AnimatedSection className="testimonials-section">
        <div className="section-inner">
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            People are <span className="gradient-text">loving it.</span>
          </h2>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="testimonial-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <div className="testimonial-stars">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="testimonial-quote">"{t.quote}"</p>
                <div className="testimonial-author">
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* FAQ */}
      <AnimatedSection className="faq-section">
        <div className="section-inner">
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            Frequently asked <span className="gradient-text">questions.</span>
          </h2>
          <div className="faq-grid">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className={`faq-item ${expandedFaq === i ? 'expanded' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
              >
                <div className="faq-question">
                  <span>{faq.q}</span>
                  <ChevronDown size={18} className={`faq-chevron ${expandedFaq === i ? 'rotated' : ''}`} />
                </div>
                <AnimatePresence>
                  {expandedFaq === i && (
                    <motion.div
                      className="faq-answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* CTA / Contact */}
      <AnimatedSection id="contact" className="cta-section">
        <div className="section-inner contact-inner">
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            Ready to take back your <span className="gradient-text">inbox?</span>
          </h2>
          <p className="contact-text">Book a free 30-minute demo. No pitch. Just a look at what's possible.</p>

          <div className="cta-buttons" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <MagneticButton href="https://calendly.com/admin-autominds/30min" className="btn btn-primary btn-large">
              Book a Demo <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
            </MagneticButton>
          </div>

          <div className="calendly-wrapper" style={{ height: '700px', minWidth: '320px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div
              className="calendly-inline-widget"
              data-url="https://calendly.com/admin-autominds/30min?hide_gdpr_banner=1&background_color=0a0a0a&text_color=ffffff&primary_color=0071e3"
              style={{ minWidth: '320px', height: '100%' }}
            />
          </div>

          <div className="cta-contact-info" style={{ textAlign: 'center', marginTop: '2rem' }}>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
              Or reach us directly: <a href="mailto:khalillyons@gmail.com" style={{ color: 'var(--accent)' }}>khalillyons@gmail.com</a> · <a href="tel:+18555290581" style={{ color: 'var(--accent)' }}>+1-855-529-0581</a>
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner footer-expanded">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="logo">
                <span className="logo-auto">Auto</span>
                <span className="logo-minds">Minds</span>
              </div>
              <p className="footer-tagline">AI Email Assistant for Professionals</p>
            </div>
            <div className="footer-links">
              <div className="footer-col">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#how-it-works">How It Works</a>
                <a href="#pricing">Pricing</a>
              </div>
              <div className="footer-col">
                <h4>Company</h4>
                <a href="#contact">Contact</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
              </div>
              <div className="footer-col">
                <h4>Connect</h4>
                <a href="mailto:khalillyons@gmail.com">Email Us</a>
                <a href="tel:+18555290581">Call Us</a>
                <a href="https://calendly.com/admin-autominds/30min">Book a Demo</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-copyright">&copy; 2026 AutoMinds LLC &middot; Delaware</p>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <motion.div
        className={`chat-widget ${chatOpen ? 'open' : ''}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.5 }}
      >
        <motion.button
          className="chat-toggle"
          onClick={() => setChatOpen(!chatOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {chatOpen ? '✕' : '💬'}
        </motion.button>

        {chatOpen && (
          <motion.div
            className="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="chat-header">
              <strong>AutoMinds</strong>
              <span>Usually replies instantly</span>
            </div>
            <div className="chat-messages">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  className={`message ${msg.type}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.1 }}
                >
                  {msg.text}
                </motion.div>
              ))}
            </div>
            {chatStep === 'options' && (
              <div className="chat-options">
                <button onClick={() => selectOption('I want the Free Plan')}>Free Plan</button>
                <button onClick={() => selectOption("I'm interested in Pro")}>Pro Plan</button>
                <button onClick={() => selectOption('Tell me about Business')}>Business Plan</button>
                <button onClick={() => selectOption('I have questions')}>Just Questions</button>
              </div>
            )}
            {chatStep === 'input' && (
              <form className="chat-input" onSubmit={(e) => { e.preventDefault(); const input = e.currentTarget.querySelector('input'); if (input) submitEmail(input.value) }}>
                <input type="email" placeholder="your@email.com" />
                <button type="submit">→</button>
              </form>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default App
