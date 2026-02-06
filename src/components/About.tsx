import { Heart, Shield, Zap, Users, Target, Award, Globe, Sparkles } from 'lucide-react';
import { PageContainer } from './ui/PageContainer';

export default function About() {
  const values = [
    {
      icon: Heart,
      title: 'Patient-Centered',
      description: 'We put your health and well-being at the center of everything we do.',
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Your health data is protected with enterprise-grade encryption and security.',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Leveraging cutting-edge AI technology to provide the best health insights.',
    },
    {
      icon: Users,
      title: 'Accessibility',
      description: 'Making healthcare information accessible and understandable for everyone.',
    },
  ];

  const features = [
    {
      title: 'AI-Powered Analysis',
      description: 'Advanced artificial intelligence provides accurate and instant health insights based on the latest medical knowledge.',
    },
    {
      title: 'Comprehensive Tools',
      description: 'From symptom analysis to drug interactions, we offer a complete suite of health analysis tools.',
    },
    {
      title: 'Easy to Use',
      description: 'Intuitive interface designed for everyone, regardless of technical expertise or medical background.',
    },
    {
      title: 'Always Available',
      description: '24/7 access to health information and analysis whenever you need it, wherever you are.',
    },
  ];

  const stats = [
    { value: '8+', label: 'Health Tools' },
    { value: '24/7', label: 'Availability' },
    { value: 'AI', label: 'Powered' },
    { value: '100%', label: 'Secure' },
  ];

  return (
    <PageContainer
      icon={<Globe className="w-6 h-6 text-blue-600" />}
      title="About AyuMitra"
    >
      <div className="w-full space-y-16">
        {/* Mission Section */}
        <section className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6">
            <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Our Mission
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            AyuMitra is dedicated to making healthcare information more accessible and understandable for everyone. 
            We leverage advanced artificial intelligence to provide instant, accurate health insights that empower you to make 
            informed decisions about your well-being.
          </p>
        </section>

        {/* Stats Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 sm:p-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-blue-100 text-sm sm:text-base font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 mb-4">
                  <value.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 sm:p-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white text-center mb-12">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold">
                    {index + 1}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Section */}
        <section>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white text-center mb-6">
            Powered by Advanced Technology
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 text-center max-w-3xl mx-auto mb-12">
            AyuMitra utilizes state-of-the-art artificial intelligence and machine learning technologies 
            to provide accurate, reliable health information and analysis.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              'AI Analysis',
              'Natural Language',
              'Image Recognition',
              'Data Security',
              'Cloud Computing',
            ].map((tech, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="text-blue-600 dark:text-blue-400 font-semibold">
                  {tech}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Commitment Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 sm:p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-6">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Our Commitment to You
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
            We are committed to providing accurate, reliable, and accessible health information. 
            While our AI-powered tools offer valuable insights, we always recommend consulting with 
            qualified healthcare professionals for medical advice, diagnosis, or treatment.
          </p>
          <div className="inline-flex items-center gap-2 text-blue-100 text-sm">
            <Target className="w-5 h-5" />
            <span>Your health and well-being are our top priority</span>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border-l-4 border-blue-600">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Important Medical Disclaimer
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            AyuMitra provides information for educational purposes only and is not a substitute for 
            professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or 
            other qualified health provider with any questions you may have regarding a medical condition. 
            Never disregard professional medical advice or delay in seeking it because of information provided 
            by AyuMitra.
          </p>
        </section>
      </div>
    </PageContainer>
  );
}
