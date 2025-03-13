import React, { useState } from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl, Button, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';

function SVRContent() {
  const [rainfall, setRainfall] = useState('');
  const [temperature, setTemperature] = useState('');
  const [roadEncoded, setRoadEncoded] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process form submission here (e.g., make a request or pass data to model)
    console.log({ rainfall, temperature, roadEncoded, date });
  };

  return (
    <div>
     
        <Typography variant="body2" sx={{ marginBottom: 2 }}>
               โมเดลการเรียนรู้ของเครื่อง (Machine Learning) ที่ใช้ในการคาดการณ์คุณภาพอากาศ จะใช้ข้อมูลเชิงตัวเลขเช่น ค่าฝุ่น PM10, คาร์บอนมอนอกไซด์ (CO), ไนโตรเจนไดออกไซด์ (NO2), โอโซน (O3), ก๊าซซัลเฟอร์ไดออกไซด์ (SO2), อุณหภูมิ และความชื้น เพื่อคาดการณ์คุณภาพอากาศในจังหวัดต่างๆของแคนาดา
            </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Rainfall input */}
          <Grid item xs={12} sm={6}>
            <TextField 
              label="ปริมาณน้ำฝน"
              type="number"
              fullWidth
              value={rainfall}
              onChange={(e) => setRainfall(e.target.value)}
              placeholder="15.5 (ปริมาณน้ำฝนในหน่วยมิลลิเมตร)"
            />
          </Grid>

          {/* Temperature input */}
          <Grid item xs={12} sm={6}>
            <TextField 
              label="อุณหภูมิ"
              type="number"
              fullWidth
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              placeholder="24.5 (อุณหภูมิในหน่วยเซลเซียส)"
            />
          </Grid>

          {/* Road Encoded drop-down */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>ถนน</InputLabel>
              <Select 
                value={roadEncoded} 
                onChange={(e) => setRoadEncoded(e.target.value)} 
                label="Road Encoded"
              >
                <MenuItem value="">Select Road Type</MenuItem>
                <MenuItem value="paved">Paved</MenuItem>
                <MenuItem value="unpaved">Unpaved</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Date input */}
          <Grid item xs={12} sm={6}>
            <TextField 
              label="Date"
              type="date"
              fullWidth
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button variant="contained" type="submit"  sx={12}    style={{backgroundColor: '#7cb342', color: 'white'}}>
               ทำนายการจราจร
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default SVRContent;


