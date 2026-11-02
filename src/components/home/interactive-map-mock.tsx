import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface InteractiveMapMockProps {
  onSelectBus?: (code: string) => void;
}

export function InteractiveMapMock({ onSelectBus }: InteractiveMapMockProps) {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.15, 1.4));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.15, 0.85));
  };

  return (
    <View style={styles.container}>
      {/* Background Map Grid & Roads graphic */}
      <View
        style={[
          styles.mapCanvas,
          { transform: [{ scale: zoomLevel }] },
        ]}
      >
        {/* Subtle grid and decorative avenue paths */}
        <View style={styles.gridOverlay}>
          <View style={styles.gridLineHorizontal1} />
          <View style={styles.gridLineHorizontal2} />
          <View style={styles.gridLineVertical1} />
          <View style={styles.gridLineVertical2} />
        </View>

        {/* Route Lines Drawn */}
        {/* Yellow Branch Line */}
        <View style={styles.yellowLineSegment} />
        <View style={[styles.stopHalo, styles.yellowStop1]}>
          <View style={[styles.stopInner, { backgroundColor: '#F59E0B' }]} />
        </View>
        <View style={[styles.stopHalo, styles.yellowStop2]}>
          <View style={[styles.stopInner, { backgroundColor: '#F59E0B' }]} />
        </View>
        <View style={[styles.stopHalo, styles.yellowStop3]}>
          <View style={[styles.stopInner, { backgroundColor: '#F59E0B' }]} />
        </View>

        {/* Blue Main Route Line */}
        <View style={styles.blueLineSegment1} />
        <View style={styles.blueLineSegment2} />

        {/* Main Central Stop (Current / Highlighted Stop with Pulse) */}
        <View style={styles.mainUserStopHalo}>
          <View style={styles.mainUserStopMiddle}>
            <View style={styles.mainUserStopCore} />
          </View>
        </View>

        {/* Upper stops along the coast */}
        <View style={[styles.stopHalo, styles.blueStop1]}>
          <View style={[styles.stopInner, { backgroundColor: '#38BDF8' }]} />
        </View>
        <View style={[styles.stopHalo, styles.blueStop2]}>
          <View style={[styles.stopInner, { backgroundColor: '#38BDF8' }]} />
        </View>

        {/* Live Bus Pins / Badges */}
        {/* Bus 1: B-RL-03 (Purple) */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.busMarkerPurple}
          onPress={() => onSelectBus?.('B-RL-03')}
        >
          <View style={styles.busCalloutPurple}>
            <Text style={styles.busCalloutText}>🚌 B-RL-03</Text>
          </View>
          <View style={styles.calloutArrowPurple} />
        </TouchableOpacity>

        {/* Bus 2: B-BSA-02 (Blue/Green) */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.busMarkerTeal}
          onPress={() => onSelectBus?.('B-BSA-02')}
        >
          <View style={styles.busCalloutTeal}>
            <Text style={styles.busCalloutTextTeal}>🚌 B-BSA-02</Text>
          </View>
          <View style={styles.calloutArrowTeal} />
        </TouchableOpacity>
      </View>

      {/* Floating Zoom Controls (+ / -) */}
      <View style={styles.zoomControls}>
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={handleZoomIn}
          activeOpacity={0.7}
        >
          <Text style={styles.zoomButtonText}>+</Text>
        </TouchableOpacity>
        <View style={styles.zoomDivider} />
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={handleZoomOut}
          activeOpacity={0.7}
        >
          <Text style={styles.zoomButtonText}>−</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
    overflow: 'hidden',
  },
  mapCanvas: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFill,
    opacity: 0.1,
  },
  gridLineHorizontal1: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#38BDF8',
  },
  gridLineHorizontal2: {
    position: 'absolute',
    top: '65%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#38BDF8',
  },
  gridLineVertical1: {
    position: 'absolute',
    left: '28%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#38BDF8',
  },
  gridLineVertical2: {
    position: 'absolute',
    left: '70%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#38BDF8',
  },

  /* Route Segments */
  yellowLineSegment: {
    position: 'absolute',
    width: 90,
    height: 3,
    backgroundColor: 'rgba(245, 158, 11, 0.45)',
    transform: [{ rotate: '-45deg' }],
    left: '26%',
    top: '49%',
  },
  blueLineSegment1: {
    position: 'absolute',
    width: 130,
    height: 3,
    backgroundColor: 'rgba(56, 189, 248, 0.55)',
    transform: [{ rotate: '-55deg' }],
    left: '42%',
    top: '41%',
  },
  blueLineSegment2: {
    position: 'absolute',
    width: 90,
    height: 3,
    backgroundColor: 'rgba(56, 189, 248, 0.55)',
    transform: [{ rotate: '42deg' }],
    left: '52%',
    top: '34%',
  },

  /* Stops */
  stopHalo: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  stopInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  yellowStop1: {
    left: '23%',
    top: '52%',
    borderColor: 'rgba(245, 158, 11, 0.8)',
  },
  yellowStop2: {
    left: '28%',
    top: '48%',
    borderColor: 'rgba(245, 158, 11, 0.8)',
  },
  yellowStop3: {
    left: '36%',
    top: '46%',
    borderColor: 'rgba(245, 158, 11, 0.8)',
  },

  /* Main User Stop */
  mainUserStopHalo: {
    position: 'absolute',
    left: '40%',
    top: '43%',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(56, 189, 248, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainUserStopMiddle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainUserStopCore: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0284C7',
  },

  blueStop1: {
    left: '58%',
    top: '32%',
    borderColor: 'rgba(56, 189, 248, 0.8)',
  },
  blueStop2: {
    left: '64%',
    top: '35%',
    borderColor: 'rgba(56, 189, 248, 0.8)',
  },

  /* Bus Callouts */
  busMarkerPurple: {
    position: 'absolute',
    left: '27%',
    top: '39%',
    alignItems: 'center',
  },
  busCalloutPurple: {
    backgroundColor: '#D8B4FE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 5,
  },
  calloutArrowPurple: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#D8B4FE',
  },
  busCalloutText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#3B0764',
  },

  busMarkerTeal: {
    position: 'absolute',
    left: '46%',
    top: '38%',
    alignItems: 'center',
  },
  busCalloutTeal: {
    backgroundColor: '#7DD3FC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 5,
  },
  calloutArrowTeal: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#7DD3FC',
  },
  busCalloutTextTeal: {
    fontSize: 11,
    fontWeight: '800',
    color: '#082F49',
  },

  /* Floating Zoom Controls */
  zoomControls: {
    position: 'absolute',
    right: 18,
    top: '42%',
    backgroundColor: '#151D2C',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  zoomButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  zoomDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
});
