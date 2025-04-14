import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "../redux/slices/authslice.js"

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import blogSliceReducer from "../redux/slices/blogslice.js"
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // Persist only user data
};

const rootReducer = combineReducers({
  user: authSliceReducer,
  blogs : blogSliceReducer
  
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
