import React from 'react';
import { useTheme, THEMES, ThemeId } from '../../context/ThemeContext';
import { X, Check, Palette, Sparkles } from 'lucide-react';

export const ThemePickerModal: React.FC = () => {
  const { theme, setTheme, isPickerOpen, setIsPickerOpen } = useTheme();

  if (!isPickerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white px-6 py-5 flex items-center justify-between shadow-md flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-xl shadow-inner border border-amber-300">
              🎨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg tracking-wide text-white">Visual Theme Customizer</h3>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  9 Themes
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium">
                Customize KissanConnect appearance. Changes apply instantly and save automatically.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPickerOpen(false)}
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
            title="Close Customizer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Theme Grid */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" /> Select Your Preferred Theme:
            </span>
            <span className="text-xs font-bold text-slate-400">Instant Preview</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {THEMES.map((t) => {
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={`group text-left p-4 rounded-2xl border-2 transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 ring-2 ring-emerald-400/40 shadow-lg scale-[1.02]'
                      : 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 bg-white dark:bg-slate-900 hover:shadow-md'
                  }`}
                >
                  {/* Selected Badge Indicator */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md animate-pulse">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}

                  <div>
                    {/* Header Icon + Name */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{t.icon}</span>
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {t.name}
                      </span>
                    </div>

                    {/* Gradient Color Swatches */}
                    <div className={`h-12 w-full rounded-xl bg-gradient-to-r ${t.bgGradient} p-2 flex items-center justify-end gap-1.5 shadow-inner mb-3`}>
                      {t.previewColors.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-5 h-5 rounded-full border-2 border-white/60 shadow-xs"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    {/* Description */}
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                      {t.description}
                    </p>
                  </div>

                  {/* Active Label */}
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-extrabold flex items-center justify-between">
                    <span className={isSelected ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'}>
                      {isSelected ? '✓ Active Theme' : 'Click to Apply'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">data-theme="{t.id}"</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-950 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 font-bold flex-shrink-0">
          <span>🌾 KissanConnect Theme Engine</span>
          <button
            type="button"
            onClick={() => setIsPickerOpen(false)}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-md transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
