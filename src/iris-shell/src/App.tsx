import { useEffect } from 'react';
import { useRoute, navigate, splitPersonaHash, type Route } from './lib/router.js';
import { UsersProvider } from './lib/usersStore.js';
import { DirectoryProvider } from './lib/directoryStore.js';
import { AppShellProvider, useAppShell } from './lib/appShellContext.js';
import { useToastMessage } from './lib/toastStore.js';
import { ARSMoveToast, ARSNewObjectToast } from '@ars';
import { CommandPalette } from './components/CommandPalette/CommandPalette.js';
import { Toast } from './components/Toast/Toast.js';
import { UsersPage } from './views/UsersPage/UsersPage.js';
import { UserDetailPage } from './views/UserDetailPage/UserDetailPage.js';
import { TreeListPage } from './views/TreeView/TreeListPage.js';
import { TreeRootPage } from './views/TreeView/TreeRootPage.js';
import { TreeDetailPage } from './views/TreeView/TreeDetailPage.js';
import { FavoritesPage } from './views/FavoritesView/FavoritesPage.js';
import { WipPage } from './views/WipPage/WipPage.js';
import { InsightsPage } from './views/InsightsPage/InsightsPage.js';
import { ServicesPage } from './views/ServicesPage/ServicesPage.js';
import { IdentityManagerPage } from './views/IdentityManagerPage/IdentityManagerPage.js';
import { IdentityInsightsPage } from './views/IdentityManagerPage/IdentityInsightsPage.js';
import { IdentityPlaceholder } from './views/IdentityManagerPage/IdentityPlaceholder.js';
import { GroupsPage } from './views/GroupsPage/GroupsPage.js';
import { ManagedUnitMembersPage, ManagedUnitsPage } from './views/ManagedUnitsPage/ManagedUnitsPage.js';
import { IdentitySectionPage } from './views/IdentityManagerPage/IdentitySectionPage.js';
import { SafeguardPage } from './views/SafeguardPage/SafeguardPage.js';
import { UserViewHome } from './views/UserView/UserViewHome.js';
import { ProfilePage } from './views/UserView/ProfilePage.js';
import { ApprovalsPage } from './views/UserView/ApprovalsPage.js';
import { MyAccessPage } from './views/UserView/MyAccessPage.js';
import { WelcomePage } from './views/WelcomePage/WelcomePage.js';
import { StorybooksPage } from './views/StorybooksPage/StorybooksPage.js';
import { ComponentsReviewPage } from './views/ComponentsReviewPage/ComponentsReviewPage.js';
import { DesignUpdatesPage } from './views/DesignUpdatesPage/DesignUpdatesPage.js';
import { ReviewHubPage } from './views/ReviewHubPage/ReviewHubPage.js';
import { ReviewTasksPage } from './views/ReviewTasksPage/ReviewTasksPage.js';
import { ARSDirectoryPanel } from './views/ARSDirectoryPanel/ARSDirectoryPanel.js';

