import React, { useState, useEffect } from 'react'
import { Text, StyleSheet, View, Image, TextInput, TouchableOpacity, ToastAndroid } from 'react-native'
//Es to hace posible la autenticacion con el correo electronico para logearse, con Firebase y Correos
import appFirebase from '../credenciales'
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth'
const auth = getAuth(appFirebase)
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';


export default function Login(props) {
    //Ceramos la variable de estado
    const [email, setEmail] = useState();
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigation = useNavigation();
    const toggleShowPassword = () => {
      setShowPassword(!showPassword);
    };
    const logueo = async()=> {
        try {
            await signInWithEmailAndPassword(auth, email, password)
            ToastAndroid.show('Accediendo...', ToastAndroid.SHORT);
            props.navigation.navigate('HomeEstudiante')
        } catch (err) {
            console.log(err)
            ToastAndroid.show('Por favor, completa bien los campos', ToastAndroid.SHORT);
        }
    }
    
    const handleRegister = async () => {
      props.navigation.navigate('Registro')
      };
    const handleResetPassword = async () => {
      props.navigation.navigate('RecuperarPass')
      };

      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (!user) {
            // Si no hay usuario autenticado, limpiamos los campos
            setEmail('');
            setPassword('');
          }
        });
    
        return unsubscribe;
      }, []);
    

    return (
      <View style={styles.padre}>
            
            <View>
            <Text style={styles.cajaTextoTitulo}> </Text>
            </View>
           <View>
             <Image source={require('../assets/LogoApp2.png')} style={styles.profile}/>
           </View>

           <View style={styles.tarjeta}>
                <View style={styles.cajaTexto}>
                    <TextInput placeholder='Correo@miumg.edu.gt' style={{paddingHorizontal:15}} 
                    onChangeText={(text)=>setEmail(text)} />
                </View>

                <View style={styles.cajaContrasena}>
                    <TextInput placeholder='Contraseña'
                    secureTextEntry={!showPassword} style={{paddingHorizontal:15}}
                    onChangeText={(text)=>setPassword(text)} />

                    <TouchableOpacity  onPress={toggleShowPassword} style={styles.Icon}>
                        <Icon name={showPassword ? 'eye-slash' : 'eye'}
                        size={20}
                        color= "#000"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.PadreBoton}>
                    <TouchableOpacity style={styles.cajaBoton} onPress={logueo}>
                        <Text style={styles.TextoBoton }>Ingresar</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.RegistrarseBoton}>
                <TouchableOpacity style={styles.CajaBotonRegistrase} onPress={handleRegister}>
                        <Text style={styles.TextoBoton }>Registrarse</Text>
                </TouchableOpacity>
                </View>
                <View>
                  <Text style={{ marginTop: 20 }}>
                          ¿Olvidaste tu contraseña?{' '}
                          <Text 
                            style={{ color: 'blue' }} 
                            onPress={() => navigation.navigate('RecuperarPass')}
                          >
                            Recuperala!
                          </Text>
                        </Text>
                </View>
           </View>
      </View>
    )
}


      

const styles = StyleSheet.create({
      padre:
          {
            flex: 1,
            backgroundColor: 'black',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 100,
            paddingBottom: 100,
          },


      profile: {
        width: 275,
        height: 275,
        resizeMode: 'contain',
        borderRadius: 50,
        marginTop: -75,
        marginBottom: 1,
        borderColor: 'white',
      },

      tarjeta: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        width: '90%',
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      cajaTexto: {
        paddingVertical: 15,
        backgroundColor: '#cccccc40',
        borderRadius: 30,
        marginVertical: 10,
        marginBottom: 10,
      },
      cajaContrasena: {
        paddingVertical: 15,
        backgroundColor: '#cccccc40',
        borderRadius: 30,
        marginVertical: 10,
        marginBottom: 10,
      },
      PadreBoton: {
        alignItems: 'center',
      
      },
      cajaBoton: {
        backgroundColor : 'black',
        borderRadius : 30,
        paddingVertical: 20,
        marginBottom: 10,
        width: 150,
      },

      TextoBoton: {
        color: 'white',
        textAlign: 'center',
      },

      cajaTextoTitulo: {
        fontSize: 20,
    fontStyle: 'italic',
    color: 'white', // Naranja
      },
      Icon: {
        position: 'absolute', // Posiciona el ícono de manera absoluta
    right: 20, // Ajusta la posición horizontal
    top: '50%', // Centra verticalmente
    transform: [{ translateY: 3 }], // Ajusta la posición vertical
      },

      CajaBotonRegistrase: {
        backgroundColor : 'black',
        borderRadius : 30,
        paddingVertical: 20,
        marginBottom: 10,
        width: 150,
        alignItems: 'center',
      
      },

      RegistrarseBoton: {
        alignItems: 'center',
      },


 
})