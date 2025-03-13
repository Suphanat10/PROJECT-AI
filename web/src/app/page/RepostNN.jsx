
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { colors } from '@mui/material';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

const RepostNN = () => {
   const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div>
       <Typography variant="h5" sx={{ marginBottom: 2 }}>
       แนวทางการพัฒนาการพยากรณ์การจราจร (Traffic Forecasting) 
         </Typography>

         <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography component="span" sx={{ width: '33%', flexShrink: 0, color: '#689f38', fontWeight: 'bold' }}>
          การเตรียมข้อมูล (Data Preparation)
          </Typography>
          <Typography component="span" sx={{ color: 'text.secondary' }}>
          การเตรียมข้อมูลเป็นขั้นตอนสำคัญที่มีผลโดยตรงต่อประสิทธิภาพของโมเดลที่พัฒนา
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          1.1 การรวบรวมข้อมูล (Data Collection) <br />
          ข้อมูลที่ใช้ในการพัฒนาโมเดลได้มาจากแหล่งข้อมูล ประกอบไปด้วยตัวแปรต่าง ๆ ได้แก่: <br /> PM10, CO, NO2, O3, SO2 (มลพิษทางอากาศ)

Temperature, Humidity (ข้อมูลสภาพอากาศ)

Province, Date (ข้อมูลเชิงพื้นที่และเวลา)

PM2.5 (ค่าฝุ่นละอองขนาดเล็กที่ต้องการพยากรณ์)<br />
          1.2 การทำความสะอาดข้อมูล (Data Cleaning) <br />
            ข้อมูลที่ได้มาอาจมีความไม่สมบูรณ์ หรือมีข้อมูลที่หายไป จึงต้องทำการกรองข้อมูลที่ไม่เป็นไปตามเงื่อนไขออกไป โดย ลบข้อมูลที่มีค่า PM2.5 เป็นค่าว่าง แปลงข้อมูลจังหวัดให้เป็นค่าตัวเลข (Encoding) ใช้มาตรฐานค่าเฉลี่ยและส่วนเบี่ยงเบนมาตรฐาน (StandardScaler) เพื่อปรับค่าข้อมูลให้เหมาะสมกับการเรียนรู้ของโมเดล
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
         <Typography component="span" sx={{ width: '33%', flexShrink: 0, color: '#689f38', fontWeight: 'bold' }}>
         การเทรนโมเดล (Model Training)
          </Typography>
          <Typography component="span" sx={{ color: 'text.secondary' }}>
            การเทรนโมเดลเป็นขั้นตอนสำคัญที่มีผลโดยตรงต่อประสิทธิภาพของโมเดลที่พัฒนา
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
         โดยการเทรนโมเดลจะทำแบ่งข้อมูลเป็นชุด Train/Test (80:20) ใช้ PyTorch DataLoader เพื่อโหลดข้อมูลเป็น Batch ใช้ Adam Optimizer ปรับค่าพารามิเตอร์ของโมเดล
        ใช้ Epochs จำนวน 500 รอบ พร้อมการอัปเดตค่าถ่วงน้ำหนักโดยใช้ Gradient Descent แสดงค่า Loss ทุก Epoch เพื่อตรวจสอบการเรียนรู้ของโมเดล
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
         <Typography component="span" sx={{ width: '33%', flexShrink: 0, color: '#689f38', fontWeight: 'bold' }}>
          ทฤษฎีของอัลกอริทึมที่พัฒนา
          </Typography>
          <Typography component="span" sx={{ color: 'text.secondary' }}>
            อัลกอริทึมที่ใช้ในการพยากรณ์คุณภาพอากาศ
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          ใช้โครงข่ายประสาทเทียม (Neural Network) แบบ Fully Connected การพยากรณ์ค่า PM2.5 (Regression) ใช้โครงสร้างที่ประกอบด้วย <br />
          1.  Hidden Layers 4 ชั้นซ่อน  พร้อม ReLU Activation<br /> 2. Batch Normalization และ Dropout เพื่อลด Overfitting<br /> 3. ใช้ Mean Squared Error (MSE) เป็น Loss Function<br />
          การจำแนกคุณภาพอากาศ (Classification) ใช้โครงสร้างที่ประกอบด้วย <br />
          1. 3 ชั้นซ่อน พร้อม ReLU Activation<br />2.  Softmax Activation ที่ชั้นสุดท้าย<br /> 3. ใช้ CrossEntropyLoss เป็น Loss Function

          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
            <Typography component="span" sx={{ width: '33%', flexShrink: 0, color: '#689f38', fontWeight: 'bold' }}>
             สรุป (Summary)
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          แนวทางการพัฒนาโมเดลพยากรณ์คุณภาพอากาศประกอบด้วยการเตรียมข้อมูล การเลือกอัลกอริทึมที่เหมาะสม และการประเมินผลที่รัดกุม ซึ่งทำให้ได้โมเดลที่สามารถพยากรณ์ค่า PM2.5 ได้อย่างแม่นยำและจำแนกคุณภาพอากาศได้ดี เพื่อนำไปใช้ในงานด้านสิ่งแวดล้อมและสุขภาพต่อไป
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Typography variant="h5" sx={{ marginBottom: 2 , marginTop: 2 }}>
      การทดสอบและการประเมินผล (Model Evaluation)
         </Typography>

         <Card variant="outlined" sx={{ maxWidth: 360 }}>
  <Box sx={{ p: 2 }}>
    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography gutterBottom variant="h5" component="div">
        ผลการทดสอบ Evaluating Regression Model
      </Typography>
    </Stack>

    <Typography variant="body2" >
      ผลการทดสอบ Evaluating Regression Model คือ
    </Typography>

    <Typography variant="body1" >
      Test Loss (MSE): <strong style={{ color: colors.yellow[900] }}>0.0131</strong> <br />
      Mean Absolute Error: <strong style={{ color: colors.red[600] }}>0.0773</strong> <br />
      Mean Squared Error: <strong style={{ color: colors.red[600] }}>0.0134</strong> <br />
      R² Score: <strong style={{ color: colors.green[700] }}>0.9953</strong> <br />
    </Typography>
  </Box>
  <Divider />
</Card>

<Typography variant="h5" sx={{ marginBottom: 2 , marginTop: 2 }}>
       กราฟแสดงผลการพยากรณ์ค่า PM2.5
         </Typography>
        

      </div>
  );
};

export default RepostNN;