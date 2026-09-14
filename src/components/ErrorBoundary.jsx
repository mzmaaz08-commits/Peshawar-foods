import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0b0e] text-white flex items-center justify-center p-6">
          <div className="max-w-xl w-full bg-[#18181c] border border-amber-500/30 p-8 rounded-3xl text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 text-[#c5a059] flex items-center justify-center mx-auto text-2xl font-bold">
              ⚠️
            </div>
            <h2 className="font-serif text-2xl font-bold text-amber-400">Peshawar Foods & Shinwari Explorer</h2>
            
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-left text-xs font-mono text-red-200 overflow-auto max-h-48 space-y-2">
              <p className="font-bold text-red-400">Error: {this.state.error?.toString()}</p>
              {this.state.errorInfo?.componentStack && (
                <pre className="text-[10px] text-red-300 opacity-80 whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>

            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-full bg-[#c5a059] text-[#0b0b0e] font-bold text-xs uppercase tracking-wider hover:brightness-110 transition"
            >
              Reload App
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
