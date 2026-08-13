"use client";

import React, { useState, useEffect } from 'react';
import { extractPdfThumbnail } from '@/lib/extractPdfThumbnail';
import { Loader2, Trash2, Edit2, X, UploadCloud, CheckCircle, FileText, LogOut } from 'lucide-react';
import { pdfjs, Document, Page as PdfPage } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'stories' | 'mantras' | 'scriptures'>('stories');
  const [data, setData] = useState({ stories: [], mantras: [], scriptures: [] });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');
  const [editId, setEditId] = useState<{ id: number; type: string } | null>(null);

  // Fetch admin data (raw metadata)
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin');
      const json = await res.json();
      setData({
        stories: json.stories || [],
        mantras: json.mantras || [],
        scriptures: json.scriptures || []
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number, type: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await fetch('/api/admin', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type })
      });
      if (editId?.id === id) cancelEdit();
      
      // Visual delete effect
      setDeleteSuccess('Item successfully deleted!');
      setTimeout(() => setDeleteSuccess(''), 3000);
      
      fetchData();
    } catch (e) {
      console.error(e);
      alert("Error deleting item");
    }
  };

  // Form states
  const [storyForm, setStoryForm] = useState({ title: '', source: '', subheading: '', content_en: '', content_hi: '' });
  const [mantraForm, setMantraForm] = useState({ title: '', subtitle: '', caption_en: '', caption_hi: '' });
  const [scriptureForm, setScriptureForm] = useState({ title: '' });

  const [files, setFiles] = useState<{ [key: string]: File | null }>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [key]: e.target.files[0] });
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setFiles({});
    setStoryForm({ title: '', source: '', subheading: '', content_en: '', content_hi: '' });
    setMantraForm({ title: '', subtitle: '', caption_en: '', caption_hi: '' });
    setScriptureForm({ title: '' });
  };

  const parseCaption = (caption: any) => {
    if (!caption) return '';
    try {
      if (typeof caption === 'string' && caption.startsWith('[')) {
        return JSON.parse(caption).join('\n');
      }
      if (Array.isArray(caption)) {
        return caption.join('\n');
      }
    } catch(e) {
      return caption;
    }
    return caption;
  };

  const handleEdit = (item: any, type: string) => {
    setEditId({ id: item.id, type });
    setFiles({});
    if (type === 'story') {
      setActiveTab('stories');
      setStoryForm({
        title: item.title || '',
        source: item.source || '',
        subheading: item.subheading || '',
        content_en: item.content_en || '',
        content_hi: item.content_hi || '',
      });
    } else if (type === 'mantra') {
      setActiveTab('mantras');
      setMantraForm({
        title: item.title || '',
        subtitle: item.subtitle || '',
        caption_en: parseCaption(item.caption_en),
        caption_hi: parseCaption(item.caption_hi),
      });
    } else if (type === 'scripture') {
      setActiveTab('scriptures');
      setScriptureForm({
        title: item.title || '',
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = editId?.type === 'story';
    if (!isEdit && !files.thumbnail) return alert("Artwork Cover required");
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('type', 'story');
      if (isEdit) formData.append('id', editId.id.toString());
      Object.entries(storyForm).forEach(([k, v]) => formData.append(k, v));
      if (files.thumbnail) formData.append('thumbnail', files.thumbnail);
      
      const res = await fetch('/api/admin', { method: isEdit ? 'PUT' : 'POST', body: formData });
      if (!res.ok) throw new Error("Failed");
      
      setSubmitSuccess(isEdit ? 'Updated!' : 'Added!');
      setTimeout(() => setSubmitSuccess(''), 3000);
      
      cancelEdit();
      fetchData();
    } catch (e) {
      alert("Error submitting story");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMantraSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = editId?.type === 'mantra';
    if (!isEdit && (!files.audio || !files.cover)) return alert("Audio and Cover required");
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('type', 'mantra');
      if (isEdit) formData.append('id', editId.id.toString());
      
      const enArr = JSON.stringify(mantraForm.caption_en.split('\n'));
      const hiArr = JSON.stringify(mantraForm.caption_hi.split('\n'));
      
      formData.append('title', mantraForm.title);
      formData.append('subtitle', mantraForm.subtitle);
      formData.append('caption_en', enArr);
      formData.append('caption_hi', hiArr);
      if (files.audio) formData.append('audio', files.audio);
      if (files.cover) formData.append('cover', files.cover);
      
      const res = await fetch('/api/admin', { method: isEdit ? 'PUT' : 'POST', body: formData });
      if (!res.ok) throw new Error("Failed");
      
      setSubmitSuccess(isEdit ? 'Updated!' : 'Added!');
      setTimeout(() => setSubmitSuccess(''), 3000);
      
      cancelEdit();
      fetchData();
    } catch (e) {
      alert("Error submitting mantra");
    } finally {
      setSubmitting(false);
    }
  };

  const handleScriptureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = editId?.type === 'scripture';
    if (!isEdit && !files.pdf) return alert("PDF required");
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('type', 'scripture');
      if (isEdit) formData.append('id', editId.id.toString());
      formData.append('title', scriptureForm.title);
      if (files.pdf) {
          formData.append('pdf', files.pdf);
          const { thumbnailBlob } = await extractPdfThumbnail(files.pdf);
          formData.append('thumbnail', thumbnailBlob, 'thumb.webp');
      }
      
      const res = await fetch('/api/admin', { method: isEdit ? 'PUT' : 'POST', body: formData });
      if (!res.ok) throw new Error("Failed");
      
      setSubmitSuccess(isEdit ? 'Updated!' : 'Added!');
      setTimeout(() => setSubmitSuccess(''), 3000);
      
      cancelEdit();
      fetchData();
    } catch (e: any) {
      alert("Error submitting scripture: " + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Helper for rendering custom file uploads
  const CustomFileUpload = ({ title, fieldName, file, isEdit, accept }: { title: string, fieldName: string, file: File | null, isEdit: boolean, accept: string }) => (
    <div className="w-full">
      <label className="block text-white/70 mb-2 font-medium">{title} {isEdit && <span className="text-xs text-blue-400 font-normal">- Optional</span>}</label>
      <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-black/40 border-2 border-white/20 border-dashed rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-500/10 focus:outline-none">
        <span className="flex flex-col items-center space-y-2">
            <UploadCloud className="w-8 h-8 text-blue-500" />
            <span className="font-medium text-white/80 text-sm">
                {file ? file.name : 'Choose file or drag & drop'}
            </span>
        </span>
        <input type="file" accept={accept} onChange={e => handleFileChange(e, fieldName)} className="hidden" />
      </label>
      <p className="text-xs text-white/40 mt-3 text-center">Fastest loading: {accept.includes('audio') ? 'MP3' : 'WebP/JPEG'} (No upload limits or format restrictions)</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 pt-32 md:pt-40 font-sans relative">
      <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="pt-12 pb-8 relative">
          <button 
            onClick={handleLogout}
            className="absolute top-6 right-6 flex items-center gap-2 text-white/50 hover:text-red-400 bg-black/40 px-4 py-2 rounded-full text-sm font-medium transition-colors border border-white/5 hover:border-red-500/30"
          >
            <LogOut size={16} />
            <span className="hidden md:inline">Logout</span>
          </button>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-center tracking-widest text-white/90 uppercase animate-pulse">SANDEEP ADMIN PANEL</h1>
        </div>
        
        {/* Header Tabs */}
        <div className="flex border-b border-white/10">
          {['stories', 'mantras', 'scriptures'].map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab as any); cancelEdit(); }}
              className={`flex-1 py-4 text-center font-semibold uppercase tracking-wider transition-colors ${
                activeTab === tab ? 'bg-white/15 text-white border-b-2 border-blue-500' : 'text-white/50 hover:bg-white/5 hover:text-white/80'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6 md:p-10 relative">
          {deleteSuccess && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500/90 text-white px-6 py-3 rounded-full font-bold shadow-lg animate-bounce z-50 flex items-center gap-2">
              <CheckCircle size={20} />
              {deleteSuccess}
            </div>
          )}
          {loading ? (
            <div className="flex justify-center p-20"><Loader2 className="animate-spin text-white/50" size={48} /></div>
          ) : (
            <>
              {/* STORIES TAB */}
              {activeTab === 'stories' && (
                <div className="space-y-16">
                  <div className="bg-black/40 p-8 rounded-3xl border border-white/10 relative shadow-inner">
                    {editId?.type === 'story' && (
                       <button onClick={cancelEdit} className="absolute top-6 right-6 text-white/50 hover:text-white flex items-center gap-1 text-sm bg-white/5 px-4 py-2 rounded-full transition"><X size={16}/> Cancel Edit</button>
                    )}
                    <h2 className="text-2xl md:text-3xl font-serif mb-8 text-blue-400">{editId?.type === 'story' ? 'Edit Story' : 'Add New Story'}</h2>
                    <form onSubmit={handleStorySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-blue-500 transition placeholder:text-white/30" placeholder="Title" value={storyForm.title} onChange={e => setStoryForm({...storyForm, title: e.target.value})} required />
                      <input className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-blue-500 transition placeholder:text-white/30" placeholder="Source" value={storyForm.source} onChange={e => setStoryForm({...storyForm, source: e.target.value})} required />
                      <input className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-blue-500 transition placeholder:text-white/30 md:col-span-2" placeholder="Subheading (Sloka)" value={storyForm.subheading} onChange={e => setStoryForm({...storyForm, subheading: e.target.value})} required />
                      <textarea className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white h-40 focus:outline-none focus:border-blue-500 transition placeholder:text-white/30 resize-none" placeholder="English Story Text" value={storyForm.content_en} onChange={e => setStoryForm({...storyForm, content_en: e.target.value})} required />
                      <textarea className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white h-40 focus:outline-none focus:border-blue-500 transition placeholder:text-white/30 resize-none" placeholder="Hindi Story Text" value={storyForm.content_hi} onChange={e => setStoryForm({...storyForm, content_hi: e.target.value})} required />
                      <div className="md:col-span-2">
                        <CustomFileUpload title="Artwork Cover" fieldName="thumbnail" file={files.thumbnail} isEdit={!!editId} accept="image/*" />
                      </div>
                      <button disabled={submitting || !!submitSuccess} className="md:col-span-2 mt-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-70 text-white font-bold py-4 rounded-full transition-all flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                        {submitting ? <Loader2 className="animate-spin" /> : submitSuccess ? <><CheckCircle size={20}/> {submitSuccess}</> : (editId?.type === 'story' ? 'Update Story' : 'Submit Story')}
                      </button>
                    </form>
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif mb-8 border-b border-white/10 pb-4 text-white/80">Published Stories</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {[...data.stories].sort((a: any, b: any) => (b.updated_at || b.id) - (a.updated_at || a.id)).map((story: any) => (
                        <div key={story.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between group hover:bg-white/10 transition h-full shadow-lg">
                          <div className="flex flex-col items-center gap-4 mb-4">
                            {story.image_url ? (
                                <img src={story.image_url} alt={story.title} className="w-full aspect-square object-cover rounded-xl shadow-md" />
                            ) : (
                                <div className="w-full aspect-square bg-black/40 rounded-xl flex items-center justify-center text-xs text-white/30 shadow-md">No Image</div>
                            )}
                            <h3 className="font-bold text-center text-sm w-full line-clamp-2">{story.title}</h3>
                          </div>
                          <div className="flex justify-center gap-2 mt-auto">
                             <button onClick={() => handleEdit(story, 'story')} className="text-blue-400 hover:text-blue-300 p-2.5 bg-black/40 rounded-xl flex-1 flex justify-center hover:bg-blue-900/30 transition"><Edit2 size={18} /></button>
                             <button onClick={() => handleDelete(story.id, 'story')} className="text-red-400 hover:text-red-300 p-2.5 bg-black/40 rounded-xl flex-1 flex justify-center hover:bg-red-900/30 transition"><Trash2 size={18} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* MANTRAS TAB */}
              {activeTab === 'mantras' && (
                <div className="space-y-16">
                  <div className="bg-black/40 p-8 rounded-3xl border border-white/10 relative shadow-inner">
                     {editId?.type === 'mantra' && (
                       <button onClick={cancelEdit} className="absolute top-6 right-6 text-white/50 hover:text-white flex items-center gap-1 text-sm bg-white/5 px-4 py-2 rounded-full transition"><X size={16}/> Cancel Edit</button>
                     )}
                    <h2 className="text-2xl md:text-3xl font-serif mb-8 text-blue-400">{editId?.type === 'mantra' ? 'Edit Mantra' : 'Add New Mantra'}</h2>
                    <form onSubmit={handleMantraSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-blue-500 transition placeholder:text-white/30" placeholder="Title" value={mantraForm.title} onChange={e => setMantraForm({...mantraForm, title: e.target.value})} required />
                      <input className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-blue-500 transition placeholder:text-white/30" placeholder="Subtitle" value={mantraForm.subtitle} onChange={e => setMantraForm({...mantraForm, subtitle: e.target.value})} required />
                      <textarea className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white h-40 focus:outline-none focus:border-blue-500 transition placeholder:text-white/30 resize-none" placeholder="English Lyrics (Line by line)" value={mantraForm.caption_en} onChange={e => setMantraForm({...mantraForm, caption_en: e.target.value})} required />
                      <textarea className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white h-40 focus:outline-none focus:border-blue-500 transition placeholder:text-white/30 resize-none" placeholder="Hindi Lyrics (Line by line)" value={mantraForm.caption_hi} onChange={e => setMantraForm({...mantraForm, caption_hi: e.target.value})} required />
                      
                      <CustomFileUpload title="Audio File (.mp3)" fieldName="audio" file={files.audio} isEdit={!!editId} accept="audio/*" />
                      <CustomFileUpload title="Artwork Cover" fieldName="cover" file={files.cover} isEdit={!!editId} accept="image/*" />
                      
                      <button disabled={submitting || !!submitSuccess} className="md:col-span-2 mt-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-70 text-white font-bold py-4 rounded-full transition-all flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                        {submitting ? <Loader2 className="animate-spin" /> : submitSuccess ? <><CheckCircle size={20}/> {submitSuccess}</> : (editId?.type === 'mantra' ? 'Update Mantra' : 'Submit Mantra')}
                      </button>
                    </form>
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif mb-8 border-b border-white/10 pb-4 text-white/80">Published Mantras</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {[...data.mantras].sort((a: any, b: any) => (b.updated_at || b.id) - (a.updated_at || a.id)).map((mantra: any) => (
                        <div key={mantra.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between group hover:bg-white/10 transition h-full shadow-lg">
                          <div className="flex flex-col items-center gap-4 mb-4">
                            {mantra.image_url ? (
                                <img src={mantra.image_url} alt={mantra.title} className="w-full aspect-square object-cover rounded-xl shadow-md" />
                            ) : (
                                <div className="w-full aspect-square bg-black/40 rounded-xl flex items-center justify-center text-xs text-white/30 shadow-md">No Image</div>
                            )}
                            <div className="text-center w-full">
                              <h3 className="font-bold text-sm line-clamp-2">{mantra.title}</h3>
                              <p className="text-[10px] text-white/50 truncate mt-1">{mantra.subtitle}</p>
                            </div>
                          </div>
                          <div className="flex justify-center gap-2 mt-auto">
                             <button onClick={() => handleEdit(mantra, 'mantra')} className="text-blue-400 hover:text-blue-300 p-2.5 bg-black/40 rounded-xl flex-1 flex justify-center hover:bg-blue-900/30 transition"><Edit2 size={18} /></button>
                             <button onClick={() => handleDelete(mantra.id, 'mantra')} className="text-red-400 hover:text-red-300 p-2.5 bg-black/40 rounded-xl flex-1 flex justify-center hover:bg-red-900/30 transition"><Trash2 size={18} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SCRIPTURES TAB */}
              {activeTab === 'scriptures' && (
                <div className="space-y-16">
                  <div className="bg-black/40 p-8 rounded-3xl border border-white/10 relative shadow-inner">
                     {editId?.type === 'scripture' && (
                       <button onClick={cancelEdit} className="absolute top-6 right-6 text-white/50 hover:text-white flex items-center gap-1 text-sm bg-white/5 px-4 py-2 rounded-full transition"><X size={16}/> Cancel Edit</button>
                     )}
                    <h2 className="text-2xl md:text-3xl font-serif mb-8 text-blue-400">{editId?.type === 'scripture' ? 'Edit Scripture' : 'Add New Scripture PDF'}</h2>
                    <form onSubmit={handleScriptureSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-blue-500 transition placeholder:text-white/30 md:col-span-2" placeholder="Book Title" value={scriptureForm.title} onChange={e => setScriptureForm({...scriptureForm, title: e.target.value})} required />
                      <div className="md:col-span-2">
                        <CustomFileUpload title="PDF File Upload" fieldName="pdf" file={files.pdf} isEdit={!!editId} accept="application/pdf" />
                        <p className="text-xs text-white/40 mt-1 text-center">Artwork Cover will be automatically extracted from Page 1.</p>
                      </div>
                      
                      <button disabled={submitting || !!submitSuccess} className="md:col-span-2 mt-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-70 text-white font-bold py-4 rounded-full transition-all flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                        {submitting ? <Loader2 className="animate-spin" /> : submitSuccess ? <><CheckCircle size={20}/> {submitSuccess}</> : (editId?.type === 'scripture' ? 'Update Scripture' : 'Submit Scripture')}
                      </button>
                    </form>
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif mb-8 border-b border-white/10 pb-4 text-white/80">Published Scriptures</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {[...data.scriptures].sort((a: any, b: any) => (b.updated_at || b.id) - (a.updated_at || a.id)).map((book: any) => (
                        <div key={book.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between group hover:bg-white/10 transition h-full shadow-lg">
                          <div className="flex flex-col items-center gap-4 mb-4">
                            {book.image_url ? (
                                <img src={book.image_url} alt={book.title} className="w-full aspect-[3/4] object-cover rounded-xl shadow-md" />
                            ) : book.pdfUrl ? (
                                <div className="w-full aspect-[3/4] rounded-xl overflow-hidden shadow-md relative bg-white flex items-center justify-center">
                                    <div className="w-full h-full pointer-events-none opacity-90 overflow-hidden flex justify-center items-center">
                                      <Document file={book.pdfUrl} loading={<Loader2 className="animate-spin text-black/20" />}>
                                          <PdfPage pageNumber={1} width={250} renderTextLayer={false} renderAnnotationLayer={false} />
                                      </Document>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full aspect-[3/4] bg-black/40 rounded-xl flex flex-col gap-2 items-center justify-center text-xs text-white/30 shadow-md">
                                    <FileText size={32} />
                                    <span>PDF</span>
                                </div>
                            )}
                            <h3 className="font-bold text-center text-sm w-full line-clamp-2">{book.title}</h3>
                          </div>
                          <div className="flex justify-center gap-2 mt-auto">
                             <button onClick={() => handleEdit(book, 'scripture')} className="text-blue-400 hover:text-blue-300 p-2.5 bg-black/40 rounded-xl flex-1 flex justify-center hover:bg-blue-900/30 transition"><Edit2 size={18} /></button>
                             <button onClick={() => handleDelete(book.id, 'scripture')} className="text-red-400 hover:text-red-300 p-2.5 bg-black/40 rounded-xl flex-1 flex justify-center hover:bg-red-900/30 transition"><Trash2 size={18} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
