import React from 'react';

import { useTranslationContext } from '../../contexts/translationContext/TranslationContext';
import { styled } from '../../styles/styledComponents';
import { themed } from '../../styles/theme';

const Container = styled.TouchableOpacity`
  align-items: center;
  height: 100%;
  justify-content: center;
  ${({ theme }) => theme.loadingErrorIndicator.container.css};
`;

const ErrorText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  margin-top: 20px;
  ${({ theme }) => theme.loadingErrorIndicator.errorText.css};
`;

const RetryText = styled.Text`
  font-size: 30px;
  font-weight: 600;
  ${({ theme }) => theme.loadingErrorIndicator.retryText.css};
`;

export type LoadingErrorProps = {
  listType: 'channel' | 'message' | 'default';
  error?: boolean;
  loadNextPage?: () => Promise<void> | null;
  retry?: () => Promise<void>;
};

const LoadingErrorIndicator: React.FC<LoadingErrorProps> & {
  themePath: string;
} = ({ listType, retry = () => null }) => {
  const { t } = useTranslationContext();

  switch (listType) {
    case 'channel':
      return (
        <Container onPress={retry}>
          <ErrorText testID='loading-error'>
            {t('Error loading channel list ...')}
          </ErrorText>
          <RetryText>⟳</RetryText>
        </Container>
      );
    case 'message':
      return (
        <Container>
          <ErrorText testID='loading-error'>
            {t('Error loading messages for this channel ...')}
          </ErrorText>
        </Container>
      );
    default:
      return (
        <Container>
          <ErrorText testID='loading-error'>{t('Error loading')}</ErrorText>
        </Container>
      );
  }
};

LoadingErrorIndicator.themePath = 'loadingErrorIndicator';

export default themed(LoadingErrorIndicator);
