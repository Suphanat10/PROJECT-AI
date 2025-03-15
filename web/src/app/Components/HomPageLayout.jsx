import * as React from 'react';
import { extendTheme, styled } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import Grid from '@mui/material/Grid2';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import AirIcon from '@mui/icons-material/Air';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { useState, useMemo } from 'react';
import SVR from '../page/SVR';
import NN from '../page/NN';
import Typography from '@mui/material/Typography';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import RepostSVR from '../page/RepostSVR';
import RepostNN from '../page/RepostNN';
import Reportgraph from '../page/Reportgraph';
import Home from '../page/Home';
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import SourceIcon from '@mui/icons-material/Source';

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Machine Learning demo',
  },
  {
    pathname: '/',
    title: 'Home',
    icon: <DeviceHubIcon />,
  },
  {
    segment: 'SVR',
    pathname: '/SVR',
    title: 'Support Vector Regression',
    icon: <TwoWheelerIcon />,
  },
  {
    segment: 'NN',
    pathname: '/NN',
    title: 'Neural Network',
    icon: <AirIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Analytics',
  },
  {
    segment: 'reports',
    title: 'Reports',
    icon: <SourceIcon />,
    children: [
      {
        segment: 'RepostSVR',
        pathname: '/reports/RepostSVR',
        title: 'Support Vector Regression',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'NNReport',
        pathname: '/reports/NNReport',
        title: 'Neural Network Report',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'graph',
    pathname: '/graph',
    title: 'Report graph',
    icon: <CandlestickChartIcon />,
  },
];

const demoTheme = extendTheme({
  palette: {
    primary: {
      main: '#7cb342',
    },
    secondary: {
      main: '#ff9800',
    },
    text: {
      primary: '#000000',
      secondary: '#7cb342',
    },
    background: {
      default: '#f4f4f4',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Kanit", sans-serif',
  },
});

function useDemoRouter(initialPath = '/') {
  const [pathname, setPathname] = useState(initialPath);
  const router = useMemo(
    () => ({
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    }),
    [pathname]
  );

  return router;
}

const Skeleton = styled('div')(({ theme, height = 50 }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
}));

export default function HomePageLayout(props) {
  const { window } = props;
  const router = useDemoRouter('/');
  const demoWindow = window ? window() : undefined;

  return (
    <AppProvider
      branding={{
        title: (
          <Typography variant="h5" sx={{ color: '#000000', fontWeight: 'bold' }}>
            Machine Learning
          </Typography>
        ),
        logo: <DeviceHubIcon sx={{ color: '#7cb342', fontSize: 38 }} />, 
      }}
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <PageContainer>
          {router.pathname === '/' && <Home />}
          {router.pathname === '/SVR' && <SVR />}
          {router.pathname === '/NN' && <NN />}
          {router.pathname === '/reports/RepostSVR' && <RepostNN />}
          {router.pathname === '/reports/NNReport' && <RepostSVR />}
          {router.pathname === '/graph' && <Reportgraph />}
          {!['/', '/SVR', '/NN', '/reports/RepostSVR', '/reports/NNReport', '/graph'].includes(router.pathname) && (
            <h1 style={{ textAlign: 'center' }}>404 Not Found</h1>
          )}
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
