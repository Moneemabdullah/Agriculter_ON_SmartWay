import React from 'react';
import {
  Calendar,
  Tag,
  CheckCircle2,
  Sparkles,
  Wrench,
  Bug,
  ArrowLeft,
} from 'lucide-react';

interface ChangelogItem {
  type: 'new' | 'improvement' | 'fix' | 'update';
  title: string;
  description: string;
}

interface ChangelogVersion {
  version: string;
  date: string;
  changes: ChangelogItem[];
}

const changelogData: ChangelogVersion[] = [
  {
    version: '2.5.0',
    date: 'December 16, 2024',
    changes: [
      {
        type: 'new',
        title: 'Advanced Search Functionality',
        description:
          'Introduced a powerful search feature to quickly find products, articles, and farming tips.',
      },
      {
        type: 'new',
        title: 'Shopping Cart System',
        description:
          'Real-time shopping cart with persistent storage and smooth checkout.',
      },
      {
        type: 'improvement',
        title: 'Enhanced User Profile',
        description:
          'Avatar upload, personal info editing, and order history tracking.',
      },
      {
        type: 'improvement',
        title: 'Mobile Responsiveness',
        description:
          'Optimized layouts and better touch interaction on mobile devices.',
      },
    ],
  },
  {
    version: '2.4.0',
    date: 'November 28, 2024',
    changes: [
      {
        type: 'new',
        title: 'Authentication System',
        description:
          'Login, registration, password recovery, and secure sessions.',
      },
      {
        type: 'fix',
        title: 'Newsletter Subscription',
        description:
          'Resolved validation issues during newsletter signup.',
      },
    ],
  },
  {
    version: '2.3.0',
    date: 'November 10, 2024',
    changes: [
      {
        type: 'update',
        title: 'Dashboard UI Refresh',
        description:
          'Cleaner dashboard layout with improved readability.',
      },
      {
        type: 'fix',
        title: 'Order History Bug',
        description:
          'Fixed incorrect order status display.',
      },
    ],
  },
  {
    version: '2.2.0',
    date: 'October 25, 2024',
    changes: [
      {
        type: 'new',
        title: 'Farmer Tips Section',
        description:
          'Added curated farming tips and best practices.',
      },
    ],
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'new':
      return <Sparkles className="w-5 h-5" />;
    case 'improvement':
      return <CheckCircle2 className="w-5 h-5" />;
    case 'fix':
      return <Bug className="w-5 h-5" />;
    case 'update':
      return <Wrench className="w-5 h-5" />;
    default:
      return <Tag className="w-5 h-5" />;
  }
};

const getTypeBadge = (type: string) => {
  const badges = {
    new: 'bg-green-600 text-white',
    improvement: 'bg-blue-600 text-white',
    fix: 'bg-red-600 text-white',
    update: 'bg-emerald-800 text-white',
  };
  return badges[type as keyof typeof badges];
};

const getTypeLabel = (type: string) => {
  const labels = {
    new: 'New',
    improvement: 'Improved',
    fix: 'Fixed',
    update: 'Updated',
  };
  return labels[type as keyof typeof labels];
};

export function Changelog() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-5xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-16">
          <button
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center gap-2 text-emerald-800 hover:text-green-600 mb-6"
          >
            <ArrowLeft size={18} />
            Back to Home
          </button>

          <h1 className="text-5xl font-bold text-emerald-800 mb-4">
            Changelog
          </h1>
          <p className="text-gray-600">
            All updates, improvements, and fixes in one place.
          </p>
        </div>

        {/* Versions */}
        <div className="space-y-12">
          {changelogData.map((version) => (
            <div
              key={version.version}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="bg-emerald-800 text-white p-6 flex justify-between flex-wrap gap-2">
                <h2 className="text-2xl font-semibold">
                  v{version.version}
                </h2>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} />
                  {version.date}
                </div>
              </div>

              <div className="p-6 space-y-4">
                {version.changes.map((change, i) => (
                  <div key={i} className="flex gap-3">
                    <div className={`p-2 rounded-lg ${getTypeBadge(change.type)}`}>
                      {getTypeIcon(change.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${getTypeBadge(change.type)}`}
                        >
                          {getTypeLabel(change.type)}
                        </span>
                        <h3 className="font-semibold text-emerald-800">
                          {change.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        {change.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-100 px-6 py-3 text-sm text-gray-500">
                {version.changes.length} update
                {version.changes.length > 1 && 's'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
