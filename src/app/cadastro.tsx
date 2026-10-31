
import { auth, db } from '@/database/firebase';
import { Link, router } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useState } from 'react';
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

export default function CadastroScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [university, setUniversity] = useState('');
  const [campus, setCampus] = useState('');
  const [loading, setLoading] = useState(false);

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
        favoriteRouteId: '',
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
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.logo}>🚌</Text>
          <Text style={styles.title}>UNIMOBI</Text>
          <Text style={styles.subtitle}>
            Crie sua conta e facilite sua mobilidade universitária
          </Text>

          <Text style={styles.label}>Nome completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome"
            placeholderTextColor="#8B93A7"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            editable={!loading}
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu email"
            placeholderTextColor="#8B93A7"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Crie uma senha com pelo menos 6 caracteres"
            placeholderTextColor="#8B93A7"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />

          <Text style={styles.label}>Confirmar senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite novamente sua senha"
            placeholderTextColor="#8B93A7"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!loading}
          />

          <Text style={styles.label}>Universidade</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua Universidade"
            placeholderTextColor="#8B93A7"
            value={university}
            onChangeText={setUniversity}
            editable={!loading}
          />

          <Text style={styles.label}>Campus</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu Campus"
            placeholderTextColor="#8B93A7"
            value={campus}
            onChangeText={setCampus}
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleCadastro}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Criar minha conta</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Já tem uma conta? </Text>
            <Link href="/login" style={styles.loginLink}>
              Entrar
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    paddingVertical: 20,
  },
  logo: {
    fontSize: 44,
    textAlign: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 3,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#A7B0C3',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 28,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#30394B',
    backgroundColor: '#151C2B',
    borderRadius: 12,
    paddingHorizontal: 15,
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 18,
  },
  button: {
    height: 54,
    backgroundColor: '#3478F6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    flexWrap: 'wrap',
  },
  loginText: {
    color: '#A7B0C3',
    fontSize: 14,
  },
  loginLink: {
    color: '#6EA1FF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
