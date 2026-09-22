import React from "react";
import {
  BarChart3,
  Receipt,
  PieChart,
  CreditCard,
  Globe,
  Zap,
} from "lucide-react";

export const statsData = [
  {
    value: "50K+",
    label: "Active Users",
  },
  {
    value: "₹2B+",
    label: "Transactions Tracked",
  },
  {
    value: "99.9%",
    label: "Uptime",
  },
  {
    value: "4.9/5",
    label: "User Rating",
  },
];

export const featuresData = [
  {
    icon: <BarChart3 className="h-8 w-8 text-violet-600 dark:text-violet-400" />,
    title: "Advanced Analytics",
    description:
      "Get detailed insights into your spending patterns with AI-powered analytics and customizable reports.",
  },
  {
    icon: <Receipt className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />,
    title: "Smart Receipt Scanner",
    description:
      "Extract itemized amounts and dates automatically from receipts using Google Gemini AI.",
  },
  {
    icon: <PieChart className="h-8 w-8 text-fuchsia-600 dark:text-fuchsia-400" />,
    title: "Budget Planning",
    description: "Create and manage monthly budgets with dynamic progress bars and instant alert thresholds.",
  },
  {
    icon: <CreditCard className="h-8 w-8 text-violet-600 dark:text-violet-400" />,
    title: "Multi-Account Support",
    description: "Seamlessly aggregate checking, savings, and card balances in one unified cockpit.",
  },
  {
    icon: <Globe className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />,
    title: "Multi-Currency & Regional",
    description: "Full localization support for Rupee (₹) and global currencies with instant calculation.",
  },
  {
    icon: <Zap className="h-8 w-8 text-fuchsia-600 dark:text-fuchsia-400" />,
    title: "Automated Insights",
    description: "Receive nightly background checks for anomalies, recurring subscriptions, and spend caps.",
  },
];

export const howItWorksData = [
  {
    icon: <CreditCard className="h-8 w-8 text-violet-600 dark:text-violet-400" />,
    title: "1. Create Your Account",
    description:
      "Get started in seconds with instant Clerk authentication and encrypted vault setup.",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />,
    title: "2. Track Your Spending",
    description:
      "Log transactions manually or auto-fill details via Gemini AI receipt scanning.",
  },
  {
    icon: <PieChart className="h-8 w-8 text-fuchsia-600 dark:text-fuchsia-400" />,
    title: "3. Gain Total Control",
    description:
      "Visualize cashflow breakdowns, receive budget alerts, and hit your savings goals effortlessly.",
  },
];

export const testimonialsData = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    image: "https://randomuser.me/api/portraits/women/75.jpg",
    quote:
      "MyWallet transformed how I manage my business cashflow. The AI receipt scanner alone saves me hours every week!",
  },
  {
    name: "Michael Chen",
    role: "Freelance Designer",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    quote:
      "The dark theme aesthetic is stunning and the real-time budget guardrails keep my recurring subscriptions completely in check.",
  },
  {
    name: "Emily Rodriguez",
    role: "Financial Consultant",
    image: "https://randomuser.me/api/portraits/women/74.jpg",
    quote:
      "I recommend MyWallet to all my clients. The chart analytics, multi-account view, and crisp interface make financial clarity effortless.",
  },
];
