import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy — Scoop Scoops',
};

const LAST_UPDATED = 'May 26, 2025';

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-2">Privacy Policy</h1>
        <p className="text-sm text-stone-400 dark:text-stone-500 mb-10">Last updated: {LAST_UPDATED}</p>

        <div className="prose-sm text-stone-700 dark:text-stone-300 space-y-8 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">Overview</h2>
            <p>
              Scoop Scoops (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a personal project for rating and logging ice cream stand visits. We collect only what we need to make the app work. We do not sell your data or use it for advertising.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Google account information</strong> — when you sign in with Google, we receive your name and email address. We store your name to attribute scoops to your account.
              </li>
              <li>
                <strong>Scoop logs</strong> — the ice cream stand, flavor, size, container, toppings, price, ratings, and any notes you voluntarily submit when logging a scoop.
              </li>
              <li>
                <strong>Stand location data</strong> — latitude and longitude sourced from Google Places when you search for a stand. This is stored alongside stand records and is not tied to your device location.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To display your scoop logs in the public feed.</li>
              <li>To associate scoops with your account so you can manage them.</li>
              <li>We do not use your information for advertising, profiling, or any purpose beyond operating the app.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">Public Content</h2>
            <p>
              Scoop logs (stand name, flavor, ratings, and notes) are visible to all visitors of Scoop Scoops. Do not include personal or sensitive information in the notes field.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">Third-Party Services</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Google Sign-In</strong> — authentication is handled by Google. Google&apos;s{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:text-rose-600 underline underline-offset-2">
                  Privacy Policy
                </a>{' '}
                applies to that interaction.
              </li>
              <li>
                <strong>Google Maps Platform</strong> — used to search for ice cream stands and retrieve location data. Subject to Google&apos;s{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:text-rose-600 underline underline-offset-2">
                  Privacy Policy
                </a>.
              </li>
              <li>
                <strong>Supabase</strong> — our database and authentication infrastructure provider. Data is stored on Supabase-managed servers. See{' '}
                <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:text-rose-600 underline underline-offset-2">
                  Supabase&apos;s Privacy Policy
                </a>.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">Data Retention & Deletion</h2>
            <p>
              Your account and all associated scoop logs are retained until you request deletion. To delete your account and data, contact us at{' '}
              <a href="mailto:chazadams@gmail.com" className="text-rose-500 hover:text-rose-600 underline underline-offset-2">
                chazadams@gmail.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">Children&apos;s Privacy</h2>
            <p>
              Scoop Scoops is not directed at children under 13. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. The &ldquo;Last updated&rdquo; date at the top of this page reflects when changes were last made. Continued use of the app after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">Contact</h2>
            <p>
              Questions about this policy? Email us at{' '}
              <a href="mailto:chazadams@gmail.com" className="text-rose-500 hover:text-rose-600 underline underline-offset-2">
                chazadams@gmail.com
              </a>.
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
