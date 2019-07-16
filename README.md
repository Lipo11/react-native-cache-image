# React native cdn image for remote urls
Cache your images in your react native app easily with width param (optional).

### Installing
```
npm install react-native-cdn-image --save
- or -
yarn add react-native-cdn-image
```

### Usage
```
import React from 'react';
import CDNImage from 'react-native-cdn-image';

export default class Example extends React.Component
{
    render() {
        return (
            <View>
				<CDNImage style={styles.image} source={{ uri: 'https://example.com/images/1.jpg' }}/>
				<CDNImage source={{ uri: 'https://example.com/images/2.jpg', width: 500 }}/>
				<CDNImage placeholder={'Waiting...'} source={{ uri: 'https://example.com/images/3.jpg' }}/>
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
import CDNImage from 'react-native-cdn-image';

export default class Example extends React.Component
{
    componentWillUnmount()
	{
		CDNImage.clear();
	}
}
```