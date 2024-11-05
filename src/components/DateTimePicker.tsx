import {View, Text} from 'react-native';
import React, {useState} from 'react';
import DatePicker from 'react-native-date-picker';
import {RowComponent, TextComponent} from '.';
import {ArrowDown2, Calendar, Clock} from 'iconsax-react-native';
import {appColors} from '../constants/appColors';
import {globalStyles} from '../styles/globalStyles';
import {fontFamilies} from '../constants/fontFamilies';
import {DateTime} from '../utils/DateTime';
interface Props {
  selected?: Date;
  type: 'date' | 'time';
  onSelect: (val: Date) => void;
  label?: string;
}

const DateTimePicker = (props: Props) => {
  const {type, onSelect, selected, label} = props;
  const [isShowDatePicker, setIsShowDatePicker] = useState(false);
  const [currentSelected, setCurrentSelected] = useState<Date>(selected || new Date());
  return (
    <View style={{flex: 1}}>
      {label && <TextComponent text={label} styles={{marginBottom: 8}} />}

      <RowComponent
        styles={[globalStyles.inputContainer]}
        onPress={() => setIsShowDatePicker(true)}>
        <TextComponent
          text={` ${
            currentSelected
              ? type === 'time'
                ? DateTime.GetTime(currentSelected)
                : DateTime.GetDate(currentSelected)
              : 'Choice'
          }`}
          flex={1}
          font={fontFamilies.medium}
          styles={{textAlign: 'center'}}
        />
        {type === 'time' ? (
          <Clock size={22} color={appColors.gray} />
        ) : (
          <Calendar size={22} color={appColors.gray} />
        )}
      </RowComponent>
      <DatePicker
        mode={type}
        open={isShowDatePicker}
        date={currentSelected}
        modal
        onCancel={() => setIsShowDatePicker(false)}
        onConfirm={val => {
          setIsShowDatePicker(false);
          setCurrentSelected(val);
          onSelect(val);
        }}
      />
    </View>
  );
};

export default DateTimePicker;
