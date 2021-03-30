import { useMemo } from 'react';

import type { MessagesContextValue } from '../../../contexts/messagesContext/MessagesContext';
import type {
  DefaultAttachmentType,
  DefaultChannelType,
  DefaultCommandType,
  DefaultEventType,
  DefaultMessageType,
  DefaultReactionType,
  DefaultUserType,
  UnknownType,
} from '../../../types/types';

export const useCreateMessagesContext = <
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType
>({
  additionalTouchableProps,
  animatedLongPress,
  Attachment,
  AttachmentActions,
  blockUser,
  Card,
  CardCover,
  CardFooter,
  CardHeader,
  channelId,
  copyMessage,
  DateHeader,
  deleteMessage,
  disableTypingIndicator,
  dismissKeyboardOnMessageTouch,
  editMessage,
  FileAttachment,
  FileAttachmentGroup,
  FileAttachmentIcon,
  flagMessage,
  FlatList,
  forceAlignMessages,
  formatDate,
  Gallery,
  Giphy,
  handleBlock,
  handleCopy,
  handleDelete,
  handleEdit,
  handleFlag,
  handleMute,
  handleReaction,
  handleReply,
  handleRetry,
  handleThreadReply,
  initialScrollToFirstUnreadMessage,
  InlineDateSeparator,
  InlineUnreadIndicator,
  markdownRules,
  Message,
  messageActions,
  MessageAvatar,
  MessageContent,
  messageContentOrder,
  MessageFooter,
  MessageHeader,
  MessageList,
  MessageReplies,
  MessageRepliesAvatars,
  MessageSimple,
  MessageStatus,
  MessageSystem,
  MessageText,
  muteUser,
  myMessageTheme,
  onDoubleTapMessage,
  onLongPressMessage,
  onPressInMessage,
  onPressMessage,
  OverlayReactionList,
  ReactionList,
  reactionsEnabled,
  removeMessage,
  repliesEnabled,
  Reply,
  reply,
  retry,
  retrySendMessage,
  ScrollToBottomButton,
  selectReaction,
  setEditingState,
  setQuotedMessageState,
  supportedReactions,
  threadReply,
  TypingIndicator,
  TypingIndicatorContainer,
  updateMessage,
  UrlPreview,
}: MessagesContextValue<At, Ch, Co, Ev, Me, Re, Us> & {
  /**
   * To ensure we allow re-render, when channel is changed
   */
  channelId?: string;
}) => {
  const additionalTouchablePropsLength = Object.keys(
    additionalTouchableProps || {},
  ).length;
  const markdownRulesLength = Object.keys(markdownRules || {}).length;
  const messageContentOrderValue = messageContentOrder.join();
  const supportedReactionsLength = supportedReactions.length;

  const messagesContext: MessagesContextValue<
    At,
    Ch,
    Co,
    Ev,
    Me,
    Re,
    Us
  > = useMemo(
    () => ({
      additionalTouchableProps,
      animatedLongPress,
      Attachment,
      AttachmentActions,
      blockUser,
      Card,
      CardCover,
      CardFooter,
      CardHeader,
      copyMessage,
      DateHeader,
      deleteMessage,
      disableTypingIndicator,
      dismissKeyboardOnMessageTouch,
      editMessage,
      FileAttachment,
      FileAttachmentGroup,
      FileAttachmentIcon,
      flagMessage,
      FlatList,
      forceAlignMessages,
      formatDate,
      Gallery,
      Giphy,
      handleBlock,
      handleCopy,
      handleDelete,
      handleEdit,
      handleFlag,
      handleMute,
      handleReaction,
      handleReply,
      handleRetry,
      handleThreadReply,
      initialScrollToFirstUnreadMessage,
      InlineDateSeparator,
      InlineUnreadIndicator,
      markdownRules,
      Message,
      messageActions,
      MessageAvatar,
      MessageContent,
      messageContentOrder,
      MessageFooter,
      MessageHeader,
      MessageList,
      MessageReplies,
      MessageRepliesAvatars,
      MessageSimple,
      MessageStatus,
      MessageSystem,
      MessageText,
      muteUser,
      myMessageTheme,
      onDoubleTapMessage,
      onLongPressMessage,
      onPressInMessage,
      onPressMessage,
      OverlayReactionList,
      ReactionList,
      reactionsEnabled,
      removeMessage,
      repliesEnabled,
      Reply,
      reply,
      retry,
      retrySendMessage,
      ScrollToBottomButton,
      selectReaction,
      setEditingState,
      setQuotedMessageState,
      supportedReactions,
      threadReply,
      TypingIndicator,
      TypingIndicatorContainer,
      updateMessage,
      UrlPreview,
    }),
    [
      additionalTouchablePropsLength,
      channelId,
      disableTypingIndicator,
      dismissKeyboardOnMessageTouch,
      initialScrollToFirstUnreadMessage,
      markdownRulesLength,
      messageContentOrderValue,
      supportedReactionsLength,
    ],
  );

  return messagesContext;
};
