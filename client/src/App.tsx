import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import DirectoryDetailPage from "./pages/DirectoryDetail";
import DirectoryExplorerPage from "@/pages/DirectoryExplorer";
import FeatureDetailPage from "@/pages/FeatureDetail";
import FeatureExplorerPage from "@/pages/FeatureExplorer";
import GeographyDetailPage from "@/pages/GeographyDetail";
import GeographyExplorerPage from "@/pages/GeographyExplorer";
import Home from "@/pages/Home";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/directories" component={DirectoryExplorerPage} />
      <Route path="/directories/:slug" component={DirectoryDetailPage} />
      <Route path="/features" component={FeatureExplorerPage} />
      <Route path="/features/:slug" component={FeatureDetailPage} />
      <Route path="/geography" component={GeographyExplorerPage} />
      <Route path="/geography/:level/:code" component={GeographyDetailPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router />
    </ErrorBoundary>
  );
}
