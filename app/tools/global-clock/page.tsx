'use client';

import { useEffect, useState } from 'react';
import UnifiedHeader from '../../components/UnifiedHeader';

interface CityTime {
  city: string;
  timezone: string;
  time: string;
  date: string;
  country: string;
}

const CITIES = [
  { city: '北京', timezone: 'Asia/Shanghai', country: '中国' },
  { city: '东京', timezone: 'Asia/Tokyo', country: '日本' },
  { city: '首尔', timezone: 'Asia/Seoul', country: '韩国' },
  { city: '新加坡', timezone: 'Asia/Singapore', country: '新加坡' },
  { city: '曼谷', timezone: 'Asia/Bangkok', country: '泰国' },
  { city: '迪拜', timezone: 'Asia/Dubai', country: '阿联酋' },
  { city: '莫斯科', timezone: 'Europe/Moscow', country: '俄罗斯' },
  { city: '伦敦', timezone: 'Europe/London', country: '英国' },
  { city: '巴黎', timezone: 'Europe/Paris', country: '法国' },
  { city: '柏林', timezone: 'Europe/Berlin', country: '德国' },
  { city: '罗马', timezone: 'Europe/Rome', country: '意大利' },
  { city: '马德里', timezone: 'Europe/Madrid', country: '西班牙' },
  { city: '纽约', timezone: 'America/New_York', country: '美国' },
  { city: '洛杉矶', timezone: 'America/Los_Angeles', country: '美国' },
  { city: '芝加哥', timezone: 'America/Chicago', country: '美国' },
  { city: '多伦多', timezone: 'America/Toronto', country: '加拿大' },
  { city: '墨西哥城', timezone: 'America/Mexico_City', country: '墨西哥' },
  { city: '圣保罗', timezone: 'America/Sao_Paulo', country: '巴西' },
  { city: '布宜诺斯艾利斯', timezone: 'America/Argentina/Buenos_Aires', country: '阿根廷' },
  { city: '悉尼', timezone: 'Australia/Sydney', country: '澳大利亚' },
  { city: '墨尔本', timezone: 'Australia/Melbourne', country: '澳大利亚' },
  { city: '奥克兰', timezone: 'Pacific/Auckland', country: '新西兰' },
];

export default function GlobalClockPage() {
  const [cityTimes, setCityTimes] = useState<CityTime[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatTime = (date: Date, timezone: string) => {
    return new Intl.DateTimeFormat('zh-CN', {
      timeZone: timezone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  const formatDate = (date: Date, timezone: string) => {
    return new Intl.DateTimeFormat('zh-CN', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short',
    }).format(date);
  };

  const updateTimes = () => {
    const now = new Date();
    const times = CITIES.map(({ city, timezone, country }) => ({
      city,
      timezone,
      country,
      time: formatTime(now, timezone),
      date: formatDate(now, timezone),
    }));
    setCityTimes(times);
    setIsLoading(false);
  };

  useEffect(() => {
    // 立即更新一次
    updateTimes();

    // 每秒更新一次
    const interval = setInterval(updateTimes, 1000);

    return () => clearInterval(interval);
  }, []);

  const getRegionColor = (timezone: string) => {
    if (timezone.startsWith('Asia/')) return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700';
    if (timezone.startsWith('Europe/')) return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700';
    if (timezone.startsWith('America/')) return 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-700';
    if (timezone.startsWith('Australia/') || timezone.startsWith('Pacific/')) return 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-700';
    return 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-700';
  };

  const getRegionLabel = (timezone: string) => {
    if (timezone.startsWith('Asia/')) return '亚洲';
    if (timezone.startsWith('Europe/')) return '欧洲';
    if (timezone.startsWith('America/')) return '美洲';
    if (timezone.startsWith('Australia/') || timezone.startsWith('Pacific/')) return '大洋洲';
    return '其他';
  };

  // 按地区分组
  const groupedCities = CITIES.reduce((acc, city) => {
    const region = getRegionLabel(city.timezone);
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(city);
    return acc;
  }, {} as Record<string, typeof CITIES>);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            全球时钟
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            实时显示全球主要城市的当前时间
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">加载中...</span>
          </div>
        )}

        {/* Clock Grid */}
        {!isLoading && (
          <div className="space-y-8">
            {Object.entries(groupedCities).map(([region, cities]) => (
              <div key={region}>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    region === '亚洲' ? 'bg-blue-500' :
                    region === '欧洲' ? 'bg-green-500' :
                    region === '美洲' ? 'bg-purple-500' :
                    region === '大洋洲' ? 'bg-orange-500' : 'bg-gray-500'
                  }`}></div>
                  {region}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {cities.map((cityInfo) => {
                    const cityTime = cityTimes.find(ct => ct.city === cityInfo.city);
                    if (!cityTime) return null;

                    return (
                      <div
                        key={cityInfo.city}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${getRegionColor(cityInfo.timezone)}`}
                      >
                        <div className="text-center">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {cityInfo.city}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {cityInfo.country}
                          </p>
                          <div className="text-2xl font-mono font-bold text-gray-800 dark:text-gray-200 mb-2">
                            {cityTime.time}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {cityTime.date}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>时间每秒钟自动更新 • 基于浏览器本地时间计算</p>
        </div>
      </main>
    </div>
  );
}
