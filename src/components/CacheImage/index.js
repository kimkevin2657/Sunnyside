import React from 'react';
import {Image, Platform} from 'react-native';
let RNFS = require('react-native-fs');
import shorthash from 'shorthash';
import ImageLoader from '../ImageLoader';

export default class CacheImage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      source: !this.props.source.uri ? this.props.source : null,
    };
  }

  loadFile = (path) => {
    if (this.mounted) {
      this.setState({source: {uri: path}});
    }
  };

  downloadFile = (uri, path) => {
    RNFS.downloadFile({
      fromUrl: encodeURI(uri),
      toFile: path,
    }).promise.then((res) => this.loadFile(path));
  };

  componentDidMount() {
    this.mounted = true;
    this.initialize();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidUpdate(prevProps) {
    if (this.props.source !== prevProps.source) {
      this.initialize();
    }
  }

  initialize = () => {
    if (this.props.source.uri) {
      const {uri} = this.props.source;
      const name = shorthash.unique(uri);
      const extension = Platform.OS === 'android' ? 'file://' : '';
      const path = `${extension}${RNFS.CachesDirectoryPath}/${name}.png`;
      RNFS.exists(path).then((exists) => {
        if (exists) this.loadFile(path);
        else this.downloadFile(uri, path);
      });
    } else {
      if (this.mounted) {
        this.setState({source: this.props.source});
      }
    }
  };

  render() {
    return (
      <>
        {this.state.source === null ? (
          <ImageLoader height={this.props.style.height} />
        ) : (
          <Image
            resizeMode={this.props.resizeMode ? this.props.resizeMode : 'cover'}
            style={this.props.style}
            source={this.state.source}
          />
        )}
      </>
    );
  }
}
