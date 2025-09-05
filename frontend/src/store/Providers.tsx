"use client";

import { Provider, useDispatch } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import { loadAuthFromStorage } from "./Slices/authSlice";

function LoadAuth() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadAuthFromStorage());
  }, [dispatch]);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <LoadAuth />
      {children}
    </Provider>
  );
}