function renderRoute(route: Route) {
  switch (route.name) {
    case 'userDetail':
      return <UserDetailPage userId={route.params.id} />;
    case 'usersList':
      return <UsersPage />;
    case 'treeRoot':
      return <TreeRootPage />;
    case 'treeList':
      // Figma's Tree view screen for Managed units (ARS_Treeview_Master 7051:7736) shows the managed units list.
      return route.params.nodeId === 'managed-units' ? (
        <ManagedUnitsPage />
      ) : (
        <TreeListPage nodeId={route.params.nodeId} />
      );
    case 'treeDetail':
      return <TreeDetailPage nodeId={route.params.nodeId} objectId={route.params.objectId} />;
    case 'favoritesList':
      return <FavoritesPage />;
    case 'favoritesFolder':
      return <TreeListPage nodeId={route.params.nodeId} inFavorites />;
    case 'groups':
      return <GroupsPage />;
    case 'devices':
      return <WipPage title="Devices" icon="Devices" />;
    case 'agents':
      return <WipPage title="Agents" icon="Robot" />;
    case 'applications':
      return <WipPage title="Applications" icon="Browsers" />;
    case 'accessTemplates':
      return <WipPage title="Access templates" icon="UserCircleCheck" />;
    case 'managementUnits':
      return <ManagedUnitsPage />;
    case 'managedUnitMembers':
      return <ManagedUnitMembersPage unitId={route.params.id} />;
    case 'insights':
      return <InsightsPage />;
    case 'services':
      return <ServicesPage />;
    case 'identityHome':
      return <IdentityManagerPage />;
    case 'identityInsights':
      return <IdentityInsightsPage />;
    case 'identitySettings':
      return (
        <IdentityPlaceholder title="Settings" icon="GearFine" activeItem="#/identity/settings" />
      );
    case 'identityHelp':
      return (
        <IdentityPlaceholder title="Help with" icon="Question" activeItem="#/identity/help" />
      );
    case 'identitySection':
      return <IdentitySectionPage groupId={route.params.group} itemValue={route.params.item} />;
    case 'safeguardHome':
      return <SafeguardPage />;
    case 'welcome':
      return <WelcomePage />;
    case 'userViewHome':
      return <UserViewHome />;
    case 'userViewProfile':
      return <ProfilePage />;
    case 'userViewApprovals':
      return <ApprovalsPage />;
    case 'userViewAccess':
      return <MyAccessPage />;
    default:
      return null;
  }
}

/**
 * Until a persona is picked, every address shows the persona picker (except the Storybooks page).
 * An address that starts with a persona id (`#/admin-user/users`) signs that persona in first.
 */
function RoutedPage() {
  const route = useRoute();
  const { persona, setPersonaId } = useAppShell();
  const { personaId: hashPersonaId } = splitPersonaHash(window.location.hash);
  const switching = hashPersonaId !== null && persona?.id !== hashPersonaId;

  useEffect(() => {
    if (hashPersonaId && persona?.id !== hashPersonaId) setPersonaId(hashPersonaId);
  }, [hashPersonaId, persona?.id, setPersonaId]);

  if (switching) return null;
  if (route.name === 'storybooks') return <StorybooksPage />;
  if (route.name === 'componentsReview') return <ReviewHubPage />;
  if (route.name === 'componentsReviewMissing') return <ComponentsReviewPage />;
  if (route.name === 'componentsReviewTasks') return <ReviewTasksPage />;
  if (route.name === 'componentsReviewTidyUp') return <ReviewTasksPage source="tidy-up" />;
  if (route.name === 'componentsReviewRecommendations') return <DesignUpdatesPage />;
  return persona ? renderRoute(route) : <WelcomePage />;
}

export default function App() {
  const toast = useToastMessage();
  return (
    <UsersProvider>
      <DirectoryProvider>
        <AppShellProvider directoryPanel={<ARSDirectoryPanel />}>
          <RoutedPage />
          <CommandPalette />
          {toast.onUndo ? (
            <ARSMoveToast
              message={toast.message}
              onUndo={() => {
                toast.onUndo?.();
                toast.dismiss();
              }}
              onView={
                toast.viewHref
                  ? () => {
                      if (toast.viewHref) navigate(toast.viewHref);
                      toast.dismiss();
                    }
                  : undefined
              }
              viewLabel={toast.viewLabel}
              onDismiss={toast.dismiss}
            />
          ) : toast.viewHref ? (
            <ARSNewObjectToast
              message={toast.message}
              supportingText={toast.supportingText}
              onView={() => {
                if (toast.viewHref) navigate(toast.viewHref);
                toast.dismiss();
              }}
              onDismiss={toast.dismiss}
            />
          ) : (
            <Toast message={toast.message} supportingText={toast.supportingText} onDismiss={toast.dismiss} />
          )}
        </AppShellProvider>
      </DirectoryProvider>
    </UsersProvider>
  );
}
