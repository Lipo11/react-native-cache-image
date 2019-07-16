'use strict';

import React from 'react';
import { Image, View, Text, Dimensions, Platform, PixelRatio } from 'react-native';
import fs from 'react-native-fs';

const PATH = ( Platform.OS === 'android' ? 'file://' : '' ) + fs.CachesDirectoryPath + ( Platform.OS !== 'android' ? '/cache' : '' ) + '/cdn/';
const SIZES = [ 16, 32, 48, 64, 96, 128, 192, 256, 320, 384, 448, 512, 640, 768, 896, 1024, 1280, 1536, 1792, 2048 ];

function getPath( url, size = 2048 )
{
    if( typeof size === 'string' && size.indexOf('%') > -1 )
    {
        size = Dimensions.get('window').width * ( parseInt(size) / 100 );
    }

    if( size >= SIZES[SIZES.length - 1] )
    {
        size = SIZES[SIZES.length - 1];
    }
    else
    {
        for( allowed of SIZES )
        {
            if( size <= allowed )
            {
                size = allowed; break;
            }
        }
    }

    return url + '?' + size;
}

function isRemote( url )
{
    return ( url.indexOf('.') > -1 );
}

module.exports = class CDNImage extends React.PureComponent
{
	constructor( props )
    {
		super( props );

		this._mounted = false;
		this._jobID = null;
		this._isRemote = isRemote( props.source.uri );

		let path;
        if( this._isRemote ){ path = ( Boolean(props.source.width) ? getPath( props.source.uri, PixelRatio.roundToNearestPixel(props.source.width) ) : props.source.uri ); }
        else{ path = props.source.uri; }

        delete props.source;

        this.state = { path, key : this._key() };
	}

	componentWillMount()
	{
		this._mounted = true;
	}

	componentWillUnmount()
    {
        this._mounted = false;

        if( this._jobID )
        {
            fs.stopDownload( this._jobID );
        }
    }

	_key()
	{
		return ( new Date() ).getTime().toString(16)+( Math.floor( Math.random() * 1000 ) ).toString(8);
	}

	static clear()
    {
        return fs.unlink( PATH );
    }

	render()
    {
		if( Boolean( this.props.placeholder ) )
		{
			return (
                <View style={ [ ...this.props.style, {  backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' } ] }>
                    <Text style={this.props.placeholderStyle}>{this.props.placeholder}</Text>
                </View>
            );
		}
		else
		{
			return (
                <Image {...this.props}
                    key={this.state.key}
                    source={{ uri: ( this.state.path.indexOf('.') > -1 ? PATH + this.state.path.replace(/(\.[a-zA-Z]+)\?([0-9]+)$/, '-$2$1') : this.state.path ) }}
                    onError={ this._onError.bind(this) } />
            );
		}
    }

	_onError()
	{
		this._downloadImage();
	}

	_downloadImage()
    {
		let statePath = this.state.path;

        fs.mkdir(( PATH + statePath ).replace(/\/[^\/]+$/, ''), { NSURLIsExcludedFromBackupKey: false }).then( r =>
        {
            const download = fs.downloadFile(
            {
                fromUrl: statePath,
                toFile: PATH + statePath.replace(/(\.[a-zA-Z]+)\?([0-9]+)$/, '-$2$1')
            });

            this._jobID = download.jobId;

            download.promise.then( result =>
            {
                this._jobID = null;

                if( this._mounted && result.statusCode === 200 && result.bytesWritten > 0 )
                {
                    this.setState({ key: this._key() });
                }
            });
        });
    }
}