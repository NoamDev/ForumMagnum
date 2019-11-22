import { Components, registerComponent, getSetting } from 'meteor/vulcan:core';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from '../../lib/reactRouterWrapper.js';
import { Posts } from "../../lib/collections/posts";
import { Sequences } from "../../lib/collections/sequences/collection.js";
import { Collections } from "../../lib/collections/collections/collection.js";
import withErrorBoundary from '../common/withErrorBoundary';
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from '@material-ui/core/Tooltip';
import { useCurrentUser } from "../common/withUser";
import classNames from 'classnames';
import Hidden from '@material-ui/core/Hidden';
import withRecordPostView from '../common/withRecordPostView';

export const MENU_WIDTH = 18
export const KARMA_WIDTH = 42
export const COMMENTS_WIDTH = 48

const COMMENTS_BACKGROUND_COLOR = "#efefef"

export const styles = (theme) => ({
  root: {
    position: "relative",
    [theme.breakpoints.down('sm')]: {
      width: "100%"
    },
    '&:hover $actions': {
      opacity: .2,
    }
  },
  background: {
    transition: "3s",
    width: "100%",
  },
  postsItem: {
    display: "flex",
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: "center",
    flexWrap: "nowrap",
    [theme.breakpoints.down('sm')]: {
      flexWrap: "wrap",
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
    },
  },
  withGrayHover: {
    '&:hover': {
      backgroundColor: "#efefef"
    },
  },
  hasResumeReading: {
    ...theme.typography.body,
    "& $title": {
      position: "relative",
      top: -5,
    },
  },
  bottomBorder: {
    borderBottom: "solid 1px rgba(0,0,0,.2)",
  },
  commentsBackground: {
    backgroundColor: COMMENTS_BACKGROUND_COLOR,
    transition: "0s",
  },
  firstItem: {
    borderTop: "solid 1px rgba(0,0,0,.2)"
  },
  karma: {
    width: KARMA_WIDTH,
    justifyContent: "center",
    [theme.breakpoints.down('sm')]:{
      width: "unset",
      justifyContent: "flex-start",
      marginLeft: 2,
      marginRight: theme.spacing.unit
    }
  },
  title: {
    minHeight: 26,
    flexGrow: 1,
    flexShrink: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginRight: 12,
    [theme.breakpoints.up('md')]: {
      position: "relative",
      top: 3,
    },
    [theme.breakpoints.down('sm')]: {
      order:-1,
      height: "unset",
      maxWidth: "unset",
      width: "100%",
      paddingRight: theme.spacing.unit
    },
    '&:hover': {
      opacity: 1,
    }
  },
  author: {
    justifyContent: "flex-end",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis", // I'm not sure this line worked properly?
    marginRight: theme.spacing.unit*1.5,
    [theme.breakpoints.down('sm')]: {
      justifyContent: "flex-start",
      width: "unset",
      marginLeft: 0,
      flex: "unset"
    }
  },
  event: {
    maxWidth: 250,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis", // I'm not sure this line worked properly?
    marginRight: theme.spacing.unit*1.5,
    [theme.breakpoints.down('sm')]: {
      width: "unset",
      marginLeft: 0,
    }
  },
  newCommentsSection: {
    width: "100%",
    paddingLeft: theme.spacing.unit*2,
    paddingRight: theme.spacing.unit*2,
    paddingBottom: theme.spacing.unit,
    paddingTop: theme.spacing.unit,
    cursor: "pointer",
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    }
  },
  commentsIcon: {
    width: COMMENTS_WIDTH,
    height: 24,
    cursor: "pointer",
    position: "relative",
    flexShrink: 0,
    top: 2
  },
  actions: {
    opacity: 0,
    display: "flex",
    position: "absolute",
    top: 0,
    right: -MENU_WIDTH - 6,
    width: MENU_WIDTH,
    height: "100%",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down('sm')]: {
      display: "none"
    }
  },
  mobileSecondRowSpacer: {
    [theme.breakpoints.up('md')]: {
      display: "none",
    },
    flexGrow: 1,
  },
  mobileActions: {
    cursor: "pointer",
    width: MENU_WIDTH,
    opacity: .5,
    marginRight: theme.spacing.unit,
    display: "none",
    [theme.breakpoints.down('sm')]: {
      display: "block"
    }
  },
  mobileDismissButton: {
    display: "none",
    opacity: 0.75,
    verticalAlign: "middle",
    position: "relative",
    cursor: "pointer",
    right: 10,
    [theme.breakpoints.down('sm')]: {
      display: "inline-block"
    }
  },
  nextUnreadIn: {
    color: theme.palette.grey[800],
    fontFamily: theme.typography.commentStyle.fontFamily,

    [theme.breakpoints.up('md')]: {
      position: "absolute",
      left: 42,
      top: 28,
      zIndex: theme.zIndexes.nextUnread,
    },
    [theme.breakpoints.down('sm')]: {
      order: -1,
      width: "100%",
      marginTop: -2,
      marginBottom: 3,
      marginLeft: 1,
    },

    "& a": {
      color: theme.palette.primary.main,
    },
  },
  nominationCount: {
    ...theme.typography.body2,
    color: theme.palette.grey[600],
    width: 30,
    textAlign: "center",
  },
  sequenceImage: {
    position: "relative",
    marginLeft: -60,
    zIndex: theme.zIndexes.continueReadingImage,
    opacity: 0.6,
    height: 48,
    width: 146,

    // Negative margins that are the opposite of the padding on postsItem, since
    // the image extends into the padding.
    marginTop: -12,
    marginBottom: -12,
    [theme.breakpoints.down('sm')]: {
      marginTop: 0,
      marginBottom: 0,
      position: "absolute",
      overflow: 'hidden',
      right: 0,
      bottom: 0,
      height: "100%",
    },

    // Overlay a white-to-transparent gradient over the image
    "&:after": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      background: "linear-gradient(to right, white 0%, rgba(255,255,255,.8) 60%, transparent 100%)",
    }
  },
  sequenceImageImg: {
    height: 48,
    width: 146,
    [theme.breakpoints.down('sm')]: {
      height: "100%",
      width: 'auto'
    },
  },
  dense: {
    paddingTop: 7,
    paddingBottom:8
  },
  withRelevanceVoting: {
    marginLeft: 50,
    
    [theme.breakpoints.down('sm')]: {
      marginLeft: 35,
    },
  },
  hideOnSmallScreens: {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  bookmark: {
    marginLeft: theme.spacing.unit/2,
    marginRight: theme.spacing.unit*1.5,
    position: "relative",
    top: 2,
  }
})

