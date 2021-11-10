import {createStackNavigator} from 'react-navigation-stack';
import HomeRoutes from './HomeRoutes';
import ModalSingleMap from '@components/ModalSingleMap';
import ModalResultMap from '@components/ModalResultMap';
import LockScreen from '../screens/lockSrceen'
const ModalRoutes = createStackNavigator(
  {
    HomeRoutes,
    ModalSingleMap,
    ModalResultMap,
    LockScreen,
  },
  {
    initialRouteName: 'HomeRoutes',
    mode: 'modal',
    headerMode: 'none',
  },
);

export default ModalRoutes;
