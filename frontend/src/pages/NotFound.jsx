import { Link } from "react-router-dom";
import { ChevronLeft, Home } from "lucide-react";

export default function NotFound(props) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center font-sans relative overflow-hidden">
      {/* Fixed Background Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl mb-8 animate-in fade-in zoom-in duration-500">
         <img 
            src="https://cdni.iconscout.com/illustration/premium/thumb/404-page-not-found-9561127-7706458.png"
            alt="404 Page Not Found"
            className="w-full h-auto max-h-[300px] md:max-h-[400px] object-contain mx-auto drop-shadow-2xl opacity-90 hover:scale-105 transition-transform duration-500" 
         />
      </div>

      <div className="relative z-10 animate-in slide-in-from-bottom-4 duration-500 delay-100">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Page not <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">found</span>
        </h1>

        <p className="text-slate-400 mb-8 max-w-lg mx-auto text-base md:text-lg leading-relaxed">
        {props?.text ?? "  Oops! Looks like you've ventured into the unknown. The page you're looking for doesn't exist or has been moved."} 
        </p>

        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-1"
        >
          <Home size={20} />
          Go back home
        </Link>
      </div>
    </div>
  );
}
