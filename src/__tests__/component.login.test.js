import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
//import { InputField, ReportField, LogField } from '../src/components/';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Login from '../screens/Login';
configure({ adapter: new Adapter() });

test('Login component', () => {
    let state = {
        loading: false,
        username: "",
        password: "",
        login: 0,   // 0: Not login, 1: Success, 2: Failed
        checked: false,
    };
    const wrapper = shallow(<Login {...state} />);

    const inputUsername = wrapper.find(TextInput).at(0);
    inputUsername.simulate('change', {target: {value: 'tomv'}});
    
    const inputPassword = wrapper.find(TextInput).at(1);
    inputPassword.simulate('change', {target: {value: '123456'}});

    const btnLogin = wrapper.find(Button).at(0);
    btnLogin.simulate('keypress', {key: 'Enter'});

    expect(wrapper.state('username')).toEqual('tomv');
});