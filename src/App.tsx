import { useState, useRef } from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { SplineScene } from '@/components/ui/splite'
import { Spotlight } from '@/components/ui/spotlight'
import { GradientText } from '@/components/ui/gradient-text'
import RadialOrbitalTimeline from '@/components/ui/radial-orbital-timeline'
import { Briefcase, Users, Shield, FileCheck, Brain, Cloud } from 'lucide-react'
import './App.css'

// Magnetic Button Component
function MagneticButton({ children, className, href }: { children: React.ReactNode; className?: string; href?: string }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 15, stiffness: 150 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.15)
    y.set((e.clientY - centerY) * 0.15)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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

function App() {
  const [chatOpen, setChatOpen] = useState(false)
  const [chatStep, setChatStep] = useState<'options' | 'input' | 'done'>('options')
  const [messages, setMessages] = useState<{ type: 'bot' | 'user', text: string }[]>([
    { type: 'bot', text: "Hi, I'm here to help. What are you looking for?" }
  ])
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [formSubmitted, setFormSubmitted] = useState(false)

  const selectOption = (option: string) => {
    setMessages([...messages, { type: 'user', text: option }])
    setChatStep('input')
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text: "Got it. Drop your email and we'll reach out within 24 hours." }])
    }, 500)
  }

  const submitEmail = (email: string) => {
    if (email.includes('@')) {
      setMessages(prev => [...prev, { type: 'user', text: email }, { type: 'bot', text: "Perfect. We'll be in touch." }])
      setChatStep('done')
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setFormSubmitted(true)
  }

  return (
    <div className="app">
      {/* Mesh Gradient Background */}
      <div className="mesh-gradient" />

      {/* Navigation */}
      <motion.nav
        className="nav"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="nav-inner">
          <a href="#" className="logo">
            <span className="logo-auto">Auto</span>
            <span className="logo-minds">minds</span>
          </a>
          <div className="nav-links">
            <a href="#services">Services</a>
            <a href="#approach">Approach</a>
            <a href="/demos">Demos</a>
            <MagneticButton href="#contact" className="nav-cta">Start a project</MagneticButton>
          </div>
        </div>
      </motion.nav>

      {/* Hero with Spline 3D */}
      <section className="hero hero-split">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

        {/* Left content */}
        <div className="hero-content">
          <motion.p
            className="hero-label"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            AI Systems Integrator & Operator
          </motion.p>
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            We build AI.
            <br />
            <GradientText className="hero-gradient">You own it.</GradientText>
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            Your infrastructure. Your data. Your brand.
            <br />
            We just make it work.
          </motion.p>
          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <MagneticButton href="#contact" className="btn btn-primary btn-glow">
              Let's build something
            </MagneticButton>
          </motion.div>
        </div>

        {/* Right 3D scene */}
        <div className="hero-spline">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="spline-scene"
          />
        </div>
      </section>

      {/* Services - Orbital Timeline */}
      <section id="services" className="orbital-section">
        <div className="section-inner">
          <h2 className="section-title">What we deploy.</h2>
          <RadialOrbitalTimeline
            timelineData={[
              {
                id: 1,
                title: "White-Label AI",
                content: "Your brand. Our brain. Ship AI products tomorrow without hiring a single engineer.",
                icon: Briefcase,
                status: "completed",
                energy: 100,
              },
              {
                id: 2,
                title: "Your AI Team",
                content: "We don't consult. We build. Your dedicated AI team—embedded, accountable, shipping.",
                icon: Users,
                status: "completed",
                energy: 95,
              },
              {
                id: 3,
                title: "Private LLMs",
                content: "Your data never leaves. Models trained on your knowledge, running on your metal.",
                icon: Brain,
                status: "completed",
                energy: 90,
              },
              {
                id: 4,
                title: "Cloud Agents",
                content: "Autonomous systems that work while you sleep. Monitor. Decide. Act. Repeat.",
                icon: Cloud,
                status: "completed",
                energy: 88,
              },
              {
                id: 5,
                title: "Compliance",
                content: "ADA. 508. WCAG. We find every violation. We fix them. Automatically.",
                icon: FileCheck,
                status: "completed",
                energy: 85,
              },
              {
                id: 6,
                title: "Security",
                content: "Air-gapped. Zero-trust. Paranoid by design. Your secrets stay yours.",
                icon: Shield,
                status: "completed",
                energy: 92,
              },
            ]}
          />
        </div>
      </section>

      {/* Results / Social Proof */}
      <section className="results-section">
        <div className="section-inner">
          <motion.div
            className="results-grid"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="result-item">
              <span className="result-number">47%</span>
              <span className="result-label">Average cost reduction for our clients</span>
            </div>
            <div className="result-item">
              <span className="result-number">2M+</span>
              <span className="result-label">Documents processed monthly</span>
            </div>
            <div className="result-item">
              <span className="result-number">99.9%</span>
              <span className="result-label">Uptime across all deployments</span>
            </div>
            <div className="result-item">
              <span className="result-number">0</span>
              <span className="result-label">Data breaches. Ever.</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Approach */}
      <AnimatedSection id="approach" className="approach">
        <div className="section-inner">
          <h2 className="section-title">How we work.</h2>
          <div className="approach-grid">
            {[
              { num: '01', title: 'Embedded', desc: 'Systems live inside your environment. Your data never touches our servers.' },
              { num: '02', title: 'Continuous', desc: "We don't deliver reports. We deploy systems that keep working—forever." },
              { num: '03', title: 'Auditable', desc: 'Every decision logged. Every action traceable. Built for compliance.' }
            ].map((item, i) => (
              <motion.div
                key={item.num}
                className="approach-item"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <span className="approach-num">{item.num}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Security */}
      <AnimatedSection id="security" className="security">
        <div className="section-inner">
          <h2 className="section-title">Enterprise-grade security.</h2>
          <div className="security-grid">
            <div className="security-item">
              <h3>Air-Gapped Deployment</h3>
              <p>Deploy on your infrastructure with zero internet connectivity. Your data never touches external servers.</p>
            </div>
            <div className="security-item">
              <h3>SOC 2 Type II</h3>
              <p>Independently audited security controls. Full compliance documentation available on request.</p>
            </div>
            <div className="security-item">
              <h3>HIPAA Compatible</h3>
              <p>Built for healthcare. BAA available. PHI never leaves your environment.</p>
            </div>
            <div className="security-item">
              <h3>FedRAMP Ready</h3>
              <p>Architected for federal requirements. Currently pursuing FedRAMP authorization.</p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Contact */}
      <AnimatedSection id="contact" className="contact">
        <div className="section-inner contact-inner">
          <h2 className="section-title">Let's build something.</h2>
          <p className="contact-text">30 minutes. No pitch. Just a conversation about what's possible.</p>

          {!formSubmitted ? (
            <motion.form
              className="contact-form"
              onSubmit={handleFormSubmit}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="form-row">
                <input type="text" placeholder="Your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                <input type="email" placeholder="your@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <textarea placeholder="Tell us about your project (optional)" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={4} />
              <MagneticButton href="#" className="btn btn-primary btn-large btn-glow">
                Start the conversation
              </MagneticButton>
            </motion.form>
          ) : (
            <motion.div
              className="form-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="success-icon">✓</div>
              <h3>Message received.</h3>
              <p>We'll be in touch within 24 hours.</p>
            </motion.div>
          )}
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="logo">
            <span className="logo-auto">Auto</span>
            <span className="logo-minds">minds</span>
          </div>
          <p className="footer-text">AI Systems Integrator & Operator</p>
          <p className="footer-copyright">© 2025 Autominds LLC · Delaware</p>
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
              <strong>Autominds</strong>
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
                <button onClick={() => selectOption('I need a Private LLM')}>Private LLM</button>
                <button onClick={() => selectOption('I need Cloud Agents')}>Cloud Agents</button>
                <button onClick={() => selectOption('I need Compliance Scanning')}>Compliance</button>
                <button onClick={() => selectOption('Something else')}>Other</button>
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
