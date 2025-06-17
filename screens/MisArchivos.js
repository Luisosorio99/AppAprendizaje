import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import appFirebase from '../credenciales';

const archivosEjemplo = [
    { id: '1', nombre: 'Guía de estudio - Matemática', tipo: 'pdf' },
    { id: '2', nombre: 'Presentación Historia', tipo: 'ppt' },
    { id: '3', nombre: 'Resumen Filosofía', tipo: 'doc' },
    { id: '4', nombre: 'Tarea Programación', tipo: 'zip' },
  ];
  
  export default function MisArchivos() {
    const navigation = useNavigation();

    useFocusEffect(
          useCallback(() => {
            const onBackPress = () => true;
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
          }, [])
        ); 

    const renderItem = ({ item }) => (
      <View style={styles.itemContainer}>
        <Ionicons name="document-text-outline" size={24} color="#6a1b9a" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.fileName}>{item.nombre}</Text>
          <Text style={styles.fileType}>{item.tipo.toUpperCase()}</Text>
        </View>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>Ver</Text>
        </TouchableOpacity>

        
       </View>

     

    );
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Mis Archivos</Text>
        <FlatList
          data={archivosEjemplo}
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
                  <Ionicons name="folder" size={24} color="#800080" />
                  <Text style={styles.footerText}>Mis Archivos</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Notificaciones')} style={styles.footerItem}>
                  <Ionicons name="notifications" size={24} color="#666" />
                  <Text style={styles.footerText}>Notificaciones</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Perfil')} style={styles.footerItem}>
                  <Ionicons name="person" size={24} color="gray" />
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
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 20,
      alignSelf: 'center',
    },
    itemContainer: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 15,
      marginBottom: 12,
      alignItems: 'center',
      elevation: 2,
    },
    icon: {
      marginRight: 10,
    },
    textContainer: {
      flex: 1,
    },
    fileName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    fileType: {
      fontSize: 12,
      color: '#888',
    },
    viewButton: {
      backgroundColor: '#6a1b9a',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
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
    footerItems: {
        alignItems: 'center',
    },
    viewButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: 'bold',
    },
  });
  
