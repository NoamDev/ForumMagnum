import React from 'react';
import { registerComponent } from '../../lib/vulcan-lib';

const styles = (theme: ThemeType) => ({
  root: {
    marginTop: theme.spacing.unit*3,
    marginBottom: theme.spacing.unit*3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    
    "& svg": {
      fill: "currentColor",
    },
  },
  divider: {
    height: 80,
    width: 80,
    marginLeft: theme.spacing.unit*3,
    marginRight: theme.spacing.unit*3,
    display: "inline-block",
    opacity: .5
  },
  compass: {
    height: 50,
    width: 50,
    display: "inline-block",
    opacity: .25
  }
})

const divider = <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enableBackground="new 0 0 100 100" xmlSpace="preserve"><g><g><polygon fill="none" points="6.256,50.245 10.108,51.512 10.727,50.274 9.255,48.746   "/><polygon fill="none" points="89.273,50.274 89.892,51.512 93.744,50.245 90.745,48.746   "/><path d="M11.396,49.969l-1.818-1.888c-0.105-0.109-0.269-0.138-0.405-0.07l-3.981,1.99c-0.126,0.063-0.201,0.195-0.191,0.336    c0.01,0.14,0.104,0.26,0.238,0.304l4.937,1.624c0.036,0.012,0.072,0.017,0.108,0.017c0.128,0,0.25-0.071,0.31-0.192l0.863-1.725    C11.522,50.233,11.498,50.075,11.396,49.969z M10.108,51.512l-3.852-1.267l2.999-1.499l1.472,1.528L10.108,51.512z"/><path d="M94.808,50.001l-3.981-1.99c-0.136-0.068-0.3-0.04-0.405,0.07l-1.818,1.888c-0.102,0.106-0.126,0.264-0.06,0.396    l0.863,1.725c0.06,0.12,0.182,0.192,0.31,0.192c0.036,0,0.072-0.005,0.108-0.017l4.937-1.624c0.133-0.044,0.227-0.164,0.238-0.304    C95.009,50.196,94.934,50.064,94.808,50.001z M89.892,51.512l-0.619-1.238l1.472-1.528l2.999,1.499L89.892,51.512z"/><path d="M87.916,50.231l1.543-2.1c0.113-0.154,0.08-0.371-0.074-0.485c-0.155-0.113-0.372-0.08-0.485,0.074l-1.611,2.193h-32.22    l-1.515-1.665c-0.129-0.142-0.348-0.152-0.49-0.023c-0.142,0.129-0.152,0.348-0.023,0.49l1.366,1.502    c-0.6,0.598-1.205,1.194-1.311,1.285c-0.137,0.097-0.187,0.283-0.109,0.438c0.061,0.121,0.183,0.191,0.31,0.191    c0.052,0,0.105-0.012,0.155-0.037c0.06-0.03,0.116-0.06,1.545-1.488h32.334l0.965,1.644c0.065,0.11,0.181,0.171,0.299,0.171    c0.06,0,0.12-0.015,0.175-0.048c0.165-0.097,0.22-0.31,0.123-0.475L87.916,50.231z"/><path d="M48.835,48.225c-0.141-0.129-0.361-0.118-0.49,0.023l-1.589,1.746c-0.125,0.137-0.12,0.348,0.011,0.479    c1.564,1.564,1.617,1.59,1.679,1.621c0.05,0.025,0.103,0.037,0.155,0.037c0.127,0,0.25-0.07,0.31-0.191    c0.078-0.155,0.028-0.34-0.109-0.438c-0.106-0.091-0.711-0.688-1.311-1.285l1.366-1.502    C48.987,48.574,48.977,48.354,48.835,48.225z"/><path d="M53.244,49.995l-1.589-1.746c-0.129-0.142-0.348-0.152-0.49-0.023c-0.142,0.129-0.152,0.348-0.023,0.49l1.366,1.502    c-0.6,0.598-1.205,1.194-1.311,1.285c-0.137,0.098-0.187,0.283-0.109,0.438c0.061,0.121,0.183,0.191,0.31,0.191    c0.052,0,0.105-0.012,0.155-0.037c0.062-0.031,0.115-0.058,1.679-1.621C53.363,50.343,53.368,50.132,53.244,49.995z"/><path d="M45.593,50.217l1.366-1.502c0.129-0.142,0.119-0.361-0.023-0.49c-0.142-0.129-0.361-0.118-0.49,0.023l-1.515,1.665h-32.22    L11.1,47.72c-0.113-0.154-0.33-0.188-0.485-0.074c-0.154,0.113-0.188,0.331-0.074,0.485l1.543,2.1l-0.98,1.668    c-0.097,0.165-0.042,0.378,0.124,0.475c0.055,0.032,0.116,0.048,0.175,0.048c0.119,0,0.235-0.061,0.299-0.171l0.965-1.644h32.334    c1.429,1.427,1.485,1.458,1.545,1.488c0.05,0.025,0.103,0.037,0.155,0.037c0.127,0,0.25-0.07,0.31-0.191    c0.078-0.155,0.028-0.341-0.109-0.438C46.798,51.411,46.192,50.815,45.593,50.217z"/></g></g></svg>

const compass = <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enableBackground="new 0 0 100 100" xmlSpace="preserve"><path d="M69.948,30.052l-13.739,7.632L50,4.574l-6.208,33.111l-13.74-7.633l7.633,13.739L4.574,50l33.111,6.208l-7.632,13.739  l13.739-7.633L50,95.426l6.208-33.112l13.74,7.634l-7.634-13.74L95.426,50l-33.111-6.208L69.948,30.052z M64.8,35.2l-4.558,8.203  l-3.07-0.576l-0.576-3.07L64.8,35.2z M35.2,35.2l8.203,4.557l-0.576,3.07l-3.07,0.576L35.2,35.2z M35.2,64.8l4.557-8.203l3.07,0.576  l0.576,3.07L35.2,64.8z M64.8,64.8l-8.203-4.557l0.576-3.07l3.07-0.576L64.8,64.8z M55.459,55.459L50,50v34.574l-5.459-29.115L50,50  H15.426l29.115-5.459L50,50V15.426l5.459,29.115L50,50h34.574L55.459,55.459z"/></svg>

const Divider = ({ classes, wings=true }: {
  classes: ClassesType,
  wings?: boolean
}) => {
  return <div className={classes.root}>
    {wings && <div className={classes.divider}>
      { divider }
    </div>}
    <div className={classes.compass}>
      { compass }
    </div>
    {wings && <div className={classes.divider}>
      { divider }
    </div>}
  </div>
}
const DividerComponent = registerComponent('Divider', Divider, {styles});

declare global {
  interface ComponentTypes {
    Divider: typeof DividerComponent
  }
}
