import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import * as Location from 'expo-location';

export default function App() {
  const [timer, setTimer] = useState(0);
  const [distance, setDistance] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [intervalId, setIntervalId] = useState(null);

  const startTracking = () => {
    setIsTracking(true);
    const id = Location.watchPositionAsync(
      (position) => {
        setDistance(calculateDistance(position.coords.latitude, position.coords.longitude));
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, distanceFilter: 10 }
    );
    setWatchId(id);
  };

  const stopTracking = () => {
    setIsTracking(false);
    if (watchId) {
      Location.stopLocationUpdatesAsync(watchId);
    }
  };

  useEffect(() => {
    if (isTracking && distance >= 100) {
      stopTracking();
    }
  }, [isTracking, distance]);

  const startTimer = () => {
    setTimer(0);
    startTracking();
    const id = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);
    setIntervalId(id);
  };

  const calculateDistance = (lat, lon) => {
    return Math.random() * 200;
  };

  const resetTimer = () => {
    setIsTracking(false);
    setTimer(0);
    setDistance(0);
  
    // Clear the location updates
    if (watchId) {
      Location.stopLocationUpdatesAsync(watchId);
      setWatchId(null);
    }
  
    // Clear the interval that updates the timer
    clearInterval(intervalId);
    setIntervalId(null);
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
