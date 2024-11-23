import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  phoneNumber: string;
  verificationId: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  phoneNumber: "",
  verificationId: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.phoneNumber = action.payload;
    },
    setVerificationId: (state, action: PayloadAction<string>) => {
      state.verificationId = action.payload;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { setPhoneNumber, setVerificationId, setAuthenticated } =
  authSlice.actions;
export default authSlice.reducer;
