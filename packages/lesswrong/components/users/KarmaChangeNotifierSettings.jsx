import { registerComponent } from 'meteor/vulcan:core';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import withTimezone from '../common/withTimezone';
import moment from 'moment-timezone';
import { convertTimeOfWeekTimezone } from '../../lib/modules/utils/timeUtil.js';

const styles = theme => ({
  root: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  radioGroup: {
    marginTop: 4,
    paddingLeft: 24,
  },
  radioButton: {
    padding: 4,
  },
  inline: {
    display: "inline",
  },
  checkbox: {
    paddingRight: 4,
  },
  showNegative: {
    paddingLeft: 2,
  },
});

export const karmaNotificationTimingChoices = {
  disabled: {
    label: "Disabled",
    infoText: "Karma changes are disabled",
    emptyText: "Karma changes are disabled"
  },
  daily: {
    label: "Batched daily (default)",
    infoText: "Karma Changes (batched daily):",
    emptyText: "No karma changes yesterday"
  },
  weekly: {
    label: "Batched weekly",
    infoText: "Karma Changes (batched weekly):",
    emptyText: "No karma changes last week"
  },
  realtime: {
    label: "Realtime",
    infoText: "Recent Karma Changes",
    emptyText: "No karma changes since you last checked"
  },
};

class KarmaChangeNotifierSettings extends PureComponent {
  modifyValue = (changes) => {
    const oldSettings = this.props.value || {}
    const settings = { ...oldSettings, ...changes };
    this.context.updateCurrentValues({
      [this.props.path]: settings
    });
  }
  
  setBatchingTimeOfDay = (timeOfDay, tz) => {
    const oldTimeLocalTZ = this.getBatchingTimeLocalTZ();
    const newTimeLocalTZ = {
      timeOfDay: timeOfDay,
      dayOfWeek: oldTimeLocalTZ.dayOfWeek
    };
    const newTimeGMT = convertTimeOfWeekTimezone(newTimeLocalTZ.timeOfDay, newTimeLocalTZ.dayOfWeek, tz, "GMT");
    
    this.modifyValue({
      timeOfDayGMT: newTimeGMT.timeOfDay,
      dayOfWeekGMT: newTimeGMT.dayOfWeek,
    });
  }
  
  setBatchingDayOfWeek = (dayOfWeek, tz) => {
    const oldTimeLocalTZ = this.getBatchingTimeLocalTZ();
    const newTimeLocalTZ = {
      timeOfDay: oldTimeLocalTZ.timeOfDay,
      dayOfWeek: dayOfWeek
    };
    const newTimeGMT = convertTimeOfWeekTimezone(newTimeLocalTZ.timeOfDay, newTimeLocalTZ.dayOfWeek, tz, "GMT");
    
    this.modifyValue({
      timeOfDayGMT: newTimeGMT.timeOfDay,
      dayOfWeekGMT: newTimeGMT.dayOfWeek,
    });
  }
  
  getBatchingTimeLocalTZ = () => {
    const settings = this.props.value || {}
    const { timeOfDayGMT, dayOfWeekGMT } = settings;
    const { timeOfDay, dayOfWeek } = convertTimeOfWeekTimezone(timeOfDayGMT, dayOfWeekGMT, "GMT", this.props.timezone);
    return { timeOfDay, dayOfWeek };
  }
  
  render() {
    const { timezone, classes } = this.props;
    const settings = this.props.value || {}
    
    const {timeOfDay, dayOfWeek} = this.getBatchingTimeLocalTZ();
    
    const batchTimingChoices = <span>
      { (settings.updateFrequency==="daily" || settings.updateFrequency==="weekly") &&
        <React.Fragment>
          {" at "}<Select
            value={timeOfDay}
            onChange={(event) => this.setBatchingTimeOfDay(event.target.value, timezone)}
          >
            { _.range(24).map(hour =>
                <MenuItem key={hour} value={hour}>{hour}:00</MenuItem>
              )
            }
          </Select>
          
          {moment().tz(timezone).format("z")}
          
          { settings.updateFrequency==="weekly" && <React.Fragment>
              {" on "}<Select value={dayOfWeek}
                onChange={(event) => this.setBatchingDayOfWeek(event.target.value, timezone)}
              >
                <MenuItem value="Sunday">Sunday</MenuItem>
                <MenuItem value="Monday">Monday</MenuItem>
                <MenuItem value="Tuesday">Tuesday</MenuItem>
                <MenuItem value="Wednesday">Wednesday</MenuItem>
                <MenuItem value="Thursday">Thursday</MenuItem>
                <MenuItem value="Friday">Friday</MenuItem>
                <MenuItem value="Saturday">Saturday</MenuItem>
              </Select>
            </React.Fragment>
          }
        </React.Fragment>
      }
    </span>
    
    return <div className={classes.root}>
      <Typography variant="body1">
        Vote Notifications
      </Typography>
      <Typography variant="body2">
        Shows upvotes and downvotes to your posts and comments on top of the
        page. By default, this is on but only updates once per day, to avoid
        creating a distracting temptation to frequently recheck it. Can be
        set to real time (removing the batching), disabled (to remove it
        from the header entirely), or to some other update interval.
      </Typography>
      <RadioGroup className={classes.radioGroup}
        value={settings.updateFrequency}
        onChange={(event, newValue) => this.modifyValue({updateFrequency: newValue})}
      >
        {_.map(karmaNotificationTimingChoices, (timingChoice, key) =>
          <FormControlLabel
            key={key}
            value={key}
            control={<Radio className={classes.radioButton} />}
            label={
              <Typography className={classes.inline} variant="body2" component="span">
                {timingChoice.label}
                {(settings.updateFrequency === key) ? batchTimingChoices : null}
              </Typography>
            }
            classes={{
              label: null,
            }}
          />
        )}
      </RadioGroup>
      
      { (settings.updateFrequency==="realtime") && <span>
        Warning: Immediate karma updates may lead to over-updating on tiny amounts
        of feedback, and to checking the site frequently when you'd rather be
        doing something else.
      </span> }
      {
        <div className={classes.showNegative}>
          <Checkbox
            classes={{root: classes.checkbox}}
            checked={settings.showNegativeKarma}
            onChange={(event, checked) => this.modifyValue({showNegativeKarma: checked})}
          />
          <Typography variant="body2" className={classes.inline} component="label">
            Show negative karma notifications
          </Typography>
        </div>
      }
    </div>
  }
}

KarmaChangeNotifierSettings.contextTypes = {
  updateCurrentValues: PropTypes.func,
};

registerComponent("KarmaChangeNotifierSettings", KarmaChangeNotifierSettings,
  withStyles(styles, {name: "KarmaChangeNotifierSettings"}),
  withTimezone);