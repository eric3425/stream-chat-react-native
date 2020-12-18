import { useMemo } from 'react';

import type { MessageContextValue } from '../../../contexts/messageContext/MessageContext';
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

export const useCreateMessageContext = <
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType
>({
  actionsEnabled,
  alignment,
  animatedLongPress,
  canModifyMessage,
  files,
  groupStyles,
  handleAction,
  hasReactions,
  images,
  isMyMessage,
  lastGroupMessage,
  lastReceivedId,
  message,
  messageContentOrder,
  onLongPress,
  onlyEmojis,
  onOpenThread,
  onPress,
  otherAttachments,
  preventPress,
  reactions,
  showAvatar,
  showMessageOverlay,
  showMessageStatus,
  threadList,
}: MessageContextValue<At, Ch, Co, Ev, Me, Re, Us>) => {
  const groupStylesLength = groupStyles.length;
  const latestReactionsLength = message.latest_reactions?.length;
  const reactionsValue = reactions
    .map(({ own, type }) => `${own}${type}`)
    .join();
  const messageValue = `${message.updated_at}${message.deleted_at}${message.readBy}${message.status}${message.type}${message.text}`;

  const messageContext: MessageContextValue<
    At,
    Ch,
    Co,
    Ev,
    Me,
    Re,
    Us
  > = useMemo(
    () => ({
      actionsEnabled,
      alignment,
      animatedLongPress,
      canModifyMessage,
      files,
      groupStyles,
      handleAction,
      hasReactions,
      images,
      isMyMessage,
      lastGroupMessage,
      lastReceivedId,
      message,
      messageContentOrder,
      onLongPress,
      onlyEmojis,
      onOpenThread,
      onPress,
      otherAttachments,
      preventPress,
      reactions,
      showAvatar,
      showMessageOverlay,
      showMessageStatus,
      threadList,
    }),
    [
      actionsEnabled,
      alignment,
      animatedLongPress,
      groupStylesLength,
      hasReactions,
      lastGroupMessage,
      lastReceivedId,
      latestReactionsLength,
      messageValue,
      reactionsValue,
      showAvatar,
      showMessageStatus,
      threadList,
    ],
  );

  return messageContext;
};
