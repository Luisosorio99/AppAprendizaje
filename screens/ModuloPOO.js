import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ImageViewing from 'react-native-image-viewing';
import { Image as RNImage } from 'react-native-animatable';
import { Image } from 'react-native'; 
import { LinearGradient } from 'expo-linear-gradient';
import { getFirestore, doc, updateDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore();
const auth = getAuth();

const preguntasPOO = [
  
  {
    id: 1,
    pregunta: '¿Qué es una clase en POO?',
    opciones: ['Una función', 'Una plantilla para objetos', 'Una constante'],
    respuestaCorrecta: 'Una plantilla para objetos',
  },
  {
    id: 2,
    pregunta: '¿Qué palabra clave se usa para crear una instancia de clase?',
    opciones: ['this', 'instance', 'new'],
    respuestaCorrecta: 'new',
  },
  {
    id: 3,
    pregunta: '¿Qué representa un objeto en POO?',
    opciones: ['Una variable', 'Una instancia de clase', 'Un tipo de dato'],
    respuestaCorrecta: 'Una instancia de clase',
  },
  {
    id: 4,
    pregunta: '¿Qué es un método?',
    opciones: ['Una propiedad', 'Una función dentro de una clase', 'Un operador'],
    respuestaCorrecta: 'Una función dentro de una clase',
  },
  {
    id: 5,
    pregunta: '¿Qué es la herencia?',
    opciones: ['Reutilizar código de otra clase', 'Copiar métodos', 'Duplicar objetos'],
    respuestaCorrecta: 'Reutilizar código de otra clase',
  },
  {
    id: 6,
    pregunta: '¿Qué palabra clave se usa para heredar una clase?',
    opciones: ['extends', 'inherits', 'base'],
    respuestaCorrecta: 'extends',
  },
  {
    id: 7,
    pregunta: '¿Qué es el encapsulamiento?',
    opciones: ['Ocultar datos internos', 'Mostrar métodos', 'Compartir clases'],
    respuestaCorrecta: 'Ocultar datos internos',
  },
  {
    id: 8,
    pregunta: '¿Qué es el polimorfismo?',
    opciones: ['Reutilizar funciones', 'Múltiples formas de un método', 'Modificar clases'],
    respuestaCorrecta: 'Múltiples formas de un método',
  },
  {
    id: 9,
    pregunta: '¿Qué palabra se usa para definir una clase en JavaScript?',
    opciones: ['object', 'function', 'class'],
    respuestaCorrecta: 'class',
  },
  {
    id: 10,
    pregunta: '¿Qué es un constructor?',
    opciones: ['Una clase padre', 'Un método especial que se ejecuta al crear un objeto', 'Un tipo de operador'],
    respuestaCorrecta: 'Un método especial que se ejecuta al crear un objeto',
  }
];

export default function ModuloPOO({ navigation }) {
  const [indice, setIndice] = useState(0);
  const [puntos, setPuntos] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [terminado, setTerminado] = useState(false);
  const [empezar, setEmpezar] = useState(false);
  const preguntaActual = preguntasPOO[indice];

  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [visible, setIsVisible] = useState(false);

  const abrirImagen = (requireImage) => {
    const source = Image.resolveAssetSource(requireImage);
    setImagenSeleccionada([{ uri: source.uri }]);
    setIsVisible(true);
  };
  
  const verificarRespuesta = (opcion) => {
    setRespuestaSeleccionada(opcion);
    if (opcion === preguntaActual.respuestaCorrecta) {
      setPuntos(puntos + 1);
    }
    setTimeout(() => {
      if (indice + 1 < preguntasPOO.length) {
        setIndice(indice + 1);
        setRespuestaSeleccionada(null);
      } else {
        setTerminado(true);

        const user = auth.currentUser;
      if (user) {
      const userRef = doc(db, "usuarios", user.uid);
       setDoc(userRef, {
      progresoModuloPOO: (puntos / preguntasPOO.length) * 100,
      fechaUltimoIntentoPOO: new Date()
      }, { merge: true });
}

      }
    }, 1000);
  };

  const reiniciar = () => {
    setIndice(0);
    setPuntos(0);
    setRespuestaSeleccionada(null);
    setTerminado(false);
    setEmpezar(false);
  };
  

  return (
    <LinearGradient
      colors={['#f3e5f5', '#ffffff']}
      style={styles.gradient}
    >
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🧠 Módulo: Programación Orientada a Objetos</Text>

      {!empezar ? (
        <View>
          <Text style={styles.explicacion}>Una clase en POO es una plantilla de objetos que permite estructurar el código para facilitar su reutilización y mantenimiento. Define propiedades y comportamientos comunes para sus objetos.</Text>
          <Text style={styles.TextoEjemplo}> ✅ Aquí tienes un ejemplo visual de lo que es una Clase:{"\n"}</Text>
          <TouchableOpacity onPress={() => abrirImagen(require('../assets/EjemploPOO.png'))}>
            <Image source={require('../assets/EjemploPOO.png')} style={styles.imageicon}/>
          </TouchableOpacity>

          <ImageViewing
            images={imagenSeleccionada || []}
            imageIndex={0}
            visible={visible}
            onRequestClose={() => setIsVisible(false)}
          />

          

          <Text style={styles.explicacion}>Una instancia es un objeto creado a partir de una clase. La palabra clave <Text style={styles.bold}>new</Text> se utiliza para instanciar o definir.</Text>
          <Text style={styles.TextoEjemplo}> ✅ Aquí tienes un ejemplo visual de una instancia, en este caso la instancia Galleta:</Text>
          <TouchableOpacity onPress={() => abrirImagen(require('../assets/EjemploInstancia.png'))}>
          
            <Image source={require('../assets/EjemploInstancia.png')} style={styles.imageicon}/>
          
          </TouchableOpacity>



          <Text style={styles.explicacion}>Los objetos representan entidades del mundo real y son instancias concretas de clases, con sus propios valores y comportamientos.</Text>
          <Text style={styles.TextoEjemplo}>✅ Aquí tienes un ejemplo visual de un obejto dentro de una clase:{"\n"}
            {"\n"}
            {"\n"}
          </Text>
          <TouchableOpacity onPress={() => abrirImagen(require('../assets/EjemploObjeto.jpg'))}>
          
            <Image source={require('../assets/EjemploObjeto.jpg')} style={styles.imageicon}/>
          
          </TouchableOpacity>
          


          <Text style={styles.explicacion}>Un método es una función definida dentro de una clase, que describe una acción que los objetos pueden ejecutar.</Text>
          <Text style={styles.TextoEjemplo}>✅ Aquí tienes un ejemplo visual de que son lo metodos: </Text>
          <TouchableOpacity onPress={() => abrirImagen(require('../assets/EjemploMetodo.png'))}>
          <View>
            <Image source={require('../assets/EjemploMetodo.png')} style={styles.imageiconGrande}/>
          </View>
          </TouchableOpacity>


          <Text style={styles.explicacion}>La herencia permite a una clase adquirir atributos y métodos de otra. Es clave para reutilizar código.</Text>
          <Text style={styles.TextoEjemplo}>✅ Aquí tienes un ejemplo visual de como funciona la Herencia: {"\n"}</Text>
          <TouchableOpacity onPress={() => abrirImagen(require('../assets/EjemploHerencia.jpg'))}>
          <View>
            <Image source={require('../assets/EjemploHerencia.jpg')} style={styles.imageiconPequeno}/>
          </View>
          </TouchableOpacity>


          <Text style={styles.explicacion}>Se utiliza <Text style={styles.bold}>extends</Text> para indicar que una clase hereda de otra.</Text>
          <Text style={styles.TextoEjemplo}>✅ Aquí tienes un ejemplo en codigo de como se usa la palabra <Text style={styles.bold}>extends</Text></Text>
          <TouchableOpacity onPress={() => abrirImagen(require('../assets/EjemploExtends.jpg'))}>
          <View>
            <Image source={require('../assets/EjemploExtends.jpg')} style={styles.imageiconPequeno}/>
          </View>
          </TouchableOpacity>

          <Text style={styles.explicacion}>El encapsulamiento consiste en ocultar los detalles internos de una clase y exponer solo lo necesario mediante métodos públicos.</Text>
          <Text style={styles.TextoEjemplo}>✅ Aquí un ejemplo visual de el encapsulamiento: </Text>
          <TouchableOpacity onPress={() => abrirImagen(require('../assets/EjemploEncapsulamiento.png'))}>
          <View>
            <Image source={require('../assets/EjemploEncapsulamiento.png')} style={styles.imageiconGrande}/>
          </View>
          </TouchableOpacity>

          <Text style={styles.explicacion}>El polimorfismo permite que un mismo método actúe de diferentes formas dependiendo del contexto o tipo de objeto.</Text>
          <Text style={styles.TextoEjemplo}>✅ Aquí un ejemplo visual de como funciona el polimorfismo: </Text>
          <TouchableOpacity onPress={() => abrirImagen(require('../assets/EjemploPolimorfismo.png'))}>
          <View>
            <Image source={require('../assets/EjemploPolimorfismo.png')} style={styles.imageiconPequeno}/>
          </View>
          </TouchableOpacity>

          <Text style={styles.explicacion}>En JavaScript se usa <Text style={styles.bold}>class</Text> para definir clases.</Text>
          <Text style={styles.TextoEjemplo}> ✅ Ejemplo: class Coche</Text>
          <TouchableOpacity onPress={() => abrirImagen(require('../assets/EjemploClass.png'))}>
          <View>
            <Image source={require('../assets/EjemploClass.png')} style={styles.imageiconPequeno}/>
          </View>
          </TouchableOpacity>

          <Text style={styles.explicacion}>Un constructor es un método especial que se ejecuta automáticamente al crear un objeto, y sirve para inicializar sus propiedades.</Text>
          <Text style={styles.TextoEjemplo}>✅ Aquí un ejemplo visual de lo que es un <Text style={styles.bold}>"constructor"</Text></Text>
          <TouchableOpacity onPress={() => abrirImagen(require('../assets/EjemploConstructor.jpg'))}>
          <View>
            <Image source={require('../assets/EjemploConstructor.jpg')} style={styles.imageiconPequeno}/>
          </View>
          </TouchableOpacity>

          <View>
            
            <Text style={styles.textoNegrita}>¿LISTO PARA LA PRACTICA?</Text>
            <Text style={styles.textoNegrita}>👇👇👇</Text>
          </View>

          <TouchableOpacity style={styles.botonEmpezar} onPress={() => setEmpezar(true)}>
            <Text style={styles.botonTexto}>Empezar</Text>
          </TouchableOpacity>
        </View>
      ) : terminado ? (
        <View style={styles.resultadoContainer}>
          <Text style={styles.resultado}>Puntaje final: {puntos} / {preguntasPOO.length}</Text>
          <TouchableOpacity style={styles.boton} onPress={reiniciar}>
            <Ionicons name="refresh" size={24} color="#fff" />
            <Text style={styles.botonTexto}>Reintentar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.boton, { backgroundColor: '#4caf50' }]} onPress={() => navigation.navigate('Progreso')}>
            <Ionicons name="bar-chart" size={24} color="#fff" />
            <Text style={styles.botonTexto}>Ver Progreso</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.preguntaContainer}>
          <Text style={styles.pregunta}>{preguntaActual.pregunta}</Text>
          {preguntaActual.opciones.map((op, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.opcion,
                respuestaSeleccionada === op && (op === preguntaActual.respuestaCorrecta
                  ? styles.correcta
                  : styles.incorrecta),
              ]}
              onPress={() => verificarRespuesta(op)}
              disabled={respuestaSeleccionada !== null}
            >
              <Text style={styles.opcionTexto}>{op}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#4a148c',
  },
  explicacion: {
    fontSize: 20,
    marginBottom: 10,
    color: '#333',
  },
  subtitulo: {
    fontStyle: 'italic',
    marginBottom: 15,
    color: '#666'
  },
  bold: {
    fontWeight: 'bold'
  },
  preguntaContainer: {
    marginVertical: 20,
  },
  pregunta: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  opcion: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 10,
    marginVertical: 6,
  },
  opcionTexto: {
    fontSize: 16,
    color: '#333',
  },
  correcta: {
    backgroundColor: '#a5d6a7',
  },
  incorrecta: {
    backgroundColor: '#ef9a9a',
  },
  resultadoContainer: {
    alignItems: 'center',
  },
  resultado: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  boton: {
    backgroundColor: '#6200ea',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  botonEmpezar: {
    backgroundColor: '#6200ea',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imageicon: {
    width: 275,
    height: 275,
    resizeMode: 'contain',
    borderRadius: 50,
    marginTop: -50,
    marginBottom: 1,
    borderColor: 'white',
  },
  TextoEjemplo: {
    fontWeight: 'bold',     // Negrita
    fontSize: 18,           // Tamaño de fuente
    color: '#333',
  },
  imageiconGrande: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    borderRadius: 50,
    marginTop: -80,
    marginBottom: -75,
    borderColor: 'white',
  },
  imageiconPequeno: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    borderRadius: 20,
    marginTop: 1,
    marginBottom: 20,
    borderColor: 'white',
    borderRadius: 30,
  },
  textoNegrita: {
    fontWeight: 'bold',     // Negrita
    fontSize: 20,           // Tamaño de fuente
    color: '#333',
    textAlign: 'center',
  },

  gradient: {
  flex: 1,
  },


});
