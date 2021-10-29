import { Magnetometer } from 'expo-sensors';
import React, { useEffect, useState } from 'react';
import { Dimensions, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import styles from './styles';

interface MagnetometerData {
  x: number;
  y: number;
  z: number;
}

export default function App() {

  const center = { x: -2, y: 6.4 };

  const [ data, setData ] = useState<MagnetometerData>( { x: 0, y: 0, z: 0 } );
  const [ subscription, setSubscription ] = useState( null );
  const [ windowCenter, setWindowCenter ] = useState( { x: 0, y: 0 } );
  const [ ballCoordinates, setBallCoordinates ] = useState( center );

  const { width, height } = Dimensions.get( "window" );

  useEffect( () => {
    setSubscription( Magnetometer.addListener( result => setData( result ) ) );
    Magnetometer.setUpdateInterval( 16 );
    setWindowCenter( { x: data.x, y: data.y } );
    return () => {
      subscription && subscription.remove();
      setSubscription( null );
    }
  }, [] );

  useEffect( () => {
    if ( Math.abs( data.x - center.x ) > 1 || Math.abs( data.y - center.y ) > 1 )
      setBallCoordinates( {
        x: Math.max( -width / 2, Math.min( width / 2, ballCoordinates.x + ( data.x - center.x ) ) ),
        y: Math.max( -height / 2, Math.min( height / 2, ballCoordinates.y + ( data.y - center.y ) ) )
      } );
  }, [ data ] )

  return (
    <View style={ styles.container }>
      <Svg viewBox={ `${ -width / 2 } ${ -height / 2 } ${ width } ${ height }` }>
        <Circle cx={ ballCoordinates.x } cy={ -ballCoordinates.y } r="10" fill="red" />
      </Svg>
    </View>
  );

};
