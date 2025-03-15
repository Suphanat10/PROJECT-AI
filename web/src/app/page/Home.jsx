import React, { useState } from 'react';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, colors } from '@mui/material';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import { Chip, Divider } from '@mui/material';



const Home = () => {
  
 

  return (
    <div>
      <Typography variant="h4" sx={{ marginBottom: 2, color: '#689f38' }}>
        PROJECT INTELLIGENT SYSTEM
      </Typography>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
      จัดทำโดย  นาย ศุภณัฏฐ์ บำรุงนา รหัสนักศึกษา  6504062620060
      </Typography>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
      Model Machine Learning ที่ใช้ทำนายปริมาณการจราจร ในกรุงเทพมหานคร
      </Typography>
      <Divider sx={{ marginBottom: 2 }}>
    <Chip label="อธิบาย" size="small" />
  </Divider>
  <Typography variant="body2" sx={{ marginBottom: 2 }}>
  การพยากรณ์ปริมาณการจราจรโดยใช้ Support Vector Regression (SVR) พร้อม GridSearchCV เพื่อปรับค่าพารามิเตอร์ให้เหมาะสมที่สุด โมเดลใช้ Radial Basis Function (RBF) kernel เพื่อจับความสัมพันธ์ที่ไม่เป็นเชิงเส้นในข้อมูล โดยกำหนดค่าที่เหมาะสมของ C, gamma และ epsilon ผ่าน GridSearchCV กระบวนการเริ่มจากการโหลดและเตรียมข้อมูลจากไฟล์ CSV รวมถึงการลบคอลัมน์ที่ไม่จำเป็น, แปลงวันที่, เข้ารหัสข้อมูลถนน, และสร้างฟีเจอร์ใหม่ จากนั้นทำ Feature Scaling ด้วย MinMaxScaler และเพิ่ม Polynomial Features เพื่อเพิ่มความสามารถของโมเดล หลังจากฝึก SVR แล้ว ผลลัพธ์ถูกประเมินด้วย MAE, MSE, RMSE และ R² Score พร้อมแสดงผลเปรียบเทียบค่าจริงและค่าพยากรณ์ผ่านกราฟ
   </Typography>
   <Typography variant="h5" sx={{ marginBottom: 2 }}>
      Model Neural Network ที่พยากรณ์คุณภาพอากาศ 
      </Typography>
      <Divider sx={{ marginBottom: 2 }}>
    <Chip label="อธิบาย" size="small" />
  </Divider>
   <Typography variant="body2" sx={{ marginBottom: 2 }}>
   การพยากรณ์และจำแนกข้อมูลคุณภาพอากาศโดยใช้โมเดล Neural Network สำหรับการพยากรณ์ค่าตัวเลข (PM2.5) และการจำแนกประเภทคุณภาพอากาศ (Good, Moderate, Unhealthy)
   โดยเริ่มจากการโหลดข้อมูลจากไฟล์ CSV และทำความสะอาดข้อมูล เช่น การจัดการกับค่าที่หายไปและค่าผิดปกติ หลังจากนั้นจะทำการแปลงข้อมูลและสร้างฟีเจอร์ใหม่ จากนั้นใช้ StandardScaler เพื่อปรับขนาดข้อมูลและแปลงเป็น Tensor เพื่อใช้ในโมเดล Deep Learning สองประเภท ได้แก่ Regression และ Classification โดยใช้โมเดลที่ฝึกโดยการแบ่งข้อมูลเป็นชุดฝึกและชุดทดสอบ และประเมินผลลัพธ์ผ่านค่า MAE, MSE, R² และ Accuracy
   </Typography>

   <Typography variant="h5" sx={{ marginBottom: 2 }}>
      เครื่องมือที่ใช้ในการพัฒนา
      </Typography>
       {/* list */}
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
        1. Python 3.13.0 <br />
        2. Google Colab <br />
        3. FastAPI <br />
        4. React  vite + Material UI <br />
        6. AWS EC2 <br />
        </Typography>

    </div>
 
      


  );
};

export default Home;
