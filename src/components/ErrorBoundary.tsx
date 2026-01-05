import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback !== undefined) {
                return this.props.fallback;
            }
            return (
                <div style={{ padding: "2rem", color: "white", background: "#0a0a0a", minHeight: "100vh", fontFamily: "system-ui" }}>
                    <h1>Something went wrong.</h1>
                    <p>Please send this error to support:</p>
                    <pre style={{ color: "#ef4444", background: "rgba(255,0,0,0.1)", padding: "1rem", overflow: "auto" }}>
                        {this.state.error?.toString()}
                    </pre>
                </div>
            );
        }

        return this.props.children;
    }
}
