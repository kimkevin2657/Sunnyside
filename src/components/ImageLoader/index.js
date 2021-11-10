import React from 'react';
import ContentLoader from 'react-native-content-loader';
import {Rect} from 'react-native-svg';
import {Color} from '@common';

export default class ImageLoader extends React.PureComponent {
  render() {
    const {height} = this.props;
    return (
      <ContentLoader
        height={height}
        width={'100%'}
        primaryColor={Color.loadingPrimary}
        secondaryColor={Color.loadingSecundary}
        duration={1000}>
        <Rect x="0" y="0" rx="10" ry="10" width="100%" height={height} />
      </ContentLoader>
    );
  }
}
