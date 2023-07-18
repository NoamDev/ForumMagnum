import React, { useState } from 'react';
import { registerComponent } from '../../lib/vulcan-lib';
import { useUpdateCurrentUser } from '../hooks/useUpdateCurrentUser';
import { useCurrentUser } from '../common/withUser';
import { userIsMemberOf } from '../../lib/vulcan-users/permissions';
import classNames from 'classnames';

const styles = (theme: ThemeType): JssStyles => ({
  toggle: {
    position: 'fixed',
    left: 20,
    bottom: 20,
    display: 'flex',
    alignItems: 'center',
    height: 40,
    width: 128,
    backgroundColor: theme.palette.buttons.alwaysPrimary,
    color: theme.palette.text.alwaysWhite,
    fontSize: 14,
    fontFamily: theme.typography.fontFamily,
    fontWeight: 600,
    padding: '6px 18px',
    borderRadius: 20,
    boxShadow: theme.palette.boxShadow.eaCard,
    cursor: 'pointer',
    zIndex: theme.zIndexes.intercomButton,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  toggleOff: {
    backgroundColor: theme.palette.grey[400],
    '&:hover': {
      backgroundColor: theme.palette.grey[500],
    }
  },
  toggleDisabled: {
    cursor: 'default',
  },
  onText: {
    textAlign: 'left',
  },
  offText: {
    flexGrow: 1,
    textAlign: 'right',
  },
  toggleDot: {
    position: 'absolute',
    left: 92,
    height: 30,
    width: 30,
    backgroundColor: theme.palette.text.alwaysWhite,
    borderRadius: '50%',
    transition: 'left .2s ease',
  },
  toggleDotOff: {
    left: 6
  }
});

export const AdminToggle = ({classes}: {
  classes: ClassesType,
}) => {
  const currentUser = useCurrentUser()
  const updateCurrentUser = useUpdateCurrentUser()
  const [disabled, setDisabled] = useState(false)
  
  if (!currentUser) return null
  
  const handleToggleOn = async () => {
    setDisabled(true)
    await updateCurrentUser({
      isAdmin: true,
      groups: [...currentUser.groups, "sunshineRegiment"],
    })
    window.location.reload()
  }
 
  const handleToggleOff = async () => {
    setDisabled(true)
    // If not a member of the realAdmins group, add that group
    // before giving up admin powers so that we'll be able to take
    // the admin powers back
    let groups = currentUser.groups;
    if (!groups.some(g => g === "realAdmins")) {
      groups = [...currentUser.groups, "realAdmins"]
      await updateCurrentUser({ groups })
    }
    await updateCurrentUser({
      isAdmin: false,
      groups: groups.filter(g => g !== "sunshineRegiment"),
    })
    window.location.reload()
  }

  if (currentUser.isAdmin) {
    return <div
      className={classNames(classes.toggle, {[classes.toggleDisabled]: disabled})}
      onClick={disabled ? undefined : handleToggleOff}
    >
      <div className={classes.onText}>Admin on</div>
      <div className={classes.toggleDot}></div>
    </div>
  } else if (!currentUser.isAdmin && userIsMemberOf(currentUser, "realAdmins")) {
    return <div
      className={classNames(classes.toggle, classes.toggleOff, {[classes.toggleDisabled]: disabled})}
      onClick={disabled ? undefined : handleToggleOn}
    >
      <div className={classes.offText}>Admin off</div>
      <div className={classNames(classes.toggleDot, classes.toggleDotOff)}></div>
    </div>
  }
  
  return null
}

const AdminToggleComponent = registerComponent('AdminToggle', AdminToggle, {styles});

declare global {
  interface ComponentTypes {
    AdminToggle: typeof AdminToggleComponent
  }
}

