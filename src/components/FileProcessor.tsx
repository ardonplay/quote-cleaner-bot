import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Download, FileText, Check } from "lucide-react";
import { toast } from "sonner";

export const FileProcessor = () => {
  const [originalContent, setOriginalContent] = useState<string>("");
  const [processedContent, setProcessedContent] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [isProcessed, setIsProcessed] = useState(false);

  const processLine = (line: string): string => {
    let processed = line;
    
    // Remove leading and trailing quotes
    if (processed.startsWith('"')) {
      processed = processed.substring(1);
    }
    if (processed.endsWith('"')) {
      processed = processed.substring(0, processed.length - 1);
    }
    
    // Replace double quotes in the middle with single quote
    processed = processed.replace(/""/g, '"');
    
    return processed;
  };

  const processFile = (content: string) => {
    const lines = content.split('\n');
    const processedLines = lines.map(processLine);
    const processed = processedLines.join('\n');
    
    setProcessedContent(processed);
    setIsProcessed(true);
    toast.success("File processed successfully!");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setOriginalContent(content);
      processFile(content);
    };
    
    reader.readAsText(file);
  };

  const handleDownload = () => {
    const blob = new Blob([processedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `processed_${fileName}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("File downloaded!");
  };

  const getLineCount = (content: string) => {
    return content ? content.split('\n').length : 0;
  };

  return (
    <div className="min-h-screen bg-[var(--gradient-subtle)] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="text-center space-y-2 py-8">
          <h1 className="text-4xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent">
            Quote Remover Tool
          </h1>
          <p className="text-muted-foreground text-lg">
            Remove quotes from the beginning and end of lines, and clean up double quotes
          </p>
        </header>

        <Card className="p-8 shadow-[var(--shadow-card)]">
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-primary rounded-lg p-12 bg-primary/5 hover:bg-primary/10 transition-colors">
              <Upload className="h-16 w-16 text-primary mb-4" />
              <p className="text-lg font-semibold mb-4">Загрузите .txt файл для обработки</p>
              <label htmlFor="file-upload" className="cursor-pointer">
                <Button variant="default" size="lg" className="bg-[var(--gradient-primary)]" asChild>
                  <span>
                    <FileText className="mr-2 h-5 w-5" />
                    Выбрать файл
                  </span>
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {fileName && (
                <p className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  {fileName}
                </p>
              )}
            </div>

            {isProcessed && (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      Original
                      <span className="text-xs text-muted-foreground">
                        ({getLineCount(originalContent)} lines)
                      </span>
                    </h3>
                    <div className="bg-secondary rounded-lg p-4 h-96 overflow-auto font-mono text-sm">
                      <pre className="whitespace-pre-wrap break-all">{originalContent.slice(0, 5000)}</pre>
                      {originalContent.length > 5000 && (
                        <p className="text-muted-foreground text-xs mt-2">... (showing first 5000 characters)</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      Processed
                      <span className="text-xs text-muted-foreground">
                        ({getLineCount(processedContent)} lines)
                      </span>
                    </h3>
                    <div className="bg-secondary rounded-lg p-4 h-96 overflow-auto font-mono text-sm">
                      <pre className="whitespace-pre-wrap break-all">{processedContent.slice(0, 5000)}</pre>
                      {processedContent.length > 5000 && (
                        <p className="text-muted-foreground text-xs mt-2">... (showing first 5000 characters)</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <Button 
                    onClick={handleDownload}
                    size="lg"
                    className="bg-[var(--gradient-primary)] shadow-[var(--shadow-soft)] text-lg px-8 py-6"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Скачать обработанный файл
                  </Button>
                </div>
              </>
            )}
          </div>
        </Card>

        <Card className="p-6 shadow-[var(--shadow-card)]">
          <h3 className="font-semibold mb-3">How it works:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Removes double quotes (") from the beginning of each line</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Removes double quotes (") from the end of each line</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>If two consecutive quotes ("") appear in the middle of a line, removes one</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};
