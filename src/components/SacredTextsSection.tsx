'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { pdfjs, Document, Page as PdfPage } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, Loader2 } from 'lucide-react';

// Configure react-pdf worker via CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// ─── Constants ────────────────────────────────────────────────────────
const LOAD_WINDOW = 60; // Keep at most ~60 pages in DOM at any time

// ─── Types ────────────────────────────────────────────────────────────
interface Book {
  id: string;
  title: string;
  pdfUrl: string;
}

// ─── useIsMobile Hook ─────────────────────────────────────────────────
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return isMobile;
}

// ─── FlipPage ─────────────────────────────────────────────────────────
// STRICT NESTED ARCHITECTURE:
// - OUTER div: ref for react-pageflip. NO padding. NO Tailwind w-/h-.
// - INNER div: absolutely positioned, handles dynamic spine padding (gutter).
// - PdfPage: forced via CSS to fit perfectly inside the padded inner div.
const FlipPage = React.forwardRef<
  HTMLDivElement,
  { pageNumber: number; width: number; height: number; isLoaded: boolean }
>(({ pageNumber, width, height, isLoaded }, ref) => {
  // Determine if it's a left or right page
  const isLeftPage = pageNumber % 2 === 0;

  // MICRO-MARGINS: Just enough to prevent text from touching the crease
  const spineMargin = 12; // The inner edge (where pages meet)
  const edgeMargin = 20;  // The outer edge of the book
  const verticalMargin = 24; // Top and bottom

  // Apply padding dynamically based on which side the spine is on
  const paddingStyle = isLeftPage
    ? `${verticalMargin}px ${spineMargin}px ${verticalMargin}px ${edgeMargin}px` // Left page: spine is on the right
    : `${verticalMargin}px ${edgeMargin}px ${verticalMargin}px ${spineMargin}px`; // Right page: spine is on the left

  return (
    /* 1. OUTER DIV: Handles flipbook physics & solid paper background */
    <div ref={ref} className="relative overflow-hidden bg-[#fcfaf2]" style={{ width, height }}>
      
      {/* 2. INNER PADDING CONTAINER: Creates the "Safe Zone" */}
      <div className="absolute inset-0" style={{ padding: paddingStyle }}>
        
        {/* 3. FLUID PDF CONTAINER: Forces react-pdf to fill the safe zone perfectly */}
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          {isLoaded ? (
            <PdfPage
              className="w-full h-full flex items-center justify-center [&_canvas]:!w-full [&_canvas]:!h-full [&_canvas]:object-contain shadow-sm"
              pageNumber={pageNumber}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          ) : (
            <Loader2 className="animate-spin text-black/10" size={32} />
          )}
        </div>
      </div>

      {/* 4. TIGHT SPINE CREASE SHADOWS */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_8px_rgba(0,0,0,0.05)]" />
      
      {/* Dynamic crease shadow based on left/right page */}
      {isLeftPage ? (
        <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />
      ) : (
        <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
      )}
    </div>
  );
});
FlipPage.displayName = 'FlipPage';

// ─── BookCoverThumbnail ───────────────────────────────────────────────
// Renders the actual first page of the PDF as a cover thumbnail on the grid.
// Uses CSS stretch classes to force the canvas to fill the card container.
function BookCoverThumbnail({ pdfUrl }: { pdfUrl: string }) {
  return (
    <Document
      file={pdfUrl}
      loading={<div className="w-full h-full bg-white/5 animate-pulse rounded" />}
      className="w-full h-full [&>div]:w-full [&>div]:h-full [&_canvas]:!w-full [&_canvas]:!h-full [&_canvas]:object-cover"
    >
      <PdfPage
        pageNumber={1}
        renderAnnotationLayer={false}
        renderTextLayer={false}
      />
    </Document>
  );
}

