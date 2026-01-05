import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Shield, Code, ChevronDown, ChevronUp, ExternalLink, FileCode } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import '../App.css'

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

export default function DemosPage() {
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
        <div className="demos-page">
            {/* Header */}
            <header className="demos-header">
                <Link to="/" className="demos-back">
                    <ArrowLeft size={20} />
                    <span>Back to Home</span>
                </Link>
                <h1>Live Demos</h1>
                <p>Experience our technology firsthand</p>
            </header>

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
                                        {/* ADA Title II - fails if any critical/serious, warns if moderate, passes if only minor */}
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

                                        {/* WCAG 2.1 AA - passes if score >= 80 */}
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

                                        {/* Section 508 - fails if any critical */}
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

                                        {/* NIST 800-53 - only relevant if critical issues exist */}
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
                                            <Link to="/#contact" className="apple-unlock-btn">
                                                Get Full Report
                                            </Link>
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
    )
}
