import React from 'react';

import { AttachmentActions as AttachmentActionsDefault } from '../../components/Attachment/AttachmentActions';
import { Card as CardDefault } from '../../components/Attachment/Card';
import { Gallery as GalleryDefault } from '../../components/Attachment/Gallery';
import { Giphy as GiphyDefault } from '../../components/Attachment/Giphy';
import { FileAttachment as FileAttachmentDefault } from '../../components/Attachment/FileAttachment';
import {
  MessagesContextValue,
  useMessagesContext,
} from '../../contexts/messagesContext/MessagesContext';

import type { GestureResponderEvent } from 'react-native';
import type { Attachment as AttachmentType } from 'stream-chat';

import type {
  DefaultAttachmentType,
  DefaultChannelType,
  DefaultCommandType,
  DefaultEventType,
  DefaultMessageType,
  DefaultReactionType,
  DefaultUserType,
  UnknownType,
} from '../../types/types';

export type ActionHandler = (name: string, value: string) => void;

export type AttachmentPropsWithContext<
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType
> = Pick<
  MessagesContextValue<At, Ch, Co, Ev, Me, Re, Us>,
  | 'AttachmentActions'
  | 'Card'
  | 'FileAttachment'
  | 'Gallery'
  | 'Giphy'
  | 'UrlPreview'
> & {
  /**
   * The attachment to render
   */
  attachment: AttachmentType<At>;
  /**
   * onPress override for all attachments
   */
  onPressIn?: (
    event: GestureResponderEvent,
    defaultOnPress?: () => void,
  ) => void;
};

const AttachmentWithContext = <
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType
>(
  props: AttachmentPropsWithContext<At, Ch, Co, Ev, Me, Re, Us>,
) => {
  const {
    attachment,
    AttachmentActions,
    Card,
    FileAttachment,
    Gallery,
    Giphy,
    onPressIn,
    UrlPreview,
  } = props;

  const hasAttachmentActions = !!attachment.actions?.length;

  if (attachment.type === 'giphy' || attachment.type === 'imgur') {
    return <Giphy attachment={attachment} onPressIn={onPressIn} />;
  }

  if (
    (attachment.title_link || attachment.og_scrape_url) &&
    (attachment.image_url || attachment.thumb_url)
  ) {
    return <UrlPreview onPressIn={onPressIn} {...attachment} />;
  }

  if (attachment.type === 'image') {
    return (
      <>
        <Gallery images={[attachment]} onPressIn={onPressIn} />
        {hasAttachmentActions && (
          <AttachmentActions
            key={`key-actions-${attachment.id}`}
            {...attachment}
          />
        )}
      </>
    );
  }

  if (attachment.type === 'file' || attachment.type === 'audio') {
    return <FileAttachment attachment={attachment} />;
  }

  if (
    attachment.type === 'video' &&
    attachment.asset_url &&
    attachment.image_url
  ) {
    return (
      // TODO: Put in video component
      <Card onPressIn={onPressIn} {...attachment} />
    );
  }

  if (hasAttachmentActions) {
    return (
      <>
        <Card onPressIn={onPressIn} {...attachment} />
        <AttachmentActions
          key={`key-actions-${attachment.id}`}
          {...attachment}
        />
      </>
    );
  } else {
    return <Card onPressIn={onPressIn} {...attachment} />;
  }
};

const areEqual = <
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType
>(
  prevProps: AttachmentPropsWithContext<At, Ch, Co, Ev, Me, Re, Us>,
  nextProps: AttachmentPropsWithContext<At, Ch, Co, Ev, Me, Re, Us>,
) => {
  const { attachment: prevAttachment } = prevProps;
  const { attachment: nextAttachment } = nextProps;

  const attachmentEqual =
    prevAttachment.actions?.length === nextAttachment.actions?.length &&
    prevAttachment.image_url === nextAttachment.image_url &&
    prevAttachment.thumb_url === nextAttachment.thumb_url;

  return attachmentEqual;
};

const MemoizedAttachment = React.memo(
  AttachmentWithContext,
  areEqual,
) as typeof AttachmentWithContext;

export type AttachmentProps<
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType
> = Partial<
  Pick<
    MessagesContextValue<At, Ch, Co, Ev, Me, Re, Us>,
    | 'AttachmentActions'
    | 'Card'
    | 'FileAttachment'
    | 'Gallery'
    | 'Giphy'
    | 'UrlPreview'
  >
> &
  Pick<AttachmentPropsWithContext<At, Ch, Co, Ev, Me, Re, Us>, 'attachment'> & {
    /**
     * onPress override for all attachments
     */
    onPressIn?: (
      event: GestureResponderEvent,
      defaultOnPress?: () => void,
    ) => void;
  };

/**
 * Attachment - The message attachment
 *
 * @example ./Attachment.md
 */
export const Attachment = <
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType
>(
  props: AttachmentProps<At, Ch, Co, Ev, Me, Re, Us>,
) => {
  const {
    attachment,
    AttachmentActions: PropAttachmentActions,
    Card: PropCard,
    FileAttachment: PropFileAttachment,
    Gallery: PropGallery,
    Giphy: PropGiphy,
    onPressIn: propOnPressIn,
    UrlPreview: PropUrlPreview,
  } = props;

  const {
    AttachmentActions: ContextAttachmentActions,
    Card: ContextCard,
    FileAttachment: ContextFileAttachment,
    Gallery: ContextGallery,
    Giphy: ContextGiphy,
    onPressInMessage,
    UrlPreview: ContextUrlPreview,
  } = useMessagesContext<At, Ch, Co, Ev, Me, Re, Us>();

  if (!attachment) {
    return null;
  }

  const AttachmentActions =
    PropAttachmentActions ||
    ContextAttachmentActions ||
    AttachmentActionsDefault;
  const Card = PropCard || ContextCard || CardDefault;
  const FileAttachment =
    PropFileAttachment || ContextFileAttachment || FileAttachmentDefault;
  const Gallery = PropGallery || ContextGallery || GalleryDefault;
  const Giphy = PropGiphy || ContextGiphy || GiphyDefault;
  const onPressIn = propOnPressIn || onPressInMessage;
  const UrlPreview = PropUrlPreview || ContextUrlPreview || CardDefault;

  return (
    <MemoizedAttachment
      {...{
        attachment,
        AttachmentActions,
        Card,
        FileAttachment,
        Gallery,
        Giphy,
        onPressIn,
        UrlPreview,
      }}
    />
  );
};
