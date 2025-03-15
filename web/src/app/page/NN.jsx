import React, { useState } from 'react';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Typography from '@mui/material/Typography';

const NNForm = () => {
  const [inputs, setInputs] = useState({
    PM10: '',
    CO: '',
    NO2: '',
    O3: '',
    SO2: '',
    Temperature: '',
    Humidity: '',
    Province: '', // Default empty value for Province
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Process the form submission
    console.log('Form Submitted with values:', inputs);
  };

 

  return (
    <div>
     <Typography variant="body2" sx={{ marginBottom: 2 }}>
         โมเดลการเรียนรู้ของเครื่อง (Machine Learning) ที่ใช้ในการคาดการณ์คุณภาพอากาศ จะใช้ข้อมูลเชิงตัวเลขเช่น ค่าฝุ่น PM10, คาร์บอนมอนอกไซด์ (CO), ไนโตรเจนไดออกไซด์ (NO2), โอโซน (O3), ก๊าซซัลเฟอร์ไดออกไซด์ (SO2), อุณหภูมิ และความชื้น เพื่อคาดการณ์คุณภาพอากาศในจังหวัดต่างๆของแคนาดา
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* PM10 Input */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="ค่าฝุ่น PM10"
              type="number"
              fullWidth
              name="PM10"
              value={inputs.PM10}
              onChange={handleChange}
              placeholder="20.20 (ค่าฝุ่น PM10 ในหน่วย µg/m³)"
            />
          </Grid>

          {/* CO Input */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="คาร์บอนมอนอกไซด์ (CO)"
              type="number"
              fullWidth
              name="CO"
              value={inputs.CO}
              onChange={handleChange}
              placeholder="0.5 (ค่า CO ในหน่วย ppm)"
            />
          </Grid>

          {/* NO2 Input */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="ไนโตรเจนไดออกไซด์ (NO2)"
              type="number"
              fullWidth
              name="NO2"
              value={inputs.NO2}
              onChange={handleChange}
              placeholder="0.5 (ค่า NO2 ในหน่วย ppm)"
            />
          </Grid>

          {/* O3 Input */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="โอโซน (O3)"
              type="number"
              fullWidth
              name="O3"
              value={inputs.O3}
              onChange={handleChange}
              placeholder="5.60 (ค่า O3 ในหน่วย ppm)"
            />
          </Grid>

          {/* SO2 Input */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="ก๊าซซัลเฟอร์ไดออกไซด์ (SO2)"
              type="number"
              fullWidth
              name="SO2"
              value={inputs.SO2}
              onChange={handleChange}
              placeholder="0.5 (ค่า SO2 ในหน่วย ppm)"
            />
          </Grid>

          {/* Temperature Input */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="อุณหภูมิ"
              type="number"
              fullWidth
              name="Temperature"
              value={inputs.Temperature}
              onChange={handleChange}
              placeholder="24.5 (อุณหภูมิในหน่วยเซลเซียส)"
            />
          </Grid>

          {/* Humidity Input */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="ความชื้น"
              type="number"
              fullWidth
              name="Humidity"
              value={inputs.Humidity}
              onChange={handleChange}
              placeholder="50 (ค่าความชื้นในหน่วย %)"
            />
          </Grid>

          {/* Province Dropdown */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>จังหวัด</InputLabel>
              <Select
                value={inputs.Province}
                onChange={handleChange}
                label="Province"
                name="Province"
              >
                <MenuItem value="">เลือกจังหวัด</MenuItem>
                <MenuItem value="0">กรุงเทพมหานคร</MenuItem>
                <MenuItem value="1">เชียงใหม่</MenuItem>
                <MenuItem value="3">ขอนเเก่น</MenuItem>
                <MenuItem value="4">ภูเก็ต</MenuItem>
                <MenuItem value="2">หาดใหญ่</MenuItem>
             
              </Select>
            </FormControl>
          </Grid>

        
          <Grid item xs={12}>
            <Button variant="contained" type="submit"  sx={12}    style={{backgroundColor: '#7cb342', color: 'white'}}>
              คาดการณ์คุณภาพอากาศ 
            </Button>
          </Grid>
        </Grid>

       
      </form>
    </div>
  );
};

export default NNForm;

