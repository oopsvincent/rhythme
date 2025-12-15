import React from "react";
import LegalLayout from "@/components/legal/legal-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Rhythmé",
  description: "Learn how Rhythmé uses cookies and similar technologies. We only use essential cookies for authentication and functionality.",
};

const CookiePolicy = () => {
  return (
    <LegalLayout 
      title="Cookie Policy" 
      type="cookie" 
      lastUpdated="December 2025"
    >
      {/* Section 1 */}
      <section>
        <h2>1. Introduction</h2>
        <p>
          This Cookie Policy explains how Rhythmé (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) uses cookies and similar 
          technologies when you use our web application. We are committed to transparency about 
          how we collect and use data.
        </p>
      </section>

      {/* Section 2 */}
      <section>
        <h2>2. What Are Cookies?</h2>
        <p>
          Cookies are small text files stored on your device when you visit a website. They help 
          websites remember your preferences and improve your experience.
        </p>
      </section>

      {/* Section 3 */}
      <section>
        <h2>3. Cookies We Use</h2>
        
        <h3>3.1 Essential Cookies (Required)</h3>
        <p>These cookies are necessary for the Service to function and cannot be disabled:</p>
        <div className="overflow-x-auto my-4">
          <table className="min-w-full border border-border rounded-lg">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">Cookie Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Purpose</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <td className="px-4 py-2 text-sm font-mono">sb-*-auth-token</td>
                <td className="px-4 py-2 text-sm">Supabase authentication session</td>
                <td className="px-4 py-2 text-sm">Session</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-2 text-sm font-mono">__vercel_live_token</td>
                <td className="px-4 py-2 text-sm">Vercel deployment authentication</td>
                <td className="px-4 py-2 text-sm">Session</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h3>3.2 Authentication Cookies</h3>
        <p>We use Supabase for authentication, which sets cookies to:</p>
        <ul>
          <li>Maintain your login session</li>
          <li>Remember your authentication state</li>
          <li>Secure your account access</li>
        </ul>
        <p>These cookies are essential for the Service to work and are not used for tracking.</p>
        
        <h3>3.3 Next.js Framework Cookies</h3>
        <p>Our application is built with Next.js, which may set:</p>
        <ul>
          <li>Session cookies for server-side rendering</li>
          <li>Temporary cookies for form submissions</li>
        </ul>
      </section>

      {/* Section 4 */}
      <section>
        <h2>4. Local Storage</h2>
        <p>In addition to cookies, we use your browser&apos;s localStorage to store:</p>
        <ul>
          <li><strong>Theme preference:</strong> Light/dark mode selection</li>
          <li><strong>UI state:</strong> Sidebar collapse state, calendar preferences</li>
          <li><strong>Temporary data:</strong> Form drafts, unsaved changes</li>
        </ul>
        <p>This data stays on your device and is not transmitted to our servers.</p>
      </section>

      {/* Section 5 */}
      <section>
        <h2>5. What We Do NOT Use</h2>
        <p>We want to be clear about what we don&apos;t do:</p>
        <ul>
          <li>❌ <strong>No tracking cookies:</strong> We do not use cookies to track your behavior across websites</li>
          <li>❌ <strong>No advertising cookies:</strong> We do not use cookies for advertising purposes</li>
          <li>❌ <strong>No third-party marketing:</strong> We do not share cookie data with advertisers</li>
          <li>❌ <strong>No profiling:</strong> We do not build user profiles from cookie data</li>
        </ul>
      </section>

      {/* Section 6 */}
      <section>
        <h2>6. Analytics</h2>
        <p>We use Vercel Analytics for basic, privacy-respecting analytics:</p>
        <ul>
          <li><strong>Anonymous data only:</strong> No personally identifiable information is collected</li>
          <li><strong>No cookies required:</strong> Vercel Analytics is cookieless</li>
          <li><strong>GDPR compliant:</strong> Fully compliant with privacy regulations</li>
          <li><strong>Data collected:</strong> Page views, visitor counts, referrer information (anonymized)</li>
        </ul>
      </section>

      {/* Section 7 */}
      <section>
        <h2>7. Third-Party Services</h2>
        <p>
          Our authentication providers (Google, GitHub, Meta, Discord) may set their own cookies 
          when you use social login. Please refer to their respective privacy policies:
        </p>
        <ul>
          <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
          <li><a href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub Privacy Statement</a></li>
          <li><a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">Meta Privacy Policy</a></li>
          <li><a href="https://discord.com/privacy" target="_blank" rel="noopener noreferrer">Discord Privacy Policy</a></li>
        </ul>
      </section>

      {/* Section 8 */}
      <section>
        <h2>8. Managing Cookies</h2>
        
        <h3>8.1 Browser Settings</h3>
        <p>You can control cookies through your browser settings:</p>
        <ul>
          <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies</li>
          <li><strong>Firefox:</strong> Settings → Privacy &amp; Security → Cookies</li>
          <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
          <li><strong>Edge:</strong> Settings → Privacy → Cookies</li>
        </ul>
        
        <h3>8.2 Consequences of Disabling Cookies</h3>
        <p>If you disable essential cookies:</p>
        <ul>
          <li>You will not be able to stay logged in</li>
          <li>Some features may not work correctly</li>
          <li>You may need to log in on each visit</li>
        </ul>
        
        <h3>8.3 Clearing Local Storage</h3>
        <p>To clear localStorage data:</p>
        <ol>
          <li>Open your browser&apos;s Developer Tools (F12)</li>
          <li>Go to Application/Storage tab</li>
          <li>Select Local Storage → rhythme domain</li>
          <li>Click &quot;Clear All&quot;</li>
        </ol>
      </section>

      {/* Section 9 */}
      <section>
        <h2>9. Updates to This Policy</h2>
        <p>We may update this Cookie Policy from time to time. We will notify you of changes by:</p>
        <ul>
          <li>Updating the &quot;Last Updated&quot; date</li>
          <li>Posting a notice in the application (for material changes)</li>
        </ul>
      </section>

      {/* Section 10 */}
      <section>
        <h2>10. Contact Us</h2>
        <p>If you have questions about our use of cookies, please contact us at:</p>
        <p>
          <strong>Email:</strong> rhythmeauth@gmail.com<br />
          <strong>Service:</strong> Rhythmé
        </p>
      </section>

      {/* Footer Note */}
      <section>
        <hr className="my-8" />
        <p className="text-sm text-muted-foreground">
          By continuing to use Rhythmé, you acknowledge that you have read and understood this Cookie Policy.
        </p>
      </section>
    </LegalLayout>
  );
};

export default CookiePolicy;
