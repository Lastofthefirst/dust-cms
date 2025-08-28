import { Component, createSignal, createResource, Show } from 'solid-js';
import { useParams, useNavigate } from '@solidjs/router';
import { api, Site } from '../lib/api';
import { useAuth } from '../lib/auth';
import { ThemeToggle } from '../lib/components/ThemeToggle';
import { IconEye, IconEyeOff, IconArrowLeft, IconLoader } from '../lib/components/Icons';

const SiteLoginPage: Component = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [password, setPassword] = createSignal('');
  const [showPassword, setShowPassword] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal('');
  
  const [site] = createResource<Site>(() => api.getSite(params.slug));

  const handleLogin = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const auth = await api.authenticate(params.slug, password());
      login(auth);
      navigate(`/site/${params.slug}/dashboard`);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Invalid password');
      } else {
        setError('Failed to authenticate. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
      {/* Background decoration */}
      <div class="absolute inset-0 opacity-30" style={{
        "background-image": `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.04'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      {/* Header */}
      <header class="relative z-10 p-6">
        <div class="flex items-center justify-between max-w-md mx-auto">
          <a 
            href="/" 
            class="flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors group"
          >
            <IconArrowLeft size={20} class="mr-2 transition-transform group-hover:-translate-x-1" />
            <span class="text-sm font-medium">Back to sites</span>
          </a>
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <main class="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div class="w-full max-w-md space-y-8">
          {/* Logo and branding */}
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-6 shadow-lg">
              <span class="text-white font-bold text-xl">SL</span>
            </div>
            <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Welcome back
            </h1>
            <p class="text-slate-600 dark:text-slate-400">
              Sign in to manage your content
            </p>
          </div>

          {/* Site information card */}
          <Show when={site()}>
            <div class="card p-6 animate-fade-in-up">
              <div class="flex items-center space-x-4">
                <Show 
                  when={site()?.cover_image_path}
                  fallback={
                    <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span class="text-white font-bold text-lg">{site()?.name[0]}</span>
                    </div>
                  }
                >
                  <img 
                    src={site()?.cover_image_path}
                    alt={`${site()?.name} cover`}
                    class="w-16 h-16 object-cover rounded-xl flex-shrink-0"
                  />
                </Show>
                <div class="min-w-0 flex-1">
                  <h2 class="font-display text-xl font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {site()?.name}
                  </h2>
                  <p class="text-sm text-slate-500 dark:text-slate-400 font-mono">
                    {site()?.slug}
                  </p>
                  <div class="flex items-center mt-2">
                    <div class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                    <span class="text-xs text-slate-500 dark:text-slate-400">Site active</span>
                  </div>
                </div>
              </div>
            </div>
          </Show>

          {/* Login form */}
          <div class="card p-8 animate-fade-in-up" style="animation-delay: 0.1s">
            <form onSubmit={handleLogin} class="space-y-6">
              <div>
                <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Site Password
                </label>
                <div class="relative">
                  <input
                    id="password"
                    type={showPassword() ? 'text' : 'password'}
                    required
                    value={password()}
                    onInput={(e) => setPassword(e.currentTarget.value)}
                    class="input pr-12"
                    placeholder="Enter your site password"
                    disabled={loading()}
                    autocomplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword())}
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    disabled={loading()}
                  >
                    {showPassword() ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                  </button>
                </div>
              </div>

              <Show when={error()}>
                <div class="card-glass border border-red-200 dark:border-red-800 p-4 animate-fade-in">
                  <div class="flex items-center space-x-3">
                    <div class="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                    <p class="text-sm text-red-700 dark:text-red-400">{error()}</p>
                  </div>
                </div>
              </Show>

              <button
                type="submit"
                disabled={loading() || !password().trim()}
                class="btn-primary w-full h-12 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Show 
                  when={!loading()}
                  fallback={
                    <>
                      <IconLoader size={20} class="mr-2" />
                      <span>Signing in...</span>
                    </>
                  }
                >
                  <span>Sign In</span>
                </Show>
              </button>
            </form>

            {/* Additional info */}
            <div class="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div class="text-center">
                <p class="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  Secure authentication powered by Argon2
                </p>
                <div class="flex items-center justify-center space-x-4 text-xs text-slate-400 dark:text-slate-500">
                  <span>🔒 End-to-end encrypted</span>
                  <span>•</span>
                  <span>⚡ Instant access</span>
                </div>
              </div>
            </div>
          </div>

          {/* Help text */}
          <div class="text-center animate-fade-in-up" style="animation-delay: 0.2s">
            <p class="text-sm text-slate-500 dark:text-slate-400">
              Lost your password? Contact your site administrator for assistance.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SiteLoginPage;