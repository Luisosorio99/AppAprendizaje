import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const notificacionesEjemplo = [
  { id: '1', titulo: 'Nueva clase disponible', descripcion: 'Revisa el nuevo contenido de Programación Avanzada.', leida: false },
  { id: '2', titulo: 'Recordatorio de entrega', descripcion: 'Entrega tu tarea de Historia antes del viernes.', leida: false },
  { id: '3', titulo: 'Mensaje del docente', descripcion: 'Revisa tus comentarios en la actividad de Matemática.', leida: true },
];

export default function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState(notificacionesEjemplo);
  const navigation = useNavigation();
  const marcarComoLeida = (id) => {
    const nuevas = notificaciones.map((n) =>
      n.id === id ? { ...n, leida: true } : n
    );
    setNotificaciones(nuevas);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.notification, item.leida && styles.notificationRead]}
      onPress={() => marcarComoLeida(item.id)}
    >
      <Ionicons name={item.leida ? 'notifications-outline' : 'notifications'} size={24} color={item.leida ? '#999' : '#6a1b9a'} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.titulo}>{item.titulo}</Text>
        <Text style={styles.descripcion}>{item.descripcion}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notificaciones</Text>
      <FlatList
        data={notificaciones}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <View style={styles.footerMenu}>
              <TouchableOpacity onPress={() => navigation.navigate('HomeEstudiante')} style={styles.footerItem}>
                <Ionicons name="home" size={24} color="gray" />
                <Text style={styles.footerText}>Inicio</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('MisArchivos')} style={styles.footerItem}>
                <Ionicons name="folder" size={24} color="#666" />
                <Text style={styles.footerText}>Mis Archivos</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.footerItem}>
                <Ionicons name="notifications" size={24} color="#800080" />
                <Text style={styles.footerText}>Notificaciones</Text>
              </TouchableOpacity> 

              <TouchableOpacity onPress={() => navigation.navigate('Perfil')} style={styles.footerItem}>
                <Ionicons name="person" size={24} color="#666" />
                <Text style={styles.footerText}>Perfil</Text>
              </TouchableOpacity>
      
            </View>




    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f5fb',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20,
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
  },
  notificationRead: {
    backgroundColor: '#eee',
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
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
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  descripcion: {
    fontSize: 14,
    color: '#555',
  },
});
