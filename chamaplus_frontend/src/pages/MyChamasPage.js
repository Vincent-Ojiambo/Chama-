import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaUpload, FaCheck, FaTimes, FaFileAlt } from "react-icons/fa";

function MyChamasPage() {
  const [chamas, setChamas] = useState([
    {
      id: "1",
      name: "Mwanzo Chama",
      created: "Jan 15, 2025",
      members: 12,
      totalFunds: "KSH 145,000",
      contribution: "KSH 12,000",
      role: "Member",
      description: "A community-based savings group focused on supporting members with emergency funds, business loans, and social welfare projects. Members contribute monthly and benefit from group investments and support.",
      memberList: [
        { name: "Vincent Ojiambo", role: "Admin", gender: "Male", age: 35, county: "Nairobi", subcounty: "Westlands", village: "Kangemi" },
        { name: "Grace Mwangi", role: "Treasurer", gender: "Female", age: 42, county: "Kiambu", subcounty: "Ruiru", village: "Gatongora" },
        { name: "John Otieno", role: "Secretary", gender: "Male", age: 38, county: "Kisumu", subcounty: "Kisumu East", village: "Manyatta" },
        { name: "Mary Wanjiku", role: "Member", gender: "Female", age: 29, county: "Murang'a", subcounty: "Kandara", village: "Ng'araria" },
        { name: "Samuel Kiptoo", role: "Member", gender: "Male", age: 31, county: "Uasin Gishu", subcounty: "Soy", village: "Kapseret" },
        { name: "Esther Njeri", role: "Member", gender: "Female", age: 27, county: "Nyeri", subcounty: "Tetu", village: "Wamagana" },
      ],
    },
    {
      id: "2",
      name: "Ujenzi Chama",
      created: "Mar 5, 2025",
      members: 8,
      totalFunds: "KSH 98,000",
      contribution: "KSH 10,000",
      role: "Treasurer",
      description: "A chama dedicated to property development and investment. Members pool resources to fund construction projects and real estate ventures, sharing profits and learning together.",
      memberList: [
        { name: "Peter Kamau", role: "Admin", gender: "Male", age: 40, county: "Nakuru", subcounty: "Naivasha", village: "Karati" },
        { name: "Vincent Ojiambo", role: "Treasurer", gender: "Male", age: 35, county: "Nairobi", subcounty: "Westlands", village: "Kangemi" },
        { name: "Jane Achieng", role: "Secretary", gender: "Female", age: 33, county: "Siaya", subcounty: "Bondo", village: "Nyamonye" },
        { name: "Lucy Wambui", role: "Member", gender: "Female", age: 45, county: "Nyandarua", subcounty: "Ol Kalou", village: "Kaimbaga" },
        { name: "James Njoroge", role: "Member", gender: "Male", age: 29, county: "Kiambu", subcounty: "Gatundu South", village: "Kiganjo" },
        { name: "Pauline Atieno", role: "Member", gender: "Female", age: 28, county: "Kisumu", subcounty: "Kisumu West", village: "Otonglo" },
      ],
    },
    {
      id: "3",
      name: "Kazi Chama",
      created: "May 9, 2025",
      members: 10,
      totalFunds: "KSH 75,000",
      contribution: "KSH 8,000",
      role: "Member",
      description: "A chama focused on job creation and entrepreneurship. Members pool resources to support small business ventures and employment opportunities, helping to boost local economies.",
      memberList: [
        { name: "Sarah Mwangi", role: "Admin", gender: "Female", age: 32, county: "Nairobi", subcounty: "Kasarani", village: "Kayole" },
        { name: "David Omondi", role: "Treasurer", gender: "Male", age: 38, county: "Mombasa", subcounty: "Nyali", village: "Mwembe" },
        { name: "Amina Hassan", role: "Secretary", gender: "Female", age: 35, county: "Machakos", subcounty: "Masinga", village: "Kilungu" },
        { name: "Peter Kimani", role: "Member", gender: "Male", age: 30, county: "Kiambu", subcounty: "Kikuyu", village: "Kahawa Wendani" },
        { name: "Fatima Ali", role: "Member", gender: "Female", age: 28, county: "Mombasa", subcounty: "Changamwe", village: "Mwembe" },
        { name: "James Mwangi", role: "Member", gender: "Male", age: 33, county: "Nairobi", subcounty: "Kasarani", village: "Kayole" },
        { name: "Mary Wambui", role: "Member", gender: "Female", age: 29, county: "Kiambu", subcounty: "Kikuyu", village: "Kahawa Wendani" },
        { name: "Ahmed Hassan", role: "Member", gender: "Male", age: 31, county: "Mombasa", subcounty: "Nyali", village: "Mwembe" },
        { name: "Sarah Kimani", role: "Member", gender: "Female", age: 27, county: "Nairobi", subcounty: "Kasarani", village: "Kayole" },
        { name: "David Mwangi", role: "Member", gender: "Male", age: 34, county: "Kiambu", subcounty: "Kikuyu", village: "Kahawa Wendani" },
      ],
    },
  ]);

  const [availableChamas, setAvailableChamas] = useState([
    {
      id: "4",
      name: "Harvest Chama",
      created: "Apr 20, 2025",
      members: 15,
      totalFunds: "KSH 200,000",
      contribution: "KSH 15,000",
      description: "An agricultural investment group focusing on farming projects and agribusiness opportunities.",
      memberList: [
        { name: "John Mwangi", role: "Admin", gender: "Male", age: 45, county: "Nakuru", subcounty: "Njoro", village: "Mau Narok" },
        { name: "Grace Wanjiru", role: "Treasurer", gender: "Female", age: 38, county: "Nakuru", subcounty: "Naivasha", village: "Karati" },
        { name: "Peter Kamau", role: "Member", gender: "Male", age: 42, county: "Nakuru", subcounty: "Naivasha", village: "Karati" }
      ]
    },
    {
      id: "5",
      name: "Tech Savvy",
      created: "Mar 10, 2025",
      members: 20,
      totalFunds: "KSH 300,000",
      contribution: "KSH 20,000",
      description: "A technology-focused chama investing in tech startups and digital solutions.",
      memberList: [
        { name: "Alice Wambui", role: "Admin", gender: "Female", age: 32, county: "Nairobi", subcounty: "Westlands", village: "Spring Valley" },
        { name: "Brian Ochieng", role: "Treasurer", gender: "Male", age: 35, county: "Nairobi", subcounty: "Westlands", village: "Lavington" },
        { name: "Diana Muthoni", role: "Member", gender: "Female", age: 28, county: "Nairobi", subcounty: "Westlands", village: "Parklands" }
      ]
    }
  ]);
  
  const [selectedChama, setSelectedChama] = useState(null);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [documentation, setDocumentation] = useState({
    nationalId: null,
    kraPin: null,
    phoneNumber: "",
    email: "",
    termsAccepted: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const handleDocumentChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const fileType = file.type;
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(fileType)) {
        setFormErrors(prev => ({
          ...prev,
          [name]: 'Please upload a valid file type (JPEG, PNG, PDF)'
        }));
        return;
      }

      if (file.size > maxSize) {
        setFormErrors(prev => ({
          ...prev,
          [name]: 'File size should be less than 5MB'
        }));
        return;
      }

      setDocumentation(prev => ({
        ...prev,
        [name]: file,
        [`${name}File`]: URL.createObjectURL(file)
      }));
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDocumentation(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    if (!documentation.nationalId) errors.nationalId = 'National ID is required';
    if (!documentation.kraPin) errors.kraPin = 'KRA Pin Certificate is required';
    if (!documentation.phoneNumber) errors.phoneNumber = 'Phone number is required';
    if (!documentation.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(documentation.email)) {
      errors.email = 'Email is invalid';
    }
    if (!documentation.termsAccepted) {
      errors.termsAccepted = 'You must accept the terms and conditions';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleJoinChama = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedAvailableChamas = availableChamas.filter(chama => chama.id !== selectedChama.id);
      const joinedChama = {
        ...selectedChama,
        role: 'Member',
        memberList: [
          ...selectedChama.memberList,
          { 
            name: 'You', 
            role: 'Member', 
            gender: 'Not specified', 
            age: 'Not specified', 
            county: 'Not specified', 
            subcounty: 'Not specified', 
            village: 'Not specified' 
          }
        ],
        members: selectedChama.members + 1,
        statistics: {
          totalContributions: 0,
          totalWithdrawals: 0,
          totalInvestments: 0,
          activeMembers: selectedChama.members + 1,
          pendingMembers: 0,
          totalMeetings: 0,
          averageAttendance: 100,
          currentBalance: 0
        }
      };
      
      setChamas([...chamas, joinedChama]);
      setAvailableChamas(updatedAvailableChamas);
      setSubmitSuccess(true);
      setIsSubmitting(false);
      
      // Close the form after 2 seconds
      setTimeout(() => {
        setShowJoinForm(false);
      }, 2000);
    }, 1500);
  };

  const handleJoinClick = (chama) => {
    setSelectedChama(chama);
    setShowJoinForm(true);
    setSubmitSuccess(false);
    setDocumentation({
      nationalId: null,
      nationalIdFile: null,
      kraPin: null,
      kraPinFile: null,
      phoneNumber: "",
      email: "",
      termsAccepted: false
    });
    setFormErrors({});
  };
  
  const nationalIdRef = useRef(null);
  const kraPinRef = useRef(null);
  const passportPhotoRef = useRef(null);
  const proofOfResidenceRef = useRef(null);



  const renderFilePreview = (file, fileUrl, type) => {
    if (!file) return null;
    return (
      <div className="mt-2 flex items-center p-2 border rounded-lg bg-gray-50">
        {file.type.startsWith('image/') ? (
          <img 
            src={fileUrl} 
            alt={type === 'nationalId' ? 'National ID' : 'KRA Pin'} 
            className="h-12 w-12 object-cover rounded"
          />
        ) : (
          <div className="h-12 w-12 bg-blue-100 rounded flex items-center justify-center">
            <FaFileAlt className="text-blue-500 text-xl" />
          </div>
        )}
        <div className="ml-3 overflow-hidden">
          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
          <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setDocumentation(prev => ({
              ...prev,
              [type]: null,
              [`${type}File`]: null
            }));
          }}
          className="ml-2 text-gray-400 hover:text-red-500"
        >
          <FaTimes />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-100 p-4 pt-8">
      <div className="flex items-center mb-6">
        <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center justify-between mb-6 relative overflow-hidden">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">My Chamas</h1>
            <p className="text-lg text-blue-50 mb-4 md:mb-0">Manage your savings groups.</p>
          </div>
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-bl-full z-0" />
        </div>

        {/* Chamas Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {chamas.map((chama) => (
            <div key={chama.id} className="bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 rounded-2xl shadow-xl p-6 flex flex-col relative group hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="inline-block bg-green-200 text-green-700 rounded-full px-2 py-1 text-xs font-semibold mr-2">{chama.role}</span>
                  {chama.name}
                </h2>
                <span className="text-xs text-gray-500">{chama.created}</span>
              </div>
              <div className="flex flex-col space-y-2 mt-2 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="inline-block bg-blue-100 text-blue-700 rounded-full px-2 py-1 text-xs font-semibold">Members: {chama.members}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="inline-block bg-purple-100 text-purple-700 rounded-full px-2 py-1 text-xs font-semibold">Funds: {chama.totalFunds}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="inline-block bg-green-50 text-green-700 rounded-full px-2 py-1 text-xs font-semibold">Contribution: {chama.contribution}</span>
                </div>
              </div>
              <Link 
                to={`/chamas/${chama.id}`}
                state={{ chama }}
                className="mt-auto text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-4 py-2 rounded-lg font-semibold shadow focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
              >
                View
              </Link>
            </div>
          ))}
        </div>

        {/* Available Chamas Section */}
        {availableChamas.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Available Chamas to Join</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {availableChamas.map((chama) => (
                <div key={chama.id} className="bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 rounded-2xl shadow-xl p-6 flex flex-col relative group hover:shadow-2xl transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-gray-800">{chama.name}</h2>
                    <span className="text-xs text-gray-500">{chama.created}</span>
                  </div>
                  <div className="flex flex-col space-y-2 mt-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="inline-block bg-blue-100 text-blue-700 rounded-full px-2 py-1 text-xs font-semibold">Members: {chama.members}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="inline-block bg-purple-100 text-purple-700 rounded-full px-2 py-1 text-xs font-semibold">Funds: {chama.totalFunds}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="inline-block bg-yellow-100 text-yellow-700 rounded-full px-2 py-1 text-xs font-semibold">Contribution: {chama.contribution}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{chama.description}</p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinClick(chama);
                    }}
                    className="mt-auto bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg font-semibold shadow focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
                  >
                    Join Chama
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Join Chama Modal */}
        {showJoinForm && selectedChama && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-5 w-full max-w-2xl relative my-8 border border-gray-100 overflow-y-auto max-h-[calc(100vh-4rem)]">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-green-500"></div>
              <button
                onClick={() => setShowJoinForm(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {!submitSuccess ? (
                <>
                  <div className="lg:col-span-2 text-center mb-3 px-1">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                      Join {selectedChama.name}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto">
                      Please provide the following information to join this chama. All fields marked with <span className="text-red-500">*</span> are required.
                    </p>
                  </div>
                  
                  <div className="lg:col-span-2 mt-1">
                    <h3 className="text-base font-semibold text-gray-700 pb-2 border-b border-gray-100 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Personal Information
                    </h3>
                  </div>
                  
                  <form onSubmit={handleJoinChama} className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 pb-1">
                    {/* Full Name */}
                    <div className="lg:col-span-2">
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={documentation.fullName || ''}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                          formErrors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.fullName && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        National ID <span className="text-red-500">*</span>
                      </label>
                      {documentation.nationalId ? (
                        renderFilePreview(documentation.nationalId, documentation.nationalIdFile, 'nationalId')
                      ) : (
                        <div className="mt-1 flex items-center">
                          <input
                            type="file"
                            ref={nationalIdRef}
                            name="nationalId"
                            onChange={handleDocumentChange}
                            accept="image/*,.pdf"
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => nationalIdRef.current?.click()}
                            className={`w-full flex items-center justify-between px-3 py-1.5 border-2 border-dashed rounded-lg ${
                              formErrors.nationalId ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            <span className="text-xs sm:text-sm text-gray-600">Upload National ID</span>
                            <FaUpload className="ml-1 sm:ml-2 text-gray-400 text-sm sm:text-base" />
                          </button>
                        </div>
                      )}
                      {formErrors.nationalId && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.nationalId}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">National ID or Passport</p>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        KRA Pin Certificate <span className="text-red-500">*</span>
                      </label>
                      {documentation.kraPin ? (
                        renderFilePreview(documentation.kraPin, documentation.kraPinFile, 'kraPin')
                      ) : (
                        <div className="mt-1 flex items-center">
                          <input
                            type="file"
                            ref={kraPinRef}
                            name="kraPin"
                            onChange={handleDocumentChange}
                            accept="image/*,.pdf"
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => kraPinRef.current?.click()}
                            className={`w-full flex items-center justify-between px-3 py-1.5 border-2 border-dashed rounded-lg ${
                              formErrors.kraPin ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            <span className="text-xs sm:text-sm text-gray-600">Upload KRA Pin Certificate</span>
                            <FaUpload className="ml-1 sm:ml-2 text-gray-400 text-sm sm:text-base" />
                          </button>
                        </div>
                      )}
                      {formErrors.kraPin && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.kraPin}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">KRA Pin Certificate</p>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={documentation.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="e.g. 0712345678"
                        className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                          formErrors.phoneNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.phoneNumber && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.phoneNumber}</p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={documentation.dateOfBirth || ''}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                          formErrors.dateOfBirth ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.dateOfBirth && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.dateOfBirth}</p>
                      )}
                    </div>

                    {/* ID Number */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        ID/Passport Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="idNumber"
                        value={documentation.idNumber || ''}
                        onChange={handleInputChange}
                        placeholder="Enter ID/Passport number"
                        className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                          formErrors.idNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.idNumber && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.idNumber}</p>
                      )}
                    </div>

                    {/* Physical Address */}
                    <div className="lg:col-span-2">
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Physical Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={documentation.address || ''}
                        onChange={handleInputChange}
                        placeholder="Your physical address"
                        className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                          formErrors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.address && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
                      )}
                    </div>

                    <div className="lg:col-span-2 mt-3">
                      <h3 className="text-base font-semibold text-gray-700 pb-2 border-b border-gray-100 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Documentation
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mt-2 px-1">Please upload clear photos or scans of the required documents (PDF, JPG, or PNG, max 5MB each)</p>
                    </div>

                    {/* Passport Photo */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Passport Photo <span className="text-red-500">*</span>
                      </label>
                      {documentation.passportPhoto ? (
                        renderFilePreview(documentation.passportPhoto, documentation.passportPhotoFile, 'passportPhoto')
                      ) : (
                        <div className="mt-1 flex items-center">
                          <input
                            type="file"
                            ref={passportPhotoRef}
                            name="passportPhoto"
                            onChange={handleDocumentChange}
                            accept="image/*"
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => passportPhotoRef.current?.click()}
                            className={`w-full flex items-center justify-between px-3 py-1.5 border-2 border-dashed rounded-lg ${
                              formErrors.passportPhoto ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            <span className="text-xs sm:text-sm text-gray-600">Upload Photo</span>
                            <FaUpload className="ml-1 sm:ml-2 text-gray-400 text-sm sm:text-base" />
                          </button>
                        </div>
                      )}
                      {formErrors.passportPhoto && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.passportPhoto}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">Recent passport-sized photo</p>
                    </div>

                    {/* Proof of Residence */}
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Proof of Residence <span className="text-red-500">*</span>
                      </label>
                      {documentation.proofOfResidence ? (
                        renderFilePreview(documentation.proofOfResidence, documentation.proofOfResidenceFile, 'proofOfResidence')
                      ) : (
                        <div className="mt-1 flex items-center">
                          <input
                            type="file"
                            ref={proofOfResidenceRef}
                            name="proofOfResidence"
                            onChange={handleDocumentChange}
                            accept="image/*,.pdf"
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => proofOfResidenceRef.current?.click()}
                            className={`w-full flex items-center justify-between px-3 py-1.5 border-2 border-dashed rounded-lg ${
                              formErrors.proofOfResidence ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            <span className="text-xs sm:text-sm text-gray-600">Upload Document</span>
                            <FaUpload className="ml-1 sm:ml-2 text-gray-400 text-sm sm:text-base" />
                          </button>
                        </div>
                      )}
                      {formErrors.proofOfResidence && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.proofOfResidence}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">Utility bill or bank statement</p>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={documentation.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className={`w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                          formErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                      )}
                    </div>

                    <div className="lg:col-span-2 mt-3 bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                      <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Terms & Conditions
                      </h3>
                      <div className="flex items-start">
                        <div className="flex items-start mt-0.5">
                          <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            checked={documentation.termsAccepted}
                            onChange={(e) => setDocumentation(prev => ({
                              ...prev,
                              termsAccepted: e.target.checked
                            }))}
                            className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-2 text-xs sm:text-sm">
                          <label htmlFor="terms" className="font-medium text-gray-700">
                            I agree to the chama's terms and conditions
                          </label>
                          {formErrors.termsAccepted && (
                            <p className="text-red-600 text-xs sm:text-sm">{formErrors.termsAccepted}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-2 mt-4 pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm sm:text-base font-medium text-white ${
                          isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : 'Join Chama'}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-6 sm:py-8 px-4 sm:px-8">
                  <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-green-100 mb-4">
                    <FaCheck className="h-7 w-7 text-green-600" />
                  </div>
                  <h3 className="mt-3 text-base sm:text-lg font-medium text-gray-900">Request Submitted!</h3>
                  <div className="mt-2">
                    <p className="text-sm sm:text-base text-gray-500 px-2 max-w-md mx-auto">
                      Your request to join {selectedChama.name} has been received. The chama administrators will review your documents and get back to you shortly.
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-6">
                    <button
                      type="button"
                      onClick={() => setShowJoinForm(false)}
                      className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}


      </div>
    </div>
  );
}

export default MyChamasPage;
