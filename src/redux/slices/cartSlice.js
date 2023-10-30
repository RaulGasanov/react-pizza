import { createSlice } from '@reduxjs/toolkit';

const initialState = {
   totalPrice: 0,
   items: [],
};

const cartSlice = createSlice({
   name: 'cart',
   initialState,
   reducers: {
      addItem(state, { payload }) {
         const findItem = state.items.find((obj) => {
            return ((obj.id === payload.id) &&
               (obj.size === payload.size) &&
               (obj.type === payload.type))
         });

         if (findItem) {
            findItem.count++;
         } else {
            state.items.push({
               ...payload,
               count: 1,
            });
         }

         state.items = state.items.filter((obj) => obj.count > 0);

         state.totalPrice = state.items.reduce((acc, obj) => {
            return (obj.price * obj.count) + acc;
         }, 0);
      },
      plusItem(state, {payload}) {
         const findItem = state.items.find((obj) => {
            return ((obj.id === payload.id) &&
               (obj.size === payload.size) &&
               (obj.type === payload.type))
         });

         if (findItem) {
            findItem.count++;
         }

         state.items = state.items.filter((obj) => obj.count > 0);

         state.totalPrice = state.items.reduce((acc, obj) => {
            return (obj.price * obj.count) + acc;
         }, 0);
      },
      minusItem(state, { payload }) {
         const findItem = state.items.find((obj) => {
            return ((obj.id === payload.id) &&
               (obj.size === payload.size) &&
               (obj.type === payload.type))
         });

         if (findItem) {
            findItem.count--;
         }

         state.items = state.items.filter((obj) => obj.count > 0);

         state.totalPrice = state.items.reduce((acc, obj) => {
            return (obj.price * obj.count) + acc;
         }, 0);
      },
      removeItem(state, { payload }) {
         state.items = state.items.filter(obj => {
            if (obj.type === payload.type) {
               if (obj.size === payload.size) {
                  return false;
               }
            }
            return true;
         });

         state.items = state.items.filter((obj) => obj.count > 0);

         state.totalPrice = state.items.reduce((acc, obj) => {
            return (obj.price * obj.count) + acc;
         }, 0);
      },
      clearItems(state) {
         state.items = [];
         state.totalPrice = 0;
      },
   },
});

export const { addItem, removeItem, clearItems, minusItem, plusItem } = cartSlice.actions;

export default cartSlice.reducer;