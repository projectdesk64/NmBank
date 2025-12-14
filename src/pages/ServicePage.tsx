import { useLocation, useParams, Navigate } from 'react-router-dom';
import { GenericServiceLayout } from '@/components/services/GenericServiceLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { currentUser } from '@/data/mockData';
import { PieChart, Shield, Send, TrendingUp, Globe, Gift } from 'lucide-react';

// Format currency helper
const formatCurrency = (amount: number, currency: string = 'RUB'): string => {
  const locale = currency === 'USD' ? 'en-US' : 'ru-RU';
  const currencyCode = currency === 'USD' ? 'USD' : 'RUB';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format date helper
const formatDate = (dateString: string, language: string = 'en'): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export const ServicePage = () => {
  const location = useLocation();
  const params = useParams<{ slug?: string }>();
  const { language } = useLanguage();
  
  // Extract the slug from URL
  // Handle both /services/:slug and /dashboard/services/:slug patterns
  let slug: string | undefined;
  
  if (params.slug) {
    // Route pattern: /services/:slug
    slug = params.slug;
  } else {
    // Route pattern: /dashboard/services/* or /dashboard/:feature
    const pathSegments = location.pathname.split('/').filter(Boolean);
    // Get the last segment (could be 'services', 'investments', 'insurance', etc.)
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    // If last segment is 'services', try to get the next one
    if (lastSegment === 'services' && pathSegments.length > 2) {
      slug = pathSegments[pathSegments.length - 2];
    } else if (lastSegment !== 'services' && lastSegment !== 'dashboard') {
      slug = lastSegment;
    }
  }

  // Normalize slug (handle hyphens)
  const normalizedSlug = slug?.toLowerCase();

  // Case A: Specialized Components - redirect to their dedicated routes
  if (normalizedSlug === 'accounts') {
    return <Navigate to="/dashboard/accounts" replace />;
  }
  if (normalizedSlug === 'cards') {
    return <Navigate to="/dashboard/cards" replace />;
  }
  if (normalizedSlug === 'loans') {
    return <Navigate to="/dashboard/loans" replace />;
  }
  if (normalizedSlug === 'fixed-deposits' || normalizedSlug === 'fixeddeposits') {
    return <Navigate to="/dashboard/fixed-deposits" replace />;
  }

  // Case B: Generic Services - render GenericServiceLayout
  if (normalizedSlug === 'investments') {
    const totalValue = currentUser.investments.reduce((sum, inv) => sum + inv.value, 0);
    return (
      <GenericServiceLayout
        title="Investment Portfolio"
        data={currentUser.investments}
        summary={{
          label: 'Total Portfolio Value',
          value: formatCurrency(totalValue),
          icon: PieChart,
        }}
        columns={[
          { key: 'name', label: 'Investment Name' },
          { key: 'type', label: 'Type' },
          {
            key: 'value',
            label: 'Current Value',
            render: (value) => formatCurrency(value),
          },
          {
            key: 'roi',
            label: 'ROI',
            render: (value) => `${value}%`,
          },
          {
            key: 'purchaseDate',
            label: 'Purchase Date',
            render: (value) => formatDate(value, language),
          },
        ]}
      />
    );
  }

  if (normalizedSlug === 'insurance') {
    const activePolicies = currentUser.insurance.filter(p => p.status === 'Active');
    const totalCoverage = activePolicies.reduce((sum, pol) => sum + pol.coverageAmount, 0);
    return (
      <GenericServiceLayout
        title="Insurance Policies"
        data={currentUser.insurance}
        summary={{
          label: 'Total Coverage',
          value: formatCurrency(totalCoverage),
          icon: Shield,
        }}
        columns={[
          { key: 'policyNo', label: 'Policy Number' },
          { key: 'provider', label: 'Provider' },
          { key: 'type', label: 'Type' },
          {
            key: 'coverageAmount',
            label: 'Coverage Amount',
            render: (value) => formatCurrency(value),
          },
          {
            key: 'premium',
            label: 'Premium',
            render: (value) => formatCurrency(value),
          },
          {
            key: 'expiry',
            label: 'Expiry Date',
            render: (value) => formatDate(value, language),
          },
          {
            key: 'status',
            label: 'Status',
            render: (value) => {
              const statusLower = value.toLowerCase();
              if (statusLower === 'active') {
                return <span className="text-green-600 font-semibold">Active</span>;
              }
              if (statusLower === 'expired') {
                return <span className="text-yellow-600 font-semibold">Expired</span>;
              }
              return <span className="text-gray-600 font-semibold">{value}</span>;
            },
          },
        ]}
      />
    );
  }

  if (normalizedSlug === 'payments') {
    const pendingPayments = currentUser.payments.filter(p => p.status === 'pending');
    const totalPending = pendingPayments.reduce((sum, pay) => sum + pay.amount, 0);
    return (
      <GenericServiceLayout
        title="Bill Payments"
        data={currentUser.payments}
        summary={{
          label: 'Total Pending',
          value: formatCurrency(totalPending),
          icon: Send,
        }}
        columns={[
          { key: 'biller', label: 'Biller' },
          { key: 'category', label: 'Category' },
          {
            key: 'amount',
            label: 'Amount',
            render: (value) => formatCurrency(value),
          },
          {
            key: 'dueDate',
            label: 'Due Date',
            render: (value) => formatDate(value, language),
          },
          {
            key: 'status',
            label: 'Status',
            render: (value) => {
              const statusLower = value.toLowerCase();
              if (statusLower === 'paid') {
                return <span className="text-green-600 font-semibold">Paid</span>;
              }
              if (statusLower === 'pending') {
                return <span className="text-yellow-600 font-semibold">Pending</span>;
              }
              if (statusLower === 'overdue') {
                return <span className="text-red-600 font-semibold">Overdue</span>;
              }
              return <span className="text-gray-600 font-semibold">{value}</span>;
            },
          },
          {
            key: 'paymentDate',
            label: 'Payment Date',
            render: (value) => value ? formatDate(value, language) : '-',
          },
        ]}
      />
    );
  }

  if (normalizedSlug === 'transactions') {
    const recentTransactions = [...currentUser.transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 50); // Show last 50 transactions
    
    return (
      <GenericServiceLayout
        title="Transaction History"
        data={recentTransactions}
        summary={{
          label: 'Recent Transactions',
          value: recentTransactions.length,
          icon: TrendingUp,
        }}
        columns={[
          {
            key: 'date',
            label: 'Date',
            render: (value) => formatDate(value, language),
          },
          { key: 'description', label: 'Description' },
          { key: 'merchant', label: 'Merchant', render: (value) => value || '-' },
          { key: 'category', label: 'Category' },
          {
            key: 'amount',
            label: 'Amount',
            render: (value, row) => {
              const formatted = formatCurrency(Math.abs(value));
              return (
                <span className={row.type === 'credit' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                  {row.type === 'credit' ? '+' : '-'}{formatted}
                </span>
              );
            },
          },
          {
            key: 'status',
            label: 'Status',
            render: (value) => {
              const statusLower = value.toLowerCase();
              if (statusLower === 'success') {
                return <span className="text-green-600 font-semibold">Success</span>;
              }
              if (statusLower === 'pending') {
                return <span className="text-yellow-600 font-semibold">Pending</span>;
              }
              if (statusLower === 'failed') {
                return <span className="text-red-600 font-semibold">Failed</span>;
              }
              return <span className="text-gray-600 font-semibold">{value}</span>;
            },
          },
        ]}
      />
    );
  }

  if (normalizedSlug === 'rates') {
    return (
      <GenericServiceLayout
        title="Exchange Rates"
        data={currentUser.rates}
        summary={{
          label: 'Live Exchange Rates',
          value: `${currentUser.rates.length} Currencies`,
          icon: Globe,
        }}
        columns={[
          { key: 'currency', label: 'Currency' },
          {
            key: 'buy',
            label: 'Buy Rate',
            render: (value) => value.toFixed(2),
          },
          {
            key: 'sell',
            label: 'Sell Rate',
            render: (value) => value.toFixed(2),
          },
        ]}
      />
    );
  }

  if (normalizedSlug === 'rewards') {
    return (
      <GenericServiceLayout
        title="Rewards & Offers"
        data={currentUser.rewards}
        summary={{
          label: 'Active Offers',
          value: currentUser.rewards.length,
          icon: Gift,
        }}
        columns={[
          { key: 'title', label: 'Offer Title' },
          { key: 'description', label: 'Description' },
          {
            key: 'validUntil',
            label: 'Valid Until',
            render: (value) => formatDate(value, language),
          },
        ]}
      />
    );
  }

  // Fallback: If slug doesn't match any known service, show 404 or redirect
  return <Navigate to="/dashboard" replace />;
};
