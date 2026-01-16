
import React, { useState, useCallback } from 'react';
import { BookOpen, Send, GraduationCap, ChevronRight, AlertCircle, CheckCircle2, RefreshCw, ClipboardCopy } from 'lucide-react';
import { analyzeComposition } from './services/geminiService';
import { CompositionAnalysis, FeedbackCategory } from './types';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<CompositionAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeComposition(inputText);
      setAnalysis(result);
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError('Even the best scholars encounter technical difficulties. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Simple feedback could be added here
  };

  const reset = () => {
    setAnalysis(null);
    setInputText('');
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-slate-900 text-white py-12 px-6 shadow-xl border-b-4 border-amber-600">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-600 rounded-lg">
              <GraduationCap size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold serif tracking-tight">Professor minchingwu</h1>
              <p className="text-amber-200 uppercase tracking-widest text-xs font-semibold mt-1">
                Elite English Composition Critique
              </p>
            </div>
          </div>
          <div className="text-center md:text-right italic text-slate-400 max-w-xs">
            "Mediocrity is the silent killer of academic excellence."
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-12 space-y-12">
        {/* Input Section */}
        <section className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
            <BookOpen size={20} className="text-slate-600" />
            <span className="font-semibold text-slate-800">Submit Your Composition</span>
          </div>
          <div className="p-6">
            <textarea
              className="w-full h-64 p-4 text-lg border-2 border-slate-100 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none font-serif text-slate-800"
              placeholder="Paste your essay or paragraph here for a thorough academic teardown..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isAnalyzing}
            />
            <div className="mt-4 flex justify-between items-center">
              <p className="text-slate-400 text-sm">
                Word Count: {inputText.split(/\s+/).filter(x => x).length}
              </p>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !inputText.trim()}
                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold transition-all shadow-lg ${
                  isAnalyzing || !inputText.trim()
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-amber-600 hover:bg-amber-700 text-white transform hover:-translate-y-1'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="animate-spin" size={20} />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Submit to Professor
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center gap-3">
            <AlertCircle className="text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Results Section */}
        {analysis && (
          <div id="results-section" className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
            {/* Score & Summary */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3 bg-slate-900 text-white p-8 rounded-xl flex flex-col items-center justify-center text-center shadow-xl border-t-4 border-amber-600">
                <span className="text-slate-400 uppercase tracking-widest text-xs font-bold mb-2">Final Grade</span>
                <div className="text-7xl font-bold serif mb-4 text-amber-500">{analysis.overallScore}</div>
                <div className="h-2 w-full bg-slate-800 rounded-full mb-6">
                  <div 
                    className="h-full bg-amber-600 rounded-full transition-all duration-1000" 
                    style={{ width: `${analysis.overallScore}%` }}
                  />
                </div>
                <p className="italic text-slate-300 leading-relaxed font-serif">
                  "{analysis.overallEvaluation}"
                </p>
              </div>

              <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Fixed TypeScript error by casting entries to [string, FeedbackCategory][] */}
                {(Object.entries(analysis.categories) as [string, FeedbackCategory][]).map(([key, cat]) => (
                  <div key={key} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-slate-900 font-bold mb-2 flex items-center justify-between">
                      {cat.title}
                      <CheckCircle2 size={16} className="text-amber-600" />
                    </h3>
                    <p className="text-slate-600 text-sm mb-3 line-clamp-3 italic">"{cat.critique}"</p>
                    <div className="space-y-1">
                      {cat.suggestions.slice(0, 2).map((s, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-500">
                          <ChevronRight size={12} className="mt-0.5 text-amber-500 shrink-0" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Critique Details */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold serif text-slate-800 flex items-center gap-2">
                <span className="w-8 h-8 bg-slate-800 text-white flex items-center justify-center rounded-full text-sm">01</span>
                The Critique
              </h2>
              <div className="space-y-4">
                {/* Fixed TypeScript error by casting entries to [string, FeedbackCategory][] */}
                {(Object.entries(analysis.categories) as [string, FeedbackCategory][]).map(([key, cat]) => (
                  <details key={key} className="group bg-white border border-slate-200 rounded-lg overflow-hidden" open={key === 'grammar'}>
                    <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors list-none">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${analysis.overallScore > 80 ? 'bg-green-500' : 'bg-amber-500'}`} />
                        <span className="font-bold text-slate-700">{cat.title}</span>
                      </div>
                      <ChevronRight className="group-open:rotate-90 transition-transform text-slate-400" size={20} />
                    </summary>
                    <div className="p-4 pt-0 text-slate-600 border-t border-slate-50">
                      <p className="mb-4 leading-relaxed bg-slate-50 p-3 rounded italic">Professor's Comment: {cat.critique}</p>
                      <h4 className="font-semibold text-slate-800 mb-2 text-sm uppercase tracking-wider">Actionable Steps:</h4>
                      <ul className="space-y-2">
                        {cat.suggestions.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm">
                            <span className="text-amber-600 font-bold mt-0.5">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* Revised Version */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold serif text-slate-800 flex items-center gap-2">
                <span className="w-8 h-8 bg-slate-800 text-white flex items-center justify-center rounded-full text-sm">02</span>
                The Gold Standard
              </h2>
              <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl relative">
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => copyToClipboard(analysis.revisedVersion)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors"
                    title="Copy to clipboard"
                  >
                    <ClipboardCopy size={18} />
                  </button>
                </div>
                <div className="bg-slate-800 px-6 py-3 border-b border-slate-700 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-widest ml-4">revised_composition.md</span>
                </div>
                <div className="p-8 text-slate-300 font-serif text-lg leading-relaxed whitespace-pre-wrap">
                  {analysis.revisedVersion}
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="flex justify-center pt-8">
              <button 
                onClick={reset}
                className="px-10 py-4 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 transition-all flex items-center gap-2 shadow-lg"
              >
                <RefreshCw size={20} />
                Try Another Piece
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Floating UI Elements */}
      {!analysis && !isAnalyzing && (
        <div className="fixed bottom-8 right-8 animate-bounce hidden md:block">
          <div className="bg-white p-4 rounded-2xl shadow-2xl border border-slate-200 max-w-xs">
            <p className="text-sm text-slate-600">
              "Words have meaning. Use them with intent or do not use them at all."
              <br />
              <span className="font-bold text-slate-800 block mt-2">— Prof. minchingwu</span>
            </p>
          </div>
        </div>
      )}

      <footer className="mt-20 py-8 border-t border-slate-200 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} minchingwu Academic Institute. Pursuit of Perfection.</p>
      </footer>
    </div>
  );
};

export default App;
