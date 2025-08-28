import { Component, createSignal, createResource, For, Show } from 'solid-js';
import { api, Site } from '../lib/api';
import { A } from '@solidjs/router';
import { ThemeToggle } from '../lib/components/ThemeToggle';
import { SiteCardSkeleton } from '../lib/components/Skeleton';
import { IconArrowRight, IconExternalLink, IconSettings } from '../lib/components/Icons';

const HomePage: Component = () => {
  const [sites] = createResource<Site[]>(() => api.getSites());

  // Modern hero section with gradient background
  const HeroSection = () => (
    <div class="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background decoration */}
      <div class="absolute inset-0 opacity-30" style={{
        "background-image": `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239333ea' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      <div class="relative container mx-auto px-6 py-16 sm:py-24 lg:py-32">
        <div class="text-center max-w-4xl mx-auto">
          {/* Logo/Brand */}
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-8 shadow-lg">
            <span class="text-white font-bold text-2xl">SL</span>
          </div>
          
          {/* Main heading */}
          <h1 class="font-display text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up">
            <span class="text-gradient">StaticLeaf</span>
            <br />
            <span class="text-slate-900 dark:text-slate-100">CMS</span>
          </h1>
          
          {/* Subtitle */}
          <p class="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style="animation-delay: 0.1s">
            High-performance multi-tenant content management designed for developers who value 
            <span class="text-gradient font-semibold"> simplicity and power</span>
          </p>
          
          {/* Features highlight */}
          <div class="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in-up" style="animation-delay: 0.2s">
            <div class="glass px-4 py-2 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300">
              🚀 Rust Backend
            </div>
            <div class="glass px-4 py-2 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300">
              ⚡ SolidJS Frontend
            </div>
            <div class="glass px-4 py-2 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300">
              🎨 Tailwind CSS 4
            </div>
            <div class="glass px-4 py-2 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300">
              📱 Mobile First
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Modern navigation bar
  const NavigationBar = () => (
    <nav class="sticky top-0 z-50 glass-strong border-b border-slate-200/50 dark:border-slate-700/50">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span class="text-white font-bold text-sm">SL</span>
            </div>
            <div>
              <h2 class="font-display font-semibold text-slate-900 dark:text-slate-100">StaticLeaf</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400">Content Management</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <ThemeToggle />
            <button class="btn-ghost p-2 rounded-xl">
              <IconSettings size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  // Enhanced site card with modern design
  const SiteCard: Component<{ site: Site }> = ({ site }) => (
    <div class="card-hover p-0 overflow-hidden group">
      {/* Cover image with overlay */}
      <div class="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
        <Show 
          when={site.cover_image_path}
          fallback={
            <div class="w-full h-full flex items-center justify-center">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center">
                <span class="text-white font-bold text-xl">{site.name[0]}</span>
              </div>
            </div>
          }
        >
          <img 
            src={site.cover_image_path}
            alt={`${site.name} cover`}
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Show>
        
        {/* Quick actions overlay */}
        <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button class="glass-strong p-2 rounded-xl text-white hover:bg-white/20 transition-colors">
            <IconExternalLink size={16} />
          </button>
        </div>
      </div>
      
      {/* Card content */}
      <div class="p-6">
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <h3 class="font-display text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {site.name}
            </h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 font-mono">
              {site.slug}
            </p>
          </div>
          <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse" title="Active site" />
        </div>
        
        {/* Meta information */}
        <div class="flex items-center text-xs text-slate-400 dark:text-slate-500 mb-6">
          <span>Created {new Date(site.created_at).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}</span>
        </div>
        
        {/* Action button */}
        <A 
          href={`/site/${site.slug}`}
          class="btn-primary w-full group/btn"
        >
          <span>Access Site</span>
          <IconArrowRight size={16} class="ml-2 transition-transform group-hover/btn:translate-x-1" />
        </A>
      </div>
    </div>
  );

  // Empty state with modern design
  const EmptyState = () => (
    <div class="text-center py-16">
      <div class="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <IconSettings size={32} class="text-slate-400 dark:text-slate-500" />
      </div>
      <h3 class="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
        No sites found
      </h3>
      <p class="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
        Get started by creating your first site using the StaticLeaf CLI
      </p>
      <div class="glass p-4 rounded-2xl max-w-lg mx-auto">
        <code class="text-sm font-mono text-blue-600 dark:text-blue-400">
          staticleaf create-site --name "My Site"
        </code>
      </div>
    </div>
  );

  return (
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900">
      <HeroSection />
      <NavigationBar />
      
      <main class="container mx-auto px-6 py-12">
        {/* Sites section */}
        <div class="mb-8">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h2 class="font-display text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Your Sites
              </h2>
              <p class="text-slate-600 dark:text-slate-400">
                Manage your content across multiple projects
              </p>
            </div>
            
            <Show when={sites() && sites()!.length > 0}>
              <div class="text-sm text-slate-500 dark:text-slate-400">
                {sites()!.length} site{sites()!.length !== 1 ? 's' : ''}
              </div>
            </Show>
          </div>
          
          <Show 
            when={!sites.loading}
            fallback={
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SiteCardSkeleton />
                <SiteCardSkeleton />
                <SiteCardSkeleton />
              </div>
            }
          >
            <Show when={sites() && sites()!.length > 0} fallback={<EmptyState />}>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                <For each={sites()}>
                  {(site) => <SiteCard site={site} />}
                </For>
              </div>
            </Show>
          </Show>
        </div>
        
        {/* Additional features section */}
        <Show when={sites() && sites()!.length > 0}>
          <div class="glass-strong rounded-3xl p-8 mt-16">
            <h3 class="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
              Quick Actions
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button class="text-left p-6 card-hover transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                  <IconSettings size={20} class="text-white" />
                </div>
                <h4 class="font-semibold text-slate-900 dark:text-slate-100 mb-2">Global Settings</h4>
                <p class="text-sm text-slate-600 dark:text-slate-400">Configure system-wide preferences</p>
              </button>
              
              <button class="text-left p-6 card-hover transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <IconExternalLink size={20} class="text-white" />
                </div>
                <h4 class="font-semibold text-slate-900 dark:text-slate-100 mb-2">Documentation</h4>
                <p class="text-sm text-slate-600 dark:text-slate-400">Learn more about StaticLeaf</p>
              </button>
              
              <button class="text-left p-6 card-hover transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <IconSettings size={20} class="text-white" />
                </div>
                <h4 class="font-semibold text-slate-900 dark:text-slate-100 mb-2">System Info</h4>
                <p class="text-sm text-slate-600 dark:text-slate-400">View system status and metrics</p>
              </button>
            </div>
          </div>
        </Show>
      </main>
    </div>
  );
};

export default HomePage;