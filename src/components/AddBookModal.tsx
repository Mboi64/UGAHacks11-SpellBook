import { useState } from 'react';
import { X, Wand2, Palette } from 'lucide-react';

interface AddBookModalProps {
  onConfirm: (title: string, color: string, accentColor: string) => void;
  onCancel: () => void;
}

const bookThemes = [
  { name: 'Ancient Tome', color: '#8B4513', accent: '#D4AF37' },
  { name: 'Dark Arts', color: '#1a0b2e', accent: '#7b2cbf' },
  { name: 'Mystic Waters', color: '#0F4C5C', accent: '#5FA8D3' },
  { name: 'Forest Magic', color: '#1b4332', accent: '#52b788' },
  { name: 'Fire Spells', color: '#7f1d1d', accent: '#fbbf24' },
  { name: 'Celestial', color: '#1e1b4b', accent: '#c4b5fd' },
  { name: 'Emerald', color: '#064e3b', accent: '#34d399' },
  { name: 'Crimson', color: '#7f1d1d', accent: '#fca5a5' },
  { name: 'Royal Purple', color: '#581c87', accent: '#d8b4fe' },
  { name: 'Ocean Deep', color: '#164e63', accent: '#67e8f9' },
  { name: 'Sunset', color: '#9a3412', accent: '#fdba74' },
  { name: 'Midnight', color: '#0c4a6e', accent: '#bae6fd' },
  { name: 'Rose Gold', color: '#9f1239', accent: '#fda4af' },
  { name: 'Jade', color: '#14532d', accent: '#86efac' },
  { name: 'Amethyst', color: '#4c1d95', accent: '#e9d5ff' },
  { name: 'Bronze', color: '#78350f', accent: '#fcd34d' },
  { name: 'Silver', color: '#475569', accent: '#cbd5e1' },
  { name: 'Obsidian', color: '#18181b', accent: '#71717a' },
];

export function AddBookModal({ onConfirm, onCancel }: AddBookModalProps) {
  const [title, setTitle] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(bookThemes[0]);
  const [customMode, setCustomMode] = useState(false);
  const [customColor, setCustomColor] = useState('#8B4513');
  const [customAccent, setCustomAccent] = useState('#D4AF37');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      if (customMode) {
        onConfirm(title.trim(), customColor, customAccent);
      } else {
        onConfirm(title.trim(), selectedTheme.color, selectedTheme.accent);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-2xl max-w-2xl w-full border-2 border-purple-500/50 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Magical border glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 animate-pulse pointer-events-none" />
        
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Wand2 className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-serif text-amber-100">
                Summon New Spell Book
              </h2>
            </div>
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-purple-200 mb-2 font-serif">
                Book Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Quantum Physics & Spellcraft"
                className="w-full px-4 py-3 bg-slate-900/50 border-2 border-purple-500/30 rounded text-amber-50 placeholder-slate-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                autoFocus
              />
            </div>

            {/* Toggle between preset themes and custom colors */}
            <div className="flex gap-2 bg-slate-900/50 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setCustomMode(false)}
                className={`flex-1 px-4 py-2 rounded transition-all font-serif text-sm ${!customMode ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-300 hover:text-white'}`}
              >
                Preset Themes
              </button>
              <button
                type="button"
                onClick={() => setCustomMode(true)}
                className={`flex-1 px-4 py-2 rounded transition-all font-serif text-sm flex items-center justify-center gap-2 ${customMode ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-300 hover:text-white'}`}
              >
                <Palette className="w-4 h-4" />
                Custom Colors
              </button>
            </div>

            {!customMode ? (
              <div>
                <label className="block text-purple-200 mb-3 font-serif">
                  Choose Theme
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-96 overflow-y-auto pr-2">
                  {bookThemes.map((theme) => (
                    <button
                      key={theme.name}
                      type="button"
                      onClick={() => setSelectedTheme(theme)}
                      className={`p-3 rounded-lg border-2 transition-all ${selectedTheme.name === theme.name ? 'border-purple-400 shadow-lg scale-105' : 'border-slate-700 hover:border-slate-600'}`}
                      style={{
                        background: `linear-gradient(to bottom, ${theme.color}, ${theme.color}dd)`,
                      }}
                    >
                      <div className="aspect-[3/4] rounded flex items-center justify-center">
                        <div
                          className="w-8 h-8 rounded-full border-2"
                          style={{ borderColor: theme.accent }}
                        />
                      </div>
                      <p className="text-xs text-center mt-2 truncate" style={{ color: theme.accent }}>
                        {theme.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <label className="block text-purple-200 mb-3 font-serif">
                  Custom Color Wheel
                </label>
                
                {/* Book Color Picker */}
                <div className="bg-slate-900/50 p-4 rounded-lg border border-purple-500/30">
                  <label className="block text-amber-100 mb-2 text-sm font-serif">
                    Book Spine Color
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-20 h-20 rounded-lg cursor-pointer border-2 border-purple-500/50"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={customColor.toUpperCase()}
                        onChange={(e) => setCustomColor(e.target.value)}
                        placeholder="#8B4513"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-amber-100 font-mono text-sm focus:border-purple-400 focus:outline-none"
                      />
                      <p className="text-xs text-slate-400 mt-1">Main book spine color</p>
                    </div>
                  </div>
                </div>

                {/* Accent Color Picker */}
                <div className="bg-slate-900/50 p-4 rounded-lg border border-purple-500/30">
                  <label className="block text-amber-100 mb-2 text-sm font-serif">
                    Accent Color (Text & Glow)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={customAccent}
                      onChange={(e) => setCustomAccent(e.target.value)}
                      className="w-20 h-20 rounded-lg cursor-pointer border-2 border-purple-500/50"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={customAccent.toUpperCase()}
                        onChange={(e) => setCustomAccent(e.target.value)}
                        placeholder="#D4AF37"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-amber-100 font-mono text-sm focus:border-purple-400 focus:outline-none"
                      />
                      <p className="text-xs text-slate-400 mt-1">Title text and magical glow</p>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-slate-900/50 p-4 rounded-lg border border-purple-500/30">
                  <label className="block text-amber-100 mb-3 text-sm font-serif">
                    Preview
                  </label>
                  <div className="flex justify-center">
                    <div
                      className="w-24 h-32 rounded-lg flex items-center justify-center relative"
                      style={{
                        background: `linear-gradient(135deg, ${customColor}ee 0%, ${customColor} 50%, ${customColor}dd 100%)`,
                        boxShadow: `0 0 20px ${customAccent}40, inset -2px 0 6px rgba(0,0,0,0.4)`,
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-full border-2"
                        style={{ borderColor: customAccent }}
                      />
                      <div
                        className="absolute bottom-2 w-2 h-12 opacity-70"
                        style={{
                          background: customAccent,
                          clipPath: 'polygon(0 0, 100% 0, 100% 90%, 50% 100%, 0 90%)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition-colors font-serif"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed font-serif shadow-lg"
              >
                Create Book
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
