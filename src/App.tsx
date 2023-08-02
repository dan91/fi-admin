import { Authenticated, GitHubBanner, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  AuthPage,
  ErrorComponent,
  notificationProvider,
  ThemedLayoutV2,
  ThemedSiderV2,
  ThemedTitleV2,
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
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { authProvider } from "./authProvider";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import {
  BlogPostEdit,
  BlogPostList,
  BlogPostShow,
} from "./pages/experiments";
import {
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  CategoryShow,
} from "./pages/categories";
import { appwriteClient } from "./utility";
import { AppIcon } from "./components/app-icon";
import { Dashboard } from "./pages/dashboard";
import { DashboardOutlined } from "@ant-design/icons";
import { PostCreate, PostEdit, PostList, PostShow } from "./pages/posts";
import { ExperimentCreate } from "./pages/experiments/create";

function App() {
  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <BrowserRouter>
      {/* <GitHubBanner /> */}
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <Refine
            dataProvider={dataProvider(appwriteClient, {
              databaseId: "64b82f748ea7c86de6f4",
            })}
            liveProvider={liveProvider(appwriteClient, {
              databaseId: "64b82f748ea7c86de6f4",
            })}
            authProvider={authProvider}
            notificationProvider={notificationProvider}
            routerProvider={routerBindings}
            i18nProvider={i18nProvider}
            resources={[
              {
                name: 'dashboard',
                list: '/dashboard',
                meta: {
                  label: 'Dashboard',
                  icon: <DashboardOutlined />
                }
              },
              {
                name: "64b82f7b348727a801cb",
                list: "/experiments",
                create: "/experiments/create",
                edit: "/experiments/edit/:id",
                show: "/experiments/show/:id",
                meta: {
                  canDelete: true,
                  label: 'Experiments'
                },
              },
              {
                name: "64bfc5ca89fc8d8fbfa1",
                list: "/posts",
                create: "/posts/create",
                edit: "/posts/edit/:id",
                show: "/posts/show/:id",
                meta: {
                  canDelete: true,
                  label: 'Posts'
                },
              },
              {
                name: "64b83e127ef3657a5f53",
                list: "/categories",
                create: "/categories/create",
                edit: "/categories/edit/:id",
                show: "/categories/show/:id",
                meta: {
                  canDelete: true,
                  label: 'Likes'
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
                  element={<NavigateToResource resource="dashboard" />}
                />
                <Route path="/dashboard">
                  <Route index element={<Dashboard />} />
                  </Route>
                <Route path="/experiments">
                  <Route index element={<BlogPostList />} />
                  <Route path="create" element={<ExperimentCreate />} />
                  <Route path="edit/:id" element={<BlogPostEdit />} />
                  <Route path="show/:id" element={<BlogPostShow />} />
                </Route>
                <Route path="/posts">
                  <Route index element={<PostList />} />
                  <Route path="create" element={<PostCreate />} />
                  <Route path="edit/:id" element={<PostEdit />} />
                  <Route path="show/:id" element={<PostShow />} />
                </Route>
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
                  element={<AuthPage type="register" />}
                />
                <Route
                  path="/forgot-password"
                  element={<AuthPage type="forgotPassword" />}
                />
              </Route>
            </Routes>

            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
