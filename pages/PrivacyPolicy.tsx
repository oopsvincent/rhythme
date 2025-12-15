import React from "react";
import LegalLayout from "@/components/legal/legal-layout";

const PrivacyPolicy = () => {
  return (
    <LegalLayout 
      title="Privacy Policy" 
      type="privacy" 
      lastUpdated="December 2025"
    >
      {/* Section 1 */}
      <section>
        <h2>1. Introduction</h2>
        <p>
          Welcome to Rhythmé (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy 
          and ensuring transparency about how we handle your personal information. This Privacy 
          Policy explains what data we collect, how we use it, and your rights regarding your information.
        </p>
        <p>
          By using Rhythmé (the &quot;Service&quot;), you agree to the collection and use of information 
          in accordance with this policy.
        </p>
      </section>

      {/* Section 2 */}
      <section>
        <h2>2. Information We Collect</h2>
        
        <h3>2.1 Information You Provide</h3>
        <p>We collect the following personal information when you create an account and use our Service:</p>
        <ul>
          <li><strong>Name:</strong> To personalize your experience</li>
          <li><strong>Email Address:</strong> For account authentication and essential communications</li>
        </ul>
        
        <h3>2.2 Information Collected Automatically</h3>
        <p>When you use our Service, we automatically collect:</p>
        <ul>
          <li><strong>Authentication Data:</strong> Session tokens and authentication cookies managed through our backend infrastructure</li>
          <li><strong>Local Storage Data:</strong> Certain preferences and temporary data stored in your browser&apos;s localStorage for functionality purposes</li>
        </ul>
        
        <h3>2.3 Social Login Information</h3>
        <p>
          If you choose to authenticate through third-party providers (Google, GitHub, Meta/Facebook, 
          or Discord), we receive basic profile information from these providers as permitted by 
          their policies and your privacy settings.
        </p>
      </section>

      {/* Section 3 */}
      <section>
        <h2>3. How We Collect Your Information</h2>
        <p>We collect information through:</p>
        <ul>
          <li><strong>Account Registration:</strong> During the signup process</li>
          <li><strong>Third-Party Authentication:</strong> When you log in using Google, GitHub, Meta, or Discord</li>
          <li><strong>Backend Services:</strong> Through Supabase, our database and authentication provider</li>
          <li><strong>Application Usage:</strong> As you interact with tasks, habits, and other features</li>
        </ul>
      </section>

      {/* Section 4 */}
      <section>
        <h2>4. How We Use Your Information</h2>
        <p>We use your personal information solely to:</p>
        <ul>
          <li>Provide and maintain the Service</li>
          <li>Authenticate your account and manage user sessions</li>
          <li>Enable core productivity features including tasks and habits tracking</li>
          <li>Send essential communications such as a welcome email to new users</li>
          <li>Process and store your data securely through our backend infrastructure</li>
          <li>Provide ML-powered habit predictions (processed anonymously)</li>
        </ul>
        <p>
          <strong>We do not track your behavior, sell your data, or use your information for marketing purposes.</strong>
        </p>
      </section>

      {/* Section 5 */}
      <section>
        <h2>5. Machine Learning Processing</h2>
        <p>Our habit tracking feature includes an ML model that predicts the likelihood of habit completion. This process:</p>
        <ul>
          <li>Takes habit data from your account stored in our database</li>
          <li>Sends it <strong>anonymously</strong> to our ML service hosted on Render</li>
          <li>Returns predictions which are stored back in our database</li>
          <li>Never shares your personal identifying information with the ML service</li>
        </ul>
      </section>

      {/* Section 6 */}
      <section>
        <h2>6. Data Sharing and Third Parties</h2>
        
        <h3>6.1 Service Providers</h3>
        <p>We share your information only with the following trusted service providers necessary to operate our Service:</p>
        <ul>
          <li><strong>Supabase:</strong> Backend infrastructure, database, and authentication services</li>
          <li><strong>Vercel:</strong> Hosting and deployment infrastructure</li>
          <li><strong>Render:</strong> Anonymous ML model processing for habit predictions</li>
          <li><strong>Social Login Providers:</strong> Google, GitHub, Meta, and Discord for authentication purposes only</li>
        </ul>
        <p>These providers process data on our behalf and are contractually obligated to protect your information.</p>
        
        <h3>6.2 Legal Requirements</h3>
        <p>We may disclose your information if required by law or in response to valid legal processes.</p>
        
        <h3>6.3 No Data Sales</h3>
        <p>We do not sell, rent, or trade your personal information to third parties for any purpose.</p>
      </section>

      {/* Section 7 */}
      <section>
        <h2>7. Cookies and Tracking Technologies</h2>
        
        <h3>7.1 Cookies We Use</h3>
        <p>We use cookies and similar technologies only for:</p>
        <ul>
          <li><strong>Authentication:</strong> Managing your login sessions</li>
          <li><strong>Functionality:</strong> Enabling essential Service features through Next.js and Supabase</li>
        </ul>
        
        <h3>7.2 No Tracking</h3>
        <p>
          We do not use cookies or any other technologies to track your behavior, build user profiles, 
          or serve advertisements.
        </p>
        
        <h3>7.3 Local Storage</h3>
        <p>
          Our application stores certain data in your browser&apos;s localStorage to enhance functionality 
          and user experience. This data remains on your device and can be cleared through your browser settings.
        </p>
      </section>

      {/* Section 8 */}
      <section>
        <h2>8. Data Security</h2>
        <p>We take data security seriously and implement appropriate measures including:</p>
        <ul>
          <li>Server-Side Rendering (SSR) with React Server Components (RSC)</li>
          <li>Industry-standard security practices through Vercel and Supabase</li>
          <li>Secure authentication protocols</li>
          <li>Encrypted data transmission</li>
        </ul>
        <p>However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
      </section>

      {/* Section 9 */}
      <section>
        <h2>9. Data Retention</h2>
        <p>
          We retain your personal information for as long as you maintain an active account with us. 
          Your data is stored indefinitely until you request deletion.
        </p>
      </section>

      {/* Section 10 */}
      <section>
        <h2>10. Your Rights and Choices</h2>
        <p>You have the following rights regarding your personal information:</p>
        
        <h3>10.1 Access</h3>
        <p>You can access all your personal data through the application interface.</p>
        
        <h3>10.2 Modification</h3>
        <p>You can modify your information at any time through the app&apos;s settings and relevant sections.</p>
        
        <h3>10.3 Deletion</h3>
        <p>
          You can delete your data and account at any time through the app&apos;s settings. Upon deletion 
          request, your information will be removed immediately and permanently from our systems.
        </p>
        
        <h3>10.4 Data Portability</h3>
        <p>You can export your data through the application interface.</p>
      </section>

      {/* Section 11 */}
      <section>
        <h2>11. Children&apos;s Privacy</h2>
        <p>
          Rhythmé is a productivity application not specifically directed at children. Users under 
          the age of 18 should use this Service only with parental supervision and consent. We do 
          not knowingly collect personal information from children without parental consent.
        </p>
        <p>
          If you are a parent or guardian and believe your child has provided us with personal 
          information without your consent, please contact us at rhythmeauth@gmail.com, and we will 
          take steps to remove such information.
        </p>
      </section>

      {/* Section 12 */}
      <section>
        <h2>12. International Users</h2>
        <p>
          Rhythmé is available globally. By using our Service, you consent to the transfer of your 
          information to our service providers&apos; locations, which may be outside your country of 
          residence. We ensure that appropriate safeguards are in place to protect your data.
        </p>
        
        <h3>12.1 GDPR Rights (European Users)</h3>
        <p>If you are located in the European Economic Area (EEA), you have additional rights under GDPR including:</p>
        <ul>
          <li>Right to access your data</li>
          <li>Right to rectification</li>
          <li>Right to erasure (&quot;right to be forgotten&quot;)</li>
          <li>Right to data portability</li>
          <li>Right to object to processing</li>
        </ul>
        
        <h3>12.2 CCPA Rights (California Users)</h3>
        <p>If you are a California resident, you have rights under CCPA including:</p>
        <ul>
          <li>Right to know what personal information is collected</li>
          <li>Right to delete personal information</li>
          <li>Right to opt-out of the sale of personal information (Note: We do not sell personal information)</li>
        </ul>
      </section>

      {/* Section 13 */}
      <section>
        <h2>13. Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by:</p>
        <ul>
          <li>Updating the &quot;Last Updated&quot; date at the top of this policy</li>
          <li>Sending an email notification for material changes (if applicable)</li>
        </ul>
        <p>Your continued use of the Service after changes constitutes acceptance of the updated policy.</p>
      </section>

      {/* Section 14 */}
      <section>
        <h2>14. Contact Us</h2>
        <p>
          If you have any questions, concerns, or requests regarding this Privacy Policy or our 
          data practices, please contact us at:
        </p>
        <p>
          <strong>Email:</strong> rhythmeauth@gmail.com<br />
          <strong>Service:</strong> Rhythmé
        </p>
      </section>

      {/* Note */}
      <section>
        <hr className="my-8" />
        <p className="text-sm text-muted-foreground">
          <em>Note: As we are currently in development, this Privacy Policy may be updated before 
          official launch. We recommend reviewing this policy periodically for any changes.</em>
        </p>
      </section>
    </LegalLayout>
  );
};

export default PrivacyPolicy;