import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import appFirebase from '../credenciales';

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

export default function Perfil() {
  const navigation = useNavigation();
  const [usuario, setUsuario] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);


  useFocusEffect(
      useCallback(() => {
        const onBackPress = () => true;
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      }, [])
    );  

  useLayoutEffect(() => {
    navigation.setOptions({ headerLeft: () => null });
  }, [navigation]);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'usuarios', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUsuario(docSnap.data());
        }
      }
    };
    fetchUserData();
  }, []);

  const handleEditProfile = () => {
    toggleMenu();
    navigation.navigate('EditarPerfil');
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil del Usuario</Text>

      <View style={styles.card}>
        {usuario?.photoURL && (
          <Image source={{ uri: usuario.photoURL }} style={styles.profileImage} />
        )}
        <Text style={styles.name}>{usuario?.nombre} {usuario?.apellido}</Text>
        <Text style={styles.info}>Carnet: {usuario?.carnet}</Text>
        <Text style={styles.info}>Correo: {usuario?.correo}</Text>
        <Text style={styles.info}>Teléfono: {usuario?.telefono}</Text>
        <Text style={styles.info}>Carrera: {usuario?.carrera}</Text>
        <Text style={styles.info}>Rol: {usuario?.rol}</Text>
      </View>

      <TouchableOpacity onPress={handleEditProfile} style={styles.menuButton}>
        <Text style={styles.menuButtonText}> Editar perfil  ✏️</Text>
      </TouchableOpacity>

      <View style={styles.footerMenu}>
        <TouchableOpacity onPress={() => navigation.navigate('HomeEstudiante')} style={styles.footerItem}>
          <Ionicons name="home" size={24} color="gray" />
          <Text style={styles.footerText}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MisArchivos')} style={styles.footerItem}>
          <Ionicons name="folder" size={24} color="#666" />
          <Text style={styles.footerText}>Mis Archivos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Notificaciones')} style={styles.footerItem}>
          <Ionicons name="notifications" size={24} color="#666" />
          <Text style={styles.footerText}>Notificaciones</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <Ionicons name="person" size={24} color="#800080" />
          <Text style={styles.footerText}>Perfil</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f5fb',
    paddingBottom: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  info: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,

  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#6a1b9a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 10,
    alignItems: 'center'
  },
  menuButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footerMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerItem: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    marginTop: 4,
    
  },
});
