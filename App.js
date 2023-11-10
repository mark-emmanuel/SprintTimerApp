import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import Geolocation from '@react-native-community/geolocation';

export default function App() {
  const [timer, setTimer] = useState(0);
  const [distance, setDistance] = useState(0);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    let watchId;

    const startTracking = () => {
      setIsTracking(true);
      watchId = Geolocation.watchPosition(
        (position) => {
          // Update distance calculation based on new location
          setDistance(calculateDistance(position.coords.latitude, position.coords.longitude));
        },
        (error) => console.log(error),
        { enableHighAccuracy: true, distanceFilter: 10 } // Adjust the distance filter as needed
      );
    };

    const stopTracking = () => {
      setIsTracking(false);
      Geolocation.clearWatch(watchId);
      // You can add additional logic here if needed
    };

    if (isTracking && distance >= 100) {
      stopTracking();
    }

    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, [isTracking, distance]);

  const startTimer = () => {
    setTimer(0);
    startTracking();
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);
  };

  const calculateDistance = (lat, lon) => {
    // You need to implement a distance calculation algorithm based on latitude and longitude
    // This is a simplified example using a dummy function
    return Math.random() * 200; // Replace with actual distance calculation
  };

  const resetTimer = () => {
    setIsTracking(false);
    setTimer(0);
    setDistance(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.timerText}>{formatTime(timer)}</Text>
      <Card style={styles.card}>
        <TouchableOpacity style={styles.button} onPress={startTimer}>
          <Text style={styles.buttonText}>Ready</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={resetTimer}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </Card>
    </SafeAreaView>
  );
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 16,
  },
  card: {
    alignItems: 'center',
    padding: 24,
    marginTop: 20,
  },
  timerText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
