import { useState, useRef } from 'react';
import {
  Film,
  Upload,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Download
} from 'lucide-react';

export const VeoVideoGenerator = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/png');
  const [prompt, setPrompt] = useState<string>(
    'Cinematic cyber security alert animation zooming in on a glowing lock breaking with digital warning streams'
  );
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMimeType(file.type || 'image/png');
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setVideoBlobUrl(null);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  const handleStartGeneration = async () => {
    if (!selectedImage && !prompt) return;

    setIsGenerating(true);
    setErrorMsg(null);
    setProgressMsg('Step 1/3: Initiating video generation with Veo model (veo-3.1-fast-generate-preview)...');

    try {
      // 1. Start generation
      const startRes = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType,
          prompt,
          aspectRatio,
        }),
      });

      const startData = await startRes.json();
      if (startData.error) throw new Error(startData.error);

      const opName = startData.operationName;
      if (!opName) throw new Error('No operation name returned by server.');

      setProgressMsg('Step 2/3: Synthesizing frames and rendering neural motion (polling status)...');

      // 2. Poll until done
      let done = false;
      let attempts = 0;
      while (!done && attempts < 40) {
        await new Promise((r) => setTimeout(r, 6000));
        attempts++;

        const statusRes = await fetch('/api/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName: opName }),
        });

        const statusData = await statusRes.json();
        if (statusData.error) throw new Error(statusData.error.message || 'Error during video processing');

        if (statusData.done) {
          done = true;
          break;
        }

        setProgressMsg(`Step 2/3: Rendering frames... (${attempts * 6}s elapsed)`);
      }

      if (!done) {
        throw new Error('Video generation timed out. Please try again.');
      }

      setProgressMsg('Step 3/3: Downloading rendered video stream...');

      // 3. Download
      const downloadRes = await fetch('/api/video-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operationName: opName }),
      });

      if (!downloadRes.ok) {
        throw new Error('Failed to download generated video.');
      }

      const blob = await downloadRes.blob();
      const localUrl = URL.createObjectURL(blob);
      setVideoBlobUrl(localUrl);
      setProgressMsg('Completed successfully!');
    } catch (err: any) {
      console.error('Video error:', err);
      setErrorMsg(err.message || 'Veo video generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>Generative Neural Media</span>
            <span aria-hidden="true">·</span>
            <span>Veo Video Generation (veo-3.1-fast-generate-preview)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Animate Phishing Incident Alert to Video
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-2xl">
            Upload an image (such as a phishing screenshot or security diagram) and transform it into dynamic, cinematic security briefing videos using Google&apos;s Veo video model.
          </p>
        </div>

        {/* Aspect Ratio Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => setAspectRatio('16:9')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              aspectRatio === '16:9'
                ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            16:9 Landscape
          </button>
          <button
            onClick={() => setAspectRatio('9:16')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              aspectRatio === '9:16'
                ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            9:16 Portrait
          </button>
        </div>
      </section>

      {/* Main Grid: Upload & Controls | Preview Player */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input & Prompt */}
        <div className="lg:col-span-6 p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              1. Upload Starting Image
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-cyan-400/60 rounded-xl p-6 text-center cursor-pointer bg-slate-950/70 hover:bg-slate-950 transition-colors"
            >
              {selectedImage ? (
                <div className="space-y-2">
                  <img
                    src={selectedImage}
                    alt="Uploaded thumbnail"
                    className="max-h-48 mx-auto rounded-lg object-contain shadow-md"
                  />
                  <span className="text-xs text-cyan-400 font-mono block">
                    Click to replace image
                  </span>
                </div>
              ) : (
                <div className="space-y-2 text-slate-400">
                  <Upload className="h-8 w-8 mx-auto text-slate-500" />
                  <div className="text-xs font-medium text-slate-300">
                    Drop or click to upload security screenshot / image
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    PNG, JPG, WebP supported
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              2. Animation Motion Prompt
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the cinematic camera motion, glowing elements, or security transition..."
              className="w-full px-3.5 py-2.5 text-xs font-sans bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="pt-2">
            <button
              onClick={handleStartGeneration}
              disabled={isGenerating || (!selectedImage && !prompt)}
              className="w-full py-3 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 disabled:pointer-events-none rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-950"
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full" />
                  <span>Generating Video with Veo...</span>
                </>
              ) : (
                <>
                  <Film className="h-4 w-4" />
                  <span>Generate Veo Video ({aspectRatio})</span>
                </>
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/30 text-xs text-red-200 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Right: Output Video Player */}
        <div className="lg:col-span-6 p-6 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center min-h-[380px]">
          {videoBlobUrl ? (
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                <span className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="h-4 w-4" />
                  Veo Video Generated Successfully
                </span>
                <span className="text-slate-400">{aspectRatio}</span>
              </div>

              <div className="relative rounded-xl overflow-hidden bg-black border border-slate-800 shadow-2xl max-h-[380px] flex items-center justify-center">
                <video
                  src={videoBlobUrl}
                  controls
                  autoPlay
                  loop
                  className="w-full h-auto max-h-[360px] object-contain"
                />
              </div>

              <div className="flex justify-end gap-2">
                <a
                  href={videoBlobUrl}
                  download="phishguard_veo_animation.mp4"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download MP4</span>
                </a>
              </div>
            </div>
          ) : isGenerating ? (
            <div className="text-center space-y-3 p-6">
              <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
                <Film className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Synthesizing Neural Video</h3>
              <p className="text-xs text-slate-400 font-mono max-w-xs mx-auto leading-relaxed">
                {progressMsg}
              </p>
              <div className="text-[11px] text-slate-500">
                Veo generates high-fidelity video in ~30 to 60 seconds.
              </div>
            </div>
          ) : (
            <div className="text-center space-y-2 text-slate-500 p-8">
              <Film className="h-10 w-10 mx-auto text-slate-600" />
              <div className="text-xs font-medium text-slate-400">
                Generated video preview will appear here
              </div>
              <div className="text-[11px] text-slate-600">
                Choose landscape (16:9) or portrait (9:16) format
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
