import {  StatusBar } from 'react-native';
// @ts-ignore
import { theme } from 'galio-framework';

export const StatusHeight = StatusBar.currentHeight;
export const HeaderHeight = theme.SIZES.BASE * 3.5 + (StatusHeight || 0);
