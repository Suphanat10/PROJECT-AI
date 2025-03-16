import React, { useState } from 'react';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import Snackbar from "@mui/material/Snackbar";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import { colors } from "@mui/material";


const NNForm = () => {
  const [inputs, setInputs] = useState({
    PM10: '',
    CO: '',
    NO2: '',
    O3: '',
    SO2: '',
    Temperature: '',
    Humidity: '',
    Province: '', 
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [open , setOpen] = useState(false);
    const [predictionResult, setPredictionResult] = useState([]);
  
    const handleClose = () => {
      setOpenSnackbar(false);
    };
  

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const ClearData = () => {
    setInputs({
      PM10: '',
      CO: '',
      NO2: '',
      O3: '',
      SO2: '',
      Temperature: '',
      Humidity: '',
      Province: '',
    });
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputs);  
      
    if(!inputs.PM10 || !inputs.CO || !inputs.NO2 || !inputs.O3 || !inputs.SO2 || !inputs.Temperature || !inputs.Humidity || !inputs.Province) {
      setOpenSnackbar(true);
      return;
    }

    setOpen(true);
    const dataForAPI = {
      PM10: inputs.PM10,
      CO: inputs.CO,
      NO2: inputs.NO2,
      O3: inputs.O3,
      SO2: inputs.SO2,
      Temperature: inputs.Temperature,
      Humidity: inputs.Humidity,
      Province: inputs.Province,
    };


    fetch("http://13.236.44.252:3000/api/airquality", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataForAPI),
    })
      .then((response) => response.json())
      .then((data) => {
        setPredictionResult(data);
        setOpen(false);
      })
      .catch((error) => {
        setOpen(false);
        console.error("Error:", error);
      });

    ClearData();

  };

 
  return (
    <div>
     <Typography variant="body2" sx={{ marginBottom: 2 }}>
        โมเดลการทำนายคุณภาพอากาศ (Air Quality )
         โดยใช้ Neural Network สำหรับการพยากรณ์ค่าตัวเลข (PM2.5) และการจำแนกประเภทคุณภาพอากาศ (Good, Moderate, Unhealthy)

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
           <Snackbar
                  open={openSnackbar}
                  autoHideDuration={3000}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }} // ย้ายไปขวาบน
                  message={
                    <Typography sx={{ color: "white" }}>
                      ⚠ กรุณากรอกข้อมูลให้ครบถ้วน
                    </Typography>
                  }
                  sx={{
                    "& .MuiSnackbarContent-root": {
                      backgroundColor: "#f44336",
                      color: "white",
                      fontSize: "16px",
                    },
                  }}
                />

                   <Backdrop
                          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                          open={open}
                          handleClose={handleClose}
                        >
                          <CircularProgress color="inherit" />
                        </Backdrop>

      </form>
       {predictionResult?.Predicted_PM2_5 !== undefined && (
              <div>
                <Typography variant="h5" sx={{ marginTop: 2, marginBottom: 2 }}>
                  ผลการทำนาย
                </Typography>
      
                <Card variant="outlined" sx={{ maxWidth: 360 }}>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="body2">
                      ผลการทำนายคุณภาพอากาศ 
                    </Typography>
      
                    <Typography variant="body1">
                      ค่า PM2.5 ที่คาดการณ์:{" "}
                      <strong style={{ color: colors.red[600] }}>
                        {predictionResult.Predicted_PM2_5} µg/m³
                      </strong>{" "}
                      <br />
                      ระดับคุณภาพอากาศ:{" "}
                      <strong style={{ color: colors.green[700] }}>
                       {(predictionResult.Air_Quality_Category)} 
                      </strong>{" "}
                      <br />
                    </Typography>
                  </Box>
                  <Divider />
                </Card>
              </div>
            )}
    </div>
  );
};

export default NNForm;

