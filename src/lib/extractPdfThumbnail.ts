export async function extractPdfThumbnail(file: File): Promise<{ pdfFile: File, thumbnailBlob: Blob }> {
  // Dynamically import to prevent SSR build errors
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = async function() {
      const typedarray = new Uint8Array(this.result as ArrayBuffer);

      try {
        const loadingTask = pdfjsLib.getDocument({ data: typedarray });
        const pdf = await loadingTask.promise;
        
        // Fetch the first page
        const page = await pdf.getPage(1);
        
        // Scale for a reasonable thumbnail size (e.g., width around 600px)
        const viewport = page.getViewport({ scale: 1.5 });
        
        // Create canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error("Could not create canvas context");
        }
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext: any = {
          canvasContext: context,
          viewport: viewport
        };

        // Render PDF page into canvas context
        await page.render(renderContext).promise;

        // Convert canvas to WebP Blob
        canvas.toBlob((blob) => {
          if (blob) {
            resolve({ pdfFile: file, thumbnailBlob: blob });
          } else {
            reject(new Error("Canvas to Blob failed"));
          }
        }, 'image/webp', 0.8);
        
      } catch (error) {
        reject(error);
      }
    };

    fileReader.onerror = function() {
      reject(new Error("Failed to read file"));
    };

    fileReader.readAsArrayBuffer(file);
  });
}
