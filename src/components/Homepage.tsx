import { ArrowRight, Activity, Shield, Brain, Users, MessageSquare, FileText, Scan, Camera, CheckCircle, Zap, Lock, Clock } from 'lucide-react';
import { useNavigationContext } from '../context/NavigationContext';
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid';

export default function Homepage() {
  const { setActiveTab } = useNavigationContext();

  const handleGetStarted = () => {
    setActiveTab('symptoms');
  };

  const features = [
    {
      id: 'symptoms',
      name: 'Symptom Analysis',
      description: 'Get instant analysis of your symptoms with AI-powered insights and recommendations.',
      icon: Activity,
      className: 'lg:col-span-1 lg:row-span-1',
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20" />
      ),
    },
    {
      id: 'drugs',
      name: 'Drug Interactions',
      description: 'Check potential interactions between different medications for safer treatment.',
      icon: Shield,
      className: 'lg:col-span-1 lg:row-span-1',
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20" />
      ),
    },
    {
      id: 'terms',
      name: 'Medical Terms',
      description: 'Understand complex medical terminology explained in simple, clear language.',
      icon: Brain,
      className: 'lg:col-span-1 lg:row-span-1',
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20" />
      ),
    },
    {
      id: 'medical-image',
      name: 'Medical Image Analyzer',
      description: 'Upload X-rays, CT scans, MRI, or ultrasound images for AI-powered analysis.',
      icon: Scan,
      className: 'lg:col-span-1 lg:row-span-1',
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20" />
      ),
    },
    {
      id: 'medicine',
      name: 'Medicine Analyzer',
      description: 'Scan medicine packages to get detailed information and usage guidance instantly.',
      icon: Camera,
      className: 'lg:col-span-1 lg:row-span-1',
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20" />
      ),
    },
    {
      id: 'reports',
      name: 'Report Summary',
      description: 'Upload medical reports for instant AI-powered summaries and key insights.',
      icon: FileText,
      className: 'lg:col-span-1 lg:row-span-1',
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20" />
      ),
    },
    {
      id: 'policy',
      name: 'Policy Query Assistant',
      description: 'Upload policy documents and ask questions in natural language for quick answers.',
      icon: Users,
      className: 'lg:col-span-1 lg:row-span-1',
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20" />
      ),
    },
    {
      id: 'chat',
      name: 'Healthcare Chat',
      description: 'Chat with our AI assistant for instant health-related answers and guidance.',
      icon: MessageSquare,
      className: 'lg:col-span-1 lg:row-span-1',
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20" />
      ),
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Instant Analysis',
      description: 'Get immediate AI-powered insights and recommendations for your health queries.',
    },
    {
      icon: Lock,
      title: 'Secure & Private',
      description: 'Your health data is encrypted and protected with industry-standard security.',
    },
    {
      icon: Clock,
      title: '24/7 Available',
      description: 'Access health information and assistance anytime, anywhere you need it.',
    },
    {
      icon: CheckCircle,
      title: 'Evidence-Based',
      description: 'All information is based on current medical knowledge and best practices.',
    },
  ];

  return (
    <div className="w-full animate-fadeIn">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-900 py-20 sm:py-28">
        <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-32">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:mx-auto lg:col-span-12 lg:text-center">
              <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl md:text-7xl">
                Your Personal
                <span className="block text-blue-600 dark:text-blue-400 mt-2">Health AI Assistant</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 sm:mt-8 sm:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed">
                Powered by advanced AI technology to help you understand your health better. Get instant analysis of symptoms, drug interactions, medical images, and much more.
              </p>
              <div className="mt-10 sm:mt-14 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleGetStarted}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all hover:bg-blue-700 hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-6 w-6" />
                </button>
                <button
                  onClick={() => setActiveTab('about')}
                  className="inline-flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 px-8 py-4 text-lg font-semibold text-gray-900 dark:text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 border-2 border-gray-200 dark:border-gray-700"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white dark:bg-gray-900 py-16 sm:py-20">
        <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-32">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="relative group p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-blue-600 text-white mb-4 group-hover:scale-110 transition-transform">
                  <benefit.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 py-20 sm:py-28">
        <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-4">
              Comprehensive Health Tools
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400">
              Everything you need to understand and manage your health, powered by cutting-edge AI technology
            </p>
          </div>

          <BentoGrid className="auto-rows-[18rem] sm:auto-rows-[20rem] lg:auto-rows-[22rem] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <BentoCard
                key={feature.id}
                name={feature.name}
                className={feature.className}
                background={feature.background}
                Icon={feature.icon}
                description={feature.description}
                onClick={() => setActiveTab(feature.id)}
              />
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white dark:bg-gray-900 py-20 sm:py-28">
        <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-4">
              How It Works
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-blue-600 text-white text-3xl font-bold mb-6 shadow-xl">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Choose a Tool
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Select from our comprehensive suite of AI-powered health analysis tools
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-blue-600 text-white text-3xl font-bold mb-6 shadow-xl">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Input Information
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Enter your symptoms, upload images, or ask questions in natural language
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-blue-600 text-white text-3xl font-bold mb-6 shadow-xl">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Get Insights
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Receive instant AI-powered analysis and actionable health recommendations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="relative w-full py-20 px-8 sm:px-12 lg:py-28 lg:px-20 xl:px-32">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6">
                Ready to take control of your health?
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Join thousands of users who trust HealthAI Assistant for their health information needs. Start your journey to better health today.
              </p>
            </div>
            <div className="mt-10 lg:mt-0 flex flex-col sm:flex-row gap-4 lg:justify-end">
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-semibold text-blue-600 hover:bg-blue-50 shadow-2xl transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-6 w-6" />
              </button>
              <button
                onClick={() => setActiveTab('emergency')}
                className="inline-flex items-center justify-center rounded-xl bg-transparent border-2 border-white px-8 py-4 text-lg font-semibold text-white hover:bg-white/10 transition-all hover:scale-105"
              >
                Emergency Contacts
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-gray-50 dark:bg-gray-800 py-8">
        <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-32">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            ⚕️ <strong>Medical Disclaimer:</strong> HealthAI Assistant provides information for educational purposes only. Always consult with qualified healthcare professionals for medical advice, diagnosis, or treatment.
          </p>
        </div>
      </section>
    </div>
  );
}
