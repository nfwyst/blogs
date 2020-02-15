import React from 'react';
import { createStyles, Theme, makeStyles, useTheme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { ListItem as ListItemType } from '../interfaces';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  }),
);

function ListItemLink(props: ListItemProps<'a', { button?: true }>) {
  return <ListItem button component="a" {...props} />;
}

export default function ProfileList(props: { lists: ListItemType[] }) {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <div className={classes.root} style={{
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    }}>
      <List component="nav" aria-label="secondary mailbox folders">
        {
          props.lists.map((item: ListItemType) => {
            return (
              <ListItem button key={item.title} onClick={item.onClick}>
                <ListItemText primary={item.title} />
              </ListItem>
            )
          })
        }
      </List>
    </div>
  );
}
