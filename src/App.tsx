import { Authenticated, GitHubBanner, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import {
  AuthPage,
  ErrorComponent,
  notificationProvider,
  ThemedLayoutV2,
  ThemedSiderV2,
  ThemedTitleV2,
  Title,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import { dataProvider, liveProvider } from "@refinedev/appwrite";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { useTranslation } from "react-i18next";
import { HashRouter, Outlet, Route, Routes } from "react-router-dom";
import { authProvider } from "./authProvider";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import {
  BlogPostShow,
  ExperimentEdit,
  ExperimentList,
} from "./pages/experiments";
import {
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  CategoryShow,
} from "./pages/categories";
import { EXPERIMENT_COLLECTION, appwriteClient } from "./utility";
import { AppIcon } from "./components/app-icon";
import { Dashboard } from "./pages/dashboard";
import { DashboardOutlined } from "@ant-design/icons";
import { ExperimentMaster } from "./pages/experiments/create";
import { StartExperiment } from "./pages/participant-view/startExperiment";
import { title } from "process";
function App() {
  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  const icon = <AppIcon />

  return (
    <HashRouter>
      {/* <GitHubBanner /> */}
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <Refine
            dataProvider={dataProvider(appwriteClient, {
              databaseId: "64ff0be402cc2e4ad05a",
            })}
            liveProvider={liveProvider(appwriteClient, {
              databaseId: "64ff0be402cc2e4ad05a",
            })}
            authProvider={authProvider}
            notificationProvider={notificationProvider}
            routerProvider={routerBindings}
            i18nProvider={i18nProvider}
            resources={[

              {
                name: EXPERIMENT_COLLECTION,
                list: "/experiments",
                create: "/experiments/create",
                edit: "/experiments/edit/:id",
                show: "/experiments/show/:id",
                meta: {
                  canDelete: true,
                  label: 'Experiments'
                },
              },

            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
          >
            <Routes>
              <Route
                element={
                  <Authenticated fallback={<CatchAllNavigate to="/login" />}>
                    <ThemedLayoutV2
                      Title={({ collapsed }) => (
                        <ThemedTitleV2
                          // collapsed is a boolean value that indicates whether the <Sidebar> is collapsed or not
                          collapsed={collapsed}
                          icon={collapsed ? <AppIcon /> : <AppIcon />}
                          text=""
                        />
                      )}
                      Header={() => <Header sticky />}
                      Sider={(props) => <ThemedSiderV2 {...props} fixed />}
                    >
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route
                  index
                  element={<NavigateToResource resource={EXPERIMENT_COLLECTION} />}
                />
                <Route path="/dashboard">
                  <Route index element={<Dashboard />} />
                </Route>
                <Route path="/experiments">
                  <Route index element={<ExperimentList />} />
                  <Route path="create" element={<ExperimentMaster />} />
                  <Route path="edit/:id" element={<ExperimentEdit />} />
                  <Route path="show/:id" element={<BlogPostShow />} />
                </Route>
                {/* <Route path="/posts">
                  <Route index element={<PostList />} />
                  <Route path="create" element={<PostCreate />} />
                  <Route path="edit/:id" element={<PostEdit />} />
                  <Route path="show/:id" element={<PostShow />} />
                </Route> */}
                <Route path="/categories">
                  <Route index element={<CategoryList />} />
                  <Route path="create" element={<CategoryCreate />} />
                  <Route path="edit/:id" element={<CategoryEdit />} />
                  <Route path="show/:id" element={<CategoryShow />} />
                </Route>
                <Route path="*" element={<ErrorComponent />} />
              </Route>
              <Route
                element={
                  <Authenticated fallback={<Outlet />}>
                    <NavigateToResource />
                  </Authenticated>
                }
              >
                <Route
                  path="/login"
                  element={
                    <AuthPage
                      type="login"
                      title={<AppIcon />}
                      formProps={{
                        initialValues: {
                          email: "demo@refine.dev",
                          password: "demodemo",
                        },
                      }}
                    />
                  }
                />
                <Route
                  path="/register"
                  element={<AuthPage title={<AppIcon />} type="register" />}
                />
                <Route
                  path="/forgot-password"
                  element={<AuthPage title={<AppIcon />} type="forgotPassword" />}
                />
              </Route>
              <Route
                path="/start-experiment/:prolificId/:studyId"
                element={<StartExperiment />}
              />
            </Routes>

            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </HashRouter >
  );
}

export default App;
