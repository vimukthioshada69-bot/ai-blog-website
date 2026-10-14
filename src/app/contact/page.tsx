import { Metadata } from 'next';
import { Mail, Sparkles, Clock } from 'lucide-react';
import { getPageContent } from '@/lib/data/posts';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { ContactForm } from './contact-form';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent('contact');
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://synapse-ai-2026.vercel.app';
  const canonicalUrl = `${baseUrl}/contact`;
  const title = content?.seo_title || content?.title || 'Contact SYNAPSE | 2026 AI Editorial & Submissions';
  const description = content?.seo_description || content?.banner_text || 'Contact the SYNAPSE editorial team for news leads, research questions, and open-source tool showcases.';
  const ogImage = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'SYNAPSE 2026',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ContactPage() {
  const content = await getPageContent('contact');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Schema.org BreadcrumbList Structured Data */}
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Contact', url: '/contact' },
        ]}
      />
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200/60">
          <Mail className="w-3.5 h-3.5" />
          <span>CONNECT WITH SYNAPSE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          {content?.title || 'Get in Touch'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          {content?.banner_text || 'Have an AI story lead, open-source tool submission, or research inquiry? We would love to hear from you.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Contact Information */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Direct Channels</h2>
            
            <div className="space-y-4 text-sm text-slate-600">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Editorial Inquiries</span>
                  <span className="font-medium text-slate-800">editorial@synapse-ai.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Tool Submissions</span>
                  <span className="font-medium text-slate-800">tools@synapse-ai.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Response Window</span>
                  <span className="font-medium text-slate-800">Within 24 business hours</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/70 text-xs text-slate-600">
              <span className="font-bold text-slate-800">Security Note: </span>
              All submissions are encrypted in transit and protected by rate limiting and anti-spam verification.
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs">
          <ContactForm />
        </div>

      </div>
    </div>
  );
}
