import * as React from 'react';
import Head from 'next/head';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Header from './Header'
import Footer from './Footer'
import config from '../config'

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => createStyles({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
    paddingRight: 89
  },
}))

const Layout = ({ children }): JSX.Element => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <Head>
        <title>{config.APP_NAME}</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
        <meta
          name="description"
          content="欢迎来到四次元的世界"
        />
        <meta
          property="og:title"
          content="四次元之门"
        />
        <meta
          property="og:description"
          content="欢迎来到四次元的世界"
        />
        <meta
          property="og:type"
          content="website"
        />
        <meta
          property="og:site_name"
          content="四次元之门"
        />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </Head>
      <CssBaseline />
      <Header
        sections={config.NAVAGATIONS}
        title={config.APP_NAME}
        setOpen={setOpen}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <main
          style={{ padding: 15, paddingTop: 55, paddingBottom: 92, width: '100%', paddingRight: open ? 89 : 15 }}
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          {children}
        </main>
        <Footer />
      </div>
    </React.Fragment>
  )
}

export default Layout;
