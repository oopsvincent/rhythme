// import React from 'react';
// import { Shield, Lock, Eye, Database, UserCheck, AlertTriangle } from 'lucide-react';

// const PrivacyPolicy = () => {
//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 text-primary font-primary">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <div className="flex justify-center mb-4">
//             <Shield className="h-12 w-12 text-primary" />
//           </div>
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
//           <p className="text-lg text-gray-600">
//             Rhythmé by <span className="font-semibold">Nintonic</span>

//             <br />

//                         <h1 className='text-red-600 font-bold text-3xl' >
//                 These will come to action after production in September 2026. Before that these policies are uselesss, they don't mean a thing to anyone, we are not even a company yet.
//             </h1>
//           </p>
//           <p className="text-sm text-gray-500 mt-2">
//             Last updated: {new Date().toLocaleDateString()}
//           </p>
//         </div>

//         {/* Content */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
//           <div className="prose max-w-none">
            
//             {/* Introduction */}
//             <section className="mb-8">
//               <div className="flex items-center mb-4">
//                 <UserCheck className="h-6 w-6 text-blue-600 mr-3" />
//                 <h2 className="text-2xl font-bold text-gray-900">Introduction</h2>
//               </div>
//               <p className="text-gray-700 leading-relaxed">
//                 Welcome to Rhythmé, a productivity ecosystem operated by Nintonic ("we," "our," or "us"). 
//                 This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
//                 use our web application, mobile application, and related services (collectively, the "Service").
//               </p>
//               <p className="text-gray-700 leading-relaxed mt-4">
//                 By accessing or using our Service, you agree to the collection and use of information in accordance 
//                 with this Privacy Policy. If you do not agree with our policies and practices, do not use our Service.
//               </p>
//             </section>

//             {/* Information We Collect */}
//             <section className="mb-8">
//               <div className="flex items-center mb-4">
//                 <Database className="h-6 w-6 text-blue-600 mr-3" />
//                 <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
//               </div>
              
//               <h3 className="text-xl font-semibold text-gray-800 mb-3">Personal Information</h3>
//               <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
//                 <li>Account information (name, email address, password)</li>
//                 <li>Profile information (profile picture, preferences, settings)</li>
//                 <li>Payment information (processed securely through third-party providers)</li>
//                 <li>Communication data (support requests, feedback)</li>
//               </ul>

//               <h3 className="text-xl font-semibold text-gray-800 mb-3">Usage Information</h3>
//               <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
//                 <li>Habit tracking data (habits, completion status, streaks)</li>
//                 <li>Journal entries and mood tracking information</li>
//                 <li>Focus session data (duration, productivity metrics)</li>
//                 <li>Goal setting and progress information</li>
//                 <li>Gamification data (XP points, achievements, levels)</li>
//                 <li>Social interaction data (accountability partners, challenges)</li>
//               </ul>

//               <h3 className="text-xl font-semibold text-gray-800 mb-3">Technical Information</h3>
//               <ul className="list-disc list-inside text-gray-700 space-y-2">
//                 <li>Device information (IP address, browser type, operating system)</li>
//                 <li>Usage analytics (pages visited, features used, session duration)</li>
//                 <li>Cookies and similar tracking technologies</li>
//                 <li>Error logs and performance data</li>
//               </ul>
//             </section>

//             {/* How We Use Information */}
//             <section className="mb-8">
//               <div className="flex items-center mb-4">
//                 <Eye className="h-6 w-6 text-blue-600 mr-3" />
//                 <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
//               </div>
//               <p className="text-gray-700 leading-relaxed mb-4">
//                 We use the information we collect for various purposes, including:
//               </p>
//               <ul className="list-disc list-inside text-gray-700 space-y-2">
//                 <li>Providing, operating, and maintaining our Service</li>
//                 <li>Processing transactions and managing subscriptions</li>
//                 <li>Personalizing your experience and providing tailored recommendations</li>
//                 <li>Generating AI-powered insights and productivity analytics</li>
//                 <li>Facilitating social features and accountability partnerships</li>
//                 <li>Sending administrative information and service updates</li>
//                 <li>Responding to customer support requests</li>
//                 <li>Improving our Service through analytics and user feedback</li>
//                 <li>Detecting and preventing fraud, abuse, and security issues</li>
//                 <li>Complying with legal obligations</li>
//               </ul>
//             </section>

