"use client"

import { useState } from 'react'
import UnifiedHeader from '../components/UnifiedHeader'

interface ESQuery {
  title: string
  description: string
  query: string
  category: string
  version: string
}

const esQueries: ESQuery[] = [
  // Basic Queries
  {
    title: 'Match Query',
    description: '全文搜索，会对查询词进行分词处理',
    query: `GET /_search
{
  "query": {
    "match": {
      "title": "Elasticsearch search"
    }
  }
}`,
    category: 'Basic Queries',
    version: 'All'
  },
  {
    title: 'Match Phrase Query',
    description: '精确匹配短语，不分词',
    query: `GET /_search
{
  "query": {
    "match_phrase": {
      "title": "Quick brown fox"
    }
  }
}`,
    category: 'Basic Queries',
    version: 'All'
  },
  {
    title: 'Term Query',
    description: '精确匹配，不分词，适合keyword类型',
    query: `GET /_search
{
  "query": {
    "term": {
      "status": "published"
    }
  }
}`,
    category: 'Basic Queries',
    version: 'All'
  },
  {
    title: 'Terms Query',
    description: '匹配多个值中的任意一个',
    query: `GET /_search
{
  "query": {
    "terms": {
      "tags": ["elasticsearch", "search", "nosql"]
    }
  }
}`,
    category: 'Basic Queries',
    version: 'All'
  },
  {
    title: 'Range Query',
    description: '范围查询',
    query: `GET /_search
{
  "query": {
    "range": {
      "price": {
        "gte": 100,
        "lte": 200
      }
    }
  }
}`,
    category: 'Basic Queries',
    version: 'All'
  },
  {
    title: 'Exists Query',
    description: '查找存在某个字段的文档',
    query: `GET /_search
{
  "query": {
    "exists": {
      "field": "email"
    }
  }
}`,
    category: 'Basic Queries',
    version: 'All'
  },
  {
    title: 'Wildcard Query',
    description: '通配符查询',
    query: `GET /_search
{
  "query": {
    "wildcard": {
      "name": "J*hn"
    }
  }
}`,
    category: 'Basic Queries',
    version: 'All'
  },
  {
    title: 'Regexp Query',
    description: '正则表达式查询',
    query: `GET /_search
{
  "query": {
    "regexp": {
      "name": "joh?n"
    }
  }
}`,
    category: 'Basic Queries',
    version: 'All'
  },

  // Compound Queries
  {
    title: 'Bool Query - Must',
    description: 'AND 查询，必须匹配所有条件',
    query: `GET /_search
{
  "query": {
    "bool": {
      "must": [
        { "match": { "title": "search" } },
        { "match": { "content": "elasticsearch" } }
      ]
    }
  }
}`,
    category: 'Compound Queries',
    version: 'All'
  },
  {
    title: 'Bool Query - Should',
    description: 'OR 查询，匹配任意条件',
    query: `GET /_search
{
  "query": {
    "bool": {
      "should": [
        { "match": { "title": "elasticsearch" } },
        { "match": { "title": "solr" } }
      ]
    }
  }
}`,
    category: 'Compound Queries',
    version: 'All'
  },
  {
    title: 'Bool Query - Must Not',
    description: 'NOT 查询，不能匹配的条件',
    query: `GET /_search
{
  "query": {
    "bool": {
      "must": [
        { "match": { "title": "search" } }
      ],
      "must_not": [
        { "term": { "status": "deleted" } }
      ]
    }
  }
}`,
    category: 'Compound Queries',
    version: 'All'
  },
  {
    title: 'Bool Query - Filter',
    description: '过滤条件，不计算相关性分数',
    query: `GET /_search
{
  "query": {
    "bool": {
      "must": { "match": { "title": "search" } },
      "filter": {
        "range": { "date": { "gte": "2024-01-01" } }
      }
    }
  }
}`,
    category: 'Compound Queries',
    version: 'All'
  },
  {
    title: 'Minimum Should Match',
    description: '设置最少匹配条件数',
    query: `GET /_search
{
  "query": {
    "bool": {
      "should": [
        { "match": { "title": "elasticsearch" } },
        { "match": { "title": "search" } },
        { "match": { "title": "engine" } }
      ],
      "minimum_should_match": 2
    }
  }
}`,
    category: 'Compound Queries',
    version: 'All'
  },

  // Aggregations
  {
    title: 'Terms Aggregation',
    description: '按字段值分组统计',
    query: `GET /_search
{
  "size": 0,
  "aggs": {
    "group_by_status": {
      "terms": {
        "field": "status.keyword",
        "size": 10
      }
    }
  }
}`,
    category: 'Aggregations',
    version: 'All'
  },
  {
    title: 'Date Histogram',
    description: '按时间间隔分组',
    query: `GET /_search
{
  "size": 0,
  "aggs": {
    "daily_sales": {
      "date_histogram": {
        "field": "date",
        "calendar_interval": "day"
      }
    }
  }
}`,
    category: 'Aggregations',
    version: 'All'
  },
  {
    title: 'Range Aggregation',
    description: '范围分组统计',
    query: `GET /_search
{
  "size": 0,
  "aggs": {
    "price_ranges": {
      "range": {
        "field": "price",
        "ranges": [
          { "to": 100 },
          { "from": 100, "to": 200 },
          { "from": 200 }
        ]
      }
    }
  }
}`,
    category: 'Aggregations',
    version: 'All'
  },
  {
    title: 'Average Aggregation',
    description: '计算平均值',
    query: `GET /_search
{
  "size": 0,
  "aggs": {
    "avg_price": {
      "avg": {
        "field": "price"
      }
    }
  }
}`,
    category: 'Aggregations',
    version: 'All'
  },
  {
    title: 'Stats Aggregation',
    description: '基础统计信息',
    query: `GET /_search
{
  "size": 0,
  "aggs": {
    "price_stats": {
      "stats": {
        "field": "price"
      }
    }
  }
}`,
    category: 'Aggregations',
    version: 'All'
  },

  // Full Text
  {
    title: 'Multi Match Query',
    description: '在多个字段中搜索',
    query: `GET /_search
{
  "query": {
    "multi_match": {
      "query": "elasticsearch search",
      "fields": ["title", "content", "description"]
    }
  }
}`,
    category: 'Full Text',
    version: 'All'
  },
  {
    title: 'Multi Match - Best Fields',
    description: '取最佳匹配字段的分数',
    query: `GET /_search
{
  "query": {
    "multi_match": {
      "query": "elasticsearch",
      "fields": ["title^3", "content"],
      "type": "best_fields"
    }
  }
}`,
    category: 'Full Text',
    version: 'All'
  },
  {
    title: 'Query String',
    description: '支持Lucene查询语法',
    query: `GET /_search
{
  "query": {
    "query_string": {
      "query": "title:(elasticsearch OR search) AND status:published"
    }
  }
}`,
    category: 'Full Text',
    version: 'All'
  },
  {
    title: 'Simple Query String',
    description: '更安全的查询字符串语法',
    query: `GET /_search
{
  "query": {
    "simple_query_string": {
      "query": "elasticsearch +search -deprecated",
      "fields": ["title", "content"]
    }
  }
}`,
    category: 'Full Text',
    version: 'All'
  },

  // Sorting
  {
    title: 'Basic Sorting',
    description: '按字段排序',
    query: `GET /_search
{
  "query": { "match_all": {} },
  "sort": [
    { "date": { "order": "desc" } },
    { "name": { "order": "asc" } }
  ]
}`,
    category: 'Sorting',
    version: 'All'
  },
  {
    title: 'Score Sorting',
    description: '按相关性分数排序',
    query: `GET /_search
{
  "query": { "match": { "title": "elasticsearch" } },
  "sort": [
    { "_score": { "order": "desc" } },
    { "date": { "order": "desc" } }
  ]
}`,
    category: 'Sorting',
    version: 'All'
  },

  // Pagination
  {
    title: 'From/Size Pagination',
    description: '基础分页',
    query: `GET /_search
{
  "query": { "match_all": {} },
  "from": 10,
  "size": 20
}`,
    category: 'Pagination',
    version: 'All'
  },
  {
    title: 'Search After',
    description: '深度分页优化方案',
    query: `GET /_search
{
  "query": { "match_all": {} },
  "size": 20,
  "sort": [
    { "date": "asc" },
    { "_id": "asc" }
  ],
  "search_after": ["2024-01-01T00:00:00", "doc_id_123"]
}`,
    category: 'Pagination',
    version: 'All'
  },

  // Highlight
  {
    title: 'Basic Highlight',
    description: '高亮匹配文本',
    query: `GET /_search
{
  "query": { "match": { "content": "elasticsearch" } },
  "highlight": {
    "fields": {
      "content": {}
    }
  }
}`,
    category: 'Highlight',
    version: 'All'
  },
  {
    title: 'Custom Highlight',
    description: '自定义高亮标签',
    query: `GET /_search
{
  "query": { "match": { "content": "elasticsearch" } },
  "highlight": {
    "pre_tags": ["<mark>"],
    "post_tags": ["</mark>"],
    "fields": {
      "content": {
        "fragment_size": 150,
        "number_of_fragments": 3
      }
    }
  }
}`,
    category: 'Highlight',
    version: 'All'
  },

  // Nested/Join
  {
    title: 'Nested Query',
    description: '查询嵌套对象',
    query: `GET /_search
{
  "query": {
    "nested": {
      "path": "comments",
      "query": {
        "match": {
          "comments.message": "elasticsearch"
        }
      }
    }
  }
}`,
    category: 'Advanced',
    version: 'All'
  },
  {
    title: 'Has Child Query',
    description: '查询有特定子文档的父文档',
    query: `GET /_search
{
  "query": {
    "has_child": {
      "type": "comment",
      "query": {
        "match": {
          "message": "important"
        }
      }
    }
  }
}`,
    category: 'Advanced',
    version: 'All'
  },

  // Scripting
  {
    title: 'Script Query',
    description: '使用脚本查询',
    query: `GET /_search
{
  "query": {
    "script": {
      "script": {
        "source": "doc['price'].value > params.min_price",
        "params": {
          "min_price": 100
        }
      }
    }
  }
}`,
    category: 'Scripting',
    version: 'All'
  },
  {
    title: 'Script Field',
    description: '返回脚本计算的字段',
    query: `GET /_search
{
  "query": { "match_all": {} },
  "script_fields": {
    "discounted_price": {
      "script": {
        "source": "doc['price'].value * 0.9"
      }
    }
  }
}`,
    category: 'Scripting',
    version: 'All'
  },

  // Update/Delete
  {
    title: 'Update by Query',
    description: '批量更新文档',
    query: `POST /my-index/_update_by_query
{
  "query": {
    "term": { "status": "draft" }
  },
  "script": {
    "source": "ctx._source.status = 'published'"
  }
}`,
    category: 'Update/Delete',
    version: 'All'
  },
  {
    title: 'Delete by Query',
    description: '批量删除文档',
    query: `POST /my-index/_delete_by_query
{
  "query": {
    "range": {
      "date": {
        "lt": "2024-01-01"
      }
    }
  }
}`,
    category: 'Update/Delete',
    version: 'All'
  },

  // Index Templates
  {
    title: 'Create Index Template',
    description: '创建索引模板',
    query: `PUT /_index_template/my_template
{
  "index_patterns": ["logs-*"],
  "template": {
    "settings": {
      "number_of_shards": 3,
      "number_of_replicas": 1
    },
    "mappings": {
      "properties": {
        "@timestamp": { "type": "date" },
        "level": { "type": "keyword" },
        "message": { "type": "text" }
      }
    }
  }
}`,
    category: 'Index Management',
    version: '7.x+'
  },

  // Ingest Pipeline
  {
    title: 'Create Ingest Pipeline',
    description: '创建数据预处理管道',
    query: `PUT /_ingest/pipeline/timestamp
{
  "description": "Adds timestamp field",
  "processors": [
    {
      "set": {
        "field": "@timestamp",
        "value": "{{_ingest.timestamp}}"
      }
    }
  ]
}`,
    category: 'Ingest Pipeline',
    version: '5.x+'
  },
  {
    title: 'Use Pipeline',
    description: '使用管道处理数据',
    query: `POST /my-index/_doc/1?pipeline=timestamp
{
  "message": "This is a log message"
}`,
    category: 'Ingest Pipeline',
    version: '5.x+'
  }
]

