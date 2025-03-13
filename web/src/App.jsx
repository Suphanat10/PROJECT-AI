// import React, { useState } from 'react';
// import './App.css';
// import HomPageLayout from './app/Components/HomPageLayout';
// import { createTheme, ThemeProvider } from '@mui/material/styles'; // นำเข้า createTheme และ ThemeProvider

// // สร้างธีม MUI ที่ใช้ฟอนต์ Kanit
// const theme = createTheme({
//   typography: {
//     fontFamily: '"Kanit", sans-serif',
    
//   },
// });

// function App() {

//   return (
//     <ThemeProvider theme={theme}>
//       <HomPageLayout />
//     </ThemeProvider>
//   );
// }

// export default App;


import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import HomPageLayout from './app/Components/HomPageLayout';

const theme = createTheme({
  typography: {
    fontFamily: '"Kanit", sans-serif', // ใช้ฟอนต์ Kanit
  },
  colorSchemes: { 
    light: true, 
    dark: true 
  },
  colorSchemeSelector: 'class',
  palette: {
    primary: {
      main: '#7cb342', // สีเขียว 7cb342
    },
    text: {
      primary: '#7cb342', // ใช้สีเขียวสำหรับข้อความหลัก
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <HomPageLayout />
    </ThemeProvider>
  );
}

export default App;

