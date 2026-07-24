import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  BookOpen,
  Sparkles,
  HelpCircle,
  X,
  Filter,
  MessageSquare,
  ArrowRight,
  RefreshCw,
  Ticket as TicketIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import {
  ArticleCategory,
  KBArticle,
} from '../types/knowledgeBase';
import { knowledgeBaseService } from '../services/api';
import { CategoryCard } from '../components/kb/CategoryCard';
import { ArticleCard } from '../components/kb/ArticleCard';
import { ArticleDetailModal } from '../components/kb/ArticleDetailModal';
import { Button } from '../components/ui/Button';

// Rich Mock Articles Data
const mockArticles: KBArticle[] = [
  {
    id: 'kb-1',
    slug: 'quickstart-api-authentication-keys',
    title: 'Quickstart Guide: API Authentication & Service Account Keys',
    summary: 'Learn how to generate, rotate, and securely configure API keys and OAuth tokens for backend integrations.',
    category: 'Getting Started',
    content: `
      <h1>Quickstart: API Authentication</h1>
      <p>Our platform uses <strong>Bearer Bearer tokens</strong> and OAuth 2.0 signatures to authenticate all server API calls.</p>
      
      <h2>1. Generating your first API Key</h2>
      <p>Navigate to <code>Settings &gt; API &amp; Configuration</code> in your dashboard sidebar. Click <strong>"Create API Key"</strong> and assign the necessary scopes (e.g., <code>read:tickets</code>, <code>write:comments</code>).</p>

      <h2>2. Sending requests</h2>
      <p>Include your bearer key in the standard <code>Authorization</code> header for all REST HTTP calls:</p>

      <pre><code>curl -X GET "https://api.enterprise-support.com/v1/tickets" \\
  -H "Authorization: Bearer sk_live_51M..." \\
  -H "Content-Type: application/json"</code></pre>

      <blockquote>
        <strong>Security Notice:</strong> Never commit API secret keys into public client repositories or expose them directly in browser source files.
      </blockquote>

      <h2>3. Environment Configuration</h2>
      <p>Store your key in a localized <code>.env</code> file:</p>
      <pre><code>VITE_API_URL=https://api.enterprise-support.com/v1
SUPPORT_API_KEY=sk_live_51M...</code></pre>
    `,
    author: { name: 'Sarah Jenkins', role: 'Lead Platform Architect' },
    readTime: '3 min read',
    views: 1240,
    helpfulCount: 142,
    unhelpfulCount: 4,
    createdAt: '2026-07-01',
    updatedAt: '2026-07-20',
    tags: ['api', 'authentication', 'quickstart', 'keys'],
    featured: true,
  },
  {
    id: 'kb-2',
    slug: 'billing-invoices-and-seat-allocations',
    title: 'Managing Billing, Invoices, and Support Agent Seats',
    summary: 'How to add or remove team agent seats, update credit card details, and download monthly VAT invoices.',
    category: 'Billing & Subscription',
    content: `
      <h1>Billing &amp; Subscription Management</h1>
      <p>Managing seat counts and payment details is simple from the billing portal.</p>

      <h2>Updating Payment Methods</h2>
      <p>We support Visa, Mastercard, American Express, and direct SEPA invoice transfers for enterprise tiers.</p>
      
      <h2>Adding Support Team Seats</h2>
      <ul>
        <li>Go to <strong>Settings &gt; Billing</strong></li>
        <li>Select <strong>Manage Seats</strong></li>
        <li>Increase the active count. Additional seats are pro-rated instantly for the remainder of the billing cycle.</li>
      </ul>

      <h2>Downloading Past Tax Invoices</h2>
      <p>Invoices are generated automatically on the 1st of every month in PDF format with standard tax breakdowns.</p>
    `,
    author: { name: 'Michael Chen', role: 'Operations & Billing Manager' },
    readTime: '4 min read',
    views: 890,
    helpfulCount: 98,
    unhelpfulCount: 2,
    createdAt: '2026-06-15',
    updatedAt: '2026-07-18',
    tags: ['billing', 'invoices', 'seats', 'stripe'],
    featured: false,
  },
  {
    id: 'kb-3',
    slug: 'webhook-event-listeners-and-payloads',
    title: 'Configuring Webhook Subscriptions and Retries',
    summary: 'Receive real-time automated HTTP POST payloads whenever a ticket is opened, updated, or closed.',
    category: 'API & Integration',
    content: `
      <h1>Webhook Events &amp; Delivery Guarantees</h1>
      <p>Webhooks allow your application to react in real-time when support tickets change status or receive new comments.</p>

      <h2>Supported Webhook Events</h2>
      <ul>
        <li><code>ticket.created</code> - Fired when a new inquiry arrives</li>
        <li><code>ticket.status_changed</code> - Fired when priority or status updates</li>
        <li><code>ticket.comment_added</code> - Fired when customer or staff posts a reply</li>
      </ul>

      <h2>Webhook Payload Example</h2>
      <pre><code>{
  "event": "ticket.status_changed",
  "timestamp": "2026-07-24T10:15:00Z",
  "data": {
    "id": "t-101",
    "ticketNumber": "TCK-1001",
    "status": "in_progress",
    "priority": "urgent"
  }
}</code></pre>

      <h2>Retry Policy</h2>
      <p>If your server returns anything other than a 2xx HTTP response, our gateway retries delivery up to 5 times using exponential backoff (1m, 5m, 15m, 1h, 6h).</p>
    `,
    author: { name: 'Alex Morgan', role: 'Senior Integration Specialist' },
    readTime: '5 min read',
    views: 1560,
    helpfulCount: 184,
    unhelpfulCount: 6,
    createdAt: '2026-07-05',
    updatedAt: '2026-07-22',
    tags: ['webhooks', 'api', 'events', 'http'],
    featured: true,
  },
  {
    id: 'kb-4',
    slug: 'security-soc2-and-saml-sso-okta',
    title: 'Configuring SAML 2.0 Single Sign-On (SSO) with Okta & Azure AD',
    summary: 'Step-by-step instructions for enforcing SSO authentication, provisioning users, and configuring ACS endpoints.',
    category: 'Security & Compliance',
    content: `
      <h1>SAML 2.0 Single Sign-On Setup</h1>
      <p>Enterprise accounts can enforce SSO so employees log in exclusively through Okta, Microsoft Azure AD, or PingIdentity.</p>

      <h2>Step 1: Obtain ACS Metadata</h2>
      <p>Copy your unique Assertion Consumer Service (ACS) URL from <strong>Settings &gt; Security &gt; SSO</strong>:</p>
      <pre><code>https://auth.enterprise-support.com/saml2/acs/tenant-99182</code></pre>

      <h2>Step 2: Assign User Groups in Identity Provider</h2>
      <p>Map the attribute <code>email</code> and <code>role</code> in your SAML assertion claims to grant appropriate permissions.</p>
    `,
    author: { name: 'Sarah Jenkins', role: 'Lead Platform Architect' },
    readTime: '6 min read',
    views: 2100,
    helpfulCount: 230,
    unhelpfulCount: 5,
    createdAt: '2026-06-28',
    updatedAt: '2026-07-21',
    tags: ['security', 'sso', 'okta', 'saml'],
    featured: true,
  },
  {
    id: 'kb-5',
    slug: 'troubleshooting-rate-limits-429-errors',
    title: 'Troubleshooting HTTP 429 Too Many Requests & Rate Limits',
    summary: 'Understand API burst quotas, rate limit HTTP headers, and client exponential backoff retry algorithms.',
    category: 'Troubleshooting',
    content: `
      <h1>Troubleshooting HTTP 429 Rate Limits</h1>
      <p>To preserve high availability for all tenants, public API endpoints enforce a rate limit of <strong>100 requests per minute</strong> per token.</p>

      <h2>Inspecting Response Headers</h2>
      <p>When rate limited, responses return HTTP 429 along with these informative headers:</p>
      <pre><code>X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1784891200</code></pre>

      <h2>Recommended Client Exponential Backoff Code</h2>
      <pre><code>async function fetchWithRetry(url, retries = 3, delay = 1000) {
  try {
    const res = await fetch(url);
    if (res.status === 429 && retries &gt; 0) {
      await new Promise(r =&gt; setTimeout(r, delay));
      return fetchWithRetry(url, retries - 1, delay * 2);
    }
    return res;
  } catch (err) {
    console.error(err);
  }
}</code></pre>
    `,
    author: { name: 'Alex Morgan', role: 'Senior Integration Specialist' },
    readTime: '4 min read',
    views: 1820,
    helpfulCount: 205,
    unhelpfulCount: 3,
    createdAt: '2026-07-10',
    updatedAt: '2026-07-23',
    tags: ['troubleshooting', 'rate-limit', 'errors', 'http'],
    featured: false,
  },
  {
    id: 'kb-6',
    slug: 'account-profile-mfa-security-keys',
    title: 'Setting up Two-Factor Authentication (2FA / MFA) & Backup Codes',
    summary: 'Protect your account using TOTP authenticator apps like Google Authenticator, 1Password, or YubiKeys.',
    category: 'Account Management',
    content: `
      <h1>Multi-Factor Authentication (MFA)</h1>
      <p>Enabling MFA adds an essential layer of security to prevent unauthorized access to customer tickets.</p>

      <h2>Setup Instructions</h2>
      <ol>
        <li>Go to <strong>User Profile &gt; Security</strong></li>
        <li>Click <strong>Enable 2FA</strong></li>
        <li>Scan the QR code with Google Authenticator, Authy, or 1Password.</li>
        <li>Save your 10 single-use recovery backup codes in a password manager.</li>
      </ol>
    `,
    author: { name: 'Michael Chen', role: 'Operations & Billing Manager' },
    readTime: '2 min read',
    views: 740,
    helpfulCount: 88,
    unhelpfulCount: 1,
    createdAt: '2026-07-02',
    updatedAt: '2026-07-12',
    tags: ['mfa', 'security', 'account', '2fa'],
    featured: false,
  },
];

