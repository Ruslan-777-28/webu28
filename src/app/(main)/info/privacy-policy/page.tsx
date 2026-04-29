import React from 'react';
import { Metadata } from 'next';
import { PageCloseButton } from '@/components/page-close-button';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | LECTOR',
  description: 'How we collect, use, store, and protect information at LECTOR.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24 lg:py-32 max-w-5xl relative">
        <PageCloseButton fallbackHref="/" />
        
        {/* HERO SECTION */}
        <div className="mb-16 md:mb-24 border-b border-border/40 pb-12">
          <div className="text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-accent mb-6">
            Legal Document
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-foreground mb-8 leading-[0.9] uppercase">
            Privacy <br className="hidden md:block" /> Policy
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground/80 font-light tracking-tight max-w-2xl">
            How we collect, use, store, and protect information
          </p>
          <div className="mt-10 text-[10px] uppercase font-bold tracking-[0.2em] text-foreground/40">
            Last updated: April 29, 2026
          </div>
        </div>

        {/* CONTENT COLUMN */}
        <div className="max-w-3xl">
          
          {/* SECTION 1 */}
          <section className="mb-16 md:mb-20">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground uppercase mb-8">
              1. Introduction
            </h2>
            <div className="space-y-6 text-base md:text-lg text-muted-foreground/90 font-light leading-relaxed">
              <p>
                This Privacy Policy describes how <span className="text-foreground font-medium">LECTOR</span> (“LECTOR,” “we,” “us,” or “our”) collects, uses, stores, and shares information when you use our website, platform, profiles, blog, content tools, communication features, digital product features, and related services (collectively, the “Services”).
              </p>
              <p>
                We want our users to clearly understand what data may be processed when using the platform, why it is processed, and what choices users may have in relation to that data.
              </p>
              <p className="bg-muted/30 p-4 border-l-2 border-accent/20 italic">
                By accessing or using the Services, you acknowledge that you have read this Privacy Policy.
              </p>
            </div>
          </section>

          {/* SECTION 2 */}
          <section className="mb-16 md:mb-20">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground uppercase mb-8">
              2. Who We Are
            </h2>
            <div className="space-y-4 text-base md:text-lg text-muted-foreground/90 font-light leading-relaxed">
              <p>
                LECTOR is a digital platform that enables interaction between users, including professional profiles, content publishing, blog participation, digital product presentation, and communication features within the platform environment.
              </p>
              <div className="pt-4 space-y-1">
                <p className="text-sm uppercase tracking-wider font-bold text-foreground/70">Website</p>
                <p className="text-accent">lector.global</p>
              </div>
              <div className="pt-2 space-y-1">
                <p className="text-sm uppercase tracking-wider font-bold text-foreground/70">Contact email</p>
                <p className="text-accent">support@lector.global</p>
              </div>
            </div>
          </section>

          {/* SECTION 3 */}
          <section className="mb-16 md:mb-20">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground uppercase mb-12">
              3. Information We Collect
            </h2>
            <div className="space-y-12">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-4">3.1 Account and profile information</h3>
                <p className="text-muted-foreground font-light mb-4">When you create or maintain an account, we may collect:</p>
                <ul className="space-y-2 text-muted-foreground/90 font-light list-disc pl-5">
                  <li>your name or display name;</li>
                  <li>email address;</li>
                  <li>phone number;</li>
                  <li>avatar or profile image;</li>
                  <li>profile bio, languages, categories, subcategories, achievements, media, and similar profile information;</li>
                  <li>account preferences and settings.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-4">3.2 Content and activity information</h3>
                <p className="text-muted-foreground font-light mb-4">When you use the platform, we may collect information related to your activity, including:</p>
                <ul className="space-y-2 text-muted-foreground/90 font-light list-disc pl-5">
                  <li>profile updates;</li>
                  <li>posts, articles, comments, descriptions, and other published content;</li>
                  <li>digital products, offers, listings, and related metadata;</li>
                  <li>likes, saves, favorites, shares, follows, and similar engagement signals;</li>
                  <li>moderation states, submissions, publication history, and platform interactions.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-4">3.3 Communication information</h3>
                <p className="text-muted-foreground font-light mb-4">If you use communication features available through the platform, we may process:</p>
                <ul className="space-y-2 text-muted-foreground/90 font-light list-disc pl-5">
                  <li>messages and message-related metadata;</li>
                  <li>requests for communication;</li>
                  <li>session or call-related metadata;</li>
                  <li>files and materials shared within platform features;</li>
                  <li>support requests and correspondence with us.</li>
                </ul>
              </div>

              <div className="bg-muted/10 p-6 border border-border/40 rounded-sm">
                 <h3 className="text-lg md:text-xl font-bold text-foreground mb-4">3.4 Transaction and platform-use information</h3>
                 <p className="text-sm text-muted-foreground/80 font-light mb-4">If paid features, purchases, bookings, or other platform transactions are used, we may process:</p>
                 <ul className="space-y-2 text-xs md:text-sm text-muted-foreground/90 font-light list-disc pl-5">
                  <li>transaction identifiers;</li>
                  <li>order, booking, or payment status;</li>
                  <li>limited billing, payout, or settlement-related metadata;</li>
                  <li>records needed for support, fraud prevention, safety, or compliance.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-4">3.5 Technical and device information</h3>
                <ul className="space-y-2 text-muted-foreground/90 font-light list-disc pl-5">
                  <li>IP address; browser type and version; device type and operating system;</li>
                  <li>language and region settings; log data, access times, and interaction data;</li>
                  <li>approximate location inferred from technical signals where relevant.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-4">3.6 Cookies and similar technologies</h3>
                <p className="text-muted-foreground font-light">We may use cookies to keep the Services functional, remember preferences, and support security and fraud prevention.</p>
              </div>
            </div>
          </section>

          {/* SECTION 4 */}
          <section className="mb-16 md:mb-20">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground uppercase mb-8">
              4. How We Use Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-base text-muted-foreground/90 font-light">
              <div className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-accent/40 mt-2 shrink-0"></div><span>To create and manage user accounts</span></div>
              <div className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-accent/40 mt-2 shrink-0"></div><span>To display profiles and platform features</span></div>
              <div className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-accent/40 mt-2 shrink-0"></div><span>To publish and present content</span></div>
              <div className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-accent/40 mt-2 shrink-0"></div><span>To enable communication between users</span></div>
              <div className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-accent/40 mt-2 shrink-0"></div><span>To process platform actions and transactions</span></div>
              <div className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-accent/40 mt-2 shrink-0"></div><span>To improve design and performance</span></div>
              <div className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-accent/40 mt-2 shrink-0"></div><span>To personalize platform experiences</span></div>
              <div className="flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-accent/40 mt-2 shrink-0"></div><span>To prevent spam, abuse, and fraud</span></div>
            </div>
          </section>

          {/* SECTION 5 */}
          <section className="mb-16 md:mb-20">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground uppercase mb-8">
              5. Information Visible to Other Users
            </h2>
            <div className="space-y-6 text-base md:text-lg text-muted-foreground/90 font-light leading-relaxed">
              <p>Some information may be visible to other users depending on how the platform works and how you choose to use it. This may include display name, avatar, public profile information, posts, and engagement markers.</p>
              <p className="text-foreground font-medium uppercase tracking-widest text-sm border-t border-border/40 pt-4">
                Please do not post information you do not want others to see.
              </p>
            </div>
          </section>

          {/* SECTION 6 */}
          <section className="mb-16 md:mb-20">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground uppercase mb-12">
              6. How We Share Information
            </h2>
            <div className="space-y-10">
              <p className="text-lg font-black uppercase tracking-tight text-foreground/40 italic">
                We do not sell personal information as a standalone commercial product.
              </p>
              
              <div>
                <h3 className="text-lg font-bold text-foreground mb-3">6.1 With other users</h3>
                <p className="text-muted-foreground font-light">We may display or transmit certain information where necessary for the Services to function.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground mb-3">6.2 With service providers</h3>
                <p className="text-muted-foreground font-light mb-4">We may share information with trusted vendors who support hosting, authentication, analytics, and security tools.</p>
              </div>

              <div className="border-l-2 border-border/40 pl-6">
                <h3 className="text-lg font-bold text-foreground mb-3">6.3 For legal and safety reasons</h3>
                <p className="text-muted-foreground font-light">We may disclose information to comply with laws or to protect users, the platform, and the public.</p>
              </div>
            </div>
          </section>

          {/* SECTIONS 7-10 (grouped for flow) */}
          <section className="space-y-16 md:space-y-24 mb-16 md:mb-24">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground uppercase mb-6">7. Payments and Third-Party Services</h2>
              <p className="text-muted-foreground font-light leading-relaxed">Some functions may be provided by third-party providers who process information under their own policies. We encourage users to review their policies where relevant.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground uppercase mb-6">8. Data Retention</h2>
              <p className="text-muted-foreground font-light leading-relaxed">We retain information for as long as reasonably necessary to provide Services, support account history, resolve disputes, and meet legal or security needs.</p>
            </div>

            <div className="bg-muted/30 p-8 rounded-sm">
              <h2 className="text-2xl font-bold tracking-tight text-foreground uppercase mb-6">9. Your Rights and Choices</h2>
              <p className="text-muted-foreground font-light leading-relaxed mb-6">Depending on your location, you may have rights to access, update, or delete your information. You can also manage some preferences through account settings.</p>
              <div className="text-sm font-bold uppercase tracking-widest text-accent">Contact for requests: support@lector.global</div>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground uppercase mb-6">10. Security</h2>
              <p className="text-muted-foreground font-light leading-relaxed">We use reasonable measures to protect information, but no platform is 100% secure. We encourage users to use strong passwords and keep login details confidential.</p>
            </div>
          </section>

          {/* SECTIONS 11-16 */}
          <div className="space-y-12 border-t border-border/40 pt-16 md:pt-24 opacity-80">
            {[
              { n: '11', t: 'International Use', d: 'Your information may be processed in countries other than where you live due to the global nature of digital infrastructure.' },
              { n: '12', t: 'Children', d: 'The Services are not intended for use in violation of applicable age requirements. We remove non-compliant information if discovered.' },
              { n: '13', t: 'Cookies', d: 'Essential for site functionality, sessions, and analytics. Manageable via browser settings.' },
              { n: '14', t: 'External Links', d: 'We are not responsible for the privacy practices of third-party websites or services linked through the platform.' },
              { n: '15', t: 'Changes', d: 'We may update this policy. Material changes will be noted via the "Last updated" date or additional platform notice.' }
            ].map(section => (
              <div key={section.n} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-1 text-sm font-black text-foreground/20">{section.n}</div>
                <div className="sm:col-span-3 text-sm font-bold uppercase tracking-wider text-foreground/70">{section.t}</div>
                <div className="sm:col-span-8 text-sm text-muted-foreground font-light leading-relaxed">{section.d}</div>
              </div>
            ))}
          </div>

          {/* CONTACT INFO */}
          <section className="mt-24 mb-32 p-10 bg-foreground/[0.02] border border-border/50 text-center space-y-6">
            <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground">16. Contact Us</h2>
            <div className="text-sm space-y-2 text-muted-foreground font-light">
              <p className="font-bold text-foreground">LECTOR</p>
              <p>Website: lector.global</p>
              <p className="text-accent">Email: support@lector.global</p>
            </div>
          </section>

          {/* SHORT NOTICE */}
          <div className="mb-32 p-6 bg-amber-500/[0.03] border border-amber-500/10 rounded-sm">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-amber-500/70 mb-3">Short notice</h4>
            <p className="text-xs text-muted-foreground/80 leading-relaxed font-light italic">
              This Privacy Policy is a demo working version for page content and design implementation. The final public version should later be reviewed and adapted to the actual legal structure, payment stack, jurisdictions, and live data flows of the platform before production use.
            </p>
          </div>

        </div>

      </main>
      
      <Footer />
    </div>
  );
}
