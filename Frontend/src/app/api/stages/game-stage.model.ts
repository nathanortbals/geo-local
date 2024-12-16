import { FinalResults } from './final-results.model';
import { Guessing } from './guessing.model';
import { Lobby } from './lobby.model';
import { RoundResults } from './round-results.model';

export type GameStage = Lobby | Guessing | RoundResults | FinalResults;
