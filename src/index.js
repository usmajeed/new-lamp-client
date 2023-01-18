import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import {compose, createStore, applyMiddleware} from 'redux'
import 'typeface-roboto'
import {Provider} from 'react-redux'
import rootReducer from './redux/reducers/rootReducer'
import {BrowserRouter} from 'react-router-dom'
import thunk from 'redux-thunk'

const composeEnhancers =
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        }) : compose

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>,
document.getElementById('root')
)
