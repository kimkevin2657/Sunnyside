import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';
import firebase from './middlewares/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import user from './reducers/user';
import explore from './reducers/explore';
import categories from './reducers/categories';
import popular from './reducers/popular';
import searchHistory from './reducers/searchHistory';
import bookmarks from './reducers/bookmarks';
import bookings from './reducers/bookings';
import config from './reducers/config';
import drawer from './reducers/drawer';

const reducer = combineReducers({
    user,
    explore,
    categories,
    popular,
    searchHistory,
    bookmarks,
    bookings,
    config,
    drawer,
});

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: [
        'user',
        'explore',
        'categories',
        'popular',
        'searchHistory',
        'bookmarks',
        'bookings',
        'config',
        'drawer',
    ],
    blacklist: [],
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistedReducer = persistReducer(persistConfig, reducer);
const store = createStore(
    persistedReducer,
    composeEnhancers(applyMiddleware(thunk, firebase)),
);
let persistor = persistStore(store);

export { persistor, store };
