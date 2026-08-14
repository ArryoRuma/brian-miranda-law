/* Quiet Authority: the app intentionally stays light-themed so the editorial paper-and-ink system remains consistent across the public-facing experience. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useParams } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ChecklistPage from "./pages/site/ChecklistPage";
import ContactPage from "./pages/site/ContactPage";
import { EditorialPage } from "./pages/site/EditorialPage";
import FaqResourcePage from "./pages/site/FaqResourcePage";
import LegalPage from "./pages/site/LegalPage";
import NextStepsPage from "./pages/site/NextStepsPage";
import {
  ABOUT_PAGE,
  ESTATE_PLANNING_PAGE,
  OTHER_SERVICES_PAGE,
  RESOURCES_PAGE,
  SERVICE_PAGES,
} from "./pages/site/pageContent";
import QuestionnairePage from "./pages/site/QuestionnairePage";
import VideoLibraryPage from "./pages/site/VideoLibraryPage";

function ServiceRoute() {
  const params = useParams<{ service?: string }>();
  const content = params.service ? SERVICE_PAGES[params.service] : undefined;

  return content ? <EditorialPage content={content} /> : <NotFound />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/estate-planning">
        <EditorialPage content={ESTATE_PLANNING_PAGE} />
      </Route>
      <Route path="/estate-planning/:service" component={ServiceRoute} />
      <Route path="/about">
        <EditorialPage content={ABOUT_PAGE} />
      </Route>
      <Route path="/resources">
        <EditorialPage content={RESOURCES_PAGE} />
      </Route>
      <Route
        path="/resources/estate-planning-faqs"
        component={FaqResourcePage}
      />
      <Route
        path="/resources/estate-planning-checklist"
        component={ChecklistPage}
      />
      <Route path="/resources/video-blog" component={VideoLibraryPage} />
      <Route path="/other-services">
        <EditorialPage content={OTHER_SERVICES_PAGE} />
      </Route>
      <Route path="/contact" component={ContactPage} />
      <Route
        path="/start/:locale/what-happens-next"
        component={NextStepsPage}
      />
      <Route path="/start/:locale" component={QuestionnairePage} />
      <Route path="/privacy">
        <LegalPage page="privacy" />
      </Route>
      <Route path="/cookies">
        <LegalPage page="cookies" />
      </Route>
      <Route path="/disclaimer">
        <LegalPage page="disclaimer" />
      </Route>
      <Route path="/accessibility">
        <LegalPage page="accessibility" />
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
