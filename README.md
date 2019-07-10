# React native cache image for remote urls
Cache your images in your react native app easily with width param (optional).

### Installing
```
npm install react-native-cache-image --save
- or -
yarn add react-native-cache-image
```

### Usage
```
import React from 'react';
import CacheImage from 'react-native-cache-image';

export default class Example extends React.Component
{
    render() {
        return (
            <View>
				<CacheImage style={styles.image} source={{ uri: 'https://example.com/images/1.jpg' }}/>
				<CacheImage source={{ uri: 'https://example.com/images/2.jpg', width: 500 }}/>
				<CacheImage placeholder={'Waiting...'} source={{ uri: 'https://example.com/images/3.jpg' }}/>
			</View>
        );
    }
}
```
### API

###### clear
You can clear all cached images with clear method.
Example:
```
import CacheImage from 'react-native-cache-image';

export default class Example extends React.Component
{
    componentWillUnmount()
	{
		CacheImage.clear();
	}
}
```