//             {/* Information Sharing */}
//             <section className="mb-8">
//               <div className="flex items-center mb-4">
//                 <Lock className="h-6 w-6 text-blue-600 mr-3" />
//                 <h2 className="text-2xl font-bold text-gray-900">Information Sharing and Disclosure</h2>
//               </div>
//               <p className="text-gray-700 leading-relaxed mb-4">
//                 We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
//               </p>
              
//               <h3 className="text-xl font-semibold text-gray-800 mb-3">Service Providers</h3>
//               <p className="text-gray-700 leading-relaxed mb-4">
//                 We may share your information with trusted third-party service providers who assist us in operating our Service, 
//                 including hosting providers, payment processors, analytics services, and customer support tools.
//               </p>

//               <h3 className="text-xl font-semibold text-gray-800 mb-3">Social Features</h3>
//               <p className="text-gray-700 leading-relaxed mb-4">
//                 When you participate in social features like accountability partnerships or challenges, 
//                 certain information may be shared with other users as part of the intended functionality.
//               </p>

//               <h3 className="text-xl font-semibold text-gray-800 mb-3">Legal Requirements</h3>
//               <p className="text-gray-700 leading-relaxed mb-4">
//                 We may disclose your information if required by law or in response to valid legal processes, 
//                 such as court orders or government requests.
//               </p>

//               <h3 className="text-xl font-semibold text-gray-800 mb-3">Business Transfers</h3>
//               <p className="text-gray-700 leading-relaxed">
//                 In the event of a merger, acquisition, or sale of assets, your information may be transferred 
//                 to the acquiring entity, subject to the same privacy protections.
//               </p>
//             </section>

//             {/* Data Security */}
//             <section className="mb-8">
//               <div className="flex items-center mb-4">
//                 <Shield className="h-6 w-6 text-blue-600 mr-3" />
//                 <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
//               </div>
//               <p className="text-gray-700 leading-relaxed mb-4">
//                 We implement appropriate technical and organizational security measures to protect your personal information against 
//                 unauthorized access, alteration, disclosure, or destruction. These measures include:
//               </p>
//               <ul className="list-disc list-inside text-gray-700 space-y-2">
//                 <li>Encryption of data in transit and at rest</li>
//                 <li>Regular security assessments and updates</li>
//                 <li>Access controls and authentication measures</li>
//                 <li>Secure hosting infrastructure</li>
//                 <li>Regular backups and disaster recovery procedures</li>
//               </ul>
//               <p className="text-gray-700 leading-relaxed mt-4">
//                 However, no method of transmission over the Internet or electronic storage is 100% secure. 
//                 While we strive to protect your personal information, we cannot guarantee absolute security.
//               </p>
//             </section>

//             {/* Data Retention */}
//             <section className="mb-8">
//               <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
//               <p className="text-gray-700 leading-relaxed">
//                 We retain your personal information for as long as necessary to provide our Service and fulfill the purposes 
//                 outlined in this Privacy Policy. We may retain certain information for longer periods as required by law or 
//                 for legitimate business purposes, such as fraud prevention and service improvement.
//               </p>
//             </section>

//             {/* Your Rights */}
//             <section className="mb-8">
//               <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights and Choices</h2>
//               <p className="text-gray-700 leading-relaxed mb-4">
//                 Depending on your jurisdiction, you may have the following rights regarding your personal information:
//               </p>
//               <ul className="list-disc list-inside text-gray-700 space-y-2">
//                 <li><strong>Access:</strong> Request access to your personal information</li>
//                 <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete information</li>
//                 <li><strong>Erasure:</strong> Request deletion of your personal information</li>
//                 <li><strong>Portability:</strong> Request transfer of your data to another service</li>
//                 <li><strong>Restriction:</strong> Request limitation of processing of your information</li>
//                 <li><strong>Objection:</strong> Object to processing of your information</li>
//                 <li><strong>Withdrawal:</strong> Withdraw consent where processing is based on consent</li>
//               </ul>
//               <p className="text-gray-700 leading-relaxed mt-4">
//                 To exercise these rights, please contact us at privacy@[yourcompany].com. We will respond to your request 
//                 within a reasonable timeframe and in accordance with applicable laws.
//               </p>
//             </section>

