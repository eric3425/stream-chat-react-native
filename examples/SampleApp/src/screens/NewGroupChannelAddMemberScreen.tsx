import React, { useContext } from 'react';
import {
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from 'stream-chat-react-native/v2';

import { ScreenHeader } from '../components/ScreenHeader';
import { UserGridItem } from '../components/UserSearch/UserGridItem';
import { UserSearchResults } from '../components/UserSearch/UserSearchResults';
import { AppContext } from '../context/AppContext';
import { usePaginatedUsers } from '../hooks/usePaginatedUsers';
import { RightArrow } from '../icons/RightArrow';
import { Search } from '../icons/Search';

import type { StackNavigationProp } from '@react-navigation/stack';

import type { StackNavigatorParamList } from '../types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputBox: {
    flex: 1,
    fontSize: 14,
    includeFontPadding: false, // for android vertical text centering
    padding: 0, // removal of default text input padding on android
    paddingHorizontal: 16,
    paddingTop: 0, // removal of iOS top padding for weird centering
    textAlignVertical: 'center', // for android vertical text centering
  },
  inputBoxContainer: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    height: 36,
    margin: 8,
    paddingHorizontal: 10,
  },
  navigationButton: {
    padding: 15,
  },
});

type RightArrowButtonProps = {
  disabled?: boolean;
  onPress?: () => void;
};

const RightArrowButton: React.FC<RightArrowButtonProps> = (props) => {
  const { disabled, onPress } = props;

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={styles.navigationButton}
    >
      {!disabled ? (
        <RightArrow height={24} width={24} />
      ) : (
        <View style={{ height: 24, width: 24 }} />
      )}
    </TouchableOpacity>
  );
};

export type NewGroupChannelAddMemberScreenNavigationProp = StackNavigationProp<
  StackNavigatorParamList,
  'NewGroupChannelAddMemberScreen'
>;

type Props = {
  navigation: NewGroupChannelAddMemberScreenNavigationProp;
};

export const NewGroupChannelAddMemberScreen: React.FC<Props> = ({
  navigation,
}) => {
  const {
    theme: {
      colors: { black, border, grey, white },
    },
  } = useTheme();
  const { chatClient } = useContext(AppContext);
  const {
    loading: loadingResults,
    loadMore,
    onChangeSearchText,
    onFocusInput,
    results,
    searchText,
    selectedUserIds,
    selectedUsers,
    toggleUser,
  } = usePaginatedUsers();

  const onRightArrowPress = () => {
    if (selectedUsers.length === 0) return;

    navigation.navigate('NewGroupChannelAssignNameScreen', {
      selectedUsers,
    });
  };

  if (!chatClient) return null;

  return (
    <View style={styles.container}>
      <ScreenHeader
        RightContent={() => (
          <RightArrowButton
            disabled={selectedUsers.length === 0}
            onPress={onRightArrowPress}
          />
        )}
        titleText='Add Group Members'
      />
      <View>
        <View
          style={[
            styles.inputBoxContainer,
            {
              backgroundColor: white,
              borderColor: border,
            },
          ]}
        >
          <Search height={24} width={24} />
          <TextInput
            onChangeText={onChangeSearchText}
            onFocus={onFocusInput}
            placeholder='Search'
            placeholderTextColor={grey}
            style={[
              styles.inputBox,
              {
                color: black,
              },
            ]}
            value={searchText}
          />
        </View>
        <FlatList
          data={selectedUsers}
          horizontal
          renderItem={({ item: user }) => (
            <UserGridItem
              onPress={() => {
                toggleUser(user);
              }}
              user={user}
            />
          )}
        />
      </View>
      {results.length >= 0 && (
        <UserSearchResults
          loading={loadingResults}
          loadMore={loadMore}
          results={results}
          searchText={searchText}
          selectedUserIds={selectedUserIds}
          toggleSelectedUser={(user) => {
            toggleUser(user);
          }}
        />
      )}
    </View>
  );
};
