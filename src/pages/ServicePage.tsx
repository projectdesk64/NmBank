import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  FileText,
  Clock,
  History,
  PlusCircle,
  Search,
  Settings,
  CreditCard,
  Wallet,
  TrendingUp,
  DollarSign,
  PieChart,
  Shield,
  Send,
  ArrowRight,
  Building2,
} from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const pathToTitleMap: Record<string, string> = {
  accounts: 'Account Management',
  cards: 'Card Management',
  transactions: 'Transaction Management',
  investments: 'Investment Management',
  loans: 'Loan Management',
  insurance: 'Insurance Management',
  payments: 'Payment Management',
  services: 'Services',
};

const getQuickActions = (feature: string): QuickAction[] => {
  const baseActions: QuickAction[] = [
    {
      id: 'apply',
      title: 'Apply Now',
      description: 'Submit a new application or request',
      icon: PlusCircle,
    },
    {
      id: 'statement',
      title: 'Statement',
      description: 'View and download statements',
      icon: FileText,
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Manage preferences and settings',
      icon: Settings,
    },
  ];

  // Add feature-specific actions based on the feature type
  if (feature === 'cards') {
    return [
      ...baseActions,
      {
        id: 'block',
        title: 'Block Card',
        description: 'Temporarily block your card',
        icon: CreditCard,
      },
      {
        id: 'limits',
        title: 'Set Limits',
        description: 'Configure spending limits',
        icon: Settings,
      },
      {
        id: 'history',
        title: 'Transaction History',
        description: 'View card transactions',
        icon: History,
      },
    ];
  }

  if (feature === 'loans') {
    return [
      ...baseActions,
      {
        id: 'repay',
        title: 'Repay Loan',
        description: 'Make loan payments',
        icon: DollarSign,
      },
      {
        id: 'schedule',
        title: 'Payment Schedule',
        description: 'View payment schedule',
        icon: Clock,
      },
      {
        id: 'status',
        title: 'Check Status',
        description: 'Track application status',
        icon: Search,
      },
    ];
  }

  if (feature === 'accounts') {
    return [
      ...baseActions,
      {
        id: 'details',
        title: 'Account Details',
        description: 'View account information',
        icon: Wallet,
      },
      {
        id: 'transactions',
        title: 'Transactions',
        description: 'View transaction history',
        icon: History,
      },
      {
        id: 'beneficiaries',
        title: 'Beneficiaries',
        description: 'Manage beneficiaries',
        icon: Building2,
      },
    ];
  }

  if (feature === 'transactions') {
    return [
      ...baseActions,
      {
        id: 'history',
        title: 'Transaction History',
        description: 'View all transactions',
        icon: History,
      },
      {
        id: 'filter',
        title: 'Filter & Search',
        description: 'Search and filter transactions',
        icon: Search,
      },
      {
        id: 'export',
        title: 'Export Statement',
        description: 'Download transaction statement',
        icon: FileText,
      },
    ];
  }

  if (feature === 'investments') {
    return [
      ...baseActions,
      {
        id: 'portfolio',
        title: 'Portfolio',
        description: 'View investment portfolio',
        icon: PieChart,
      },
      {
        id: 'performance',
        title: 'Performance',
        description: 'Track investment performance',
        icon: TrendingUp,
      },
      {
        id: 'history',
        title: 'Investment History',
        description: 'View past investments',
        icon: History,
      },
    ];
  }

  if (feature === 'insurance') {
    return [
      ...baseActions,
      {
        id: 'policies',
        title: 'My Policies',
        description: 'View active policies',
        icon: Shield,
      },
      {
        id: 'claims',
        title: 'Claims',
        description: 'File or track claims',
        icon: FileText,
      },
      {
        id: 'renew',
        title: 'Renew Policy',
        description: 'Renew existing policies',
        icon: Clock,
      },
    ];
  }

  if (feature === 'payments') {
    return [
      ...baseActions,
      {
        id: 'send',
        title: 'Send Money',
        description: 'Transfer funds',
        icon: Send,
      },
      {
        id: 'schedule',
        title: 'Scheduled Payments',
        description: 'Manage scheduled payments',
        icon: Clock,
      },
      {
        id: 'history',
        title: 'Payment History',
        description: 'View payment records',
        icon: History,
      },
    ];
  }

  // Default actions for other features (including services/*)
  return [
    ...baseActions,
    {
      id: 'history',
      title: 'History',
      description: 'View past activities',
      icon: History,
    },
    {
      id: 'status',
      title: 'Check Status',
      description: 'Track current status',
      icon: Search,
    },
    {
      id: 'help',
      title: 'Help & Support',
      description: 'Get assistance',
      icon: Settings,
    },
  ];
};

