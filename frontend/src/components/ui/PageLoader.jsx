import { Loader2 } from "lucide-react";

export default function PageLoader({ text = "Loading..." }) {
  return (
    <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col items-center justify-center overflow-hidden">
      {/* Fixed Background Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-slate-800 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-blue-500 rounded-full animate-spin absolute top-0 left-0 border-t-transparent shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
        </div>
        <h2 className="text-xl font-medium text-slate-200 animate-pulse tracking-wide">{text}</h2>
        <p className="text-sm text-slate-500 mt-2">Please wait while we set things up</p>
      </div>
    </div>
  );
}
