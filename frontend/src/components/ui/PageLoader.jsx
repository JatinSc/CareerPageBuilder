import { Loader2 } from "lucide-react";

export default function PageLoader({ text = "Loading..." }) {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-100 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-indigo-600 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
      </div>
      <h2 className="mt-4 text-xl font-medium text-gray-700 animate-pulse">{text}</h2>
    </div>
  );
}
