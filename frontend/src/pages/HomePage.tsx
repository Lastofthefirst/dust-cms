import { Component, createSignal, createResource, For, Show } from 'solid-js';
import { api, Site } from '../lib/api';
import { A } from '@solidjs/router';

const HomePage: Component = () => {
  const [sites] = createResource<Site[]>(() => api.getSites());

  return (
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow">
        <div class="container mx-auto px-4 py-6">
          <h1 class="text-3xl font-bold text-gray-900">StaticLeaf CMS</h1>
          <p class="text-gray-600 mt-2">Multi-tenant content management system</p>
        </div>
      </header>

      <main class="container mx-auto px-4 py-8">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-2xl font-semibold text-gray-900 mb-6">Available Sites</h2>
          
          <Show 
            when={!sites.loading && sites()}
            fallback={
              <div class="flex justify-center py-8">
                <div class="text-gray-500">Loading sites...</div>
              </div>
            }
          >
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <For each={sites()}>
                {(site) => (
                  <div class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <Show when={site.cover_image_path}>
                      <img 
                        src={site.cover_image_path}
                        alt={`${site.name} cover`}
                        class="w-full h-48 object-cover rounded mb-4"
                      />
                    </Show>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">{site.name}</h3>
                    <p class="text-gray-600 text-sm mb-4">Site: {site.slug}</p>
                    <p class="text-gray-500 text-xs mb-4">
                      Created: {new Date(site.created_at).toLocaleDateString()}
                    </p>
                    <A 
                      href={`/site/${site.slug}`}
                      class="inline-block bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors"
                    >
                      Access Site
                    </A>
                  </div>
                )}
              </For>
            </div>
          </Show>

          <Show when={sites() && sites()?.length === 0}>
            <div class="text-center py-8">
              <div class="text-gray-500 mb-4">No sites found</div>
              <p class="text-sm text-gray-400">
                Create a site using the CLI: <code class="bg-gray-100 px-2 py-1 rounded">staticleaf create-site --name "My Site"</code>
              </p>
            </div>
          </Show>
        </div>
      </main>
    </div>
  );
};

export default HomePage;