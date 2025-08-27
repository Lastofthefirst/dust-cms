import { Component, createSignal, createResource, Show } from 'solid-js';
import { useParams, useNavigate } from '@solidjs/router';
import { api, Site } from '../lib/api';
import { useAuth } from '../lib/auth';

const SiteLoginPage: Component = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [password, setPassword] = createSignal('');
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
    <div class="min-h-screen bg-gray-50 flex items-center justify-center">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-900">StaticLeaf CMS</h1>
          <Show when={site()}>
            <div class="mt-6 bg-white rounded-lg shadow p-6">
              <Show when={site()?.cover_image_path}>
                <img 
                  src={site()?.cover_image_path}
                  alt={`${site()?.name} cover`}
                  class="w-full h-32 object-cover rounded mb-4"
                />
              </Show>
              <h2 class="text-xl font-semibold text-gray-900">{site()?.name}</h2>
              <p class="text-gray-600 text-sm mt-1">Welcome back!</p>
            </div>
          </Show>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleLogin} class="space-y-6">
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                Site Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password()}
                onInput={(e) => setPassword(e.currentTarget.value)}
                class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter your site password"
                disabled={loading()}
              />
            </div>

            <Show when={error()}>
              <div class="text-red-600 text-sm">{error()}</div>
            </Show>

            <button
              type="submit"
              disabled={loading()}
              class="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading() ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div class="mt-6 text-center">
            <a href="/" class="text-sm text-primary-600 hover:text-primary-500">
              ← Back to site list
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteLoginPage;