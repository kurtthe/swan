import React from 'react';
import {Dimensions,  StyleSheet} from 'react-native';
import { Icon, Input } from '@components';
// @ts-ignore
import { Block, theme } from 'galio-framework';
const { width } = Dimensions.get('screen');

type Props = {
  placeholder: any;
  onChangeText: any;
  style: any;
  inputStyle: any;
}
const Search: React.FC<Props> = ({
                  placeholder = 'Search',
                  onChangeText,
                  style,
                  inputStyle,
  ...props
}) =>  {
    return (
      <Block flex center style={[styles.searchContainer, style]}>
          <Input
            {...props}
            right
            color="#000000"
            autoFocus={false}
            autoCorrect={false}
            autoCapitalize="none"
            iconContent={
                <Icon size={16} color={theme.COLORS.BLACK} name="magnifying-glass" family="entypo" />
            }
            style={[styles.search, inputStyle]}
            placeholder={placeholder}
            onChangeText={(text) => onChangeText(text)}
          />
      </Block>
    );
}

const styles = StyleSheet.create({
  searchContainer: {
    width: width,
    paddingHorizontal: theme.SIZES.BASE,
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: theme.SIZES.BASE,
    borderRadius: 30,
  },
});

export default Search;
