import { CODING_QUESTIONS, LANGUAGES } from "@/constants";
import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertCircleIcon, BookIcon, LightbulbIcon } from "lucide-react";
import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";

function CodeEditor() {
  const [selectedQuestion, setSelectedQuestion] = useState(CODING_QUESTIONS[0]);
  const [language, setLanguage] = useState<"javascript" | "python" | "java">(LANGUAGES[0].id);
  const [code, setCode] = useState(selectedQuestion.starterCode[language]);

  const handleQuestionChange = (questionId: string) => {
    const question = CODING_QUESTIONS.find((q) => q.id === questionId)!;
    setSelectedQuestion(question);
    setCode(question.starterCode[language]);
  };

  const handleLanguageChange = (newLanguage: "javascript" | "python" | "java") => {
    setLanguage(newLanguage);
    setCode(selectedQuestion.starterCode[newLanguage]);
  };

  return (
    <ResizablePanelGroup direction="vertical" className="min-h-[calc(100vh-4rem-1px)]">
      {/* QUESTION SECTION */}
      <ResizablePanel>
        <ScrollArea className="h-full bg-white/50 dark:bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6"
          >
            <div className="max-w-4xl mx-auto space-y-6">
              {/* HEADER */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/50 dark:bg-black/50 p-4 rounded-xl backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      {selectedQuestion.title}
                    </h2>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-300 text-sm">
                    Choose your language and solve the problem
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Select value={selectedQuestion.id} onValueChange={handleQuestionChange}>
                    <SelectTrigger className="w-full sm:w-[180px] backdrop-blur-md">
                      <SelectValue placeholder="Select question" />
                    </SelectTrigger>
                    <SelectContent className="backdrop-blur-md">
                      {CODING_QUESTIONS.map((q) => (
                        <SelectItem key={q.id} value={q.id}>
                          {q.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-full sm:w-[150px] backdrop-blur-md">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <img
                            src={`/${language}.png`}
                            alt={language}
                            className="w-5 h-5 object-contain"
                          />
                          {LANGUAGES.find((l) => l.id === language)?.name}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="backdrop-blur-md">
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.id} value={lang.id}>
                          <div className="flex items-center gap-2">
                            <img
                              src={`/${lang.id}.png`}
                              alt={lang.name}
                              className="w-5 h-5 object-contain"
                            />
                            {lang.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>

              {/* Cards with animations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* Problem Description Card */}
                <Card className="mb-6 backdrop-blur-md bg-white/50 dark:bg-black/50 border-zinc-200/50 dark:border-zinc-800/50 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="flex flex-row items-center gap-2">
                    <BookIcon className="h-5 w-5 text-primary/80" />
                    <CardTitle>Problem Description</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-relaxed">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="whitespace-pre-line">{selectedQuestion.description}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* PROBLEM EXAMPLES */}
                <Card>
                  <CardHeader className="flex flex-row items-center gap-2">
                    <LightbulbIcon className="h-5 w-5 text-yellow-500" />
                    <CardTitle>Examples</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-full w-full rounded-md border">
                      <div className="p-4 space-y-4">
                        {selectedQuestion.examples.map((example, index) => (
                          <div key={index} className="space-y-2">
                            <p className="font-medium text-sm">Example {index + 1}:</p>
                            <ScrollArea className="h-full w-full rounded-md">
                              <pre className="bg-muted/50 p-3 rounded-lg text-sm font-mono">
                                <div>Input: {example.input}</div>
                                <div>Output: {example.output}</div>
                                {example.explanation && (
                                  <div className="pt-2 text-muted-foreground">
                                    Explanation: {example.explanation}
                                  </div>
                                )}
                              </pre>
                              <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                          </div>
                        ))}
                      </div>
                      <ScrollBar />
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* CONSTRAINTS */}
                {selectedQuestion.constraints && (
                  <Card className="backdrop-blur-md bg-white/50 dark:bg-black/50 border-zinc-200/50 dark:border-zinc-800/50 shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="flex flex-row items-center gap-2">
                      <AlertCircleIcon className="h-5 w-5 text-blue-500" />
                      <CardTitle>Constraints</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1.5 text-sm marker:text-muted-foreground">
                        {selectedQuestion.constraints.map((constraint, index) => (
                          <li key={index} className="text-muted-foreground">
                            {constraint}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </div>
          </motion.div>
          <ScrollBar />
        </ScrollArea>
      </ResizablePanel>

      <ResizableHandle withHandle className="bg-primary/20 hover:bg-primary/30 transition-colors" />

      {/* CODE EDITOR */}
      <ResizablePanel defaultSize={60} maxSize={100}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="h-full relative bg-[#1e1e1e] rounded-lg overflow-hidden"
        >
          <Editor
            height="100%"
            defaultLanguage={language}
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16, bottom: 16 },
              wordWrap: "on",
              wrappingIndent: "indent",
              fontFamily: "JetBrains Mono, monospace",
              smoothScrolling: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
            }}
            className="rounded-lg"
          />
        </motion.div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
export default CodeEditor;
