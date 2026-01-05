import { useState, useRef } from 'react'
import { ErrorBoundary } from './components/ErrorBoundary'
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { SplineScene } from '@/components/ui/splite'
import { Spotlight } from '@/components/ui/spotlight'
import { GradientText } from '@/components/ui/gradient-text'
import RadialOrbitalTimeline from '@/components/ui/radial-orbital-timeline'
import { Briefcase, Users, Shield, FileCheck, Brain, Cloud, Code, FileCode, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import './App.css'

interface Violation {
  id: string
  impact: string
  description: string
  help: string
  nodeCount?: number
  nodes?: number
  selectors?: string[]
}

interface ScanResult {
  success: boolean
  url: string
  title: string
  score: number
  summary: {
    total: number
    nonCompliant?: number
    warnings?: number
    critical: number
    serious: number
    moderate: number
    minor: number
  }
  violations: Violation[]
  totalViolations: number
  hasMore: boolean
}

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

  // --- Demos Logic ---
  const [activeDemo, setActiveDemo] = useState<'scanner' | 'ide' | 'code'>('scanner')
  const [scanUrl, setScanUrl] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [scanError, setScanError] = useState<string | null>(null)
  const [expandedIssues, setExpandedIssues] = useState<Set<number>>(new Set())

  const toggleIssue = (index: number) => {
    const newExpanded = new Set(expandedIssues)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedIssues(newExpanded)
  }

  const handleScan = async () => {
    if (!scanUrl || !scanUrl.includes('.')) {
      setScanError('Please enter a valid URL')
      return
    }

    setIsScanning(true)
    setScanError(null)
    setScanResult(null)
    setExpandedIssues(new Set())

    try {
      // Note: In production, this needs to point to the real backend
      const response = await fetch('http://localhost:3001/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: scanUrl })
      })

      const data = await response.json()

      if (data.success) {
        setScanResult(data)
      } else {
        setScanError(data.error || 'Scan failed')
      }
    } catch {
      setScanError('Scanner service unavailable. Please try again.')
    } finally {
      setIsScanning(false)
    }
  }

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'linear-gradient(135deg, #10b981, #34d399)'
    if (score >= 60) return 'linear-gradient(135deg, #f59e0b, #fbbf24)'
    if (score >= 40) return 'linear-gradient(135deg, #f97316, #fb923c)'
    return 'linear-gradient(135deg, #ef4444, #f87171)'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Good'
    if (score >= 60) return 'Needs Work'
    if (score >= 40) return 'Poor'
    return 'Critical'
  }

  const getImpactStyle = (impact: string) => {
    switch (impact) {
      case 'critical': return { bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', text: '#fca5a5' }
      case 'serious': return { bg: 'rgba(249, 115, 22, 0.15)', border: '#f97316', text: '#fdba74' }
      case 'moderate': return { bg: 'rgba(234, 179, 8, 0.15)', border: '#eab308', text: '#fde047' }
      default: return { bg: 'rgba(59, 130, 246, 0.15)', border: '#3b82f6', text: '#93c5fd' }
    }
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
          <ErrorBoundary fallback={
            <div className="spline-fallback" style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'url(/robot_fallback.png) no-repeat center center',
              backgroundSize: 'contain'
            }}>
            </div>
          }>
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="spline-scene"
            />
          </ErrorBoundary>
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



      {/* Live Demos Section */}
      <section className="demos-section" style={{ padding: '4rem 0', background: 'transparent' }}>
        <div className="section-inner">
          <div className="demos-header" style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h2 className="section-title">Experience it Live.</h2>
            <p style={{ color: 'var(--gray-500)', fontSize: '1.1rem' }}>No slide decks. Just working code.</p>
          </div>

          {/* Demo Tabs */}
          <div className="demos-tabs">
            <button
              className={`demo-tab ${activeDemo === 'scanner' ? 'active' : ''}`}
              onClick={() => setActiveDemo('scanner')}
            >
              <Shield size={20} />
              Accessibility Scanner
            </button>
            <button
              className={`demo-tab ${activeDemo === 'code' ? 'active' : ''}`}
              onClick={() => setActiveDemo('code')}
            >
              <FileCode size={20} />
              Code Review
            </button>
            <button
              className={`demo-tab ${activeDemo === 'ide' ? 'active' : ''}`}
              onClick={() => setActiveDemo('ide')}
            >
              <Code size={20} />
              Cloud IDE
            </button>
          </div>

          {/* Demo Content */}
          <div className="demos-content">
            {activeDemo === 'scanner' && (
              <motion.div
                className="demo-panel apple-scanner"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Input Section */}
                <div className="apple-input-section">
                  <input
                    type="url"
                    placeholder="Enter website URL..."
                    className="apple-input"
                    value={scanUrl}
                    onChange={(e) => setScanUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                  />
                  <button
                    className="apple-scan-btn"
                    onClick={handleScan}
                    disabled={isScanning}
                  >
                    {isScanning ? 'Scanning...' : 'Analyze'}
                  </button>
                </div>

                {scanError && (
                  <div className="apple-error">{scanError}</div>
                )}

                {isScanning && (
                  <div className="apple-loading">
                    <div className="apple-spinner"></div>
                    <p>Analyzing accessibility...</p>
                  </div>
                )}

                {scanResult && (
                  <motion.div
                    className="apple-results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {/* Score Hero */}
                    <div className="apple-score-hero">
                      <div
                        className="apple-score-ring"
                        style={{ background: getScoreGradient(scanResult.score) }}
                      >
                        <div className="apple-score-inner">
                          <span className="apple-score-value">{scanResult.score}</span>
                        </div>
                      </div>
                      <div className="apple-score-info">
                        <h2>{scanResult.title}</h2>
                        <a href={scanResult.url} target="_blank" rel="noopener noreferrer" className="apple-url">
                          {scanResult.url} <ExternalLink size={14} />
                        </a>
                        <span className="apple-score-label" style={{ color: getScoreGradient(scanResult.score).includes('10b981') ? '#34d399' : getScoreGradient(scanResult.score).includes('ef4444') ? '#f87171' : '#fbbf24' }}>
                          {getScoreLabel(scanResult.score)}
                        </span>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="apple-quick-stats">
                      <div className="apple-stat">
                        <span className="apple-stat-value">{scanResult.summary.total}</span>
                        <span className="apple-stat-label">Total Issues</span>
                      </div>
                      <div className="apple-stat apple-stat-red">
                        <span className="apple-stat-value">{(scanResult.summary.nonCompliant ?? (scanResult.summary.critical + scanResult.summary.serious))}</span>
                        <span className="apple-stat-label">Non-Compliant</span>
                      </div>
                      <div className="apple-stat apple-stat-yellow">
                        <span className="apple-stat-value">{(scanResult.summary.warnings ?? (scanResult.summary.moderate + scanResult.summary.minor))}</span>
                        <span className="apple-stat-label">Warnings</span>
                      </div>
                    </div>

                    {/* Compliance Frameworks */}
                    <div className="apple-frameworks">
                      <span className="apple-framework-label">Compliance Status:</span>
                      <div className="apple-framework-badges">
                        {/* ADA Title II */}
                        <span className={`apple-badge ${scanResult.summary.critical > 0 || scanResult.summary.serious > 0
                          ? 'apple-badge-fail'
                          : scanResult.summary.moderate > 0
                            ? 'apple-badge-warn'
                            : 'apple-badge-pass'
                          }`}>
                          <span className="badge-icon">
                            {scanResult.summary.critical > 0 || scanResult.summary.serious > 0 ? '✕' : scanResult.summary.moderate > 0 ? '!' : '✓'}
                          </span> ADA Title II
                        </span>

                        {/* WCAG 2.1 AA */}
                        <span className={`apple-badge ${scanResult.score >= 80
                          ? 'apple-badge-pass'
                          : scanResult.score >= 50
                            ? 'apple-badge-warn'
                            : 'apple-badge-fail'
                          }`}>
                          <span className="badge-icon">
                            {scanResult.score >= 80 ? '✓' : scanResult.score >= 50 ? '!' : '✕'}
                          </span> WCAG 2.1 AA
                        </span>

                        {/* Section 508 */}
                        <span className={`apple-badge ${scanResult.summary.critical > 0
                          ? 'apple-badge-fail'
                          : scanResult.summary.serious > 0
                            ? 'apple-badge-warn'
                            : 'apple-badge-pass'
                          }`}>
                          <span className="badge-icon">
                            {scanResult.summary.critical > 0 ? '✕' : scanResult.summary.serious > 0 ? '!' : '✓'}
                          </span> Section 508
                        </span>

                        {/* NIST 800-53 */}
                        <span className={`apple-badge ${scanResult.summary.critical > 0
                          ? 'apple-badge-fail'
                          : scanResult.summary.serious > 0 || scanResult.summary.moderate > 0
                            ? 'apple-badge-warn'
                            : 'apple-badge-pass'
                          }`}>
                          <span className="badge-icon">
                            {scanResult.summary.critical > 0 ? '✕' : (scanResult.summary.serious > 0 || scanResult.summary.moderate > 0) ? '!' : '✓'}
                          </span> NIST 800-53
                        </span>
                      </div>
                    </div>

                    {/* Issues Accordion */}
                    <div className="apple-issues">
                      <h3>Issues Found</h3>
                      {scanResult.violations.map((violation, i) => {
                        const style = getImpactStyle(violation.impact)
                        const isExpanded = expandedIssues.has(i)

                        return (
                          <div
                            key={i}
                            className="apple-issue"
                            style={{
                              background: style.bg,
                              borderColor: style.border
                            }}
                          >
                            <button
                              className="apple-issue-header"
                              onClick={() => toggleIssue(i)}
                            >
                              <div className="apple-issue-left">
                                <span
                                  className="apple-issue-impact"
                                  style={{ backgroundColor: style.border }}
                                >
                                  {violation.impact.toUpperCase()}
                                </span>
                                <span className="apple-issue-title">{violation.help}</span>
                              </div>
                              <div className="apple-issue-right">
                                <span className="apple-issue-count">
                                  {violation.nodeCount || violation.nodes || 1} elements
                                </span>
                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                              </div>
                            </button>

                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  className="apple-issue-details"
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <p className="apple-issue-desc">{violation.description}</p>

                                  {violation.selectors && violation.selectors.length > 0 && (
                                    <div className="apple-selectors">
                                      <span className="apple-selector-label">Affected Elements:</span>
                                      {violation.selectors.map((sel, j) => (
                                        <div key={j} className="apple-selector-row">
                                          <code className="apple-selector-code">
                                            <span className="selector-type html-type">HTML</span>
                                            <span className="selector-path">{sel.split('>').pop()?.trim() || sel}</span>
                                          </code>
                                          <code className="apple-selector-code">
                                            <span className="selector-type css-type">CSS</span>
                                            <span className="selector-path">{sel}</span>
                                          </code>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )
                      })}

                      {scanResult.hasMore && (
                        <div className="apple-more-issues">
                          <span>+ {scanResult.totalViolations - 5} more issues</span>
                          <a href="#contact" className="apple-unlock-btn">
                            Get Full Report
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeDemo === 'code' && (
              <motion.div
                className="demo-panel ide-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="ide-inner">
                  <h2>Code Health Check</h2>
                  <p className="demo-description">
                    AI-powered code review. Get instant feedback on your code quality.
                  </p>

                  <div className="ide-features">
                    <div className="ide-feature">
                      <span className="ide-icon">🔍</span>
                      <span>Bug detection</span>
                    </div>
                    <div className="ide-feature">
                      <span className="ide-icon">⚡</span>
                      <span>Performance tips</span>
                    </div>
                    <div className="ide-feature">
                      <span className="ide-icon">📝</span>
                      <span>Best practices</span>
                    </div>
                  </div>

                  <div className="ide-cta">
                    <Link
                      to="/code-review"
                      className="btn btn-primary btn-large"
                    >
                      Try Code Review
                    </Link>
                    <p className="ide-note">100 lines free · AI-Powered</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeDemo === 'ide' && (
              <motion.div
                className="demo-panel ide-panel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="ide-inner">
                  <h2>Cloud IDE</h2>
                  <p className="demo-description">
                    VS Code in your browser. Access from any device, anywhere.
                  </p>

                  <div className="ide-features">
                    <div className="ide-feature">
                      <span className="ide-icon">💻</span>
                      <span>Full VS Code experience</span>
                    </div>
                    <div className="ide-feature">
                      <span className="ide-icon">📱</span>
                      <span>Mobile accessible</span>
                    </div>
                    <div className="ide-feature">
                      <span className="ide-icon">🔒</span>
                      <span>Your data stays private</span>
                    </div>
                  </div>

                  <div className="ide-cta">
                    <Link
                      to="/ide"
                      className="btn btn-primary btn-large"
                    >
                      Launch Cloud IDE
                    </Link>
                    <p className="ide-note">Password: demo</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
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