const dismissRecommendationTooltip = "Don't remind me to finish reading this sequence unless I visit it again";

const cloudinaryCloudName = getSetting('cloudinary.cloudName', 'lesswrong-2-0')

const isSticky = (post, terms) => {
  if (post && terms && terms.forum) {
    return (
      post.sticky ||
      (terms.af && post.afSticky) ||
      (terms.meta && post.metaSticky)
    )
  }
}

const PostsItem2 = ({
  // post: The post displayed.
  post,
  // tagRel: (Optional) The relationship between this post and a tag. If
  // provided, UI will be shown with the score and voting on this post's
  // relevance to that tag.
  tagRel=null,
  // defaultToShowComments: (bool) If set, comments will be expanded by default.
  defaultToShowComments=false,
  // sequenceId, chapter: If set, these will be used for making a nicer URL.
  sequenceId, chapter,
  // index: If this is part of a list of PostsItems, its index (starting from
  // zero) into that list. Used for special casing some styling at start of
  // the list.
  index,
  // terms: If this is part of a list generated from a query, the terms of that
  // query. Used for figuring out which sticky icons to apply, if any.
  terms,
  // resumeReading: If this is a Resume Reading suggestion, the corresponding
  // partiallyReadSequenceItem (see schema in users/custom_fields.js). Used for
  // the sequence-image background.
  resumeReading,
  // dismissRecommendation: If this is a Resume Reading suggestion, a callback
  // to dismiss it.
  dismissRecommendation,
  showBottomBorder=true,
  showQuestionTag=true,
  showIcons=true,
  showPostedAt=true,
  defaultToShowUnreadComments=false,
  // dense: (bool) Slightly reduce margins to make this denser. Used on the
  // All Posts page.
  dense,
  // hideOnSmallScreens: (bool) If set, don't show this on 'sm' and 'xs' screen
  // sizes. Used for hiding already-read curated posts on space-constrained
  // mobile devices.
  hideOnSmallScreens,
  // bookmark: (bool) Whether this is a bookmark. Adds a clickable bookmark
  // icon.
  bookmark,
  // recordPostView, isRead: From the withRecordPostView HoC.
  // showNominationCount: (bool) whether this should display it's number of Review nominations
  showNominationCount,
  recordPostView, isRead,
  classes,
}) => {
  const [showComments, setShowComments] = React.useState(defaultToShowComments);
  const [readComments, setReadComments] = React.useState(false);
  const currentUser = useCurrentUser();
  
  const toggleComments = React.useCallback(
    () => {
      recordPostView({post})
      setShowComments(!showComments);
      setReadComments(true);
    },
    [post, recordPostView, setShowComments, showComments, setReadComments]
  );

  const hasUnreadComments = () => {
    const lastCommentedAt = Posts.getLastCommentedAt(post)
    const newComments = post.lastVisitedAt < lastCommentedAt;
    return (isRead && newComments && !readComments)
  }

  const { PostsItemComments, PostsItemKarma, PostsTitle, PostsUserAndCoauthors,
    PostsPageActions, PostsItemIcons, PostsItem2MetaInfo, PostsItemTooltipWrapper,
    BookmarkButton } = Components

  const postLink = Posts.getPageUrl(post, false, sequenceId || chapter?.sequenceId);

  const unreadComments = hasUnreadComments()

  const renderComments = showComments || (defaultToShowUnreadComments && unreadComments)
  const condensedAndHiddenComments = defaultToShowUnreadComments && unreadComments && !showComments

  const dismissButton = (currentUser && resumeReading &&
    <Tooltip title={dismissRecommendationTooltip} placement="right">
      <CloseIcon onClick={() => dismissRecommendation()}/>
    </Tooltip>
  )

  return (
    <div className={classNames(
      classes.root,
      classes.background,
      {
        [classes.hideOnSmallScreens]: hideOnSmallScreens,
        [classes.bottomBorder]: showBottomBorder,
        [classes.commentsBackground]: renderComments,
        [classes.firstItem]: (index===0) && showComments,
        [classes.hasResumeReading]: !!resumeReading,
      })}
    >
      <PostsItemTooltipWrapper post={post}>
        <div className={classes.withGrayHover}>
          {tagRel && <Components.PostsItemTagRelevance tagRel={tagRel} post={post} />}

          <div className={classNames(classes.postsItem, {
            [classes.dense]: dense,
            [classes.withRelevanceVoting]: !!tagRel,
          })}>
            <PostsItem2MetaInfo className={classes.karma}>
              <PostsItemKarma post={post} />
            </PostsItem2MetaInfo>

            <span className={classes.title}>
              <PostsTitle postLink={postLink} post={post} expandOnHover={!renderComments} read={isRead} sticky={isSticky(post, terms)} showQuestionTag={showQuestionTag}/>
            </span>

            {(resumeReading?.sequence || resumeReading?.collection) &&
              <div className={classes.nextUnreadIn}>
                {resumeReading.numRead ? "Next unread in " : "First post in "}<Link to={
                  resumeReading.sequence
                    ? Sequences.getPageUrl(resumeReading.sequence)
                    : Collections.getPageUrl(resumeReading.collection)
                }>
                  {resumeReading.sequence ? resumeReading.sequence.title : resumeReading.collection?.title}
                </Link>
                {" "}
                {(resumeReading.numRead>0) && <span>({resumeReading.numRead}/{resumeReading.numTotal} read)</span>}
              </div>
            }

            { post.user && !post.isEvent && <PostsItem2MetaInfo className={classes.author}>
              <PostsUserAndCoauthors post={post} abbreviateIfLong={true} />
            </PostsItem2MetaInfo>}

            { post.isEvent && <PostsItem2MetaInfo className={classes.event}>
              <Components.EventVicinity post={post} />
            </PostsItem2MetaInfo>}

            {showPostedAt && !resumeReading && <Components.PostsItemDate post={post}/>}

            <div className={classes.mobileSecondRowSpacer}/>

            {<div className={classes.mobileActions}>
              {!resumeReading && <PostsPageActions post={post} />}
            </div>}

            {showIcons && <Hidden mdUp implementation="css">
              <PostsItemIcons post={post}/>
            </Hidden>}

            {!resumeReading && <div className={classes.commentsIcon}>
              <PostsItemComments
                post={post}
                onClick={toggleComments}
                unreadComments={unreadComments}
              />
            </div>}

            {bookmark && <div className={classes.bookmark}>
              <BookmarkButton post={post}/>
            </div>}

            {showNominationCount && <div className={classes.nominationCount}>
              <Tooltip placement="right" title={`This post has ${post.nominationCount2018} nomination${post.nominationCount2018 > 1 ? 's' : ''} for the 2018 review`}>
                <span>
                  { post.nominationCount2018}
                </span>
              </Tooltip>
            </div>}

            <div className={classes.mobileDismissButton}>
              {dismissButton}
            </div>

            {resumeReading &&
              <div className={classes.sequenceImage}>
                <img className={classes.sequenceImageImg}
                  src={`https://res.cloudinary.com/${cloudinaryCloudName}/image/upload/c_fill,dpr_2.0,g_custom,h_96,q_auto,w_292/v1/${
                    resumeReading.sequence?.gridImageId
                      || resumeReading.collection?.gridImageId
                      || "sequences/vnyzzznenju0hzdv6pqb.jpg"
                  }`}
                />
              </div>}
          </div>
        </div>
      </PostsItemTooltipWrapper>

      {<div className={classes.actions}>
        {dismissButton}
        {!resumeReading && <PostsPageActions post={post} vertical />}
      </div>}

      {renderComments && <div className={classes.newCommentsSection} onClick={toggleComments}>
        <Components.PostsItemNewCommentsWrapper
          currentUser={currentUser}
          highlightDate={post.lastVisitedAt}
          terms={{view:"postCommentsUnread", limit:7, postId: post._id}}
          post={post}
          condensed={condensedAndHiddenComments}
          hideReadComments={condensedAndHiddenComments}
        />
      </div>}
    </div>
  )
};

registerComponent('PostsItem2', PostsItem2,
  withStyles(styles, { name: "PostsItem2" }),
  withRecordPostView,
  withErrorBoundary
);