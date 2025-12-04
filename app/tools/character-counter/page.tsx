'use client';

import { useState, useEffect } from 'react';
import UnifiedHeader from '../../components/UnifiedHeader';

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTime: number;
  speakingTime: number;
}

export default function CharacterCounterPage() {
  const [text, setText] = useState(`欢迎使用字符计数器！

这是一个功能强大的文本分析工具，可以帮你统计各种文本指标。

试试输入一些文本，你会看到：
- 字符数统计
- 单词数统计
- 句子和段落数
- 阅读时间估算
- 说话时间估算

这个工具特别适合写文章、写报告或者做内容创作时使用。`);
  const [stats, setStats] = useState<TextStats>({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    lines: 0,
    readingTime: 0,
    speakingTime: 0
  });

  const calculateStats = (inputText: string): TextStats => {
    // 基本统计
    const characters = inputText.length;
    const charactersNoSpaces = inputText.replace(/\s/g, '').length;
    const lines = inputText ? inputText.split('\n').length : 0;

    // 单词统计（支持中英文）
    const chineseWords = inputText.match(/[\u4e00-\u9fa5]+/g) || [];
    const englishWords = inputText.match(/[a-zA-Z]+/g) || [];
    const words = chineseWords.length + englishWords.length;

    // 句子统计
    const sentences = inputText.split(/[。！？.!?]+/).filter(s => s.trim()).length;

    // 段落统计（空行分隔）
    const paragraphs = inputText.split(/\n\n+/).filter(p => p.trim()).length;

    // 时间估算（基于字符数）
    const readingCharsPerMin = 500; // 中文阅读速度
    const speakingCharsPerMin = 300; // 说话速度
    const readingTime = Math.ceil(characters / readingCharsPerMin);
    const speakingTime = Math.ceil(characters / speakingCharsPerMin);

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      readingTime,
      speakingTime
    };
  };

  useEffect(() => {
    setStats(calculateStats(text));
  }, [text]);

  const handleTextChange = (value: string) => {
    setText(value);
  };

  const clearText = () => {
    setText('');
  };

  const copyStats = () => {
    const statsText = `文本统计结果：
字符数: ${stats.characters}
字符数(不含空格): ${stats.charactersNoSpaces}
单词数: ${stats.words}
句子数: ${stats.sentences}
段落数: ${stats.paragraphs}
行数: ${stats.lines}
阅读时间: ${stats.readingTime} 分钟
说话时间: ${stats.speakingTime} 分钟`;

    navigator.clipboard.writeText(statsText);
  };

  const sampleTexts = [
    {
      name: '短文本示例',
      content: '这是一个简短的示例文本。'
    },
    {
      name: '长文本示例',
      content: `这是一个较长的示例文本。它包含多个句子，用来演示字符计数器的功能。

你可以看到这个段落有更多的内容。这样的示例有助于更好地理解各种统计指标的实际应用。第三个句子进一步增加了文本的复杂性和长度。

最后，这个段落作为示例的结束，展示了完整的文本分析功能。`
    },
    {
      name: '英文示例',
      content: `Hello! This is a sample English text. It demonstrates how the character counter works with different languages.

The tool can handle both English and Chinese text seamlessly. It counts words, sentences, and paragraphs accurately.

This example shows the versatility of the text analysis features.`
    },
    {
      name: '代码示例',
      content: `function hello(name) {
    console.log(\`Hello, \${name}!\`);
    return true;
}

// 这是一个函数示例
const message = "欢迎学习编程！";
hello(message);`
    }
  ];

  const loadSampleText = (sample: typeof sampleTexts[0]) => {
    setText(sample.content);
  };

  const StatCard = ({ title, value, unit = '', color = 'blue' }: {
    title: string;
    value: number | string;
    unit?: string;
    color?: string;
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</div>
      <div className={`text-2xl font-bold text-${color}-600 dark:text-${color}-400`}>
        {value}
        {unit && <span className="text-lg text-gray-500 dark:text-gray-400 ml-1">{unit}</span>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="字符数" value={stats.characters} />
          <StatCard title="字符数(不含空格)" value={stats.charactersNoSpaces} />
          <StatCard title="单词数" value={stats.words} />
          <StatCard title="句子数" value={stats.sentences} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="段落数" value={stats.paragraphs} />
          <StatCard title="行数" value={stats.lines} />
          <StatCard title="阅读时间" value={stats.readingTime} unit="分钟" color="green" />
          <StatCard title="说话时间" value={stats.speakingTime} unit="分钟" color="purple" />
        </div>

        {/* Text Input */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              文本输入
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={copyStats}
                disabled={stats.characters === 0}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                复制统计结果
              </button>
              <button
                onClick={clearText}
                disabled={text.length === 0}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                清空文本
              </button>
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            placeholder="在这里输入或粘贴你要分析的文本..."
          />
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-right">
            当前字符数: {text.length}
          </div>
        </div>

        {/* Sample Texts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            示例文本
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sampleTexts.map((sample) => (
              <button
                key={sample.name}
                onClick={() => loadSampleText(sample)}
                className="text-left px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="font-medium text-gray-900 dark:text-white mb-1">
                  {sample.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {sample.content.substring(0, 50)}...
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              详细统计
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">总字符数</span>
                <span className="font-medium text-gray-900 dark:text-white">{stats.characters}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">字符数(不含空格)</span>
                <span className="font-medium text-gray-900 dark:text-white">{stats.charactersNoSpaces}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">空格数</span>
                <span className="font-medium text-gray-900 dark:text-white">{stats.characters - stats.charactersNoSpaces}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">单词数</span>
                <span className="font-medium text-gray-900 dark:text-white">{stats.words}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">句子数</span>
                <span className="font-medium text-gray-900 dark:text-white">{stats.sentences}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              格式统计
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">段落数</span>
                <span className="font-medium text-gray-900 dark:text-white">{stats.paragraphs}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">行数</span>
                <span className="font-medium text-gray-900 dark:text-white">{stats.lines}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">平均每段单词数</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {stats.paragraphs > 0 ? Math.round(stats.words / stats.paragraphs) : 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">平均每句字符数</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {stats.sentences > 0 ? Math.round(stats.characters / stats.sentences) : 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
            💡 使用提示
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <li>• 支持中英文混合文本的准确统计</li>
            <li>• 阅读时间基于平均阅读速度 500 字符/分钟</li>
            <li>• 说话时间基于平均语速 300 字符/分钟</li>
            <li>• 段落以空行分隔进行统计</li>
            <li>• 适合文章写作、内容创作和学习分析</li>
          </ul>
        </div>
      </main>
    </div>
  );
}