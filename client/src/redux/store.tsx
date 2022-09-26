import { configureStore } from "@reduxjs/toolkit";
import eventReducer  from "./slices";

const store = configureStore({
    reducer: {
        event : eventReducer
    }
})

export default store;