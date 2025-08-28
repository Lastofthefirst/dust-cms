import { Component } from 'solid-js';
import { Router, Route } from '@solidjs/router';
import { AuthProvider } from './lib/auth';
import HomePage from './pages/HomePage';
import SiteLoginPage from './pages/SiteLoginPage';
import SiteDashboard from './pages/SiteDashboard';

const App: Component = () => {
  return (
    <AuthProvider>
      <Router>
        <Route path="/" component={HomePage} />
        <Route path="/site/:slug" component={SiteLoginPage} />
        <Route path="/site/:slug/dashboard" component={SiteDashboard} />
        <Route path="/site/:slug/content/:schema" component={() => (
          <div class="min-h-screen bg-gray-50 flex items-center justify-center">
            <div class="text-center">
              <h1 class="text-2xl font-bold text-gray-900 mb-4">Content Management</h1>
              <p class="text-gray-600">Content editing interface coming soon!</p>
              <a href="javascript:history.back()" class="mt-4 inline-block text-primary-600 hover:text-primary-500">
                ← Go back
              </a>
            </div>
          </div>
        )} />
      </Router>
    </AuthProvider>
  );
};

export default App;