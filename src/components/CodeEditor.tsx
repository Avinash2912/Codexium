import { CODING_QUESTIONS, LANGUAGES } from "@/constants";
import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertCircleIcon, BookIcon, LightbulbIcon } from "lucide-react";
import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";
// Update imports at the top
import { Download, Maximize, Minimize } from "lucide-react";

function CodeEditor() {
  const [selectedQuestion, setSelectedQuestion] = useState(CODING_QUESTIONS[0]);
  const [language, setLanguage] = useState<"javascript" | "python" | "java">(LANGUAGES[0].id);
  const [code, setCode] = useState(selectedQuestion.starterCode[language]);
  const [fontSize, setFontSize] = useState(14);
  // Change default state to false
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  // Add state for full screen
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const handleQuestionChange = (questionId: string) => {
    const question = CODING_QUESTIONS.find((q) => q.id === questionId)!;
    setSelectedQuestion(question);
    setCode(question.starterCode[language]);
  };

  const handleLanguageChange = (newLanguage: "javascript" | "python" | "java") => {
    setLanguage(newLanguage);
    setCode(selectedQuestion.starterCode[newLanguage]);
  };

  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 2, 30));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 12));

  const handleDownload = () => {
    const fileExtension = {
      javascript: "js",
      python: "py",
      java: "java"
    }[language];
    
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `solution.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Add full screen handler
  const toggleFullScreen = () => setIsFullScreen(prev => !prev);

  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-4rem-1px)]">
      {/* Question Panel */}
      <ResizablePanel defaultSize={50} minSize={30} className={isFullScreen ? 'hidden' : ''}>
        <ScrollArea className="h-full bg-[#0F1117]">
          <div className="p-4">
            <div className="space-y-4 max-w-[800px] mx-auto">
              {/* Question Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#4c2b3d] p-4 rounded-lg border border-[#313131]">
                <h2 className="text-xl font-medium text-green-400 break-words">
                  {selectedQuestion.title}
                </h2>
                <Select value={selectedQuestion.id} onValueChange={handleQuestionChange}>
                  <SelectTrigger className="w-[180px] shrink-0 bg-[#2A2A2A] border-[#313131]">
                    <SelectValue placeholder="Select question" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2A2A2A] border-[#313131]">
                    {CODING_QUESTIONS.map((q) => (
                      <SelectItem key={q.id} value={q.id}>
                        {q.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Problem Description */}
              <div className="bg-[#1E1E1E] rounded-lg border border-[#313131] p-4">
                <h3 className="text-sm font-medium text-orange-300 mb-3">Problem Description</h3>
                <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-300 overflow-x-auto">
                  <p className="whitespace-pre-line break-words">{selectedQuestion.description}</p>
                </div>
              </div>

              {/* Examples */}
              <div className="bg-[#1E1E1E] rounded-lg border border-[#313131] p-4">
                <h3 className="text-sm font-medium text-blue-400 mb-3">Examples</h3>
                <div className="space-y-4">
                  {selectedQuestion.examples.map((example, index) => (
                    <div key={index} className="bg-[#2A2A2A] rounded-lg p-4 overflow-x-auto">
                      <p className="text-sm font-medium text-zinc-300 mb-2">Example {index + 1}:</p>
                      <div className="font-mono text-sm space-y-1">
                        <pre className="text-zinc-300 whitespace-pre-wrap break-words">{example.input}</pre>
                        <pre className="text-[#2CBB5D] whitespace-pre-wrap break-words">{example.output}</pre>
                        {example.explanation && (
                          <pre className="text-zinc-400 mt-2 font-sans whitespace-pre-wrap break-words">
                            {example.explanation}
                          </pre>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Constraints */}
              {selectedQuestion.constraints && (
                <div className="bg-[#1E1E1E] rounded-lg border border-[#313131] p-4">
                  <h3 className="text-sm font-medium text-zinc-300 mb-3">Constraints</h3>
                  <ul className="space-y-1.5 text-sm text-zinc-400">
                    {selectedQuestion.constraints.map((constraint, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-[#509b6a] mt-2 shrink-0" />
                        <span className="break-words">{constraint}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <ScrollBar />
        </ScrollArea>
      </ResizablePanel>

      {/* Editor Panel */}
      <ResizableHandle withHandle className={`bg-[#313131] hover:bg-[#2CBB5D] transition-colors ${isFullScreen ? 'hidden' : ''}`} />
      <ResizablePanel defaultSize={50} className={isFullScreen ? 'w-full max-w-[1600px] mx-auto' : ''}>
        <div className="h-full flex flex-col bg-[#1E1E1E]">
          {/* Editor Controls */}
          <div className="flex items-center justify-between p-2 border-b border-[#313131]">
            <div className="flex items-center gap-2">
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[110px] bg-[#408b23] border-[#313131]">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      {LANGUAGES.find((l) => l.id === language)?.name}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-[#894c4f] border-[#280505]">
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.id} value={lang.id}>
                      <div className="flex items-center gap-2">
                        {lang.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2 bg-[#2A2A2A] rounded-md border border-[#313131] px-2">
                <button onClick={decreaseFontSize} className="text-zinc-400 hover:text-zinc-200 p-1">-</button>
                <span className="text-zinc-300 text-sm w-6 text-center">{fontSize}</span>
                <button onClick={increaseFontSize} className="text-zinc-400 hover:text-zinc-200 p-1">+</button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.button 
                onClick={handleDownload} 
                className="flex items-center gap-2 bg-blue-800 hover:bg-green-800 text-zinc-300 px-2.5 py-1.5 rounded-md border border-[#313131] text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={12} /> Download Code
              </motion.button>
              <motion.button 
                onClick={toggleFullScreen} 
                className={`
                  flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm
                  ${isFullScreen 
                    ? 'bg-gradient-to-r from-green-100/20 to-green-900/20 hover:from-green-500/30 hover:to-green-500/30' 
                    : 'bg-gradient-to-r from-green-900/10 to-green-900/10 hover:from-green-500/20 hover:to-green-500/20'
                  }
                  border border-[#414141] hover:border-[#515151]
                  text-zinc-200 transition-all duration-300
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={false}
                animate={{
                  rotate: isFullScreen ? 180 : 0
                }}
                transition={{ duration: 0.3 }}
              > 
                {isFullScreen ? <Minimize size={16} /> : <Maximize size={16} />}
              </motion.button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage={language}
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: fontSize,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
                wordWrap: "on",
                fontFamily: "JetBrains Mono, monospace",
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
              }}
            />
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
export default CodeEditor;











