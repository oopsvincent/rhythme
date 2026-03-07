import React from "react";
import LegalLayout from "@/components/legal/legal-layout";

const termsSections = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "about", title: "2. About Rhythmé" },
  { id: "eligibility", title: "3. Eligibility & Age" },
  { id: "account", title: "4. Registration & Security" },
  { id: "pricing", title: "5. Service Model & Pricing" },
  { id: "content", title: "6. User Content & Ownership" },
  { id: "ml", title: "7. Machine Learning Features" },
  { id: "acceptable-use", title: "8. Acceptable Use" },
  { id: "availability", title: "9. Service Availability" },
  { id: "third-party", title: "10. Third-Party Services" },
  { id: "termination", title: "11. Account Termination" },
  { id: "disclaimers", title: "12. Disclaimers & Liability" },
  { id: "indemnification", title: "13. Indemnification" },
  { id: "governing-law", title: "14. Governing Law" },
  { id: "severability", title: "15. Severability & Waiver" },
  { id: "changes", title: "16. Changes to Terms" },
  { id: "entire-agreement", title: "17. Entire Agreement" },
  { id: "contact", title: "18. Contact Information" },
  { id: "survival", title: "19. Survival" },
];

const TermsOfService = () => {
  return (
    <LegalLayout 
      title="Terms of Service" 
      type="terms" 
      lastUpdated="December 2025"
      sections={termsSections}
    >
      <section id="acceptance">
        <h2>1. Acceptance of Terms</h2>
        <p>
          These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you and 
          Rhythmé (&quot;we,&quot; &quot;us,&quot; &quot;our,&quot; or the &quot;Service&quot;) regarding your use of our productivity 
          application. By accessing or using Rhythmé, you agree to be bound by these Terms.
        </p>
        <p>
          If you do not agree to these Terms, you must not access or use the Service.
        </p>
      </section>

      <section id="about">
        <h2>2. About Rhythmé</h2>
        <p>
          Rhythmé is operated by an individual doing business as Rhythmé team. We provide a 
          productivity application designed to help users manage tasks and habits effectively.
        </p>
      </section>

      <section id="eligibility">
        <h2>3. Eligibility and Age Requirements</h2>
        
        <h3>3.1 Age Restrictions</h3>
        <p>
          You must be at least 18 years old to use Rhythmé without restriction. Users between 
          the ages of 16 and 18 may only use the Service with explicit parental or legal guardian 
          consent and supervision.
        </p>
        <p><strong>USERS UNDER 16 ARE STRICTLY PROHIBITED FROM USING THIS SERVICE.</strong></p>
        
        <h3>3.2 Verification</h3>
        <p>
          We reserve the right to request proof of age and parental consent at any time. Failure 
          to provide such proof may result in immediate account termination.
        </p>
        
        <h3>3.3 No Liability for Minors</h3>
        <p>
          We explicitly disclaim all liability for any use of the Service by minors without proper 
          consent or supervision. By creating an account, you represent and warrant that you meet 
          the age requirements and have obtained necessary parental consent if applicable.
        </p>
      </section>

      <section id="account">
        <h2>4. Account Registration and Security</h2>
        
        <h3>4.1 Account Creation</h3>
        <p>
          To use certain features of Rhythmé, you must create an account by providing accurate 
          and complete information including your name and email address. You may register 
          directly or through third-party authentication providers (Google, GitHub, Meta, or Discord).
        </p>
        
        <h3>4.2 One Account Per User</h3>
        <p>
          Each user is permitted only ONE account. Creating, operating, or maintaining multiple 
          accounts is strictly prohibited and will result in immediate termination of all 
          associated accounts without warning or refund.
        </p>
        
        <h3>4.3 Account Security</h3>
        <p>You are responsible for:</p>
        <ul>
          <li>Maintaining the confidentiality of your account credentials</li>
          <li>All activities that occur under your account</li>
          <li>Notifying us immediately of any unauthorized access or security breach</li>
        </ul>
        
        <h3>4.4 Account Information</h3>
        <p>
          You agree to provide accurate, current, and complete information and to update such 
          information to maintain its accuracy.
        </p>
      </section>

      <section id="pricing">
        <h2>5. Service Model and Pricing</h2>
        
        <h3>5.1 Freemium Model</h3>
        <p>Rhythmé operates on a freemium model:</p>
        <ul>
          <li><strong>Free Plan:</strong> Certain features are available for free, forever, with no credit card required</li>
          <li><strong>Paid Plans:</strong> Additional premium features require payment</li>
        </ul>
        
        <h3>5.2 Free Plan Limitations</h3>
        <p>
          The free plan has usage limitations. Access to premium features requires upgrading to a paid plan.
        </p>
        
        <h3>5.3 Pricing Changes</h3>
        <p>
          We reserve the right to modify pricing for our paid plans at any time. Changes will 
          not affect your current billing cycle if you are already subscribed, but will apply upon renewal.
        </p>
        
        <h3>5.4 Payment Terms</h3>
        <ul>
          <li>All payments are processed through our secure payment providers</li>
          <li>You authorize us to charge your payment method for all fees incurred</li>
          <li>All fees are non-refundable unless required by applicable law</li>
        </ul>
        
        <h3>5.5 No Refunds</h3>
        <p>
          <strong>ALL PAYMENTS ARE FINAL AND NON-REFUNDABLE.</strong> Once a payment is processed, 
          we do not offer refunds, returns, or credits for any reason, including but not limited to:
        </p>
        <ul>
          <li>Dissatisfaction with the Service</li>
          <li>Failure to use the Service</li>
          <li>Termination of your account</li>
          <li>Service modifications or discontinuation</li>
        </ul>
        <p>By making a payment, you acknowledge and accept this no-refund policy.</p>
      </section>

      <section id="content">
        <h2>6. User Content and Ownership</h2>
        
        <h3>6.1 Your Content</h3>
        <p>
          You retain all ownership rights to the content you create, upload, or store through 
          Rhythmé, including but not limited to tasks, habits, notes, and any other data (&quot;User Content&quot;).
        </p>
        
        <h3>6.2 Limited License to Us</h3>
        <p>
          By using the Service, you grant us a limited, non-exclusive license to store, process, 
          and display your User Content solely for the purpose of providing the Service to you. 
          This license terminates when you delete your content or account.
        </p>
        
        <h3>6.3 Our Intellectual Property</h3>
        <p>
          All rights, title, and interest in and to the Service, including all software, code, 
          designs, graphics, logos, branding, user interface, features, functionality, and other 
          elements (collectively, &quot;Our IP&quot;) are and will remain the exclusive property of Rhythmé 
          and its licensors.
        </p>
        <p>You may not:</p>
        <ul>
          <li>Copy, modify, distribute, sell, or lease any part of Our IP</li>
          <li>Reverse engineer or attempt to extract the source code of the Service</li>
          <li>Use Our IP for any commercial purpose without explicit written permission</li>
          <li>Remove, alter, or obscure any proprietary notices</li>
        </ul>
        
        <h3>6.4 Data Export</h3>
        <p>
          While data export functionality is not currently available, we plan to implement this 
          feature in the future. You will be able to export your User Content when this feature 
          becomes available.
        </p>
      </section>

      <section id="ml">
        <h2>7. Machine Learning Features</h2>
        
        <h3>7.1 Habit Prediction</h3>
        <p>
          Rhythmé includes machine learning functionality that analyzes your habit data to 
          provide predictions about habit completion likelihood.
        </p>
        
        <h3>7.2 No Guarantees</h3>
        <p>
          The ML-powered predictions are provided for informational and motivational purposes 
          only. We make no guarantees, representations, or warranties about:
        </p>
        <ul>
          <li>The accuracy, reliability, or completeness of predictions</li>
          <li>The suitability of predictions for your specific circumstances</li>
          <li>Any outcomes resulting from relying on these predictions</li>
        </ul>
        
        <h3>7.3 Not Professional Advice</h3>
        <p>
          The ML predictions and any other features of Rhythmé do not constitute professional 
          advice of any kind, including but not limited to medical, psychological, therapeutic, 
          or health advice. Always consult qualified professionals for such matters.
        </p>
        
        <h3>7.4 Anonymous Processing</h3>
        <p>
          Habit data is processed anonymously through our ML service. No personally identifying 
          information is shared with the ML processing system.
        </p>
      </section>

      <section id="acceptable-use">
        <h2>8. Acceptable Use</h2>
        
        <h3>8.1 User Freedom</h3>
        <p>
          We generally do not monitor or restrict how you use your personal productivity features 
          within the Service. You are free to use Rhythmé for lawful personal productivity purposes.
        </p>
        
        <h3>8.2 Prohibited Conduct</h3>
        <p>While we do not actively monitor user activity, you agree NOT to:</p>
        <ul>
          <li>Create or maintain multiple accounts</li>
          <li>Violate any applicable laws or regulations</li>
          <li>Attempt to gain unauthorized access to the Service or other users&apos; accounts</li>
          <li>Interfere with or disrupt the Service or servers</li>
          <li>Use automated systems (bots, scrapers) without authorization</li>
          <li>Attempt to reverse engineer, decompile, or hack the Service</li>
          <li>Impersonate others or provide false information</li>
          <li>Use the Service for any illegal or unauthorized purpose</li>
        </ul>
        
        <h3>8.3 Enforcement</h3>
        <p>
          While we do not actively monitor all user activity, violations that come to our 
          attention may result in account suspension or termination without notice or refund.
        </p>
      </section>

      <section id="availability">
        <h2>9. Service Availability and Modifications</h2>
        
        <h3>9.1 No Uptime Guarantee</h3>
        <p>
          We rely on third-party service providers including Vercel and Supabase for hosting 
          and infrastructure. While we strive for reliability, we do not guarantee uninterrupted, 
          timely, secure, or error-free service availability.
        </p>
        
        <h3>9.2 Right to Modify</h3>
        <p>We reserve the right at any time to:</p>
        <ul>
          <li>Modify, suspend, or discontinue any feature or aspect of the Service</li>
          <li>Change pricing or subscription terms (with notice for existing subscribers)</li>
          <li>Update these Terms (with notice as described in Section 16)</li>
          <li>Impose limits on certain features or restrict access to parts of the Service</li>
        </ul>
        
        <h3>9.3 Notification of Changes</h3>
        <p>
          We will make reasonable efforts to notify users of material changes to the Service 
          through email or in-app notifications.
        </p>
        
        <h3>9.4 No Liability for Changes</h3>
        <p>
          We shall not be liable to you or any third party for any modification, suspension, 
          or discontinuance of the Service or any feature thereof.
        </p>
      </section>

      <section id="third-party">
        <h2>10. Third-Party Services</h2>
        
        <h3>10.1 Service Providers</h3>
        <p>Rhythmé utilizes third-party service providers including:</p>
        <ul>
          <li>Supabase (database and authentication)</li>
          <li>Vercel (hosting)</li>
          <li>Render (ML processing)</li>
          <li>Social login providers (Google, GitHub, Meta, Discord)</li>
        </ul>
        
        <h3>10.2 Third-Party Terms</h3>
        <p>
          Your use of third-party authentication services is subject to those providers&apos; 
          respective terms of service and privacy policies. We are not responsible for the 
          practices of these third-party providers.
        </p>
        
        <h3>10.3 No Endorsement</h3>
        <p>
          Reference to any third-party service does not constitute our endorsement or 
          recommendation of such service.
        </p>
      </section>

      <section id="termination">
        <h2>11. Account Termination</h2>
        
        <h3>11.1 Termination by You</h3>
        <p>
          You may terminate your account at any time through the account settings. Upon 
          termination, your data will be deleted immediately and permanently. No refunds 
          will be provided for any unused subscription periods.
        </p>
        
        <h3>11.2 Termination by Us</h3>
        <p>
          We reserve the right to suspend or terminate your account immediately, without 
          notice or refund, for any reason including but not limited to:
        </p>
        <ul>
          <li>Violation of these Terms</li>
          <li>Maintaining multiple accounts</li>
          <li>Fraudulent or illegal activity</li>
          <li>Abusive behavior</li>
          <li>Extended inactivity</li>
          <li>Any reason at our sole discretion</li>
        </ul>
        
        <h3>11.3 Effect of Termination</h3>
        <p>Upon termination:</p>
        <ul>
          <li>Your right to access and use the Service immediately ceases</li>
          <li>Your User Content will be deleted from our systems</li>
          <li>All licenses granted to you under these Terms will terminate</li>
          <li>No refunds will be provided</li>
        </ul>
      </section>

      <section id="disclaimers">
        <h2>12. Disclaimers and Limitation of Liability</h2>
        
        <h3>12.1 &quot;AS IS&quot; Service</h3>
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, 
          EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
        </p>
        <ul>
          <li>Warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
          <li>Warranties that the Service will be uninterrupted, secure, or error-free</li>
          <li>Warranties regarding the accuracy, reliability, or completeness of content or predictions</li>
          <li>Warranties that defects will be corrected</li>
        </ul>
        
        <h3>12.2 Third-Party Reliability</h3>
        <p>
          WE RELY ON THIRD-PARTY SERVICE PROVIDERS (SUPABASE, VERCEL, RENDER) FOR CRITICAL 
          INFRASTRUCTURE. WE MAKE NO WARRANTIES REGARDING THE SECURITY, RELIABILITY, OR 
          AVAILABILITY OF THESE SERVICES.
        </p>
        
        <h3>12.3 Data Loss</h3>
        <p>
          WHILE WE USE INDUSTRY-STANDARD SECURITY PRACTICES, WE CANNOT GUARANTEE THE ABSOLUTE 
          SECURITY OF YOUR DATA. WE ARE NOT LIABLE FOR:
        </p>
        <ul>
          <li>Unauthorized access to your account</li>
          <li>Data loss, corruption, or breaches</li>
          <li>Security vulnerabilities in third-party services</li>
          <li>Any damages resulting from data-related incidents</li>
        </ul>
        
        <h3>12.4 Limitation of Liability</h3>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW: WE (INCLUDING OUR OPERATOR, 
          AFFILIATES, LICENSORS, AND SERVICE PROVIDERS) SHALL NOT BE LIABLE FOR ANY INDIRECT, 
          INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES.
        </p>
        <p>
          OUR TOTAL LIABILITY TO YOU FOR ANY CLAIMS ARISING FROM OR RELATED TO THE SERVICE 
          SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE 
          CLAIM, OR ONE HUNDRED US DOLLARS ($100), WHICHEVER IS LESS.
        </p>
        
        <h3>12.5 Individual Operation</h3>
        <p>
          You acknowledge that Rhythmé is operated by an individual doing business as Rhythmé. 
          We are not a corporation and have limited resources. This limitation of liability is 
          essential to our ability to provide the Service.
        </p>
      </section>

      <section id="indemnification">
        <h2>13. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless Rhythmé, its operator, affiliates, 
          licensors, and service providers from and against any claims, liabilities, damages, 
          losses, costs, expenses, or fees arising from:
        </p>
        <ul>
          <li>Your use or misuse of the Service</li>
          <li>Your violation of these Terms</li>
          <li>Your violation of any rights of another party</li>
          <li>Your User Content</li>
          <li>Use of the Service by minors without proper consent</li>
        </ul>
      </section>

      <section id="governing-law">
        <h2>14. Governing Law and Dispute Resolution</h2>
        
        <h3>14.1 Governing Law</h3>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of India, 
          without regard to its conflict of law provisions.
        </p>
        
        <h3>14.2 Jurisdiction</h3>
        <p>
          You agree to submit to the personal and exclusive jurisdiction of the courts located 
          in India for the resolution of any disputes arising from or relating to these Terms 
          or your use of the Service.
        </p>
        
        <h3>14.3 Informal Resolution</h3>
        <p>
          Before initiating formal legal proceedings, you agree to first contact us at 
          rhythmeauth@gmail.com to attempt to resolve the dispute informally.
        </p>
        
        <h3>14.4 Individual Actions Only</h3>
        <p>
          TO THE EXTENT PERMITTED BY APPLICABLE LAW, YOU AGREE THAT ANY DISPUTE RESOLUTION 
          PROCEEDINGS WILL BE CONDUCTED ONLY ON AN INDIVIDUAL BASIS AND NOT IN A CLASS, 
          CONSOLIDATED, OR REPRESENTATIVE ACTION.
        </p>
        
        <h3>14.5 Time Limitation</h3>
        <p>
          Any claim or cause of action arising from or related to the Service or these Terms 
          must be filed within one (1) year after the claim or cause of action arose, or it 
          will be permanently barred.
        </p>
      </section>

      <section id="severability">
        <h2>15. Severability and Waiver</h2>
        
        <h3>15.1 Severability</h3>
        <p>
          If any provision of these Terms is found to be invalid, illegal, or unenforceable, 
          the remaining provisions shall continue in full force and effect.
        </p>
        
        <h3>15.2 Waiver</h3>
        <p>
          Our failure to enforce any right or provision of these Terms shall not constitute 
          a waiver of such right or provision.
        </p>
      </section>

      <section id="changes">
        <h2>16. Changes to Terms</h2>
        
        <h3>16.1 Right to Modify</h3>
        <p>We reserve the right to modify these Terms at any time. We will notify users of material changes by:</p>
        <ul>
          <li>Updating the &quot;Last Updated&quot; date at the top of these Terms</li>
          <li>Sending an email notification to the address associated with your account</li>
          <li>Posting a notice within the Service</li>
        </ul>
        
        <h3>16.2 Acceptance of Changes</h3>
        <p>
          Your continued use of the Service after such modifications constitutes your acceptance 
          of the revised Terms. If you do not agree to the modified Terms, you must stop using 
          the Service and may terminate your account.
        </p>
        
        <h3>16.3 Review Responsibility</h3>
        <p>
          It is your responsibility to review these Terms periodically for changes.
        </p>
      </section>

      <section id="entire-agreement">
        <h2>17. Entire Agreement</h2>
        <p>
          These Terms, together with our Privacy Policy, constitute the entire agreement between 
          you and Rhythmé regarding the Service and supersede all prior agreements, representations, 
          and understandings.
        </p>
      </section>

      <section id="contact">
        <h2>18. Contact Information</h2>
        <p>
          If you have any questions, concerns, or disputes regarding these Terms, please contact us at:
        </p>
        <p>
          <strong>Email:</strong> rhythmeauth@gmail.com<br />
          <strong>Service:</strong> Rhythmé
        </p>
      </section>

      <section id="survival">
        <h2>19. Survival</h2>
        <p>
          The provisions of these Terms that by their nature should survive termination shall 
          survive, including but not limited to: ownership provisions, warranty disclaimers, 
          indemnification obligations, limitations of liability, and dispute resolution provisions.
        </p>
      </section>

      <section id="acknowledgment" className="border-t border-border/40 pt-16 mt-16">
        <h3>Acknowledgment</h3>
        <p>
          BY CLICKING &quot;I AGREE,&quot; CREATING AN ACCOUNT, OR USING THE SERVICE, YOU ACKNOWLEDGE THAT 
          YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS OF SERVICE.
        </p>
        <p className="text-sm font-medium text-muted-foreground mt-4 p-4 bg-muted/30 rounded-lg border border-border/50">
          <em>Note: As Rhythmé is currently in development and operated by an individual, these 
          Terms may be updated before official launch. We recommend reviewing these Terms periodically.</em>
        </p>
      </section>
    </LegalLayout>
  );
};

export default TermsOfService;