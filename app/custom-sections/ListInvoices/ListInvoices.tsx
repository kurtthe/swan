import React from 'react';
// @ts-ignore
import { Block, Text } from 'galio-framework';
import Invoice from '@custom-elements/Invoice';
import { makeStyles } from './ListInvoices.styles';
import Restricted from '@custom-elements/Restricted';
import { FlatList } from 'react-native';
import Promotions from '@custom-elements/Promotions';

export const ListInvoices = ({ data: dataInvoice, backAccount, restricted }) => {
  const styles = makeStyles();

  const renderItem = ({ item }: {item: any}) => (
    <Invoice invoice={item} isAccount={backAccount} />
  );

  return (
    <>
      <Promotions/>
      {dataInvoice && dataInvoice.length > 0 ? (
        <Block style={styles.card}>
          {restricted ? <Restricted horizontal /> : (
          <FlatList
            keyExtractor={(item, index)=> `invoice-card-${item.id}-${index}`}
            data={dataInvoice}
            renderItem={renderItem}
          />
          )
          }
        </Block>
      ) : (
        <Block row>
          <Block flex style={{ paddingRight: 3, paddingLeft: 15, marginTop: 5 }}>
            <Text>No invoices available</Text>
          </Block>
        </Block>
      )}
    </>
  );
};
