import { auth } from '@/database/firebase';
import { Link, router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert('Atenção', 'Preencha o e-mail e a senha.');
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      router.replace('/');
    } catch (error: any) {
      console.error('Erro no login:', error);

      let message = 'Não foi possível entrar. Tente novamente.';

      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password'
      ) {
        message = 'E-mail ou senha incorretos.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Digite um endereço de e-mail válido.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Muitas tentativas. Aguarde um pouco e tente novamente.';
      }

      Alert.alert('Erro no login', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🚌</Text>
        </View>

        <Text style={styles.title}>UNIMOBI</Text>

        <Text style={styles.subtitle}>
          Sua mobilidade universitária em um só lugar
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>E-mail</Text>

          <TextInput
            style={styles.input}
            placeholder="seuemail@universidade.edu.br"
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
            placeholder="Digite sua senha"
            placeholderTextColor="#8B93A7"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            editable={!loading}
            onSubmitEditing={handleLogin}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Ainda não tem uma conta?{' '}
            </Text>

            <Link href="/cadastro" style={styles.registerLink}>
              Criar conta
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  logoContainer: {
    width: 84,
    height: 84,
    borderRadius: 24,
    backgroundColor: '#17243A',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  logo: {
    fontSize: 42,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 15,
    color: '#A7B0C3',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 36,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#30394B',
    backgroundColor: '#151C2B',
    borderRadius: 12,
    paddingHorizontal: 15,
    color: '#FFFFFF',
    fontSize: 15,
    marginBottom: 20,
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
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 26,
  },
  registerText: {
    color: '#A7B0C3',
    fontSize: 14,
  },
  registerLink: {
    color: '#6EA1FF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});