import React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import ViewExpenses from './screens/ViewExpenses'
import AddEditExpenses from "./screens/AddEditExpense";

import  { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'

import expensesReducer from './store/expenses-reducer'
import { init } from './helpers/db'

init().then(() => {
}).catch(err => console.log("initialising bd failed: ",err))


const rootReducer = combineReducers({
    expenses: expensesReducer
})

const store = createStore(rootReducer, applyMiddleware(ReduxThunk))
import Colors from './constants/Colors'

export default function App() {

    const Stack = createStackNavigator()

    return (
        <Provider store={store}>
          <NavigationContainer>
              <Stack.Navigator screenOptions={{
                  headerStyle: {
                      backgroundColor: Colors.orange
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                      fontWeight: 'bold'
                  }
              }}>
                  <Stack.Screen
                      name="Home"
                      component={ViewExpenses}
                      options={{
                        title: 'JHUB Expenses'
                      }}/>
                  <Stack.Screen
                      name="AddExpenses"
                      component={AddEditExpenses}
                      options={{
                          title: 'Add an Expense'
                      }}
                  />
              </Stack.Navigator>
          </NavigationContainer>
        </Provider>
    );
}

