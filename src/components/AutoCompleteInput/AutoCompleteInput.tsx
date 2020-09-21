import React, { useContext, useEffect, useRef } from 'react';

import type {
  NativeSyntheticEvent,
  TextInput,
  TextInputProps,
  TextInputSelectionChangeEventData,
} from 'react-native';

import {
  isSuggestionUser,
  Suggestion,
  SuggestionsContext,
} from '../../contexts/suggestionsContext/SuggestionsContext';
import { TranslationContext } from '../../contexts/translationContext/TranslationContext';
import { styled } from '../../styles/styledComponents';

import { isMentionTrigger } from '../../utils/utils';

import type { Trigger, TriggerSettings } from '../../utils/utils';

const InputBox = styled.TextInput`
  flex: 1;
  margin: -5px;
  max-height: 60px;
  ${({ theme }) => theme.messageInput.inputBox.css}
`;

const computeCaretPosition = (token: string, startOfTokenPosition: number) =>
  startOfTokenPosition + token.length;

const isCommand = (text: string) => {
  if (text[0] !== '/') {
    return false;
  }

  const tokens = text.split(' ');

  if (tokens.length > 1) {
    return false;
  }

  return true;
};

type Props = {
  /**
   * Additional props for underlying TextInput component. These props will be forwarded as is to the TextInput component.
   *
   * @see See https://reactnative.dev/docs/textinput#reference
   */
  additionalTextInputProps: TextInputProps;
  /**
   * Handling text change events in the parent
   *
   * @param {string} text
   */
  onChange: (text: string) => void;
  /**
   * Ref callback to set reference on input box
   */
  setInputBoxRef: React.RefObject<TextInput>;
  /**
   * Mapping of input triggers to the outputs to be displayed by the AutoCompleteInput
   */
  triggerSettings: TriggerSettings;
  /**
   * Text value of the TextInput
   */
  value: string;
};

const AutoCompleteInput: React.FC<Props> = ({
  additionalTextInputProps,
  onChange,
  setInputBoxRef,
  triggerSettings,
  value,
}) => {
  const {
    closeSuggestions,
    openSuggestions,
    updateSuggestions: updateSuggestionsContext,
  } = useContext(SuggestionsContext);
  const { t } = useContext(TranslationContext);

  const isTrackingStarted = useRef(false);
  const selectionEnd = useRef(0);

  const handleChange = (text: string, fromUpdate = false) => {
    if (!fromUpdate) {
      onChange(text);
    } else {
      handleSuggestions(text);
    }
  };

  useEffect(() => {
    handleChange(value, true);
  }, [handleChange, value]);

  const startTracking = (trigger: Trigger) => {
    isTrackingStarted.current = true;
    const { component: Component, title } = triggerSettings[trigger];
    openSuggestions(title, Component);
  };

  const stopTracking = () => {
    isTrackingStarted.current = false;
    closeSuggestions();
  };

  const updateSuggestions = async ({
    query,
    trigger,
  }: {
    query: Suggestion['name'];
    trigger: Trigger;
  }) => {
    if (isMentionTrigger(trigger)) {
      await triggerSettings[trigger].dataProvider(
        query,
        value,
        (data, queryCallback) => {
          if (query !== queryCallback) {
            return;
          }

          updateSuggestionsContext({
            data,
            onSelect: (item) => onSelectSuggestion({ item, trigger }),
          });
        },
      );
    } else {
      await triggerSettings[trigger].dataProvider(
        query,
        value,
        (data, queryCallback) => {
          if (query !== queryCallback) {
            return;
          }

          updateSuggestionsContext({
            data,
            onSelect: (item) => onSelectSuggestion({ item, trigger }),
          });
        },
      );
    }
  };

  const handleSelectionChange: (
    e: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
  ) => void = ({
    nativeEvent: {
      selection: { end },
    },
  }) => {
    selectionEnd.current = end;
  };

  const onSelectSuggestion = ({
    item,
    trigger,
  }: {
    item: Suggestion;
    trigger: Trigger;
  }) => {
    let newTokenString = '';
    if (isMentionTrigger(trigger)) {
      if (isSuggestionUser(item)) {
        newTokenString = `${triggerSettings[trigger].output(item).text} `;
      }
    } else {
      if (!isSuggestionUser(item)) {
        newTokenString = `${triggerSettings[trigger].output(item).text} `;
      }
    }

    if (!trigger) {
      return;
    }

    const textToModify = value.slice(0, selectionEnd.current);

    const startOfTokenPosition = textToModify.search(
      /**
       * It's important to escape the trigger char for chars like [, (,...
       */
      new RegExp(`\\${trigger}${`[^\\${trigger}${'\\s'}]`}*$`),
    );

    const newCaretPosition = computeCaretPosition(
      newTokenString,
      startOfTokenPosition,
    );

    const modifiedText = `${textToModify.substring(
      0,
      startOfTokenPosition,
    )}${newTokenString}`;

    stopTracking();
    onChange(value.replace(textToModify, modifiedText));

    selectionEnd.current = newCaretPosition || 0;

    if (isMentionTrigger(trigger) && isSuggestionUser(item)) {
      triggerSettings[trigger].callback(item);
    }
  };

  const handleCommand = async (text: string) => {
    if (!isCommand(text)) {
      return false;
    }

    if (!isTrackingStarted.current) {
      startTracking('/');
    }
    const actualToken = text.trim().slice(1);
    await updateSuggestions({ query: actualToken, trigger: '/' });

    return true;
  };

  const handleMentions = ({
    selectionEnd: selectionEndProp,
    text,
  }: {
    selectionEnd: number;
    text: string;
  }) => {
    const minChar = 0;

    const tokenMatch = text
      .slice(0, selectionEndProp)
      .match(/(?!^|\W)?[:@][^\s]*\s?[^\s]*$/g);

    const lastToken = tokenMatch && tokenMatch[tokenMatch.length - 1].trim();
    const handleMentionsTrigger =
      (lastToken &&
        Object.keys(triggerSettings).find(
          (trigger) => trigger === lastToken[0],
        )) ||
      null;

    /*
      if we lost the trigger token or there is no following character we want to close
      the autocomplete
    */
    if (!lastToken || lastToken.length <= minChar) {
      stopTracking();
      return;
    }

    const actualToken = lastToken.slice(1);

    // if trigger is not configured step out from the function, otherwise proceed
    if (!handleMentionsTrigger) {
      return;
    }

    if (!isTrackingStarted.current) {
      startTracking('@');
    }

    updateSuggestions({ query: actualToken, trigger: '@' });
  };

  const handleSuggestions = (text: string) => {
    setTimeout(async () => {
      if (
        text.slice(selectionEnd.current - 1, selectionEnd.current) === ' ' &&
        !isTrackingStarted.current
      ) {
        stopTracking();
      } else if (!(await handleCommand(text))) {
        handleMentions({ selectionEnd: selectionEnd.current, text });
      }
    }, 100);
  };

  return (
    <InputBox
      multiline
      onChangeText={(text) => {
        handleChange(text);
      }}
      onSelectionChange={handleSelectionChange}
      placeholder={t('Write your message')}
      ref={setInputBoxRef}
      testID='auto-complete-text-input'
      value={value}
      {...additionalTextInputProps}
    />
  );
};

export default AutoCompleteInput;
