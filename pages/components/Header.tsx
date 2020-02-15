import React, { useState, useEffect, MouseEvent } from 'react';
import PropTypes from 'prop-types';
import { Color } from '@material-ui/lab/Alert';
import { makeStyles, createStyles, Theme, useTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { AppBar } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { isAuth, signOut } from '../utils/auth';
import Notify from './Notify';
import { curry } from 'ramda';
import { Section, ROLE } from '../interfaces';
import DropDownMenu from './DropDownMenu';
import Progress from './Nprogress';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => createStyles({
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    })
  },
  appBarShift: {
    width: 'calc(100% - 89px)',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 89,
  },
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbarSecondary: {
    display: 'flex',
    justifyContent: 'space-between',
    overflowX: 'auto',
    paddingTop: 5,
  },
  hide: {
    opacity: 0,
    visibility: 'hidden'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
}));

const onLogOut = curry((setter: Function, event: MouseEvent<HTMLElement>): void => {
  signOut((message: string, type: string) => {
    setter({ message, type, isOpen: true })
  })
})

const renderPc = (sections: Section[], setNotifyConfig: Function): JSX.Element => {
  const logOutHandler = onLogOut(setNotifyConfig)
  const Authed = isAuth()
  return (
    <React.Fragment>
      {sections.map((section: Section) => (
        <Link
          color="inherit"
          noWrap
          key={section.title}
          variant="body2"
          href={section.url}
          style={{
            padding: 1,
            flexShrink: 0,
            fontSize: 16,
            fontWeight: 'bold',
            flex: 1
          }}
        >
          {section.title}
        </Link>
      ))}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <IconButton style={{ flex: 1, color: '#DDD', height: '50%' }}>
          <SearchIcon />
        </IconButton>
        {
          Authed ? (
            <Button
              onClick={logOutHandler}
              style={{
                flex: 1, margin: '0 5px', color: '#EEE', height: '50%'
              }}
              variant="outlined"
              size="small"
            >
              注销
            </Button>
          ) : (
              <React.Fragment>
                <Button
                  onClick={() => window.location.href = '/auth/user/signin'}
                  style={{ flex: 1, margin: '0 5px', color: '#EEE', height: '50%' }} variant="outlined" size="small">
                  登录
                </Button>
                <Button
                  onClick={() => window.location.href = '/auth/user/signup'}
                  style={{ flex: 1, margin: '0 5px', color: '#EEE', height: '50%' }} variant="outlined" size="small">
                  注册
                </Button>
              </React.Fragment>
            )
        }
        {
          Authed && (typeof Authed === 'object') ? (
            <DropDownMenu
              name={Authed.name}
              menus={[{
                name: '个人中心',
                onClick: () => window.location.href = Authed.role === ROLE.ADMIN ? '/dashboard/admin' : '/dashboard/user'
              }]}
            />
          ) : null
        }
      </div>
    </React.Fragment>
  )
}

export default function Header(props: { sections: Section[], title: string, setOpen: Function }) {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    window.onload = () => {
      setIsLoading(false)
    }
    const tid = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false)
      } else {
        clearTimeout(tid)
      }
    }, 1000)
  }, [])

  const classes = useStyles();
  const theme = useTheme();
  const { sections, setOpen, title } = props;
  const [open, stOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(true)
  const handleDrawerOpen = () => {
    stOpen(true)
    setOpen(true)
  }
  const handleDrawerClose = () => {
    stOpen(false)
    setOpen(false)
  }
  const syncIsMobile = (): void => {
    const width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    setIsMobile(width <= 640)
  }

  useEffect(syncIsMobile)

  useEffect((): () => void => {
    window.addEventListener('resize', syncIsMobile)
    return () => {
      window.removeEventListener('resize', syncIsMobile)
    }
  }, [])

  const [notifyConfig, setNotifyConfig] = useState({
    type: 'success',
    message: '',
    isOpen: false
  })
  const { type, message, isOpen } = notifyConfig
  const logOutHandler = onLogOut(setNotifyConfig)
  return (
    <React.Fragment>
      <Progress isAnimating={isLoading} />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar component="nav" variant="dense" className={classes.toolbarSecondary}>
          <Typography
            component="h2"
            variant="h5"
            color="inherit"
            align="center"
            noWrap
            style={{ flex: 1, fontWeight: 'bold', cursor: 'pointer' }}
            onClick={() => window.location.href = '/'}
          >
            {title}
          </Typography>
          {
            isMobile ?
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerOpen}
                className={clsx(open && classes.hide)}
                style={{ flex: 1 }}
              >
                <MenuIcon />
              </IconButton>
              : null
          }
          {
            isMobile ? null : renderPc(sections, setNotifyConfig)
          }
          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="right"
            open={open}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.drawerHeader}>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            </div>
            <Divider />
            <List>
              {sections.map(({ title }, index) => (
                <ListItem button key={title}><ListItemText primary={title} /></ListItem>
              ))}
            </List>
            <Divider />
            <List>
              <ListItem button>
                <ListItemIcon><IconButton><SearchIcon /></IconButton></ListItemIcon>
              </ListItem>
              {
                isAuth() ? (
                  <ListItem button onClick={logOutHandler}>
                    <ListItemText primary='注销' />
                  </ListItem>
                ) : (
                    <React.Fragment>
                      <ListItem button onClick={() => window.location.href = '/auth/user/signin'}>
                        <ListItemText primary='登录' />
                      </ListItem>
                      <ListItem button onClick={() => window.location.href = '/auth/user/signup'}>
                        <ListItemText primary='注册' />
                      </ListItem>
                    </React.Fragment>
                  )
              }
            </List>
          </Drawer>
        </Toolbar>
      </AppBar>
      <Notify
        type={type as Color}
        message={message}
        isOpen={isOpen}
        onClose={() => setNotifyConfig({ ...notifyConfig, isOpen: false })}
      />
    </React.Fragment>
  );
}

Header.propTypes = {
  sections: PropTypes.array,
  title: PropTypes.string,
  setOpen: PropTypes.func
};
