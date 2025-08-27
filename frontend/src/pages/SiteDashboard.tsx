import { Component, createResource, Show, For } from 'solid-js';
import { useParams, A } from '@solidjs/router';
import { api, ContentSchema } from '../lib/api';
import { useAuth } from '../lib/auth';

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
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{user()?.site.name}</h1>
            <p class="text-gray-600 text-sm">Content Management Dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            class="text-gray-600 hover:text-gray-900 text-sm"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main class="container mx-auto px-4 py-8">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Content Types</h2>
          
          <Show 
            when={!schemas.loading && schemas()}
            fallback={
              <div class="flex justify-center py-8">
                <div class="text-gray-500">Loading content types...</div>
              </div>
            }
          >
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <For each={schemas()}>
                {(schema) => (
                  <div class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">{schema.name}</h3>
                    <Show when={schema.description}>
                      <p class="text-gray-600 text-sm mb-4">{schema.description}</p>
                    </Show>
                    <div class="text-xs text-gray-500 mb-4">
                      {schema.fields.length} field{schema.fields.length !== 1 ? 's' : ''}
                      <Show when={schema.max_instances !== null}>
                        {' • '}
                        <Show when={schema.max_instances === 0} fallback={`Max ${schema.max_instances} instances`}>
                          Disabled
                        </Show>
                      </Show>
                    </div>
                    <div class="space-y-2">
                      <A 
                        href={`/site/${params.slug}/content/${schema.slug}`}
                        class="block text-center bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors"
                      >
                        Manage Content
                      </A>
                      <button
                        class="block w-full text-center border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
                        onClick={() => alert('Field management coming soon!')}
                      >
                        View Fields
                      </button>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </Show>

          <Show when={schemas() && schemas()?.length === 0}>
            <div class="text-center py-8">
              <div class="text-gray-500 mb-4">No content types found</div>
              <p class="text-sm text-gray-400">
                Content schemas are defined when creating the site.
              </p>
            </div>
          </Show>
        </div>

        <div class="bg-white rounded-lg shadow p-6 mt-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              class="text-left p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              onClick={() => alert('Image upload coming soon!')}
            >
              <div class="font-medium text-gray-900">Upload Images</div>
              <div class="text-sm text-gray-600">Add new images to your media library</div>
            </button>
            <button
              class="text-left p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              onClick={() => alert('Site settings coming soon!')}
            >
              <div class="font-medium text-gray-900">Site Settings</div>
              <div class="text-sm text-gray-600">Configure site options</div>
            </button>
            <button
              class="text-left p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              onClick={() => alert('Export coming soon!')}
            >
              <div class="font-medium text-gray-900">Export Data</div>
              <div class="text-sm text-gray-600">Download your content as JSON</div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SiteDashboard;