const categories = [
  'All',
  'Basic Queries',
  'Compound Queries',
  'Aggregations',
  'Full Text',
  'Sorting',
  'Pagination',
  'Highlight',
  'Advanced',
  'Scripting',
  'Update/Delete',
  'Index Management',
  'Ingest Pipeline'
]

const versions = ['All', 'All', '7.x+', '5.x+']

export default function ElasticsearchCheatsheet() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const filteredQueries = esQueries.filter(query => {
    const matchesCategory = selectedCategory === 'All' || query.category === selectedCategory
    const matchesSearch = query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const copyQuery = async (query: string, index: number) => {
    try {
      await navigator.clipboard.writeText(query)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Elasticsearch 查询速查手册
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            常用的 Elasticsearch 查询语法和 API 快速参考
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="搜索查询..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Query Cards */}
        <div className="grid grid-cols-1 gap-6">
          {filteredQueries.map((query, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    {query.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {query.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded">
                    {query.category}
                  </span>
                  {query.version !== 'All' && (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded">
                      {query.version}
                    </span>
                  )}
                </div>
              </div>

              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">{query.query}</code>
                </pre>
                <button
                  onClick={() => copyQuery(query.query, index)}
                  className="absolute top-2 right-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors"
                >
                  {copiedIndex === index ? '已复制!' : '复制查询'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredQueries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              没有找到匹配的查询
            </p>
          </div>
        )}

        {/* Quick Reference */}
        <div className="mt-12 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            快速参考
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">常用 API</h3>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">GET /_search</code> - 搜索文档</li>
                <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">PUT /index/_doc/1</code> - 创建/更新文档</li>
                <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">GET /index/_doc/1</code> - 获取文档</li>
                <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">DELETE /index/_doc/1</code> - 删除文档</li>
                <li><code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">GET /index/_mapping</code> - 查看映射</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">查询类型对比</h3>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li><strong>match:</strong> 分词搜索，适合text类型</li>
                <li><strong>term:</strong> 精确匹配，适合keyword类型</li>
                <li><strong>range:</strong> 范围查询(gte, lte, gt, lt)</li>
                <li><strong>wildcard:</strong> 通配符(*, ?)</li>
                <li><strong>fuzzy:</strong> 模糊搜索</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Bool 查询子句</h3>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li><strong>must:</strong> 必须匹配(AND)</li>
                <li><strong>should:</strong> 应该匹配(OR)</li>
                <li><strong>must_not:</strong> 必须不匹配(NOT)</li>
                <li><strong>filter:</strong> 过滤(不评分)</li>
                <li><strong>minimum_should_match:</strong> 最少匹配数</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">性能优化提示</h3>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>• 使用 filter 而不是 must 来提高性能（不计算相关性分数）</li>
              <li>• 深度分页使用 search_after 而不是 from/size</li>
              <li>• 避免使用 wildcard 开头的通配符查询</li>
              <li>• 合理使用 index.mapping.total_fields.limit 限制字段数</li>
              <li>• 使用 index.max_result_window 控制返回结果数</li>
            </ul>
          </div>
        </div>

        {/* More Resources */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            需要更详细的文档？访问{' '}
            <a
              href="https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Elasticsearch 官方文档
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}