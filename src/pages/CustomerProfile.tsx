import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../hooks/useLanguage';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ShieldCheck, Calendar, MapPin, Building2, CreditCard, ChevronRight, User, Phone, Mail } from 'lucide-react';

export const CustomerProfile = () => {
    const { user } = useUser();
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<'personal' | 'account'>('account');

    const mainAccount = user.accounts && user.accounts.length > 0 ? user.accounts[0] : null;

    return (
        <DashboardLayout>
            <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
                <div className="relative">
                    <h1 className="text-3xl font-bold text-nmb-charcoal tracking-tight mb-2">{t.dashboard.customerProfilePage.title}</h1>
                    <p className="text-gray-500">{t.dashboard.customerProfilePage.subtitle}</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Header / Tabs */}
                    <div className="bg-gray-50/50 border-b border-gray-100 p-2 flex gap-2">
                        <button
                            onClick={() => setActiveTab('personal')}
                            className={`flex-1 py-3 px-6 rounded-2xl text-sm font-semibold transition-all duration-200 ${activeTab === 'personal'
                                ? 'bg-white text-nmb-charcoal shadow-sm ring-1 ring-black/5'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'
                                }`}
                        >
                            {t.dashboard.customerProfilePage.tabs.personal}
                        </button>
                        <button
                            onClick={() => setActiveTab('account')}
                            className={`flex-1 py-3 px-6 rounded-2xl text-sm font-semibold transition-all duration-200 ${activeTab === 'account'
                                ? 'bg-white text-nmb-charcoal shadow-sm ring-1 ring-black/5'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'
                                }`}
                        >
                            {t.dashboard.customerProfilePage.tabs.account}
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="p-8 md:p-12 min-h-[600px]">
                        {activeTab === 'account' ? (
                            <div className="space-y-10">
                                {/* Top Section: Highlighted Info */}
                                <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between p-8 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-[2rem] border border-blue-100/60 shadow-sm">
                                    <div className="space-y-2">
                                        <span className="text-xs font-bold uppercase tracking-wider text-blue-500">{t.dashboard.customerProfilePage.accountDetails.accountHolder}</span>
                                        <h3 className="text-3xl font-bold text-nmb-charcoal tracking-tight">Shravan Banerjee</h3>
                                    </div>
                                    <div className="space-y-2 text-right">
                                        <span className="text-xs font-bold uppercase tracking-wider text-green-600">{t.dashboard.customerProfilePage.accountDetails.status}</span>
                                        <div className="flex justify-end">
                                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-bold shadow-sm">
                                                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                                                {t.dashboard.customerProfilePage.accountDetails.active}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                                    {/* Left Column */}
                                    <div className="space-y-10">
                                        <DetailItem label={t.dashboard.customerProfilePage.accountDetails.accountNickname} value="Banerjee" icon={<ShieldCheck className="w-5 h-5" />} />

                                        <div className="group relative overflow-hidden rounded-2xl bg-amber-50 p-6 border-2 border-amber-100 transition-all hover:shadow-md hover:border-amber-200">
                                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                                <ShieldCheck className="w-32 h-32 text-amber-500" />
                                            </div>
                                            <DetailItem
                                                label={t.dashboard.customerProfilePage.accountDetails.authorizedSigner}
                                                value="Thynana Gopi Priyanka"
                                                highlight
                                                className="relative z-10"
                                            />
                                        </div>

                                        <DetailItem
                                            label={t.dashboard.customerProfilePage.accountDetails.accountNo}
                                            value={mainAccount ? mainAccount.accountNumber : 'Loading...'}
                                            icon={<CreditCard className="w-5 h-5" />}
                                            mono
                                        />
                                        <DetailItem
                                            label={t.dashboard.customerProfilePage.accountDetails.dateOfOpening}
                                            value="12/07/2017"
                                            icon={<Calendar className="w-5 h-5" />}
                                        />
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-10">
                                        <DetailItem label={t.dashboard.customerProfilePage.accountDetails.categoryCode} value="SBPRP" />
                                        <DetailItem label={t.dashboard.customerProfilePage.accountDetails.categoryDescription} value="Prestige Platinum Account" />
                                        <DetailItem label={t.dashboard.customerProfilePage.accountDetails.accountType} value="SBA" />

                                        <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 space-y-6">
                                            <div className="flex items-start gap-4">
                                                <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100">
                                                    <Building2 className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <div>
                                                    <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">{t.dashboard.customerProfilePage.accountDetails.branchName}</span>
                                                    <p className="font-bold text-lg text-nmb-charcoal">Bandra West Premier</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100">
                                                    <MapPin className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <div>
                                                    <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">{t.dashboard.customerProfilePage.accountDetails.branchAddress}</span>
                                                    <p className="text-gray-600 leading-relaxed">Hill Road, Bandra West, Mumbai, MH 400050</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                                    {/* Personal Info Column */}
                                    <div className="space-y-10">
                                        <DetailItem label={t.dashboard.customerProfilePage.personalDetails.fullName} value="Shravan Banerjee" icon={<User className="w-5 h-5" />} />
                                        <DetailItem label={t.dashboard.customerProfilePage.personalDetails.customerId} value="NMB-78229100" />
                                        <DetailItem label={t.dashboard.customerProfilePage.personalDetails.dob} value="07/10/1958" icon={<Calendar className="w-5 h-5" />} />
                                        <DetailItem label={t.dashboard.customerProfilePage.personalDetails.mobile} value="918247299088" icon={<Phone className="w-5 h-5" />} />
                                        <DetailItem label={t.dashboard.customerProfilePage.personalDetails.email} value="shravanbanarji@gmail.com" icon={<Mail className="w-5 h-5" />} />
                                    </div>

                                    {/* KYC & Address Column */}
                                    <div className="space-y-10">
                                        <DetailItem label={t.dashboard.customerProfilePage.personalDetails.ckycNo} value="50064880149728" />

                                        <div>
                                            <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">{t.dashboard.customerProfilePage.personalDetails.kycStatus}</span>
                                            <span className="inline-flex px-4 py-2 rounded-lg bg-green-50 text-green-700 text-sm font-semibold border border-green-100">
                                                {t.dashboard.customerProfilePage.personalDetails.nextDue} 30/08/2028
                                            </span>
                                        </div>

                                        <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 space-y-8">
                                            <div>
                                                <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">{t.dashboard.customerProfilePage.personalDetails.communicationAddress}</span>
                                                <p className="text-gray-700 leading-relaxed font-medium">
                                                    Puja Casa, Land's End, Bandstand, Bandra (West), Mumbai, Maharashtra - 400050
                                                </p>
                                            </div>
                                            <div className="pt-6 border-t border-gray-200/60">
                                                <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">{t.dashboard.customerProfilePage.personalDetails.permanentAddress}</span>
                                                <p className="text-gray-700 leading-relaxed font-medium">
                                                    Puja Casa, Land's End, Bandstand, Bandra (West), Mumbai, Maharashtra - 400050
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

// Helper component for details
const DetailItem = ({ label, value, icon, highlight = false, mono = false, className = '' }: { label: string; value: string; icon?: React.ReactNode, highlight?: boolean, mono?: boolean, className?: string }) => (
    <div className={`space-y-1.5 ${className}`}>
        <p className={`text-xs font-bold uppercase tracking-wider ${highlight ? 'text-amber-600' : 'text-gray-400'}`}>
            {label}
        </p>
        <div className="flex items-center gap-3">
            {icon && <div className={`text-gray-400 ${highlight ? 'text-amber-500' : ''}`}>{icon}</div>}
            <p className={`text-lg font-bold ${highlight ? 'text-amber-900 text-xl' : 'text-nmb-charcoal'} ${mono ? 'font-mono tracking-tight' : ''}`}>
                {value}
            </p>
        </div>
    </div>
);
