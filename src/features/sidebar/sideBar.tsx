import React from 'react';
import {withRouter} from 'react-router-dom'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import{ 
  Drawer,
  Divider,
  Toolbar, 
  List,  
  ListItem, 
  ListItemText, 
  ListItemIcon 
} from '@material-ui/core';
import MailIcon from '@material-ui/icons/Mail';
import InboxIcon from '@material-ui/icons/MoveToInbox';

const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    toolbar: theme.mixins.toolbar,
  }),
);

const  SideBar:React.FC<any> = ({history}) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          {['Dashboard', 'Login', 'SignUp', 'Users', 'Error'].map((text, index) => (
            <ListItem button key={text} onClick={() => history.push(text)}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>      
    </div>
  );
}

export default withRouter(SideBar);