/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { LandingView } from './components/LandingView';
import { DashboardView } from './components/DashboardView';
import { EditorWorkspace } from './components/EditorWorkspace';
import { FeaturesView } from './components/FeaturesView';
import { TemplatesView } from './components/TemplatesView';
import { PricingView } from './components/PricingView';
import { ResourcesView } from './components/ResourcesView';
import { AdminPanelView } from './components/AdminPanelView';
import { BillingUsageView } from './components/BillingUsageView';
import { CreateDocumentModal } from './components/CreateDocumentModal';
import { AddSourceModal } from './components/AddSourceModal';
import { WritingProfileModal } from './components/WritingProfileModal';
import { ExportModal } from './components/ExportModal';
import { PricingModal } from './components/PricingModal';
import { AuthModal } from './components/AuthModal';
import { OnboardingModal } from './components/OnboardingModal';
import { ResearchSynthesizerModal } from './components/ResearchSynthesizerModal';
import { AcademicDocument, DocumentType, PlanType, Source, UserRole, UserState, WritingProfile } from './types';
import { defaultUser, initialDocuments } from './data/initialData';

export type AppView = 
  | 'landing' 
  | 'dashboard' 
  | 'editor' 
  | 'features' 
  | 'templates' 
  | 'pricing' 
  | 'resources' 
  | 'admin' 
  | 'billing';

