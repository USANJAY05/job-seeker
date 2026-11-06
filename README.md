# Job Buddy UI

React Native component library and app screens for resume management, pipeline, chat, and settings. The Expo preview defaults to local example data. Set `EXPO_PUBLIC_API_URL` to load and update resume, template, and profile data through the local development backend.

## Integration

Install React, React Native, React Native Paper, and React Native Safe Area Context in the host app. Wrap the app in `SafeAreaProvider` and `JobBuddyThemeProvider`; the latter also supplies the React Native Paper theme. React Native Paper's default icon provider uses Material Community Icons; configure its icon provider if your app uses a different icon set. Load Geist and JetBrains Mono with the names `Geist` and `JetBrainsMono`, or change the names in `src/theme` to fonts available in your app.

The design can be assembled in this order: `PageHeader`, `SegmentedNavigation`, `SearchBar`, `FilterChips`, a list of `ResumeCard` components, `CreateResumeAction`, and `BottomNavigation`. Place the content in a scroll view with enough bottom padding for the floating action and navigation. Position the floating action above the bottom navigation in the host screen and account for safe-area insets.

All selections, resume data, and actions are passed in as props. The create action manages only whether its menu is open. Counts, search, filtering, navigation, and resume actions belong to the host screen. Icons use Material Community Icons names. `CreateResumeAction` closes when an option is chosen or its button is pressed again.

Run `npm install`, `npm run typecheck`, and `npm test` to validate the library. `npm run test:unit` and `npm run test:integration` run the suites separately.

## Templates Explorer components

The second design reuses `PageHeader` (optional `action`), `SegmentedNavigation`, `SearchBar`, `FilterChips` (use `variant="pill"` and optional filter icons), and `BottomNavigation`. Arrange these above a list of `TemplateCard` components, followed by a positioned `FloatingAction` for upload. `TemplateCard` receives its badge, optional bookmark callback, and action definitions as props, allowing public and private templates to share the same component. Action and bookmark handlers remain in the host screen; no file or vault operations are performed by the library.

## Document editor and preview

The three editor designs share `DocumentHeader`, `SegmentedNavigation`, and `BottomNavigation`. Use `TexEditor` for controlled plain-text source, and compose the form from `EditorSection`, `EditorField`, `EditorBullet`, and existing buttons and badges. `DocumentPreview` displays a compiled PDF from a local file or HTTPS URI; it does not compile LaTeX. Compile and save callbacks, form-to-source conversion, and PDF retrieval belong to the host and its future API contract. Source editing currently has line numbers but no syntax highlighting.

