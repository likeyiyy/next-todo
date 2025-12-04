'use client';

import { useState, useEffect } from 'react';
import UnifiedHeader from '../../components/UnifiedHeader';

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false
  });

  const characterSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    similar: 'ilLIoO1',
    ambiguous: '{}[]()\/\'"`~,;.<>'
  };

  const generatePassword = () => {
    let chars = '';
    let guaranteedChars = [];

    // 构建字符集
    if (options.uppercase) {
      chars += characterSets.uppercase;
      guaranteedChars.push(characterSets.uppercase[Math.floor(Math.random() * characterSets.uppercase.length)]);
    }
    if (options.lowercase) {
      chars += characterSets.lowercase;
      guaranteedChars.push(characterSets.lowercase[Math.floor(Math.random() * characterSets.lowercase.length)]);
    }
    if (options.numbers) {
      chars += characterSets.numbers;
      guaranteedChars.push(characterSets.numbers[Math.floor(Math.random() * characterSets.numbers.length)]);
    }
    if (options.symbols) {
      chars += characterSets.symbols;
      guaranteedChars.push(characterSets.symbols[Math.floor(Math.random() * characterSets.symbols.length)]);
    }

    // 移除相似字符
    if (options.excludeSimilar) {
      chars = chars.split('').filter(char => !characterSets.similar.includes(char)).join('');
    }

    // 移除歧义字符
    if (options.excludeAmbiguous) {
      chars = chars.split('').filter(char => !characterSets.ambiguous.includes(char)).join('');
    }

    if (chars === '') {
      setPassword('请至少选择一种字符类型');
      return;
    }

    // 生成密码
    let newPassword = '';

    // 确保每种选中的字符类型至少出现一次
    for (let i = 0; i < guaranteedChars.length && i < length; i++) {
      newPassword += guaranteedChars[i];
    }

    // 填充剩余长度
    for (let i = guaranteedChars.length; i < length; i++) {
      newPassword += chars[Math.floor(Math.random() * chars.length)];
    }

    // 打乱密码字符顺序
    newPassword = newPassword.split('').sort(() => Math.random() - 0.5).join('');

    setPassword(newPassword);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password).then(() => {
      // 可以添加提示
    });
  };

  const checkStrength = (pwd: string) => {
    if (!pwd) return { score: 0, text: '无密码', color: 'bg-gray-300' };

    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (pwd.length >= 16) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;

    if (score < 3) return { score, text: '弱', color: 'bg-red-500' };
    if (score < 5) return { score, text: '中等', color: 'bg-yellow-500' };
    if (score < 7) return { score, text: '强', color: 'bg-blue-500' };
    return { score, text: '非常强', color: 'bg-green-500' };
  };

  const strength = checkStrength(password);

  useEffect(() => {
    generatePassword();
  }, []);

  useEffect(() => {
    if (password && password !== '请至少选择一种字符类型') {
      generatePassword();
    }
  }, [length, options]);

  const handleOptionChange = (option: keyof typeof options) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const passwordPresets = [
    { name: 'PIN码 (4位)', length: 4, options: { ...options, uppercase: false, lowercase: false, symbols: false } },
    { name: '简单密码 (8位)', length: 8, options: { ...options, symbols: false } },
    { name: '标准密码 (12位)', length: 12, options },
    { name: '强密码 (16位)', length: 16, options },
    { name: '超强密码 (32位)', length: 32, options }
  ];

  const applyPreset = (preset: typeof passwordPresets[0]) => {
    setLength(preset.length);
    setOptions(preset.options);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Generated Password */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                生成的密码
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={password}
                  readOnly
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-lg"
                />
                <button
                  onClick={copyToClipboard}
                  disabled={!password || password === '请至少选择一种字符类型'}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  复制
                </button>
                <button
                  onClick={generatePassword}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  重新生成
                </button>
              </div>
            </div>

            {/* Password Strength */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  密码强度
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {strength.text}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`${strength.color} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${(strength.score / 7) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Password Options */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              密码选项
            </h3>

            {/* Length */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                密码长度: {length}
              </label>
              <input
                type="range"
                min="4"
                max="64"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>4</span>
                <span>64</span>
              </div>
            </div>

            {/* Character Types */}
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.uppercase}
                  onChange={() => handleOptionChange('uppercase')}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">大写字母 (A-Z)</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.lowercase}
                  onChange={() => handleOptionChange('lowercase')}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">小写字母 (a-z)</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.numbers}
                  onChange={() => handleOptionChange('numbers')}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">数字 (0-9)</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.symbols}
                  onChange={() => handleOptionChange('symbols')}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">符号 (!@#$%...)</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.excludeSimilar}
                  onChange={() => handleOptionChange('excludeSimilar')}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">排除相似字符 (il1Lo0O)</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.excludeAmbiguous}
                  onChange={() => handleOptionChange('excludeAmbiguous')}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">排除歧义字符 ({}`[]()'"`)</span>
              </label>
            </div>
          </div>

          {/* Presets */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              快速预设
            </h3>
            <div className="space-y-3">
              {passwordPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="w-full text-left px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {preset.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    长度: {preset.length} |
                    {preset.options.uppercase && ' 大写'}
                    {preset.options.lowercase && ' 小写'}
                    {preset.options.numbers && ' 数字'}
                    {preset.options.symbols && ' 符号'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-900 dark:text-yellow-300 mb-2">
            🔒 密码安全建议
          </h3>
          <ul className="text-sm text-yellow-800 dark:text-yellow-400 space-y-1">
            <li>• 使用至少12位的密码长度</li>
            <li>• 包含大小写字母、数字和特殊字符</li>
            <li>• 避免使用个人信息、生日、姓名等</li>
            <li>• 不同网站使用不同的密码</li>
            <li>• 定期更新重要账户的密码</li>
            <li>• 使用密码管理器来安全存储密码</li>
          </ul>
        </div>
      </main>
    </div>
  );
}