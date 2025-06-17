import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const Progreso = () => {
  const [progreso, setProgreso] = useState(null);

  useEffect(() => {
    const fetchProgreso = async () => {
      const auth = getAuth();
      const db = getFirestore();
      const user = auth.currentUser;

      if (user) {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProgreso(data.progresoModuloPOO);
        }
      }
    };

    fetchProgreso();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📈 Progreso de Módulo POO</Text>
        {typeof progreso === 'number' ? (
      <Text style={styles.valor}>✅ Has completado {progreso.toFixed(1)}%</Text>
      ) : (
      <Text style={styles.valor}>No hay progreso registrado aún</Text>
      )}
       : (
        <Text>Cargando progreso...</Text>
      )
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f9f9ff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4a148c',
    marginBottom: 10,
    textAlign: 'center',
  },
  valor: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
});

export default Progreso;
