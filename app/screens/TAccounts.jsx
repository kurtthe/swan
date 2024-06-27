import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, RefreshControl } from 'react-native';

import { endPoints } from '@shared/dictionaries/end-points';
import LiveBalance from '@custom-sections/LiveBalance';
import PaymentDetail from '@custom-elements/PaymentDetail';
import ListData from '@custom-sections/ListData';
import Balance from '@custom-sections/Balance';
import Tabs from '@custom-elements/Tabs';

import { getStatements } from '@core/module/store/statements/statements';
import Statement from '@custom-elements/Statement';

import { STATEMENTS } from '@shared/dictionaries/typeDataSerialize';
import ListTransactions from '@custom-sections/ListTransactions';
import { useDispatch, useSelector } from 'react-redux';
import { GeneralRequestService } from '@core/services/general-request.service';
import Restricted from '@custom-elements/Restricted';
import { useRoute } from '@react-navigation/native';

const generalRequestService = GeneralRequestService.getInstance();

const TAccount = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const balance = useSelector((state) => state.liveBalanceReducer);

  const [customStyleIndex, setCustomStyleIndex] = useState(0);
  const [restricted, setRestricted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const tabRef = useRef(null); // Reference to the Tabs component

  useEffect(() => {
    (async () => {
      setCustomStyleIndex(route.params?.tabIndexSelected ?? 0);
      await fetchStatements(); // Fetch initially
    })();
  }, []);

  useEffect(() => {
    if (customStyleIndex === 1) return;
    if (refreshing) {
      // Trigger tab switch on refresh
      switchTabs(); // Function to switch tabs
      setRefreshing(false); // Reset refreshing state
    }
  }, [refreshing, customStyleIndex]);

  const fetchStatements = async () => {
    const response = await generalRequestService.get(endPoints.statements);
    if (response.restricted) {
      setRestricted(true);
      setCustomStyleIndex(1);
    }
  };
  const switchTabs = () => {
    if (tabRef.current) {

      tabRef.current.changeIndexSelected(1);

      setTimeout(() => {
        tabRef.current.changeIndexSelected(0);
      }, 4000);
    } else {
      console.log("Tabs component not yet rendered or reference not assigned");
    }
  };

  const renderItemsStatement = ({ item }) => (
    <Statement statement={item} />
  );

  const renderAccountDetails = () => (
    <>
      {restricted && balance.restricted ? (
        <Restricted horizontal />
      ) : (
        <>
          <PaymentDetail />
          <Balance />
          {/* ListData component for statements if not restricted */}
          {/* {!restricted && (
            <ListData
              endpoint={endPoints.statements}
              renderItems={renderItemsStatement}
              actionData={(data) => dispatch(getStatements(data))}
              typeData={STATEMENTS}
            />
          )} */}
        </>
      )}
    </>
  );

  const renderInvoices = () => (
    <ListTransactions />
  );

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(true)} />
      }
    >
      <LiveBalance company={false} />
      <Tabs
        ref={tabRef} // Assign reference to the Tabs component
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
    </ScrollView>
  );
};

export default TAccount;