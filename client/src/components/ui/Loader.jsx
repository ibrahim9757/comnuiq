// components/Loader.tsx
import { ClipLoader } from "react-spinners";

export default function Loader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-black">
      <ClipLoader
        color="#ffffff"
        size={50}
        speedMultiplier={0.8}
        className="mb-4"
      />
      <p className="text-white font-mono text-lg animate-pulse">
        Please Wait ...
      </p>
    </div>
  );
}
