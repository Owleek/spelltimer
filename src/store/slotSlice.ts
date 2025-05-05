import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit';
import data, {ITimerData} from '../data/data';
import { setHotkey } from './hotkeySlice';
import { getPositionHotkey, setPositionHotkey } from '../user_cache/keys';

export interface IEmptySlot {
    position: number
    boundKey: string
}

export type ISlot = ITimerData | IEmptySlot;

const initialSlotList: Array<ISlot> = Array.from({length: 6}, (item, idx) => ({position: idx + 1, boundKey: getPositionHotkey(idx + 1)}));

function removeSlot(state: Array<ISlot>, action: PayloadAction<ISlot>, index: number) {
    state[index] = { position: state[index].position, boundKey: state[index].boundKey };
}

function mapData(state: Array<ISlot>, action: PayloadAction<ITimerData>, matchFoundIndex: number) {
    const destinationIndex = state.findIndex(slot => slot.position === action.payload.position);
    if (destinationIndex === -1) throw new Error('DestinationIndex not found');
    if (destinationIndex === matchFoundIndex) return;
    if (matchFoundIndex !== -1) removeSlot(state, action, matchFoundIndex);
    state[destinationIndex] = action.payload;
}

export const slotSlice = createSlice({
    name: 'actionSlotSlice',
    initialState: initialSlotList,
    reducers: {
        removeTimerFromSlot(state: Array<ISlot>, action: PayloadAction<ISlot>) {
            const idx = state.findIndex(slot => slot.position === action.payload.position);
            if (idx === -1) throw new Error('Slot index not found');
            removeSlot(state, action, idx);
        },
        resetState(state: Array<ISlot>, action: PayloadAction<null>) {
            return initialSlotList;
        },
        mapSpellToSlot(state: Array<ISlot>, action: PayloadAction<ITimerData>) {
            const {name, siblings} = action.payload;
            const matchFoundIndex = state.findIndex(slot => ('hero' in slot && 'name' in slot) ? (slot.name === name) || siblings?.some(el => el === slot.name) : false);
            mapData(state, action, matchFoundIndex);
        },
        mapItemToSlot(state: Array<ISlot>, action: PayloadAction<ITimerData>) {
            const matchFoundIndex = state.findIndex(slot => {
                if ('owner' in slot && 'name' in slot) return (slot.name === action.payload.name) && (slot.owner === action.payload.owner);
                return false;
            });

            mapData(state, action, matchFoundIndex);
        },
        mapFeatureToSlot(state: Array<ISlot>, action: PayloadAction<ITimerData>) {
            const matchFoundIndex = state.findIndex(slot => {
                if ('owner' in slot || 'hero' in slot) return false;
                if ('name' in slot) return slot.name === action.payload.name;
            });
            mapData(state, action, matchFoundIndex);
        },
        setActiveLevelIndex(state: Array<ISlot>, action: PayloadAction<{position: number, activeLevelIndex: number}>) {
            const matchFoundIndex = state.findIndex(slot => {
                return slot.position === action.payload.position;
            });

            const newData = {...state[matchFoundIndex], cooldownIndex: action.payload.activeLevelIndex};

            state[matchFoundIndex] = newData;
        },
        setCustomCooldown(state: Array<ISlot>, action: PayloadAction<{position: number, customCooldown: number | null}>) {
            const matchFoundIndex = state.findIndex(slot => {
                return slot.position === action.payload.position;
            });

            const newData = {...state[matchFoundIndex], customCooldown: action.payload.customCooldown};
            state[matchFoundIndex] = newData;
        },
        applyReducer(state: Array<ISlot>, action: PayloadAction<{position: number, name: string, percent: number}>) {
            const matchFoundIndex = state.findIndex(slot => {
                return slot.position === action.payload.position;
            });

            if ('reducers' in state[matchFoundIndex]) {
                state[matchFoundIndex].reducers?.push({name: action.payload.name, percent: action.payload.percent});
            }

            if ('cooldown' in state[matchFoundIndex]) {
                state[matchFoundIndex].cooldown = state[matchFoundIndex].cooldown.map(cd => Math.round(cd - ((cd / 100) * action.payload.percent)));
            }
        },
        removeReducer(state: Array<ISlot>, action: PayloadAction<{position: number, name: string}>) {
            const matchFoundIndex = state.findIndex(slot => {
                return slot.position === action.payload.position;
            });

            if ('reducers' in state[matchFoundIndex]) {
                const filteredReducers = state[matchFoundIndex].reducers?.filter(reducer => reducer.name !== action.payload.name);

                state[matchFoundIndex].reducers = filteredReducers;
                const computed = state[matchFoundIndex].initialCooldown.slice();

                filteredReducers?.forEach(reducer => {
                    computed.forEach((el, idx) => {
                        computed[idx] = Math.round(el - ((el / 100) * reducer.percent))
                    })
                });

                state[matchFoundIndex].cooldown = computed;
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setHotkey, (state, action) => {
            const matсhedRecord = state.findIndex(el => el.boundKey === action.payload.key);
            const targetRecord = state.findIndex(el => el.position === action.payload.id);

            if (matсhedRecord !== -1) {
                const value = '';
                state[matсhedRecord] = {...state[matсhedRecord], boundKey: value};
                setPositionHotkey(state[matсhedRecord].position, value);
            }

            if (action.payload.type !== 'slot') return;

            const value = action.payload.key;
            state[targetRecord] = {...state[targetRecord], boundKey: value};
            setPositionHotkey(state[targetRecord].position, value);
        });
      }
});

export const { removeTimerFromSlot, resetState, mapSpellToSlot, mapItemToSlot, mapFeatureToSlot, setActiveLevelIndex, setCustomCooldown, applyReducer, removeReducer } = slotSlice.actions;

export default slotSlice.reducer;