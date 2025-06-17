import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import appFirebase from '../credenciales';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  '[expo-image-picker] `ImagePicker.MediaTypeOptions` have been deprecated.',
]);


const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);


const RegisterScreen = ({ navigation }) => {
  const [carnet, setCarnet] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [carrera, setCarrera] = useState('');
  const [telefono, setTelefono] = useState('');
  const [rol, setRol] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setImage(imageUri); // ✅ importante
      console.log('Imagen seleccionada:', imageUri);
    }
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      let photoURL = '';
  
      // Si se eligió una imagen, la subimos
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
  
        const storage = getStorage(appFirebase);
        const imageRef = ref(storage, `usuarios/${user.uid}/perfil.jpg`);
        
        await uploadBytes(imageRef, blob);
        photoURL = await getDownloadURL(imageRef);
      }
  
      // Guardamos los datos del usuario en Firestore
      await setDoc(doc(db, "usuarios", user.uid), {
        carnet,
        nombre,
        apellido,
        carrera,
        telefono,
        rol,
        correo: email,
        photoURL: photoURL || null,
        fechaRegistro: new Date()
      });
  
      Alert.alert('Registro exitoso');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error al registrar:', error);
      Alert.alert('Error', error.message || 'Ocurrió un error al registrar');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <TextInput placeholder="Número de Carnet" value={carnet} onChangeText={setCarnet} style={styles.input} />
      <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} style={styles.input} />
      <TextInput placeholder="Apellido" value={apellido} onChangeText={setApellido} style={styles.input} />
      <TextInput placeholder="Carrera" value={carrera} onChangeText={setCarrera} style={styles.input} />
      <TextInput placeholder="Número de teléfono" value={telefono} onChangeText={setTelefono} style={styles.input} keyboardType="phone-pad" />

      <Text style={styles.label}>Selecciona tu Rol</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={rol}
          onValueChange={(itemValue) => setRol(itemValue)}
        >
          <Picker.Item label="Selecciona un rol..." value="" />
          <Picker.Item label="Estudiante" value="estudiante" />
          <Picker.Item label="Docente" value="docente" />
          <Picker.Item label="Administrador" value="admin" />
        </Picker>
      </View>

      <TextInput placeholder="Correo electrónico" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
      <TextInput placeholder="Contraseña" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <TextInput placeholder="Confirmar Contraseña" value={confirmPassword} onChangeText={setConfirmPassword} style={styles.input} secureTextEntry />
      
      <TouchableOpacity
      onPress={pickImage}
      style={styles.uploadButton}
      >
      <Text style={styles.uploadButtonText}>Subir Foto</Text>
      </TouchableOpacity>

      {image && (
      <Image
      source={{ uri: image }}
      style={styles.previewImage}
      />
  )}
     

      <Button title="Registrarse" onPress={handleRegister} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    marginBottom: 15,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
    marginBottom: 15,
  },

  uploadButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
  previewImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
    alignSelf: 'center',
  },

});

export default RegisterScreen;
