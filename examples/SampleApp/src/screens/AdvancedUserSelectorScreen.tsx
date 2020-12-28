import { useTheme } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScreenHeader } from '../components/ScreenHeader';
import { AppTheme } from '../types';
import { version } from '../../node_modules/stream-chat-react-native/package.json';
import { AppContext } from '../context/AppContext';
import { KeyboardCompatibleView } from '../../../../src/v2';

type LabeledTextInputProps = {
  onChangeText: (text: string) => void;
  value: string;
  error?: boolean;
  label?: string;
};

export const LabeledTextInput: React.FC<LabeledTextInputProps> = ({
  error = false,
  label = '',
  onChangeText,
  value,
}) => {
  const { colors } = useTheme() as AppTheme;
  return (
    <View
      style={{
        backgroundColor: colors.greyContentBackground,
        borderRadius: 8,
        height: 48,
        justifyContent: 'center',
        marginTop: 8,
        paddingHorizontal: 16,
      }}
    >
      {!!value && (
        <Text
          style={{
            color: colors.textLight,
            fontSize: 10,
            fontWeight: '700',
          }}
        >
          {label}
        </Text>
      )}
      {!!error && (
        <Text
          style={{
            color: colors.danger,
            fontSize: 10,
            fontWeight: '700',
          }}
        >
          Please enter {label}
        </Text>
      )}
      <TextInput
        onChangeText={onChangeText}
        placeholder={label}
        returnKeyType='next'
        value={value}
      />
    </View>
  );
};

export const AdvancedUserSelectorScreen: React.FC = () => {
  const { colors } = useTheme() as AppTheme;
  const { loginUser } = useContext(AppContext);
  const [apiKey, setApiKey] = useState<string>('');
  const [apiKeyError, setApiKeyError] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>('');
  const [userIdError, setUserIdError] = useState<boolean>(false);
  const [userToken, setUserToken] = useState<string>('');
  const [userTokenError, setUserTokenError] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');

  const isValidInput = () => {
    let isValid = true;
    if (!apiKey) {
      setApiKeyError(true);
      isValid = false;
    }

    if (!userId) {
      setUserIdError(true);
      isValid = false;
    }

    if (!userToken) {
      setUserTokenError(true);
      isValid = false;
    }

    return isValid;
  };
  return (
    <KeyboardCompatibleView keyboardVerticalOffset={10}>
      <View style={{ height: '100%' }}>
        <ScreenHeader titleText={'Advanced Options'} />
        <View
          style={{
            flexGrow: 1,
            flexShrink: 1,
            justifyContent: 'space-between',
          }}
        >
          <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
            <LabeledTextInput
              error={apiKeyError}
              label='Chat API Key'
              onChangeText={(text) => {
                setApiKeyError(false);
                setApiKey(text);
              }}
              value={apiKey}
            />
            <LabeledTextInput
              error={userIdError}
              label='User ID'
              onChangeText={(text) => {
                setUserIdError(false);
                setUserId(text);
              }}
              value={userId}
            />
            <LabeledTextInput
              error={userTokenError}
              label='User Token'
              onChangeText={(text) => {
                setUserTokenError(false);
                setUserToken(text);
              }}
              value={userToken}
            />
            <LabeledTextInput
              label='Username (optional)'
              onChangeText={(text) => {
                setUserName(text);
              }}
              value={userName}
            />
          </View>
          <View
            style={{
              padding: 16,
            }}
          >
            <TouchableOpacity
              onPress={async () => {
                if (!isValidInput()) return;

                try {
                  await loginUser({
                    apiKey,
                    userId,
                    userName,
                    userToken,
                  });
                } catch (e) {
                  Alert.alert(
                    'Login resulted in error. Please make sure you have entered valid credentials',
                  );
                }
              }}
              style={{
                alignItems: 'center',
                alignSelf: 'flex-end',
                // TODO: Replace following color with theme color.
                backgroundColor: '#005FFF',
                borderRadius: 26,
                padding: 16,
                width: '100%',
              }}
            >
              <Text
                style={{
                  color: colors.textInverted,
                }}
              >
                Login
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                color: colors.footnote,
                marginTop: 16,
                textAlign: 'center',
              }}
            >
              Stream SDK v{version}
            </Text>
          </View>
        </View>
      </View>
    </KeyboardCompatibleView>
  );
};
