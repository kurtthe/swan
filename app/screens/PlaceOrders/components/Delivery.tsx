
import DateTimePicker from 'react-native-modal-datetime-picker';
import React, { useEffect, useState } from 'react';
import PickerButton from '@custom-elements/PickerButton';
import { nowTheme } from '@constants/index';
import { Dimensions, StyleSheet } from 'react-native';
import {
  radioButtonsDelivery,
  radioButtonsHour,
} from '@shared/dictionaries/radio-buttons-delivery';
// @ts-ignore
import { Block, Input, Text } from 'galio-framework';
import {useDispatch, useSelector} from 'react-redux'
import {setUpDelivery} from '@core/module/store/placeOrders/placeOrders'
import InputDate from '@components/InputDate';
const { width } = Dimensions.get('screen');

const Delivery = () => {
  const dispatch = useDispatch()
  const {first_name, last_name, phone_number} = useSelector((state: any)=> state.loginReducer)

  const [optionDeliveries, setOptionsDeliveries] = useState<any>()
  const [optionHours, setOptionsHours] = useState<any>()
  const [optionDeliverySelected, setOptionDeliverySelected] = useState()
  const [optionHourSelected, setOptionHourSelected] = useState()
  const [deliveryText, setDeliveryText] = useState()
  const [locationSelected, setLocationSelected] = useState()
  const [dateSelected, setDateSelected] = useState()
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)
  const [contactPhone, setContactPhone] = useState()
  const [contactName, setContactName] = useState<string>()

  useEffect(()=>{
    setOptionsDeliveries(radioButtonsDelivery)
    setOptionsHours(radioButtonsHour)
    setContactPhone(phone_number)
    setContactName(`${first_name} ${last_name}`)
  },[])

  useEffect(()=>{
    const dataDelivery = {
      delivery: optionDeliverySelected?.value,
      location: locationSelected,
      date: dateSelected,
      time: optionHourSelected,
      contact_number: contactPhone,
      contact_name: contactName
    }

    dispatch(setUpDelivery(dataDelivery))
  },[optionHourSelected, locationSelected, optionHourSelected, optionDeliverySelected, dateSelected, contactName, contactPhone])

  useEffect(() => {
    if (dateSelected) {
      filterHours();
    }
  }, [dateSelected]);

  const filterHours = () => {
    const currentDate = new Date().toISOString().slice(0, 10);
    const selectedDate = dateSelected?.value;
  
    if (selectedDate === currentDate) {
      const currentHour = new Date().getHours();
  
      const filteredHours = radioButtonsHour.filter((hour) => {
        const hourValue = parseInt(hour.label.split(' ')[0], 10);
        const isPM = hour.label.includes('PM');
        const hourIn24Format = isPM && hourValue !== 12 ? hourValue + 12 : hourValue;
  
        return hourIn24Format >= currentHour;
      });
  
      setOptionsHours(filteredHours);
    } else {
      setOptionsHours(radioButtonsHour);
    }
  };

  const handleChangeDelivery = (optionSelected) => {
    setOptionDeliverySelected(optionSelected)
    setDeliveryText(optionSelected?.label)
  }

  const handleDatePicked = (date) => {
    // @ts-ignore
    setDateSelected({
      label: date.toDateString(),
      value: date.toISOString('2015-05-14').slice(0, 10),
    })
    setIsDatePickerVisible(false)
  }

  return (
    <Block
      card
      backgroundColor={'white'}
      width={width}
      paddingTop={10}
      paddingHorizontal={20}
      paddingBottom={20}
      marginBottom={20}
    >
      <PickerButton
        label="Delivery Options"
        text="Delivery Type"
        isRequired
        placeholder={deliveryText || 'Select delivery type'}
        renderOptions={optionDeliveries}
        onChangeOption={(option) => handleChangeDelivery(option)}
      />
      {optionDeliverySelected?.value === 'delivery' && (
        <>
          <Block row>
            <Text style={styles.text}>Address</Text>
            <Text style={styles.errorText}> * </Text>
          </Block>
          <Input
            left
            color="black"
            placeholder="Enter your address"
            onChangeText={(t) => setLocationSelected(t)}
            placeholderTextColor={nowTheme.COLORS.PICKERTEXT}
            textInputStyle={{ flex: 1 }}
          />
        </>
      )}
      <>
        <InputDate
          text={`${deliveryText ?? ''} Preferred Delivery Date`}
          placeholder={ !!dateSelected ? dateSelected?.label : "Select date"}
          pickDate={!!dateSelected}
          icon='calendar-today'
          sizeIcon={25}
          onPress={()=>setIsDatePickerVisible(true)}
        />

        <DateTimePicker
          mode="date"
          isVisible={isDatePickerVisible}
          onConfirm={handleDatePicked}
          onCancel={()=>setIsDatePickerVisible(false)}
          minimumDate={new Date()}
        />
      </>
      <PickerButton
        text={`${deliveryText || ''} Preferred Delivery Time`}
        placeholder={
          dateSelected
            ? (!optionHourSelected ? 'Select time' : optionHourSelected?.label)
            : 'Select a date first'
        }
        isRequired
        icon={'lock-clock'}
        sizeIcon={25}
        renderOptions={optionHours}
        onChangeOption={(option) => setOptionHourSelected(option)}
        disabled={!dateSelected}
        />
      {optionDeliverySelected?.value === 'delivery' && (
        <>
          <Block row>
            <Text style={styles.text}>Contact Name</Text>
            <Text style={styles.errorText}> * </Text>
          </Block>
          <Input
            left
            color="black"
            value={contactName}
            placeholder="Enter your name"
            onChangeText={(t) => setContactName(t)}
            placeholderTextColor={nowTheme.COLORS.PICKERTEXT}
            textInputStyle={{ flex: 1 }}
          />
          <Block row>
            <Text style={styles.text}>Contact Phone</Text>
            <Text style={styles.errorText}> * </Text>
          </Block>
          <Input
            left
            color="black"
            value={contactPhone}
            placeholder="Enter your phone"
            onChangeText={(t) => setContactPhone(t)}
            placeholderTextColor={nowTheme.COLORS.PICKERTEXT}
            textInputStyle={{ flex: 1 }}
          />
        </>
      )}
    </Block>
  )
}

const styles = StyleSheet.create({
  text: {
    paddingTop: 10,
    color: nowTheme.COLORS.PRETEXT,
  },
  errorText: {
    paddingTop: 10,
    color: nowTheme.COLORS.ERROR,
    fontWeight: 'bold',
  },
})

export default Delivery;
