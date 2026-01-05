import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import '../App.css'

export default function CloudIDEPage() {
    return (
        <div className="ide-page">
            {/* Header */}
            <header className="ide-header">
                <div className="ide-logo">
                    <span className="logo-auto">Auto</span>
                    <span className="logo-minds">minds</span>
                    <span className="ide-badge">CLOUD IDE</span>
                </div>
                <nav className="ide-nav">
                    <div className="ide-controls">
                        <button
                            onClick={() => window.open('https://try.autominds.org', '_blank')}
                            className="ide-control-btn mobile-only"
                            title="Open in new tab (Best for Mobile)"
                        >
                            <span className="btn-icon">↗</span>
                            <span className="btn-text">Open App</span>
                        </button>
                    </div>
                    <Link to="/" className="ide-back-btn">
                        <ArrowLeft size={16} />
                        <span>Back</span>
                    </Link>
                </nav>
            </header>

            {/* IDE Embed for Desktop */}
            <motion.div
                className="ide-embed desktop-only"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <iframe
                    src="https://try.autominds.org"
                    title="Autominds Cloud IDE"
                    className="ide-frame"
                    allow="clipboard-read; clipboard-write"
                />
            </motion.div>

            {/* Mobile Launch Card */}
            <div className="mobile-ide-launch mobile-only">
                <div className="mobile-launch-card">
                    <div className="mobile-launch-icon">📱</div>
                    <h2>Mobile IDE Experience</h2>
                    <p>For the best experience on mobile, we recommend launching the IDE in a dedicated tab.</p>
                    <button
                        onClick={() => window.open('https://try.autominds.org', '_blank')}
                        className="btn btn-primary btn-large"
                    >
                        Launch App
                    </button>
                </div>
            </div>
        </div>
    )
}
