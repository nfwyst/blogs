import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, Theme, useTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import config from '../config'

function Copyright(): JSX.Element {
  return (
    <Typography variant="body2" color="textSecondary">
      {'Copyright © '}
      <a color="inherit" href="/" style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.54)' }}>
        {config.APP_NAME}
      </a>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor:
      theme.palette.type === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
  },
}));

export default function StickyFooter(): JSX.Element {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <footer
      className={classes.footer}
      style={{
        padding: theme.spacing(3, 2),
        marginTop: 'auto',
        backgroundColor:
          theme.palette.type === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body1">something can be found here.</Typography>
        <Copyright />
      </Container>
    </footer>
  );
}
