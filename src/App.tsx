/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { NotificationToast } from './components/NotificationToast';
import { DemoScenarioTour } from './components/DemoScenarioTour';
import { CreateTaskModal } from './pages/CreateTaskModal';
import { LandingPage } from './pages/LandingPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { NearbyHelpersPage } from './pages/NearbyHelpersPage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { HelperDashboard } from './pages/HelperDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { SafetyPage } from './pages/SafetyPage';

function MainApp() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState<boolean>(false);
  const [prefilledCategoryId, setPrefilledCategoryId] = useState<string | undefined>(undefined);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState<boolean>(false);

  const handleOpenCreateTask = (categoryId?: string) => {
    setPrefilledCategoryId(categoryId);
    setIsCreateTaskOpen(true);
  };

  const handleTaskCreated = (taskId: string) => {
    setCurrentView('customer_dash');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenCreateTask={() => handleOpenCreateTask()}
        onRunDemoScenario={() => setIsDemoTourOpen(true)}
      />

      {/* Main Content Page Routing */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            setCurrentView={setCurrentView}
            onOpenCreateTask={handleOpenCreateTask}
            onSelectCategoryFilter={(catId) => {
              setPrefilledCategoryId(catId);
              setCurrentView('nearby');
            }}
          />
        )}

        {currentView === 'categories' && (
          <CategoriesPage
            onOpenCreateTask={handleOpenCreateTask}
            onExploreHelpers={(catId) => {
              setPrefilledCategoryId(catId);
              setCurrentView('nearby');
            }}
          />
        )}

        {currentView === 'nearby' && (
          <NearbyHelpersPage
            initialCategoryId={prefilledCategoryId}
            onOpenCreateTaskWithHelper={() => handleOpenCreateTask()}
          />
        )}

        {currentView === 'customer_dash' && (
          <CustomerDashboard
            onOpenCreateTask={() => handleOpenCreateTask()}
            onExploreNearby={(catId) => {
              setPrefilledCategoryId(catId);
              setCurrentView('nearby');
            }}
          />
        )}

        {currentView === 'helper_dash' && <HelperDashboard />}

        {currentView === 'admin_dash' && <AdminDashboard />}

        {currentView === 'safety' && <SafetyPage />}
      </main>

      {/* Footer */}
      <Footer setCurrentView={setCurrentView} />

      {/* Create Task Multi-step Modal */}
      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        initialCategoryId={prefilledCategoryId}
        onTaskCreated={handleTaskCreated}
      />

      {/* Demo Scenario Step-by-Step Tour */}
      <DemoScenarioTour
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        onNavigateTo={(view) => setCurrentView(view)}
      />

      {/* Floating Alerts / Notifications */}
      <NotificationToast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