export default function App() {
  // Persistence with LocalStorage
  const [user, setUser] = useState<UserState>(() => {
    try {
      const saved = localStorage.getItem('scholarflow_user');
      return saved ? JSON.parse(saved) : defaultUser;
    } catch {
      return defaultUser;
    }
  });

  const [documents, setDocuments] = useState<AcademicDocument[]>(() => {
    try {
      const saved = localStorage.getItem('scholarflow_documents');
      return saved ? JSON.parse(saved) : initialDocuments;
    } catch {
      return initialDocuments;
    }
  });

  // Navigation
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(initialDocuments[0]?.id || null);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createType, setCreateType] = useState<DocumentType>('motivation-letter');
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSynthesizerOpen, setIsSynthesizerOpen] = useState(false);

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('scholarflow_user', JSON.stringify(user));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('scholarflow_documents', JSON.stringify(documents));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }, [documents]);

  const activeDocument = documents.find((d) => d.id === activeDocumentId) || documents[0];

  // Document Handlers
  const handleOpenDocument = (id: string) => {
    setActiveDocumentId(id);
    setCurrentView('editor');
  };

  const handleNewDocument = (type?: DocumentType) => {
    setCreateType(type || 'motivation-letter');
    setIsCreateOpen(true);
  };

  const handleCreateDocument = (docData: Partial<AcademicDocument>) => {
    const newDoc: AcademicDocument = {
      id: `doc-${Date.now()}`,
      title: docData.title || 'Untitled Document',
      type: docData.type || 'research-paper',
      content: docData.content || '# New Document\n\nStart writing in your authentic voice...',
      targetWordLimit: docData.targetWordLimit || 1500,
      citationStyle: docData.citationStyle || 'APA 7',
      sources: docData.sources || [],
      sections: docData.sections || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setDocuments([newDoc, ...documents]);
    setActiveDocumentId(newDoc.id);
    setCurrentView('editor');
  };

  const handleUpdateDocument = (updatedDoc: AcademicDocument) => {
    setDocuments((prev) => prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d)));
  };

  const handleDuplicateDocument = (id: string) => {
    const original = documents.find((d) => d.id === id);
    if (!original) return;

    const copy: AcademicDocument = {
      ...original,
      id: `doc-${Date.now()}`,
      title: `${original.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setDocuments([copy, ...documents]);
  };

  const handleDeleteDocument = (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      const remaining = documents.filter((d) => d.id !== id);
      setDocuments(remaining);
      if (activeDocumentId === id) {
        setActiveDocumentId(remaining[0]?.id || null);
      }
    }
  };

  const handleAddSource = (source: Source) => {
    if (!activeDocument) return;
    const updatedSources = [source, ...activeDocument.sources];
    handleUpdateDocument({
      ...activeDocument,
      sources: updatedSources
    });
  };

  const handleUpdateProfile = (newProfile: WritingProfile) => {
    setUser((prev) => ({
      ...prev,
      writingProfile: newProfile
    }));
  };

  const handleDeductUnits = (amount: number): boolean => {
    if (user.aiUnits >= amount) {
      setUser((prev) => ({
        ...prev,
        aiUnits: prev.aiUnits - amount
      }));
      return true;
    }
    return false;
  };

  const handleAddUnits = (amount: number) => {
    setUser((prev) => ({
      ...prev,
      aiUnits: prev.aiUnits + amount
    }));
  };

  const handleSelectPlan = (plan: PlanType, cycle: 'monthly' | 'annual' = 'monthly') => {
    const creditsMap: Record<PlanType, number> = {
      Free: 100,
      Student: 2000,
      Pro: 6000,
      Researcher: 15000,
      University: 50000
    };

    setUser((prev) => ({
      ...prev,
      plan,
      planBillingCycle: cycle,
      aiUnits: creditsMap[plan] || prev.aiUnits
    }));
  };

  const handleBuyCredits = (amount: number, price: string) => {
    handleAddUnits(amount);
    alert(`Successfully purchased ${amount.toLocaleString()} credits for ${price}!`);
  };

  const handleAuthSuccess = (partialUser: Partial<UserState>, isNewUser: boolean) => {
    setUser((prev) => ({
      ...prev,
      ...partialUser
    }));

    if (isNewUser) {
      setIsOnboardingOpen(true);
    }
  };

  const handleOnboardingComplete = (profile: WritingProfile, meta: Partial<UserState>) => {
    setUser((prev) => ({
      ...prev,
      ...meta,
      writingProfile: profile
    }));
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col text-neutral-900 font-sans">
      
      {/* Top Navigation Bar */}
      <HeaderNav
        currentView={currentView}
        onNavigate={setCurrentView}
        onNewDocument={() => handleNewDocument()}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenPricing={() => setCurrentView('pricing')}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSynthesizer={() => setIsSynthesizerOpen(true)}
        user={user}
      />

      {/* Main Views Switcher */}
      <div className="flex-1 flex flex-col">
        
        {/* PUBLIC: LANDING */}
        {currentView === 'landing' && (
          <LandingView
            onStartWriting={(type) => handleNewDocument(type)}
            onOpenDashboard={() => setCurrentView('dashboard')}
            onOpenProfile={() => setIsProfileOpen(true)}
            onNavigate={setCurrentView}
          />
        )}

        {/* PUBLIC: FEATURES */}
        {currentView === 'features' && (
          <FeaturesView
            onStartWriting={(type) => handleNewDocument(type)}
            onOpenPricing={() => setCurrentView('pricing')}
          />
        )}

        {/* PUBLIC: TEMPLATES */}
        {currentView === 'templates' && (
          <TemplatesView
            onUseTemplate={(type) => handleNewDocument(type)}
          />
        )}

        {/* PUBLIC: PRICING */}
        {currentView === 'pricing' && (
          <PricingView
            user={user}
            onSelectPlan={handleSelectPlan}
            onBuyCredits={handleBuyCredits}
          />
        )}

        {/* PUBLIC: RESOURCES */}
        {currentView === 'resources' && (
          <ResourcesView
            onStartWriting={(type) => handleNewDocument(type)}
          />
        )}

        {/* USER: DASHBOARD */}
        {currentView === 'dashboard' && (
          <DashboardView
            user={user}
            documents={documents}
            onOpenDocument={handleOpenDocument}
            onNewDocument={handleNewDocument}
            onDuplicateDocument={handleDuplicateDocument}
            onDeleteDocument={handleDeleteDocument}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenPricing={() => setCurrentView('pricing')}
            onOpenSynthesizer={(prompt, words) => {
              setIsSynthesizerOpen(true);
            }}
          />
        )}

        {/* USER: EDITOR WORKSPACE */}
        {currentView === 'editor' && activeDocument && (
          <EditorWorkspace
            document={activeDocument}
            user={user}
            onUpdateDocument={handleUpdateDocument}
            onBackToDashboard={() => setCurrentView('dashboard')}
            onOpenAddSource={() => setIsAddSourceOpen(true)}
            onOpenExport={() => setIsExportOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenPricing={() => setCurrentView('pricing')}
            onDeductUnits={handleDeductUnits}
          />
        )}

        {/* USER: BILLING & USAGE */}
        {currentView === 'billing' && (
          <BillingUsageView
            user={user}
            onOpenPricing={() => setCurrentView('pricing')}
            onBuyCredits={handleBuyCredits}
            onBackToDashboard={() => setCurrentView('dashboard')}
          />
        )}

        {/* ADMIN: CONTROL CONSOLE */}
        {currentView === 'admin' && (
          <AdminPanelView
            onBackToDashboard={() => setCurrentView('dashboard')}
            currentUserRole={user.role}
            onChangeUserRole={(role) => setUser({ ...user, role })}
          />
        )}

      </div>

      {/* Modals & Dialogs */}
      <CreateDocumentModal
        isOpen={isCreateOpen}
        initialType={createType}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateDocument}
        user={user}
      />

      <AddSourceModal
        isOpen={isAddSourceOpen}
        onClose={() => setIsAddSourceOpen(false)}
        onAddSource={handleAddSource}
      />

      <WritingProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        writingProfile={user.writingProfile}
        onUpdateProfile={handleUpdateProfile}
      />

      {activeDocument && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          document={activeDocument}
        />
      )}

      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        user={user}
        onSelectPlan={(plan) => handleSelectPlan(plan as PlanType)}
        onAddUnits={handleAddUnits}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        user={user}
        onComplete={handleOnboardingComplete}
      />

      <ResearchSynthesizerModal
        isOpen={isSynthesizerOpen}
        onClose={() => setIsSynthesizerOpen(false)}
        user={user}
        currentDocument={activeDocument}
        onDocumentCreated={handleCreateDocument}
        onDeductUnits={handleDeductUnits}
        onOpenPricing={() => setCurrentView('pricing')}
      />

    </div>
  );
}
