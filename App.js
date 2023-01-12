import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Platform,
  PermissionsAndroid,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import {selectContactPhone} from 'react-native-select-contact';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const [contactSelected, setContactSelected] = useState({
    name: '',
    phone: '',
  });

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const getPhoneNumber = async () => {
    // on android we need to explicitly request for contacts permission and make sure it's granted
    // before calling API methods
    if (Platform.OS === 'android') {
      const request = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      );

      // denied permission
      if (request === PermissionsAndroid.RESULTS.DENIED) {
        throw Error('Permission Denied');
      }
      // user chose 'deny, don't ask again'
      else if (request === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        throw Error('Permission Denied');
      }
    }

    // Here we are sure permission is granted for android or that platform is not android
    const selection = await selectContactPhone();
    if (!selection) {
      return null;
    }

    let {contact, selectedPhone} = selection;
    console.log(
      `Selected ${selectedPhone.type} phone number ${selectedPhone.number} from ${contact.name}`,
    );
    setContactSelected(oldState => ({
      ...oldState,
      name: contact.name,
      phone: selectedPhone.number,
    }));
  };

  console.log('Contact', contactSelected);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={getPhoneNumber}>
          <Text style={styles.buttonText}>Abrir contatos</Text>
        </TouchableOpacity>
        {contactSelected.phone && (
          <>
            <Text>{contactSelected.name}</Text>
            <Text>{contactSelected.phone}</Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#000',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
