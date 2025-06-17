import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import appFirebase from '../credenciales';

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);
const storage = getStorage(appFirebase);

export default function EditarPerfil({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [carnet, setCarnet] = useState('');
  const [rol, setRol] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;

  useEffect(() => {
    const fetchUsuario = async () => {
      if (user) {
        const docRef = doc(db, 'usuarios', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setNombre(data.nombre || '');
          setRol(data.rol || '');
          setImage(data.photoURL || null);
          setCarnet(data.carnet || null);
          setApellido(data.apellido || null);
        }
        setLoading(false);
      }
    };
    fetchUsuario();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    try {
      let photoURL = image;
      if (image && image.startsWith('file')) {
        const response = await fetch(image);
        const blob = await response.blob();
        const imageRef = ref(storage, `usuarios/${user.uid}/perfil.jpg`);
        await uploadBytes(imageRef, blob);
        photoURL = await getDownloadURL(imageRef);
      }

      await updateDoc(doc(db, 'usuarios', user.uid), {
        nombre,
        rol,
        photoURL,
        carnet,
        apellido,
      });

      Alert.alert('Perfil actualizado');
      navigation.goBack();
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      <TouchableOpacity onPress={pickImage} style={styles.buttonImage}>
        <Text style={styles.textImage}>Cambiar Foto</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={apellido}
        onChangeText={setApellido}
      />


      <TextInput
        style={styles.input}
        placeholder="Carnet"
        value={carnet}
        onChangeText={setCarnet}
      />



      <Button title="Guardar Cambios" onPress={handleUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    marginBottom: 15,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  buttonImage: {
    backgroundColor: '#4682B4',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  textImage: {
    color: '#fff',
    fontWeight: '600',
  },
});
