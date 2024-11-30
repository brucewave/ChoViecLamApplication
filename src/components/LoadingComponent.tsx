import { View, Text, ActivityIndicator} from 'react-native'
import { TextComponent } from './index';
import React from 'react'
import { globalStyles } from '../styles/globalStyles';

interface Props {
    isLoading: boolean;
    values: number;
    mess?: string;
}

const LoadingComponent = (props: Props) => {
    const {isLoading, values, mess} = props;

  return (
    <View style={[globalStyles.center]}>
      {isLoading ? (
        <ActivityIndicator />
      ) : values === 0 ? (
        <TextComponent text={mess ?? 'Không có dữ liệu'} />
      ) : null}
    </View>
  );
}

export default LoadingComponent