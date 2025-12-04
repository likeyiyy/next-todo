'use client';

import { useState, useRef, ChangeEvent } from 'react';
import UnifiedHeader from '../../components/UnifiedHeader';

interface CompressedImage {
  original: File;
  compressed: string;
  originalSize: number;
  compressedSize: number;
  originalUrl: string;
  compressedUrl: string;
  format: string;
  quality: number;
  timestamp: number;
}

export default function ImageCompressorPage() {
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [quality, setQuality] = useState(0.8);
  const [format, setFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateCompressionRatio = (original: number, compressed: number): number => {
    return Math.round(((original - compressed) / original) * 100);
  };

  const compressImage = (file: File, targetQuality: number, targetFormat: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('无法获取 canvas context'));
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;

          // 设置白色背景（针对 JPEG）
          if (targetFormat === 'jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
              } else {
                reject(new Error('压缩失败'));
              }
            },
            `image/${targetFormat}`,
            targetQuality
          );
        };
        img.onerror = () => reject(new Error('图片加载失败'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsProcessing(true);

    try {
      const newImages: CompressedImage[] = [];

      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          alert(`文件 ${file.name} 不是图片格式`);
          continue;
        }

        try {
          const originalUrl = URL.createObjectURL(file);
          const compressed = await compressImage(file, quality, format);
          const compressedSize = Math.round((compressed.length - 'data:image/jpeg;base64,'.length) * 0.75);

          newImages.push({
            original: file,
            compressed,
            originalSize: file.size,
            compressedSize,
            originalUrl,
            compressedUrl: compressed,
            format,
            quality,
            timestamp: Date.now()
          });
        } catch (error) {
          console.error(`压缩图片 ${file.name} 失败:`, error);
          alert(`压缩图片 ${file.name} 失败`);
        }
      }

      setImages([...images, ...newImages]);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const event = {
      target: { files }
    } as ChangeEvent<HTMLInputElement>;
    handleFileSelect(event);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const downloadImage = (image: CompressedImage) => {
    const link = document.createElement('a');
    link.href = image.compressed;
    const originalName = image.original.name.split('.')[0];
    link.download = `${originalName}_compressed.${image.format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllImages = () => {
    images.forEach((image, index) => {
      setTimeout(() => downloadImage(image), index * 100);
    });
  };

  const deleteImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    images.forEach(image => {
      URL.revokeObjectURL(image.originalUrl);
    });
    setImages([]);
  };

  const recompressAll = async () => {
    if (images.length === 0) return;

    setIsProcessing(true);
    try {
      const recompressed = await Promise.all(
        images.map(async (image) => {
          const compressed = await compressImage(image.original, quality, format);
          const compressedSize = Math.round((compressed.length - 'data:image/jpeg;base64,'.length) * 0.75);

          return {
            ...image,
            compressed,
            compressedSize,
            format,
            quality,
            timestamp: Date.now()
          };
        })
      );
      setImages(recompressed);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Quality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                压缩质量: {Math.round(quality * 100)}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={quality * 100}
                onChange={(e) => setQuality(parseInt(e.target.value) / 100)}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>低质量</span>
                <span>高质量</span>
              </div>
            </div>

            {/* Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                输出格式
              </label>
              <div className="flex space-x-2">
                {(['jpeg', 'png', 'webp'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors ${
                      format === fmt
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {fmt.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                批量操作
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={recompressAll}
                  disabled={images.length === 0 || isProcessing}
                  className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isProcessing ? '处理中...' : '重新压缩'}
                </button>
                <button
                  onClick={downloadAllImages}
                  disabled={images.length === 0}
                  className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  下载全部
                </button>
                <button
                  onClick={clearAll}
                  disabled={images.length === 0}
                  className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  清空
                </button>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="cursor-pointer inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              选择图片或拖拽到此处
            </label>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              支持 JPG、PNG、WebP 格式，可同时选择多张图片
            </p>
          </div>
        </div>

        {/* Images Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <div key={image.timestamp} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Image Preview */}
                <div className="relative">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="relative group">
                      <img
                        src={image.originalUrl}
                        alt="原始图片"
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs">原始</span>
                      </div>
                    </div>
                    <div className="relative group">
                      <img
                        src={image.compressedUrl}
                        alt="压缩后"
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs">压缩后</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {image.original.name}
                    </h4>
                    <button
                      onClick={() => deleteImage(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <div className="flex justify-between">
                      <span>原始:</span>
                      <span>{formatFileSize(image.originalSize)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>压缩后:</span>
                      <span>{formatFileSize(image.compressedSize)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>压缩率:</span>
                      <span className={calculateCompressionRatio(image.originalSize, image.compressedSize) > 0 ? 'text-green-600' : 'text-red-600'}>
                        {calculateCompressionRatio(image.originalSize, image.compressedSize)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>格式:</span>
                      <span>{image.format.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>质量:</span>
                      <span>{Math.round(image.quality * 100)}%</span>
                    </div>
                  </div>

                  <button
                    onClick={() => downloadImage(image)}
                    className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    下载压缩图片
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {images.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">还没有图片，上传图片开始压缩吧！</p>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
            💡 图片压缩建议
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <li>• <strong>JPEG:</strong> 适合照片，文件小，但有损压缩</li>
            <li>• <strong>PNG:</strong> 适合图标、透明图片，无损压缩但文件较大</li>
            <li>• <strong>WebP:</strong> 现代格式，兼顾质量和大小，但兼容性稍差</li>
            <li>• 质量设置 60-80% 通常能获得较好的压缩效果</li>
            <li>• 批量处理可以节省大量时间</li>
          </ul>
        </div>
      </main>
    </div>
  );
}