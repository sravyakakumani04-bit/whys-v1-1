// Central place for all navigator param types
import VoicePrintsScreen from '../screens/VoicePrints';
import type { JournalItem } from "../api/journals";
import ToDoEntryScreen from '../screens/ActionItemsEntry';
export type RootStackParamList = {
  Home: undefined;
  Journal: undefined;
  chat: undefined;
  Notes: undefined;
  RecordingDetail: { id: string };
  VoicePrints:undefined;
  Recording: undefined;
  JournalDetail: { item: JournalItem };
  SignIn: undefined;
  SignUp: undefined;
  
};
