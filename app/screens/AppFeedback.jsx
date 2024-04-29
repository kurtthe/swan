import React from 'react';
import { StyleSheet, View } from 'react-native';
import WebViewComponent from '@custom-elements/WebView';

const AppFeedback = () => {
  return (
    <View style={styles.webViewContainer}>
      <WebViewComponent url="https://links.trak.co/burdens/feedback.html" />
    </View>
  );
};

const styles = StyleSheet.create({
  webViewContainer: {
    flex: 1,
  },
});

export default AppFeedback;
