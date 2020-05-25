/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Voice from '@react-native-community/voice';

class App extends React.Component {
  state = { state: 'none', listening: false, result: null }

  componentDidMount () {
    Voice.onSpeechStart = this.onSpeechStartHandler;
    Voice.onSpeechEnd = this.onSpeechEndHandler;
    Voice.onSpeechResults = this.onSpeechResultsHandler;
    const itvl = setInterval(async () => {
      const {listening} = this.state;
      console.log('Recognizing? ', listening, await Voice.isRecognizing())
      if (listening && !(await Voice.isRecognizing())) {
        await Voice.start('en-US');
      }
    }, 2000);
    this.setState({
      itvl
    });
  }

  componentWillUnmount () {
    clearInterval(this.state.itvl);
    Voice.removeAllListeners();
  }

  onSpeechStartHandler = () => {
    console.log('start speech...');
  };

  onSpeechEndHandler = async () => {
    console.log('End speech...');
  };

  onSpeechResultsHandler = data => {
    const {status} = this.state;
    console.log('data ::::', data);
    console.log('status ::::', {status})
    if (data.value[0] === 'down pat') {
      this.setState({status: 'waiting_command'});
    }
    if (status === 'waiting_command') {
      const commands = ['play', 'pause', 'stop', 'next'];
      if (commands.find(val => val === data.value[0])) {
        this.setState({status: 'command_found', result: data.value[0]});

        setTimeout(() => {
          this.setState({status: 'none'});
        }, 5000)
      }
    }
  };

  onStartButtonPress = async e => {
    const {listening} = this.state;
    if (!listening) {
      this.setState({listening: true});
      await Voice.start('en-US');
    } else {
      this.setState({status: 'none', listening: false});
      await Voice.stop();
    }
    console.log(!listening ? 'listening...' : 'not listening...');
  };

  render() {
    const {status, listening, result} = this.state;
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            {/* <Header /> */}
            {global.HermesInternal == null ? null : (
              <View style={styles.engine}>
                <Text style={styles.footer}>Engine: Hermes</Text>
              </View>
            )}
            <View style={styles.body}>
              {/* <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Step One</Text>
                <Text style={styles.sectionDescription}>
                  Edit <Text style={styles.highlight}>App.js</Text> to change this
                  screen and then come back to see your edits.
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>See Your Changes</Text>
                <Text style={styles.sectionDescription}>
                  <ReloadInstructions />
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Debug</Text>
                <Text style={styles.sectionDescription}>
                  <DebugInstructions />
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Learn More</Text>
                <Text style={styles.sectionDescription}>
                  Read the docs to discover what to do next:
                </Text>
              </View>
              <LearnMoreLinks /> */}
              <TouchableOpacity onPress={this.onStartButtonPress}>
                <Text style={styles.start}>
                  {!listening ? 'Start...' : 'Stop'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.txt}>Status: {listening ? 'Listening' : 'Stopped'}</Text>
              {listening && <View>
                <Text style={styles.txt}>Status: {status}</Text>
                {status === 'waiting_command' && <Text style={styles.txt}>Commands: play, next, stop, pause</Text>}
                {status === 'command_found' && <Text style={styles.txt}>Command: {result}</Text>}
              </View>}
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
};

const styles = StyleSheet.create({
  start: {
    fontSize: 25,
    padding: 20,
    width: Dimensions.get('window').width,
  },
  txt: {
    fontSize: 15,
    padding: 10,
    paddingLeft: 20,
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
    padding: 20,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
