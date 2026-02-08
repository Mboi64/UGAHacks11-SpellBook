import { useState } from "react";
import { X, Key, Sparkles, Check } from "lucide-react";
import { motion } from "motion/react";

interface AISettingsProps {
  onClose: () => void;
  currentApiKey: string | null;
  onSaveApiKey: (apiKey: string) => void;
}

export function AISettings({
  onClose,
  currentApiKey,
  onSaveApiKey,
}: AISettingsProps) {
  const [apiKey, setApiKey] = useState(currentApiKey || "");
  const [saved, setSaved] = useState(false);

  const isValidFormat =
    apiKey.trim().startsWith("AIza") && apiKey.trim().length > 30;

  const handleSave = () => {
    onSaveApiKey(apiKey);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Magical particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              background: i % 2 === 0 ? "#a78bfa" : "#fbbf24",
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              opacity: 0.4,
              boxShadow: "0 0 10px currentColor",
            }}
          />
        ))}
      </div>

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(88, 28, 135, 0.95), rgba(59, 7, 100, 0.95))",
          boxShadow:
            "0 0 60px rgba(167, 139, 250, 0.4), 0 8px 32px rgba(0, 0, 0, 0.6)",
          border: "2px solid rgba(167, 139, 250, 0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow effect */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(167, 139, 250, 0.4), transparent 70%)",
          }}
        />

        {/* Header */}
        <div className="relative p-6 border-b border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "radial-gradient(circle, rgba(167, 139, 250, 0.4), transparent 70%)",
                  boxShadow: "0 0 20px rgba(167, 139, 250, 0.6)",
                }}
              >
                <Key className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <h2
                  className="text-2xl font-serif text-purple-100"
                  style={{ textShadow: "0 0 10px rgba(167, 139, 250, 0.6)" }}
                >
                  AI Oracle Settings
                </h2>
                <p className="text-purple-300 text-sm">
                  Configure your mystical AI companion
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-purple-500/30 transition-colors"
            >
              <X className="w-5 h-5 text-purple-300" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative p-6 space-y-6">
          {/* Info box */}
          <div
            className="p-4 rounded-lg border"
            style={{
              background: "rgba(167, 139, 250, 0.1)",
              borderColor: "rgba(167, 139, 250, 0.3)",
            }}
          >
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-300 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-purple-200 leading-relaxed">
                <p className="mb-2">
                  The AI Oracle will analyze your spell books and reveal hidden
                  connections, suggesting new paths of knowledge to explore.
                </p>
                <p className="text-xs text-purple-300">
                  You'll need a Google Gemini API key. Get one at{" "}
                  <span className="text-purple-200 font-mono">
                    aistudio.google.com/apikey
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* API Key input */}
          <div className="space-y-2">
            <label className="block text-purple-200 text-sm font-medium">
              Google Gemini API Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIza..."
                className="w-full px-4 py-3 pr-10 rounded-lg border text-purple-100 placeholder-purple-400/50 focus:outline-none focus:ring-2 transition-all font-mono text-sm"
                style={{
                  background: "rgba(0, 0, 0, 0.3)",
                  borderColor:
                    apiKey && !isValidFormat
                      ? "rgba(239, 68, 68, 0.5)"
                      : "rgba(167, 139, 250, 0.3)",
                  boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.3)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(167, 139, 250, 0.6)";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(167, 139, 250, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.3)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(167, 139, 250, 0.3)";
                  e.target.style.boxShadow =
                    "inset 0 2px 4px rgba(0, 0, 0, 0.3)";
                }}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {apiKey && isValidFormat ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : apiKey ? (
                  <div className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-xs font-bold">
                    !
                  </div>
                ) : (
                  <Key className="w-4 h-4 text-purple-400/50" />
                )}
              </div>
            </div>
            {apiKey && !isValidFormat ? (
              <p className="text-xs text-red-400">
                Invalid format. Google Gemini keys should start with{" "}
                <span className="font-mono">AIza</span>
              </p>
            ) : (
              <p className="text-xs text-purple-300/70">
                Your API key is stored locally and never shared. Key should
                start with{" "}
                <span className="font-mono text-purple-200">AIza</span>
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={!apiKey.trim() || !isValidFormat}
              className="flex-1 px-6 py-3 rounded-lg font-serif text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              style={{
                background: saved
                  ? "linear-gradient(135deg, rgba(34, 197, 94, 0.6), rgba(22, 163, 74, 0.5))"
                  : "linear-gradient(135deg, rgba(139, 92, 246, 0.6), rgba(167, 139, 250, 0.5))",
                border: saved
                  ? "2px solid rgba(34, 197, 94, 0.6)"
                  : "2px solid rgba(167, 139, 250, 0.6)",
                boxShadow: saved
                  ? "0 0 30px rgba(34, 197, 94, 0.4), 0 8px 20px rgba(0, 0, 0, 0.3)"
                  : "0 0 30px rgba(167, 139, 250, 0.4), 0 8px 20px rgba(0, 0, 0, 0.3)",
                textShadow: "0 0 10px rgba(167, 139, 250, 0.8)",
              }}
            >
              {saved ? (
                <>
                  <Check className="w-5 h-5" />
                  <span className="text-green-100">Saved!</span>
                </>
              ) : (
                <span className="text-purple-100">Save Oracle Key</span>
              )}
            </button>

            {currentApiKey && (
              <button
                onClick={() => {
                  onSaveApiKey("");
                  setApiKey("");
                }}
                className="px-6 py-3 rounded-lg font-serif transition-all hover:bg-red-500/20 border-2 border-red-500/30 text-red-300"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status */}
          {currentApiKey && !saved && (
            <div className="flex items-center gap-2 text-sm text-green-300">
              <Check className="w-4 h-4" />
              <span>AI Oracle is active</span>
            </div>
          )}

          {/* Troubleshooting tips */}
          <div
            className="mt-4 p-3 rounded-lg text-xs text-purple-300/80 leading-relaxed"
            style={{
              background: "rgba(139, 92, 246, 0.1)",
              border: "1px solid rgba(167, 139, 250, 0.2)",
            }}
          >
            <p className="font-semibold text-purple-200 mb-1">
              Troubleshooting:
            </p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>
                Ensure your key starts with{" "}
                <span className="font-mono text-purple-200">AIza</span>
              </li>
              <li>Remove any extra spaces before or after the key</li>
              <li>
                Get a new key at{" "}
                <span className="font-mono text-purple-200">
                  aistudio.google.com/apikey
                </span>
              </li>
              <li>If issues persist, click "Clear" and re-enter your key</li>
            </ul>
          </div>
        </div>

        {/* Decorative bottom border */}
        <div className="h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
      </motion.div>
    </motion.div>
  );
}
