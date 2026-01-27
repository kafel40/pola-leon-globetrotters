import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface PdfDocument {
  id: string;
  title: string;
  url: string;
  coverUrl?: string;
}

interface PdfViewerContextType {
  currentPdf: PdfDocument | null;
  isOpen: boolean;
  openPdf: (pdf: PdfDocument) => void;
  closePdf: () => void;
}

const PdfViewerContext = createContext<PdfViewerContextType | null>(null);

export function PdfViewerProvider({ children }: { children: ReactNode }) {
  const [currentPdf, setCurrentPdf] = useState<PdfDocument | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openPdf = (pdf: PdfDocument) => {
    setCurrentPdf(pdf);
    setIsOpen(true);
  };

  const closePdf = () => {
    setIsOpen(false);
    // Delay clearing the PDF to allow for close animation
    setTimeout(() => {
      setCurrentPdf(null);
    }, 300);
  };

  return (
    <PdfViewerContext.Provider value={{ currentPdf, isOpen, openPdf, closePdf }}>
      {children}
    </PdfViewerContext.Provider>
  );
}

export function usePdfViewer() {
  const context = useContext(PdfViewerContext);
  if (!context) {
    throw new Error('usePdfViewer must be used within a PdfViewerProvider');
  }
  return context;
}
