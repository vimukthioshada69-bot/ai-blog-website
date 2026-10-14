import { Settings as SettingsIcon, Save, Sparkles, CheckCircle2 } from 'lucide-react';
import { getSiteSettings } from '@/lib/data/posts';
import { updateSiteSettings } from '@/app/actions/postActions';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  async function handleUpdateSettings(formData: FormData) {
    'use server';
    await updateSiteSettings(formData);
  }
  const settings = await getSiteSettings();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-mono font-bold mb-1 border border-indigo-100">
          <SettingsIcon className="w-3.5 h-3.5" />
          <span>GLOBAL CONFIGURATION</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 font-heading">
          Site Settings
        </h1>
        <p className="text-xs text-slate-500 font-mono">
          Manage publication identity, metadata, and official social channels stored in the database
        </p>
      </div>

      {/* Settings Form */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs max-w-3xl">
        <form action={handleUpdateSettings} className="space-y-6 text-xs">
          
          {/* Site Identity */}
          <div className="space-y-4">
            <h2 className="font-bold text-sm text-slate-900 font-heading border-b border-slate-100 pb-2">
              Publication Identity
            </h2>

            <div>
              <label className="block font-mono font-bold uppercase text-slate-700 mb-1">
                Site Title *
              </label>
              <input
                type="text"
                name="site_title"
                required
                defaultValue={settings.site_title}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-heading font-bold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-mono font-bold uppercase text-slate-700 mb-1">
                Site Meta Description *
              </label>
              <textarea
                name="site_description"
                required
                rows={3}
                defaultValue={settings.site_description}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none text-xs"
              />
            </div>
          </div>

          {/* Social Channels */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="font-bold text-sm text-slate-900 font-heading pb-1">
              Official Social Channels
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono font-bold uppercase text-slate-700 mb-1">
                  Twitter / X URL
                </label>
                <input
                  type="url"
                  name="twitter"
                  defaultValue={settings.social_links?.twitter || ''}
                  placeholder="https://twitter.com/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-mono font-bold uppercase text-slate-700 mb-1">
                  GitHub URL
                </label>
                <input
                  type="url"
                  name="github"
                  defaultValue={settings.social_links?.github || ''}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-mono font-bold uppercase text-slate-700 mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  name="linkedin"
                  defaultValue={settings.social_links?.linkedin || ''}
                  placeholder="https://linkedin.com/company/..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-mono font-bold uppercase text-slate-700 mb-1">
                  YouTube Channel URL
                </label>
                <input
                  type="url"
                  name="youtube"
                  defaultValue={settings.social_links?.youtube || ''}
                  placeholder="https://youtube.com/@..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="px-6 py-2.5 btn-ai-gradient text-white font-bold text-xs rounded-xl shadow-xs hover:scale-105 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Site Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