The preview uses `react-native-pdf` and requires the host to install a `react-native-blob-util` version compatible with its React Native version. Follow [react-native-pdf native setup](https://github.com/wonday/react-native-pdf#installation), including iOS pods. It requires a native build and does not run in Expo Go. Mount `ToastHost` once at the app root and call `showToast('success', 'Saved')` (or `error` / `info`). These packages are declared in `package.json`; a host app must also complete their native platform setup.

## Theme

`JobBuddyThemeProvider` defaults to `mode="system"` and follows the device setting. Pass `mode="light"` or `mode="dark"` to override it; update that prop from app settings to switch immediately. Access the active palette with `useAppTheme()`. All library components, including toasts, use the active palette.

```tsx
<SafeAreaProvider>
  <JobBuddyThemeProvider mode={themeMode}>
    <App />
    <ToastHost />
  </JobBuddyThemeProvider>
</SafeAreaProvider>
```

Edit `lightColors` and `darkColors` in `src/theme`, or pass a partial `colors` override to the provider. Color overrides must be six-digit hex values because some component borders use alpha suffixes. `jobBuddyTheme` and `colors` remain exported as legacy dark defaults; use the provider and hook for dynamic themes. Caller-supplied icon and filter colors are explicit overrides, so callers should select them for the active theme. The supplied pipeline HTML uses a dark palette; the light palette is an adaptation of the same visual language.

The pipeline design reuses `PageHeader`, `SearchBar`, `BottomNavigation`, `Badge`, and buttons. `OpportunityCard` supplies the shared job card layout; provide its actions and data from the host screen.

## Copilot components

The copilot design reuses `PageHeader`, `Badge`, `IconAction`, and `BottomNavigation`. Use `ContextStrip`, `CopilotWelcome`, `QuickActionCard`, `SessionRow`, `MessageComposer`, and `HistoryDrawer` to compose the remaining interface. Arrange quick-action cards in a wrapping two-column container and position the composer above navigation in the host screen. Composer input is controlled: dispatch, shortcuts, attachments, session selection, history visibility, and cache actions are supplied as callbacks. The components do not perform AI, scraping, file upload, or cache operations.

## Dashboard, settings, profiles and conversations

The dashboard and agent fleet designs share `MetricCard`, `StatusCard`, `ProgressMeter`, and `LogPanel`. Settings screens can compose `SettingsSection`, `SettingsRow`, `SettingsToggle`, `ChoiceList`, `RangeControl`, `NumberStepper`, `SegmentedNavigation`, and `EditorField` (including `secureTextEntry` for secrets). Profile screens can reuse `ProfileIdentity`, `TagGroup`, `EditorSection`, `EditorBullet`, and `StatusCard`. Active conversations use `MessageBubble`, `AgentResultCard`, `DiffViewer`, and the existing `MessageComposer` and `HistoryDrawer`.

The reusable settings patterns accept values and callbacks from their host. The settings screens currently keep temporary preview state and forward action requests to the host; they do not persist settings. No fleet controls, email tests, submission, data deletion, or AI actions are executed by the library. Persisting settings, credential storage, and API integration remain host responsibilities. The range control supports touch and accessibility increment/decrement; the host should validate values before saving.

## App footer

`AppFooter` provides the standard five-item mobile navigation and uses a cog for Settings. Pass `selectedId` and `onSelect` from the host navigator. Pass `items` when destinations or icons need to be customized. It reuses `BottomNavigation`, including its bottom safe-area handling, and follows the active theme. The host controls where the footer is placed on screen.

## Project structure and screens

- `src/components/core/`: reusable controls such as icons, icon actions, badges, chips, buttons, and tooltips.
- `src/components/patterns/`: higher-level reusable components composed from core controls.
- `src/screens/`: screen layouts; `MyResumesScreen` and `TemplatesExplorerScreen` share `LibraryScreenShell`.
- `src/theme/`: theme provider and tokens. `src/index.ts` exports the public API.

The core refactor preserves the package-level exports and `src/components/common` compatibility exports. Other former direct paths under `src/components/` moved to `src/components/patterns/`; import from `src/index.ts` rather than internal paths.

`MyResumesScreen` takes `resumes`, `templateCount`, `filters`, `createOptions`, and action callbacks. Each resume supplies `filterIds` for its lifecycle filters. `TemplatesExplorerScreen` takes `templates`, `resumeCount`, `filters`, and action callbacks. Each template supplies `categoryIds`, available `actions`, and optional `searchableTerms` and `canBookmark`. The screens filter their supplied data locally, calculate filter counts from that data, show empty results, and call `onViewChange` and `onNavigate` to ask the host navigator to change screens. Search and filtering do not make API requests. Pass actual totals and lifecycle/category mappings from the host; the two designs show example counts that should not be treated as live data.

Wrap the host in `SafeAreaProvider` and `JobBuddyThemeProvider`. The host owns navigation outside the two library screens, data loading, editor, upload, preview, creation, duplication, and other side effects. No action performs an API request automatically. An Expo Go preview entry point is provided in `App.tsx`; native project setup is still required for custom native builds.

## Navigation

`AppRouter` mounts a React Navigation container with a shared bottom tab navigator. The footer remains mounted while Resumes, Pipeline, Chat and Settings switch without page animations, and visited sections retain their state. `ResumeLibraryScreen` keeps the resume view mounted while the Templates icon opens a bottom sheet. Close the sheet with its close button, backdrop, or system back button; the search and filters retain their state during the session. The footer's Resumes item selects the resume view. Dashboard and any destination without a supplied screen are forwarded to the required `onNavigateOutside` callback.

```tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppRouter, JobBuddyThemeProvider, ToastHost } from './src';
import type { LibraryNavigatorProps } from './src';

// Construct these props in the host using application data and action handlers.
declare const libraryProps: LibraryNavigatorProps;

export function App() {
  return (
    <SafeAreaProvider>
      <JobBuddyThemeProvider mode="system">
        <AppRouter {...libraryProps} />
        <ToastHost />
      </JobBuddyThemeProvider>
    </SafeAreaProvider>
  );
}
```

`LibraryNavigatorProps` has `resumes` and `templates` objects containing the corresponding screen props, excluding counts and navigation callbacks (the router supplies those). `onNavigateOutside` handles all other footer destinations; `initialRouteName` can be `MyResumes` or `Templates` and selects the initial view within the shared library screen. For a host that already has a `NavigationContainer`, render `LibraryNavigator` inside the existing container instead of nesting `AppRouter`.

The packages `@react-navigation/native`, `@react-navigation/native-stack`, and `react-native-screens` are installed. For an Expo host, select native package versions compatible with its Expo SDK; for a native host complete [React Navigation's platform setup](https://reactnavigation.org/docs/getting-started/) and install iOS pods when applicable. Expo Go can preview the two screens. Custom native iOS and Android builds still need platform setup.

## API and backend

`src/api` contains an injectable `ApiClient` and typed `JobBuddyApi` adapters for resumes, templates, operator profile, and admin operations. The backend is in `backend/`: FastAPI serves those routes, PostgreSQL stores records and template metadata, S3-compatible object storage holds template source text (MinIO locally, AWS S3 through the same adapter), and Redis caches reads. Admin endpoints use bearer-token authentication and role-based permissions. When `EXPO_PUBLIC_API_URL` is set, the app starts with empty state and fetches live records; the backend does not seed mock data. Start the stack with `docker compose up --build`; see [backend/README.md](backend/README.md) for route details and initial admin configuration. The current backend is a development foundation without per-user data isolation. The API client uses `react-native-url-polyfill`, supports request cancellation and timeouts, and lets hosts inject headers and transport.

```ts
import { ApiClient, JobBuddyApi } from './src/api';

const api = new JobBuddyApi(new ApiClient({ baseUrl: apiBaseUrl, headers: getAuthHeaders }));
const resumes = await api.listResumes();
```

`src/utils` contains reusable search logic; screen-specific filter and routing rules stay close to their consumers.

## Tests

Each exported UI component has a dedicated test file under `tests/components` (the Chip test is colocated under `src/components/core/__tests__`). `tests/integration` exercises screen composition, search, filtering, callbacks, footer interaction, and the shared library header navigation. The editor pager is mocked in Jest. `tests/api` covers URL construction, JSON handling, error categories, cancellation, and timeouts. Jest uses the React Native preset and React Native Testing Library. Safe-area handling, PDF rendering and toast native boundaries are mocked; these tests do not establish device rendering, real network behavior, or navigation on a device. A native host and platform setup are still needed for device/end-to-end tests.

## Expo phone preview

Run `npm start`, then scan the QR code with Expo Go (Android) or the camera (iOS). Use the same Wi-Fi network as the development machine. The preview uses local example data from `src/mocks/`; bookmarks and duplicates only last for the current session, and unfinished actions display a message. It follows the phone's light/dark setting.

Expo Go cannot load the native PDF module, so the preview entry point imports only the implemented library screens and does not open PDF previews. To test `DocumentPreview`, create a custom development build with the PDF module configured.

## Resume editor

`ResumeEditorScreen` combines Code, Form, and Preview in one screen. `LibraryNavigator` accepts an optional `renderEditor` callback; when supplied, the resume action menu opens code, form, or preview mode for the selected resume. If omitted, the host's original card callbacks are retained. The host supplies source, structured form data, preview content, and save/compile/download callbacks.

The Expo Go demo stores separate code and form drafts in memory and shows an explicitly illustrative form-based preview. It does not convert forms to TeX, compile documents, save permanently, or display a compiled PDF. A native development build and an agreed API/TeX conversion contract are required for the real workflow.

## Pipeline and copilot screens

`PipelineScreen` renders host-supplied opportunities, search, and an `OpportunityDetailsSheet` with optional stage, event, resume, and payload information. `CopilotScreen` presents a centered composer for starting a conversation; `ConversationScreen` renders supplied messages, result actions and an optional read-only or actionable diff. The router's optional `renderPipeline`, `renderCopilot`, and `renderConversation` callbacks connect these screens to the persistent footer and session navigation. Editor and conversation detail views remain inside their respective tab stacks. Hosts provide data, action handlers and conversation behavior.

The Expo preview keeps conversations in memory only. The chat header opens session history in a bottom sheet; active conversations show that the assistant is not connected. It does not submit applications, send email, scrape websites, or call an assistant service. Those features require their future API contracts and real implementations.

## Settings preview

The Settings tab opens Agent Fleet Control, LaTeX Engine, Autonomous Dispatch, and Email Configuration. The screens reuse the settings patterns and central theme. Controls keep temporary local draft state while a detail screen remains mounted; leaving the screen discards the draft. Save, test and operational actions report that they are not connected. Credentials start empty, are masked, remain in component memory only, and are not submitted or persisted. The preview is not a backend contract; connect these controls to validated models, secure credential handling, and actual status data after the API design is ready.

## Dashboard and operator profile preview

The Home tab summarizes the supplied resumes, pipeline opportunities, and chat sessions, with bar, pie and donut status breakdowns, an average of valid recorded resume ATS scores, and a score comparison line chart in library order. The score line is not a historical trend. The charts use Expo-compatible react-native-svg. It updates when the host data changes and provides shortcuts to the library, pipeline, chat, and profile. The Expo preview labels its sample data; no service metrics or trends are inferred. Settings includes a category list, a system/light/dark theme selector, the profile and retention policy. The two supplied profile designs are combined into a single profile screen with an editable identity, summary, email and skill list. Profile changes and the theme selection are kept in memory for the preview session; example experience and projects are illustrative. Retention controls are local drafts, and operational actions are delegated to the host. The demo does not delete data, verify identities, export information, or connect services.

## Mock data and preview modes

Sample records live in `src/mocks/`, separated by the component or feature that consumes them: resume cards, template cards, pipeline opportunities, conversation messages, session rows, the editor, operator profile, agent fleet, LaTeX, dispatch, email, and retention settings. UI components receive data through props; the profile and fleet screens show empty states when no records are supplied. Reusable chart and dashboard components derive values from the data they receive. Static UI labels and available configuration choices remain with the UI; they are not mock account data.

`src/data/appData.ts` selects initial data at the application boundary. Development defaults to `demo`; non-development builds default to `empty`. Set `EXPO_PUBLIC_APP_DATA_MODE=demo` or `EXPO_PUBLIC_APP_DATA_MODE=empty` before starting Expo to select a mode explicitly, for example `EXPO_PUBLIC_APP_DATA_MODE=empty npm start`. Restart Metro after changing the variable. Supplied data always takes precedence, including intentionally empty arrays; mocks fill only missing fields in demo mode. Mock records are cloned for each initial state and are never sent to an API. Empty mode is an empty preview, not an API integration. Earlier `src/demo/*Data.ts` imports remain compatibility re-exports.

## Shared UI primitives

Resume, template, and pipeline search use the same `SearchBar`. The shared core `Card` provides the themed surface for resume, template and opportunity cards, settings sections, and analytics panels; domain cards retain their own content and actions. `FormField` supplies the common input behavior with editor and settings variants. The existing `EditorField` and `SettingsField` exports remain compatible wrappers. Templates, conversation history, opportunity details, and the TeX diff use the shared `BottomSheet`.

## Resume actions

The three-dot button opens a shared action menu for the selected resume. Open in editor opens Code, Edit opens Form, and View PDF opens Preview; Duplicate and Delete are delegated to the host. Delete requires confirmation in the menu. Without `EXPO_PUBLIC_API_URL`, the Expo preview deletes only the in-memory example and editor draft. With the API configured, resume metadata, source, and form data are stored by the backend; PDF compilation remains unconnected. Hosts can disable Edit or Delete by omitting their callbacks.
