import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { sendPasswordResetEmail, getAuth } from 'firebase/auth';
import appFirebase from '../credenciales'
const auth = getAuth(appFirebase)

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
  
    const handleResetPassword = async () => {
      if (!email) {
        Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
        return;
      }
  
      Keyboard.dismiss();
      setLoading(true);
  
      try {
        await sendPasswordResetEmail(auth, email);
        Alert.alert(
          'Correo enviado',
          'Hemos enviado un enlace para restablecer tu contraseña a tu correo electrónico. Por favor revisa tu bandeja de entrada.'
        );

        navigation.goBack();
        
      } catch (error) {
        let errorMessage = 'Ocurrió un error al enviar el correo';
        
        if (error.code === 'auth/user-not-found') {
          errorMessage = 'No existe una cuenta con este correo electrónico';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'El correo electrónico no es válido';
        }
        
        Alert.alert('Error', errorMessage);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Recuperar Contraseña</Text>
        
        <Text style={styles.subtitle}>
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
        </Text>
        
        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={20} color="#666" style={styles.icon} />
          <TextInput
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleResetPassword}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Volver al inicio de sesión</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: '#666',
      marginBottom: 30,
      textAlign: 'center',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      marginBottom: 20,
      paddingHorizontal: 10,
    },
    icon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      height: 50,
    },
    button: {
      backgroundColor: '#007bff',
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginBottom: 20,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    backText: {
      color: '#007bff',
      textAlign: 'center',
      fontSize: 16,
    },
  });
  
  export default ForgotPasswordScreen;