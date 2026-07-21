"use client";

import React, { useState, useEffect } from 'react';
import './ArgusShowcase.css';

const SIMULATION_STEPS = [
  { agent: 'PLANNER', text: 'Analyzing request: "Automate invoice validation"...', color: 'var(--color-cyan)', node: 'planner', edge: null },
  { agent: 'CODER', text: 'Generating Python extraction script...', color: 'var(--color-blue)', node: 'coder', edge: 'planner-coder' },
  { agent: 'REVIEWER', text: 'Warning: Missing JSON schema validation. Routing back to Coder.', color: 'var(--color-yellow)', node: 'reviewer', edge: 'coder-reviewer' },
  { agent: 'CODER', text: 'Updating script with Pydantic validation...', color: 'var(--color-blue)', node: 'coder', edge: 'reviewer-coder' },
  { agent: 'REVIEWER', text: 'Validation passed. Confidence: 99%.', color: 'var(--color-green)', node: 'reviewer', edge: 'coder-reviewer' },
  { agent: 'DEPLOYER', text: 'Pipeline ready for production.', color: 'var(--color-green)', node: 'deployer', edge: 'reviewer-deployer' }
];

export default function ArgusShowcase() {
  const [lines, setLines] = useState<{ agent: string; text: string; color: string; node: string; edge: string | null; }[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [activeEdge, setActiveEdge] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const runSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setLines([]);
    setActiveNode(null);
    setActiveEdge(null);

    SIMULATION_STEPS.forEach((step, index) => {
      setTimeout(() => {
        setLines(prev => [...prev, step]);
        setActiveNode(step.node);
        setActiveEdge(step.edge);
        
        if (index === SIMULATION_STEPS.length - 1) {
          setTimeout(() => setIsRunning(false), 1500);
        }
      }, index * 1200);
    });
  };

  return (
    <div className="argus-showcase">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">Argus: Multi-Agent Coordination Framework</h1>
        <p className="text-slate-400 mt-2">Watch the multi-agent reasoning loop in real-time execution.</p>
      </div>

      {/* FEATURE 1 & 2 CONTAINER */}
      <div className="showcase-grid">
        
        {/* FEATURE 1: Live Simulation Console */}
        <div className="feature-card">
          <div className="card-header">
            <h3>Live Execution Console</h3>
            <button className="run-btn" onClick={runSimulation} disabled={isRunning}>
              {isRunning ? 'Simulation Active...' : '▶ Run Demo'}
            </button>
          </div>
          <div className="terminal-window">
            <div className="term-controls">
              <span className="term-dot red"></span>
              <span className="term-dot yellow"></span>
              <span className="term-dot green"></span>
            </div>
            <div className="term-content">
              {lines.map((line, i) => (
                <div key={i} className="term-line typing-effect mb-2">
                  <span style={{ color: line.color, fontWeight: 'bold' }}>[{line.agent}]</span> {line.text}
                </div>
              ))}
              {isRunning && <div className="term-cursor">_</div>}
            </div>
          </div>
        </div>

        {/* FEATURE 2: Dynamic Architecture Graph */}
        <div className="feature-card">
          <h3>Multi-Agent Topology</h3>
          <div className="graph-container">
            <svg className="graph-edges">
              <line x1="50%" y1="15%" x2="20%" y2="50%" 
                    className={`edge ${activeEdge === 'planner-coder' ? 'active-forward' : ''}`} />
              <line x1="20%" y1="50%" x2="80%" y2="50%" 
                    className={`edge ${activeEdge === 'coder-reviewer' ? 'active-forward' : activeEdge === 'reviewer-coder' ? 'active-reverse' : ''}`} />
              <line x1="80%" y1="50%" x2="50%" y2="85%" 
                    className={`edge ${activeEdge === 'reviewer-deployer' ? 'active-forward' : ''}`} />
            </svg>
            
            <div className={`node planner ${activeNode === 'planner' ? 'active' : ''}`}>Planner</div>
            <div className={`node coder ${activeNode === 'coder' ? 'active' : ''}`}>Coder</div>
            <div className={`node reviewer ${activeNode === 'reviewer' ? 'active' : ''}`}>Reviewer</div>
            <div className={`node deployer ${activeNode === 'deployer' ? 'active' : ''}`}>Deployer</div>
          </div>
        </div>

      </div>

      {/* FEATURE 3: Before vs After ROI Toggle */}
      <div className="feature-card mt-8">
        <h3>Performance ROI Impact</h3>
        <div className="roi-grid">
          <div className="roi-card standard">
            <div className="roi-header">Standard LLM Implementation</div>
            <ul className="roi-list">
              <li>❌ Single zero-shot prompt execution</li>
              <li>❌ ~40% hallucination/failure rate</li>
              <li>❌ Manual human review strictly required</li>
              <li>❌ Rigid, non-correcting pipelines</li>
            </ul>
          </div>
          <div className="roi-card argus">
            <div className="roi-header glowing-text">Argus Multi-Agent Framework</div>
            <ul className="roi-list">
              <li>✅ Cyclic multi-agent reasoning loop</li>
              <li>✅ Automated self-correction & evaluation</li>
              <li>✅ 99.8% validated output accuracy</li>
              <li>✅ Zero-touch autonomous deployments</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FEATURE 4: Peek Under the Hood Modal Trigger */}
      <div className="footer-actions">
        <button className="code-btn" onClick={() => setIsModalOpen(true)}>
           View LangGraph Routing Code
        </button>
      </div>

      {/* Peek Under the Hood Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Core LangGraph Router</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <pre className="code-block">
              <code>{`from langgraph.graph import StateGraph, END
from typing import TypedDict

class AgentState(TypedDict):
    task: str
    code: str
    confidence: float
    feedback: str

def router(state: AgentState):
    """
    Evaluates state to determine the next agent in the loop.
    This enables dynamic, cyclic multi-agent coordination.
    """
    if state.get("confidence", 0) > 0.95:
        return "deployer"
    elif state.get("feedback"):
        return "coder"
    else:
        return "reviewer"

# Graph Construction
workflow = StateGraph(AgentState)
workflow.add_node("planner", planner_agent)
workflow.add_node("coder", coder_agent)
workflow.add_node("reviewer", reviewer_agent)
workflow.add_node("deployer", deployer_agent)

workflow.add_edge("planner", "coder")
workflow.add_edge("coder", "reviewer")
workflow.add_conditional_edges("reviewer", router)
workflow.add_edge("deployer", END)

app = workflow.compile()
`}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