// ─── Main Component ──────────────────────────────────────────────────
export default function SacredTextsSection() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Pre-loading: tracks which book card is currently loading
  const [loadingBookId, setLoadingBookId] = useState<string | null>(null);

  // PDF / Flipbook state
  const [numPages, setNumPages] = useState(0);
  const [isPdfReady, setIsPdfReady] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // Zoom
  const [zoom, setZoom] = useState(1);
  const ZOOM_MIN = 0.5;
  const ZOOM_MAX = 2.5;
  const ZOOM_STEP = 0.25;

  // Responsive
  const isMobile = useIsMobile();
  const bookWidth = isMobile ? 320 : 400;
  const bookHeight = isMobile ? 480 : 600;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null);

  // Ref to hold the book being pre-loaded (so we can open it after preload)
  const pendingBookRef = useRef<Book | null>(null);

  // ─── Fetch books ────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/books');
        const data = await res.json();
        if (data.books) setBooks(data.books);
      } catch (err) {
        console.error('Failed to fetch books:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ─── Handle book click (pre-load flow) ─────────────────────────────
  const handleBookClick = useCallback((book: Book) => {
    if (loadingBookId) return; // already loading another
    setLoadingBookId(book.id);
    pendingBookRef.current = book;
  }, [loadingBookId]);

  // Called when the hidden pre-loader Document finishes loading
  const onPreloadSuccess = useCallback(({ numPages: n }: { numPages: number }) => {
    setNumPages(n);
    setIsPdfReady(true);
    setLoadingBookId(null);
    if (pendingBookRef.current) {
      setSelectedBook(pendingBookRef.current);
      pendingBookRef.current = null;
    }
  }, []);

  // ─── Actions ────────────────────────────────────────────────────────
  const closeBook = useCallback(() => {
    setSelectedBook(null);
    setNumPages(0);
    setIsPdfReady(false);
    setCurrentPage(0);
    setZoom(1);
    // Force ref cleanup so react-pageflip fully unmounts
    bookRef.current = null;
  }, []);

  const flipNext = useCallback(() => {
    bookRef.current?.pageFlip()?.flipNext();
  }, []);

  const flipPrev = useCallback(() => {
    bookRef.current?.pageFlip()?.flipPrev();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFlip = useCallback((e: any) => {
    setCurrentPage(e.data);
  }, []);

  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(z + ZOOM_STEP, ZOOM_MAX));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((z) => Math.max(z - ZOOM_STEP, ZOOM_MIN));
  }, []);

  const zoomReset = useCallback(() => {
    setZoom(1);
  }, []);

  // ─── Keyboard shortcuts ─────────────────────────────────────────────
  useEffect(() => {
    if (!selectedBook) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeBook();
      if (e.key === 'ArrowRight') flipNext();
      if (e.key === 'ArrowLeft') flipPrev();
      if (e.key === '=' || e.key === '+') zoomIn();
      if (e.key === '-') zoomOut();
      if (e.key === '0') zoomReset();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedBook, closeBook, flipNext, flipPrev, zoomIn, zoomOut, zoomReset]);

  // ════════════════════════════════════════════════════════════════════
  //  RENDER
  // ════════════════════════════════════════════════════════════════════
  return (
    <LayoutGroup>
      <section id="library" className="w-full min-h-screen bg-black text-white px-6 pt-32 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* ── Library Header ──────────────────────────────── */}
          <header className="mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-serif tracking-widest text-white/90">
              Sacred Scriptures
            </h2>
            <div className="w-24 h-px bg-white/20 mx-auto mt-6" />
            <p className="mt-4 text-white/40 text-sm tracking-widest uppercase">
              Click a book to open the 3D reader
            </p>
          </header>

          {/* ── Book Grid ─────────────────────────────────────── */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-white/50 tracking-widest uppercase text-sm animate-pulse">
                Loading library…
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10 justify-items-center">
              {books.map((book) => (
                <div
                  key={book.id}
                  onClick={() => handleBookClick(book)}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  {/* Book Cover — uses layoutId for magic expand animation */}
                  <motion.div
                    layoutId={`book-container-${book.id}`}
                    className="w-40 h-56 md:w-48 md:h-64 rounded-r-lg rounded-l-sm shadow-2xl relative overflow-hidden transition-shadow duration-500 group-hover:shadow-[0_0_40px_rgba(255,255,255,0.07)]"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  >
                    {/* Real PDF first page as cover */}
                    <div className="w-full h-full bg-neutral-900 overflow-hidden">
                      <BookCoverThumbnail pdfUrl={book.pdfUrl} />
                    </div>

                    {/* Spine shadow overlay (left edge) */}
                    <div className="absolute inset-0 shadow-[inset_4px_0_10px_rgba(0,0,0,0.4)] pointer-events-none rounded-r-lg rounded-l-sm" />

                    {/* Spine accent */}
                    <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-amber-200/20 via-white/30 to-amber-200/20" />

                    {/* Hover glare */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    {/* Loading spinner overlay on this specific card */}
                    {loadingBookId === book.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10"
                      >
                        <Loader2 size={28} className="text-white/70 animate-spin" />
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Title below cover */}
                  <h3 className="mt-4 text-center font-serif text-white/80 text-sm md:text-base tracking-wide max-w-[12rem] group-hover:text-white transition-colors duration-300">
                    {book.title}
                  </h3>
                </div>
              ))}

              {books.length === 0 && (
                <div className="col-span-full text-center py-20 text-white/30 font-serif">
                  The library is currently empty. Add PDF files to{' '}
                  <code className="text-white/50 bg-white/5 px-2 py-1 rounded text-xs">
                    public/books/
                  </code>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Hidden pre-loader Document ─────────────────────────────── */}
        {/* This silently loads the PDF metadata when user clicks a card */}
        {loadingBookId && pendingBookRef.current && (
          <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', opacity: 0 }}>
            <Document
              file={pendingBookRef.current.pdfUrl}
              onLoadSuccess={onPreloadSuccess}
              loading={null}
            >
              {/* We only need the metadata, no pages rendered here */}
            </Document>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            3D FLIPBOOK READER OVERLAY
            ══════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {selectedBook && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center"
            >
              {/* ── Close (X) ─── */}
              <button
                onClick={closeBook}
                className="fixed top-6 right-6 z-[60] w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-all duration-300 hover:scale-110"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              {/* ── Book title ─── */}
              <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60]">
                <h3 className="text-white/50 text-xs tracking-[0.3em] uppercase font-serif">
                  {selectedBook.title}
                </h3>
              </div>

              {/* ── Prev arrow ─── */}
              <button
                onClick={flipPrev}
                className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-[60] w-12 h-12 bg-white/5 hover:bg-white/15 border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                aria-label="Previous page"
              >
                <ChevronLeft size={22} />
              </button>

              {/* ── Next arrow ─── */}
              <button
                onClick={flipNext}
                className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-[60] w-12 h-12 bg-white/5 hover:bg-white/15 border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                aria-label="Next page"
              >
                <ChevronRight size={22} />
              </button>

              {/* ─────────────────────────────────────────────────
                  THE FLIPBOOK (with zoom wrapper + layoutId)
                  ───────────────────────────────────────────────── */}
              <motion.div
                layoutId={`book-container-${selectedBook.id}`}
                transition={{ type: 'spring', stiffness: 200, damping: 30 }}
                style={{
                  width: '100%',
                  maxWidth: `${bookWidth * 2 + 60}px`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '60px 0',
                }}
              >
                <Document
                  file={selectedBook.pdfUrl}
                  loading={<></>}
                >
                  {numPages > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <div
                        style={{
                          transform: `scale(${zoom})`,
                          transition: 'transform 0.3s ease',
                          transformOrigin: 'center center',
                        }}
                      >
                        {/* @ts-ignore — react-pageflip types may not align with React 19 */}
                        <HTMLFlipBook
                          ref={bookRef}
                          width={bookWidth}
                          height={bookHeight}
                          size="stretch"
                          minWidth={280}
                          maxWidth={500}
                          minHeight={380}
                          maxHeight={700}
                          showCover={true}
                          drawShadow={true}
                          maxShadowOpacity={0.5}
                          flippingTime={1000}
                          usePortrait={isMobile}
                          mobileScrollSupport={true}
                          useMouseEvents={true}
                          onFlip={onFlip}
                          startPage={0}
                          startZIndex={0}
                          autoSize={true}
                          clickEventForward={true}
                          swipeDistance={30}
                          showPageCorners={true}
                          disableFlipByClick={false}
                          className=""
                          style={{}}
                        >
                          {Array.from(new Array(numPages), (_el, index) => {
                            // Dynamic loading logic: Keep only the current window of pages mounted
                            // to prevent WebGL/Canvas crashes on 1000+ page PDFs.
                            let isLoaded = false;
                            const halfWindow = LOAD_WINDOW / 2;
                            if (currentPage < halfWindow) {
                              isLoaded = index < LOAD_WINDOW;
                            } else {
                              isLoaded = Math.abs(currentPage - index) <= halfWindow;
                            }

                            return (
                              <FlipPage
                                key={`page-${index}`}
                                pageNumber={index + 1}
                                width={bookWidth}
                                height={bookHeight}
                                isLoaded={isLoaded}
                              />
                            );
                          })}
                        </HTMLFlipBook>
                      </div>
                    </motion.div>
                  )}
                </Document>
              </motion.div>

              {/* ── Bottom Control Bar (Zoom + Page Counter) ─── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20"
              >
                <button
                  onClick={zoomOut}
                  disabled={zoom <= ZOOM_MIN}
                  className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white disabled:text-white/20 transition-colors rounded-full hover:bg-white/10"
                  aria-label="Zoom out"
                >
                  <ZoomOut size={16} />
                </button>

                <button
                  onClick={zoomReset}
                  className="text-white/60 hover:text-white transition-colors px-2 hover:bg-white/10 rounded-full h-8 flex items-center"
                  aria-label="Reset zoom"
                >
                  <RotateCcw size={14} />
                </button>

                <button
                  onClick={zoomIn}
                  disabled={zoom >= ZOOM_MAX}
                  className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white disabled:text-white/20 transition-colors rounded-full hover:bg-white/10"
                  aria-label="Zoom in"
                >
                  <ZoomIn size={16} />
                </button>

                <div className="w-px h-5 bg-white/20" />

                <span className="text-white/50 text-[10px] tracking-[0.25em] uppercase font-serif whitespace-nowrap">
                  {currentPage + 1} / {numPages}
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Global style overrides ──────────────────────────────────── */}
        <style jsx global>{`
          .react-pdf__Page__textContent,
          .react-pdf__Page__annotations {
            display: none !important;
          }
          .react-pdf__Page {
            background: transparent !important;
          }
          .react-pdf__Page__canvas {
            display: block !important;
          }
          .stf__parent {
            filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.7));
          }
        `}</style>
      </section>
    </LayoutGroup>
  );
}
