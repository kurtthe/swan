import React from 'react';
import { BottomSheet, BottomSheetRef } from 'react-native-sheet';
import { Dimensions, ScrollView, StyleSheet } from 'react-native';
import Search from '@custom-elements/Search';
import RadioGroup from 'react-native-radio-buttons-group';
import nowTheme from '@constants/Theme';

//@ts-ignore
import { Block, Text, theme } from 'galio-framework';
const { width, height } = Dimensions.get('screen');

type Props = {
  optionSelected: any;
  setOptionSelected: (newValue: any)=> void;
  renderOptions: any[];
  changeSearchText?: (newValue: string)=> void;
  visible: boolean;
  setVisible: (newValue: boolean)=> void;
  search?: boolean;
  picked?: boolean;
  handleSearch?: (newValue: any) => void;
  page?: any;
}

const ModalOptionPicker: React.FC<Props> = ({
                                              changeSearchText,
                                              page,
                                              setVisible,
                                              renderOptions,
                                              visible,
                                              handleSearch,
                                              setOptionSelected,
                                              optionSelected,
                                              search})=> {
  const [textSearch, setTextSearch]= React.useState<string>('')
  const refBottomSheet = React.createRef<BottomSheetRef>();

  React.useEffect(()=> {
    if(!refBottomSheet.current) return;
    if(visible){
      return refBottomSheet.current.show()
    }
    refBottomSheet.current.hide()
  }, [visible])


  const onPressRadioButton = React.useCallback((valueSelected: any) => {
    const getOptionSelected = renderOptions.find((dataOption)=> valueSelected === dataOption.id )
    setOptionSelected(getOptionSelected)
  }, [renderOptions, setOptionSelected])

  if(!visible) return null

  return (
    <BottomSheet draggable={false} height={500} ref={refBottomSheet} headerAlwaysVisible onCloseStart={()=> setVisible(false)}>
      <Block left style={{ height: search ? height / 2 : 'auto', padding: 5, paddingBottom: 40}}>
        {search && (
            <Search
              placeholder="Search..."
              value={textSearch}
              onSearch={()=> handleSearch?.(page)}
              onChangeText={(newText: string) => {
                setTextSearch(newText);
                changeSearchText?.(newText);
              }}
              style={styles.search}
              inputStyle={styles.searchInput}
            />
        )}
        <ScrollView
          style={StyleSheet.flatten([styles.scrollOptions, search && {height: '95%'}])}
          contentContainerStyle={styles.sortContent}
          nestedScrollEnabled
        >
          {renderOptions?.length === 0 ? (
            <Text>No exists options</Text>
          ) : (
            <RadioGroup
              radioButtons={renderOptions}
              color={nowTheme.COLORS.INFO}
              selectedId={optionSelected?.id}
              onPress={(newValue) => onPressRadioButton(newValue)}
              containerStyle={styles.radioStyle}
            />
          )}
        </ScrollView>
      </Block>
    </BottomSheet>
  )
}

export default ModalOptionPicker


const styles = StyleSheet.create({
  searchInput: {
    color: 'black',
    fontSize: 16,
  },
  search: {
    height: 40,
    width: width - 32,
    marginBottom: theme.SIZES.BASE * 4,
    borderRadius: 30,
  },
  scrollOptions: {
    width: width - 16,
  },
  sortContent: {
    paddingHorizontal: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  radioStyle: {
    width: '100%',
    alignItems: 'flex-start',
  },
});

