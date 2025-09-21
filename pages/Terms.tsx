import React from 'react';
import { FileText, AlertTriangle, Shield, CreditCard, Users, Gavel, Ban } from 'lucide-react';

const TermsOfService = () => {
  return (
    // <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 text-primary font-primary">
    //   <div className="max-w-4xl mx-auto">
    //     {/* Header */}
    //     <div className="text-center mb-12">
    //       <div className="flex justify-center mb-4">
    //         <FileText className="h-12 w-12 text-blue-600" />
    //       </div>
    //       <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
    //       <p className="text-lg text-gray-600">
    //         Rhythmé by <span className="font-semibold">Nintonic</span> <br />

    //         <h1 className='text-red-600 font-bold text-3xl' >
    //             These will come to action after production in September 2026. Before that these terms are uselesss, they don't mean a thing to anyone, we are not even a company yet.
    //         </h1>

    //       </p>
    //       <p className="text-sm text-gray-500 mt-2">
    //         Last updated: {new Date().toLocaleDateString()}
    //       </p>
    //     </div>

    //     {/* Content */}
    //     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
    //       <div className="prose max-w-none">

    //         {/* Acceptance Notice */}
    //         <section className="mb-8">
    //           <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
    //             <div className="flex items-center mb-3">
    //               <AlertTriangle className="h-5 w-5 text-blue-600 mr-2" />
    //               <h3 className="text-lg font-semibold text-blue-900">Important Notice</h3>
    //             </div>
    //             <p className="text-blue-800 leading-relaxed">
    //               <strong>BY ACCESSING OR USING RHYTHMÉ, YOU AGREE TO BE BOUND BY THESE TERMS OF SERVICE.</strong> 
    //               If you do not agree to these terms, please do not use our service. Your acceptance of these 
    //               terms is required to use our application.
    //             </p>
    //           </div>
    //         </section>
            
    //         {/* Introduction */}
    //         <section className="mb-8">
    //           <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
    //           <p className="text-gray-700 leading-relaxed mb-4">
    //             These Terms of Service ("Terms") govern your use of Rhythmé, a productivity ecosystem web and 
    //             mobile application operated by Nintonic ("Company," "we," "our," or "us"). 
    //             These Terms apply to all visitors, users, and others who access or use our Service.
    //           </p>
    //           <p className="text-gray-700 leading-relaxed">
    //             By clicking "I Accept" or by accessing or using our Service, you agree to be bound by these Terms 
    //             and our Privacy Policy. If you disagree with any part of these terms, then you may not access the Service.
    //           </p>
    //         </section>

    //         {/* Description of Service */}
    //         <section className="mb-8">
    //           <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
    //           <p className="text-gray-700 leading-relaxed mb-4">
    //             Rhythmé is a comprehensive productivity platform that offers:
    //           </p>
    //           <ul className="list-disc list-inside text-gray-700 space-y-2">
    //             <li>Habit tracking and streak management</li>
    //             <li>Digital journaling with AI-powered insights</li>
    //             <li>Focus session tools and productivity tracking</li>
    //             <li>Goal setting and progress management</li>
    //             <li>Gamification features (XP, achievements, levels)</li>
    //             <li>Social accountability and community features</li>
    //             <li>Analytics and personalized recommendations</li>
    //           </ul>
    //         </section>

    //         {/* User Accounts */}
    //         <section className="mb-8">
    //           <div className="flex items-center mb-4">
    //             <Users className="h-6 w-6 text-blue-600 mr-3" />
    //             <h2 className="text-2xl font-bold text-gray-900">3. User Accounts and Registration</h2>
    //           </div>
              
    //           <h3 className="text-xl font-semibold text-gray-800 mb-3">Account Creation</h3>
    //           <p className="text-gray-700 leading-relaxed mb-4">
    //             To use certain features of our Service, you must register for an account. You agree to:
    //           </p>
    //           <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
    //             <li>Provide accurate, current, and complete information during registration</li>
    //             <li>Maintain and update your account information</li>
    //             <li>Keep your account credentials secure and confidential</li>
    //             <li>Notify us immediately of any unauthorized use of your account</li>
    //             <li>Accept responsibility for all activities under your account</li>
    //           </ul>

    //           <h3 className="text-xl font-semibold text-gray-800 mb-3">Age Requirements</h3>
    //           <p className="text-gray-700 leading-relaxed mb-4">
    //             You must be at least 13 years old to use our Service. If you are between 13 and 18 years old, 
    //             you represent that your legal guardian has reviewed and agreed to these Terms.
    //           </p>

    //           <h3 className="text-xl font-semibold text-gray-800 mb-3">Account Termination</h3>
    //           <p className="text-gray-700 leading-relaxed">
    //             We reserve the right to suspend or terminate your account at any time, with or without cause, 
    //             with or without notice, for any reason including violation of these Terms.
    //           </p>
    //         </section>

    //         {/* Acceptable Use */}
    //         <section className="mb-8">
    //           <div className="flex items-center mb-4">
    //             <Shield className="h-6 w-6 text-blue-600 mr-3" />
    //             <h2 className="text-2xl font-bold text-gray-900">4. Acceptable Use Policy</h2>
    //           </div>
              
    //           <p className="text-gray-700 leading-relaxed mb-4">
    //             You agree to use our Service only for lawful purposes and in accordance with these Terms. 
    //             You agree NOT to:
    //           </p>
    //           <ul className="list-disc list-inside text-gray-700 space-y-2">
    //             <li>Violate any applicable federal, state, local, or international law or regulation</li>
    //             <li>Transmit or share harmful, offensive, or inappropriate content</li>
    //             <li>Harass, abuse, or harm other users</li>
    //             <li>Impersonate any person or entity or misrepresent your identity</li>
    //             <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
    //             <li>Upload viruses, malware, or other malicious code</li>
    //             <li>Spam other users or engage in unsolicited marketing</li>
    //             <li>Scrape, crawl, or harvest data from our Service without permission</li>
    //             <li>Reverse engineer, decompile, or attempt to extract source code</li>
    //             <li>Use automated tools to access or interact with our Service</li>
    //             <li>Interfere with or disrupt the Service or servers</li>
    //           </ul>
    //         </section>

    //         {/* Content and Data */}
    //         <section className="mb-8">
    //           <h2 className="text-2xl font-bold text-gray-900 mb-4">5. User Content and Data</h2>
              
    //           <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Content</h3>
    //           <p className="text-gray-700 leading-relaxed mb-4">
    //             You retain ownership of all content you create, upload, or share through our Service, including 
    //             journal entries, habit data, goals, and other personal information ("User Content").
    //           </p>

    //           <h3 className="text-xl font-semibold text-gray-800 mb-3">License to Us</h3>
    //           <p className="text-gray-700 leading-relaxed mb-4">
    //             By using our Service, you grant us a limited, non-exclusive, royalty-free license to use, 
    //             store, and process your User Content solely for the purpose of providing and improving our Service, 
    //             including generating insights and recommendations.
    //           </p>

    //           <h3 className="text-xl font-semibold text-gray-800 mb-3">Content Standards</h3>
    //           <p className="text-gray-700 leading-relaxed mb-4">
    //             You are solely responsible for your User Content and agree that it will not:
    //           </p>
    //           <ul className="list-disc list-inside text-gray-700 space-y-2">
    //             <li>Contain illegal, harmful, or offensive material</li>
    //             <li>Infringe on intellectual property rights of others</li>
    //             <li>Violate privacy rights of others</li>
    //             <li>Contain confidential information of third parties</li>
    //             <li>Be used to harm, threaten, or harass others</li>
    //           </ul>
    //         </section>

    //         {/* Subscription and Payment */}
    //         <section className="mb-8">
    //           <div className="flex items-center mb-4">
    //             <CreditCard className="h-6 w-6 text-blue-600 mr-3" />
    //             <h2 className="text-2xl font-bold text-gray-900">6. Subscription and Payment Terms</h2>
    //           </div>
              
    //           <h3 className="text-xl font-semibold text-gray-800 mb-3">Subscription Plans</h3>
    //           <p className="text-gray-700 leading-relaxed mb-4">
    //             We offer both free and paid subscription plans. Paid plans provide access to premium features 
    //             and enhanced functionality. Current pricing and features are displayed on our website.
    //           </p>

    //           <h3 className="text-xl font-semibold text-gray-800 mb-3">Billing and Payments</h3>
    //           <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
    //             <li>Subscription fees are billed in advance on a recurring basis (monthly or annually)</li>
    //             <li>Payment is due immediately upon subscription activation</li>
    //             <li>We use third-party payment processors (such as Stripe) for secure payment processing</li>
    //             <li>You authorize us to charge your payment method for applicable fees</li>
    //             <li>All fees are non-refundable except as required by law</li>
    //           </ul>

    //           <h3 className="text-xl font-semibold text-gray-800 mb-3">Price Changes</h3>
    //           <p className="text-gray-700 leading-relaxed mb-4">
    //             We reserve the right to modify subscription prices with 30 days' notice. Price changes 
    //             will not affect your current billing cycle but will apply to subsequent renewals.
    //           </p>

    //           <h3 className="text-xl font-semibold text-gray-800 mb-3">Cancellation</h3>
    //           <p className="text-gray-700 leading-relaxed">
    //             You may cancel your subscription at any time through your account settings. Cancellation 
    //             will be effective at the end of your current billing period. You will retain access to 
    //             premium features until the end of your paid period.
    //           </p>
    //         </section>

    //         {/* Intellectual Property */}
    //         <section className="mb-8">
    //           <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property Rights</h2>
              
    //           <h3 className="text-xl font-semibold text-gray-800 mb-3">Our Rights</h3>
    //           <p className="text-gray-700 leading-relaxed mb-4">
    //             The Service and its original content, features, and functionality are and will remain the 
    //             exclusive property of Nintonic and its licensors. The Service is protected by 
    //             copyright, trademark, and other intellectual property laws.
    //           </p>

    //           <h3 className="text-xl font-semibold text-gray-800 mb-3">Trademarks</h3>
    //           <p className="text-gray-700 leading-relaxed mb-4">
    //             "Rhythmé" and our logos are trademarks of Nintonic. You may not use our trademarks 
    //             without our prior written permission.
    //           </p>

    //           <h3 className="text-xl font-semibold text-gray-800 mb-3">DMCA Compliance</h3>
    //           <p className="text-gray-700 leading-relaxed">
    //             We respect intellectual property rights and will respond to legitimate copyright infringement 
    //             claims in accordance with the Digital Millennium Copyright Act (DMCA).
    //           </p>
    //         </section>

    //         {/* Privacy and Data Protection */}
    //         <section className="mb-8">
    //           <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Privacy and Data Protection</h2>
    //           <p className="text-gray-700 leading-relaxed mb-4">
    //             Your privacy is important to us. Our collection and use of personal information is governed 
    //             by our Privacy Policy, which is incorporated into these Terms by reference.
    //           </p>
    //           <p className="text-gray-700 leading-relaxed">
    //             By using our Service, you consent to the collection, use, and sharing of your information 
    //             as described in our Privacy Policy.
    //           </p>
    //         </section>

    //         {/* Service Availability */}
    //         <section className="mb-8">
    //           <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Service Availability and Modifications</h2>
              
    //           <h3 className="text-xl font-semibold text-gray-800 mb-3">Service Availability</h3>
    //           <p className="text-gray-700 leading-relaxed mb-4">
    //             We strive to maintain high availability of our Service but cannot guarantee uninterrupted access. 
    //             The Service may be temporarily unavailable due to maintenance, updates, or technical issues.
    //           </p>

    //           <h3 className="text-xl font-semibold text-gray-800 mb-3">Modifications to Service</h3>
    //           <p className="text-gray-700 leading-relaxed">
    //             We reserve the right to modify, suspend, or discontinue any part of our Service at any time, 
    //             with or without notice. We will not be liable for any modification, suspension, or discontinuation.
    //           </p>
    //         </section>

    //         {/* Prohibited Uses */}
    //         <section className="mb-8">
    //           <div className="flex items-center mb-4">
    //             <Ban className="h-6 w-6 text-red-600 mr-3" />
    //             <h2 className="text-2xl font-bold text-gray-900">10. Prohibited Uses and Enforcement</h2>
    //           </div>
              
    //           <h3 className="text-xl font-semibold text-gray-800 mb-3">Enforcement Actions</h3>
    //           <p className="text-gray-700 leading-relaxed mb-4">
    //             We reserve the right to take appropriate action against users who violate these Terms, including:
    //           </p>
    //           <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
    //             <li>Warning or temporarily suspending your account</li>
    //             <li>Permanently terminating your account</li>
    //             <li>Removing or modifying prohibited content</li>
    //             <li>Restricting access to certain features</li>
    //             <li>Taking legal action when necessary</li>
    //           </ul>

    //           <h3 className="text-xl font-semibold text-gray-800 mb-3">Reporting Violations</h3>
    //           <p className="text-gray-700 leading-relaxed">
    //             If you become aware of any violations of these Terms, please report them to us at 
    //             abuse@[yourcompany].com. We will investigate all reports and take appropriate action.
    //           </p>
    //         </section>

    //         {/* Third-Party Services */}
    //         <section className="mb-8">
    //           <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Third-Party Services and Links</h2>
    //           <p className="text-gray-700 leading-relaxed mb-4">
    //             Our Service may integrate with or contain links to third-party services, websites, or applications. 
    //             These third-party services have their own terms of service and privacy policies.
    //           </p>
    //           <p className="text-gray-700 leading-relaxed mb-4">
    //             We are not responsible for the content, privacy policies, or practices of any third-party services. 
    //             You acknowledge and agree that we shall not be liable for any damage or loss caused by your use 
    //             of any third-party services.
    //           </p>
    //           <p className="text-gray-700 leading-relaxed">
    //             We encourage you to read the terms and privacy policies of any third-party services you access 
    //             through our platform.
    //           </p>
    //         </section>

    //         {/* Disclaimers and Limitations */}
    //         <section className="mb-8">
    //           <div className="flex items-center mb-4">
    //             <AlertTriangle className="h-6 w-6 text-amber-600 mr-3" />
    //             <h2 className="text-2xl font-bold text-gray-900">12. Disclaimers and Limitations of Liability</h2>
    //           </div>
              
    //           <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
    //             <h3 className="text-xl font-semibold text-amber-900 mb-3">IMPORTANT DISCLAIMERS</h3>
    //             <div className="space-y-4 text-amber-800">
    //               <p className="font-semibold">
    //                 THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND.
    //               </p>
    //               <p>
    //                 TO THE FULLEST EXTENT PERMITTED BY LAW, Nintonic DISCLAIMS ALL WARRANTIES, 
    //                 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, 
    //                 FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
    //               </p>
    //             </div>
    //           </div>

    //           <h3 className="text-xl font-semibold text-gray-800 mb-3">No Warranties</h3>
    //           <p className="text-gray-700 leading-relaxed mb-4">
    //             We do not warrant that:
    //           </p>
    //           <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
    //             <li>The Service will meet your specific requirements or expectations</li>
    //             <li>The Service will be uninterrupted, timely, secure, or error-free</li>
    //             <li>The results obtained from using the Service will be accurate or reliable</li>
    //             <li>Any errors in the Service will be corrected</li>
    //             <li>The AI-powered insights or recommendations will be accurate or effective</li>
    //           </ul>

    //           <h3 className="text-xl font-semibold text-gray-800 mb-3">Limitation of Liability</h3>
    //           <div className="bg-red-50 border border-red-200 rounded-lg p-6">
    //             <p className="text-red-800 leading-relaxed font-semibold">
    //               IN NO EVENT SHALL Nintonic, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, 
    //               SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, 
    //               OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, 
    //               OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF THE SERVICE, EVEN IF WE HAVE BEEN 
    //               ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
    //             </p>
    //             <p className="text-red-800 leading-relaxed mt-4">
    //               OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING FROM OR RELATING TO THESE TERMS OR THE SERVICE 
    //               SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
    //             </p>
    //           </div>
    //         </section>

    //         {/* Indemnification */}
    //         <section className="mb-8">
    //           <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Indemnification</h2>
    //           <p className="text-gray-700 leading-relaxed mb-4">
    //             You agree to defend, indemnify, and hold harmless Nintonic and its officers, 
    //             directors, employees, contractors, agents, licensors, suppliers, successors, and assigns 
    //             from and against any claims, liabilities, damages, judgments, awards, losses, costs, 
    //             expenses, or fees (including reasonable attorneys' fees) arising out of or relating to:
    //           </p>
    //           <ul className="list-disc list-inside text-gray-700 space-y-2">
    //             <li>Your use of the Service</li>
    //             <li>Your violation of these Terms</li>
    //             <li>Your violation of any rights of another party</li>
    //             <li>Your User Content or any content you post or share</li>
    //             <li>Your conduct in connection with the Service</li>
    //           </ul>
    //         </section>

    //         {/* Dispute Resolution */}
    //         <section className="mb-8">
    //           <div className="flex items-center mb-4">
    //             <Gavel className="h-6 w-6 text-blue-600 mr-3" />
    //             <h2 className="text-2xl font-bold text-gray-900">14. Dispute Resolution</h2>
    //           </div>
              
    //           <h3 className="text-xl font-semibold text-gray-800 mb-3">Governing Law</h3>
    //           <p className="text-gray-700 leading-relaxed mb-4">
    //             These Terms shall be governed by and construed in accordance with the laws of [Your State/Country], 
    //             without regard to its conflict of law provisions.
    //           </p>

    //           <h3 className="text-xl font-semibold text-gray-800 mb-3">Jurisdiction</h3>
    //           <p className="text-gray-700 leading-relaxed mb-4">
    //             Any disputes arising from these Terms or your use of the Service shall be resolved exclusively 
    //             in the courts of [Your Jurisdiction]. You consent to the personal jurisdiction of such courts.
    //           </p>

    //           <h3 className="text-xl font-semibold text-gray-800 mb-3">Informal Resolution</h3>
    //           <p className="text-gray-700 leading-relaxed">
    //             Before filing any formal legal proceedings, you agree to first contact us at legal@[yourcompany].com 
    //             to seek an informal resolution of any dispute.
    //           </p>
    //         </section>

    //         {/* Termination */}
    //         <section className="mb-8">
    //           <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Termination</h2>
              
    //           <h3 className="text-xl font-semibold text-gray-800 mb-3">Termination by You</h3>
    //           <p className="text-gray-700 leading-relaxed mb-4">
    //             You may terminate your account at any time by following the account deletion process in your 
    //             account settings or by contacting us at support@[yourcompany].com.
    //           </p>

    //           <h3 className="text-xl font-semibold text-gray-800 mb-3">Termination by Us</h3>
    //           <p className="text-gray-700 leading-relaxed mb-4">
    //             We may terminate or suspend your account immediately, without prior notice or liability, 
    //             for any reason, including if you breach these Terms.
    //           </p>

    //           <h3 className="text-xl font-semibold text-gray-800 mb-3">Effect of Termination</h3>
    //           <p className="text-gray-700 leading-relaxed">
    //             Upon termination, your right to use the Service will cease immediately. We may delete your 
    //             account and all associated data. Provisions that by their nature should survive termination 
    //             shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
    //           </p>
    //         </section>

    //         {/* General Provisions */}
    //         <section className="mb-8">
    //           <h2 className="text-2xl font-bold text-gray-900 mb-4">16. General Provisions</h2>
              
    //           <h3 className="text-xl font-semibold text-gray-800 mb-3">Entire Agreement</h3>
    //           <p className="text-gray-700 leading-relaxed mb-4">
    //             These Terms, together with our Privacy Policy, constitute the entire agreement between you 
    //             and Nintonic regarding the Service.
    //           </p>

    //           <h3 className="text-xl font-semibold text-gray-800 mb-3">Modifications</h3>
    //           <p className="text-gray-700 leading-relaxed mb-4">
    //             We reserve the right to modify these Terms at any time. We will provide notice of material 
    //             changes by posting the updated Terms on our Service and updating the "Last updated" date. 
    //             Your continued use after such changes constitutes acceptance of the new Terms.
    //           </p>

    //           <h3 className="text-xl font-semibold text-gray-800 mb-3">Severability</h3>
    //           <p className="text-gray-700 leading-relaxed mb-4">
    //             If any provision of these Terms is held to be invalid or unenforceable, the remaining 
    //             provisions will remain in full force and effect.
    //           </p>

    //           <h3 className="text-xl font-semibold text-gray-800 mb-3">Waiver</h3>
    //           <p className="text-gray-700 leading-relaxed mb-4">
    //             No waiver of any term or condition shall be deemed a further or continuing waiver of such 
    //             term or any other term or condition.
    //           </p>

    //           <h3 className="text-xl font-semibold text-gray-800 mb-3">Assignment</h3>
    //           <p className="text-gray-700 leading-relaxed">
    //             You may not assign or transfer these Terms or your rights hereunder without our prior written 
    //             consent. We may assign these Terms without restriction.
    //           </p>
    //         </section>

    //         {/* Contact Information */}
    //         <section className="mb-8">
    //           <h2 className="text-2xl font-bold text-gray-900 mb-4">17. Contact Information</h2>
    //           <p className="text-gray-700 leading-relaxed mb-4">
    //             If you have any questions about these Terms of Service, please contact us:
    //           </p>
    //           <div className="bg-gray-50 rounded-lg p-6">
    //             <p className="text-gray-700"><strong>Email:</strong> legal@[yourcompany].com</p>
    //             <p className="text-gray-700"><strong>Support:</strong> support@[yourcompany].com</p>
    //             <p className="text-gray-700"><strong>Address:</strong> [Your Company Address]</p>
    //             <p className="text-gray-700"><strong>Phone:</strong> [Your Phone Number]</p>
    //           </div>
    //         </section>

    //         {/* Final Acceptance */}
    //         <section className="mb-8">
    //           <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
    //             <h3 className="text-lg font-semibold text-blue-900 mb-3">Acknowledgment of Terms</h3>
    //             <p className="text-blue-800 leading-relaxed">
    //               BY USING RHYTHMÉ, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE, 
    //               UNDERSTAND THEM, AND AGREE TO BE BOUND BY THEM. IF YOU DO NOT AGREE TO THESE TERMS, 
    //               YOU MUST NOT USE OUR SERVICE.
    //             </p>
    //           </div>
    //         </section>

    //       </div>
    //     </div>

    //     {/* Action Buttons */}
    //     <div className="flex justify-center space-x-4 mt-8">
    //       <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
    //         Back to App
    //       </button>
    //       <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
    //         I Accept These Terms
    //       </button>
    //     </div>
    //   </div>
    // </div>
        <div className='font-primary font-bold'>
        Terms of Service
    </div>
  );
};

export default TermsOfService;