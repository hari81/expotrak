// https://medium.com/magnetis-backstage/react-native-e2e-testing-with-cavy-1f1d5be1d3be
import React from 'react';
import {Tester, TestHookStore} from 'cavy';
import MySpec from './MySpec';
import PropTypes from 'prop-types';

const testHookStore = new TestHookStore();

const TestableApp = ({children}) => (
  <Tester
    clearAsyncStorage
    specs={[MySpec]}
    store={testHookStore}
    waitTime={4000}
    startDelay={1000}
  >
    {children}
  </Tester>
);

TestableApp.propTypes = {
  children: PropTypes.node.isRequired
};

export default TestableApp;