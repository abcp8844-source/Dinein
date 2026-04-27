import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { initializeApp } from 'firebase/app';

// Your Firebase configuration (Saved from your previous setup)
const firebaseConfig = {
  apiKey: "AIzaSyAs-v6A_H8l1pGzXz_Xf6M0v1u2Y3Z4",
  authDomain: "dining-table-app.firebaseapp.com",
  projectId: "dining-table-app",
  storageBucket: "dining-table-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dining Table App</Text>
      <Text>Firebase is connected and build is working!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