//             {/* Cookies */}
//             <section className="mb-8">
//               <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking Technologies</h2>
//               <p className="text-gray-700 leading-relaxed mb-4">
//                 We use cookies and similar tracking technologies to enhance your experience on our Service. 
//                 These technologies help us:
//               </p>
//               <ul className="list-disc list-inside text-gray-700 space-y-2">
//                 <li>Remember your preferences and settings</li>
//                 <li>Authenticate your account and maintain security</li>
//                 <li>Analyze usage patterns and improve our Service</li>
//                 <li>Provide personalized content and recommendations</li>
//               </ul>
//               <p className="text-gray-700 leading-relaxed mt-4">
//                 You can control cookies through your browser settings, but disabling certain cookies may affect 
//                 the functionality of our Service.
//               </p>
//             </section>

//             {/* Third-Party Services */}
//             <section className="mb-8">
//               <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
//               <p className="text-gray-700 leading-relaxed">
//                 Our Service may contain links to third-party websites or integrate with third-party services. 
//                 We are not responsible for the privacy practices of these third parties. We encourage you to 
//                 review their privacy policies before providing any information.
//               </p>
//             </section>

//             {/* Children's Privacy */}
//             <section className="mb-8">
//               <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
//               <p className="text-gray-700 leading-relaxed">
//                 Our Service is not intended for children under the age of 13. We do not knowingly collect 
//                 personal information from children under 13. If we become aware that we have collected personal 
//                 information from a child under 13, we will take steps to delete such information promptly.
//               </p>
//             </section>

//             {/* International Transfers */}
//             <section className="mb-8">
//               <h2 className="text-2xl font-bold text-gray-900 mb-4">International Data Transfers</h2>
//               <p className="text-gray-700 leading-relaxed">
//                 Your information may be transferred to and processed in countries other than your own. 
//                 We ensure that such transfers comply with applicable data protection laws and implement 
//                 appropriate safeguards to protect your information.
//               </p>
//             </section>

//             {/* Changes to Policy */}
//             <section className="mb-8">
//               <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
//               <p className="text-gray-700 leading-relaxed">
//                 We may update this Privacy Policy from time to time to reflect changes in our practices or 
//                 applicable laws. We will notify you of any material changes by posting the updated policy on 
//                 our Service and updating the "Last updated" date. Your continued use of our Service after 
//                 such changes constitutes acceptance of the updated policy.
//               </p>
//             </section>

//             {/* Disclaimer */}
//             <section className="mb-8">
//               <div className="flex items-center mb-4">
//                 <AlertTriangle className="h-6 w-6 text-amber-600 mr-3" />
//                 <h2 className="text-2xl font-bold text-gray-900">Disclaimer</h2>
//               </div>
//               <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
//                 <p className="text-gray-700 leading-relaxed">
//                   <strong>IMPORTANT DISCLAIMER:</strong> Rhythmé by Nintonic is provided as a productivity tool. 
//                   While we strive to provide accurate and reliable service, we make no warranties or guarantees regarding 
//                   the effectiveness, accuracy, or reliability of our Service. Use of our Service is at your own risk, 
//                   and we shall not be liable for any damages arising from your use of the Service, including but not 
//                   limited to data loss, productivity impacts, or any other direct or indirect damages.
//                 </p>
//               </div>
//             </section>

//             {/* Contact Information */}
//             <section className="mb-8">
//               <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
//               <p className="text-gray-700 leading-relaxed mb-4">
//                 If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, 
//                 please contact us:
//               </p>
//               <div className="bg-gray-50 rounded-lg p-6">
//                 <p className="text-gray-700"><strong>Email:</strong> privacy@[yourcompany].com</p>
//                 <p className="text-gray-700"><strong>Support:</strong> support@[yourcompany].com</p>
//                 <p className="text-gray-700"><strong>Address:</strong> [Your Company Address]</p>
//                 <p className="text-gray-700"><strong>Phone:</strong> [Your Phone Number]</p>
//               </div>
//             </section>

//           </div>
//         </div>

//         {/* Back to App Button */}
//         <div className="text-center mt-8">
//           <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
//             Back to App
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PrivacyPolicy;