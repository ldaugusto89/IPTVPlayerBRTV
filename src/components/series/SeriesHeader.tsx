import React from 'react';
import { Text, StyleSheet, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface SeriesHeaderProps {
  seriesName: string;
  seriesLogo?: string;
}

const SeriesHeader: React.FC<SeriesHeaderProps> = ({ seriesName, seriesLogo }) => (
  <ImageBackground source={{ uri: seriesLogo }} style={styles.header} blurRadius={10}>
    <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.headerGradient} />
    <Text style={styles.seriesTitle}>{seriesName}</Text>
  </ImageBackground>
);

const styles = StyleSheet.create({
  header: { height: 250, justifyContent: 'flex-end', padding: 20 },
  headerGradient: { ...StyleSheet.absoluteFillObject },
  seriesTitle: { color: '#fff', fontSize: 32, fontWeight: 'bold', textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 10 },
});

export default SeriesHeader;