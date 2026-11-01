import { auth, db } from '@/database/firebase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const UNIVERSITIES_LIST = [
  { id: 'UFAL', name: 'UFAL — Universidade Federal de Alagoas', defaultCampus: 'Campus A.C. Simões' },
  { id: 'CESMAC', name: 'CESMAC — Centro Universitário', defaultCampus: 'Campus I - Farol' },
  { id: 'UNIMA', name: 'UNIMA (Afya) — Centro Universitário de Maceió', defaultCampus: 'Campus Cruz das Almas' },
  { id: 'IFAL', name: 'IFAL — Inst. Federal de Alagoas', defaultCampus: 'Campus Maceió' },
  { id: 'UNIT', name: 'UNIT — Centro Universitário Tiradentes', defaultCampus: 'Campus Cruz das Almas' },
  { id: 'UNEAL', name: 'UNEAL — Univ. Estadual de Alagoas', defaultCampus: 'Campus I' },
  { id: 'OUTRA', name: 'Outra Instituição', defaultCampus: 'Maceió' },
];

export default function CadastroScreen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [university, setUniversity] = useState('UFAL');
  const [campus, setCampus] = useState('Campus A.C. Simões');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedUni = UNIVERSITIES_LIST.find((u) => u.id === university) || UNIVERSITIES_LIST[0];

  const handleSelectUniversity = (uni: typeof UNIVERSITIES_LIST[0]) => {
    setUniversity(uni.id);
    if (!campus || campus === selectedUni.defaultCampus) {
      setCampus(uni.defaultCampus);
    }
    setIsDropdownOpen(false);
  };

  async function handleCadastro() {
    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword ||
      !university.trim() ||
      !campus.trim()
    ) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Senha inválida', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Senhas diferentes', 'As senhas não coincidem. Verifique e tente novamente.');
      return;
    }

    try {
      setLoading(true);

      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await updateProfile(credential.user, {
        displayName: name.trim(),
      });

      await setDoc(doc(db, 'users', credential.user.uid), {
        id: credential.user.uid,
        name: name.trim(),
        email: email.trim(),
        university: university.trim(),
        campus: campus.trim(),
        favoriteRouteId: 'paripueira',
        points: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      Alert.alert(
        'Conta criada!',
        'Sua conta UNIMOBI foi criada com sucesso.',
        [
          {
            text: 'Continuar',
            onPress: () => router.replace('/'),
          },
        ]
      );
    } catch (error: any) {
      console.error('Erro no cadastro:', error);

      let message = 'Não foi possível criar a conta. Tente novamente.';

      if (error.code === 'auth/email-already-in-use') {
        message = 'Este e-mail já está cadastrado.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Digite um endereço de e-mail válido.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Escolha uma senha mais forte, com pelo menos 6 caracteres.';
      } else if (error.code === 'permission-denied') {
        message =
          'A conta foi criada, mas o Firestore não permitiu salvar o perfil. Precisamos configurar as regras do banco.';
      }

      Alert.alert('Erro no cadastro', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Top Brand / Header */}
          <View style={styles.brandContainer}>
            <View style={styles.logoBadge}>
              <Ionicons name="bus" size={32} color="#22C55E" />
            </View>
            <Text style={styles.title}>UNIMOBI</Text>
            <Text style={styles.subtitle}>
              Crie sua conta para acessar horários e reportar lotações
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            <Text style={styles.cardHeading}>Criar nova conta</Text>

            {/* Nome */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nome completo</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={18} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Seu nome"
                  placeholderTextColor="#64748B"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  editable={!loading}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>E-mail</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={18} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="exemplo@universidade.edu.br"
                  placeholderTextColor="#64748B"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Senha */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Senha (mínimo 6 dígitos)</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={18} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Crie uma senha"
                  placeholderTextColor="#64748B"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword((p) => !p)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirmar Senha */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Confirmar senha</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="shield-checkmark-outline" size={18} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Repita sua senha"
                  placeholderTextColor="#64748B"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Dropdown de Universidade */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Universidade / Faculdade</Text>
              <TouchableOpacity
                style={styles.dropdownTrigger}
                activeOpacity={0.8}
                onPress={() => setIsDropdownOpen((prev) => !prev)}
              >
                <View style={styles.dropdownLeft}>
                  <Ionicons name="school-outline" size={18} color="#22C55E" style={styles.inputIcon} />
                  <Text style={styles.dropdownSelectedText}>{selectedUni.name}</Text>
                </View>
                <Ionicons
                  name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color="#94A3B8"
                />
              </TouchableOpacity>

              {/* Lista expandida do dropdown */}
              {isDropdownOpen && (
                <View style={styles.dropdownList}>
                  {UNIVERSITIES_LIST.map((uni) => {
                    const isSelected = university === uni.id;
                    return (
                      <TouchableOpacity
                        key={uni.id}
                        style={[styles.dropdownItem, isSelected && styles.dropdownItemSelected]}
                        onPress={() => handleSelectUniversity(uni)}
                      >
                        <Text style={[styles.dropdownItemText, isSelected && styles.dropdownItemTextActive]}>
                          {uni.name}
                        </Text>
                        {isSelected && (
                          <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            {/* Campus */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Campus / Unidade</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={18} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Campus A.C. Simões ou Farol"
                  placeholderTextColor="#64748B"
                  value={campus}
                  onChangeText={setCampus}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Botão de Cadastro */}
            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={handleCadastro}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#0B0F19" />
              ) : (
                <View style={styles.buttonInner}>
                  <Text style={styles.primaryButtonText}>Criar minha conta</Text>
                  <Ionicons name="arrow-forward" size={18} color="#0B0F19" />
                </View>
              )}
            </TouchableOpacity>

            {/* Link para Login */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Já tem uma conta? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.loginLink}>Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  content: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(34, 197, 94, 0.14)',
    borderWidth: 1.5,
    borderColor: 'rgba(34, 197, 94, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 2.5,
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 16,
    lineHeight: 18,
  },
  card: {
    backgroundColor: '#131A29',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  cardHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 18,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#0B0F19',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#F8FAFC',
    fontSize: 14,
  },
  eyeButton: {
    padding: 4,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 50,
    backgroundColor: '#0B0F19',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  dropdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  dropdownSelectedText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  dropdownList: {
    marginTop: 6,
    backgroundColor: '#0B0F19',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  dropdownItemSelected: {
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
  },
  dropdownItemText: {
    color: '#94A3B8',
    fontSize: 13,
    flex: 1,
  },
  dropdownItemTextActive: {
    color: '#22C55E',
    fontWeight: '700',
  },
  primaryButton: {
    height: 52,
    backgroundColor: '#22C55E',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#0B0F19',
    fontSize: 16,
    fontWeight: '700',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  loginLink: {
    color: '#22C55E',
    fontSize: 14,
    fontWeight: '700',
  },
});
