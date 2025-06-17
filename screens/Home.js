import { Text, StyleSheet, View, BackHandler, TouchableOpacity, Image, ActivityIndicator, Modal, Pressable } from 'react-native';
import { useFocusEffect, CommonActions } from '@react-navigation/native';
import React, { useLayoutEffect, useCallback, useState, useEffect } from 'react';
import appFirebase from '../credenciales';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

export default function Home({ navigation }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const fetchUsuario = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'usuarios', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUsuario(docSnap.data());
        }
      }
      setLoading(false);
    };
    fetchUsuario();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true;
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [])
  );

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }, [navigation]);

  const handleEditProfile = () => {
    navigation.navigate('EditarPerfil'); 
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
          <Text style={styles.logoutButton}>Salir</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleLogout]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleMenu}
      >
        <Pressable style={styles.modalOverlay} onPress={toggleMenu}>
          <View style={styles.menuModal}>
            <Text style={styles.menuItem}>📚 Cursos disponibles</Text>
            <Text style={styles.menuItem}>👥 Mis compañeros</Text>
            <Text style={styles.menuItem}>📊 Progreso</Text>
            <Text style={styles.menuItem}>🛠 Configuración</Text>
            <Text style={styles.menuItem}>📅 Calendario académico</Text>
            <Text style={styles.menuItem}>📥 Mensajes recibidos</Text>
            <Text style={styles.menuItem}>📤 Enviar sugerencia</Text>
            <Text style={styles.menuItem}>🧩 Actividades extracurriculares</Text>
            <Text style={styles.menuItem}>📎 Recursos descargables</Text>
            <Text style={styles.menuItem}>🔔 Notificaciones</Text>
            <Text style={styles.menuItem}>📞 Contactar soporte</Text>
          </View>
        </Pressable>
      </Modal>

      <View style={styles.menuWrapper}>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuButtonContainer}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        {usuario?.photoURL && (
          <Image source={{ uri: usuario.photoURL }} style={styles.image} />
        )}
        <View style={styles.infoContainer}>
          <Text style={styles.nombre}>{usuario?.nombre}</Text>
          <Text style={styles.info}>Carnet: {usuario?.carnet}</Text>
          <Text style={styles.rol}>{usuario?.rol}</Text>
        </View>
      </View>

      <Text style={styles.title}> 
        ¡Hola {usuario?.nombre || 'usuario'}! ¿Qué quieres aprender hoy?
      </Text>

      <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
        <Text style={styles.editText}>✏️ Editar perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  menuWrapper: {
    width: '110%',
    alignItems: 'flex-start',
    marginTop: -15, 
  },
  menuButtonContainer: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  menuIcon: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    marginTop: 30,
    textAlign: 'center',
    color: '#333',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    width: '100%',
  },
  infoContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  info: {
    fontSize: 16,
    color: '#555',
  },
  nombre: {
    fontSize: 22,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  rol: {
    fontSize: 18,
    color: '#666',
    marginBottom: 15,
    textTransform: 'capitalize',
  },
  logoutButton: {
    marginRight: 1,
    backgroundColor: '#ff4444',
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 4,
    elevation: 2,
    fontSize: 16,
    color: '#fff',
  },
  editButton: {
    marginTop: 20,
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  editText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  menuModal: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 60,
    marginLeft: 10,
    borderRadius: 10,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItem: {
    fontSize: 16,
    paddingVertical: 10,
    color: '#333',
  },
});
