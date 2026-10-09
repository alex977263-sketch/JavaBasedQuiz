import React, { useState } from 'react';
import {
  Code2,
  FolderTree,
  FileCode,
  Copy,
  Check,
  Terminal,
  Database,
  ShieldCheck,
  Server,
  Layers,
  Sparkles,
  Download,
  Info,
} from 'lucide-react';
import { SPRING_BOOT_PROJECT_FILES, SpringBootFile } from '../data/springBootCodebase';

export const SpringBootExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<SpringBootFile>(SPRING_BOOT_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredFiles = SPRING_BOOT_PROJECT_FILES.filter((f) => {
    if (selectedCategory === 'ALL') return true;
    return f.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Full-Stack Java Architecture Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Spring Boot & MySQL Backend Repository
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Explore the complete Maven project: Spring Security stateless JWT, JPA/Hibernate entities, MySQL relational schemas, transactional REST services, and JUnit 5 test suites.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Active File'}</span>
          </button>
        </div>
      </div>

      {/* Quick Architecture Architecture Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Spring Boot 3.2.x</div>
            <div className="text-[11px] text-slate-500">Java 17, Web MVC, REST</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Spring Security 6</div>
            <div className="text-[11px] text-slate-500">BCrypt + Stateless JWT</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">MySQL & JPA</div>
            <div className="text-[11px] text-slate-500">Hibernate, HikariCP, DDL</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Apache Maven</div>
            <div className="text-[11px] text-slate-500">JUnit 5 & Mockito Tests</div>
          </div>
        </div>
      </div>

      {/* Main File Explorer Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[650px]">
        {/* Left File Tree Sidebar (4 cols) */}
        <div className="lg:col-span-4 border-r border-slate-200 bg-slate-50/50 flex flex-col">
          {/* Category Filter */}
          <div className="p-3 border-b border-slate-200 bg-white">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Filter by Component
            </div>
            <div className="flex flex-wrap gap-1 text-[11px]">
              {['ALL', 'config', 'entity', 'controller', 'service', 'security', 'sql', 'test'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-1 rounded transition-colors ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Files List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-slate-500" />
              <span>Project Files ({filteredFiles.length})</span>
            </div>

            {filteredFiles.map((file) => {
              const isSelected = selectedFile.path === file.path;

              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-colors flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs font-semibold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <FileCode className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-mono">{file.name}</div>
                    <div className={`text-[10px] truncate ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                      {file.path}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Code Display Pane (8 cols) */}
        <div className="lg:col-span-8 flex flex-col bg-slate-950 text-slate-100">
          {/* File Header Bar */}
          <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-mono text-xs font-bold text-blue-300 flex items-center gap-2">
                <span>{selectedFile.path}</span>
                <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 uppercase">
                  {selectedFile.language}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{selectedFile.description}</p>
            </div>

            <button
              onClick={handleCopyCode}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              title="Copy code"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Code Viewer with Line Numbers */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed max-h-[600px]">
            <pre className="text-slate-200">
              <code>{selectedFile.content}</code>
            </pre>
          </div>

          {/* Quick Terminal Command Tip */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 text-xs flex items-center justify-between text-slate-400 font-mono">
            <span className="truncate">mvn spring-boot:run</span>
            <span className="text-[11px] text-emerald-400 font-sans">
              Context Path: /api/v1
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
