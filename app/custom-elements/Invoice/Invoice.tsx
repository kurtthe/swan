import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';
// @ts-ignore
import { Block, Text, theme } from 'galio-framework';
import { nowTheme } from '@constants';

import { FormatMoneyService } from '@core/services/format-money.service';
import { validateEmptyField } from '@core/utils/validate-empty-field';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { makeStyles } from './Invoice.styles';
import { Button } from '../../components';

type Props = {
  invoice: any;
  isAccount: any;
}

export const Invoice: React.FC<Props> = (props) => {
  const navigation = useNavigation();
  const styles = makeStyles();

  let dateInvoice = validateEmptyField(props.invoice.invoice_date);

  if (dateInvoice !== 'N/A') {
    dateInvoice = moment(dateInvoice).format('DD/MM/YYYY');
  } else {
    dateInvoice = ''
  }

  const formatMoney = FormatMoneyService.getInstance();

  const handleShowDetails = () => {
    // @ts-ignore
    navigation.navigate('InvoiceDetails', {
      invoice: props.invoice.id,
      invoiceNumber: props.invoice.order_number,
      nameRouteGoing: !props.isAccount ? false : 'AccountInvoice',
    });
  };

  return (
    <>
      <TouchableOpacity style={styles.container}>
        <Block row>
          <Block flex style={{ paddingRight: 3, paddingLeft: 15 }}>
            <Block row space='between' style={{ height: 20 }}>
              <Block row>
                <Text
                  color={nowTheme.COLORS.BLACK}
                  style={{ fontFamily: nowTheme.FONT.primaryRegular }}
                  size={16}
                >
                  {validateEmptyField(props.invoice.order_number)}
                </Text>

              </Block>
              <Block row>
                <Text
                  color={nowTheme.COLORS.BLACK}
                  style={{
                    fontFamily: nowTheme.FONT.primaryRegular,
                    paddingRight: 10,
                  }}
                  size={14}
                >
                  {validateEmptyField(dateInvoice)}
                </Text>
              </Block>
            </Block>


            <Block row justifyContent='space-between' style={{ top: 8 }}>
              <Text
                color={nowTheme.COLORS.HEADER}
                size={13}
                style={{ fontFamily: nowTheme.FONT.primaryRegular }}
              >
                {validateEmptyField(props.invoice.name)}
              </Text>
            </Block>
            <Block bottom>
              <Button
                color="info"
                textStyle={{ fontFamily: 'montserrat-bold', fontSize: 14 }}
                style={styles.button}
                onPress={() => handleShowDetails()}
              >
                View
              </Button>

            </Block>
            <Block row>
              <Text
                style={{ fontFamily: nowTheme.FONT.primaryBold, marginTop: -25.5 }}
                size={theme.SIZES.BASE}
                color={nowTheme.COLORS.HEADER}
              >
                {formatMoney.format(props.invoice.total_amount)}
              </Text>
            </Block>
          </Block>
        </Block>
      </TouchableOpacity>
      <Block style={styles.line}></Block>
    </>
  );
};