const categories: ArticleCategory[] = [
  'All',
  'Getting Started',
  'Billing & Subscription',
  'API & Integration',
  'Security & Compliance',
  'Troubleshooting',
  'Account Management',
];

export const KnowledgeBasePage: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<KBArticle[]>(mockArticles);
  const [loading, setLoading] = useState(false);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory>('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Selected article for detailed viewer modal
  const [selectedArticle, setSelectedArticle] = useState<KBArticle | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Load articles (API fallback)
  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await knowledgeBaseService.getArticles({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: searchQuery || undefined,
        tag: selectedTag || undefined,
      });

      if (res && res.length > 0) {
        setArticles(res);
      } else {
        setArticles(mockArticles);
      }
    } catch {
      setArticles(mockArticles);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, selectedTag]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Compute category counts dynamically
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: articles.length };
    categories.forEach((cat) => {
      if (cat !== 'All') {
        counts[cat] = articles.filter((a) => a.category === cat).length;
      }
    });
    return counts;
  }, [articles]);

  // Compute filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesSearch =
        !searchQuery ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (art.tags && art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesCategory =
        selectedCategory === 'All' || art.category === selectedCategory;

      const matchesTag = !selectedTag || (art.tags && art.tags.includes(selectedTag));

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [articles, searchQuery, selectedCategory, selectedTag]);

  // Related articles for detail modal
  const relatedArticles = useMemo(() => {
    if (!selectedArticle) return [];
    return articles
      .filter((a) => a.id !== selectedArticle.id && a.category === selectedArticle.category)
      .slice(0, 2);
  }, [articles, selectedArticle]);

  // Handlers
  const handleRateArticle = async (id: string, isHelpful: boolean) => {
    setArticles((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return {
            ...a,
            helpfulCount: isHelpful ? a.helpfulCount + 1 : a.helpfulCount,
            unhelpfulCount: !isHelpful ? a.unhelpfulCount + 1 : a.unhelpfulCount,
          };
        }
        return a;
      })
    );

    if (selectedArticle && selectedArticle.id === id) {
      setSelectedArticle((prev) =>
        prev
          ? {
              ...prev,
              helpfulCount: isHelpful ? prev.helpfulCount + 1 : prev.helpfulCount,
              unhelpfulCount: !isHelpful ? prev.unhelpfulCount + 1 : prev.unhelpfulCount,
            }
          : null
      );
    }

    try {
      await knowledgeBaseService.rateArticle(id, isHelpful);
    } catch {
      // Fallback local update
    }
  };

  const handleOpenArticle = (art: KBArticle) => {
    setSelectedArticle(art);
    setIsDetailOpen(true);
    // increment views locally
    setArticles((prev) =>
      prev.map((a) => (a.id === art.id ? { ...a, views: a.views + 1 } : a))
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedTag(null);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Search Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-6 sm:p-10 shadow-xl border border-indigo-900/50">
        {/* Subtle Decorative Ambient Circles */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Help Center &amp; Documentation</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            How can we help you today?
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Search our comprehensive knowledge base for quickstart guides, API references, troubleshooting steps, and security procedures.
          </p>

          {/* Search Input Control */}
          <div className="pt-2">
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, topics, error codes, or tags (e.g., 'API key', 'SAML', 'billing')..."
                className="w-full pl-11 pr-10 py-3.5 bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs sm:text-sm rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Suggestions Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-300">
              <span className="font-bold text-slate-400 text-[11px]">Popular tags:</span>
              {['api', 'authentication', 'sso', 'billing', 'webhooks', 'rate-limit'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTag(tag === selectedTag ? null : tag);
                  }}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                    selectedTag === tag
                      ? 'bg-indigo-500 text-white font-bold'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Browse by Topic Category
          </h2>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => setSelectedCategory('All')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View All Topics
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories
            .filter((c) => c !== 'All')
            .map((cat) => (
              <CategoryCard
                key={cat}
                category={cat}
                articleCount={categoryCounts[cat] || 0}
                isSelected={selectedCategory === cat}
                onSelect={(selected) => {
                  setSelectedCategory(selected === selectedCategory ? 'All' : selected);
                }}
              />
            ))}
        </div>
      </div>

      {/* Category Filter Pills (Mobile / Quick Filter Bar) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" />
          Filter:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat} ({categoryCounts[cat] || 0})
          </button>
        ))}
      </div>

      {/* Article List Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {selectedCategory === 'All' ? 'All Documentation Articles' : `${selectedCategory} Articles`}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
              {selectedTag ? ` tagged #${selectedTag}` : ''}
            </p>
          </div>

          {(searchQuery || selectedCategory !== 'All' || selectedTag) && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              className="text-xs self-start sm:self-auto"
            >
              Reset Filters
            </Button>
          )}
        </div>

        {/* Loading State Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 animate-pulse"
              >
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-12 bg-slate-100 dark:bg-slate-800/50 rounded w-full" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2 pt-2" />
              </div>
            ))}
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onSelectArticle={handleOpenArticle}
              />
            ))}
          </div>
        ) : (
          /* Empty Search & Filter State */
          <div className="p-8 sm:p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-4 max-w-lg mx-auto my-8">
            <div className="h-12 w-12 rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 flex items-center justify-center mx-auto">
              <HelpCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                No articles match your search
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                We couldn't find any articles matching "{searchQuery || selectedCategory}". Try adjusting your keywords or clearing selected filters.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button size="sm" variant="outline" onClick={handleResetFilters} className="text-xs">
                Clear Filters
              </Button>

              <Button
                size="sm"
                onClick={() => navigate('/tickets')}
                leftIcon={<TicketIcon className="w-3.5 h-3.5" />}
                className="text-xs font-bold"
              >
                Submit Support Ticket
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Still need help callout banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center justify-center sm:justify-start gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Can't find what you're looking for?
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Our AI Assistant and enterprise support engineers are ready to assist you 24/7.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/chat')}
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-indigo-500" />}
            className="text-xs"
          >
            Ask AI Assistant
          </Button>

          <Button
            size="sm"
            onClick={() => navigate('/tickets')}
            leftIcon={<TicketIcon className="w-3.5 h-3.5" />}
            className="text-xs font-bold"
          >
            Create Ticket
          </Button>
        </div>
      </div>

      {/* Article Detail Drawer Modal */}
      <ArticleDetailModal
        article={selectedArticle}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onRateArticle={handleRateArticle}
        relatedArticles={relatedArticles}
        onSelectArticle={handleOpenArticle}
      />
    </div>
  );
};
