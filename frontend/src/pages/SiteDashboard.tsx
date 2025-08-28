import { Component, createResource, Show, For } from 'solid-js';
import { useParams, A } from '@solidjs/router';
import { api, ContentSchema } from '../lib/api';
import { useAuth } from '../lib/auth';
import { ThemeToggle } from '../lib/components/ThemeToggle';
import { SchemaCardSkeleton } from '../lib/components/Skeleton';
import { 
  IconLogOut, 
  IconEdit, 
  IconImage, 
  IconFile, 
  IconSettings, 
  IconExternalLink,
  IconHome,
  IconPlus
} from '../lib/components/Icons';

const SiteDashboard: Component = () => {
  const params = useParams();
  const { user, logout } = useAuth();
  
  const [schemas] = createResource<ContentSchema[]>(() => 
    user() ? api.getSchemas(params.slug) : Promise.resolve([])
  );

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Modern header with glassmorphism */}
      <header class="glass-strong border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50">
        <div class="container mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            {/* Site info and branding */}
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span class="text-white font-bold text-lg">{user()?.site.name[0]}</span>
              </div>
              <div>
                <h1 class="font-display text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {user()?.site.name}
                </h1>
                <p class="text-sm text-slate-500 dark:text-slate-400">
                  Content Management Dashboard
                </p>
              </div>
            </div>

            {/* Header actions */}
            <div class="flex items-center space-x-2">
              <A
                href="/"
                class="btn-ghost p-2 rounded-xl"
                title="Back to sites"
              >
                <IconHome size={20} />
              </A>
              <ThemeToggle />
              <button
                onClick={handleLogout}
                class="btn-ghost p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                title="Sign out"
              >
                <IconLogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="container mx-auto px-6 py-8">
        {/* Welcome section */}
        <div class="mb-8">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="font-display text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Content Types
              </h2>
              <p class="text-slate-600 dark:text-slate-400">
                Manage your structured content with ease
              </p>
            </div>
            
            <Show when={schemas() && schemas()!.length > 0}>
              <div class="text-sm text-slate-500 dark:text-slate-400">
                {schemas()!.length} content type{schemas()!.length !== 1 ? 's' : ''}
              </div>
            </Show>
          </div>
        </div>

        {/* Content schemas grid */}
        <div class="mb-8">
          <Show 
            when={!schemas.loading}
            fallback={
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SchemaCardSkeleton />
                <SchemaCardSkeleton />
                <SchemaCardSkeleton />
              </div>
            }
          >
            <Show 
              when={schemas() && schemas()!.length > 0}
              fallback={
                <div class="text-center py-16">
                  <div class="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <IconFile size={32} class="text-slate-400 dark:text-slate-500" />
                  </div>
                  <h3 class="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                    No content types found
                  </h3>
                  <p class="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                    Content schemas are defined when creating the site. Contact your administrator to add content types.
                  </p>
                  <div class="glass p-4 rounded-2xl max-w-lg mx-auto">
                    <code class="text-sm font-mono text-blue-600 dark:text-blue-400">
                      Content schemas define your site's structure
                    </code>
                  </div>
                </div>
              }
            >
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                <For each={schemas()}>
                  {(schema) => (
                    <div class="card-hover p-6 group">
                      {/* Schema header */}
                      <div class="flex items-start justify-between mb-4">
                        <div class="flex-1">
                          <h3 class="font-display text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {schema.name}
                          </h3>
                          <Show when={schema.description}>
                            <p class="text-sm text-slate-600 dark:text-slate-400 mb-3">
                              {schema.description}
                            </p>
                          </Show>
                        </div>
                        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <IconFile size={20} class="text-white" />
                        </div>
                      </div>

                      {/* Schema metadata */}
                      <div class="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400 mb-6">
                        <div class="flex items-center">
                          <div class="w-2 h-2 bg-green-500 rounded-full mr-2" />
                          <span>{schema.fields.length} field{schema.fields.length !== 1 ? 's' : ''}</span>
                        </div>
                        <Show when={schema.max_instances !== null}>
                          <div class="flex items-center">
                            <div class="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                            <Show when={schema.max_instances === 0} fallback={`Max ${schema.max_instances}`}>
                              Disabled
                            </Show>
                          </div>
                        </Show>
                      </div>

                      {/* Action buttons */}
                      <div class="space-y-3">
                        <A 
                          href={`/site/${params.slug}/content/${schema.slug}`}
                          class="btn-primary w-full group/btn"
                        >
                          <IconEdit size={16} class="mr-2" />
                          <span>Manage Content</span>
                        </A>
                        <button
                          class="btn-secondary w-full group/btn"
                          onClick={() => alert('Field management coming soon!')}
                        >
                          <IconSettings size={16} class="mr-2" />
                          <span>View Fields</span>
                        </button>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </Show>
          </Show>
        </div>

        {/* Quick Actions */}
        <div class="glass-strong rounded-3xl p-8">
          <h3 class="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
            Quick Actions
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              class="text-left p-6 card-hover transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 group"
              onClick={() => alert('Image upload coming soon!')}
            >
              <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <IconImage size={20} class="text-white" />
              </div>
              <h4 class="font-semibold text-slate-900 dark:text-slate-100 mb-2">Upload Images</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Add new images to your media library</p>
            </button>
            
            <button
              class="text-left p-6 card-hover transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 group"
              onClick={() => alert('Site settings coming soon!')}
            >
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <IconSettings size={20} class="text-white" />
              </div>
              <h4 class="font-semibold text-slate-900 dark:text-slate-100 mb-2">Site Settings</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Configure site options and preferences</p>
            </button>
            
            <button
              class="text-left p-6 card-hover transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 group"
              onClick={() => alert('Export coming soon!')}
            >
              <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <IconExternalLink size={20} class="text-white" />
              </div>
              <h4 class="font-semibold text-slate-900 dark:text-slate-100 mb-2">Export Data</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Download your content as JSON</p>
            </button>

            <button
              class="text-left p-6 card-hover transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 group"
              onClick={() => alert('API docs coming soon!')}
            >
              <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <IconFile size={20} class="text-white" />
              </div>
              <h4 class="font-semibold text-slate-900 dark:text-slate-100 mb-2">API Documentation</h4>
              <p class="text-sm text-slate-600 dark:text-slate-400">Integrate with your static site</p>
            </button>
          </div>
        </div>

        {/* Site status */}
        <div class="mt-8 text-center">
          <div class="inline-flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Site operational • Last updated {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SiteDashboard;