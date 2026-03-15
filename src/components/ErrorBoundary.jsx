import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("App crashed:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, maxWidth: 500, margin: "60px auto", textAlign: "center", fontFamily: "system-ui" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>😿</div>
          <h1 style={{ fontSize: 20, marginBottom: 8, color: "#333" }}>Something went wrong</h1>
          <p style={{ fontSize: 14, color: "#666", marginBottom: 20 }}>
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.href = "/";
            }}
            style={{
              padding: "10px 24px", fontSize: 14, fontWeight: 600,
              background: "#6C5CE7", color: "#fff", border: "none",
              borderRadius: 8, cursor: "pointer",
            }}
          >
            Go Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
