import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LandingPage = () => {
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setShowRoleModal(false);
    navigate(`/auth/register?role=${role}`);
  };

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 shadow-lg px-4 py-3 border-b border-blue-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo + Brand */}
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 group hover:opacity-90 transition-opacity duration-200 bg-transparent border-none p-0 cursor-pointer"
            aria-label="Return to top"
          >
            <img 
              src="/logo512.png" 
              alt="" 
              className="h-10 w-10 rounded-lg transition-transform duration-300 group-hover:scale-105" 
              aria-hidden="true"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              ChamaPlus
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <a 
              href="#features" 
              className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white hover:from-blue-100 hover:to-white transition-all duration-300 px-5 py-2.5 rounded-lg hover:bg-white/5"
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white hover:from-blue-100 hover:to-white transition-all duration-300 px-5 py-2.5 rounded-lg hover:bg-white/5"
            >
              How It Works
            </a>
            <a 
              href="#testimonials" 
              className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white hover:from-blue-100 hover:to-white transition-all duration-300 px-5 py-2.5 rounded-lg hover:bg-white/5"
            >
              Testimonials
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/signin"
              className="px-5 py-2 rounded-full font-semibold text-blue-700 bg-white hover:bg-blue-50 shadow transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:opacity-90 transition shadow-md"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileNav(!showMobileNav)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {showMobileNav && (
          <div className="md:hidden bg-white text-blue-700 rounded-b-2xl shadow-lg px-4 py-4 absolute left-0 right-0 z-50">
            <nav className="flex flex-col gap-3 items-center">
              <a href="#features" className="w-full px-4 py-2 rounded-full font-medium hover:bg-blue-100 transition" onClick={() => setShowMobileNav(false)}>Features</a>
              <a href="#how-it-works" className="w-full px-4 py-2 rounded-full font-medium hover:bg-blue-100 transition" onClick={() => setShowMobileNav(false)}>How It Works</a>
              <a href="#testimonials" className="w-full px-4 py-2 rounded-full font-medium hover:bg-blue-100 transition" onClick={() => setShowMobileNav(false)}>Testimonials</a>
              <Link
                to="/signin"
                className="w-full text-center px-4 py-2 rounded-full font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 transition mt-2"
                onClick={() => setShowMobileNav(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="w-full text-center px-4 py-2 rounded-full font-semibold text-white bg-yellow-400 hover:bg-yellow-500 transition"
                onClick={() => setShowMobileNav(false)}
              >
                Get Started
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative py-12 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Revolutionizing</span> Informal Savings In Kenya
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-lg leading-relaxed">
              Transform your savings group with our all-in-one platform. Manage contributions, track loans, and grow your investments—all in one secure, easy-to-use system designed for Kenyan Chamas.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/register"
                className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg text-center flex items-center gap-2"
              >
                Get Started
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                to="/signin"
                className="px-8 py-3.5 border-2 border-gray-200 bg-white hover:bg-gray-50 rounded-full font-medium text-gray-700 hover:border-blue-200 transition-all duration-300 flex items-center gap-2 group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4a5 5 0 105 5 5 5 0 00-5-5zm0 8a3 3 0 113-3 3 3 0 01-3 3zm9 11v-1a7 7 0 00-7-7h-4a7 7 0 00-7 7v1h2v-1a5 5 0 015-5h4a5 5 0 015 5v1h2z" />
                  </svg>
                </div>
                Sign In
              </Link>
            </div>
            <div className="pt-4">
              <div className="flex items-center gap-1 justify-center md:justify-start">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 font-medium text-center md:text-left mt-2">
                Trusted by <span className="text-blue-600 font-semibold">100+</span> groups across Kenya
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="p-1 rounded-2xl shadow-xl bg-gradient-to-r from-blue-600 to-purple-600">
              <div className="bg-white p-1 rounded-xl">
                <img
                  src={require('../assets/chama_image.jpg')}
                  alt="ChamaPlus Dashboard"
                  className="rounded-lg w-full h-auto object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-xl shadow-xl border border-blue-200/30 hidden md:block backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white">98% Success Rate</p>
                  <p className="text-sm text-blue-100">Loan Repayments</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 px-4 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 mb-4 border border-blue-100">
              Powerful Features
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
              Everything Your Chama Needs
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We've built a comprehensive suite of tools to help your savings group thrive. From seamless contribution tracking to smart loan management, we've got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Contribution Tracking",
                description: "Real-time tracking of member contributions with automated reminders and reports."
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                ),
                title: "Loan Management",
                description: "Streamlined loan application, approval, and repayment tracking system."
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Bank-Level Security",
                description: "Your data is protected with enterprise-grade security and encryption."
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Meeting Scheduling",
                description: "Coordinate meetings with automatic notifications and attendance tracking."
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                ),
                title: "Group Messaging",
                description: "Built-in chat for seamless communication among members."
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "Advanced Analytics",
                description: "Data-driven insights to help your Chama make better financial decisions."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition">
                <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 text-sm font-medium bg-purple-100 text-purple-600 rounded-full mb-4">
              Simple Process
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get started in just a few minutes
            </h2>
            <p className="text-lg text-gray-600">
              Setting up your Chama on our platform is quick and straightforward.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Create Account",
                description: "Register as an admin or member"
              },
              {
                step: "2",
                title: "Set Up Your Chama",
                description: "Add members and configure settings"
              },
              {
                step: "3",
                title: "Start Contributing",
                description: "Begin tracking contributions and activities"
              },
              {
                step: "4",
                title: "Grow Together",
                description: "Utilize all features to maximize benefits"
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-6 rounded-xl border border-gray-100 h-full">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute -right-8 top-1/2 transform -translate-y-1/2">
                    <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-600 rounded-full mb-4">
              Success Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What our users say
            </h2>
            <p className="text-lg text-gray-600">
              Don't just take our word for it - hear from some of our satisfied users.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "ChamaPlus transformed how we manage our group. Everything is now transparent and efficient.",
                name: "Sarah Wanjiku",
                role: "Chairlady, Umoja Women Group",
                avatar: "/Assets/sarah.jpg"
              },
              {
                quote: "The loan management system has saved us countless hours of paperwork and confusion.",
                name: "James Mwangi",
                role: "Treasurer, Vijana Investment Group",
                avatar: "/Assets/james.jpg"
              },
              {
                quote: "Our member participation increased by 70% after switching to ChamaPlus. Highly recommended!",
                name: "Grace Atieno",
                role: "Secretary, Chama cha Biashara",
                avatar: "/Assets/grace.jpg"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-gray-600 italic mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to transform your Chama?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of groups already benefiting from ChamaPlus.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg text-center"
            >
              Get Started
            </Link>
            <Link 
              to="/signin" 
              className="px-8 py-3 border border-white text-white rounded-full font-medium hover:bg-white hover:bg-opacity-10 transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4a5 5 0 105 5 5 5 0 00-5-5zm0 8a3 3 0 113-3 3 3 0 01-3 3zm9 11v-1a7 7 0 00-7-7h-4a7 7 0 00-7 7v1h2v-1a5 5 0 015-5h4a5 5 0 015 5v1h2z" />
              </svg>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo512.png" alt="ChamaPlus Logo" className="h-8 w-8 rounded-lg" />
              <span className="text-xl font-bold text-white">ChamaPlus</span>
            </div>
            <p className="text-sm mb-4">
              Empowering informal savings groups across Kenya with modern technology.
            </p>
            <div className="flex gap-4">
              {/* Twitter/X */}
              <a href="#" className="text-gray-400 hover:text-white transition" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zM15.38 19.5h1.36L7.324 4.126H5.865L15.38 19.5z" />
                </svg>
              </a>
              
              {/* Instagram */}
              <a href="#" className="text-gray-400 hover:text-white transition" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              
              {/* TikTok - Simplified and clearer */}
              <a href="#" className="text-gray-400 hover:text-white transition" aria-label="TikTok">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.53.02C13.4 0 14.27.01 15.14.02c.14 1.71.74 3.03 1.94 3.59.72.35 1.54.34 2.42.26v4.03c-.85.1-1.71.17-2.66.17-1.1 0-2.13-.3-3.08-.83-.32-.18-.62-.4-.9-.64-.02 1.56 0 3.12 0 4.69 0 .2 0 .41-.01.61-.02.2-.03.4-.06.6-.18 1.1-.6 2.05-1.3 2.83-.7.8-1.6 1.4-2.64 1.7-.5.1-1 .16-1.5.16-1.4 0-2.7-.5-3.7-1.2-.5-.4-.9-.9-1.2-1.5-.3-.6-.5-1.3-.5-2.1 0-.4 0-.8.1-1.2.2-1.1.8-2.1 1.6-2.9.8-.8 1.8-1.3 2.9-1.5.4-.1.8-.1 1.2-.1.1 0 .2 0 .3.01V6.49c-1.1-.1-2.2.2-3.1.7-.4.3-.8.7-1 1.2-.3.5-.4 1.1-.4 1.7 0 .9.4 1.7 1 2.3.6.6 1.4 1 2.3 1 .1 0 .2 0 .3-.01v-4.4c-1.2-.2-2.4.1-3.4.9-.3.2-.5.5-.7.8-.2.3-.3.7-.3 1.1 0 .4.1.8.3 1.1.2.3.4.6.7.8.3.2.6.4 1 .5.4.1.8.2 1.2.2.1 0 .2 0 .3-.01v-4.4c-.1 0-.2 0-.3.01-.8.1-1.6.4-2.3.9-.3.2-.5.5-.7.8-.2.3-.3.7-.3 1.1 0 .4.1.8.3 1.1.2.3.4.6.7.8.3.2.6.4 1 .5.4.1.8.2 1.2.2.1 0 .2 0 .3-.01V0h4.17z" />
                </svg>
              </a>
              
              {/* YouTube */}
              <a href="#" className="text-gray-400 hover:text-white transition" aria-label="YouTube">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              
              {/* WhatsApp - Simplified and clearer */}
              <a href="#" className="text-gray-400 hover:text-white transition" aria-label="WhatsApp">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.5 6.5c-.3-.4-.7-.7-1.2-.8-.5-.1-1-.2-1.5-.1-1.2 0-2.4.5-3.3 1.3-.3.3-.5.6-.7.9-.1.2-.2.5-.2.8 0 .3.1.6.3.8.2.2.4.3.7.3.2 0 .4 0 .6-.1.2 0 .4-.1.5-.2.1-.1.3-.2.4-.3.5-.4 1.1-.6 1.7-.5.2 0 .4 0 .6.1.2.1.3.2.5.3.1.1.2.2.3.4.1.1.1.3.1.4 0 .1 0 .3-.1.4-.1.1-.2.3-.3.4-.1.1-.2.2-.4.3-.1.1-.3.1-.4.2-.4.1-.8.3-1.1.5-.4.2-.7.5-1 .8-.1.1-.2.2-.3.4-.1.1-.1.3-.1.4 0 .1 0 .3.1.4.1.1.1.2.2.3.1.1.2.2.3.3.1.1.2.1.4.2.1 0 .3 0 .4-.1.1 0 .2-.1.3-.1.1-.1.2-.1.3-.2.3-.2.6-.5.9-.7.7-.5 1.3-1.1 1.7-1.8.2-.3.3-.7.4-1 .1-.4.1-.7 0-1.1-.2-.5-.4-.9-.8-1.2z" />
                  <path d="M12 0C5.4 0 0 5.4 0 12c0 2.1.5 4.1 1.6 5.8L0 24l6.3-1.6c1.7 1.1 3.7 1.6 5.7 1.6 6.6 0 12-5.4 12-12S18.6 0 12 0zm6.9 17.6c-.4.6-.9 1.1-1.5 1.5-.4.2-.9.4-1.4.5-.4.1-.8.1-1.2.1-1.4 0-2.8-.5-3.9-1.4-1.1-.9-1.8-2.1-2.1-3.4-.1-.5-.1-1 0-1.5.1-.5.3-1 .6-1.4.3-.4.7-.7 1.1-.9.2-.1.3-.2.4-.4.1-.1.1-.3.1-.4 0-.1 0-.3-.1-.4-.1-.1-.2-.2-.3-.3-.2-.1-.4-.2-.6-.2-.1 0-.3 0-.4.1-.2.1-.3.1-.5.2-.5.2-1 .5-1.4.9-.4.4-.8.9-1 1.5-.3.6-.4 1.2-.4 1.9 0 .6.1 1.2.4 1.8.2.6.6 1.2 1 1.7.5.5 1 1 1.7 1.3.6.3 1.3.5 2 .5 1.3 0 2.5-.4 3.5-1.2.3-.2.5-.5.7-.8.2-.3.3-.7.3-1.1 0-.2 0-.4-.1-.6-.1-.2-.2-.3-.4-.4-.2-.1-.4-.1-.6-.1-.2 0-.4 0-.5.1-.2.1-.3.2-.5.3-.1.1-.3.2-.4.3-.2.1-.4.2-.6.2-.2 0-.4 0-.6-.1-.2 0-.3-.1-.5-.2-.1-.1-.3-.2-.4-.3-.1-.1-.2-.3-.3-.4-.1-.1-.1-.3-.1-.4 0-.2 0-.3.1-.5.1-.1.2-.3.3-.4.1-.1.3-.2.4-.3.3-.2.6-.3 1-.4.4 0 .7-.1 1.1-.2.4-.1.7-.2 1-.4.3-.2.6-.4.8-.7.2-.3.4-.6.5-1 .1-.3.1-.7 0-1.1-.1-.4-.3-.7-.6-1.1z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">Features</a></li>
              <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition">API</a></li>
              <li><a href="#" className="hover:text-white transition">Integrations</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">About</a></li>
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms</a></li>
              <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-white transition">GDPR</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-sm text-center relative">
          <div className="flex justify-center -mt-10 mb-4">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition"
              aria-label="Back to top"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
          &copy; {new Date().getFullYear()} ChamaPlus. All rights reserved.
        </div>
      </footer>

      {/* Role Selection Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Get Started</h2>
            <div className="space-y-4">
              <button
                onClick={() => handleRoleSelect('member')}
                className="w-full px-6 py-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-blue-700 font-medium transition flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>I'm a Member</span>
              </button>
              <button
                onClick={() => handleRoleSelect('admin')}
                className="w-full px-6 py-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-purple-700 font-medium transition flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
                <span>I'm a Chama Admin</span>
              </button>
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-600 mb-2">Already have an account?</p>
              <button
                onClick={() => navigate('/auth/login')}
                className="text-blue-600 font-medium hover:text-blue-700 transition"
              >
                Sign In
              </button>
            </div>
            <button
              onClick={() => setShowRoleModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;