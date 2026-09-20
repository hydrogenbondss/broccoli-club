import { StyleSheet, Text, View } from 'react-native';

export default function GamesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GAMES</Text>
      <Text style={styles.body}>Your upcoming and past games will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F0E8',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    color: '#171715',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
  },
  body: {
    color: '#171715',
    fontSize: 17,
    lineHeight: 25,
    marginTop: 12,
    maxWidth: 320,
  },
});
