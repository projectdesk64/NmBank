export type Language = 'en' | 'ru';

export interface Translations {
  nav: {
    personal: string;
    corporate: string;
    sme: string;
    about: string;
    login: string;
    openAccount: string;
    phone: string;
    dontHaveAccount: string;
    alreadyHaveAccount: string;
    bankName: string;
  };
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    scrollDown: string;
  };
  trustBar: {
    customers: string;
    branches: string;
    assets: string;
    years: string;
  };
  features: {
    accounts: {
      title: string;
      description: string;
      points: string[];
      cta: string;
    };
    security: {
      title: string;
      subtitle: string;
      description: string;
      points: string[];
      cta: string;
    };
    global: {
      title: string;
      subtitle: string;
      description: string;
      cta: string;
    };
    support: {
      title: string;
      subtitle: string;
      description: string;
      cta: string;
    };
    digital: {
      title: string;
      subtitle: string;
      description: string;
      cta: string;
    };
  };
  services: {
    title: string;
    cards: string;
    loans: string;
    investments: string;
    deposits: string;
    insurance: string;
    wealth: string;
  };
  login: {
    title: string;
    subtitle: string;
    formTitle: string;
    formSubtitle: string;
    userIdLabel: string;
    userIdPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    forgotPassword: string;
    submitButton: string;
    submittingButton: string;
    newUser: string;
    registerNow: string;
    errorInvalidCredentials: string;
    marketingTitle: string;
    marketingSubtitle: string;
    servicePillars: {
      individuals: {
        title: string;
        description: string;
        moreInfo: string;
      };
      corporate: {
        title: string;
        description: string;
        moreInfo: string;
      };
      cards: {
        title: string;
        description: string;
        moreInfo: string;
      };
    };
    news: {
      title: string;
      allNews: string;
      readFullStory: string;
      items: {
        commissionFree: {
          date: string;
          title: string;
          description: string;
        };
        mirTransition: {
          date: string;
          title: string;
          description: string;
        };
      };
    };
  };
  register: {
    title: string;
    subtitle: string;
    formTitle: string;
    formSubtitle: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    confirmPasswordLabel: string;
    confirmPasswordPlaceholder: string;
    passwordStrength: string;
    passwordWeak: string;
    passwordMedium: string;
    passwordStrong: string;
    passwordRequirement1: string;
    passwordRequirement2: string;
    passwordRequirement3: string;
    passwordRequirement4: string;
    passwordsNotMatch: string;
    termsLabel: string;
    termsLink: string;
    privacyLink: string;
    submitButton: string;
    submittingButton: string;
    successTitle: string;
    successMessage: string;
    alreadyHaveAccount: string;
    loginLink: string;
    errorEmailExists: string;
    errorRegistrationFailed: string;
    errorPasswordWeak: string;
    errorTermsNotAccepted: string;
    marketingTitle: string;
    marketingSubtitle: string;
    benefit1: string;
    benefit2: string;
    benefit3: string;
    benefit4: string;
    servicePillars: {
      individuals: {
        title: string;
        description: string;
        moreInfo: string;
      };
      corporate: {
        title: string;
        description: string;
        moreInfo: string;
      };
      secureBanking: {
        title: string;
        description: string;
        moreInfo: string;
      };
    };
  };
  forgotPassword: {
    title: string;
    subtitle: string;
    formTitle: string;
    formSubtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    submitButton: string;
    submittingButton: string;
    successTitle: string;
    successMessage: string;
    successNote: string;
    resendButton: string;
    backToLogin: string;
    rememberPassword: string;
    loginLink: string;
    errorInvalidEmail: string;
    marketingTitle: string;
    marketingSubtitle: string;
    marketingReassurance: string;
    securityFeature1: string;
    securityFeature2: string;
    securityFeature3: string;
  };
  cta: {
    title: string;
    subtitle: string;
    button: string;
  };
  footer: {
    aboutTitle: string;
    aboutHistory: string;
    aboutMission: string;
    aboutLeadership: string;
    aboutCareers: string;
    aboutPress: string;
    licensedBy: string;
    quickLinks: string;
    aboutUs: string;
    careers: string;
    privacyPolicy: string;
    termsOfService: string;
    support: string;
    helpCenter: string;
    reportFraud: string;
    locateBranch: string;
    contactUs: string;
    security: string;
    securityMessage: string;
    copyright: string;
    organizationsTitle: string;
    organizationsCorporate: string;
    organizationsInvestments: string;
    organizationsLoans: string;
    organizationsTrade: string;
    organizationsSalary: string;
    individualsTitle: string;
    individualsDebit: string;
    individualsCredit: string;
    individualsMortgages: string;
    individualsLoans: string;
    individualsDeposits: string;
    cardsTitle: string;
    cardsVisa: string;
    cardsMastercard: string;
    cardsMir: string;
    cardsPremium: string;
    cardsTravel: string;
    helpTitle: string;
    helpContact: string;
    helpBranch: string;
    helpAtm: string;
    helpSecurity: string;
    helpLostCard: string;
  };
  dashboard: {
    hero: {
      welcome: string;
      lastLogin: string;
      accounts: string;
      cards: string;
      fdRd: string;
      loans: string;
    };
    summaryStats: {
      totalBalance: string;
      thisMonthSpending: string;
      activeFDs: string;
      vsLastMonth: string;
    };
    accounts: {
      myAccounts: string;
      manageAndView: string;
      showBalance: string;
      hideBalance: string;
      savingsAccount: string;
      currentAccount: string;
      fixedDeposit: string;
      accountNumber: string;
      accountDetails: string;
      availableBalance: string;
      ifscCode: string;
      branch: string;
      branchNames: {
        cyberCityMain: string;
      };
      interestRate: string;
      maturityDate: string;
      accountStatus: string;
      active: string;
      accountType: string;
    };
    quickLinks: {
      title: string;
      accountStatement: string;
      downloadPdf: string;
      openFD: string;
      fixedDeposit: string;
      transferMoney: string;
      quickTransfer: string;
      sweepInOD: string;
      overdraft: string;
      investments: string;
      portfolio: string;
      loans: string;
      applyNow: string;
    };
    favouriteLinks: {
      title: string;
      accountStatement: string;
      openFD: string;
      downloadFDSummary: string;
      sweepInOD: string;
      casaCertificate: string;
    };
    billsRecharge: {
      title: string;
      electricity: string;
      mobilePrepaid: string;
      mobilePostpaid: string;
      water: string;
      internet: string;
      dth: string;
      insurance: string;
      mutualFunds: string;
    };
    recentTransactions: {
      title: string;
      viewAll: string;
      noRecentTransactions: string;
      viewTransactionHistory: string;
      transactionDetails: string;
      referenceId: string;
      description: string;
      amount: string;
      dateTime: string;
      category: string;
      categories: {
        transfer: string;
        entertainment: string;
        food: string;
        shopping: string;
        bills: string;
        other: string;
      };
      descriptions: {
        openingDeposit: string;
        netflix: string;
        starbucks: string;
      };
    };
    sendMoney: {
      title: string;
      fromAccount: string;
      toAccount: string;
      toAccountPlaceholder: string;
      amount: string;
      proceed: string;
      confirmTransfer: string;
      reviewDetails: string;
      cancel: string;
      confirm: string;
      enterOTP: string;
      otpDescription: string;
      submit: string;
      processing: string;
      errorFillAll: string;
      errorInvalidAccount: string;
      errorAmountGreater: string;
      errorMinAmount: string;
      errorInsufficientBalance: string;
      errorInvalidOTP: string;
      errorTransferFailed: string;
    };
    layout: {
      searchPlaceholder: string;
      noResultsFound: string;
    };
    customerDetails: {
      customerProfile: string;
      kycVerified: string;
      customerId: string;
      copy: string;
      copied: string;
      contactInformation: string;
      phone: string;
      email: string;
      logout: string;
      editProfile: string;
    };
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      personal: 'Personal',
      corporate: 'Corporate',
      sme: 'SME',
      about: 'About Us',
      login: 'Login',
      openAccount: 'Open Account',
      phone: '8-800-555-0100',
      dontHaveAccount: "Don't have an account?",
      alreadyHaveAccount: 'Already have an account?',
      bankName: 'New Moscow Bank',
    },
    hero: {
      badge: '✨ Awarded Best Digital Bank 2024',
      title: 'Your Financial Journey',
      titleHighlight: 'Starts Here',
      subtitle: 'Join a bank that understands your needs and exceeds your expectations.',
      ctaPrimary: 'Open an account',
      ctaSecondary: 'Learn more',
      scrollDown: 'Scroll Down',
    },
    trustBar: {
      customers: 'Trusted Customers',
      branches: 'Branches',
      assets: 'Assets Under Management',
      years: 'Years of Excellence',
    },
    features: {
      accounts: {
        title: 'Savings & Current Accounts',
        description: 'Start your banking journey with our flexible account options. Zero balance accounts, premium benefits, and digital-first banking experience.',
        points: ['Zero Balance Accounts', 'Premium Banking Benefits', 'Digital Onboarding', '24/7 Access'],
        cta: 'Open Account',
      },
      security: {
        title: 'Secure Digital Banking',
        subtitle: 'Military-grade protection',
        description: 'Your financial data is protected with enterprise-level encryption and multi-factor authentication.',
        points: ['End-to-end Encryption', 'Biometric Authentication', 'Zero Fraud Liability', 'Real-time Monitoring'],
        cta: 'Learn about Security',
      },
      global: {
        title: 'Global Access',
        subtitle: 'Banking without boundaries',
        description: 'Access your accounts anywhere in the world. Zero forex markup on international transactions.',
        cta: 'View Services',
      },
      support: {
        title: '24/7 Premium Support',
        subtitle: 'Expert assistance always',
        description: 'Connect with dedicated relationship managers and support specialists around the clock.',
        cta: 'Contact Us',
      },
      digital: {
        title: 'Digital Innovation',
        subtitle: 'Cutting-edge technology',
        description: 'Mobile-first banking with AI-powered insights and seamless integration with your financial life.',
        cta: 'Explore Features',
      },
    },
    services: {
      title: 'Our Services',
      cards: 'Cards',
      loans: 'Loans',
      investments: 'Investments',
      deposits: 'Deposits',
      insurance: 'Insurance',
      wealth: 'Wealth Management',
    },
    login: {
      title: 'Internet Banking',
      subtitle: 'Securely access your accounts',
      formTitle: 'Internet Banking',
      formSubtitle: 'Securely access your accounts and manage your finances',
      userIdLabel: 'User ID / Email',
      userIdPlaceholder: 'Enter your User ID',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
      forgotPassword: 'Forgot password?',
      submitButton: 'Login to NetBanking',
      submittingButton: 'Signing In...',
      newUser: 'New User?',
      registerNow: 'Register Now',
      errorInvalidCredentials: 'Invalid credentials. Please check your details.',
      marketingTitle: 'Your Financial Journey Starts Here',
      marketingSubtitle: 'BANKING REIMAGINED',
      servicePillars: {
        individuals: {
          title: 'Individuals',
          description: 'Deposits, loans, and transfers tailored to your needs. Manage your personal finances with ease.',
          moreInfo: 'More Info',
        },
        corporate: {
          title: 'Corporate',
          description: 'Comprehensive business solutions, payroll projects, and acquiring services for your growth.',
          moreInfo: 'More Info',
        },
        cards: {
          title: 'Plastic Cards',
          description: 'Issue/Reissue MIR payment system cards. Secure payments and transfers worldwide.',
          moreInfo: 'More Info',
        },
      },
      news: {
        title: 'Bank News',
        allNews: 'All News',
        readFullStory: 'Read full story',
        items: {
          commissionFree: {
            date: 'May 01, 2024',
            title: 'Commission Free Transfers',
            description: 'Commercial Bank "New Moscow Bank" notifies that from May 1, 2024, no commission is charged for carrying out transactions for the transfer of funds in rubles up to 30,000,000 RUB per month via mobile app.',
          },
          mirTransition: {
            date: 'April 26, 2024',
            title: 'Transition to MIR Payment System',
            description: 'We have ceased servicing VISA payment system cards. You can reissue a new MIR payment system card by contacting the Bank by phone +7 (495) 796-93-55.',
          },
        },
      },
    },
    cta: {
      title: 'Ready to Get Started?',
      subtitle: 'Join thousands of satisfied customers who trust us with their financial future.',
      button: 'Open Your Account',
    },
    register: {
      title: 'Create Your Account',
      subtitle: 'Start your banking journey today',
      formTitle: 'Create Your Account',
      formSubtitle: 'Start your banking journey today',
      fullNameLabel: 'Full Name',
      fullNamePlaceholder: 'Enter your full name',
      emailLabel: 'Email Address',
      emailPlaceholder: 'Enter your email',
      phoneLabel: 'Phone Number',
      phonePlaceholder: 'Enter your phone number',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Create a password',
      confirmPasswordLabel: 'Confirm Password',
      confirmPasswordPlaceholder: 'Confirm your password',
      passwordStrength: 'Password Strength:',
      passwordWeak: 'Weak',
      passwordMedium: 'Medium',
      passwordStrong: 'Strong',
      passwordRequirement1: 'At least 8 characters',
      passwordRequirement2: 'One uppercase letter',
      passwordRequirement3: 'One number',
      passwordRequirement4: 'One special character',
      passwordsNotMatch: 'Passwords do not match',
      termsLabel: 'I agree to the',
      termsLink: 'Terms of Service',
      privacyLink: 'Privacy Policy',
      submitButton: 'Create Account',
      submittingButton: 'Creating Account...',
      successTitle: 'Account Created!',
      successMessage: 'Redirecting to login...',
      alreadyHaveAccount: 'Already have an account?',
      loginLink: 'Login',
      errorEmailExists: 'This email is already registered. Please login instead.',
      errorRegistrationFailed: 'Registration failed. Please try again.',
      errorPasswordWeak: 'Password is too weak. Please use a stronger password.',
      errorTermsNotAccepted: 'Please accept the Terms of Service and Privacy Policy to continue.',
      marketingTitle: 'Join 2.5M+ Satisfied Customers',
      marketingSubtitle: 'JOIN THOUSANDS',
      benefit1: 'Zero account opening fees',
      benefit2: '24/7 online banking access',
      benefit3: 'Bank-level security',
      benefit4: 'Award-winning support',
      servicePillars: {
        individuals: {
          title: 'Individuals',
          description: 'Deposits, loans, and transfers tailored to your needs. Manage your personal finances with ease.',
          moreInfo: 'More Info',
        },
        corporate: {
          title: 'Corporate',
          description: 'Comprehensive business solutions, payroll projects, and acquiring services for your growth.',
          moreInfo: 'More Info',
        },
        secureBanking: {
          title: 'Secure Banking',
          description: 'Bank-level security with 24/7 monitoring. Your financial data is protected with industry-leading encryption.',
          moreInfo: 'More Info',
        },
      },
    },
    forgotPassword: {
      title: 'Reset Your Password',
      subtitle: 'Enter your email and we\'ll send you a reset link',
      formTitle: 'Forgot Password?',
      formSubtitle: 'We\'ll send you a reset link',
      emailLabel: 'Email Address',
      emailPlaceholder: 'Enter your registered email',
      submitButton: 'Send Reset Link',
      submittingButton: 'Sending...',
      successTitle: 'Check Your Email',
      successMessage: 'We\'ve sent a password reset link to',
      successNote: 'Didn\'t receive it? Check your spam folder or try again.',
      resendButton: 'Send Another Link',
      backToLogin: 'Back to Login',
      rememberPassword: 'Remember your password?',
      loginLink: 'Login',
      errorInvalidEmail: 'Please enter a valid email address.',
      marketingTitle: 'Reset Your Password',
      marketingSubtitle: 'SECURE RESET',
      marketingReassurance: 'Your account security is our priority',
      securityFeature1: 'Bank-level encryption',
      securityFeature2: 'Secure password reset process',
      securityFeature3: 'Link expires after 24 hours',
    },
    footer: {
      aboutTitle: 'About the Bank',
      aboutHistory: 'History',
      aboutMission: 'Mission & Values',
      aboutLeadership: 'Leadership',
      aboutCareers: 'Careers',
      licensedBy: 'Licensed by Central Bank',
      quickLinks: 'Quick Links',
      aboutUs: 'About Us',
      careers: 'Careers',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      support: 'Support',
      helpCenter: 'Help Center',
      reportFraud: 'Report Fraud',
      locateBranch: 'Locate Branch',
      contactUs: 'Contact Us',
      security: 'Security',
      securityMessage: 'Never share your OTP or Password with anyone. NMB officials will never ask for it.',
      copyright: 'Copyright © 2025 New Moscow Bank. All rights reserved.',
      aboutPress: 'Press Rooms',
      organizationsTitle: 'Organizations',
      organizationsCorporate: 'Corporate Accounts',
      organizationsInvestments: 'Investments',
      organizationsLoans: 'Loans',
      organizationsTrade: 'Trade Finance',
      organizationsSalary: 'Salary Projects',
      individualsTitle: 'For Individuals',
      individualsDebit: 'Debit Cards',
      individualsCredit: 'Credit Cards',
      individualsMortgages: 'Mortgages',
      individualsLoans: 'Personal Loans',
      individualsDeposits: 'Deposits',
      cardsTitle: 'Plastic Cards',
      cardsVisa: 'Visa',
      cardsMastercard: 'Mastercard',
      cardsMir: 'Mir',
      cardsPremium: 'Premium Clup',
      cardsTravel: 'Travel Benefits',
      helpTitle: 'Help & Support',
      helpContact: 'Contact Us',
      helpBranch: 'Find a Branch',
      helpAtm: 'ATMs',
      helpSecurity: 'Security',
      helpLostCard: 'Lost Card',
    },
    dashboard: {
      hero: {
        welcome: 'Welcome,',
        lastLogin: 'Last login:',
        accounts: 'Accounts',
        cards: 'Cards',
        fdRd: 'FD/RD',
        loans: 'Loans',
      },
      summaryStats: {
        totalBalance: 'Total Balance',
        thisMonthSpending: 'This Month Spending',
        activeFDs: 'Active FDs',
        vsLastMonth: 'vs last month',
      },
      accounts: {
        myAccounts: 'My Accounts',
        manageAndView: 'Manage and view your accounts',
        showBalance: 'Show Balance',
        hideBalance: 'Hide Balance',
        savingsAccount: 'Savings Account',
        currentAccount: 'Current Account',
        fixedDeposit: 'Fixed Deposit',
        accountNumber: 'Account Number',
        accountDetails: 'Account Details',
        availableBalance: 'Available Balance',
        ifscCode: 'IFSC Code',
        branch: 'Branch',
        branchNames: {
          cyberCityMain: 'Cyber City Main',
        },
        interestRate: 'Interest Rate',
        maturityDate: 'Maturity Date',
        accountStatus: 'Account Status',
        active: 'Active',
        accountType: 'Account Type',
      },
      quickLinks: {
        title: 'Quick Links',
        accountStatement: 'Account Statement',
        downloadPdf: 'Download PDF',
        openFD: 'Open FD',
        fixedDeposit: 'Fixed Deposit',
        transferMoney: 'Transfer Money',
        quickTransfer: 'Quick Transfer',
        sweepInOD: 'Sweep-in / OD',
        overdraft: 'Overdraft',
        investments: 'Investments',
        portfolio: 'Portfolio',
        loans: 'Loans',
        applyNow: 'Apply Now',
      },
      favouriteLinks: {
        title: 'Favourite Links',
        accountStatement: 'Account Statement',
        openFD: 'Open FD',
        downloadFDSummary: 'Download FD Summary',
        sweepInOD: 'Sweep-in / OD',
        casaCertificate: 'CASA certificate',
      },
      billsRecharge: {
        title: 'Bills & Recharge',
        electricity: 'Electricity',
        mobilePrepaid: 'Mobile Prepaid',
        mobilePostpaid: 'Mobile Postpaid',
        water: 'Water',
        internet: 'Internet',
        dth: 'DTH',
        insurance: 'Insurance',
        mutualFunds: 'Mutual Funds',
      },
      recentTransactions: {
        title: 'Recent Transactions',
        viewAll: 'View All',
        noRecentTransactions: 'No recent transactions',
        viewTransactionHistory: 'View Transaction History',
        transactionDetails: 'Transaction Details',
        referenceId: 'Reference ID:',
        description: 'Description',
        amount: 'Amount',
        dateTime: 'Date & Time',
        category: 'Category',
        categories: {
          transfer: 'Transfer',
          entertainment: 'Entertainment',
          food: 'Food',
          shopping: 'Shopping',
          bills: 'Bills',
          other: 'Other',
        },
        descriptions: {
          openingDeposit: 'Opening Deposit',
          netflix: 'Netflix',
          starbucks: 'Starbucks',
        },
      },
      sendMoney: {
        title: 'Send Money',
        fromAccount: 'FROM ACCOUNT',
        toAccount: 'TO ACCOUNT / BENEFICIARY',
        toAccountPlaceholder: 'Account number or beneficiary',
        amount: 'AMOUNT',
        proceed: 'Proceed',
        confirmTransfer: 'Confirm Transfer',
        reviewDetails: 'Please review the transfer details before proceeding.',
        cancel: 'Cancel',
        confirm: 'Confirm',
        enterOTP: 'Enter OTP',
        otpDescription: 'Please enter the 6-digit OTP sent to your registered mobile number.',
        submit: 'Submit',
        processing: 'Processing...',
        errorFillAll: 'Please fill all fields with valid values',
        errorInvalidAccount: 'Please enter a valid account number (9-18 digits)',
        errorAmountGreater: 'Amount must be greater than 0',
        errorMinAmount: 'Minimum transfer amount is ₹1',
        errorInsufficientBalance: 'Insufficient balance',
        errorInvalidOTP: 'Please enter a valid 6-digit OTP',
        errorTransferFailed: 'Transfer failed. Please try again.',
      },
      layout: {
        searchPlaceholder: 'Search services, accounts, cards...',
        noResultsFound: 'No results found for',
      },
      customerDetails: {
        customerProfile: 'Customer Profile',
        kycVerified: 'KYC Verified',
        customerId: 'Customer ID',
        copy: 'Copy',
        copied: 'Copied!',
        contactInformation: 'Contact Information',
        phone: 'Phone',
        email: 'Email',
        logout: 'Logout',
        editProfile: 'Edit Profile',
      },
    },
  },
  ru: {
    nav: {
      personal: 'Частным лицам',
      corporate: 'Бизнесу',
      sme: 'МСБ',
      about: 'О банке',
      login: 'Войти',
      openAccount: 'Открыть счёт',
      phone: '8-800-555-0100',
      dontHaveAccount: 'Нет аккаунта?',
      alreadyHaveAccount: 'Уже есть аккаунт?',
      bankName: 'Новый Московский Банк',
    },
    hero: {
      badge: '✨ Лучший цифровой банк 2024',
      title: 'Ваше финансовое путешествие',
      titleHighlight: 'начинается здесь',
      subtitle: 'Присоединяйтесь к банку, который понимает ваши потребности и превосходит ваши ожидания.',
      ctaPrimary: 'Открыть счёт',
      ctaSecondary: 'Узнать больше',
      scrollDown: 'Прокрутите вниз',
    },
    trustBar: {
      customers: 'Довольных клиентов',
      branches: 'Филиалов',
      assets: 'Активы под управлением',
      years: 'Лет на рынке',
    },
    features: {
      accounts: {
        title: 'Сберегательные и текущие счета',
        description: 'Начните свой банковский путь с нашими гибкими вариантами счетов. Счета с нулевым балансом, премиальные преимущества и цифровой банкинг.',
        points: ['Счета с нулевым балансом', 'Премиальные банковские преимущества', 'Цифровая регистрация', 'Доступ 24/7'],
        cta: 'Открыть счёт',
      },
      security: {
        title: 'Безопасный цифровой банкинг',
        subtitle: 'Защита военного уровня',
        description: 'Ваши финансовые данные защищены корпоративным шифрованием и многофакторной аутентификацией.',
        points: ['Сквозное шифрование', 'Биометрическая аутентификация', 'Нулевая ответственность при мошенничестве', 'Мониторинг в реальном времени'],
        cta: 'Узнать о безопасности',
      },
      global: {
        title: 'Глобальный доступ',
        subtitle: 'Банкинг без границ',
        description: 'Получите доступ к своим счетам в любой точке мира. Нулевая наценка на валютные операции.',
        cta: 'Посмотреть услуги',
      },
      support: {
        title: 'Премиум поддержка 24/7',
        subtitle: 'Экспертная помощь всегда',
        description: 'Свяжитесь с персональными менеджерами и специалистами поддержки в любое время суток.',
        cta: 'Связаться с нами',
      },
      digital: {
        title: 'Цифровые инновации',
        subtitle: 'Передовые технологии',
        description: 'Мобильный банкинг с AI-аналитикой и бесшовной интеграцией с вашей финансовой жизнью.',
        cta: 'Изучить возможности',
      },
    },
    services: {
      title: 'Наши услуги',
      cards: 'Карты',
      loans: 'Кредиты',
      investments: 'Инвестиции',
      deposits: 'Депозиты',
      insurance: 'Страхование',
      wealth: 'Управление капиталом',
    },
    login: {
      title: 'Интернет-банкинг',
      subtitle: 'Безопасный доступ к счетам',
      formTitle: 'Интернет-банкинг',
      formSubtitle: 'Безопасный доступ к счетам и управление финансами',
      userIdLabel: 'ID пользователя / Email',
      userIdPlaceholder: 'Введите ваш ID пользователя',
      passwordLabel: 'Пароль',
      passwordPlaceholder: 'Введите ваш пароль',
      forgotPassword: 'Забыли пароль?',
      submitButton: 'Войти в Интернет-банкинг',
      submittingButton: 'Вход...',
      newUser: 'Новый пользователь?',
      registerNow: 'Зарегистрироваться',
      errorInvalidCredentials: 'Неверные учетные данные. Проверьте свои данные.',
      marketingTitle: 'Ваше финансовое путешествие начинается здесь',
      marketingSubtitle: 'БАНКИНГ ПЕРЕОСМЫСЛЕН',
      servicePillars: {
        individuals: {
          title: 'Частным лицам',
          description: 'Депозиты, кредиты и переводы, адаптированные под ваши потребности. Управляйте личными финансами с легкостью.',
          moreInfo: 'Подробнее',
        },
        corporate: {
          title: 'Корпоративным клиентам',
          description: 'Комплексные бизнес-решения, зарплатные проекты и эквайринг для вашего роста.',
          moreInfo: 'Подробнее',
        },
        cards: {
          title: 'Пластиковые карты',
          description: 'Выпуск/перевыпуск карт платежной системы МИР. Безопасные платежи и переводы по всему миру.',
          moreInfo: 'Подробнее',
        },
      },
      news: {
        title: 'Новости банка',
        allNews: 'Все новости',
        readFullStory: 'Читать полностью',
        items: {
          commissionFree: {
            date: '01 мая 2024',
            title: 'Бесплатные переводы',
            description: 'Коммерческий банк "Новый Московский Банк" уведомляет, что с 1 мая 2024 года комиссия не взимается за проведение операций по переводу средств в рублях до 30 000 000 рублей в месяц через мобильное приложение.',
          },
          mirTransition: {
            date: '26 апреля 2024',
            title: 'Переход на платежную систему МИР',
            description: 'Мы прекратили обслуживание карт платежной системы VISA. Вы можете перевыпустить новую карту платежной системы МИР, обратившись в банк по телефону +7 (495) 796-93-55.',
          },
        },
      },
    },
    cta: {
      title: 'Готовы начать?',
      subtitle: 'Присоединяйтесь к тысячам довольных клиентов, которые доверяют нам своё финансовое будущее.',
      button: 'Открыть счёт',
    },
    register: {
      title: 'Создайте свой аккаунт',
      subtitle: 'Начните свой банковский путь сегодня',
      formTitle: 'Создайте свой аккаунт',
      formSubtitle: 'Начните свой банковский путь сегодня',
      fullNameLabel: 'Полное имя',
      fullNamePlaceholder: 'Введите ваше полное имя',
      emailLabel: 'Адрес электронной почты',
      emailPlaceholder: 'Введите ваш email',
      phoneLabel: 'Номер телефона',
      phonePlaceholder: 'Введите ваш номер телефона',
      passwordLabel: 'Пароль',
      passwordPlaceholder: 'Создайте пароль',
      confirmPasswordLabel: 'Подтвердите пароль',
      confirmPasswordPlaceholder: 'Подтвердите ваш пароль',
      passwordStrength: 'Надёжность пароля:',
      passwordWeak: 'Слабый',
      passwordMedium: 'Средний',
      passwordStrong: 'Сильный',
      passwordRequirement1: 'Не менее 8 символов',
      passwordRequirement2: 'Одна заглавная буква',
      passwordRequirement3: 'Одна цифра',
      passwordRequirement4: 'Один специальный символ',
      passwordsNotMatch: 'Пароли не совпадают',
      termsLabel: 'Я согласен с',
      termsLink: 'Условиями использования',
      privacyLink: 'Политикой конфиденциальности',
      submitButton: 'Создать аккаунт',
      submittingButton: 'Создание аккаунта...',
      successTitle: 'Аккаунт создан!',
      successMessage: 'Перенаправление на страницу входа...',
      alreadyHaveAccount: 'Уже есть аккаунт?',
      loginLink: 'Войти',
      errorEmailExists: 'Этот email уже зарегистрирован. Пожалуйста, войдите вместо этого.',
      errorRegistrationFailed: 'Регистрация не удалась. Пожалуйста, попробуйте снова.',
      errorPasswordWeak: 'Пароль слишком слабый. Пожалуйста, используйте более надёжный пароль.',
      errorTermsNotAccepted: 'Пожалуйста, примите Условия использования и Политику конфиденциальности для продолжения.',
      marketingTitle: 'Присоединяйтесь к 2,5М+ довольных клиентов',
      marketingSubtitle: 'ПРИСОЕДИНЯЙТЕСЬ К ТЫСЯЧАМ',
      benefit1: 'Нулевая плата за открытие счёта',
      benefit2: 'Доступ к онлайн-банкингу 24/7',
      benefit3: 'Банковский уровень безопасности',
      benefit4: 'Отмеченная наградами поддержка',
      servicePillars: {
        individuals: {
          title: 'Частным лицам',
          description: 'Депозиты, кредиты и переводы, адаптированные под ваши потребности. Управляйте личными финансами с легкостью.',
          moreInfo: 'Подробнее',
        },
        corporate: {
          title: 'Корпоративным клиентам',
          description: 'Комплексные бизнес-решения, зарплатные проекты и эквайринг для вашего роста.',
          moreInfo: 'Подробнее',
        },
        secureBanking: {
          title: 'Безопасный банкинг',
          description: 'Банковская безопасность с мониторингом 24/7. Ваши финансовые данные защищены шифрованием мирового уровня.',
          moreInfo: 'Подробнее',
        },
      },
    },
    forgotPassword: {
      title: 'Сбросить пароль',
      subtitle: 'Введите ваш email, и мы отправим вам ссылку для сброса',
      formTitle: 'Забыли пароль?',
      formSubtitle: 'Мы отправим вам ссылку для сброса',
      emailLabel: 'Адрес электронной почты',
      emailPlaceholder: 'Введите ваш зарегистрированный email',
      submitButton: 'Отправить ссылку для сброса',
      submittingButton: 'Отправка...',
      successTitle: 'Проверьте вашу почту',
      successMessage: 'Мы отправили ссылку для сброса пароля на',
      successNote: 'Не получили? Проверьте папку спам или попробуйте снова.',
      resendButton: 'Отправить ещё одну ссылку',
      backToLogin: 'Вернуться к входу',
      rememberPassword: 'Помните пароль?',
      loginLink: 'Войти',
      errorInvalidEmail: 'Пожалуйста, введите действительный адрес электронной почты.',
      marketingTitle: 'Сбросить пароль',
      marketingSubtitle: 'БЕЗОПАСНЫЙ СБРОС',
      marketingReassurance: 'Безопасность вашего аккаунта - наш приоритет',
      securityFeature1: 'Банковское шифрование',
      securityFeature2: 'Безопасный процесс сброса пароля',
      securityFeature3: 'Ссылка действительна 24 часа',
    },
    footer: {
      aboutTitle: 'О банке',
      aboutHistory: 'История',
      aboutMission: 'Миссия и ценности',
      aboutLeadership: 'Руководство',
      aboutCareers: 'Карьера',
      licensedBy: 'Лицензировано Центральным банком',
      quickLinks: 'Быстрые ссылки',
      aboutUs: 'О нас',
      careers: 'Карьера',
      privacyPolicy: 'Политика конфиденциальности',
      termsOfService: 'Условия использования',
      support: 'Поддержка',
      helpCenter: 'Центр помощи',
      reportFraud: 'Сообщить о мошенничестве',
      locateBranch: 'Найти филиал',
      contactUs: 'Связаться с нами',
      security: 'Безопасность',
      securityMessage: 'Никогда не сообщайте свой OTP или пароль никому. Сотрудники НМБ никогда не будут их запрашивать.',
      copyright: 'Авторские права © 2025 Новый Московский Банк. Все права защищены.',
      aboutPress: 'Пресс-центр',
      organizationsTitle: 'Организациям',
      organizationsCorporate: 'Корпоративные счета',
      organizationsInvestments: 'Инвестиции',
      organizationsLoans: 'Кредиты',
      organizationsTrade: 'Торговое финансирование',
      organizationsSalary: 'Зарплатные проекты',
      individualsTitle: 'Частным лицам',
      individualsDebit: 'Дебетовые карты',
      individualsCredit: 'Кредитные карты',
      individualsMortgages: 'Ипотека',
      individualsLoans: 'Потребительские кредиты',
      individualsDeposits: 'Депозиты',
      cardsTitle: 'Пластиковые карты',
      cardsVisa: 'Visa',
      cardsMastercard: 'Mastercard',
      cardsMir: 'Мир',
      cardsPremium: 'Премиум клуб',
      cardsTravel: 'Туристические преимущества',
      helpTitle: 'Помощь и поддержка',
      helpContact: 'Связаться с нами',
      helpBranch: 'Найти отделение',
      helpAtm: 'Банкоматы',
      helpSecurity: 'Безопасность',
      helpLostCard: 'Потерянная карта',
    },
    dashboard: {
      hero: {
        welcome: 'Добро пожаловать,',
        lastLogin: 'Последний вход:',
        accounts: 'Счета',
        cards: 'Карты',
        fdRd: 'Депозиты/РД',
        loans: 'Кредиты',
      },
      summaryStats: {
        totalBalance: 'Общий баланс',
        thisMonthSpending: 'Расходы за месяц',
        activeFDs: 'Активные депозиты',
        vsLastMonth: 'по сравнению с прошлым месяцем',
      },
      accounts: {
        myAccounts: 'Мои счета',
        manageAndView: 'Управляйте и просматривайте свои счета',
        showBalance: 'Показать баланс',
        hideBalance: 'Скрыть баланс',
        savingsAccount: 'Сберегательный счёт',
        currentAccount: 'Текущий счёт',
        fixedDeposit: 'Срочный вклад',
        accountNumber: 'Номер счёта',
        accountDetails: 'Детали счёта',
        availableBalance: 'Доступный баланс',
        ifscCode: 'БИК',
        branch: 'Отделение',
        branchNames: {
          cyberCityMain: 'Кибер Сити Главный',
        },
        interestRate: 'Процентная ставка',
        maturityDate: 'Дата погашения',
        accountStatus: 'Статус счёта',
        active: 'Активен',
        accountType: 'Тип счёта',
      },
      quickLinks: {
        title: 'Быстрые ссылки',
        accountStatement: 'Выписка по счёту',
        downloadPdf: 'Скачать PDF',
        openFD: 'Открыть вклад',
        fixedDeposit: 'Срочный вклад',
        transferMoney: 'Перевести деньги',
        quickTransfer: 'Быстрый перевод',
        sweepInOD: 'Свип-в / Овердрафт',
        overdraft: 'Овердрафт',
        investments: 'Инвестиции',
        portfolio: 'Портфель',
        loans: 'Кредиты',
        applyNow: 'Подать заявку',
      },
      favouriteLinks: {
        title: 'Избранные ссылки',
        accountStatement: 'Выписка по счёту',
        openFD: 'Открыть вклад',
        downloadFDSummary: 'Скачать сводку по вкладам',
        sweepInOD: 'Свип-в / Овердрафт',
        casaCertificate: 'Сертификат CASA',
      },
      billsRecharge: {
        title: 'Счета и пополнение',
        electricity: 'Электричество',
        mobilePrepaid: 'Мобильный предоплата',
        mobilePostpaid: 'Мобильный постоплата',
        water: 'Вода',
        internet: 'Интернет',
        dth: 'Спутниковое ТВ',
        insurance: 'Страхование',
        mutualFunds: 'Паевые фонды',
      },
      recentTransactions: {
        title: 'Последние транзакции',
        viewAll: 'Посмотреть все',
        noRecentTransactions: 'Нет последних транзакций',
        viewTransactionHistory: 'Посмотреть историю транзакций',
        transactionDetails: 'Детали транзакции',
        referenceId: 'ID транзакции:',
        description: 'Описание',
        amount: 'Сумма',
        dateTime: 'Дата и время',
        category: 'Категория',
        categories: {
          transfer: 'Перевод',
          entertainment: 'Развлечения',
          food: 'Еда',
          shopping: 'Покупки',
          bills: 'Счета',
          other: 'Другое',
        },
        descriptions: {
          openingDeposit: 'Начальный депозит',
          netflix: 'Netflix',
          starbucks: 'Starbucks',
        },
      },
      sendMoney: {
        title: 'Отправить деньги',
        fromAccount: 'СЧЁТ ОТПРАВИТЕЛЯ',
        toAccount: 'СЧЁТ ПОЛУЧАТЕЛЯ / БЕНЕФИЦИАР',
        toAccountPlaceholder: 'Номер счёта или бенефициар',
        amount: 'СУММА',
        proceed: 'Продолжить',
        confirmTransfer: 'Подтвердить перевод',
        reviewDetails: 'Пожалуйста, проверьте детали перевода перед продолжением.',
        cancel: 'Отмена',
        confirm: 'Подтвердить',
        enterOTP: 'Введите OTP',
        otpDescription: 'Пожалуйста, введите 6-значный OTP, отправленный на ваш зарегистрированный номер телефона.',
        submit: 'Отправить',
        processing: 'Обработка...',
        errorFillAll: 'Пожалуйста, заполните все поля корректными значениями',
        errorInvalidAccount: 'Пожалуйста, введите действительный номер счёта (9-18 цифр)',
        errorAmountGreater: 'Сумма должна быть больше 0',
        errorMinAmount: 'Минимальная сумма перевода составляет ₹1',
        errorInsufficientBalance: 'Недостаточно средств',
        errorInvalidOTP: 'Пожалуйста, введите действительный 6-значный OTP',
        errorTransferFailed: 'Перевод не удался. Пожалуйста, попробуйте снова.',
      },
      layout: {
        searchPlaceholder: 'Поиск услуг, счетов, карт...',
        noResultsFound: 'Ничего не найдено для',
      },
      customerDetails: {
        customerProfile: 'Профиль клиента',
        kycVerified: 'KYC подтверждён',
        customerId: 'ID клиента',
        copy: 'Копировать',
        copied: 'Скопировано!',
        contactInformation: 'Контактная информация',
        phone: 'Телефон',
        email: 'Email',
        logout: 'Выйти',
        editProfile: 'Редактировать профиль',
      },
    },
  },
};

