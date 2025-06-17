import { Text, StyleSheet, View, TouchableOpacity, Image, TextInput, Modal, Pressable, BackHandler, FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import React, { useState, useEffect, useCallback } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import appFirebase from '../credenciales';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

export default function HomeEstudiante() {
  const navigation = useNavigation();
  const [usuario, setUsuario] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [modulos, setModulos] = useState([
    { id: '1', title: 'POO', icon: 'code-slash' },
    { id: '2', title: 'Funciones', icon: 'funnel' },
    { id: '3', title: 'Arrays', icon: 'grid' },
    { id: '4', title: 'Asíncrono', icon: 'time' },
    { id: '5', title: 'Promesas', icon: 'infinite' },
    { id: '6', title: 'Fetch/API', icon: 'cloud-download' }
  ]);
  
  const modulosFiltrados = modulos.filter(modulo =>
    modulo.title.toLowerCase().includes(busqueda.toLowerCase())
    
  );

  


  useEffect(() => {
    const fetchUsuario = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'usuarios', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setUsuario(docSnap.data());
      }
    };
    fetchUsuario();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true;
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const handleLogout = async () => {
    await signOut(auth);
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const toggleMenu = () => setMenuVisible(v => !v);

  const renderModulo = ({ item }) => (
    <Animatable.View animation="fadeInUp" duration={800} delay={100} style={styles.moduloCard}>
      <TouchableOpacity onPress={() => navigation.navigate('ModuloPOO', { ModuloPOO: item.title })}>
        <Ionicons name={item.icon} size={32} color="#6a1b9a" />
        <Text style={styles.moduloText}>{item.title}</Text>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    
    <LinearGradient colors={['#ece9ff', '#d1c4e9']} style={styles.container}>
      <View style={styles.headerRow}>
    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
      <Ionicons name="log-out-outline" size={24} color="#fff" />
    </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <View>
          <Text style={styles.hello}>Hola!</Text>
          <Text style={styles.name}>{usuario?.nombre || 'Usuario'}</Text>
          <Text style={styles.subtitle}>Vamos a comenzar con el Aprendizaje</Text>
        </View>
        <View style={styles.profileRight}>
          {usuario?.photoURL && <Image source={{ uri: usuario.photoURL }} style={styles.profileImage} />}
          <Text style={styles.carnet}>{usuario?.carnet}</Text>
        </View>
      </View>

      {/* Búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Buscar módulo"
          value={busqueda}
          onChangeText={setBusqueda}
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Módulos disponibles</Text>

      {modulosFiltrados.length === 0 ? (
        <View style={styles.noResultadosContainer}>
          <Text style={styles.noResultadosText}>🔍 No se encontraron módulos</Text>
        </View>
      ) : (
        <FlatList
          data={modulosFiltrados}
          keyExtractor={item => item.id}
          renderItem={renderModulo}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {/* Footer menu */}
      <View style={styles.footerMenu}>
        {[
          { icon: 'home', label: 'Inicio', screen: 'HomeEstudiante' },
          { icon: 'folder', label: 'Mis Archivos', screen: 'MisArchivos' },
          { icon: 'bar-chart', label: 'Progreso', screen: 'Progreso', highlight: true, },
          { icon: 'notifications', label: 'Notificaciones', screen: 'Notificaciones' },
          { icon: 'person', label: 'Perfil', screen: 'Perfil' }
        ].map((f, i) => (
          <TouchableOpacity key={i} style={styles.footerItem} onPress={() => navigation.navigate(f.screen)}>
            <Ionicons name={f.icon} size={28} color={f.label === 'Progreso' ? '#666' : (f.label === 'Inicio' ? '#800080' : '#666')}
            style={f.label === 'Progreso' ? { transform: [{ scale: 1.1 }] } : {}}/>
            <Text style={styles.footerText}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#f0f0f0',
  },
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  hello: {
    fontSize: 30, // más grande
    fontWeight: 'bold',
    color: '#000', // un morado oscuro elegante
    fontFamily: 'sans-serif-medium',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black', // Blanco para contraste con fondo
    fontFamily: 'sans-serif-medium',
    textShadowColor: '#000', // Sombra para que resalte
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    color: '#888',
    marginTop: 4,
  },
  profileRight: {
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 28,
    marginTop: -85,
  },
  carnet: {
    fontSize: 12,
    color: '#444',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#6a1b9a',
    padding: 8,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  moduloCard: {
    backgroundColor: '#fff',
    flex: 0.48,
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  moduloText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  noResultadosContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  noResultadosText: {
    fontSize: 16,
    color: '#888',
    fontStyle: 'italic',
  },
  footerMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  footerItem: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    marginTop: 4,
    color: '#333',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
    marginTop: -30,
  },
  
  logoutButton: {
    backgroundColor: '#6a1b9a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 30,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});
