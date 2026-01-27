import { X, Download, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePdfViewer } from './PdfViewerContext';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

export function PdfViewerModal() {
  const { currentPdf, isOpen, closePdf } = usePdfViewer();
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  if (!currentPdf || !isOpen) return null;

  const handleDownload = () => {
    // Open in new tab for download
    window.open(currentPdf.url, '_blank');
  };

  const handleOpenExternal = () => {
    window.open(currentPdf.url, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-in fade-in-0"
      onClick={closePdf}
    >
      <div 
        className="fixed inset-4 md:inset-8 lg:inset-12 bg-card rounded-2xl shadow-2xl border border-border flex flex-col animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50 rounded-t-2xl">
          <div className="flex items-center gap-3 min-w-0">
            {currentPdf.coverUrl && (
              <img
                src={currentPdf.coverUrl}
                alt={currentPdf.title}
                className="w-8 h-10 rounded object-cover flex-shrink-0"
              />
            )}
            <h2 className="font-display font-semibold text-foreground truncate">
              {currentPdf.title}
            </h2>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="hidden sm:flex"
            >
              <Download className="h-4 w-4 mr-2" />
              Pobierz
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleOpenExternal}
              title="Otwórz w nowej karcie"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={closePdf}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 min-h-0 bg-muted/30 rounded-b-2xl overflow-hidden">
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer
              fileUrl={currentPdf.url}
              plugins={[defaultLayoutPluginInstance]}
              renderLoader={(percentages: number) => (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Ładowanie PDF... {Math.round(percentages)}%
                  </p>
                </div>
              )}
            />
          </Worker>
        </div>
      </div>
    </div>
  );
}
