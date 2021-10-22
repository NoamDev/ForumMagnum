import React from 'react';
import { registerComponent, Components } from '../../../lib/vulcan-lib/components';
import { AnalyticsContext } from "../../../lib/analyticsEvents";

const EventsList = ({currentUser, onClick}) => {
  const { TabNavigationEventsList } = Components

  const lat = currentUser?.mongoLocation?.coordinates[1]
  const lng = currentUser?.mongoLocation?.coordinates[0]

  let eventsListTerms: PostsViewTerms = {
    view: 'events',
    onlineEvent: false,
    limit: 1,
  }
  if (lat && lng) {
    eventsListTerms = {
      view: 'nearbyEvents',
      lat: lat,
      lng: lng,
      onlineEvent: false,
      limit: 1,
    }
  }
  const onlineTerms: PostsViewTerms = {
    view: 'onlineEvents',
    limit: 3
  }
  return <span>
    <AnalyticsContext pageSubSectionContext="menuEventsList">
      <TabNavigationEventsList onClick={onClick} terms={onlineTerms} />
      <TabNavigationEventsList onClick={onClick} terms={eventsListTerms} />
    </AnalyticsContext>
  </span>
}

const EventsListComponent = registerComponent("EventsList", EventsList);

declare global {
  interface ComponentTypes {
    EventsList: typeof EventsListComponent
  }
}
