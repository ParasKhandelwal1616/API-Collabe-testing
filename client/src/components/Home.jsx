import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Shield, Globe, Code } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-violet-500/30">
      {/* Navbar */}
      <nav className="border-b border-white/5 backdrop-blur-xl bg-black/40 fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">API Forge</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-2 rounded-lg bg-white text-black text-sm font-bold hover:bg-gray-200 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            Now in Public Beta
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Build APIs <br />
            <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Faster Together
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            The collaborative API development platform that helps you design, document, and test APIs with your team in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/register" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-violet-500/25"
            >
              Start Building Free
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#1e1e1e] border border-white/10 text-white font-bold text-lg hover:bg-[#2d2d2d] transition-colors"
            >
              View Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Globe className="text-cyan-400" />}
            title="Global Edge Network"
            description="Test your APIs from multiple regions with our distributed infrastructure."
          />
          <FeatureCard 
            icon={<Shield className="text-violet-400" />}
            title="Enterprise Security"
            description="Bank-grade encryption and role-based access control for your workspaces."
          />
          <FeatureCard 
            icon={<Code className="text-emerald-400" />}
            title="Real-time Sync"
            description="Collaborate with your team in real-time. See changes as they happen."
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 text-center text-gray-500 text-sm">
        <p>&copy; 2026 API Forge. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-6 rounded-2xl bg-[#141414] border border-white/5 hover:border-white/10 transition-colors">
      <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
