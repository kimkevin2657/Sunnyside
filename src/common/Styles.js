import {Dimensions, Platform} from 'react-native';
import Color from './Color';

const {height, width} = Dimensions.get('window');

const FontSize = {
  mini: 7,
  small: 10,
  medium: 14,
  large: 16,
  xLarge: 20,
  xMidLarge: 25,
  xxLarge: 30,
};

const Styles = {
  width,
  height: Platform.OS !== 'ios' ? height : height - 20,
  row: {
    marginHorizontal: width * 0.05,
  },
  h1: {
    color: Color.text,
    fontSize: FontSize.xMidLarge,
    fontWeight: 'bold',
  },
  h2: {
    color: Color.text,
    fontSize: FontSize.xLarge,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: FontSize.large,
    fontWeight: '600',
    paddingVertical: 15,
    color: Color.text,
  },
  subtitle: {
    color: '#757575',
    fontSize: FontSize.medium,
    paddingBottom: 5,
  },
  ColumnCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ColumnCenterTop: {
    alignItems: 'center',
  },
  ColumnCenterBottom: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  ColumnCenterLeft: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  ColumnCenterRight: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  Wrap:{
    flex:1,
    backgroundColor:Color.background,
  },
  ScrollContainer:{
    width:'100%',
  },
};

export {FontSize, Styles};
