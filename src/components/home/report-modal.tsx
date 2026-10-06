import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Route, Stop } from '@/data/routes';

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  route: Route;
  onSubmit: (report: { stopName: string; crowdLevel: number; comment?: string }) => void;
}

export function ReportModal({ visible, onClose, route, onSubmit }: ReportModalProps) {
  const [selectedStop, setSelectedStop] = useState<string>(route.stops[0]?.name || '');
  const [crowdPick, setCrowdPick] = useState<'vazio' | 'moderado' | 'lotado'>('moderado');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSend = () => {
    const crowdLevel = crowdPick === 'vazio' ? 25 : crowdPick === 'moderado' ? 60 : 90;
    onSubmit({
      stopName: selectedStop || route.stops[0].name,
      crowdLevel,
      comment: comment.trim() || undefined,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setComment('');
      onClose();
    }, 1200);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          {submitted ? (
            <View style={styles.successContainer}>
              <View style={[styles.successIconCircle, { backgroundColor: `${route.color}25` }]}>
                <Ionicons name="checkmark-circle" size={54} color={route.color} />
              </View>
              <Text style={styles.successTitle}>Relato Enviado!</Text>
              <Text style={styles.successDesc}>
                Obrigado por ajudar seus colegas universitários com informações em tempo real.
              </Text>
            </View>
          ) : (
            <>
              {/* Header */}
              <View style={styles.header}>
                <View>
                  <Text style={styles.title}>Reportar Ônibus</Text>
                  <Text style={styles.subtitle}>{route.name}</Text>
                </View>
                <TouchableOpacity onPress={onClose} hitSlop={12} style={styles.closeBtn}>
                  <Ionicons name="close" size={20} color="#8b949e" />
                </TouchableOpacity>
              </View>

              {/* Stop Selector */}
              <View style={styles.fieldSection}>
                <Text style={styles.fieldLabel}>Onde o ônibus está passando?</Text>
                <View style={styles.stopsList}>
                  {route.stops.slice(0, 4).map((stop) => {
                    const isSelected = selectedStop === stop.name;
                    return (
                      <TouchableOpacity
                        key={stop.name}
                        onPress={() => setSelectedStop(stop.name)}
                        style={[
                          styles.stopChip,
                          isSelected && { borderColor: route.color, backgroundColor: `${route.color}20` },
                        ]}
                      >
                        <Ionicons
                          name="location"
                          size={14}
                          color={isSelected ? route.color : '#8b949e'}
                        />
                        <Text
                          style={[
                            styles.stopChipText,
                            isSelected && { color: '#e6edf3', fontWeight: '700' },
                          ]}
                          numberOfLines={1}
                        >
                          {stop.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Crowd Selector */}
              <View style={styles.fieldSection}>
                <Text style={styles.fieldLabel}>Qual a lotação no momento?</Text>
                <View style={styles.crowdRow}>
                  {[
                    { key: 'vazio', label: 'Vazio', color: '#3fb950', icon: 'happy-outline' },
                    { key: 'moderado', label: 'Moderado', color: '#e3b341', icon: 'people-outline' },
                    { key: 'lotado', label: 'Lotado', color: '#f85149', icon: 'warning-outline' },
                  ].map((item) => {
                    const isSelected = crowdPick === item.key;
                    return (
                      <TouchableOpacity
                        key={item.key}
                        onPress={() => setCrowdPick(item.key as any)}
                        style={[
                          styles.crowdBtn,
                          isSelected && {
                            borderColor: item.color,
                            backgroundColor: `${item.color}22`,
                          },
                        ]}
                      >
                        <Ionicons
                          name={item.icon as any}
                          size={20}
                          color={isSelected ? item.color : '#8b949e'}
                        />
                        <Text
                          style={[
                            styles.crowdBtnText,
                            isSelected && { color: item.color, fontWeight: '700' },
                          ]}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Optional Comment */}
              <View style={styles.fieldSection}>
                <Text style={styles.fieldLabel}>Observação adicional (opcional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Trânsito intenso, parada lotada..."
                  placeholderTextColor="#484f58"
                  value={comment}
                  onChangeText={setComment}
                  maxLength={70}
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSend}
                style={[styles.submitBtn, { backgroundColor: route.color }]}
                activeOpacity={0.85}
              >
                <Text style={styles.submitBtnText}>Enviar Relato</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#161b22',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#30363d',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e6edf3',
  },
  subtitle: {
    fontSize: 13,
    color: '#8b949e',
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  fieldSection: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8b949e',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stopsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  stopChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#30363d',
    backgroundColor: '#0d1117',
    maxWidth: '48%',
  },
  stopChipText: {
    fontSize: 11,
    color: '#8b949e',
  },
  crowdRow: {
    flexDirection: 'row',
    gap: 8,
  },
  crowdBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#30363d',
    backgroundColor: '#0d1117',
  },
  crowdBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8b949e',
  },
  input: {
    backgroundColor: '#0d1117',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#e6edf3',
  },
  submitBtn: {
    marginTop: 4,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#0d1117',
    fontSize: 14,
    fontWeight: '700',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 12,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e6edf3',
    marginBottom: 8,
  },
  successDesc: {
    fontSize: 13,
    color: '#8b949e',
    textAlign: 'center',
    lineHeight: 18,
  },
});
