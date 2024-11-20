import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Pressable,
  View,
  Platform,
  Linking,
} from 'react-native';
import { Block, theme, Text } from 'galio-framework';
import { Button } from '@components';
import ListInvoices from '@custom-sections/ListInvoices';
import ListNews from '@custom-sections/ListNews';
import LiveBalance from '@custom-sections/LiveBalance';
import { nowTheme } from '@constants';
import Toast from 'react-native-toast-message';
import { GeneralRequestService } from '@core/services/general-request.service';
import { endPoints } from '@shared/dictionaries/end-points';
import { expo } from '../../app.config.js';
import Search from '@custom-elements/Search';
import { Icon } from '../components';

const { width } = Dimensions.get('screen');
const generalRequestService = GeneralRequestService.getInstance();

class Home extends Component {
  state = {
    refreshing: false,
    textSearch: '',
    liveBalance: null,
    invoices: [],
    news: [],
  };

  async componentDidMount() {
    await this.fetchData();

    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.fetchData(); // Re-fetch data when the screen is focused
    });
  }

  componentWillUnmount() {
    // Remove the focus listener to avoid memory leaks
    if (this.focusListener) {
      this.focusListener();
    }
  }

  fetchData = async () => {
    this.setState({ refreshing: true });
    try {
      // Llamadas directas a los endpoints usando generalRequestService
      const [liveBalance, invoices, news, versionResponse] = await Promise.all([
        generalRequestService.get(endPoints.burdensBalance),
        generalRequestService.get(endPoints.searchInvoices),
        generalRequestService.get(endPoints.news),
        generalRequestService.get(endPoints.swanVersion),
      ]);

      this.setState({ liveBalance, invoices, news });

      // Verificar si hay una versión nueva de la app
      if (versionResponse.latestVersion !== expo.version) {
        this.showUpdateToast();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      this.setState({ refreshing: false });
    }
  };

  showUpdateToast = () => {
    Toast.show({
      type: 'success',
      text1: 'An update to the app is available',
      text2: 'A new version is available. Tap here to update.',
      position: 'bottom',
      visibilityTime: 10000,
      autoHide: false,
      onPress: this.handleUpdatePress,
    });
  };

  handleUpdatePress = () => {
    const appStoreUrl =
      Platform.OS === 'android'
        ? 'https://play.google.com/store/apps/details?id=com.splumbings.Swan&hl=en_US&pli=1'
        : 'https://apps.apple.com/au/app/swan-plumbing/id6503719329';
    Linking.openURL(appStoreUrl).catch((err) => console.error('An error occurred', err));
  };

  handleSearch = (text) => {
    if (text) {
      this.props.navigation.navigate('SearchProductsHome', { text });
    }
  };

  render() {
    const { navigation } = this.props;
    const { refreshing, liveBalance, invoices, news, textSearch } = this.state;

    return (
      <Block flex center style={styles.home}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.articles}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.fetchData} />}
        >
          <LiveBalance company={true} data={liveBalance} />

          <View style={{ justifyContent: 'center', alignItems: 'center', top: 8 }}>
            <Search
              placeholder="What are you looking for?"
              onChangeText={(text) => this.setState({ textSearch: text })}
              onSubmitEditing={() => this.handleSearch(textSearch)}
              style={styles.search}
              inputStyle={styles.searchInput}
            />
            <Pressable
              onPress={() => this.handleSearch(textSearch)}
              style={{
                height: 48,
                width: 90,
                position: 'absolute',
                backgroundColor: nowTheme.COLORS.INFO,
                right: 15,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottomRightRadius: 5,
                borderTopRightRadius: 5,
              }}
            >
              <Icon family="NowExtra" size={15} name="zoom-bold2x" color="#FFF" />
              <Text style={{ color: '#fff' }}>Search</Text>
            </Pressable>
          </View>

          <Button
            color="info"
            textStyle={{ fontFamily: 'montserrat-bold', fontSize: 16 }}
            style={styles.button}
            onPress={() => navigation.navigate('Store')}
          >
            Store Finder
          </Button>

          <ListInvoices data={invoices} />

          <Block style={styles.cardHeader}>
            <Block row middle space="between" style={{ paddingLeft: 15, marginTop: 5 }}>
              <Text size={18} style={{ fontFamily: 'montserrat-bold' }} color="#363C4A">
                Swan News
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('AllNews')}>
                <Text size={15} style={{ fontFamily: 'montserrat-regular', color: nowTheme.COLORS.INFO }}>
                  See all
                </Text>
              </TouchableOpacity>
            </Block>
          </Block>
          <Block flex>
            <ListNews news={news} />

            <Block center style={{ paddingVertical: 15 }}>
              <Button
                color="info"
                textStyle={{ fontFamily: 'montserrat-bold', fontSize: 16 }}
                style={styles.buttonEstimator}
                onPress={() => navigation.navigate('BookTrakDemo')}
              >
                Book a Trak Demo
              </Button>
            </Block>
          </Block>
          <Block center style={{ paddingVertical: 50 }}>
            <Text style={{ color: 'grey', bottom: 65 }}>Version {expo.version}</Text>
          </Block>
        </ScrollView>
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,
    backgroundColor: '#FFFFFF',
  },
  articles: {
    width: width - theme.SIZES.BASE * 0.1,
    paddingHorizontal: 0,
    fontFamily: 'montserrat-regular',
  },
  button: {
    alignItems: 'center',
    margin: theme.SIZES.BASE,
    width: width - theme.SIZES.BASE * 2,
  },
  buttonEstimator: {
    top: -15,
    marginButton: theme.SIZES.BASE,
    width: width - theme.SIZES.BASE * 2,
  },
  cardHeader: {
    justifyContent: 'center',
    height: '4%',
  },
  searchInput: {
    color: '#000000',
    fontSize: 16,
    borderRadius: 5,
    borderColor: '#D9D9D9',
    borderWidth: 2,
  },
  search: {
    width: width - 32,
    marginHorizontal: theme.SIZES.BASE,
    borderRadius: 30,
  },
});

export default Home;