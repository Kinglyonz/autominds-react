import { motion } from 'framer-motion'
import { ArrowLeft, AlertTriangle, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import '../App.css'

interface ReviewResult {
    success: boolean
    language: string
    linesAnalyzed: number
    score: number
    summary: string
    issues: Array<{
        severity: string
        line: number | null
        title: string
        description: string
    }>
    totalIssues: number
    hasMore: boolean
    highlights: string[]
}

export default function CodeReviewPage() {
    const [code, setCode] = useState('')
    const [language, setLanguage] = useState('javascript')
    const [isReviewing, setIsReviewing] = useState(false)
    const [result, setResult] = useState<ReviewResult | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleReview = async () => {
        if (!code.trim()) {
            setError('Please enter some code to review')
            return
        }

        const lines = code.split('\n').length
        if (lines > 100) {
            setError(`Demo limited to 100 lines. Your code has ${lines} lines.`)
            return
        }

        setIsReviewing(true)
        setError(null)
        setResult(null)

        try {
            const response = await fetch('http://localhost:3001/api/code-review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, language })
            })

            const data = await response.json()

            if (data.success) {
                setResult(data)
            } else {
                setError(data.error || 'Review failed')
            }
        } catch {
            setError('Code review service unavailable. Please try again.')
        } finally {
            setIsReviewing(false)
        }
    }

    const getScoreColor = (score: number) => {
        if (score >= 90) return '#22c55e'
        if (score >= 70) return '#eab308'
        if (score >= 50) return '#f97316'
        return '#ef4444'
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return '#ef4444'
            case 'warning': return '#f97316'
            default: return '#3b82f6'
        }
    }

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'critical': return <AlertCircle size={16} />
            case 'warning': return <AlertTriangle size={16} />
            default: return <Lightbulb size={16} />
        }
    }

    return (
        <div className="demos-page">
            <header className="demos-header">
                <Link to="/demos" className="demos-back">
                    <ArrowLeft size={20} />
                    <span>Back to Demos</span>
                </Link>
                <h1>Code Health Check</h1>
                <p>AI-powered code review in seconds</p>
            </header>

            <div className="demos-content">
                <motion.div
                    className="demo-panel code-review-panel"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="code-review-inner">
                        <div className="code-input-section">
                            <div className="code-header">
                                <h3>Paste your code</h3>
                                <div className="language-select">
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                    >
                                        <option value="javascript">JavaScript</option>
                                        <option value="typescript">TypeScript</option>
                                        <option value="python">Python</option>
                                        <option value="java">Java</option>
                                        <option value="c#">C#</option>
                                        <option value="go">Go</option>
                                        <option value="rust">Rust</option>
                                        <option value="php">PHP</option>
                                    </select>
                                </div>
                            </div>

                            <textarea
                                className="code-textarea"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="// Paste your code here (max 100 lines for demo)..."
                                spellCheck={false}
                            />

                            <div className="code-footer">
                                <span className="line-count">
                                    {code.split('\n').length} / 100 lines
                                </span>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleReview}
                                    disabled={isReviewing}
                                >
                                    {isReviewing ? 'Analyzing...' : 'Review Code'}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="scanner-error">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        {isReviewing && (
                            <div className="scanner-loading">
                                <div className="scanner-spinner"></div>
                                <p>AI is analyzing your code...</p>
                            </div>
                        )}

                        {result && (
                            <motion.div
                                className="code-review-results"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="review-header">
                                    <div className="review-score">
                                        <span
                                            className="score-value"
                                            style={{ color: getScoreColor(result.score) }}
                                        >
                                            {result.score}
                                        </span>
                                        <span className="score-max">/ 100</span>
                                    </div>
                                    <p className="review-summary">{result.summary}</p>
                                </div>

                                {result.highlights.length > 0 && (
                                    <div className="review-highlights">
                                        <h4><CheckCircle size={16} /> What's Good</h4>
                                        <ul>
                                            {result.highlights.map((h, i) => (
                                                <li key={i}>{h}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="review-issues">
                                    <h4>Issues Found ({result.totalIssues})</h4>
                                    {result.issues.map((issue, i) => (
                                        <div
                                            key={i}
                                            className="review-issue"
                                            style={{ borderLeftColor: getSeverityColor(issue.severity) }}
                                        >
                                            <div className="issue-header">
                                                <span
                                                    className="issue-badge"
                                                    style={{
                                                        backgroundColor: getSeverityColor(issue.severity),
                                                        color: 'white'
                                                    }}
                                                >
                                                    {getSeverityIcon(issue.severity)}
                                                    {issue.severity.toUpperCase()}
                                                </span>
                                                {issue.line && (
                                                    <span className="issue-line">Line {issue.line}</span>
                                                )}
                                            </div>
                                            <h5 className="issue-title">{issue.title}</h5>
                                            <p className="issue-description">{issue.description}</p>
                                        </div>
                                    ))}

                                    {result.hasMore && (
                                        <div className="review-issue issue-blur">
                                            <p>+ {result.totalIssues - 3} more issues...</p>
                                        </div>
                                    )}
                                </div>

                                <div className="scanner-cta">
                                    <p>Get the full code review with detailed fixes and best practices.</p>
                                    <Link to="/#contact" className="btn btn-primary">Get Full Review</Link>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
