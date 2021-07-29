import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {AuthProvider} from '@context/auth/AuthContext';
import MatchesState from '@context/matches/MatchesState';
import MatchesClosedState from '@context/matchesClosed/MatchesClosedState';
import Router from './src/navigations/Router';
import RankingState from '@context/ranking/RankingState';
import PredictionsState from '@context/predictions/PredictionsState';
import BoardsState from '@context/boards/BoardsState';
// import {CommonProvider} from '@context/common/CommonContext';

const App = () => {
  return (
    <AuthProvider>
      <PredictionsState>
        <MatchesState>
          <MatchesClosedState>
          <BoardsState>
            <RankingState>
            <SafeAreaProvider>
              {/* <CommonProvider> */}
                <Router />
              {/* </CommonProvider> */}
              </SafeAreaProvider>
            </RankingState>
            </BoardsState>
          </MatchesClosedState>
        </MatchesState>
      </PredictionsState>
    </AuthProvider>
  );
};

export default App;
