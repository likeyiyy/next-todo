'use client';

import { useState, useEffect } from 'react';
import UnifiedHeader from '../../components/UnifiedHeader';

interface ColorFormat {
  hex: string;
  rgb: string;
  hsl: string;
  hsv: string;
}

interface SavedColor {
  id: string;
  color: string;
  name: string;
  timestamp: number;
}

export default function ColorPickerPage() {
  const [currentColor, setCurrentColor] = useState('#3B82F6');
  const [colorFormats, setColorFormats] = useState<ColorFormat>({
    hex: '#3B82F6',
    rgb: 'rgb(59, 130, 246)',
    hsl: 'hsl(217, 91%, 60%)',
    hsv: 'hsv(217, 76%, 96%)'
  });
  const [savedColors, setSavedColors] = useState<SavedColor[]>([]);
  const [paletteName, setPaletteName] = useState('');
  const [paletteColors, setPaletteColors] = useState<string[]>([]);

  const presetPalettes = [
    {
      name: 'Material Design',
      colors: ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B']
    },
    {
      name: 'Tailwind CSS',
      colors: ['#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E', '#64748B', '#475569']
    },
    {
      name: 'Bootstrap',
      colors: ['#DC3545', '#FD7E14', '#FFC107', '#28A745', '#20C997', '#17A2B8', '#007BFF', '#6610F2', '#E83E8C', '#6C757D', '#343A40', '#F8F9FA']
    },
    {
      name: 'Pastel',
      colors: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E0BBE4', '#FFDFD3', '#D4A5A5', '#A8E6CF', '#FFDAC1', '#FF8B94']
    }
  ];

  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const rgbToHsv = (r: number, g: number, b: number): { h: number; s: number; v: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, v = max;

    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max !== min) {
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100)
    };
  };

  const updateColorFormats = (color: string) => {
    const rgb = hexToRgb(color);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

    setColorFormats({
      hex: color,
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`
    });
  };

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
    updateColorFormats(color);
  };

  const saveColor = () => {
    const newColor: SavedColor = {
      id: Date.now().toString(),
      color: currentColor,
      name: `颜色 ${savedColors.length + 1}`,
      timestamp: Date.now()
    };
    setSavedColors([...savedColors, newColor]);
  };

  const deleteColor = (id: string) => {
    setSavedColors(savedColors.filter(color => color.id !== id));
  };

  const addToPalette = (color: string) => {
    if (!paletteColors.includes(color)) {
      setPaletteColors([...paletteColors, color]);
    }
  };

  const removeFromPalette = (index: number) => {
    setPaletteColors(paletteColors.filter((_, i) => i !== index));
  };

  const savePalette = () => {
    if (paletteName && paletteColors.length > 0) {
      alert(`调色板 "${paletteName}" 已保存！`);
    }
  };

  const exportPalette = () => {
    const data = {
      name: paletteName,
      colors: paletteColors,
      timestamp: Date.now()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${paletteName || 'palette'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const generateComplementary = () => {
    const rgb = hexToRgb(currentColor);
    const comp = {
      r: 255 - rgb.r,
      g: 255 - rgb.g,
      b: 255 - rgb.b
    };
    const compHex = `#${comp.r.toString(16).padStart(2, '0')}${comp.g.toString(16).padStart(2, '0')}${comp.b.toString(16).padStart(2, '0')}`;
    return compHex;
  };

  const generateAnalogous = () => {
    const rgb = hexToRgb(currentColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    const analogous1 = `hsl(${(hsl.h + 30) % 360}, ${hsl.s}%, ${hsl.l}%)`;
    const analogous2 = `hsl(${(hsl.h - 30 + 360) % 360}, ${hsl.s}%, ${hsl.l}%)`;

    return [analogous1, analogous2];
  };

  const generateTriadic = () => {
    const rgb = hexToRgb(currentColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    const triadic1 = `hsl(${(hsl.h + 120) % 360}, ${hsl.s}%, ${hsl.l}%)`;
    const triadic2 = `hsl(${(hsl.h + 240) % 360}, ${hsl.s}%, ${hsl.l}%)`;

    return [triadic1, triadic2];
  };

  useEffect(() => {
    updateColorFormats(currentColor);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Color Picker */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                颜色选择器
              </h3>

              {/* Color Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    选择颜色
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={currentColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="h-12 w-12 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={currentColor}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^#[0-9A-F]{6}$/i.test(value)) {
                          handleColorChange(value);
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                {/* Color Preview */}
                <div className="h-24 rounded-lg border border-gray-300 dark:border-gray-600" style={{ backgroundColor: currentColor }} />

                {/* Color Formats */}
                <div className="space-y-2">
                  {Object.entries(colorFormats).map(([format, value]) => (
                    <div key={format} className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400 w-8 uppercase">
                        {format}
                      </span>
                      <input
                        type="text"
                        value={value}
                        readOnly
                        className="flex-1 px-2 py-1 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded"
                        onClick={(e) => copyToClipboard(value)}
                      />
                      <button
                        onClick={() => copyToClipboard(value)}
                        className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        复制
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={saveColor}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  保存颜色
                </button>
              </div>
            </div>

            {/* Saved Colors */}
            {savedColors.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  保存的颜色
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {savedColors.map((saved) => (
                    <div key={saved.id} className="relative group">
                      <button
                        onClick={() => handleColorChange(saved.color)}
                        className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 hover:scale-105 transition-transform"
                        style={{ backgroundColor: saved.color }}
                        title={saved.color}
                      />
                      <button
                        onClick={() => deleteColor(saved.id)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Color Harmonies */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                色彩和谐
              </h3>

              <div className="space-y-6">
                {/* Complementary */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">互补色</h4>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <div className="h-20 rounded-lg border border-gray-300 dark:border-gray-600" style={{ backgroundColor: currentColor }} />
                      <p className="text-xs text-center mt-1 text-gray-600 dark:text-gray-400">原色</p>
                    </div>
                    <div className="flex-1">
                      <div className="h-20 rounded-lg border border-gray-300 dark:border-gray-600" style={{ backgroundColor: generateComplementary() }} />
                      <p className="text-xs text-center mt-1 text-gray-600 dark:text-gray-400">互补色</p>
                    </div>
                  </div>
                </div>

                {/* Analogous */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">类似色</h4>
                  <div className="flex space-x-4">
                    {generateAnalogous().map((color, index) => (
                      <div key={index} className="flex-1">
                        <div className="h-20 rounded-lg border border-gray-300 dark:border-gray-600" style={{ backgroundColor: color }} />
                        <p className="text-xs text-center mt-1 text-gray-600 dark:text-gray-400">类似色 {index + 1}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Triadic */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">三角色</h4>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <div className="h-20 rounded-lg border border-gray-300 dark:border-gray-600" style={{ backgroundColor: currentColor }} />
                      <p className="text-xs text-center mt-1 text-gray-600 dark:text-gray-400">原色</p>
                    </div>
                    {generateTriadic().map((color, index) => (
                      <div key={index} className="flex-1">
                        <div className="h-20 rounded-lg border border-gray-300 dark:border-gray-600" style={{ backgroundColor: color }} />
                        <p className="text-xs text-center mt-1 text-gray-600 dark:text-gray-400">三角色 {index + 1}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Preset Palettes */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                预设调色板
              </h3>

              <div className="space-y-4">
                {presetPalettes.map((palette) => (
                  <div key={palette.name}>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{palette.name}</h4>
                    <div className="flex flex-wrap gap-2">
                      {palette.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => {
                            handleColorChange(color);
                            addToPalette(color);
                          }}
                          className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Palette */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                自定义调色板
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    调色板名称
                  </label>
                  <input
                    type="text"
                    value={paletteName}
                    onChange={(e) => setPaletteName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="输入调色板名称..."
                  />
                </div>

                {paletteColors.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      颜色列表
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {paletteColors.map((color, index) => (
                        <div key={index} className="relative group">
                          <div
                            className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorChange(color)}
                            title={color}
                          />
                          <button
                            onClick={() => removeFromPalette(index)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => addToPalette(currentColor)}
                    disabled={paletteColors.includes(currentColor)}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    添加当前颜色
                  </button>
                  <button
                    onClick={savePalette}
                    disabled={!paletteName || paletteColors.length === 0}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    保存调色板
                  </button>
                  <button
                    onClick={exportPalette}
                    disabled={paletteColors.length === 0}
                    className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    导出
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}