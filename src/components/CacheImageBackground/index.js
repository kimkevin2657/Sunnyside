import React from 'react';
import { ImageBackground, Platform } from 'react-native';
let RNFS = require('react-native-fs');
import shorthash from 'shorthash';
import ImageLoader from '../ImageLoader';

export default class CacheImageBackground extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { source: null };
    }

    loadFile = (path) => {
        this.setState({ source: { uri: path } });
    };

    downloadFile = (uri, path) => {
        RNFS.downloadFile({ fromUrl: uri, toFile: path }).promise.then((res) =>
            this.loadFile(path),
        );
    };

    componentDidMount() {
        this.initialize();
    }

    componentDidUpdate(prevProps) {
        if (this.props.source !== prevProps.source) {
            this.initialize();
        }
    }

    initialize = () => {
        if (this.props.source.uri) {
            const { uri } = this.props.source;
            const name = shorthash.unique(uri);
            const extension = Platform.OS === 'android' ? 'file://' : '';
            const path = `${extension}${RNFS.CachesDirectoryPath}/${name}.png`;
            RNFS.exists(path).then((exists) => {
                if (exists) this.loadFile(path);
                else this.downloadFile(uri, path);
            });
        } else {
            this.setState({ source: this.props.source });
        }
    };

    render() {
        return (
            <>
                {this.state.source === null ? (
                    <ImageLoader height={this.props.style.height} />
                ) : (
                    <ImageBackground
                        style={this.props.style}
                        imageStyle={this.props.imageStyle}
                        source={this.state.source}>
                        {this.props.children}
                    </ImageBackground>
                )}
            </>
        );
    }
}
