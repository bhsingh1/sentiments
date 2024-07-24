import { NotFound } from '@app/components/NotFound/NotFound';
import { OriginalApp } from '@app/components/OriginalApp/OriginalApp';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';
import * as React from 'react';
import { Redirect, Route, RouteComponentProps, Switch, useLocation } from 'react-router-dom';
import { ClaimDetail } from './components/ClaimDetail/ClaimDetail';
import { ClaimsList } from './components/ClaimsList/ClaimsList';
import { Empty } from './components/Empty/Empty';
import { Dashboard } from './components/Dashboard/Dashboard';

let routeFocusTimer: number;
export interface IAppRoute {
  label?: string; // Excluding the label will exclude the route from the nav sidebar in AppLayout
  /* eslint-disable @typescript-eslint/no-explicit-any */
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  exact?: boolean;
  path: string;
  title: string;
  routes?: undefined;
  bottomRoutes?: undefined;
  disabled?: boolean;
}

export interface IAppRouteGroup {
  label: string;
  routes: IAppRoute[];
}

export type AppRouteConfig = IAppRoute | IAppRouteGroup;

const routes: AppRouteConfig[] = [
  {
    component: () => <Redirect to="/Dashboard" />,
    exact: true,
    path: '/',
    title: 'Redirect',
  },
  {
    component: Dashboard,
    label: 'Dashboard',
    path: '/Dashboard',
    title: 'Dashboard'
  },
  {
    component: Empty,
    label: 'Policies',
    path: '#',
    title: 'Policies'
  },
  {
    component: ClaimsList,
    exact: true,
    label: 'Feedback',
    path: '/ClaimsList',
    title: 'Feedback Mining',
  },
  {
    component: ClaimDetail,
    exact: true,
    path: '/ClaimDetail/:claim_id',
    title: 'Claim Detail',
  },
  {
    component: Empty,
    label: 'Categories',
    path: '#',
    title: 'Coverages'
  },
  {
    component: Empty,
    label: 'Payments',
    path: '#',
    title: 'Annuities'
  },
  {
    component: Empty,
    label: 'Loyalty Program',
    path: '#',
    title: 'Subscriptions'
  },
  {
    component: Empty,
    label: 'Reports',
    path: '#',
    title: 'Reports'
  },
  {
    component: Empty,
    label: 'Admin',
    path: '#',
    title: 'Admin'
  },
  {
    component: Empty,
    label: 'Settings',
    path: '#',
    title: 'Settings'
  },
  //{
  // component: OriginalApp,
    //exact: true,
   // label: 'Original App',
   // path: '/OriginalApp',
   // title: 'Original App',
 // },
];


// a custom hook for sending focus to the primary content container
// after a view has loaded so that subsequent press of tab key
// sends focus directly to relevant content
// may not be necessary if https://github.com/ReactTraining/react-router/issues/5210 is resolved
const useA11yRouteChange = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    routeFocusTimer = window.setTimeout(() => {
      const mainContainer = document.getElementById('primary-app-container');
      if (mainContainer) {
        mainContainer.focus();
      }
    }, 50);
    return () => {
      window.clearTimeout(routeFocusTimer);
    };
  }, [pathname]);
};

const RouteWithTitleUpdates = ({ component: Component, title, ...rest }: IAppRoute) => {
  useA11yRouteChange();
  useDocumentTitle(title);

  function routeWithTitle(routeProps: RouteComponentProps) {
    return <Component {...rest} {...routeProps} />;
  }

  return <Route render={routeWithTitle} {...rest} />;
};

const PageNotFound = ({ title }: { title: string }) => {
  useDocumentTitle(title);
  return <Route component={NotFound} />;
};

const flattenedRoutes: IAppRoute[] = routes.reduce(
  (flattened, route) => [...flattened, ...(route.routes ? route.routes : [route])],
  [] as IAppRoute[]
);

const AppRoutes = (): React.ReactElement => (
  <Switch>
    {flattenedRoutes.map(({ path, exact, component, title }, idx) => (
      <RouteWithTitleUpdates path={path} exact={exact} component={component} key={idx} title={title} />
    ))}
    <PageNotFound title="404 Page Not Found" />
  </Switch>
);

export { AppRoutes, routes };