export const ServicePage = () => {
  const location = useLocation();
  
  // Extract the last segment from the path (e.g., "cards" from "/dashboard/cards")
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const feature = pathSegments[pathSegments.length - 1] || 'dashboard';
  
  // Get the title based on the feature
  const pageTitle = pathToTitleMap[feature] || `${feature.charAt(0).toUpperCase() + feature.slice(1).replace(/-/g, ' ')} Management`;
  
  // Get feature name for breadcrumb (capitalize and replace hyphens)
  const featureName = feature === 'dashboard' 
    ? 'Dashboard' 
    : feature.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  const quickActions = getQuickActions(feature);

  return (
    <DashboardLayout>
      <div className="bg-white">
        {/* White Header with Breadcrumb */}
        <div className="container mx-auto px-6 py-6 border-b border-nmb-mist">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/dashboard" className="text-gray-600 hover:text-nmb-maroon transition-colors">
                    Dashboard
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-nmb-maroon font-semibold">
                  {featureName}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Page Title */}
          <h1 className="text-3xl font-bold text-nmb-maroon">
            {pageTitle}
          </h1>
        </div>

        {/* Content Area */}
        <div className="container mx-auto px-6 py-12">
          {/* Quick Actions Grid - 3 columns */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <div
                    key={action.id}
                    className="bg-white rounded-xl shadow-card p-6 hover:shadow-card-elevated transition-all duration-200 cursor-pointer group border border-nmb-mist"
                  >
                    <div className="flex flex-col">
                      {/* Icon with light gray background */}
                      <div className="bg-gray-100 rounded-lg p-3 w-fit mb-4 group-hover:bg-gray-200 transition-colors">
                        <Icon className="h-6 w-6 text-nmb-maroon" />
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-lg font-semibold text-nmb-maroon mb-2">
                        {action.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4">
                        {action.description}
                      </p>
                      
                      {/* Arrow indicator */}
                      <div className="flex items-center text-nmb-maroon opacity-0 group-hover:opacity-100 transition-opacity mt-auto">
                        <span className="text-sm font-medium mr-2">Explore</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Service Desk / Coming Soon Section */}
          <div className="bg-nmb-smoke rounded-xl p-8 border border-nmb-mist">
            <div className="text-center max-w-2xl mx-auto">
              <div className="bg-gray-100 rounded-full p-4 w-fit mx-auto mb-4">
                <Building2 className="h-8 w-8 text-nmb-maroon" />
              </div>
              <h3 className="text-2xl font-semibold text-nmb-maroon mb-3">
                Service Desk
              </h3>
              <p className="text-gray-600 mb-6">
                This feature is currently under development. Our team is working hard to bring you 
                a comprehensive {pageTitle.toLowerCase()} experience. In the meantime, you can use 
                the quick actions above or contact our support team for assistance.
              </p>
              <div className="flex items-center justify-center gap-4">
                <button className="bg-nmb-maroon hover:bg-[#6e0e00] text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                  Contact Support
                  <ArrowRight className="h-4 w-4" />
                </button>
                <Link
                  to="/dashboard"
                  className="text-nmb-maroon hover:text-nmb-orange font-medium transition-colors"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
