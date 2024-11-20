import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, StyleSheet, Platform } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';

import { endPoints } from '@shared/dictionaries/end-points';
import LiveBalance from '@custom-sections/LiveBalance';
import PaymentDetail from '@custom-elements/PaymentDetail';
import ListData from '@custom-sections/ListData';
import Balance from '@custom-sections/Balance';
import Tabs from '@custom-elements/Tabs';
import LoadingComponent from '@custom-elements/Loading';

import ListTransactions from '@custom-sections/ListTransactions';
import { GeneralRequestService } from '@core/services/general-request.service';
import Restricted from '@custom-elements/Restricted';

const generalRequestService = GeneralRequestService.getInstance();

const TAccount = () => {
  const route = useRoute();

  const [customStyleIndex, setCustomStyleIndex] = useState(0);
  const [restricted, setRestricted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [balanceRestricted, setBalanceRestricted] = useState(false);

  const fetchStatements = async () => {
    try {
      if (customStyleIndex === 1) return;
  
      const response = await generalRequestService.get(endPoints.statements);
  
      if (response?.restricted) {
        setRestricted(true);
        setCustomStyleIndex(1);
      } else {
        setRestricted(false);
      }
    } catch (error) {
      console.error('Error fetching statements:', error.message || error);
    }
  };
  
  const fetchLiveBalance = async () => {
    try {
      const response = await generalRequestService.get(endPoints.liveBalance);
  
      if (response && typeof response === 'object') {
        setBalanceRestricted(response?.restricted || false);
      } else {
        console.warn('Unexpected response format:', response);
        setBalanceRestricted(false);
      }
    } catch (error) {
      console.error('Error fetching live balance:', error.message || error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      (async () => {
        await fetchLiveBalance();
        await fetchStatements();
        setCustomStyleIndex(route.params?.tabIndexSelected ?? 0);
        setIsLoading(false);
      })();
    }, [route.params?.tabIndexSelected])
  );

  const renderItemsStatement = ({ item }) => (
    <Statement statement={item} />
  );

  const renderAccountDetails = () => (
    <>
      {restricted && balanceRestricted ? (
        <Restricted horizontal />
      ) : (
        <>
          <PaymentDetail />
          <Balance />
          {/* Puedes añadir más lógica aquí si es necesario */}
        </>
      )}
    </>
  );

  const renderInvoices = () => <ListTransactions />;

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.contentLoading}>
          <LoadingComponent size="large" />
        </View>
      ) : (
        <>
          <View style={styles.liveBalanceContainer}>
            <LiveBalance company={false} />
          </View>
          <View style={styles.tabsContainer}>
            <Tabs
              optionsTabsRender={[
                {
                  labelTab: 'Transactions',
                  component: renderInvoices(),
                },
                {
                  labelTab: 'Balance',
                  component: renderAccountDetails(),
                },
              ]}
              tabIndexSelected={customStyleIndex}
              changeIndexSelected={(index) => setCustomStyleIndex(index)}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  liveBalanceContainer: {
    flex: Platform.OS === 'ios' ? 0.21 : 0.2,
  },
  tabsContainer: {
    flex: Platform.OS === 'ios' ? 0.7 : 1,
  },
  contentLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TAccount;